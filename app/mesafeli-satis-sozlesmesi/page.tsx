import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi | El\'s Dream Factory',
  description: 'El\'s Dream Factory mesafeli satış sözleşmesi. 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında hazırlanmıştır.',
};

export default function MesafeliSatisSozlesmesiPage() {
  const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12">
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-amber-600 transition-colors">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">Mesafeli Satış Sözleşmesi</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mesafeli Satış Sözleşmesi</h1>
        <p className="text-gray-500 mb-10">6502 Sayılı TKHK ve Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.</p>

        {/* Taraflar */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">1. Taraflar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-50 rounded-xl p-6">
              <p className="font-semibold text-gray-900 mb-3">SATICI</p>
              <div className="space-y-1 text-gray-600 text-sm">
                <p><strong>Ticaret Unvanı:</strong> ELİF KOÇBERBER DESIGN HOUSE</p>
                <p><strong>Vergi Dairesi / No:</strong> Erenköy Vergi Dairesi Müd. – 5730473467</p>
                <p><strong>Sicil No:</strong> 982174</p>
                <p><strong>Adres:</strong> Erenköy Mah. Gülbahçe Sk. No:11/28 Kadıköy/İstanbul</p>
                <p><strong>E-posta:</strong> elsdreamfactory@gmail.com</p>
                <p><strong>Web:</strong> www.elsdreamfactory.com</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-6">
              <p className="font-semibold text-gray-900 mb-3">ALICI</p>
              <p className="text-gray-600 text-sm">
                Ödeme formunda girilen ad, soyad, e-posta ve teslimat adresi bilgileriyle tanımlanan gerçek veya tüzel kişi.
              </p>
            </div>
          </div>
        </section>

        {/* Konu ve Ürün Bilgileri */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">2. Sözleşmenin Konusu</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            İşbu sözleşme, Alıcı&apos;nın www.elsdreamfactory.com adresinden elektronik ortamda sipariş ettiği,
            aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimatına ilişkin olarak
            6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri
            çerçevesinde tarafların hak ve yükümlülüklerini düzenlemektedir.
          </p>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-gray-600 text-sm">
              Ürün özellikleri, adedi ve satış fiyatı sipariş tamamlama ekranında ve onay e-postasında
              Alıcı&apos;ya sunulmaktadır. Tüm fiyatlar <strong>Türk Lirası (TRY)</strong> cinsinden
              olup <strong>KDV dahildir</strong>.
            </p>
          </div>
        </section>

        {/* Ödeme */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">3. Ödeme Bilgileri</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span>Ödeme işlemleri <strong>iyzico</strong> ödeme altyapısı üzerinden SSL/TLS şifrelemeli ve 3D Secure doğrulamalı olarak gerçekleştirilir.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span>Kredi kartı bilgileri Satıcı tarafından saklanmaz; yalnızca iyzico&apos;nun PCI-DSS uyumlu sistemlerinde işlenir.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span>Taksit seçeneği sunulmamaktadır; tüm işlemler tek çekim olarak gerçekleştirilir.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span>Sipariş tutarı, ödeme onayı alınana kadar karttan tahsil edilmez.</span>
            </li>
          </ul>
        </section>

        {/* Teslimat */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">4. Teslimat Koşulları</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span>Sipariş onayından itibaren <strong>3–7 iş günü</strong> içinde kargoya teslim edilir.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span>Teslimat yalnızca <strong>Türkiye</strong> içi adresler için geçerlidir.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span>Kargo ücreti ücretsizdir (Satıcı tarafından karşılanır).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span>El yapımı ürünler kırılmaya karşı özel koruyucu ambalaj ile gönderilir.</span>
            </li>
          </ul>
        </section>

        {/* Cayma Hakkı */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">5. Cayma Hakkı</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Alıcı, teslim tarihinden itibaren <strong>14 (on dört) gün</strong> içinde herhangi bir gerekçe
            göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
            <p className="text-gray-700 text-sm font-semibold mb-2">Cayma hakkının kullanımı:</p>
            <p className="text-gray-600 text-sm">
              elsdreamfactory@gmail.com adresine e-posta ile veya <Link href="/returns" className="text-amber-600 hover:underline">iade formu</Link> üzerinden
              cayma bildiriminde bulunulması yeterlidir. Ürün, bildirimden itibaren en geç 10 gün içinde
              Satıcı&apos;ya iade edilmelidir.
            </p>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            <strong>Cayma hakkının kullanılamayacağı haller (TKHK Md.15):</strong>
          </p>
          <ul className="space-y-2 text-gray-600 text-sm list-disc pl-6">
            <li>Alıcının özel isteği veya açıkça kişiselleştirilmiş ürünler (isme özel tasarım)</li>
            <li>Kullanılmış, hasar görmüş veya orijinal ambalajı açılmış ürünler</li>
          </ul>
        </section>

        {/* İade Ödemesi */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">6. İade Ödemesi</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Cayma bildirimi ve ürün iadesi alındıktan sonra Satıcı, ödemeyi en geç <strong>14 (on dört) gün</strong> içinde
            iade etmekle yükümlüdür. İade, ödemenin yapıldığı ödeme aracı (kredi kartı vb.) aracılığıyla gerçekleştirilir.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-gray-700 text-sm">
              <strong>iyzico üzerinden yapılan ödemelerde:</strong> İade talebi iyzico sistemine iletilir.
              Tutarın kartınıza yansıması bankanızın işlem süresine bağlı olup genellikle
              <strong> 3–10 iş günü</strong> sürmektedir. Bu süre iyzico&apos;dan değil,
              kart sahibi bankanızın işlem döngüsünden kaynaklanmaktadır.
            </p>
          </div>
        </section>

        {/* Uyuşmazlık */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">7. Uyuşmazlık Çözümü</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            İşbu sözleşmeden doğan uyuşmazlıklarda Türk Hukuku uygulanır. Tüketiciler, şikayetlerini
            aşağıdaki yollara iletebilir:
          </p>
          <ul className="space-y-2 text-gray-600 text-sm list-disc pl-6">
            <li>Tüketici Hakem Heyeti (yasal sınırlar dahilinde)</li>
            <li>Tüketici Mahkemeleri</li>
            <li>e-Devlet üzerinden Tüketici Bilgi Sistemi (TÜBİS)</li>
          </ul>
        </section>

        {/* Yürürlük */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">8. Yürürlük</h2>
          <p className="text-gray-600 leading-relaxed">
            Alıcı, sipariş tamamlama ekranında işbu Mesafeli Satış Sözleşmesi&apos;ni okuduğunu,
            anladığını ve onayladığını kabul eder. Sözleşme, ödeme onayı alındığı anda yürürlüğe girer.
          </p>
          <p className="text-gray-500 text-sm mt-3">Son güncelleme: {today}</p>
        </section>

        {/* İletişim */}
        <section className="bg-[#5C0A1A] p-8 text-center">
          <h2 className="heading-serif text-xl text-bone mb-3">Sorularınız mı var?</h2>
          <p className="text-bone/60 mb-6">
            Sözleşme ile ilgili her türlü soru için bizimle iletişime geçin.
          </p>
          <a
            href="mailto:elsdreamfactory@gmail.com"
            className="inline-block bg-white text-[#5C0A1A] px-8 py-3 text-sm hover:bg-bone transition-colors duration-300"
          >
            elsdreamfactory@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
}
