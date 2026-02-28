export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-bold mb-4">Hakkında</h4>
            <p className="text-gray-400">
              Kaliteli ürünler ve mükemmel müşteri hizmeti sunan modern e-ticaret platformu.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Ana Sayfa</a></li>
              <li><a href="#" className="hover:text-white">Kategoriler</a></li>
              <li><a href="#" className="hover:text-white">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Politikalar</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Gizlilik</a></li>
              <li><a href="#" className="hover:text-white">Şartlar</a></li>
              <li><a href="#" className="hover:text-white">Döndürme</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">İletişim</h4>
            <p className="text-gray-400">
              📧 info@ecommerce.com<br />
              📱 +90 555 123 4567<br />
              📍 İstanbul, Türkiye
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 E-Commerce. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};
