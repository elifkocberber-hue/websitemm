import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İade ve Değişim Politikası | El\'s Dream Factory',
  description: 'El\'s Dream Factory iade ve değişim koşulları. El yapımı seramik ürünler için iade politikamız.',
};

export default function ReturnsPage() {
  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-amber-600 transition-colors">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">İade ve Değişim Politikası</span>
      </div>

      <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-8">İade ve Değişim Politikası</h1>
      <p className="text-sm text-earth mb-10">Son güncelleme: 4 Mart 2026</p>

      <div className="prose prose-lg max-w-none text-charcoal/80 space-y-8">
        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">1. İade Hakkı</h2>
          <p>
            6502 sayılı Tüketicinin Korunması Hakkında Kanun gereğince, satın aldığınız
            ürünleri teslim tarihinden itibaren <strong>14 gün</strong> içinde herhangi bir
            gerekçe göstermeksizin iade edebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">2. İade Koşulları</h2>
          <p>İade edilecek ürünlerin aşağıdaki koşulları sağlaması gerekmektedir:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ürün kullanılmamış ve orijinal durumunda olmalıdır.</li>
            <li>Ürün ambalajı açılmamış veya hasar görmemiş olmalıdır.</li>
            <li>Fatura veya sipariş belgesi ile birlikte gönderilmelidir.</li>
            <li>Ürün orijinal kutusu/paketi ile birlikte iade edilmelidir.</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">3. İade Edilemeyen Ürünler</h2>
          <p>Aşağıdaki durumlarda iade kabul edilmemektedir:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Kişiye özel üretilmiş (isme özel, özel tasarım) ürünler</li>
            <li>Kullanılmış veya hasar verilmiş ürünler</li>
            <li>Ambalajı açılmış ve kullanım izleri bulunan ürünler</li>
          </ul>
          <p className="mt-3">
            <strong>Not:</strong> El yapımı seramik ürünlerdeki küçük renk, boyut ve doku
            farklılıkları doğal üretim sürecinin bir parçasıdır ve iade gerekçesi oluşturmaz.
          </p>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">4. Kargoda Hasar Gören Ürünler</h2>
          <p>
            Kargo sürecinde hasar gören ürünler için teslimattan itibaren{' '}
            <strong>3 gün</strong> içinde bize fotoğraflı bildirimde bulunmanız
            gerekmektedir. Hasarlı ürünler ücretsiz olarak değiştirilir veya iade edilir.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Kargo tesliminde paketi kontrol ediniz.</li>
            <li>Hasar varsa kargo görevlisi huzurunda tutanak tutturunuz.</li>
            <li>Hasarlı ürünün fotoğraflarını bize e-posta ile gönderiniz.</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">5. İade Süreci</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <a href="mailto:elsdreamfactory@gmail.com"
                className="text-accent hover:text-charcoal transition-colors">
                elsdreamfactory@gmail.com
              </a>{' '}
              adresine iade talebinizi bildirin.
            </li>
            <li>Size iade kargo bilgileri ve prosedür detaylarını göndereceğiz.</li>
            <li>Ürünü talimatlar doğrultusunda güvenli bir şekilde paketleyin ve kargoya verin.</li>
            <li>Ürün tarafımıza ulaştıktan sonra kontrol edildikten sonra iade işlemi başlatılır.</li>
          </ol>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">6. İade Ödemesi</h2>
          <p>
            İade onaylandıktan sonra ödeme tutarı, ödeme yaptığınız yönteme göre{' '}
            <strong>10 iş günü</strong> içinde hesabınıza iade edilir.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Kredi kartı ile yapılan ödemeler kredi kartınıza iade edilir.</li>
            <li>İade kargo ücreti, ürün kusurlu/hasarlı değilse alıcıya aittir.</li>
            <li>Kargoda hasar gören ürünlerin iade kargo ücreti tarafımızca karşılanır.</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">7. Değişim</h2>
          <p>
            Ürün değişimi için aynı iade prosedürü uygulanır. Değişim ürününün stokta
            bulunmaması halinde iade işlemi gerçekleştirilir.
          </p>
        </section>

        <section>
          <h2 className="heading-serif text-xl text-charcoal mb-3">8. İletişim</h2>
          <p>İade ve değişim konusundaki tüm sorularınız için:</p>
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
