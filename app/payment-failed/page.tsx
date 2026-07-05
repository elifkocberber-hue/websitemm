'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const errorReason = searchParams.get('reason') || 'Bilinmeyen Hata';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const errorMessages: Record<string, string> = {
    'card_declined': t.payment_failed.err_card_declined,
    'insufficient_funds': t.payment_failed.err_insufficient_funds,
    'expired_card': t.payment_failed.err_expired_card,
    'invalid_card': t.payment_failed.err_invalid_card,
    'network_error': t.payment_failed.err_network_error,
    'timeout': t.payment_failed.err_timeout,
  };

  const getErrorMessage = () => {
    return errorMessages[errorReason] || t.payment_failed.err_generic;
  };

  const renderTip = (tip: string) => {
    const idx = tip.indexOf(' - ');
    if (idx === -1) return <span className="text-earth">{tip}</span>;
    return (
      <span className="text-earth"><strong className="text-charcoal">{tip.slice(0, idx)}</strong>{tip.slice(idx)}</span>
    );
  };

  const getErrorIcon = () => {
    switch (errorReason) {
      case 'card_declined':
        return (
          <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10M7 19h10M5 15h2v4H5M17 15h2v4h-2Z" />
          </svg>
        );
      case 'insufficient_funds':
        return (
          <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'network_error':
        return (
          <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      default:
        return (
          <svg className="w-20 h-20 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bone py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Error Animation */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-8">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
            <div className="relative bg-red-100 rounded-full p-6">
              {getErrorIcon()}
            </div>
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-charcoal mb-4">{t.payment_failed.title}</h1>
          <p className="text-lg text-earth">
            {t.payment_failed.subtitle}
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-xl border border-warm-gray overflow-hidden mb-8">
          <div className="bg-charcoal px-8 py-6">
            <h2 className="heading-serif text-2xl text-bone">{t.payment_failed.error_details}</h2>
          </div>

          <div className="px-8 py-8">
            {/* Error Message */}
            <div className="mb-8 pb-8 border-b border-warm-gray">
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded">
                <p className="text-red-800 font-semibold text-lg">{getErrorMessage()}</p>
              </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="mb-8">
              <h3 className="heading-serif text-xl text-charcoal mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.355 7.369a9 9 0 11-17.646 1.488M8.066 13.076l1.06-3.573m3.736 3.573l-1.06-3.573m2.828-1.414a3 3 0 11-4.243-4.243" clipRule="evenodd" />
                </svg>
                {t.payment_failed.solutions_title}
              </h3>
              <ul className="space-y-3">
                {errorReason === 'card_declined' && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">1</span>
                      {renderTip(t.payment_failed.cd1)}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">2</span>
                      {renderTip(t.payment_failed.cd2)}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">3</span>
                      {renderTip(t.payment_failed.cd3)}
                    </li>
                  </>
                )}
                {errorReason === 'insufficient_funds' && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">1</span>
                      {renderTip(t.payment_failed.if1)}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">2</span>
                      {renderTip(t.payment_failed.if2)}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">3</span>
                      {renderTip(t.payment_failed.if3)}
                    </li>
                  </>
                )}
                {(errorReason === 'network_error' || errorReason === 'timeout') && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">1</span>
                      {renderTip(t.payment_failed.net1)}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">2</span>
                      {renderTip(t.payment_failed.net2)}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">3</span>
                      {renderTip(t.payment_failed.net3)}
                    </li>
                  </>
                )}
                {!['card_declined', 'insufficient_funds', 'network_error', 'timeout'].includes(errorReason) && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">1</span>
                      {renderTip(t.payment_failed.def1)}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">2</span>
                      {renderTip(t.payment_failed.def2)}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-warm-gray text-charcoal rounded-full text-sm font-bold">3</span>
                      {renderTip(t.payment_failed.def3)}
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Support Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-warm-gray">
              <div className="bg-bone p-6 rounded-lg">
                <h3 className="heading-serif text-charcoal mb-3">{t.payment_failed.support_title}</h3>
                <div className="space-y-3 text-sm text-earth">
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <a href="mailto:elsdreamfactory@gmail.com" className="text-accent hover:underline font-medium">
                      elsdreamfactory@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="bg-bone p-6 rounded-lg">
                <h3 className="heading-serif text-charcoal mb-3">{t.payment_failed.account_title}</h3>
                <ul className="space-y-2 text-sm text-earth">
                  <li>{t.payment_failed.acc1}</li>
                  <li>{t.payment_failed.acc2}</li>
                  <li>{t.payment_failed.acc3}</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
              <Link
                href="/payment"
                className="flex-1 block text-center bg-charcoal hover:bg-accent text-bone py-3.5 px-4 text-sm tracking-wider uppercase rounded-lg transition-colors duration-300"
              >
                {t.payment_failed.btn_retry}
              </Link>
              <Link
                href="/cart"
                className="flex-1 block text-center border border-charcoal text-charcoal hover:bg-charcoal hover:text-bone py-3.5 px-4 text-sm tracking-wider uppercase rounded-lg transition-colors duration-300"
              >
                {t.payment_failed.btn_back_cart}
              </Link>
              <Link
                href="/"
                className="flex-1 block text-center text-earth hover:text-charcoal py-3.5 px-4 text-sm tracking-wider uppercase rounded-lg transition-colors"
              >
                {t.payment_failed.btn_home}
              </Link>
            </div>
          </div>
        </div>

        {/* Security Banner */}
        <div className="bg-warm-gray/40 border border-warm-gray rounded-lg p-6 text-center">
          <p className="text-earth">
            <span className="font-medium text-charcoal">{t.payment_failed.banner_title}</span> {t.payment_failed.banner_desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <PaymentFailedContent />
    </Suspense>
  );
}
