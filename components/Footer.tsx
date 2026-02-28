export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="text-lg font-bold text-amber-500 mb-4">El&apos;s Dream Factory</h4>
            <p className="text-stone-400 text-sm leading-relaxed">
              Geleneksel Kütahya seramik sanatını modern tasarımlarla buluşturan el yapımı seramik atölyesi.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-300 mb-4">Keşfet</h4>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li><a href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</a></li>
              <li><a href="/ceramics" className="hover:text-amber-400 transition-colors">Koleksiyon</a></li>
              <li><a href="/about" className="hover:text-amber-400 transition-colors">Hakkımızda</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-300 mb-4">Bilgi</h4>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Kullanım Şartları</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">İade Politikası</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-300 mb-4">İletişim</h4>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li>info@elsdreamfactory.com</li>
              <li>Kütahya, Türkiye</li>
              <li>Pzt - Cuma: 09:00 - 18:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-stone-500 text-sm">
          <p>&copy; 2026 El&apos;s Dream Factory. Tüm hakları saklıdır.</p>
          <p className="mt-2 md:mt-0">Kütahya, Türkiye&apos;den sevgiyle üretildi.</p>
        </div>
      </div>
    </footer>
  );
};
