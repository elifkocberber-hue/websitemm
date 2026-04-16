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
      .select('story_title, story_p1, story_p2')
      .eq('id', 1)
      .single();
    return { ...DEFAULT_ABOUT, ...(data ?? {}) };
  } catch {
    return DEFAULT_ABOUT;
  }
}

export default async function Home() {
  const [allProducts, banner, about] = await Promise.all([
    fetchProducts(),
    fetchBannerSettings(),
    fetchAboutSettings(),
  ]);
  const featured = allProducts.slice(0, 4);

  return <HomeClient featured={featured} banner={banner} about={about} />;
}
