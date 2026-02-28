'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  payment_id: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
  };
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrderDetail();
    }
  }, [isAuthenticated]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`);

      if (!response.ok) {
        throw new Error('Sipariş alınamadı');
      }

      const data = await response.json();
      setOrder(data.order);
      setNewStatus(data.order.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.status) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Durum güncellenemedi');
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Sipariş yükleniyor...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Sipariş bulunamadı</p>
          <Link href="/admin/dashboard" className="text-amber-600 hover:text-amber-700 font-medium">
            ← Dashboard'a Dön
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusTurk = (status: string) => {
    const statuses: Record<string, string> = {
      pending: 'Beklemede',
      confirmed: 'Onaylandı',
      shipped: 'Kargoya Çıktı',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
    };
    return statuses[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin/dashboard" className="text-amber-600 hover:text-amber-700 font-medium mb-4 inline-block">
            ← Dashboard'a Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Sipariş Detayları</h1>
          <p className="text-gray-600 mt-1">Sipariş No: #{order.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Order Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Status Update */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Durumu</h2>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durumu Değiştir
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="pending">Beklemede</option>
                    <option value="confirmed">Onaylandı</option>
                    <option value="shipped">Kargoya Çıktı</option>
                    <option value="delivered">Teslim Edildi</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === order.status}
                  className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  {updating ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Mevcut Durum:</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusTurk(order.status)}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Müşteri Bilgileri</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Ad Soyad</p>
                  <p className="font-medium text-gray-900">
                    {order.users.first_name} {order.users.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">E-posta</p>
                  <p className="font-medium text-gray-900">{order.users.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Müşteri Seit Tarihi</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.users.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kargo Adresi</h2>
              <p className="text-gray-900 font-medium">{order.shipping_address}</p>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Ürünleri</h2>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">₺{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="py-4 flex justify-between font-bold text-lg">
                  <span>Toplam</span>
                  <span className="text-amber-600">₺{order.total_price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Özet</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Sipariş Tarihi</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Son Güncelleme</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.updated_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ödeme ID</p>
                <p className="font-mono text-xs text-gray-900 break-all">
                  {order.payment_id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Tutar</p>
                <p className="text-2xl font-bold text-amber-600">
                  ₺{order.total_price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
