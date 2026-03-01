import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkımızda | El Yapımı Seramik Sanatı',
  description: 'El\'s Dream Factory\'nin hikayesi. El yapımı seramik sanatımızı ve üç kuşaklık geleneğimizi keşfedin.',
  keywords: 'el yapımı seramik atölye, seramik sanatı, geleneksel seramik, handmade seramik',
  openGraph: {
    title: 'Hakkımızda | El\'s Dream Factory',
    description: 'El yapımı seramik sanatı — üç kuşaklık gelenekle modern tasarımın buluşması.',,
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
