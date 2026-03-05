import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Şartları | El\'s Dream Factory',
  description: 'El\'s Dream Factory web sitesi kullanım şartları ve koşulları.',
};

export default function TermsPage() {
  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-amber-600 transition-colors">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">Kullanım Şartları</span>
      </div>

      <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-8">Kullanım Şartları</h1>
      <p className="text-sm text-earth mb-10">Son güncelleme: 4 Mart 2026</p>

      <div className="prose prose-lg max-w-none text-charcoal/80 space-y-8">
        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">1. Genel Hükümler</h2>
          <p>
            Bu web sitesi El&apos;s Dream Factory (&quot;Şirket&quot;) tarafından işletilmektedir.
            Siteyi kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Bu şartları kabul
            etmiyorsanız lütfen siteyi kullanmayınız.
          </p>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">2. Ürün ve Hizmetler</h2>
          <p>
            Sitemizdeki tüm ürünler el yapımı seramik ürünlerdir. Her ürün benzersiz olup,
            renk, boyut ve desende küçük farklılıklar gösterebilir. Bu farklılıklar el
            yapımı üretimin doğal sonucudur ve kusur olarak değerlendirilmez.
          </p>
          <p>
            Ürün fotoğrafları mümkün olduğunca gerçeğe yakın sunulmaktadır; ancak ekran
            ayarlarına bağlı olarak renkler farklı görünebilir.
          </p>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">3. Sipariş ve Ödeme</h2>
          <p>
            Sipariş verdiğinizde bir satın alma teklifi yapmış olursunuz. Siparişiniz Şirket
            tarafından onaylandığında satış sözleşmesi kurulmuş olur. Ödeme işlemleri
            güvenli ödeme altyapısı üzerinden gerçekleştirilir.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Tüm fiyatlar Türk Lirası (TRY) cinsindendir ve KDV dahildir.</li>
            <li>Ödeme sırasındaki fiyat geçerli satış fiyatıdır.</li>
            <li>Kredi kartı bilgileriniz tarafımızca saklanmaz.</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">4. Kargo ve Teslimat</h2>
          <p>
            Siparişler onaylandıktan sonra 3-7 iş günü içinde kargoya verilir. Kırılabilir
            ürünler özenle paketlenir. Kargo sürecinde oluşabilecek hasarlar için
            fotoğraflı bildirim yapmanız gerekmektedir.
          </p>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">5. Fikri Mülkiyet</h2>
          <p>
            Sitedeki tüm içerik (görseller, metinler, tasarımlar, logolar) El&apos;s Dream
            Factory&apos;ye aittir ve telif hakkı ile korunmaktadır. Yazılı izin alınmadan
            kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.
          </p>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">6. Sorumluluk Sınırı</h2>
          <p>
            Şirket, web sitesinin kesintisiz veya hatasız çalışacağını garanti etmez.
            Teknik bakım, güncelleme veya öngörülemeyen durumlar nedeniyle geçici
            kesintiler yaşanabilir.
          </p>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">7. Değişiklikler</h2>
          <p>
            Şirket, bu kullanım şartlarını herhangi bir zamanda güncelleme hakkını saklı
            tutar. Güncellemeler sitede yayınlandığı tarihte geçerli olur.
          </p>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">8. İletişim</h2>
          <p>
            Kullanım şartlarıyla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
          </p>
          <p className="font-medium">
            E-posta:{' '}
            <a href="mailto:elsdreamfactory@gmail.com" className="text-accent hover:text-charcoal transition-colors">
              elsdreamfactory@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
