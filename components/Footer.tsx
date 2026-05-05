'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal text-bone mt-0">
      <div className="max-w-350 mx-auto px-6 md:px-10 py-16 md:py-20">
        {/* Top — Large serif statement */}
        <div className="mb-16">
          <p className="heading-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-2xl leading-tight whitespace-pre-line">
            {t.footer.tagline}
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase mb-1 invisible">El&apos;s Dream Factory</p>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-clay mb-5">{t.footer.explore}</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-bone/60 hover:text-bone transition-colors">{t.footer.home}</Link></li>
              <li><Link href="/ceramics" className="text-sm text-bone/60 hover:text-bone transition-colors">{t.footer.collection}</Link></li>
              <li><Link href="/about" className="text-sm text-bone/60 hover:text-bone transition-colors">{t.footer.about}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase mb-1 invisible">El&apos;s Dream Factory</p>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-clay mb-5">{t.footer.info}</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-bone/60 hover:text-bone transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="/cookie-policy" className="text-sm text-bone/60 hover:text-bone transition-colors">{t.footer.cookie}</Link></li>
              <li><Link href="/terms" className="text-sm text-bone/60 hover:text-bone transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="/returns" className="text-sm text-bone/60 hover:text-bone transition-colors">{t.footer.returns}</Link></li>
              <li><Link href="/faq" className="text-sm text-bone/60 hover:text-bone transition-colors">{t.footer.faq}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase mb-1 invisible">El&apos;s Dream Factory</p>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-clay mb-5">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li><a href="mailto:elsdreamfactory@gmail.com" className="text-sm text-bone/60 hover:text-bone transition-colors">elsdreamfactory@gmail.com</a></li>
              <li className="text-sm text-bone/60">{t.footer.country}</li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-bone/40 mb-1">El&apos;s Dream Factory</p>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-clay mb-5">{t.footer.follow}</h4>
            <a
              href="https://instagram.com/elsdreamfactory"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-bone/20 text-bone/60 hover:text-bone hover:border-bone/60 transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-bone/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-bone/30">&copy; 2026 El&apos;s Dream Factory</p>
          <p className="text-xs text-bone/30">{t.footer.made_with_love}</p>
        </div>
      </div>
    </footer>
  );
};
