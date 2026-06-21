'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

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
  tracking_number?: string | null;
  carrier?: string | null;
  order_items: OrderItem[];
  return_requests: ReturnRequest[];
}

const RETURNABLE_STATUSES = ['delivered', 'shipped', 'confirmed'];
// Kargoya verilmiş/teslim/iptal olmuş siparişler iptal edilemez
const NON_CANCELLABLE_STATUSES = ['shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const { user, loading: userLoading } = useUser();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningOrderId, setReturningOrderId] = useState<string | null>(null);
  const [returnResult, setReturnResult] = useState<Record<string, string>>({});
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dateLocale = language === 'tr' ? 'tr-TR' : 'en-US';
  const statusLabels: Record<string, string> = {
    pending: t.orders.status_pending,
    confirmed: t.orders.status_confirmed,
    shipped: t.orders.status_shipped,
    delivered: t.orders.status_delivered,
    cancelled: t.orders.status_cancelled,
  };

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/user/orders', { credentials: 'same-origin' })
        .then(r => r.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setError(t.orders.load_error))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleReturnRequest = async (orderId: string) => {
    if (!user) return;
    setReturningOrderId(orderId);
    setError(null);
    try {
      const res = await fetch('/api/user/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
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
        setError(data.error || t.orders.return_failed);
      }
    } catch {
      setError(t.orders.generic_error);
    } finally {
      setReturningOrderId(null);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!user) return;
    if (!window.confirm(t.orders.cancel_confirm)) return;
    setCancellingOrderId(orderId);
    setError(null);
    try {
      const res = await fetch('/api/user/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: 'cancelled' } : o)));
      } else {
        setError(data.error || t.orders.cancel_failed);
      }
    } catch {
      setError(t.orders.generic_error);
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="max-w-350 mx-auto px-6 md:px-10 py-20 text-center">
        <p className="text-earth">{t.orders.loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12 md:py-20">
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-charcoal transition-colors">{t.orders.breadcrumb_home}</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{t.orders.breadcrumb_orders}</span>
      </div>

      <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-10">{t.orders.title}</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="heading-serif text-xl text-charcoal mb-4">{t.orders.empty}</p>
          <Link href="/ceramics" className="text-sm text-accent hover:text-charcoal transition-colors">
            {t.orders.browse}
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
                      {new Date(order.created_at).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-charcoal font-medium">
                      {t.orders.order_label} #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {statusLabels[order.status] ?? order.status}
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
                        <p className="text-xs text-earth mt-0.5">{item.quantity} {t.orders.qty_unit} {item.unit_price.toFixed(2)} ₺</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kargo bilgileri */}
                {order.tracking_number && (
                  <div className="px-6 py-4 border-t border-stone-100 bg-blue-50/50">
                    <p className="text-xs text-earth uppercase tracking-wider mb-1">{t.orders.shipping_info}</p>
                    {order.carrier && (
                      <p className="text-sm text-charcoal"><span className="text-earth">{t.orders.carrier_label}</span> <span className="font-medium">{order.carrier}</span></p>
                    )}
                    <p className="text-sm text-charcoal mt-0.5">
                      <span className="text-earth">{t.orders.tracking_label}</span>{' '}
                      <span className="font-bold tracking-wider font-mono">{order.tracking_number}</span>
                    </p>
                    <p className="text-xs text-earth mt-1">
                      {order.carrier
                        ? `${t.orders.track_hint_carrier_1}${order.carrier}${t.orders.track_hint_carrier_2}`
                        : t.orders.track_hint_generic}
                    </p>
                  </div>
                )}

                {/* Return section */}
                <div className="px-6 py-4 border-t border-stone-100 bg-white">
                  {existingReturn ? (
                    <div className="text-sm">
                      <p className="text-earth mb-1">{t.orders.return_created}</p>
                      <p className="text-charcoal">
                        {t.orders.return_code_label} <span className="font-bold text-[#5C0A1A] tracking-wider">{existingReturn.return_code}</span>
                      </p>
                      <p className="text-xs text-earth mt-1">{t.orders.return_code_sent}</p>
                    </div>
                  ) : canReturn ? (
                    <button
                      type="button"
                      onClick={() => handleReturnRequest(order.id)}
                      disabled={returningOrderId === order.id}
                      className="text-sm border border-charcoal/30 text-charcoal px-5 py-2 hover:bg-charcoal hover:text-bone transition-colors disabled:opacity-50"
                    >
                      {returningOrderId === order.id ? t.orders.processing : t.orders.request_return}
                    </button>
                  ) : order.status === 'cancelled' ? null : (
                    <p className="text-xs text-earth">{t.orders.return_requires_delivery}</p>
                  )}
                </div>

                {/* Sipariş iptal */}
                <div className="px-6 py-4 border-t border-stone-100 bg-white">
                  {order.status === 'cancelled' ? (
                    <p className="text-xs text-earth">{t.orders.order_cancelled_note}</p>
                  ) : NON_CANCELLABLE_STATUSES.includes(order.status) ? (
                    <>
                      <button
                        type="button"
                        disabled
                        title={t.orders.cancel_disabled_title}
                        className="text-sm border border-charcoal/15 text-charcoal/40 px-5 py-2 cursor-not-allowed"
                      >
                        {t.orders.cancel_order}
                      </button>
                      <p className="text-xs text-earth mt-2">{t.orders.cancel_shipped_note}</p>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingOrderId === order.id}
                      className="text-sm border border-red-300 text-red-700 px-5 py-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors disabled:opacity-50"
                    >
                      {cancellingOrderId === order.id ? t.orders.cancelling : t.orders.cancel_order}
                    </button>
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
