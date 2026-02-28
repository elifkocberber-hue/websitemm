import { ceramicProducts } from '@/data/ceramicProducts';
import { CeramicProductCard } from '@/components/CeramicProductCard';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="mb-12 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">🏺 Geleneksel Seramik Sanatı</h1>
        <p className="text-lg md:text-xl mb-6">
          El yapımı seramik ürünlerin en güzel koleksiyonu. Her parça benzersiz ve özel bakımla yapılmıştır.
        </p>
        <Link
          href="/ceramics"
          className="inline-block bg-white text-amber-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          Koleksiyonu Keşfet
        </Link>
      </section>

      {/* About Section */}
      <section className="mb-12 bg-white rounded-lg p-8 shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Biz Hakkımızda</h2>
        <p className="text-gray-700 mb-4">
          30 yıllık seramik üretim deneyimi ile beraber, geleneksel teknikler ve modern tasarımı bir araya getiriyoruz. 
          Her ürün, ustalarımızın titiz çalışması ile hayat bulur ve evlerinize sanat getirir.
        </p>
        <Link href="/about" className="text-amber-600 hover:text-amber-800 font-bold">
          Hikayemizi Oku →
        </Link>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Öne Çıkan Ürünler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ceramicProducts.slice(0, 4).map(product => (
            <CeramicProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/ceramics"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Tüm Ürünleri Görmek İçin
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="my-12 bg-amber-50 rounded-lg p-8 border-2 border-amber-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Yeni Koleksiyonlar İçin Haberdar Olun</h2>
        <p className="text-gray-600 mb-4">
          Yeni seramik tasarımları, özel teklifler ve atölyeden haberler için e-mail adresinizi girin
        </p>
        <div className="flex gap-2 max-w-md">
          <input
            type="email"
            placeholder="E-mail adresiniz..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Abone Ol
          </button>
        </div>
      </section>
    </div>
  );
}
