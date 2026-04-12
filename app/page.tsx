import { fetchProducts } from '@/data/ceramicProducts';
import { supabase } from '@/lib/supabase';
import HomeClient from './HomeClient';

const DEFAULT_BANNER = {
  items: ['Ceramic', 'Illustration', 'Gift', 'Handmade', 'Unique'] as string[],
  campaign_active: false,
  campaign_text: '',
  hero_image: '/images/arkaplan.jpg',
};

async function fetchBannerSettings() {
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

export default async function Home() {
  const [allProducts, banner] = await Promise.all([fetchProducts(), fetchBannerSettings()]);
  const featured = allProducts.slice(0, 4);

  return <HomeClient featured={featured} banner={banner} />;
}
