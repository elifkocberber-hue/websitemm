'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,    // Her zaman aktif
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('cookie_preferences', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
    }));
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    localStorage.setItem('cookie_preferences', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
    }));
    setVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookie_consent', 'custom');
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[9998] transition-opacity duration-500" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-slide-up">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
          {/* Başlık */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🍪</span>
            <h3 className="text-lg font-bold text-gray-900">Çerez Kullanımı</h3>
          </div>

          {/* Metin */}
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            İnternet sitemizden en verimli şekilde faydalanabilmeniz ve kullanıcı deneyiminizi 
            geliştirebilmek için çerezler (cookie) kullanmaktayız. Çerezlere ilişkin ayarları internet 
            sitemizde yer alan &quot;Çerez Ayarları&quot; seçeneğinden değiştirebileceğiniz gibi ayrıca çerez 
            kullanılmasını tercih etmezseniz tarayıcınızın ayarlarından çerezleri silebilir ya da 
            engelleyebilirsiniz. Ancak bunun internet sitemizi kullanımınızı etkileme ihtimali 
            bulunduğunu hatırlatmak isteriz. Çerezlere ilişkin daha detaylı bilgiye{' '}
            <Link
              href="/cookie-policy"
              className="text-amber-700 hover:text-amber-800 underline underline-offset-2 font-medium"
            >
              Çerez Aydınlatma Metni
            </Link>
            {' '}adlı dokümandan ulaşabilirsiniz.
          </p>

          {/* Ayarlar Paneli */}
          {showSettings && (
            <div className="mb-5 space-y-3 border-t border-gray-200 pt-5">
              {/* Zorunlu Çerezler */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Zorunlu Çerezler</p>
                  <p className="text-xs text-gray-500">Sitenin düzgün çalışması için gereklidir.</p>
                </div>
                <div className="relative">
                  <div className="w-11 h-6 bg-amber-700 rounded-full opacity-60 cursor-not-allowed" />
                  <div className="absolute top-0.5 left-[22px] w-5 h-5 bg-white rounded-full shadow" />
                </div>
              </div>

              {/* Analitik Çerezler */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Analitik Çerezler</p>
                  <p className="text-xs text-gray-500">Ziyaretçi istatistiklerini toplar.</p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    preferences.analytics ? 'bg-amber-700' : 'bg-gray-300'
                  }`}
                  title="Analitik çerezleri aç/kapat"
                  aria-label={`Analitik çerezler ${preferences.analytics ? 'açık' : 'kapalı'}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      preferences.analytics ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Pazarlama Çerezleri */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Pazarlama Çerezleri</p>
                  <p className="text-xs text-gray-500">Kişiselleştirilmiş reklamlar için kullanılır.</p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    preferences.marketing ? 'bg-amber-700' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      preferences.marketing ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {showSettings ? (
              <button
                onClick={handleSaveSettings}
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors duration-200"
              >
                Seçimi Kaydet
              </button>
            ) : (
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors duration-200"
              >
                Ayarlar
              </button>
            )}
            <button
              onClick={handleReject}
              className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors duration-200"
            >
              Reddet
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 bg-charcoal hover:bg-charcoal/90 text-bone px-6 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors duration-200"
            >
              Kabul Et
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
