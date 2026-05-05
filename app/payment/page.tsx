'use client';

import { useCart } from '@/context/CeramicCartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateEventId } from '@/lib/pixel';

export default function PaymentPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Ödeme</h1>
          <p className="text-gray-600 mb-6">Ödeme yapmak için sepetinizin boş olmadığından emin olun.</p>
          <Link
            href="/ceramics"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Iyzico payment processing
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalPrice: totalPrice,
          items: items,
          customer: formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const orderId = data.orderId || 'ORD-' + Date.now();
        const date = new Date().toLocaleDateString('tr-TR');

        // Purchase event'i için snapshot sakla (thank-you sayfasında tetiklenir)
        sessionStorage.setItem('last_purchase', JSON.stringify({
          orderId,
          items: items.map(i => ({ id: i.id, quantity: i.quantity })),
          totalPrice,
          eventId: generateEventId(),
        }));

        clearCart();
        router.push(`/thank-you?orderId=${orderId}&date=${encodeURIComponent(date)}`);
      } else {
        // Hata nedenini belirle ve başarısız sayfasına yönlendir
        const errorReason = data.errorCode || 'timeout';
        router.push(`/payment-failed?reason=${errorReason}`);
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      router.push('/payment-failed?reason=network_error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="text-amber-600 hover:text-amber-800">Ana Sayfa</Link>
          <span className="mx-2">›</span>
          <Link href="/cart" className="text-amber-600 hover:text-amber-800">Sepet</Link>
          <span className="mx-2">›</span>
          <span>Ödeme</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Güvenli Ödeme</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kişisel Bilgiler</h2>
              
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Adınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyadı</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Soyadınız"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+90 555 123 4567"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Sokak ve bina adı"
                  />
                </div>

                {/* City & Postal */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Şehir"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Posta Kodu</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="34000"
                    />
                  </div>
                </div>

                {/* ═══════ KART BİLGİLERİ ═══════ */}
                <div className="border-t border-gray-200 pt-6 mt-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Kart Bilgileri</h2>

                  {/* Kart Üzerindeki İsim */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kart Üzerindeki İsim</label>
                    <input
                      type="text"
                      name="cardHolderName"
                      value={formData.cardHolderName}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="ADINIZ SOYADINIZ"
                      autoComplete="cc-name"
                    />
                  </div>

                  {/* Kart Numarası */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kart Numarası</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setFormData(prev => ({ ...prev, cardNumber: formatted }));
                      }}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono tracking-wider"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      autoComplete="cc-number"
                    />
                  </div>

                  {/* Son Kullanma & CVC */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ay</label>
                      <select
                        name="expireMonth"
                        value={formData.expireMonth}
                        onChange={(e) => setFormData(prev => ({ ...prev, expireMonth: e.target.value }))}
                        required
                        className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Son kullanma ayı"
                      >
                        <option value="">Ay</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Yıl</label>
                      <select
                        name="expireYear"
                        value={formData.expireYear}
                        onChange={(e) => setFormData(prev => ({ ...prev, expireYear: e.target.value }))}
                        required
                        className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Son kullanma yılı"
                      >
                        <option value="">Yıl</option>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={String(year)}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        value={formData.cvc}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setFormData(prev => ({ ...prev, cvc: value }));
                        }}
                        required
                        className="w-full min-h-11 px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono tracking-wider"
                        placeholder="000"
                        maxLength={4}
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </div>

                {/* Iyzico Badge */}
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Ödemeniz Iyzico tarafından güvenli şekilde işlenir
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'İşleniyor...' : `${totalPrice.toFixed(2)} ₺ Ödeme Yap`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h3>

              <div className="space-y-4 mb-6 border-b pb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                      <p className="text-amber-600 font-bold">₺{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-b pb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₺{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-medium text-green-600">Ücretsiz</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Toplam</span>
                <span className="text-amber-600">₺{totalPrice.toFixed(2)}</span>
              </div>

              <Link
                href="/cart"
                className="w-full block text-center text-amber-600 hover:text-amber-800 font-medium py-2"
              >
                ← Sepete Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
