'use client';

import { useState, useEffect } from 'react';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
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

  const dispatchConsentUpdate = () => window.dispatchEvent(new Event('cookieConsentUpdate'));

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('cookie_preferences', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
    }));
    setVisible(false);
    dispatchConsentUpdate();
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    localStorage.setItem('cookie_preferences', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
    }));
    setVisible(false);
    dispatchConsentUpdate();
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookie_consent', 'custom');
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    setVisible(false);
    dispatchConsentUpdate();
  };

  if (!visible) return null;

  return (
    <>
      {/* KVKK Aydınlatma Metni Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setShowPrivacy(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-base font-bold text-gray-900 leading-snug">
                Çerez ve Diğer Tanımlama Teknolojilerine Yönelik Aydınlatma Metni
              </h2>
              <button
                onClick={() => setShowPrivacy(false)}
                className="ml-4 shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Kapat"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5 text-sm text-gray-600 leading-relaxed space-y-5">
              <p>
                El&apos;s Dream Factory (&quot;Şirket&quot;) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
                kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin hukuka uygun olarak işlenmesine büyük önem vermekteyiz.
                İşbu aydınlatma metni, KVKK&apos;nın 10. maddesi ile Aydınlatma Yükümlülüğünün Yerine Getirilmesinde
                Uyulacak Usul ve Esaslar Hakkında Tebliğ çerçevesinde hazırlanmıştır.
              </p>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">1. Veri Sorumlusu</h3>
                <p><strong>Unvan:</strong> El&apos;s Dream Factory<br /><strong>E-posta:</strong> elsdreamfactory@gmail.com<br /><strong>Web:</strong> elsdreamfactory.com</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">2. İşlenen Kişisel Veriler</h3>
                <p>Kimlik bilgileri (ad, soyad), iletişim bilgileri (e-posta, telefon, adres), işlem güvenliği bilgileri (IP adresi, çerez verileri, oturum bilgileri), alışveriş bilgileri (sipariş geçmişi, sepet bilgileri).</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">3. İşlenme Amaçları</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Sipariş süreçlerinin yönetilmesi ve ürün teslimatının gerçekleştirilmesi</li>
                  <li>Ödeme işlemlerinin güvenli şekilde tamamlanması</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                  <li>Müşteri ilişkilerinin yönetimi</li>
                  <li>Hizmet kalitesinin artırılmasına yönelik analiz çalışmaları</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">4. Hukuki Sebepler</h3>
                <p>Verileriniz; sözleşmenin ifası (md. 5/2-c), hukuki yükümlülük (md. 5/2-ç), meşru menfaat (md. 5/2-f) ve açık rıza (md. 5/1) kapsamında işlenmektedir.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">5. Çerez Türleri</h3>
                <p><strong>Zorunlu Çerezler:</strong> Sitenin düzgün çalışması için gereklidir (oturum, sepet).<br /><strong>Analitik Çerezler:</strong> Ziyaretçi istatistiklerini anlamak amacıyla kullanılır.<br /><strong>Pazarlama Çerezleri:</strong> Kişiselleştirilmiş içerik ve reklamlar için kullanılır.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">6. Saklama Süreleri</h3>
                <p>Çerez verileri oturum süresi veya en fazla 1 yıl süreyle saklanmaktadır. Sipariş ve fatura bilgileri vergi mevzuatı gereği 10 yıl saklanır.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">7. KVKK Kapsamındaki Haklarınız</h3>
                <p>KVKK&apos;nın 11. maddesi gereğince; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme, aktarımı öğrenme ve itiraz etme haklarına sahipsiniz.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">8. Başvuru</h3>
                <p>Haklarınızı kullanmak için <a href="mailto:elsdreamfactory@gmail.com" className="text-amber-700 underline">elsdreamfactory@gmail.com</a> adresine başvurabilirsiniz. Başvurular en geç 30 gün içinde ücretsiz sonuçlandırılır.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={() => setShowPrivacy(false)}
                className="w-full bg-charcoal hover:bg-charcoal/90 text-bone px-6 py-2.5 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors duration-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[9998] transition-opacity duration-500" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-slide-up">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
          {/* Başlık */}
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-gray-900">Çerez Politikası</h3>
          </div>

          {/* Metin */}
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            İnternet sitemizde çerezler vasıtasıyla kişisel verileriniz işlenmektedir. Kişiselleştir
            butonu ile erişebileceğiniz Çerez Yönetim Paneli üzerinden her zaman tercihlerinizi
            belirleyebilirsiniz. Daha detaylı bilgi için{' '}
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-amber-700 hover:text-amber-800 underline underline-offset-2 font-medium"
            >
              Çerez ve Diğer Tanımlama Teknolojilerine Yönelik Aydınlatma Metni
            </button>
            &apos;ni inceleyiniz.
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
                  aria-label={`Pazarlama çerezleri ${preferences.marketing ? 'açık' : 'kapalı'}`}
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
                Kişiselleştir
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
