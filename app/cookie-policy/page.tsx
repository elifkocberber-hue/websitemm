import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Politikası | El\'s Dream Factory',
  description: 'El\'s Dream Factory çerez politikası. Web sitemizde kullanılan çerezler, kullanım amaçları ve kontrol haklarınız hakkında detaylı bilgi.',
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">El&apos;s Dream Factory Çerez Politikası</h1>
        <p className="text-gray-500 mb-10">Yürürlük Tarihi: 26.04.2026</p>

        {/* Giriş */}
        <section className="mb-12">
          <p className="text-gray-600 leading-relaxed mb-4">
            Biz, El&apos;s Dream Factory olarak, seramik ürünlerimizin tanıtımını ve satışını yaptığımız{' '}
            <a href="https://www.elsdreamfactory.com" className="text-amber-600 hover:text-amber-700 underline">www.elsdreamfactory.com</a>{' '}
            adresindeki internet sitemizde (&quot;Site&quot;) kullanıcı deneyimini geliştirmek ve hizmetlerimizi en iyi şekilde
            sunabilmek amacıyla çerezler ve benzeri teknolojiler kullanıyoruz.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Bu Çerez Politikası&apos;nın amacı, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili
            ikincil mevzuat uyarınca, Site&apos;de kullanılan çerez türleri, kullanım amaçları ve bu çerezler üzerindeki
            kontrol haklarınız hakkında sizleri şeffaf bir şekilde bilgilendirmektir.
          </p>
        </section>

        {/* 1. Çerez Nedir? */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Çerez Nedir?</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-gray-600 text-sm leading-relaxed">
              Çerez, bir internet sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza, tabletinize veya
              mobil cihazınıza kaydedilen küçük boyutlu metin dosyalarıdır. Çerezler yalnızca internet ortamındaki ziyaret
              geçmişinize dair bilgiler içerir; cihazınızda depolanmış kişisel dosyalarınıza erişmez veya bu dosyaları toplamaz.
            </p>
          </div>
        </section>

        {/* 2. Hangi Tür Çerezleri Kullanıyoruz? */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Hangi Tür Çerezleri Kullanıyoruz?</h2>
          <p className="text-gray-600 text-sm mb-6">
            Sitemizde, kullanım sürelerine ve amaçlarına göre aşağıdaki çerez türleri kullanılmaktadır:
          </p>

          {/* 2.1 Kullanım Süresine Göre */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-3">2.1. Kullanım Süresine Göre Çerezler</h3>
            <div className="space-y-3">
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-2">Oturum Çerezleri (Geçici Çerezler)</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Bu çerezler, siz Site&apos;yi ziyaret ettiğiniz süre boyunca oturumunuzun kesintisiz devam etmesini sağlar.
                  Örneğin, alışveriş sepetinize eklediğiniz ürünlerin sayfalar arasında gezinirken kaybolmamasını oturum
                  çerezleriyle sağlarız. Tarayıcınızı kapattığınızda bu çerezler otomatik olarak silinir.
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-2">Kalıcı Çerezler</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tarayıcınızı kapattıktan sonra bile cihazınızda kalmaya devam eden ve belirli bir süre veya siz silene
                  kadar saklanan çerezlerdir. Dil tercihinizi hatırlamak veya bir sonraki ziyaretinizde size daha hızlı
                  bir deneyim sunmak için kalıcı çerezlerden faydalanırız.
                </p>
              </div>
            </div>
          </div>

          {/* 2.2 Kullanım Amaçlarına Göre */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">2.2. Kullanım Amaçlarına Göre Çerezler</h3>
            <p className="text-gray-600 text-sm mb-4">
              Bu kategoriler, KVKK&apos;nın &quot;açık rıza&quot; şartına uyum açısından kritik öneme sahiptir.
              Sitemizde kullanılan amaç bazlı çerezler şunlardır:
            </p>
            <div className="space-y-4">

              {/* Zorunlu */}
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">Zorunlu</span>
                  <h4 className="font-semibold text-gray-900">Zorunlu Çerezler (Kesinlikle Gerekli)</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-700">Amaç:</span> Bu çerezler, web sitemizin doğru ve güvenli bir şekilde çalışabilmesi için teknik olarak zorunludur. Site üzerinde gezinmenizi, güvenlik duvarımızın çalışmasını ve üyelik girişi, alışveriş sepeti gibi talep ettiğiniz hizmetlerin sağlanmasını mümkün kılar.</p>
                  <p><span className="font-medium text-gray-700">Kullanım Örneklerimiz:</span> Oturum açma bilgilerinin doğrulanması, sunucu yükünün dengelenmesi, alışveriş sepetindeki ürünlerin hatırlanması.</p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                    <p><span className="font-medium text-orange-800">Onay Durumu:</span> Zorunlu çerezler herhangi bir kişisel veri toplamadığı veya hizmetin sunulması için zorunlu olduğu için, bu çerezler için ayrıca açık rızanız alınmaz. Siteyi kullanmanızla otomatik olarak devreye girerler.</p>
                  </div>
                </div>
              </div>

              {/* İşlevsellik */}
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">İşlevsel</span>
                  <h4 className="font-semibold text-gray-900">İşlevsellik Çerezleri (İşlevsel / Tercih Çerezleri)</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-700">Amaç:</span> Sitemizi daha kullanışlı ve kişiselleştirilmiş hale getirmek için tercihlerinizi (örneğin dil seçimi, bölge tercihi, ürün listeleme şekli) hatırlamak amacıyla kullanılır.</p>
                  <p><span className="font-medium text-gray-700">Kullanım Örneklerimiz:</span> Ziyaret ettiğiniz ülkeye göre fiyatlandırmanın ve dilin otomatik ayarlanması, &quot;karşılaştırma&quot; listenizin saklanması.</p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                    <p><span className="font-medium text-orange-800">Onay Durumu:</span> İşlevsellik çerezleri açık rızanıza tabidir. Bu çerezleri kabul etmezseniz, sitenin bazı özellikleri (örneğin dil tercihinin hatırlanması) çalışmayabilir.</p>
                  </div>
                </div>
              </div>

              {/* Performans ve Analitik */}
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">Analitik</span>
                  <h4 className="font-semibold text-gray-900">Performans ve Analitik Çerezleri</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-700">Amaç:</span> Siteyi nasıl kullandığınıza dair anonim istatistiksel veriler toplayarak sitenin performansını ölçmek, hataları tespit etmek ve kullanıcı deneyimini iyileştirmek için kullanılır. Bu çerezler sayesinde hangi sayfaların daha çok ziyaret edildiğini veya hangi seramik ürünlerine daha fazla ilgi gösterildiğini anonim olarak analiz ederiz.</p>
                  <p><span className="font-medium text-gray-700">Kullanım Örneklerimiz:</span> Google Analytics, Hotjar gibi araçlar aracılığıyla sayfa görüntülenme sayısı, ziyaret süresi gibi metriklerin izlenmesi.</p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                    <p><span className="font-medium text-orange-800">Onay Durumu:</span> Performans ve analitik çerezleri açık rızanıza tabidir. Onay vermediğiniz takdirde hangi ürünlerimizin daha popüler olduğunu analiz etme imkânımız kısıtlanır, ancak Site&apos;yi sorunsuz kullanabilirsiniz.</p>
                  </div>
                </div>
              </div>

              {/* Hedefleme ve Pazarlama */}
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">Pazarlama</span>
                  <h4 className="font-semibold text-gray-900">Hedefleme ve Pazarlama Çerezleri</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-700">Amaç:</span> İlgi alanlarınıza ve gezinme alışkanlıklarınıza göre size özel reklam ve kampanyalar göstermek, reklam kampanyalarımızın etkinliğini ölçmek ve sizi sosyal medya platformları üzerinden tanımak için kullanılır. Bu çerezler, işbirliği yaptığımız üçüncü taraf reklam ortakları tarafından da yerleştirilebilir.</p>
                  <p><span className="font-medium text-gray-700">Kullanım Örneklerimiz:</span> Facebook Pixel, Google Ads Remarketing etiketleri. Örneğin, incelediğiniz el yapımı bir vazoyu daha sonra başka bir sitede reklam olarak görebilmeniz bu çerezler sayesinde mümkün olur.</p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                    <p><span className="font-medium text-orange-800">Onay Durumu:</span> Hedefleme ve pazarlama çerezleri, açık rızanıza tabidir. Bu çerezleri kabul etmediğiniz sürece size özelleştirilmiş seramik ürün reklamları gösterilmeyecek, yalnızca genel tanıtımlarla karşılaşacaksınız. Onay vermemeniz halinde karşılaşacağınız reklam sayısında bir azalma olmaz.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Hukuki Dayanak */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Çerezler Aracılığıyla Kişisel Verilerin İşlenmesi ve Hukuki Sebepler</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Yukarıda sayılan çerezler aracılığıyla, IP adresiniz, ziyaret tarih/saatiniz, konum bilginiz,
            görüntülediğiniz ürünler gibi çevrimiçi tanımlayıcılar işlenebilmektedir. Bu veriler;
          </p>
          <div className="space-y-3">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Zorunlu Çerezler</h3>
              <p className="text-gray-600 text-sm">
                KVKK m.5/2(f) kapsamında &quot;ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla,
                veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması&quot; hukuki sebebine
                dayanarak işlenmektedir.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">İşlevsellik, Performans/Analitik ve Hedefleme/Pazarlama Çerezleri</h3>
              <p className="text-gray-600 text-sm">
                KVKK m.5/1 uyarınca, sitemize ilk ziyaretinizde önünüze çıkan çerez yönetim paneli (banner)
                aracılığıyla vermiş olduğunuz açık rızanıza dayanarak işlenmektedir.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Çerezleri Yönetme */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Çerezleri Nasıl Kontrol Edebilir ve Yönetebilirsiniz?</h2>
          <p className="text-gray-600 text-sm mb-5">Çerez tercihlerinizi üç farklı şekilde yönetmeniz mümkündür:</p>
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Çerez Yönetim Panelimiz (Rıza Tercihlerini Değiştir)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sitemizi ilk ziyaret ettiğinizde karşınıza çıkan çerez banner&apos;ındaki &quot;Tercihleri Yönet&quot;
                butonuna tıklayarak, zorunlu çerezler dışındaki tüm kategorileri (İşlevsellik, Analitik, Pazarlama)
                tek tek açıp kapatabilirsiniz. Daha sonra fikriniz değişirse, web sitemizin en altında bulunan
                &quot;Çerez Ayarları&quot; bağlantısına tıklayarak bu paneli her an yeniden açabilir ve verdiğiniz
                rızayı aynı kolaylıkla geri alabilirsiniz.
              </p>
            </div>
            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Tarayıcı Ayarları Üzerinden Yönetim</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Chrome, Safari, Firefox gibi tüm modern internet tarayıcıları, çerezleri engellemek veya silmek
                için ayar seçenekleri sunar. Genellikle &quot;Gizlilik ve Güvenlik&quot; ya da &quot;Ayarlar&quot; menüsü
                altından &quot;Çerezler&quot; bölümüne giderek tüm çerezleri silebilir veya üçüncü taraf çerezlerini
                engelleyebilirsiniz.
              </p>
              <ul className="space-y-2 text-sm">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/tr/kb/cerezleri-silme-web-sitelerinin-bilgilerini-kaldirma" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/tr-tr/microsoft-edge/microsoft-edge-de-%C3%A7erezleri-silme-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">Microsoft Edge</a></li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                <p className="text-gray-700 text-xs leading-relaxed">
                  <strong>Not:</strong> Bu yöntemle çerezleri tamamen silerseniz, zorunlu çerezler de dâhil tüm
                  tercihleriniz sıfırlanacak ve bir sonraki ziyaretinizde sizden yeniden onay istenecektir.
                </p>
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Üçüncü Taraf Çerezlerini Doğrudan Yönetme</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Sitemizde kullanılan üçüncü taraf hizmetlerinin kendi kontrol panellerinden de bu çerezlere
                özel ayarlar yapmanız mümkündür:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                    Google Analytics Devre Dışı Bırakma
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                    Facebook Reklam Tercihleri
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Değişiklikler */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Çerez Politikası&apos;nda Değişiklikler</h2>
          <p className="text-gray-600 leading-relaxed">
            Bu Çerez Politikası&apos;nı, mevzuata uyum sağlamak veya Site&apos;deki uygulamalarımızı güncellemek
            amacıyla zaman zaman değiştirebiliriz. Güncel politikaya her zaman{' '}
            <a href="https://www.elsdreamfactory.com/cerez-politikasi" className="text-amber-600 hover:text-amber-700 underline">
              www.elsdreamfactory.com/cerez-politikasi
            </a>{' '}
            adresinden ulaşabilirsiniz. Önemli değişiklikler olması halinde sitemiz üzerinden duyuru yaparak
            sizi bilgilendiririz.
          </p>
        </section>

        {/* 6. İletişim ve Veri Sahibi Hakları */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">6. İletişim ve Veri Sahibi Haklarınız</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            KVKK&apos;nın 11. maddesi uyarınca, El&apos;s Dream Factory&apos;ye başvurarak aşağıdaki haklara sahipsiniz:
          </p>
          <div className="bg-stone-50 rounded-xl p-6 mb-5">
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold mt-0.5">•</span>
                <span>Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold mt-0.5">•</span>
                <span>İşlenmişse buna ilişkin bilgi talep etme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold mt-0.5">•</span>
                <span>İşlenme amacını ve bunlara uygun kullanılıp kullanılmadığını öğrenme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold mt-0.5">•</span>
                <span>Yurt içinde / yurt dışında aktarıldığı 3. kişileri bilme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold mt-0.5">•</span>
                <span>Eksik / yanlış işlenmişse düzeltilmesini isteme ve bu kapsamda yapılan işlemin aktarıldığı 3. kişilere bildirilmesini isteme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold mt-0.5">•</span>
                <span>Verilerin silinmesini veya yok edilmesini isteme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold mt-0.5">•</span>
                <span>İşlenen verilerin otomatik sistemler ile analizi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-semibold mt-0.5">•</span>
                <span>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Bu haklarınıza ilişkin taleplerinizi, &quot;Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ&quot;e
            uygun olarak aşağıdaki iletişim kanallarından bize iletebilirsiniz. Başvurularınız en geç 30 gün
            içinde değerlendirilerek tarafınıza yazılı olarak veya elektronik ortamda dönüş yapılacaktır.
          </p>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="font-semibold text-gray-900 mb-2">Veri Sorumlusu: El&apos;s Dream Factory</p>
            <p className="text-gray-600 text-sm">
              E-Posta:{' '}
              <a href="mailto:elsdreamfactory@gmail.com" className="text-amber-600 hover:text-amber-700 underline">
                elsdreamfactory@gmail.com
              </a>
            </p>
            <p className="text-gray-600 text-sm">
              Web:{' '}
              <a href="https://www.elsdreamfactory.com" className="text-amber-600 hover:text-amber-700 underline">
                www.elsdreamfactory.com
              </a>
            </p>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            Ayrıca{' '}
            <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
              Gizlilik Politikamızı
            </Link>{' '}
            da inceleyebilirsiniz.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-[#5C0A1A] p-8 text-center">
          <h2 className="heading-serif text-xl text-bone mb-3">Sorularınız mı var?</h2>
          <p className="text-bone/60 mb-6">
            Çerez politikamız veya kişisel verilerinizin korunması hakkında her türlü sorunuz için
            bizimle iletişime geçebilirsiniz.
          </p>
          <a
            href="mailto:elsdreamfactory@gmail.com"
            className="inline-block bg-white text-[#5C0A1A] px-8 py-3 text-sm tracking-wider uppercase hover:bg-bone transition-colors duration-300"
          >
            elsdreamfactory@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
}
