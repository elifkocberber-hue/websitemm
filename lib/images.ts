// next.config.ts remotePatterns ile eşleşen hostlar — bunlardan gelen görseller
// Next.js tarafından optimize edilebilir (WebP/AVIF, boyutlandırma, lazy-load).
// Optimizasyonu yalnız listede OLMAYAN dış hostlar için kapatırız; aksi halde
// hero gibi LCP görselleri gereksiz yere tam boyut iner.
const OPTIMIZABLE_HOSTS = new Set([
  'images.unsplash.com',
  'zpqtdaoyeokavrkosuii.supabase.co',
]);

export function needsUnoptimized(url: string | null | undefined): boolean {
  if (!url || !url.startsWith('http')) return false; // yerel /images yolları optimize edilir
  try {
    return !OPTIMIZABLE_HOSTS.has(new URL(url).hostname);
  } catch {
    return true;
  }
}
