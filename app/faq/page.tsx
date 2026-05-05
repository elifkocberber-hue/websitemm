import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import FaqClient, { type Faq } from './FaqClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description: 'El\'s Dream Factory hakkında sıkça sorulan sorular ve cevapları. Sipariş, kargo, iade ve seramik ürünler hakkında merak ettikleriniz.',
  alternates: { canonical: 'https://elsdreamfactory.com/faq' },
};

async function fetchFaqs(): Promise<Faq[]> {
  const { data } = await supabase
    .from('faqs')
    .select('id, question, answer')
    .eq('status', 'published')
    .order('created_at', { ascending: true });
  return data ?? [];
}

export default async function FaqPage() {
  const faqs = await fetchFaqs();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <FaqClient initialFaqs={faqs} />
    </>
  );
}
