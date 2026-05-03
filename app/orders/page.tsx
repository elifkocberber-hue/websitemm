'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface ReturnRequest {
  id: string;
  return_code: string;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string | null;
}

interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
  return_requests: ReturnRequest[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  shipped: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
};

const RETURNABLE_STATUSES = ['delivered', 'shipped', 'confirmed'];

export default function OrdersPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningOrderId, setReturningOrderId] = useState<string | null>(null);
  const [returnResult, setReturnResult] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/user/orders', {
        headers: { 'x-user-id': user.id },
      })
        .then(r => r.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setError('Siparişler yüklenemedi'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleReturnRequest = async (orderId: string) => {
    if (!user) return;
    setReturningOrderId(orderId);
    setError(null);
    try {
      const res = await fetch('/api/user/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        setReturnResult(prev => ({ ...prev, [orderId]: data.returnCode }));
        setOrders(prev => prev.map(o =>
          o.id === orderId
            ? {
                ...o,
                return_requests: [
                  ...o.return_requests,
                  { id: 'new', return_code: data.returnCode, status: 'pending', created_at: new Date().toISOString() },
                ],
              }
            : o
        ));
      } else {
        setError(data.error || 'İade talebi oluşturulamadı');
      }
    } catch {
      setError('Bir hata oluştu');
    } finally {
      setReturningOrderId(null);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="max-w-350 mx-auto px-6 md:px-10 py-20 text-center">
        <p className="text-earth">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12 md:py-20">
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-charcoal transition-colors">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">Siparişlerim</span>
      </div>

      <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-10">Siparişlerim</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="heading-serif text-xl text-charcoal mb-4">Henüz siparişiniz yok</p>
          <Link href="/ceramics" className="text-sm text-accent hover:text-charcoal transition-colors">
            Koleksiyona Göz At
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => {
            const existingReturn = order.return_requests?.[0];
            const canReturn = RETURNABLE_STATUSES.includes(order.status) && !existingReturn;

            return (
              <div key={order.id} className="border border-warm-gray rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-stone-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-earth tracking-wider uppercase mb-1">
                      {new Date(order.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-charcoal font-medium">
                      Sipariş #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="text-charcoal font-medium">{order.total_price.toFixed(2)} ₺</span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-stone-100">
                  {order.order_items.map(item => (
                    <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                      {item.image_url && (
                        <div className="relative w-14 h-14 flex-shrink-0 bg-stone-100">
                          <Image src={item.image_url} alt={item.product_name} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-charcoal font-medium truncate">{item.product_name}</p>
                        <p className="text-xs text-earth mt-0.5">{item.quantity} adet × {item.unit_price.toFixed(2)} ₺</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Return section */}
                <div className="px-6 py-4 border-t border-stone-100 bg-white">
                  {existingReturn ? (
                    <div className="text-sm">
                      <p className="text-earth mb-1">İade talebiniz oluşturuldu.</p>
                      <p className="text-charcoal">
                        İade Kodunuz: <span className="font-bold text-[#5C0A1A] tracking-wider">{existingReturn.return_code}</span>
                      </p>
                      <p className="text-xs text-earth mt-1">Kod, e-posta adresinize de gönderilmiştir.</p>
                    </div>
                  ) : canReturn ? (
                    <button
                      type="button"
                      onClick={() => handleReturnRequest(order.id)}
                      disabled={returningOrderId === order.id}
                      className="text-sm border border-charcoal/30 text-charcoal px-5 py-2 hover:bg-charcoal hover:text-bone transition-colors disabled:opacity-50"
                    >
                      {returningOrderId === order.id ? 'İşleniyor...' : 'İade Talebi Oluştur'}
                    </button>
                  ) : order.status === 'cancelled' ? null : (
                    <p className="text-xs text-earth">İade talebi oluşturmak için siparişinizin teslim edilmiş olması gerekmektedir.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
