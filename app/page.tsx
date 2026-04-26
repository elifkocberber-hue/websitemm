import { unstable_noStore as noStore } from 'next/cache';
import { fetchProducts } from '@/data/ceramicProducts';
import { supabase } from '@/lib/supabase';
import HomeClient from './HomeClient';

const DEFAULT_BANNER = {
  items: ['Ceramic', 'Illustration', 'Gift', 'Handmade', 'Unique'] as string[],
  campaign_active: false,
  campaign_text: '',
  hero_image: '/images/arkaplan.jpg',
};

const DEFAULT_ABOUT = {
  story_title: 'Topraktan\nDünyaya',
  story_p1: '1994\'ten bu yana seramik geleneğini yaşatıyoruz. Her ürünümüz, ustalarımızın ellerinde şekillenen benzersiz bir sanat eseri.',
  story_p2: 'Doğal topraklar, geleneksel teknikler ve modern tasarım anlayışımız ile yaşam alanlarınıza sanat katıyoruz.',
  craft_image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80',
};

const DEFAULT_HOMEPAGE = {
  hero_subtitle: 'El Yapımı Seramik Ürünler & Hediyeler',
  hero_title: 'Fırından Yeni Çıkan\nMutluluklar',
  hero_desc: 'Doğanın toprağından, ustalarımızın elleriyle şekillenen; evinize anlam ve güzellik katan eserler.',
  collection_label: 'Koleksiyon',
  featured_title: 'Öne Çıkan Eserler',
  philosophy_label: 'Felsefemiz',
  philosophy_title: 'Wabi-Sabi',
  philosophy_desc: 'Kusursuzlukta güzellik aramıyoruz. Her çatlak, her doku, her asimetri — tabiatın ve insan elinin imzası.',
  pillar1_title: 'Geleneksel Zanaat',
  pillar1_desc: 'Yüzyıllık teknikleri modern formlarla buluşturuyoruz.',
  pillar2_title: 'Doğal Malzeme',
  pillar2_desc: 'En kaliteli topraklar ve organik cilalarla üretiyoruz.',
  pillar3_title: 'Benzersiz Tasarım',
  pillar3_desc: 'Her parça tek ve tekrarlanamaz bir sanat eseridir.',
  cta_image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1920&q=80',
  cta_title: 'Evinize Sanat Katın',
  cta_btn: 'Alışverişe Başla',
  newsletter_title: 'Haberdar Olun',
  newsletter_desc: 'Yeni koleksiyonlar, özel teklifler ve atölyeden haberler.',
};

async function fetchBannerSettings() {
  noStore();
  try {
    const { data } = await supabase
      .from('banner_settings')
      .select('items, campaign_active, campaign_text, hero_image')
      .eq('id', 1)
      .single();
    return { ...DEFAULT_BANNER, ...(data ?? {}) };
  } catch {
    return DEFAULT_BANNER;
  }
}

async function fetchAboutSettings() {
  noStore();
  try {
    const { data } = await supabase
      .from('about_settings')
      .select('story_title, story_p1, story_p2, craft_image')
      .eq('id', 1)
      .single();
    return { ...DEFAULT_ABOUT, ...(data ?? {}) };
  } catch {
    return DEFAULT_ABOUT;
  }
}

async function fetchHomepageSettings() {
  noStore();
  try {
    const { data } = await supabase
      .from('homepage_settings')
      .select('*')
      .eq('id', 1)
      .single();
    return { ...DEFAULT_HOMEPAGE, ...(data ?? {}) };
  } catch {
    return DEFAULT_HOMEPAGE;
  }
}

async function fetchFeaturedIds(): Promise<(number | string)[]> {
  noStore();
  try {
    const { data } = await supabase
      .from('homepage_settings')
      .select('featured_product_ids')
      .eq('id', 1)
      .single();
    return data?.featured_product_ids ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [allProducts, banner, about, homepage, featuredIds] = await Promise.all([
    fetchProducts(),
    fetchBannerSettings(),
    fetchAboutSettings(),
    fetchHomepageSettings(),
    fetchFeaturedIds(),
  ]);

  let featured = allProducts.slice(0, 4);
  if (featuredIds.length > 0) {
    const picked = featuredIds
      .map((id) => allProducts.find((p) => String(p.id) === String(id)))
      .filter(Boolean) as typeof allProducts;
    if (picked.length > 0) {
      const rest = allProducts.filter((p) => !featuredIds.some((id) => String(id) === String(p.id)));
      featured = [...picked, ...rest].slice(0, 4);
    }
  }

  return <HomeClient featured={featured} banner={banner} about={about} homepage={homepage} />;
}
