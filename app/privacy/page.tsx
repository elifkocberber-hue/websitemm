import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | El\'s Dream Factory',
  description: 'El\'s Dream Factory gizlilik politikası ve KVKK aydınlatma metni.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-amber-600 transition-colors">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Gizlilik Politikası</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gizlilik Politikası</h1>
        <p className="text-gray-500 mb-10">Son güncelleme: 1 Mart 2026</p>

        {/* KVKK Aydınlatma Metni */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            6698 Sayılı KVKK Kapsamında Aydınlatma Metni
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            El&apos;s Dream Factory (&quot;Şirket&quot;) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) 
            kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin hukuka uygun olarak işlenmesine büyük önem vermekteyiz. 
            İşbu aydınlatma metni, KVKK&apos;nın 10. maddesi ile Aydınlatma Yükümlülüğünün Yerine Getirilmesinde 
            Uyulacak Usul ve Esaslar Hakkında Tebliğ çerçevesinde hazırlanmıştır.
          </p>
        </section>

        {/* Veri Sorumlusu */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Veri Sorumlusu</h2>
          <div className="bg-stone-50 rounded-xl p-6">
            <p className="text-gray-600 leading-relaxed">
              <strong>Unvan:</strong> El&apos;s Dream Factory<br />
              <strong>Adres:</strong> Kütahya, Türkiye<br />
              <strong>E-posta:</strong> info@elsdreamfactory.com<br />
              <strong>Web:</strong> elsdreamfactory.com
            </p>
          </div>
        </section>

        {/* İşlenen Kişisel Veriler */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. İşlenen Kişisel Veriler</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Hizmetlerimizi sunabilmek amacıyla aşağıdaki kişisel verileriniz işlenmektedir:
          </p>
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Kimlik Bilgileri</h3>
              <p className="text-gray-600 text-sm">Ad, soyad</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">İletişim Bilgileri</h3>
              <p className="text-gray-600 text-sm">E-posta adresi, telefon numarası, teslimat adresi, fatura adresi</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">İşlem Güvenliği Bilgileri</h3>
              <p className="text-gray-600 text-sm">IP adresi, tarayıcı bilgileri, çerez verileri, oturum bilgileri</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Alışveriş Bilgileri</h3>
              <p className="text-gray-600 text-sm">Sipariş geçmişi, sepet bilgileri, ödeme bilgileri (kart bilgileri tarafımızca saklanmaz)</p>
            </div>
          </div>
        </section>

        {/* Kişisel Verilerin İşlenme Amaçları */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Kişisel Verilerin İşlenme Amaçları</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Kişisel verileriniz, KVKK&apos;nın 5. ve 6. maddelerinde belirtilen hukuki sebeplere dayalı olarak 
            aşağıdaki amaçlarla işlenmektedir:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Sipariş süreçlerinin yönetilmesi ve ürün teslimatının gerçekleştirilmesi</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Ödeme işlemlerinin güvenli şekilde tamamlanması</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Yasal yükümlülüklerin yerine getirilmesi (fatura düzenleme, vergi mevzuatı)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Müşteri ilişkilerinin yönetimi, talep ve şikayetlerin değerlendirilmesi</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Ürün ve hizmetlerin iyileştirilmesine yönelik analiz çalışmaları</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Bilgi güvenliği süreçlerinin yürütülmesi</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Açık rızanızın bulunması halinde, kampanya ve duyuruların iletilmesi</span>
            </li>
          </ul>
        </section>

        {/* Hukuki Sebepler */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Kişisel Veri İşlemenin Hukuki Sebepleri</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Kişisel verileriniz, KVKK&apos;nın 5. maddesinde yer alan aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Sözleşmenin ifası:</strong> Satış sözleşmesinin kurulması ve yerine getirilmesi için zorunlu olan veriler (md. 5/2-c)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Hukuki yükümlülük:</strong> Vergi, muhasebe ve diğer yasal düzenlemelere uyum (md. 5/2-ç)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Meşru menfaat:</strong> Hizmet kalitesinin artırılması ve güvenlik tedbirleri (md. 5/2-f)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Açık rıza:</strong> Pazarlama ve promosyon faaliyetleri (md. 5/1)</span>
            </li>
          </ul>
        </section>

        {/* Kişisel Verilerin Aktarılması */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Kişisel Verilerin Aktarılması</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Kişisel verileriniz, KVKK&apos;nın 8. ve 9. maddelerine uygun olarak aşağıdaki taraflarla paylaşılabilir:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Ödeme kuruluşları:</strong> Ödeme işlemlerinin güvenli gerçekleştirilmesi için (iyzico)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Kargo şirketleri:</strong> Siparişlerin teslimatının sağlanması için</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Yasal merciler:</strong> Mevzuat gereği yetkili kamu kurum ve kuruluşları</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span><strong>Hizmet sağlayıcılar:</strong> Web barındırma (Vercel), veritabanı (Supabase) gibi teknik altyapı sağlayıcıları</span>
            </li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Yurt dışına aktarım:</strong> Hizmet sağlayıcılarımızın sunucuları yurt dışında bulunabilir. 
              Bu aktarımlar, KVKK&apos;nın 9. maddesi kapsamında yeterli korumayı sağlayan ülkelere veya 
              veri sorumlusunun yeterli bir korumayı yazılı olarak taahhüt ettiği hallerde gerçekleştirilmektedir.
            </p>
          </div>
        </section>

        {/* Kişisel Verilerin Saklanması */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Kişisel Verilerin Saklama Süresi</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen 
            zamanaşımı süreleri boyunca saklanmaktadır:
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50">
                  <th className="text-left p-4 font-semibold text-gray-900">Veri Kategorisi</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Saklama Süresi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-t border-gray-100">
                  <td className="p-4">Sipariş ve fatura bilgileri</td>
                  <td className="p-4">10 yıl (Vergi mevzuatı)</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-4">Ticari iletişim kayıtları</td>
                  <td className="p-4">3 yıl (Ticari İletişim Yönetmeliği)</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-4">Tüketici işlem kayıtları</td>
                  <td className="p-4">3 yıl (Tüketici mevzuatı)</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-4">Log kayıtları</td>
                  <td className="p-4">2 yıl (5651 sayılı Kanun)</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-4">Çerez verileri</td>
                  <td className="p-4">Oturum süresi veya en fazla 1 yıl</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Çerezler */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Çerez Politikası</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Web sitemizde kullanıcı deneyimini iyileştirmek amacıyla çerezler (cookies) kullanılmaktadır:
          </p>
          <div className="space-y-3">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Zorunlu Çerezler</h3>
              <p className="text-gray-600 text-sm">Sitenin düzgün çalışması için gerekli olan çerezler (oturum, sepet bilgileri)</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Analitik Çerezler</h3>
              <p className="text-gray-600 text-sm">Ziyaretçi istatistiklerini anlamak için kullanılan anonim çerezler</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-3">
            Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durumda sitenin bazı 
            işlevleri düzgün çalışmayabilir.
          </p>
        </section>

        {/* Veri Güvenliği */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Kişisel Verilerin Güvenliği</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            KVKK&apos;nın 12. maddesi uyarınca, kişisel verilerinizin güvenliğini sağlamak için gerekli teknik 
            ve idari tedbirleri almaktayız:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>SSL/TLS şifreleme ile güvenli veri iletimi</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Şifreleme (bcrypt) ile parola koruması</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Erişim kontrolü ve yetkilendirme mekanizmaları</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Güvenlik duvarı ve saldırı önleme sistemleri</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
              <span>Ödeme bilgileri doğrudan ödeme altyapısı sağlayıcısı (iyzico) tarafından işlenir; kart bilgileri sistemimizde saklanmaz</span>
            </li>
          </ul>
        </section>

        {/* İlgili Kişi Hakları */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. KVKK Kapsamındaki Haklarınız</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            KVKK&apos;nın 11. maddesi gereğince aşağıdaki haklara sahipsiniz:
          </p>
          <div className="bg-stone-50 rounded-xl p-6">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">a)</span>
                <span>Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">b)</span>
                <span>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">c)</span>
                <span>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">ç)</span>
                <span>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">d)</span>
                <span>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">e)</span>
                <span>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">f)</span>
                <span>(d) ve (e) bentleri uyarınca yapılan işlemlerin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">g)</span>
                <span>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold">ğ)</span>
                <span>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Başvuru Yöntemi */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Başvuru Yöntemi</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yöntemlerle bize başvurabilirsiniz:
          </p>
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
                <span><strong>E-posta:</strong> info@elsdreamfactory.com adresine kimliğinizi tespit edici bilgiler ile birlikte yazılı başvuru</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-0.5">&#8226;</span>
                <span><strong>Posta:</strong> Kütahya, Türkiye adresine noter aracılığıyla veya iadeli taahhütlü mektup ile başvuru</span>
              </li>
            </ul>
            <p className="text-gray-500 text-sm mt-4">
              Başvurular, talebinizin niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içinde 
              ücretsiz olarak sonuçlandırılacaktır. İşlemin ayrıca bir maliyet gerektirmesi halinde, 
              Kişisel Verileri Koruma Kurulunca belirlenen tarifedeki ücret alınabilir.
            </p>
          </div>
        </section>

        {/* Politika Değişiklikleri */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">11. Politika Değişiklikleri</h2>
          <p className="text-gray-600 leading-relaxed">
            İşbu gizlilik politikası, yasal düzenlemelerdeki değişiklikler veya hizmetlerimizdeki 
            güncellemeler doğrultusunda zaman zaman değiştirilebilir. Güncellemeler web sitemizde 
            yayımlandığı tarihte yürürlüğe girer. Önemli değişiklikler hakkında sizi bilgilendirmek 
            için makul çabayı göstereceğiz.
          </p>
        </section>

        {/* İletişim CTA */}
        <section className="bg-stone-900 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Sorularınız mı var?</h2>
          <p className="text-stone-400 mb-6">
            Gizlilik politikamız veya kişisel verilerinizin işlenmesiyle ilgili her türlü sorunuz için bizimle iletişime geçin.
          </p>
          <a
            href="mailto:info@elsdreamfactory.com"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            info@elsdreamfactory.com
          </a>
        </section>
      </div>
    </div>
  );
}
