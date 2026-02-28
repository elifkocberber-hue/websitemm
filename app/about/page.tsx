import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function AboutPage() {
  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1604424321003-50b9174b28e3?w=1920&q=80"
          alt="Seramik atölyesi"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="relative z-10 h-full flex items-end pb-12 md:pb-16">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">
            <p className="text-bone/50 text-xs tracking-[0.3em] uppercase mb-4">Hakkımızda</p>
            <h1 className="heading-display text-bone text-4xl md:text-6xl">Hikayemiz</h1>
          </div>
        </div>
      </section>

      {/* ═══════ STORY ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <p className="text-xs tracking-[0.2em] uppercase text-accent mb-4">Kuruluş · 1994</p>
            <h2 className="heading-display text-3xl md:text-4xl text-charcoal mb-6">
              Kütahya&apos;dan<br />Dünyaya
            </h2>
            <p className="text-earth leading-relaxed mb-4">
              Üç kuşaklık seramik geleneğini taşıyan atölyemiz, 1994 yılında Kütahya&apos;da kuruldu.
              Babamızın başlattığı bu yolculuk, bugün aynı tutku ve titizlikle devam etmektedir.
            </p>
            <p className="text-earth leading-relaxed mb-4">
              Her ürünümüz, el yapımı teknikleri ve ustalarımızın birikimi ile özenle şekillendirilir.
              Geleneksel topraklar ve modern tasarımlar bir araya gelerek çağdaş bir koleksiyon oluşturmuştur.
            </p>
            <p className="text-earth leading-relaxed">
              Biz sadece ürün satmıyoruz — sanat ve kültüre saygı içinde yaratılan,
              hayatın her anını güzelleştiren eserler sunuyoruz.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="relative aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80"
                alt="Seramik üretim süreci"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ PARALLAX DIVIDER ═══════ */}
      <section
        className="relative h-[40vh] min-h-[300px] parallax-section"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-charcoal/30" />
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { value: '30+', label: 'Yıl Deneyim' },
            { value: '400+', label: 'Benzersiz Tasarım' },
            { value: '%98', label: 'Müşteri Memnuniyeti' },
            { value: '3', label: 'Kuşak Gelenek' },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100}>
              <div className="text-center">
                <p className="heading-display text-4xl md:text-5xl text-accent">{stat.value}</p>
                <p className="text-xs tracking-[0.15em] uppercase text-earth mt-3">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════ VALUES (dark) ═══════ */}
      <section className="bg-charcoal py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.2em] uppercase text-clay mb-3">Felsefe</p>
              <h2 className="heading-display text-3xl md:text-4xl text-bone">Değerlerimiz</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-3xl mx-auto">
            {[
              { title: 'Geleneksel Zanaat', desc: 'Yüzyıllık seramik tekniklerini modern formlarla harmanlıyoruz.' },
              { title: 'El Yapımı Kalite', desc: 'Her parça, ustalarımızın deneyimli elleri tarafından tek tek şekillendirilir.' },
              { title: 'Doğal Malzeme', desc: 'En kaliteli topraklar ve organik cilalarla çevre dostu üretim yapıyoruz.' },
              { title: 'Sürdürülebilirlik', desc: 'Doğaya saygılı üretim süreçleriyle geleceğe yatırım yapıyoruz.' },
            ].map((val, i) => (
              <ScrollReveal key={val.title} delay={i * 100}>
                <div className="border-l border-bone/20 pl-6">
                  <h3 className="heading-serif text-lg text-bone mb-2">{val.title}</h3>
                  <p className="text-bone/50 text-sm leading-relaxed">{val.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT CTA ═══════ */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
        <ScrollReveal>
          <p className="text-xs tracking-[0.2em] uppercase text-earth mb-3">İletişim</p>
          <h2 className="heading-display text-3xl md:text-4xl text-charcoal mb-6">Bize Ulaşın</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-earth mb-10">
            <p>info@elsdreamfactory.com</p>
            <p>Kütahya, Türkiye</p>
          </div>
          <Link
            href="/ceramics"
            className="inline-block bg-charcoal text-bone px-10 py-4 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300"
          >
            Koleksiyona Göz At
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
