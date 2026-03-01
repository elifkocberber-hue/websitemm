import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ceramics & Pottery | El\'s Dream Factory',
  description: 'Browse our collection of handmade ceramic products, pottery, and home décor items. Traditional and modern ceramic designs.',
  keywords: 'ceramics, pottery, ceramic products, handmade pottery, home décor',
  openGraph: {
    title: 'Ceramics Collection | El\'s Dream Factory',
    description: 'Explore beautiful handmade ceramic products',
    type: 'website',
    images: [
      {
        url: 'https://elsdreamfactory.com/ceramics-og.png',
        width: 1200,
        height: 630,
        alt: 'Ceramic Products',
      },
    ],
  },
};

export default function CeramicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
