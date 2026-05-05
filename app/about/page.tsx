import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import AboutClient, { type AboutSettings } from './AboutClient';

export const revalidate = 300;

async function fetchAbout(): Promise<AboutSettings | null> {
  const { data } = await supabase.from('about_settings').select('*').limit(1).maybeSingle();
  return (data as AboutSettings) ?? null;
}

export async function generateMetadata(): Promise<Metadata> {
  const about = await fetchAbout();
  const description =
    about?.story_p1 ??
    'Üç kuşaklık seramik geleneğini taşıyan El\'s Dream Factory atölyemizin hikayesi, değerleri ve el yapımı seramik üretim sürecimiz.';

  return {
    title: 'Hikayemiz',
    description,
    alternates: { canonical: 'https://elsdreamfactory.com/about' },
    openGraph: {
      title: 'Hikayemiz | El\'s Dream Factory',
      description,
      url: 'https://elsdreamfactory.com/about',
      type: 'website',
    },
  };
}

export default async function AboutPage() {
  const about = await fetchAbout();
  return <AboutClient about={about} />;
}
