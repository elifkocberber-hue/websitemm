'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const errorReason = searchParams.get('reason') || 'Bilinmeyen Hata';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const errorMessages: Record<string, string> = {
    'card_declined': 'Kartınız reddedildi. Lütfen başka bir kart deneyin.',
    'insufficient_funds': 'Kartınızda yeterli bakiye yok.',
    'expired_card': 'Kart süresi dolmuş. Geçerli bir kartla deneyin.',
    'invalid_card': 'Kart numarası geçersiz.',
    'network_error': 'Ağ bağlantı hatası. Lütfen daha sonra tekrar deneyin.',
    'timeout': 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.',
  };

  const getErrorMessage = () => {
    return errorMessages[errorReason] || 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.';
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Error Animation */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-8">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
            <div className="relative bg-red-100 rounded-full p-6">
              {getErrorIcon()}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ödeme Başarısız ❌</h1>
          <p className="text-lg text-gray-600">
            Maalesef ödeme işlemi tamamlanamadı. Lütfen aşağıdaki bilgileri okuyun.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border-t-4 border-red-600">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Hata Detayları</h2>
          </div>
          
          <div className="px-8 py-8">
            {/* Error Message */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded">
                <p className="text-red-800 font-semibold text-lg">{getErrorMessage()}</p>
              </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.355 7.369a9 9 0 11-17.646 1.488M8.066 13.076l1.06-3.573m3.736 3.573l-1.06-3.573m2.828-1.414a3 3 0 11-4.243-4.243" clipRule="evenodd" />
                </svg>
                Yapabileceğiniz Çözümler
              </h3>
              <ul className="space-y-3">
                {errorReason === 'card_declined' && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">1</span>
                      <span className="text-gray-700"><strong>Başka bir ödeme yöntemi deneyin</strong> - Farklı bir kredi kartı kullanın</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">2</span>
                      <span className="text-gray-700"><strong>Kartınızı kontrol edin</strong> - Numarası, son kullanma tarihi ve CVC'yi doğrulayın</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">3</span>
                      <span className="text-gray-700"><strong>Bankınızla iletişime geçin</strong> - Kart limitlerini veya güvenlik ayarlarını kontrol etmeleri için</span>
                    </li>
                  </>
                )}
                {errorReason === 'insufficient_funds' && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">1</span>
                      <span className="text-gray-700"><strong>Kartınıza para yükleyin</strong> - Daha yüksek bakiyeli bir hesaptan transfer yapmayı deneyin</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">2</span>
                      <span className="text-gray-700"><strong>Başka bir kart kullanın</strong> - Daha yüksek limite sahip farklı bir kartık deneyin</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">3</span>
                      <span className="text-gray-700"><strong>Daha sonra deneyin</strong> - Hesap limitlerinin yenilenip yenilenmediğini kontrol edin</span>
                    </li>
                  </>
                )}
                {(errorReason === 'network_error' || errorReason === 'timeout') && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">1</span>
                      <span className="text-gray-700"><strong>İnternet bağlantınızı kontrol edin</strong> - Stabil bir bağlantıda olduğunuzdan emin olun</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">2</span>
                      <span className="text-gray-700"><strong>Sayfayı yenileyin ve tekrar deneyin</strong> - Ağ hatasının geçit olması için bekleyin</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">3</span>
                      <span className="text-gray-700"><strong>Farklı bir zamanı deneyin</strong> - Sunucu yükü az olduğu bir saatte tekrar deneyin</span>
                    </li>
                  </>
                )}
                {!['card_declined', 'insufficient_funds', 'network_error', 'timeout'].includes(errorReason) && (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">1</span>
                      <span className="text-gray-700"><strong>Tüm bilgileri kontrol edin</strong> - Formda girdiğiniz tüm verilerin doğru olduğundan emin olun</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">2</span>
                      <span className="text-gray-700"><strong>Tekrar ödeme deneyin</strong> - Sepetiniz kaydedilmiştir, ödeme işlemine tekrar başlayın</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full text-sm font-bold">3</span>
                      <span className="text-gray-700"><strong>Müşteri destek bize ulaşın</strong> - Sorun devam ederse, destek ekibimiz size yardımcı olabilir</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Support Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Anında Yardım</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <a href="mailto:info@ter-aseramik.com" className="text-orange-600 hover:underline font-medium">
                      info@ter-aseramik.com
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.823.728c.15.248.283.505.398.768.115.263.316.551.571.819.255.268.579.503.915.657.337.155.751.235 1.237.235 1.485 0 2.677-.402 3.353-.956.677-.554.988-1.262 1.087-2.008.098-.746.098-1.604 0-2.773-.098-1.169-.269-2.054-.47-2.53l-.466-1.04a1 1 0 00-.938-.556h-2.003V3z" />
                    </svg>
                    <span className="font-medium">+90 (555) 123-4567</span>
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Hesap Bilgileri</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Sepetiniz kaydedilmiş</li>
                  <li>✓ Hiçbir ücret alınmadı</li>
                  <li>✓ İstediğiniz zaman deneyin</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
              <Link
                href="/payment"
                className="flex-1 text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Ödemeyi Tekrar Deneyeceğim
              </Link>
              <Link
                href="/cart"
                className="flex-1 text-center border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Sepete Dön
              </Link>
              <Link
                href="/"
                className="flex-1 text-center text-gray-600 hover:text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>

        {/* Security Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            <span className="font-semibold">Verileriniz güvenlidir.</span> Tüm ödeme işlemleri 256-bit SSL şifreleme ile korunmaktadır. Hiçbir ücret alınmıştır.
          </p>
        </div>
      </div>
    </div>
  );
}
