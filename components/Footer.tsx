import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-bone mt-0">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
        {/* Top — Large serif statement */}
        <div className="mb-16">
          <p className="heading-display text-4xl md:text-5xl lg:text-6xl max-w-2xl leading-tight">
            Her parça,<br />bir hikaye taşır.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-clay mb-5">Keşfet</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-bone/60 hover:text-bone transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/ceramics" className="text-sm text-bone/60 hover:text-bone transition-colors">Koleksiyon</Link></li>
              <li><Link href="/about" className="text-sm text-bone/60 hover:text-bone transition-colors">Hakkımızda</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-clay mb-5">Bilgi</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-bone/60 hover:text-bone transition-colors">Gizlilik Politikası</Link></li>
              <li><a href="#" className="text-sm text-bone/60 hover:text-bone transition-colors">Kullanım Şartları</a></li>
              <li><a href="#" className="text-sm text-bone/60 hover:text-bone transition-colors">İade Politikası</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-clay mb-5">İletişim</h4>
            <ul className="space-y-3">
              <li className="text-sm text-bone/60">info@elsdreamfactory.com</li>
              <li className="text-sm text-bone/60">Kütahya, Türkiye</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-clay mb-5">Takip Et</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-bone/60 hover:text-bone transition-colors">Instagram</a></li>
              <li><a href="#" className="text-sm text-bone/60 hover:text-bone transition-colors">Pinterest</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-bone/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-bone/30">&copy; 2026 El&apos;s Dream Factory</p>
          <p className="text-xs text-bone/30">Kütahya&apos;dan sevgiyle</p>
        </div>
      </div>
    </footer>
  );
};
