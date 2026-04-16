'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CeramicProduct } from '@/types/ceramic';
import { CeramicProductCard } from '@/components/CeramicProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { NewsletterForm } from '@/components/NewsletterForm';
import { useLanguage } from '@/context/LanguageContext';

interface BannerData {
  items: string[];
  campaign_active: boolean;
  campaign_text: string;
  hero_image: string;
}

interface AboutData {
  story_title: string;
  story_p1: string;
  story_p2: string;
}

interface HomeClientProps {
  featured: CeramicProduct[];
  banner: BannerData;
  about: AboutData;
}

export default function HomeClient({ featured, banner, about }: HomeClientProps) {
  const { t, language } = useLanguage();

  const marqueeItems: string[] = banner.items ?? ['Ceramic', 'Illustration', 'Gift', 'Handmade', 'Unique'];
  const showCampaign = banner.campaign_active && Boolean(banner.campaign_text);

  const heroDesc = language === 'tr'
    ? (
      <>
        Bu atölyede her şey{' '}
        <span className="hero-word hero-word--camur text-[#5C0A1A] font-semibold">çamur</span>{' '}
        ile başlar,{' '}
        <span className="hero-word hero-word--renk text-[#5C0A1A] font-semibold">renk</span>{' '}
        ile canlanır,{' '}
        <span className="hero-word hero-word--pati text-[#5C0A1A] font-semibold">pati izi</span>{' '}
        ile mühürlenir.
      </>
    )
    : (
      <>
        In this studio everything starts with{' '}
        <span className="hero-word hero-word--camur text-[#5C0A1A] font-semibold">clay</span>,
        {' '}comes alive with{' '}
        <span className="hero-word hero-word--renk text-[#5C0A1A] font-semibold">colour</span>,
        {' '}and is sealed with a{' '}
        <span className="hero-word hero-word--pati text-[#5C0A1A] font-semibold">paw print</span>.
      </>
    );

  const pillars = [
    { num: '01', title: t.home.pillar1_title, desc: t.home.pillar1_desc },
    { num: '02', title: t.home.pillar2_title, desc: t.home.pillar2_desc },
    { num: '03', title: t.home.pillar3_title, desc: t.home.pillar3_desc },
  ];

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative h-screen min-h-150 overflow-hidden">
        <Image
          src={banner.hero_image || '/images/arkaplan.jpg'}
          alt="El yapımı seramik ürünler - Dekoratif seramik koleksiyonu"
          fill
          className="object-cover"
          priority
          unoptimized={banner.hero_image?.startsWith('http')}
        />
        <div className="absolute inset-0 bg-white/40" />

        <div className="relative z-10 h-full flex items-end pb-16 md:pb-24">
          <div className="max-w-350 mx-auto px-6 md:px-10 w-full">
            <p className="text-earth/70 text-xs tracking-[0.3em] uppercase mb-6">
              {t.home.hero_subtitle}
            </p>
            <h1 className="heading-display text-charcoal text-4xl md:text-6xl lg:text-7xl mb-6 whitespace-pre-line">
              {t.home.hero_title}
            </h1>
            <p className="text-charcoal/80 max-w-md text-lg mb-10 leading-relaxed">
              {heroDesc}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/ceramics"
                className="inline-block bg-charcoal text-bone px-8 py-4 text-sm tracking-wider uppercase hover:bg-accent hover:text-bone transition-colors duration-300"
              >
                {t.home.explore}
              </Link>
              <Link
                href="/about"
                className="inline-block border border-charcoal/30 text-charcoal px-8 py-4 text-sm tracking-wider uppercase hover:border-charcoal hover:bg-charcoal/5 transition-all duration-300"
              >
                {t.home.our_story}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-12 bg-charcoal/30 animate-pulse" />
        </div>
      </section>

      {/* ═══════ MARQUEE ═══════ */}
      <div className="marquee-container bg-charcoal py-4 select-none overflow-hidden">
        <div className="marquee-track">
          {showCampaign ? (
            [0, 1].map((i) => (
              <span key={i} className="flex items-center gap-8 px-4">
                <span className="heading-serif text-accent text-sm tracking-[0.15em] uppercase">
                  {banner.campaign_text}
                </span>
                <span className="text-accent">·</span>
              </span>
            ))
          ) : (
            [0, 1].map((i) => (
              <span key={i} className="flex items-center gap-8 px-4">
                {marqueeItems.map((word) => (
                  <span key={`${i}-${word}`} className="flex items-center gap-8">
                    <span className="heading-serif text-bone/80 text-sm tracking-[0.15em] uppercase">{word}</span>
                    <span className="text-accent">·</span>
                  </span>
                ))}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ═══════ FEATURED PRODUCTS ═══════ */}
      <section className="max-w-350 mx-auto px-6 md:px-10 py-20 md:py-32">
        <ScrollReveal>
          <div className="flex justify-between items-end mb-12 md:mb-16">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-earth mb-3">{t.home.collection_label}</p>
              <h2 className="heading-display text-3xl md:text-4xl text-charcoal">{t.home.featured_title}</h2>
            </div>
            <Link href="/ceramics" className="link-line text-sm tracking-wider uppercase text-earth hover:text-charcoal transition-colors hidden md:block">
              {t.home.see_all}
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <ScrollReveal className="md:col-span-7" delay={100}>
            <CeramicProductCard product={featured[0]} imageClass="aspect-[4/5]" />
          </ScrollReveal>
          <div className="md:col-span-5 flex flex-col gap-6 md:gap-8">
            <ScrollReveal delay={200}>
              <CeramicProductCard product={featured[1]} imageClass="aspect-[5/4]" />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <CeramicProductCard product={featured[2]} imageClass="aspect-[5/4]" />
            </ScrollReveal>
          </div>
        </div>

        <div className="mt-6 md:mt-8">
          <ScrollReveal delay={400}>
            <CeramicProductCard product={featured[3]} imageClass="aspect-[16/7]" />
          </ScrollReveal>
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link
            href="/ceramics"
            className="inline-block border border-charcoal text-charcoal px-8 py-3 text-sm tracking-wider uppercase hover:bg-charcoal hover:text-bone transition-colors"
          >
            {t.home.see_all}
          </Link>
        </div>
      </section>

      {/* ═══════ PHILOSOPHY ═══════ */}
      <section className="max-w-350 mx-auto px-6 md:px-10 py-20 md:py-32">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-earth mb-3">{t.home.philosophy_label}</p>
            <h2 className="heading-display text-3xl md:text-4xl text-charcoal">Wabi-Sabi</h2>
            <p className="text-earth mt-4 leading-relaxed max-w-xl mx-auto">
              {t.home.wabi_desc}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {pillars.map((item, i) => (
            <ScrollReveal key={item.num} delay={i * 120}>
              <div className="text-center">
                <span className="heading-display text-6xl md:text-7xl text-accent/15">{item.num}</span>
                <h3 className="heading-serif text-lg text-charcoal mt-2 mb-3">{item.title}</h3>
                <p className="text-earth text-sm leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════ PARALLAX CTA ═══════ */}
      <section className="relative h-[50vh] min-h-100 parallax-section parallax-home-cta">
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <ScrollReveal direction="scale">
            <h2 className="heading-display text-bone text-3xl md:text-5xl mb-8">
              {t.home.cta_title}
            </h2>
            <Link
              href="/ceramics"
              className="inline-block bg-bone text-charcoal px-10 py-4 text-sm tracking-wider uppercase hover:bg-accent hover:text-bone transition-colors duration-300"
            >
              {t.home.cta_btn}
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="max-w-350 mx-auto px-6 md:px-10 py-20 md:py-28">
        <ScrollReveal>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="heading-serif text-2xl text-charcoal mb-3">{t.home.newsletter_title}</h2>
            <p className="text-earth text-sm mb-8">
              {t.home.newsletter_desc}
            </p>
            <NewsletterForm />
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════ ABOUT SECTION (dark) ═══════ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-charcoal">
        <div className="absolute inset-y-0 right-0 w-full md:w-[55%]">
          <Image
            src="/images/arkaplan.jpg"
            alt="Arka plan"
            fill
            className="object-contain object-right opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative z-10 max-w-350 mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <ScrollReveal direction="left">
            <p className="text-xs tracking-[0.2em] uppercase text-clay mb-4">{t.home.about_label}</p>
            <h2 className="heading-display text-3xl md:text-4xl text-bone mb-6 whitespace-pre-line">
              {about.story_title}
            </h2>
            <p className="text-bone/60 leading-relaxed mb-4">
              {about.story_p1}
            </p>
            <p className="text-bone/60 leading-relaxed mb-8">
              {about.story_p2}
            </p>
            <Link href="/about" className="link-line text-sm tracking-wider uppercase text-accent hover:text-bone transition-colors">
              {t.home.about_link}
            </Link>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="relative h-100 md:h-130">
              <Image
                src="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80"
                alt="El yapımı seramik atölyesi - seramik üretim süreci"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
