import { MetadataRoute } from 'next';
import { ceramicProducts } from '@/data/ceramicProducts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.elsdreamfactory.com';

  // TR ve EN sürümü olan sayfalar — her biri hem TR hem /en URL'siyle listelenir
  // ve karşılıklı hreflang alternatları bildirilir (Google'ın önerdiği biçim).
  const bilingual: Array<{ tr: string; en: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }> = [
    { tr: '/', en: '/en', changeFrequency: 'daily', priority: 1.0 },
    { tr: '/ceramics', en: '/en/ceramics', changeFrequency: 'daily', priority: 0.9 },
    { tr: '/about', en: '/en/about', changeFrequency: 'monthly', priority: 0.8 },
  ];

  const bilingualEntries: MetadataRoute.Sitemap = bilingual.flatMap(({ tr, en, changeFrequency, priority }) => {
    const languages = { tr: `${baseUrl}${tr}`, en: `${baseUrl}${en}` };
    return [
      { url: `${baseUrl}${tr}`, lastModified: new Date(), changeFrequency, priority, alternates: { languages } },
      { url: `${baseUrl}${en}`, lastModified: new Date(), changeFrequency, priority, alternates: { languages } },
    ];
  });

  // Yalnız TR sayfalar (yasal/politika — çevirisi yok)
  const trOnly: MetadataRoute.Sitemap = ['/privacy', '/cookie-policy', '/terms', '/returns'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  // Ürün sayfaları — TR ve EN, karşılıklı hreflang ile
  const ceramicPages: MetadataRoute.Sitemap = ceramicProducts.flatMap((product) => {
    const trUrl = `${baseUrl}/ceramic/${product.id}`;
    const enUrl = `${baseUrl}/en/ceramic/${product.id}`;
    const languages = { tr: trUrl, en: enUrl };
    return [
      { url: trUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8, alternates: { languages } },
      { url: enUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8, alternates: { languages } },
    ];
  });

  return [...bilingualEntries, ...trOnly, ...ceramicPages];
}
