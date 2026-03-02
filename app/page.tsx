import Image from 'next/image';
import Link from 'next/link';
import { ceramicProducts } from '@/data/ceramicProducts';
import { CeramicProductCard } from '@/components/CeramicProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function Home() {
  const featured = ceramicProducts.slice(0, 4);

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative h-screen min-h-[600px] overflow-hidden bg-charcoal">
        <Image
          src="/images/arkaplan.jpg"
          alt="El yapımı seramik ürünler - Dekoratif seramik koleksiyonu"
          fill
          className="object-contain"
          priority
        />
        <div className="absolute inset-0 bg-charcoal/40" />

        <div className="relative z-10 h-full flex items-end pb-16 md:pb-24">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">
            <p className="text-bone/50 text-xs tracking-[0.3em] uppercase mb-6">
              El Yapımı Seramik Ürünler & Hediyeler
            </p>
            <h1 className="heading-display text-bone text-5xl md:text-7xl lg:text-8xl mb-6">
              Topraktan<br />Sanata
            </h1>
            <p className="text-bone/70 max-w-md text-lg mb-10 leading-relaxed">
              Üç kuşaklık seramik geleneğini modern tasarımla buluşturuyoruz. Sevimli kedi figürlerinden el yapımı kupalara, özel hediye seçenekleri keşfedin.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/ceramics"
                className="inline-block bg-bone text-charcoal px-8 py-4 text-sm tracking-wider uppercase hover:bg-accent hover:text-bone transition-colors duration-300"
              >
                Koleksiyonu Keşfet
              </Link>
              <Link
                href="/about"
                className="inline-block border border-bone/30 text-bone px-8 py-4 text-sm tracking-wider uppercase hover:border-bone hover:bg-bone/10 transition-all duration-300"
              >
                Hikayemiz
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-[1px] h-12 bg-bone/30 animate-pulse" />
        </div>
      </section>

      {/* ═══════ MARQUEE ═══════ */}
      <div className="marquee-container bg-charcoal py-4 select-none overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map((i) => (
            <span key={i} className="flex items-center gap-8 px-4">
              {['El Yapımı', 'Seramik', 'Sanat', 'Tasarım', 'Gelenek', 'Hediye'].map((word) => (
                <span key={`${i}-${word}`} className="flex items-center gap-8">
                  <span className="heading-serif text-bone/80 text-sm tracking-[0.15em] uppercase">{word}</span>
                  <span className="text-accent">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ FEATURED PRODUCTS ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <ScrollReveal>
          <div className="flex justify-between items-end mb-12 md:mb-16">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-earth mb-3">Koleksiyon</p>
              <h2 className="heading-display text-3xl md:text-4xl text-charcoal">Öne Çıkan Eserler</h2>
            </div>
            <Link href="/ceramics" className="link-line text-sm tracking-wider uppercase text-earth hover:text-charcoal transition-colors hidden md:block">
              Tümünü Gör
            </Link>
          </div>
        </ScrollReveal>

        {/* Asymmetric 12-col grid */}
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
            Tümünü Gör
          </Link>
        </div>
      </section>

      {/* ═══════ ABOUT SECTION (dark) ═══════ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-charcoal">
        <Image
          src="/images/arkaplan.jpg"
          alt="Arka plan"
          fill
          className="object-contain"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <ScrollReveal direction="left">
            <p className="text-xs tracking-[0.2em] uppercase text-clay mb-4">Hakkımızda</p>
            <h2 className="heading-display text-3xl md:text-4xl text-bone mb-6">
              Üç Kuşağın Mirası
            </h2>
            <p className="text-bone/60 leading-relaxed mb-4">
              1994&apos;ten bu yana seramik geleneğini yaşatıyoruz.
              Her ürünümüz, ustalarımızın ellerinde şekillenen benzersiz bir sanat eseri.
            </p>
            <p className="text-bone/60 leading-relaxed mb-8">
              Doğal topraklar, geleneksel teknikler ve modern tasarım anlayışımız
              ile yaşam alanlarınıza sanat katıyoruz.
            </p>
            <Link href="/about" className="link-line text-sm tracking-wider uppercase text-accent hover:text-bone transition-colors">
              Hikayemiz
            </Link>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="relative h-[400px] md:h-[520px]">
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

      {/* ═══════ PHILOSOPHY ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-earth mb-3">Felsefemiz</p>
            <h2 className="heading-display text-3xl md:text-4xl text-charcoal">Wabi-Sabi</h2>
            <p className="text-earth mt-4 leading-relaxed max-w-xl mx-auto">
              Kusursuzlukta güzellik aramıyoruz. Her çatlak, her doku, her asimetri
              — tabiatın ve insan elinin imzası.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {[
            { num: '01', title: 'Geleneksel Zanaat', desc: 'Yüzyıllık teknikleri modern formlarla buluşturuyoruz.' },
            { num: '02', title: 'Doğal Malzeme', desc: 'En kaliteli topraklar ve organik cilalarla üretiyoruz.' },
            { num: '03', title: 'Benzersiz Tasarım', desc: 'Her parça tek ve tekrarlanamaz bir sanat eseridir.' },
          ].map((item, i) => (
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
      <section
        className="relative h-[50vh] min-h-[400px] parallax-section"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <ScrollReveal direction="scale">
            <h2 className="heading-display text-bone text-3xl md:text-5xl mb-8">
              Evinize Sanat Katın
            </h2>
            <Link
              href="/ceramics"
              className="inline-block bg-bone text-charcoal px-10 py-4 text-sm tracking-wider uppercase hover:bg-accent hover:text-bone transition-colors duration-300"
            >
              Alışverişe Başla
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <ScrollReveal>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="heading-serif text-2xl text-charcoal mb-3">Haberdar Olun</h2>
            <p className="text-earth text-sm mb-8">
              Yeni koleksiyonlar, özel teklifler ve atölyeden haberler.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-5 py-3 bg-transparent border border-charcoal/20 text-sm text-charcoal placeholder:text-clay focus:outline-none focus:border-accent transition-colors"
              />
              <button className="bg-charcoal text-bone px-6 py-3 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300">
                Abone
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
