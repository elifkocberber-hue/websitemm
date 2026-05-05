'use client';

import React from 'react';
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
  craft_image: string;
}

interface HomepageData {
  hero_subtitle: string;
  hero_title: string;
  hero_desc: string;
  collection_label: string;
  featured_title: string;
  philosophy_label: string;
  philosophy_title: string;
  philosophy_desc: string;
  pillar1_title: string;
  pillar1_desc: string;
  pillar2_title: string;
  pillar2_desc: string;
  pillar3_title: string;
  pillar3_desc: string;
  cta_image: string;
  cta_overlay_opacity: number;
  cta_title: string;
  cta_btn: string;
  newsletter_title: string;
  newsletter_desc: string;
  text_colors?: Record<string, string>;
}

interface HomeClientProps {
  featured: CeramicProduct[];
  banner: BannerData;
  about: AboutData;
  homepage: HomepageData;
}

export default function HomeClient({ featured, banner, about, homepage }: HomeClientProps) {
  const { t, language } = useLanguage();

  const marqueeItems: string[] = banner.items ?? ['Ceramic', 'Illustration', 'Gift', 'Handmade', 'Unique'];
  const showCampaign = banner.campaign_active && Boolean(banner.campaign_text);

  const tc = homepage.text_colors ?? {};
  const cs = (key: string): React.CSSProperties | undefined => tc[key] ? { color: tc[key] } : undefined;

  const pillars = [
    { num: '01', n: 1, title: homepage.pillar1_title, desc: homepage.pillar1_desc },
    { num: '02', n: 2, title: homepage.pillar2_title, desc: homepage.pillar2_desc },
    { num: '03', n: 3, title: homepage.pillar3_title, desc: homepage.pillar3_desc },
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
            <p className="text-earth/70 text-xs tracking-[0.3em] uppercase mb-6" style={cs('hero_subtitle')}>
              {homepage.hero_subtitle}
            </p>
            <h1 className="heading-display text-charcoal text-4xl md:text-6xl lg:text-7xl mb-6 whitespace-pre-line" style={cs('hero_title')}>
              {homepage.hero_title}
            </h1>
            <p className="text-charcoal/80 max-w-md text-lg mb-10 leading-relaxed" style={cs('hero_desc')}>
              {language === 'tr' ? (
                <>
                  Bu atölyede her şey{' '}
                  <span className="hero-word hero-word--camur text-[#5C0A1A] font-semibold">çamur</span>{' '}
                  ile başlar,{' '}
                  <span className="hero-word hero-word--renk text-[#5C0A1A] font-semibold">renk</span>{' '}
                  ile canlanır,{' '}
                  <span className="hero-word hero-word--pati text-[#5C0A1A] font-semibold">pati izi</span>{' '}
                  ile mühürlenir.
                </>
              ) : (
                <>
                  In this studio everything starts with{' '}
                  <span className="hero-word hero-word--camur text-[#5C0A1A] font-semibold">clay</span>,
                  {' '}comes alive with{' '}
                  <span className="hero-word hero-word--renk text-[#5C0A1A] font-semibold">colour</span>,
                  {' '}and is sealed with a{' '}
                  <span className="hero-word hero-word--pati text-[#5C0A1A] font-semibold">paw print</span>.
                </>
              )}
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
              <p className="text-xs tracking-[0.2em] uppercase text-earth mb-3" style={cs('collection_label')}>{homepage.collection_label}</p>
              <h2 className="heading-display text-3xl md:text-4xl text-charcoal" style={cs('featured_title')}>{homepage.featured_title}</h2>
            </div>
            <Link href="/ceramics" className="link-line text-sm tracking-wider uppercase text-earth hover:text-charcoal transition-colors hidden md:block">
              {t.home.see_all}
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <ScrollReveal delay={100} className="h-full">
            <CeramicProductCard product={featured[0]} imageClass="aspect-[3/4]" />
          </ScrollReveal>
          <ScrollReveal delay={200} className="h-full">
            <CeramicProductCard product={featured[1]} imageClass="aspect-[3/4]" />
          </ScrollReveal>
          <ScrollReveal delay={300} className="h-full">
            <CeramicProductCard product={featured[2]} imageClass="aspect-[3/4]" />
          </ScrollReveal>
          <ScrollReveal delay={400} className="h-full">
            <CeramicProductCard product={featured[3]} imageClass="aspect-[3/4]" />
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
            <p className="text-xs tracking-[0.2em] uppercase text-earth mb-3" style={cs('philosophy_label')}>{homepage.philosophy_label}</p>
            <h2 className="heading-display text-3xl md:text-4xl text-charcoal" style={cs('philosophy_title')}>{homepage.philosophy_title}</h2>
            <p className="text-earth mt-4 leading-relaxed max-w-xl mx-auto" style={cs('philosophy_desc')}>
              {homepage.philosophy_desc}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {pillars.map((item, i) => (
            <ScrollReveal key={item.num} delay={i * 120}>
              <div className="text-center">
                <span className="heading-display text-6xl md:text-7xl text-accent/15">{item.num}</span>
                <h3 className="heading-serif text-lg text-charcoal mt-2 mb-3" style={cs(`pillar${item.n}_title`)}>{item.title}</h3>
                <p className="text-earth text-sm leading-relaxed" style={cs(`pillar${item.n}_desc`)}>{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════ PARALLAX CTA ═══════ */}
      <style>{`.parallax-home-cta{background-image:url('${homepage.cta_image}')}.parallax-home-cta .cta-overlay{opacity:${(homepage.cta_overlay_opacity ?? 60) / 100}}`}</style>
      <section className="relative h-[50vh] min-h-100 parallax-section parallax-home-cta">
        <div className="cta-overlay absolute inset-0 bg-charcoal" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <ScrollReveal direction="scale">
            <h2 className="heading-display text-bone text-3xl md:text-5xl mb-8" style={cs('cta_title')}>
              {homepage.cta_title}
            </h2>
            <Link
              href="/ceramics"
              style={cs('cta_btn')}
              className="inline-block bg-bone text-charcoal px-10 py-4 text-sm tracking-wider uppercase hover:bg-accent hover:text-bone transition-colors duration-300"
            >
              {homepage.cta_btn}
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="max-w-350 mx-auto px-6 md:px-10 py-20 md:py-28">
        <ScrollReveal>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="heading-serif text-2xl text-charcoal mb-3" style={cs('newsletter_title')}>{homepage.newsletter_title}</h2>
            <p className="text-earth text-sm mb-8" style={cs('newsletter_desc')}>
              {homepage.newsletter_desc}
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
            alt=""
            aria-hidden="true"
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
                src={about.craft_image}
                alt="El yapımı seramik atölyesi - seramik üretim süreci"
                fill
                className="object-cover"
                unoptimized={about.craft_image.startsWith('http')}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
