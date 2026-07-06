import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import AboutClient, { type AboutSettings } from '../../about/AboutClient';

export const revalidate = 300;

async function fetchAbout(): Promise<AboutSettings | null> {
  const { data } = await supabase.from('about_settings').select('*').limit(1).maybeSingle();
  return (data as AboutSettings) ?? null;
}

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    "El's Dream Factory carries a three-generation ceramic tradition. Discover our story, our values and our handmade ceramic craft.",
  alternates: {
    canonical: 'https://www.elsdreamfactory.com/en/about',
    languages: {
      tr: 'https://www.elsdreamfactory.com/about',
      en: 'https://www.elsdreamfactory.com/en/about',
      'x-default': 'https://www.elsdreamfactory.com/about',
    },
  },
  openGraph: {
    title: "Our Story | El's Dream Factory",
    description:
      "The story, values and handmade ceramic craft behind El's Dream Factory.",
    url: 'https://www.elsdreamfactory.com/en/about',
    type: 'website',
    locale: 'en_US',
  },
};

export default async function AboutPageEn() {
  const about = await fetchAbout();
  return <AboutClient about={about} />;
}
