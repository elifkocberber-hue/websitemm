import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Politikası | El\'s Dream Factory',
  description: 'El\'s Dream Factory çerez (cookie) politikası. Web sitemizde kullanılan çerezler hakkında bilgi.',
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-amber-600 transition-colors">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Çerez Politikası</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Çerez Politikası</h1>
        <p className="text-gray-500 mb-10">Son güncelleme: 1 Mart 2026</p>

        {/* Giriş */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Çerezler Hakkında Genel Bilgi
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            El&apos;s Dream Factory (&quot;biz&quot;, &quot;sitemiz&quot;) olarak, web sitemizi ziyaret ettiğinizde deneyiminizi 
            iyileştirmek, sitemizin düzgün çalışmasını sağlamak ve hizmetlerimizi geliştirmek amacıyla 
            çerezler (cookies) ve benzer teknolojiler kullanmaktayız.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Bu Çerez Politikası, web sitemizde hangi çerezlerin kullanıldığını, bu çerezlerin ne amaçla 
            kullanıldığını ve çerez tercihlerinizi nasıl yönetebileceğinizi açıklamaktadır. Bu politika, 
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili mevzuat kapsamında 
            hazırlanmıştır.
          </p>
        </section>

        {/* Çerez Nedir? */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Çerez Nedir?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza (bilgisayar, 
            tablet veya cep telefonu) yerleştirilen küçük metin dosyalarıdır. Çerezler, web sitesinin sizi 
            tanımasını, tercihlerinizi hatırlamasını ve size daha iyi bir kullanıcı deneyimi sunmasını sağlar.
          </p>
          <div className="bg-stone-50 rounded-xl p-6">
            <p className="text-gray-600 leading-relaxed text-sm">
              Çerezler, cihazınıza zarar vermez, virüs veya kötü amaçlı yazılım içermez. Yalnızca metin 
              tabanlı bilgiler içerirler ve doğrudan kişisel bilgilerinizi okuyamazlar.
            </p>
          </div>
        </section>

        {/* Kullanılan Çerez Türleri */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Kullanılan Çerez Türleri</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Web sitemizde aşağıdaki çerez türleri kullanılmaktadır:
          </p>

          {/* Zorunlu Çerezler */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Zorunlu</span>
                <h3 className="font-semibold text-gray-900">Zorunlu (Gerekli) Çerezler</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Bu çerezler, web sitemizin temel işlevlerinin çalışması için mutlaka gereklidir. 
                Bu çerezler olmadan site düzgün çalışamaz ve devre dışı bırakılamazlar.
              </p>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 font-semibold text-gray-900">Çerez Adı</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Amaç</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">session_id</td>
                      <td className="p-3">Oturum yönetimi</td>
                      <td className="p-3">Oturum süresi</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">cart_data</td>
                      <td className="p-3">Alışveriş sepeti bilgilerinin saklanması</td>
                      <td className="p-3">7 gün</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">csrf_token</td>
                      <td className="p-3">Güvenlik: Siteler arası istek sahteciliği koruması</td>
                      <td className="p-3">Oturum süresi</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">cookie_consent</td>
                      <td className="p-3">Çerez tercihlerinizin kaydedilmesi</td>
                      <td className="p-3">1 yıl</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* İşlevsel Çerezler */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">İşlevsel</span>
                <h3 className="font-semibold text-gray-900">İşlevsel Çerezler</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Bu çerezler, web sitemizde daha gelişmiş işlevsellik ve kişiselleştirme sağlamak için kullanılır. 
                Dil tercihiniz ve bölge ayarlarınız gibi seçimlerinizi hatırlamanıza yardımcı olur.
              </p>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 font-semibold text-gray-900">Çerez Adı</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Amaç</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">language</td>
                      <td className="p-3">Dil tercihinin saklanması</td>
                      <td className="p-3">1 yıl</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">recently_viewed</td>
                      <td className="p-3">Son görüntülenen ürünlerin hatırlanması</td>
                      <td className="p-3">30 gün</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analitik Çerezler */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">Analitik</span>
                <h3 className="font-semibold text-gray-900">Analitik (Performans) Çerezler</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Bu çerezler, ziyaretçilerin web sitemizi nasıl kullandığını anlamamıza yardımcı olur. 
                Toplanan veriler anonim olarak işlenir ve siteyi iyileştirmek için kullanılır.
              </p>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 font-semibold text-gray-900">Çerez Adı</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Amaç</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">_ga</td>
                      <td className="p-3">Google Analytics - Tekil ziyaretçi takibi</td>
                      <td className="p-3">2 yıl</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">_ga_*</td>
                      <td className="p-3">Google Analytics - Oturum durumu</td>
                      <td className="p-3">2 yıl</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">_gid</td>
                      <td className="p-3">Google Analytics - Günlük tekil ziyaretçi</td>
                      <td className="p-3">24 saat</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pazarlama Çerezleri */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">Pazarlama</span>
                <h3 className="font-semibold text-gray-900">Pazarlama (Hedefleme) Çerezleri</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Bu çerezler, size ilgi alanlarınıza uygun reklamlar göstermek ve reklam kampanyalarının 
                etkinliğini ölçmek için kullanılabilir. Açık rızanız olmadan bu çerezler etkinleştirilmez.
              </p>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 font-semibold text-gray-900">Çerez Adı</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Amaç</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">_fbp</td>
                      <td className="p-3">Meta (Facebook) Pixel - Reklam takibi</td>
                      <td className="p-3">3 ay</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">_pin_unauth</td>
                      <td className="p-3">Pinterest - Dönüşüm izleme</td>
                      <td className="p-3">1 yıl</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Üçüncü Taraf Çerezleri */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Üçüncü Taraf Çerezleri</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Web sitemizde belirli hizmetleri sunabilmek için üçüncü taraf sağlayıcıların çerezleri de 
            kullanılabilmektedir. Bu sağlayıcılar ve amaçları aşağıda belirtilmiştir:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>iyzico:</strong> Güvenli ödeme işlemleri için gerekli çerezler</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Google Analytics:</strong> Web sitesi trafik analizi ve kullanıcı davranışlarının anonim olarak izlenmesi</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Vercel:</strong> Web barındırma ve performans optimizasyonu</span>
            </li>
          </ul>
          <p className="text-gray-500 text-sm mt-4">
            Üçüncü taraf sağlayıcıların çerez politikaları hakkında detaylı bilgi için ilgili sağlayıcıların 
            gizlilik politikalarını incelemenizi tavsiye ederiz.
          </p>
        </section>

        {/* Hukuki Dayanak */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Çerez Kullanımının Hukuki Dayanağı</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Çerez kullanımımız aşağıdaki hukuki dayanaklara dayanmaktadır:
          </p>
          <div className="space-y-3">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Zorunlu Çerezler</h3>
              <p className="text-gray-600 text-sm">
                KVKK md. 5/2-c (Sözleşmenin ifası) ve md. 5/2-f (Meşru menfaat) kapsamında, açık rızanıza 
                gerek olmaksızın kullanılmaktadır. Bu çerezler, sipariş verme ve ödeme gibi temel işlevlerin 
                çalışması için zorunludur.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">İşlevsel Çerezler</h3>
              <p className="text-gray-600 text-sm">
                KVKK md. 5/2-f (Meşru menfaat) kapsamında kullanılmaktadır. Dil tercihi gibi kişiselleştirme 
                ayarlarınızı hatırlamak için gereklidir.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Analitik ve Pazarlama Çerezleri</h3>
              <p className="text-gray-600 text-sm">
                KVKK md. 5/1 (Açık rıza) kapsamında, yalnızca onayınız doğrultusunda kullanılmaktadır. 
                Bu çerezleri istediğiniz zaman devre dışı bırakabilirsiniz.
              </p>
            </div>
          </div>
        </section>

        {/* Çerez Yönetimi */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Çerez Tercihlerinizi Yönetme</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Çerez tercihlerinizi aşağıdaki yöntemlerle yönetebilirsiniz:
          </p>

          <div className="space-y-4">
            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Tarayıcı Ayarları</h3>
              <p className="text-gray-600 text-sm mb-3">
                Kullandığınız tarayıcının ayarlar menüsünden çerezleri yönetebilir, engelleyebilir veya 
                silebilirsiniz. Aşağıda popüler tarayıcılar için çerez yönetimi sayfalarına ulaşabilirsiniz:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/tr/kb/cerezleri-silme-web-sitelerinin-bilgilerini-kaldirma" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                    Apple Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/tr-tr/microsoft-edge/microsoft-edge-de-%C3%A7erezleri-silme-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Önemli Not:</strong> Zorunlu çerezleri devre dışı bırakmanız halinde, web sitemizin 
                bazı temel işlevleri (alışveriş sepeti, ödeme işlemleri vb.) düzgün çalışmayabilir. 
                Analitik ve pazarlama çerezlerini devre dışı bırakmak, site işlevselliğini etkilemez.
              </p>
            </div>
          </div>
        </section>

        {/* Veri Güvenliği */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Çerez Verilerinin Güvenliği</h2>
          <p className="text-gray-600 leading-relaxed">
            Çerezler aracılığıyla toplanan verilerinizin güvenliğini sağlamak için SSL/TLS şifreleme, 
            güvenli bağlantı protokolleri ve erişim kontrolü mekanizmaları kullanmaktayız. Çerez verileri, 
            yalnızca belirtilen amaçlar doğrultusunda işlenmekte ve yetkisiz erişime karşı korunmaktadır.
          </p>
        </section>

        {/* KVKK Hakları */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. KVKK Kapsamındaki Haklarınız</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Çerezler aracılığıyla işlenen kişisel verilerinizle ilgili olarak, KVKK&apos;nın 11. maddesi 
            kapsamında aşağıdaki haklara sahipsiniz:
          </p>
          <div className="bg-stone-50 rounded-xl p-6">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">a)</span>
                <span>Çerezler aracılığıyla kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">b)</span>
                <span>İşlenen verilere ilişkin bilgi talep etme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">c)</span>
                <span>Çerez verilerinizin silinmesini veya yok edilmesini isteme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">ç)</span>
                <span>Açık rızanızı her zaman geri çekme hakkı</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-600 leading-relaxed mt-4">
            Haklarınızı kullanmak için{' '}
            <a href="mailto:elsdreamfactory@gmail.com" className="text-amber-600 hover:text-amber-700 underline">
              elsdreamfactory@gmail.com
            </a>{' '}
            adresine başvurabilirsiniz. Detaylı bilgi için{' '}
            <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
              Gizlilik Politikamızı
            </Link>{' '}
            inceleyebilirsiniz.
          </p>
        </section>

        {/* Politika Güncellemeleri */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Politika Güncellemeleri</h2>
          <p className="text-gray-600 leading-relaxed">
            Bu Çerez Politikası, yasal düzenlemelerdeki değişiklikler, kullanılan çerez türlerindeki 
            güncellemeler veya hizmetlerimizdeki değişiklikler doğrultusunda zaman zaman güncellenebilir. 
            Güncellemeler, bu sayfada yayımlandığı tarihte yürürlüğe girer. Önemli değişikliklerde 
            sizi bilgilendirmek için makul çabayı göstereceğiz.
          </p>
        </section>

        {/* İletişim CTA */}
        <section className="bg-stone-900 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Çerezler Hakkında Sorunuz mu Var?</h2>
          <p className="text-stone-400 mb-6">
            Çerez politikamız veya kişisel verilerinizin korunması hakkında her türlü sorunuz için 
            bizimle iletişime geçebilirsiniz.
          </p>
          <a
            href="mailto:elsdreamfactory@gmail.com"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            elsdreamfactory@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
}
