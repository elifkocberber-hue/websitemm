import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'El Yapımı Seramik Koleksiyonu | Kupa, Vazo, Kedi Figür & Hediye',
  description: 'El yapımı seramik ürünler: sevimli kedi figürleri, dekoratif vazolar, seramik kupalar ve özel hediye seçenekleri. Kütahya\'dan el emeğiyle üretilen benzersiz seramik objeler.',
  keywords: 'el yapımı seramik, seramik kedi figür, seramik kupa, dekoratif vazo, seramik hediye, handmade seramik, sevimli seramik objeler',
  openGraph: {
    title: 'El Yapımı Seramik Koleksiyonu | El\'s Dream Factory',
    description: 'Sevimli kedi figürleri, el yapımı kupalar ve dekoratif seramik objeler. Koleksiyonu keşfedin.',
    type: 'website',
    images: [
      {
        url: 'https://elsdreamfactory.com/ceramics-og.png',
        width: 1200,
        height: 630,
        alt: 'El Yapımı Seramik Koleksiyonu - Kedi Figürleri, Kupalar ve Dekoratif Objeler',
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
