'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const orderId = searchParams.get('orderId') || '#' + Math.floor(Math.random() * 1000000);
  const orderDate = searchParams.get('date') || new Date().toLocaleDateString('tr-TR');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-8">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse"></div>
            <div className="relative bg-emerald-100 rounded-full p-6">
              <svg className="w-20 h-20 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ödemeniz Başarılı! 🎉</h1>
          <p className="text-lg text-gray-600">
            Siparişiniz alındı ve işleme başlandı. Kargo bilgilerinizi e-posta adresinize göndereceğiz.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border-t-4 border-emerald-600">
          <div className="bg-linear-to-r from-emerald-600 to-emerald-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Sipariş Bilgileriniz</h2>
          </div>
          
          <div className="px-8 py-8">
            <div className="space-y-6 mb-8 pb-8 border-b border-gray-200">
              {/* Order ID */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Sipariş Numarası</span>
                <span className="font-bold text-2xl text-emerald-600">{orderId}</span>
              </div>
              
              {/* Date */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Tarih</span>
                <span className="font-semibold text-gray-900">{orderDate}</span>
              </div>
              
              {/* Status */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Ödeme Durumu</span>
                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-semibold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ödeme Alındı
                </span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Sonraki Adımlar
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">1.</span>
                  <span>Siparişiniz onaylanacak ve işleme alınacak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">2.</span>
                  <span>1-2 gün içinde kargonuza teslim edilecek</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">3.</span>
                  <span>Kargo takip kodunu e-mailinize göndereceğiz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">4.</span>
                  <span>Teslimattan sonra 30 gün içinde iade edebilirsiniz</span>
                </li>
              </ul>
            </div>

            {/* Help Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Sorularınız mı var?</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span><strong>E-posta:</strong> info@elsdreamfactory.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.823.728c.15.248.283.505.398.768.115.263.316.551.571.819.255.268.579.503.915.657.337.155.751.235 1.237.235 1.485 0 2.677-.402 3.353-.956.677-.554.988-1.262 1.087-2.008.098-.746.098-1.604 0-2.773-.098-1.169-.269-2.054-.47-2.53l-.466-1.04a1 1 0 00-.938-.556h-2.003V3z" />
                    </svg>
                    <span><strong>Telefon:</strong> +90 (555) 123-4567</span>
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">İletişim Seçenekleri</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Sipariş takibi</li>
                  <li>✓ İade ve değişim işlemleri</li>
                  <li>✓ Ürün önerileri</li>
                  <li>✓ Hızlı yanıt (24 saat içinde)</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
              <Link
                href="/ceramics"
                className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Daha Fazla Ürün Keşfet
              </Link>
              <Link
                href="/"
                className="flex-1 text-center border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>

        {/* Reassurance Banner */}
        <div className="bg-linear-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            <span className="font-semibold">Ödemeniz güvenlidir.</span> Tüm işlemleriniz SSL şifreleme ile korunmaktadır.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}
