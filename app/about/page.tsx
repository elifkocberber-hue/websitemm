import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-amber-600 transition-colors">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Hakkımızda</span>
      </div>

      {/* Hero */}
      <section className="mb-16 relative rounded-2xl overflow-hidden">
        <div className="relative h-[400px]">
          <Image
            src="https://images.unsplash.com/photo-1604424321003-50b9174b28e3?w=1920&q=80"
            alt="Seramik atölyesi"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-stone-900/30" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <p className="text-amber-400 font-medium text-sm uppercase tracking-wider mb-3">Hikayemiz</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Seramik Atölyemiz</h1>
            <p className="text-stone-200 text-lg max-w-xl">
              Geleneksel seramik sanatını modern tasarımla birleştirerek benzersiz ürünler yaratıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-amber-600 font-medium text-sm uppercase tracking-wider mb-2">Kuruluş</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">1994&apos;ten Bugüne</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Kütahya&apos;da kurulan seramik atölyemiz, üç kuşaklık seramik üretim deneyimini barındırıyor.
            Babamızın başlattığı bu güzel yolculuk, bugün aynı tutku ve özenle devam etmektedir.
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Her ürünümüz, el yapımı teknikleri ve ustalarımızın birikimi ile özenle üretilmektedir.
            Geleneksel topraklar ve modern tasarımlar bir araya gelerek çağdaş bir seramik koleksiyonu oluşturmuştur.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Biz sadece ürün satmıyoruz — sanat ve kültüre saygı içinde yaratılan, hayatın her anını güzelleştiren eserler sunuyoruz.
          </p>
        </div>
        <div className="relative h-[400px] rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80"
            alt="Seramik üretim süreci"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16 bg-stone-50 rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-600 mb-1">30+</p>
            <p className="text-gray-500 font-medium">Yıl Deneyim</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-600 mb-1">400+</p>
            <p className="text-gray-500 font-medium">Farklı Tasarım</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-600 mb-1">%98</p>
            <p className="text-gray-500 font-medium">Müşteri Memnuniyeti</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-600 mb-1">3</p>
            <p className="text-gray-500 font-medium">Kuşak Deneyim</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <p className="text-amber-600 font-medium text-sm uppercase tracking-wider mb-2">Felsefemiz</p>
          <h2 className="text-3xl font-bold text-gray-900">Değerlerimiz</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Geleneksel Sanat</h3>
            <p className="text-gray-600 leading-relaxed">
              Yüzyıllık seramik geleneklerini modern tasarımlarla harmoni içinde sunuyoruz.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">El Yapımı Kalite</h3>
            <p className="text-gray-600 leading-relaxed">
              Her ürün, ustalarımızın dikkatli ve özenli elleri tarafından tek tek üretilmektedir.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Doğal Malzeme</h3>
            <p className="text-gray-600 leading-relaxed">
              En kaliteli doğal topraklar ve organik boyalarla çevre dostu üretim yapıyoruz.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sürdürülebilirlik</h3>
            <p className="text-gray-600 leading-relaxed">
              Çevre bilinçli üretim süreçlerimizle doğaya saygılı bir yaklaşım benimsiyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-stone-900 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Bize Ulaşın</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 text-stone-300 mb-8">
          <p>info@elsdreamfactory.com</p>
          <p>Kütahya, Türkiye</p>
        </div>
        <Link
          href="/ceramics"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
        >
          Koleksiyona Göz At
        </Link>
      </section>
    </div>
  );
}
