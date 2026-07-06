import type { Metadata } from 'next';
import { getHomeData } from '../_lib/homeData';
import HomeClient from '../HomeClient';

export const metadata: Metadata = {
  title: "El's Dream Factory | Handmade Ceramics & Gifts",
  description:
    'Handmade ceramics, adorable cat figurines, decorative objects and unique gifts. Discover one-of-a-kind Turkish ceramic mugs, vases and gift ideas.',
  alternates: {
    canonical: 'https://www.elsdreamfactory.com/en',
    languages: {
      tr: 'https://www.elsdreamfactory.com',
      en: 'https://www.elsdreamfactory.com/en',
      'x-default': 'https://www.elsdreamfactory.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.elsdreamfactory.com/en',
    title: "El's Dream Factory | Handmade Ceramics & Gifts",
    description:
      'Adorable cat figurines, handmade ceramic mugs and decorative objects. Discover artistic gifts for your loved ones.',
    siteName: "El's Dream Factory",
  },
};

export default async function HomeEn() {
  const { featured, banner, about, homepage } = await getHomeData();
  // Dil, kök LanguageProvider tarafından /en yolunda otomatik 'en'e kilitlenir.
  return <HomeClient featured={featured} banner={banner} about={about} homepage={homepage} />;
}
