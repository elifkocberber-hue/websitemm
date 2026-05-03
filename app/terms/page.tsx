import Link from 'next/link';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';

export const metadata: Metadata = {
  title: 'Kullanım Şartları | El\'s Dream Factory',
  description: 'El\'s Dream Factory web sitesi kullanım şartları ve koşulları.',
};

const DEFAULT_CONTENT = `1. Genel Hükümler

Bu web sitesi El's Dream Factory ("Şirket") tarafından işletilmektedir. Siteyi kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Bu şartları kabul etmiyorsanız lütfen siteyi kullanmayınız.

2. Ürün ve Hizmetler

Sitemizdeki tüm ürünler el yapımı seramik ürünlerdir. Her ürün benzersiz olup, renk, boyut ve desende küçük farklılıklar gösterebilir. Bu farklılıklar el yapımı üretimin doğal sonucudur ve kusur olarak değerlendirilmez.

Ürün fotoğrafları mümkün olduğunca gerçeğe yakın sunulmaktadır; ancak ekran ayarlarına bağlı olarak renkler farklı görünebilir.

3. Sipariş ve Ödeme

Sipariş verdiğinizde bir satın alma teklifi yapmış olursunuz. Siparişiniz Şirket tarafından onaylandığında satış sözleşmesi kurulmuş olur. Ödeme işlemleri güvenli ödeme altyapısı üzerinden gerçekleştirilir.

- Tüm fiyatlar Türk Lirası (TRY) cinsindendir ve KDV dahildir.
- Ödeme sırasındaki fiyat geçerli satış fiyatıdır.
- Kredi kartı bilgileriniz tarafımızca saklanmaz.

4. Kargo ve Teslimat

Siparişler onaylandıktan sonra 3-7 iş günü içinde kargoya verilir. Kırılabilir ürünler özenle paketlenir. Kargo sürecinde oluşabilecek hasarlar için fotoğraflı bildirim yapmanız gerekmektedir.

5. Fikri Mülkiyet

Sitedeki tüm içerik (görseller, metinler, tasarımlar, logolar) El's Dream Factory'ye aittir ve telif hakkı ile korunmaktadır. Yazılı izin alınmadan kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.

6. Sorumluluk Sınırı

Şirket, web sitesinin kesintisiz veya hatasız çalışacağını garanti etmez. Teknik bakım, güncelleme veya öngörülemeyen durumlar nedeniyle geçici kesintiler yaşanabilir.

7. Değişiklikler

Şirket, bu kullanım şartlarını herhangi bir zamanda güncelleme hakkını saklı tutar. Güncellemeler sitede yayınlandığı tarihte geçerli olur.

8. İletişim

Kullanım şartlarıyla ilgili sorularınız için bizimle iletişime geçebilirsiniz: elsdreamfactory@gmail.com`;

async function getTermsContent(): Promise<string> {
  noStore();
  try {
    const { data } = await supabase
      .from('terms_settings')
      .select('content')
      .eq('id', 1)
      .single();
    return data?.content || DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export default async function TermsPage() {
  const content = await getTermsContent();

  const paragraphs = content.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12">
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-amber-600 transition-colors">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">Kullanım Şartları</span>
      </div>

      <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-8">Kullanım Şartları</h1>

      <div className="prose prose-lg max-w-none text-charcoal/80 space-y-4">
        {(() => {
          const elements: React.ReactNode[] = [];
          let listItems: string[] = [];
          let listKey = 0;

          const flushList = () => {
            if (listItems.length > 0) {
              elements.push(
                <ul key={`ul-${listKey++}`} className="list-disc pl-6 space-y-1">
                  {listItems.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              );
              listItems = [];
            }
          };

          paragraphs.forEach((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- ')) {
              listItems.push(trimmed.slice(2));
            } else {
              flushList();
              if (/^\d+\./.test(trimmed)) {
                elements.push(
                  <h2 key={i} className="heading-serif text-xl text-charcoal mt-8 mb-3">
                    {trimmed}
                  </h2>
                );
              } else {
                elements.push(<p key={i}>{trimmed}</p>);
              }
            }
          });
          flushList();
          return elements;
        })()}
      </div>
    </div>
  );
}
