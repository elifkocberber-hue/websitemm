'use client';

import { useCart } from '@/context/CeramicCartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateEventId } from '@/lib/pixel';
import { useLanguage } from '@/context/LanguageContext';
import { COUNTRIES } from '@/lib/countries';

interface ShippingRateInfo {
  code: string;
  name: string;
  cost: number;
  freeOverThreshold: boolean;
}

// Kart numarası ön ekinden marka algıla — kullanıcıya görsel geri bildirim için
function detectCardBrand(digits: string): string | null {
  if (/^9792/.test(digits)) return 'Troy';
  if (/^4/.test(digits)) return 'Visa';
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  return null;
}

export default function PaymentPage() {
  const { items, totalPrice } = useCart();
  const { t, language } = useLanguage();
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
    country: 'TR',
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
  });
  const [mssAccepted, setMssAccepted] = useState(false);
  const [onBilgiAccepted, setOnBilgiAccepted] = useState(false);

  // Kargo ücretleri (admin tanımlı) + ücretsiz kargo eşiği
  const [shippingRates, setShippingRates] = useState<ShippingRateInfo[] | null>(null);
  const [freeThreshold, setFreeThreshold] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/shipping')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.rates)) setShippingRates(d.rates);
        setFreeThreshold(d.threshold ?? null);
      })
      .catch(() => setShippingRates([{ code: 'TR', name: 'Türkiye', cost: 0, freeOverThreshold: false }]));
  }, []);

  // Seçili ülkenin kargo bilgisi — kaydı yoksa o ülkeye satış yapılmıyor demektir.
  // (Gösterim amaçlı; asıl tutar sunucuda yeniden hesaplanıp doğrulanır.)
  const selectedRate = shippingRates?.find((r) => r.code === formData.country) ?? null;
  const shippingKnown = shippingRates !== null;
  const shippingSupported = !shippingKnown || selectedRate !== null; // yüklenene dek engelleme
  const shippingCost = selectedRate
    ? (freeThreshold !== null && selectedRate.freeOverThreshold && totalPrice >= freeThreshold ? 0 : selectedRate.cost)
    : 0;
  const grandTotal = totalPrice + shippingCost;
  const isTR = formData.country === 'TR';

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bone py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-6">{t.payment.empty_title}</h1>
          <p className="text-earth mb-6">{t.payment.empty_desc}</p>
          <Link
            href="/ceramics"
            className="inline-block bg-charcoal hover:bg-accent text-bone py-3.5 px-8 text-sm tracking-wider uppercase rounded-lg transition-colors duration-300"
          >
            {t.payment.continue_shopping}
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
          totalPrice: grandTotal, // ürünler + kargo (sunucu yeniden hesaplayıp doğrular)
          items: items,
          customer: formData,
        }),
      });

      const data = await response.json();

      if (data.success && data.requires3DS && data.threeDSHtmlContent) {
        // Purchase event snapshot'ı kaydet (thank-you sayfasında tetiklenir)
        sessionStorage.setItem('last_purchase', JSON.stringify({
          orderId: 'pending',
          items: items.map(i => ({ id: i.id, quantity: i.quantity })),
          totalPrice: grandTotal,
          eventId: generateEventId(),
        }));

        // NOT: Sepeti burada TEMİZLEME — ödeme 3DS sonrası tamamlanınca
        // "Teşekkürler" sayfasında temizlenir. Aksi halde 3DS başarısız olursa sepet kaybolur.

        // iyzico'nun 3DS HTML'ini DOM'a yaz ve otomatik submit et
        const container = document.createElement('div');
        container.innerHTML = data.threeDSHtmlContent;
        document.body.appendChild(container);
        const form = container.querySelector('form');
        if (form) form.submit();
      } else if (data.success) {
        // 3DS olmaksızın direkt başarı (sandbox bazı senaryolarda)
        const orderId = data.orderId || 'ORD-' + Date.now();
        const date = new Date().toLocaleDateString('tr-TR');
        sessionStorage.setItem('last_purchase', JSON.stringify({
          orderId,
          items: items.map(i => ({ id: i.id, quantity: i.quantity })),
          totalPrice: grandTotal,
          eventId: generateEventId(),
        }));
        router.push(`/thank-you?orderId=${orderId}&date=${encodeURIComponent(date)}`);
      } else {
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
    <div className="min-h-screen bg-bone py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-earth">
          <Link href="/" className="text-accent hover:text-charcoal transition-colors">{t.payment.breadcrumb_home}</Link>
          <span className="mx-2">›</span>
          <Link href="/cart" className="text-accent hover:text-charcoal transition-colors">{t.payment.breadcrumb_cart}</Link>
          <span className="mx-2">›</span>
          <span>{t.payment.breadcrumb_payment}</span>
        </nav>

        <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-8">{t.payment.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-warm-gray p-8 mb-8">
              <h2 className="heading-serif text-2xl text-charcoal mb-6">{t.payment.personal_info}</h2>

              <form onSubmit={handlePayment} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.first_name}</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                      placeholder={t.payment.first_name_ph}
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.last_name}</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                      placeholder={t.payment.last_name_ph}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.email}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.phone}</label>
                    {isTR ? (
                      <div className="flex">
                        <span className="inline-flex items-center px-3 min-h-11 border border-r-0 border-warm-gray rounded-l-lg bg-warm-gray/60 text-earth text-base select-none">+90</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                          required
                          maxLength={10}
                          className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-r-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                          placeholder="5XX XXX XX XX"
                        />
                      </div>
                    ) : (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/[^\d\s+()-]/g, '').slice(0, 20) }))}
                        required
                        className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                        placeholder={t.payment.phone_intl_ph}
                      />
                    )}
                    {isTR && <p className="text-xs text-clay mt-1">{t.payment.phone_hint}</p>}
                  </div>
                </div>

                {/* Ülke — kargo ücreti ve satış bölgesi bu seçime göre belirlenir */}
                <div>
                  <label htmlFor="country" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.country}</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value, phone: '' }))}
                    required
                    className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal focus:outline-none focus:border-charcoal transition-colors"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {language === 'en' ? c.en : c.tr}
                      </option>
                    ))}
                  </select>
                  {!shippingSupported && (
                    <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {t.payment.no_shipping_to_country}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.address}</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                    placeholder={t.payment.address_ph}
                  />
                </div>

                {/* City & Postal */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.city}</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                      placeholder={t.payment.city_ph}
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.postal_code}</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                      placeholder="34000"
                    />
                  </div>
                </div>

                {/* ═══════ KART BİLGİLERİ ═══════ */}
                <div className="border-t border-warm-gray pt-6 mt-2">
                  <h2 className="heading-serif text-2xl text-charcoal mb-6">{t.payment.card_info}</h2>

                  {/* Kart Üzerindeki İsim */}
                  <div className="mb-4">
                    <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.card_holder}</label>
                    <input
                      type="text"
                      name="cardHolderName"
                      value={formData.cardHolderName}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                      placeholder={t.payment.card_holder_ph}
                      autoComplete="cc-name"
                    />
                  </div>

                  {/* Kart Numarası */}
                  <div className="mb-4">
                    <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.card_number}</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                          setFormData(prev => ({ ...prev, cardNumber: formatted }));
                        }}
                        required
                        className="w-full min-h-11 px-4 py-2 pr-28 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors font-mono tracking-wider"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        autoComplete="cc-number"
                      />
                      {detectCardBrand(formData.cardNumber.replace(/\s/g, '')) && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs tracking-[0.12em] uppercase font-medium text-earth bg-warm-gray/60 rounded px-2 py-1 select-none">
                          {detectCardBrand(formData.cardNumber.replace(/\s/g, ''))}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Son Kullanma & CVC */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.month}</label>
                      <select
                        name="expireMonth"
                        value={formData.expireMonth}
                        onChange={(e) => setFormData(prev => ({ ...prev, expireMonth: e.target.value }))}
                        required
                        className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                        title={t.payment.expire_month_title}
                      >
                        <option value="">{t.payment.month}</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">{t.payment.year}</label>
                      <select
                        name="expireYear"
                        value={formData.expireYear}
                        onChange={(e) => setFormData(prev => ({ ...prev, expireYear: e.target.value }))}
                        required
                        className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                        title={t.payment.expire_year_title}
                      >
                        <option value="">{t.payment.year}</option>
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
                      <label className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">CVC</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="cvc"
                        value={formData.cvc}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setFormData(prev => ({ ...prev, cvc: value }));
                        }}
                        required
                        className="w-full min-h-11 px-4 py-2 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors font-mono tracking-wider"
                        placeholder="000"
                        maxLength={4}
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </div>

                {/* Iyzico Badge + güven sinyalleri */}
                <div className="flex flex-col items-center justify-center gap-3 p-4 bg-warm-gray/40 rounded-lg">
                  <Image
                    src="/images/payment/logo_band_colored.png"
                    alt="iyzico ile Öde, Mastercard, Visa, American Express ve Troy ile güvenli ödeme"
                    width={520}
                    height={36}
                    className="h-8 w-auto"
                  />
                  <p className="text-xs text-earth text-center">
                    {t.payment.iyzico_note}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-earth">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      {t.payment.trust_ssl}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      {t.payment.trust_3ds}
                    </span>
                  </div>
                </div>

                {/* Ön Bilgilendirme + MSS Onayı (TKHK Md.48) */}
                <div className="border border-warm-gray rounded-lg p-4 bg-bone/60">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mssAccepted}
                      onChange={(e) => { setMssAccepted(e.target.checked); setOnBilgiAccepted(e.target.checked); }}
                      required
                      className="mt-1 w-4 h-4 accent-[#5C0A1A] border-warm-gray rounded shrink-0"
                    />
                    <span className="text-sm text-charcoal/80 leading-relaxed">
                      {t.payment.consent_1}
                      <a href="/returns" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">{t.payment.consent_link1}</a>
                      {t.payment.consent_2}
                      <a href="/mesafeli-satis-sozlesmesi" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">{t.payment.consent_link2}</a>
                      {t.payment.consent_3}
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !mssAccepted || !onBilgiAccepted || !shippingSupported}
                  className="w-full bg-charcoal hover:bg-accent disabled:bg-warm-gray disabled:text-clay disabled:cursor-not-allowed text-bone py-3.5 px-4 text-sm tracking-wider uppercase rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  {loading ? t.payment.processing : `${t.payment.pay_prefix}${grandTotal.toFixed(2)} ₺${t.payment.pay_suffix}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl border border-warm-gray p-6 sticky top-24">
              <h3 className="heading-serif text-xl text-charcoal mb-6">{t.payment.order_summary}</h3>

              <div className="space-y-4 mb-6 border-b border-warm-gray pb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-warm-gray rounded overflow-hidden shrink-0">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-charcoal">{item.name}</p>
                      <p className="text-sm text-earth">{t.payment.qty_label} {item.quantity}</p>
                      <p className="text-charcoal">₺{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-b border-warm-gray pb-6">
                <div className="flex justify-between">
                  <span className="text-earth">{t.payment.subtotal}</span>
                  <span className="font-medium text-charcoal">₺{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth">{t.payment.shipping}</span>
                  {!shippingSupported ? (
                    <span className="font-medium text-red-600">—</span>
                  ) : shippingCost === 0 ? (
                    <span className="font-medium text-emerald-700">{t.payment.free}</span>
                  ) : (
                    <span className="font-medium text-charcoal">₺{shippingCost.toFixed(2)}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg">
                <span className="font-medium text-charcoal">{t.payment.total}</span>
                <span className="heading-serif text-charcoal">₺{grandTotal.toFixed(2)}</span>
              </div>

              {/* Kargo + cayma hakkı güvencesi — ödeme anında görünür olsun */}
              <div className="mb-6 p-4 bg-warm-gray/40 rounded-lg space-y-2">
                <p className="flex items-center gap-2 text-xs text-earth">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  {t.payment.trust_shipping}
                </p>
                <p className="flex items-center gap-2 text-xs text-earth">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                    <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  {t.payment.trust_returns}
                </p>
              </div>

              <Link
                href="/cart"
                className="w-full block text-center text-sm tracking-wider uppercase text-earth hover:text-charcoal transition-colors py-2"
              >
                {t.payment.back_to_cart}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
