import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Politikası | El\'s Dream Factory',
  description: 'El\'s Dream Factory çerez ve tarayıcı depolama politikası. Web sitemizde kullanılan teknolojiler hakkında detaylı bilgi.',
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
        <p className="text-gray-500 mb-10">Son güncelleme: 8 Mart 2026</p>

        {/* Giriş */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Çerez ve Tarayıcı Depolama Teknolojileri Hakkında
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            El&apos;s Dream Factory (&quot;biz&quot;, &quot;sitemiz&quot;) olarak, web sitemizi ziyaret ettiğinizde
            deneyiminizi kişiselleştirmek, sitemizin düzgün çalışmasını sağlamak ve hizmetlerimizi
            iyileştirmek amacıyla çerezler (cookies) ile tarayıcı depolama teknolojileri
            (localStorage ve sessionStorage) kullanmaktayız.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve
            Çerez ve Diğer Tanımlama Teknolojilerine Yönelik mevzuat kapsamında hazırlanmıştır.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Önemli:</strong> Sitemiz yalnızca kendi altyapımıza ait (birinci taraf) depolama teknolojileri
              kullanmaktadır. Google Analytics, Meta Pixel, Pinterest gibi <strong>üçüncü taraf izleme araçları
              kullanılmamaktadır.</strong> Ziyaretçi analitiği tamamen kendi sunucularımızda gerçekleştirilmekte
              ve verileriniz üçüncü taraflarla paylaşılmamaktadır.
            </p>
          </div>
        </section>

        {/* Çerez Nedir? */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Çerez ve Tarayıcı Depolama Nedir?</h2>
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">HTTP Çerezleri (Cookies)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza yerleştirilen küçük
                metin dosyalarıdır. Sunucu tarafından ayarlanır ve her istekte tarayıcı tarafından otomatik
                olarak iletilir.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Yerel Depolama (localStorage)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tarayıcınızın cihazınızda kalıcı olarak sakladığı verilerdir. Tarayıcı kapatıldıktan sonra
                da korunur. Yalnızca JavaScript aracılığıyla erişilebilir; sunucuya otomatik iletilmez.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Oturum Depolama (sessionStorage)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Yalnızca tarayıcı sekmesi açık olduğu süre boyunca tutulan geçici verilerdir.
                Sekme veya tarayıcı kapatıldığında otomatik olarak silinir.
              </p>
            </div>
          </div>
        </section>

        {/* Kullanılan Teknolojiler */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Kullandığımız Depolama Teknolojileri</h2>

          {/* Zorunlu */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Zorunlu</span>
                <h3 className="font-semibold text-gray-900">Zorunlu — Sitenin Çalışması İçin Gerekli</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Bu veriler sitemizin temel işlevleri için zorunludur. Devre dışı bırakılmaları durumunda
                oturum açma, sepet ve ödeme gibi özellikler çalışmayabilir.
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 font-semibold text-gray-900">Anahtar</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Tür</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Amaç</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">adminToken</td>
                      <td className="p-3">HTTP Çerezi</td>
                      <td className="p-3">Yönetici paneli oturum doğrulaması (yalnızca yöneticiler için). HttpOnly, Secure, SameSite=Strict.</td>
                      <td className="p-3 whitespace-nowrap">24 saat<br/><span className="text-xs text-gray-400">(beni hatırla: 7 gün)</span></td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">user_session</td>
                      <td className="p-3">localStorage</td>
                      <td className="p-3">Giriş yapmış kullanıcının oturum bilgileri (ad, soyad, e-posta). Çıkış yapıldığında silinir.</td>
                      <td className="p-3">Çıkışa kadar</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">ceramic-cart</td>
                      <td className="p-3">localStorage</td>
                      <td className="p-3">Alışveriş sepeti içeriği. Sayfalar arasında sepetinizin korunmasını sağlar.</td>
                      <td className="p-3">Kalıcı</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">cookie_consent</td>
                      <td className="p-3">localStorage</td>
                      <td className="p-3">Çerez tercih kararınızın kaydedilmesi (kabul / red / özel).</td>
                      <td className="p-3">Kalıcı</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">cookie_preferences</td>
                      <td className="p-3">localStorage</td>
                      <td className="p-3">Analitik ve pazarlama çerezlerine ilişkin ayrıntılı tercihleriniz.</td>
                      <td className="p-3">Kalıcı</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* İşlevsel */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">İşlevsel</span>
                <h3 className="font-semibold text-gray-900">İşlevsel — Kişiselleştirme</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Tercihlerinizi hatırlayarak daha iyi bir deneyim sunmak için kullanılır.
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 font-semibold text-gray-900">Anahtar</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Tür</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Amaç</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">ceramic-favorites</td>
                      <td className="p-3">localStorage</td>
                      <td className="p-3">Favorilere eklediğiniz ürünlerin listesi. Hesabınıza bağlı değildir; cihaz bazlıdır.</td>
                      <td className="p-3">Kalıcı</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">language</td>
                      <td className="p-3">localStorage</td>
                      <td className="p-3">Dil tercihinin hatırlanması (TR / EN).</td>
                      <td className="p-3">Kalıcı</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analitik */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">Analitik</span>
                <h3 className="font-semibold text-gray-900">Analitik — Birinci Taraf Ziyaretçi İstatistiği</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Sitemizin nasıl kullanıldığını anlamamız için kullanılır. Veriler yalnızca kendi sunucularımızda
                (Supabase) depolanır; hiçbir üçüncü tarafla paylaşılmaz.
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left p-3 font-semibold text-gray-900">Anahtar</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Tür</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Amaç</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-t border-gray-100">
                      <td className="p-3 font-mono text-xs">visitor_session_id</td>
                      <td className="p-3">sessionStorage</td>
                      <td className="p-3">
                        Tek bir ziyaret oturumunu tanımlayan rastgele ID. Ziyaretçi sayısı,
                        sayfa yolu, referrer ve cihaz bilgisi gibi anonim istatistikler toplanır.
                        Sekme kapatıldığında silinir.
                      </td>
                      <td className="p-3">Sekme kapanınca silinir</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-500 text-xs mt-3">
                Toplanan analitik veriler: sayfa yolu, referrer kaynağı, ekran boyutu, tarayıcı/işletim sistemi,
                ülke/şehir (Vercel altyapısı üzerinden). Kişisel kimlik bilgisi toplanmaz.
              </p>
            </div>
          </div>
        </section>

        {/* Hukuki Dayanak */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Hukuki Dayanak</h2>
          <div className="space-y-3">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Zorunlu ve İşlevsel</h3>
              <p className="text-gray-600 text-sm">
                KVKK md. 5/2-c (sözleşmenin ifası) ve md. 5/2-f (meşru menfaat) kapsamında,
                açık rızanıza gerek olmaksızın kullanılmaktadır.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Analitik</h3>
              <p className="text-gray-600 text-sm">
                KVKK md. 5/2-f (meşru menfaat) kapsamında, anonim istatistik amaçlı kullanılmaktadır.
                Çerez yönetim panelinden analitik seçeneğini kapatabilirsiniz.
              </p>
            </div>
          </div>
        </section>

        {/* Tercih Yönetimi */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Tercihlerinizi Yönetme</h2>
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Çerez Yönetim Paneli</h3>
              <p className="text-gray-600 text-sm">
                Sitemizin sağ alt köşesindeki çerez bildiriminde &quot;Kişiselleştir&quot; seçeneğine tıklayarak
                analitik çerezleri istediğiniz zaman açıp kapatabilirsiniz.
              </p>
            </div>
            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Tarayıcı Ayarları</h3>
              <p className="text-gray-600 text-sm mb-3">
                Tarayıcınızın ayarlarından tüm çerez ve yerel depolama verilerini silebilirsiniz:
              </p>
              <ul className="space-y-2 text-sm">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/tr/kb/cerezleri-silme-web-sitelerinin-bilgilerini-kaldirma" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/tr-tr/microsoft-edge/microsoft-edge-de-%C3%A7erezleri-silme-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">Microsoft Edge</a></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Not:</strong> Zorunlu depolama verilerini (sepet, oturum) tarayıcıdan silerseniz
                alışveriş sepetiniz ve oturumunuz sıfırlanır. Analitik ve işlevsel verilerin silinmesi
                site işlevselliğini etkilemez.
              </p>
            </div>
          </div>
        </section>

        {/* KVKK Hakları */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. KVKK Kapsamındaki Haklarınız</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Bu teknolojiler aracılığıyla işlenen verilerinizle ilgili KVKK&apos;nın 11. maddesi kapsamında:
          </p>
          <div className="bg-stone-50 rounded-xl p-6">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">a)</span>
                <span>Hangi verilerin işlendiğini öğrenme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">b)</span>
                <span>İşlenen verilere ilişkin bilgi talep etme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">c)</span>
                <span>Verilerinizin silinmesini veya yok edilmesini isteme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">ç)</span>
                <span>Açık rızanızı her zaman geri çekme</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-600 leading-relaxed mt-4">
            Talepleriniz için{' '}
            <a href="mailto:elsdreamfactory@gmail.com" className="text-amber-600 hover:text-amber-700 underline">
              elsdreamfactory@gmail.com
            </a>{' '}
            adresine başvurabilirsiniz. Ayrıca{' '}
            <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
              Gizlilik Politikamızı
            </Link>{' '}
            inceleyebilirsiniz.
          </p>
        </section>

        {/* Güncellemeler */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Politika Güncellemeleri</h2>
          <p className="text-gray-600 leading-relaxed">
            Bu politika, yasal düzenlemelerdeki değişiklikler veya kullandığımız teknolojilerdeki
            güncellemeler doğrultusunda zaman zaman revize edilebilir. Önemli değişiklikler bu sayfada
            duyurulur ve &quot;Son güncelleme&quot; tarihi güncellenir.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-stone-900 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Sorularınız mı var?</h2>
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
