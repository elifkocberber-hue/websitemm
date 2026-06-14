'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { trackPurchase } from '@/lib/pixel';
import { useCart } from '@/context/CeramicCartContext';

const DEFAULT_TY_TITLE = 'Teşekkürler!';
const DEFAULT_TY_SUBTITLE = 'Siparişiniz Onaylandı.';
const DEFAULT_TY_BODY = `El's Dream Factory'den yaptığınız alışveriş için teşekkür ederiz. Sipariş detaylarınız e-posta adresinize gönderilmiştir.

Ürünleriniz özenle hazırlanarak 1-3 iş günü içerisinde kargoya verilecektir. Kargonuz yola çıktığında takip bilgilerinizi sizinle paylaşacağız. Seramiklerinizin size güvenle ve en kısa sürede ulaşması için çalışıyoruz.

"Seramiklerinizi yeni evlerinde görmeyi çok isteriz! Bizi @elsdreamfactory etiketleyerek Instagram'da paylaşabilirsiniz."

Keyifli günlerde kullanmanız dileğiyle!`;

function ThankYouContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [tyTitle, setTyTitle] = useState(DEFAULT_TY_TITLE);
  const [tySubtitle, setTySubtitle] = useState(DEFAULT_TY_SUBTITLE);
  const [tyBody, setTyBody] = useState(DEFAULT_TY_BODY);
  const orderId = searchParams.get('orderId') || '#' + Math.floor(Math.random() * 1000000);
  const orderDate = searchParams.get('date') || new Date().toLocaleDateString('tr-TR');

  useEffect(() => {
    setIsMounted(true);
    // Ödeme başarıyla tamamlandı (bu sayfaya yalnız başarılı ödeme sonrası gelinir) → sepeti temizle
    clearCart();
    // Ödeme sayfasından bırakılan purchase snapshot'ı oku ve tetikle
    try {
      const raw = sessionStorage.getItem('last_purchase');
      if (raw) {
        const { orderId: pId, items: pItems, totalPrice: pTotal, eventId } = JSON.parse(raw);
        sessionStorage.removeItem('last_purchase');
        trackPurchase(pId, pItems, pTotal, eventId);
      }
    } catch { /* ignore */ }
    // Admin'in düzenleyebildiği teşekkür metnini çek (yoksa varsayılan kalır)
    fetch('/api/admin/thankyou')
      .then(r => r.json())
      .then(d => { if (d.title) setTyTitle(d.title); if (d.subtitle !== undefined) setTySubtitle(d.subtitle); if (d.body) setTyBody(d.body); })
      .catch(() => {});
    // clearCart referansı sabit; yalnız mount'ta çalışsın
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{tyTitle}</h1>
          {tySubtitle && (
            <p className="text-xl md:text-2xl font-medium text-gray-700 mb-6">{tySubtitle}</p>
          )}
          <div className="text-lg text-gray-600 space-y-4 max-w-xl mx-auto text-left sm:text-center">
            {tyBody
              .split(/\n\s*\n/)
              .map(p => p.trim())
              .filter(Boolean)
              .map((p, i) => (
                <p key={i} className={/^["“]/.test(p) ? 'italic text-emerald-700' : undefined}>{p}</p>
              ))}
          </div>
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
                    <span><strong>E-posta:</strong> elsdreamfactory@gmail.com</span>
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
                  <li>Sipariş takibi</li>
                  <li>İade ve değişim işlemleri</li>
                  <li>Ürün önerileri</li>
                  <li>Hızlı yanıt (24 saat içinde)</li>
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
