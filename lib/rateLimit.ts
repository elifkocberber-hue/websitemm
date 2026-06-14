// Rate limiting — Redis (Upstash) varsa dağıtık; yoksa bellek-içi fallback.
//
// Vercel'de Upstash Redis (Marketplace) bağlandığında otomatik eklenen env'leri
// kullanır: KV_REST_API_URL/KV_REST_API_TOKEN veya UPSTASH_REDIS_REST_URL/TOKEN.
// Bu env'ler yoksa eski bellek-içi davranışa düşer (lokal/geçiş için).

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

function cleanupIfNeeded() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export function getRateLimitKey(request: Request, prefix: string): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return `${prefix}:${ip}`;
}

function getRedisConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

// Upstash REST pipeline: INCR + (ilk hitte) EXPIRE. Dönen sayı = pencere içindeki istek sayısı.
async function redisIncr(key: string, windowSec: number): Promise<number | null> {
  const cfg = getRedisConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, windowSec, 'NX'],
      ]),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const count = Array.isArray(data) ? data[0]?.result : undefined;
    return typeof count === 'number' ? count : null;
  } catch {
    return null;
  }
}

function memoryCheck(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  cleanupIfNeeded();
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

export async function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 dakika
): Promise<{ allowed: boolean; remaining: number }> {
  const windowSec = Math.ceil(windowMs / 1000);
  const count = await redisIncr(`rl:${key}`, windowSec);

  if (count !== null) {
    // Redis tabanlı (dağıtık, tüm sunucu örnekleri arasında ortak)
    return { allowed: count <= maxRequests, remaining: Math.max(0, maxRequests - count) };
  }

  // Redis yapılandırılmamış/erişilemez → bellek-içi fallback
  return memoryCheck(key, maxRequests, windowMs);
}
