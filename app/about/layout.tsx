import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkımızda | Kütahya\'dan El Yapımı Seramik Sanatı',
  description: 'El\'s Dream Factory\'nin hikayesi. 1994\'ten bu yana Kütahya\'nın üç kuşaklık seramik geleneğini yaşatıyoruz. El yapımı seramik sanatımızı keşfedin.',
  keywords: 'Kütahya seramiği, el yapımı seramik atölye, seramik sanatı, geleneksel seramik',
  openGraph: {
    title: 'Hakkımızda | El\'s Dream Factory',
    description: 'Kütahya\'dan el yapımı seramik sanatı — üç kuşaklık gelenekle modern tasarımın buluşması.',
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
