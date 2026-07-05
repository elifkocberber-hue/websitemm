'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { trackPurchase } from '@/lib/pixel';
import { useCart } from '@/context/CeramicCartContext';
import { useLanguage } from '@/context/LanguageContext';

const DEFAULT_TY_TITLE = 'Teşekkürler!';
const DEFAULT_TY_SUBTITLE = 'Siparişiniz Onaylandı.';
const DEFAULT_TY_BODY = `El's Dream Factory'den yaptığınız alışveriş için teşekkür ederiz. Sipariş detaylarınız e-posta adresinize gönderilmiştir.

Ürünleriniz özenle hazırlanarak 1-3 iş günü içerisinde kargoya verilecektir. Kargonuz yola çıktığında takip bilgilerinizi sizinle paylaşacağız. Seramiklerinizin size güvenle ve en kısa sürede ulaşması için çalışıyoruz.

"Seramiklerinizi yeni evlerinde görmeyi çok isteriz! Bizi @elsdreamfactory etiketleyerek Instagram'da paylaşabilirsiniz."

Keyifli günlerde kullanmanız dileğiyle!`;

function ThankYouContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { t } = useLanguage();
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
    <div className="min-h-screen bg-bone py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-8">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse"></div>
            <div className="relative bg-emerald-100 rounded-full p-6">
              <svg className="w-20 h-20 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-charcoal mb-3">{tyTitle}</h1>
          {tySubtitle && (
            <p className="heading-serif text-xl md:text-2xl text-earth mb-6">{tySubtitle}</p>
          )}
          <div className="text-lg text-earth space-y-4 max-w-xl mx-auto text-left sm:text-center leading-relaxed">
            {tyBody
              .split(/\n\s*\n/)
              .map(p => p.trim())
              .filter(Boolean)
              .map((p, i) => (
                <p key={i} className={/^["“]/.test(p) ? 'italic text-accent' : undefined}>{p}</p>
              ))}
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl border border-warm-gray overflow-hidden mb-8">
          <div className="bg-charcoal px-8 py-6">
            <h2 className="heading-serif text-2xl text-bone">{t.thankyou.order_info}</h2>
          </div>

          <div className="px-8 py-8">
            <div className="space-y-6 mb-8 pb-8 border-b border-warm-gray">
              {/* Order ID */}
              <div className="flex justify-between items-center">
                <span className="text-earth">{t.thankyou.order_number}</span>
                <span className="heading-serif text-2xl text-charcoal tracking-wide">{orderId}</span>
              </div>

              {/* Date */}
              <div className="flex justify-between items-center">
                <span className="text-earth">{t.thankyou.date}</span>
                <span className="font-medium text-charcoal">{orderDate}</span>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center">
                <span className="text-earth">{t.thankyou.payment_status}</span>
                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t.thankyou.payment_received}
                </span>
              </div>
            </div>

            {/* Help Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-bone p-6 rounded-lg">
                <h3 className="heading-serif text-charcoal mb-3">{t.thankyou.questions_title}</h3>
                <div className="space-y-3 text-sm text-earth">
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span><strong>{t.thankyou.email_label}</strong> elsdreamfactory@gmail.com</span>
                  </p>
                </div>
              </div>
              <div className="bg-bone p-6 rounded-lg">
                <h3 className="heading-serif text-charcoal mb-3">{t.thankyou.contact_options}</h3>
                <ul className="space-y-2 text-sm text-earth">
                  <li>{t.thankyou.opt_tracking}</li>
                  <li>{t.thankyou.opt_returns}</li>
                  <li>{t.thankyou.opt_recommendations}</li>
                  <li>{t.thankyou.opt_fast_reply}</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
              <Link
                href="/ceramics"
                className="flex-1 block text-center bg-charcoal hover:bg-accent text-bone py-3.5 px-4 text-sm tracking-wider uppercase rounded-lg transition-colors duration-300"
              >
                {t.thankyou.explore_more}
              </Link>
              <Link
                href="/"
                className="flex-1 block text-center border border-charcoal text-charcoal hover:bg-charcoal hover:text-bone py-3.5 px-4 text-sm tracking-wider uppercase rounded-lg transition-colors duration-300"
              >
                {t.thankyou.home}
              </Link>
            </div>
          </div>
        </div>

        {/* Reassurance Banner */}
        <div className="bg-warm-gray/40 border border-warm-gray rounded-lg p-6 text-center">
          <p className="text-earth">
            <span className="font-medium text-charcoal">{t.thankyou.secure_title}</span> {t.thankyou.secure_desc}
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
