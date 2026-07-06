import type { Metadata } from 'next';
import { getHomeData } from './_lib/homeData';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.elsdreamfactory.com',
    languages: {
      tr: 'https://www.elsdreamfactory.com',
      en: 'https://www.elsdreamfactory.com/en',
      'x-default': 'https://www.elsdreamfactory.com',
    },
  },
};

export default async function Home() {
  const { featured, banner, about, homepage } = await getHomeData();
  return <HomeClient featured={featured} banner={banner} about={about} homepage={homepage} />;
}
