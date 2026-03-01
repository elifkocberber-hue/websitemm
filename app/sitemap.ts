import { MetadataRoute } from 'next';
import { ceramicProducts } from '@/data/ceramicProducts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://elsdreamfactory.com';

  // Ana sayfalar
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ceramics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Tüm seramik ürünler için dinamik sitemap
  const ceramicPages: MetadataRoute.Sitemap = ceramicProducts.map((product) => ({
    url: `${baseUrl}/ceramic/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...pages, ...ceramicPages];
}
