'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useLanguage } from '@/context/LanguageContext';

export interface AboutSettings {
  hero_image: string;
  story_image: string;
  craft_image: string;
  founded: string;
  story_title: string;
  story_p1: string;
  story_p2: string;
  story_p3: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  stat4_value: string;
  stat4_label: string;
  val1_title: string;
  val1_desc: string;
  val2_title: string;
  val2_desc: string;
  val3_title: string;
  val3_desc: string;
  val4_title: string;
  val4_desc: string;
  text_colors?: Record<string, string>;
}

export default function AboutClient({ about }: { about: AboutSettings | null }) {
  const { t } = useLanguage();

  // Fallback to translations when DB data isn't loaded yet
  const heroImage = about?.hero_image ?? 'https://images.unsplash.com/photo-1604424321003-50b9174b28e3?w=1920&q=80';
  const storyImage = about?.story_image ?? 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80';
  const craftImage = about?.craft_image ?? 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=1920&q=80';
  const founded = about?.founded ?? t.about.founded;
  const storyTitle = about?.story_title ?? t.about.story_title;
  const storyP1 = about?.story_p1 ?? t.about.story_p1;
  const storyP2 = about?.story_p2 ?? t.about.story_p2;
  const storyP3 = about?.story_p3 ?? t.about.story_p3;

  const stats = [
    { n: 1, value: about?.stat1_value ?? '30+', label: about?.stat1_label ?? t.about.stat1 },
    { n: 2, value: about?.stat2_value ?? '400+', label: about?.stat2_label ?? t.about.stat2 },
    { n: 3, value: about?.stat3_value ?? '%98', label: about?.stat3_label ?? t.about.stat3 },
    { n: 4, value: about?.stat4_value ?? '3', label: about?.stat4_label ?? t.about.stat4 },
  ];

  const values = [
    { n: 1, title: about?.val1_title ?? t.about.val1_title, desc: about?.val1_desc ?? t.about.val1_desc },
    { n: 2, title: about?.val2_title ?? t.about.val2_title, desc: about?.val2_desc ?? t.about.val2_desc },
    { n: 3, title: about?.val3_title ?? t.about.val3_title, desc: about?.val3_desc ?? t.about.val3_desc },
    { n: 4, title: about?.val4_title ?? t.about.val4_title, desc: about?.val4_desc ?? t.about.val4_desc },
  ];

  const tc = about?.text_colors ?? {};
  const cs = (key: string): React.CSSProperties | undefined => tc[key] ? { color: tc[key] } : undefined;

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative h-[60vh] min-h-100 overflow-hidden">
        <Image
          src={heroImage}
          alt="El's Dream Factory seramik atölyesi - el yapımı seramik üretim"
          fill
          className="object-cover"
          priority
          unoptimized={heroImage.startsWith('http')}
        />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="relative z-10 h-full flex items-end pb-12 md:pb-16">
          <div className="max-w-350 mx-auto px-6 md:px-10 w-full">
            <h1 className="heading-display text-bone text-4xl md:text-6xl">{t.about.hero_title}</h1>
          </div>
        </div>
      </section>

      {/* ═══════ STORY ═══════ */}
      <section className="max-w-350 mx-auto px-6 md:px-10 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <p className="text-xs tracking-[0.2em] uppercase text-accent mb-4" style={cs('founded')}>{founded}</p>
            <h2 className="heading-display text-3xl md:text-4xl text-charcoal mb-6 whitespace-pre-line" style={cs('story_title')}>
              {storyTitle}
            </h2>
            <p className="text-earth leading-relaxed mb-4" style={cs('story_p1')}>{storyP1}</p>
            <p className="text-earth leading-relaxed mb-4" style={cs('story_p2')}>{storyP2}</p>
            <p className="text-earth leading-relaxed" style={cs('story_p3')}>{storyP3}</p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="relative aspect-4/5">
              <Image
                src={storyImage}
                alt="Seramik üretim süreci"
                fill
                className="object-cover"
                unoptimized={storyImage.startsWith('http')}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ PARALLAX DIVIDER ═══════ */}
      <style>{`.parallax-about-divider{background-image:url('${craftImage}')}`}</style>
      <section className="relative h-[40vh] min-h-75 parallax-section parallax-about-divider">
        <div className="absolute inset-0 bg-charcoal/30" />
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="max-w-350 mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100}>
              <div className="text-center">
                <p className="heading-display text-4xl md:text-5xl text-accent" style={cs(`stat${stat.n}_value`)}>{stat.value}</p>
                <p className="text-xs tracking-[0.15em] uppercase text-earth mt-3" style={cs(`stat${stat.n}_label`)}>{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════ VALUES (dark) ═══════ */}
      <section className="bg-charcoal py-20 md:py-28">
        <div className="max-w-350 mx-auto px-6 md:px-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.2em] uppercase text-clay mb-3">{t.about.values_label}</p>
              <h2 className="heading-display text-3xl md:text-4xl text-bone">{t.about.values_title}</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-3xl mx-auto">
            {values.map((val, i) => (
              <ScrollReveal key={val.title} delay={i * 100}>
                <div className="border-l border-bone/20 pl-6">
                  <h3 className="heading-serif text-lg text-bone mb-2" style={cs(`val${val.n}_title`)}>{val.title}</h3>
                  <p className="text-bone/50 text-sm leading-relaxed" style={cs(`val${val.n}_desc`)}>{val.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT CTA ═══════ */}
      <section className="max-w-350 mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
        <ScrollReveal>
          <p className="text-xs tracking-[0.2em] uppercase text-earth mb-3">{t.about.contact_label}</p>
          <h2 className="heading-display text-3xl md:text-4xl text-charcoal mb-6">{t.about.contact_title}</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-earth mb-10">
            <p><a href="mailto:elsdreamfactory@gmail.com" className="hover:text-charcoal transition-colors">elsdreamfactory@gmail.com</a></p>
            <p><a href="https://instagram.com/elsdreamfactory" target="_blank" rel="noopener noreferrer" className="hover:text-charcoal transition-colors">instagram.com/elsdreamfactory</a></p>
            <p>Türkiye</p>
          </div>
          <Link
            href="/ceramics"
            className="inline-block bg-charcoal text-bone px-10 py-4 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300"
          >
            {t.about.browse_btn}
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
