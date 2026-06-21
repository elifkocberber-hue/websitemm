'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function FirmaBilgileriClient() {
  const { t } = useLanguage();

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12">
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-amber-600 transition-colors">{t.company.breadcrumb_home}</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{t.company.title}</span>
      </div>

      <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-12">{t.company.title}</h1>

      <div className="max-w-2xl space-y-10">
        {/* İletişim */}
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-earth mb-5">{t.company.contact}</h2>
          <div className="border-t border-earth/20 pt-5 space-y-3 text-charcoal/80">
            <div className="flex gap-4">
              <span className="w-32 shrink-0 text-sm text-earth/60">{t.company.email_label}</span>
              <a href="mailto:elsdreamfactory@gmail.com" className="text-sm hover:text-charcoal transition-colors">
                elsdreamfactory@gmail.com
              </a>
            </div>
            <div className="flex gap-4">
              <span className="w-32 shrink-0 text-sm text-earth/60">Instagram</span>
              <a
                href="https://instagram.com/elsdreamfactory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-charcoal transition-colors"
              >
                @elsdreamfactory
              </a>
            </div>
          </div>
        </section>

        {/* Yasal Firma Bilgileri */}
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-earth mb-5">{t.company.legal}</h2>
          <div className="border-t border-earth/20 pt-5 space-y-3 text-charcoal/80">
            <div className="flex gap-4">
              <span className="w-32 shrink-0 text-sm text-earth/60">{t.company.trade_title}</span>
              <span className="text-sm">ELİF KOÇBERBER DESIGN HOUSE</span>
            </div>
            <div className="flex gap-4">
              <span className="w-32 shrink-0 text-sm text-earth/60">{t.company.tax_office}</span>
              <span className="text-sm">Erenköy Vergi Dairesi Müd.</span>
            </div>
            <div className="flex gap-4">
              <span className="w-32 shrink-0 text-sm text-earth/60">{t.company.tax_no}</span>
              <span className="text-sm">5730473467</span>
            </div>
            <div className="flex gap-4">
              <span className="w-32 shrink-0 text-sm text-earth/60">{t.company.registry_no}</span>
              <span className="text-sm">982174</span>
            </div>
            <div className="flex gap-4">
              <span className="w-32 shrink-0 text-sm text-earth/60">{t.company.address}</span>
              <span className="text-sm">Erenköy Mah. Gülbahçe Sk. No:11/28 Kadıköy/İstanbul</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
