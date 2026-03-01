import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/', '/search', '/checkout/', '/cart', '/payment', '/payment-failed', '/thank-you'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/', '/cart', '/payment', '/payment-failed', '/thank-you'],
      },
    ],
    sitemap: 'https://elsdreamfactory.com/sitemap.xml',
    host: 'https://elsdreamfactory.com',
  };
}
