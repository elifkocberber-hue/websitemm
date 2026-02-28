import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-amber-600">Ana Sayfa</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Hakkında</span>
        </div>

        {/* Hero */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">🏺 Seramik Atölyemiz</h1>
          <p className="text-xl text-gray-700">
            Geleneksel seramik sanatını, modern tasarımla birleştirerek, benzersiz ürünler yaratıyoruz.
          </p>
        </section>

        {/* Story */}
        <section className="mb-12 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hikayemiz</h2>
          <p className="text-gray-700 mb-4">
            1994 yılında Kütahya'da kurulan seramik atölyemiz, üç kuşaklık seramik üretim deneyimini barındırıyor. 
            Babamızın başlattığı bu güzel yolculuk, bugün devam etmektedir.
          </p>
          <p className="text-gray-700 mb-4">
            Her ürünümüz, el yapımı teknikleri ve usta ustalarımızın bilgisi ile kalp ile yapılmaktadır. 
            Geleneksel topraklar ve modern tasarımlar, çağdaş bir seramik koleksiyonu yaratmıştır.
          </p>
          <p className="text-gray-700">
            Biz, sadece ürün satmıyoruz - sanat ve kültüre karşı saygı içinde yaratılan, hayatın her anını güzelleştiren eserler sunuyoruz.
          </p>
        </section>

        {/* Stats */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-amber-600 text-white rounded-lg p-6 text-center">
            <h3 className="text-4xl font-bold mb-2">30+</h3>
            <p className="text-lg">Yıl Deneyim</p>
          </div>
          <div className="bg-amber-700 text-white rounded-lg p-6 text-center">
            <h3 className="text-4xl font-bold mb-2">400+</h3>
            <p className="text-lg">Tasarım</p>
          </div>
          <div className="bg-amber-500 text-white rounded-lg p-6 text-center">
            <h3 className="text-4xl font-bold mb-2">98%</h3>
            <p className="text-lg">Memnuniyeti</p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-amber-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎨 Geleneksel Sanat</h3>
              <p className="text-gray-700">
                Yüzyıllık seramik geleneklerini, modern tasarımlarla harmoni içinde sunuyoruz.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-amber-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">👨‍🎨 El Yapımı Kalite</h3>
              <p className="text-gray-700">
                Her ürün, ustalarımızın dikkatli ve sevgi dolu elleri tarafından yapılmaktadır.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-amber-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🌍 Doğal Malzeme</h3>
              <p className="text-gray-700">
                En kaliteli doğal topraklar ve yer bulduk boyalarıyla, çevre dostu üretim yapıyoruz.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-amber-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">💚 Sürdürülebilirlik</h3>
              <p className="text-gray-700">
                Her satış ile bir ağacı dikilsin diye çalışıyoruz ve çevre bilinçli üretim yapıyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-amber-50 rounded-lg p-8 border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bize Ulaşın</h2>
          <div className="space-y-3 text-gray-700">
            <p>📧 info@seramik-atolyesi.com</p>
            <p>📱 +90 555 987 6543</p>
            <p>📍 Kütahya, Türkiye</p>
            <p>🕐 Pazartesi - Cuma: 09:00 - 18:00</p>
          </div>
          <Link
            href="/ceramics"
            className="inline-block mt-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Koleksiyona Dön
          </Link>
        </section>
      </div>
    </div>
  );
}
