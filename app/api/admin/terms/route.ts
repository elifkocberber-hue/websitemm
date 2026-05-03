import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

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

export async function GET() {
  try {
    const { data } = await supabase
      .from('terms_settings')
      .select('content, updated_at')
      .eq('id', 1)
      .single();

    return NextResponse.json({
      content: data?.content || DEFAULT_CONTENT,
      updated_at: data?.updated_at || null,
    });
  } catch {
    return NextResponse.json({ content: DEFAULT_CONTENT, updated_at: null });
  }
}

export async function PUT(req: NextRequest) {
  const authResult = await isAdminAuthenticated(req);
  if (!authResult) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { content } = await req.json();
    if (typeof content !== 'string') {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    }

    const { error } = await supabase
      .from('terms_settings')
      .upsert({ id: 1, content, updated_at: new Date().toISOString() });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Kaydetme hatası' }, { status: 500 });
  }
}
