import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // iyzipay paketi dinamik require kullanıyor; bundle etme, runtime'da node_modules'tan yükle
  serverExternalPackages: ['iyzipay'],
  // iyzipay dinamik olarak lib/resources altını okur; Vercel fonksiyonuna bu dosyaları zorla dahil et
  outputFileTracingIncludes: {
    '/api/payment': ['./node_modules/iyzipay/**'],
    '/api/payment/3ds-callback': ['./node_modules/iyzipay/**'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'zpqtdaoyeokavrkosuii.supabase.co',
      },
    ],
  },
};

export default nextConfig;
