import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | El\'s Dream Factory',
  description: 'Learn about El\'s Dream Factory, our mission, and our commitment to handmade ceramic excellence.',
  keywords: 'about, company, ceramic artisan, handmade',
  openGraph: {
    title: 'About El\'s Dream Factory',
    description: 'Learn our story and passion for ceramics',
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
