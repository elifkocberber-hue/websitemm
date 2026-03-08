declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

export const hasMarketingConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const prefs = localStorage.getItem('cookie_preferences');
    if (prefs) return JSON.parse(prefs).marketing === true;
    return localStorage.getItem('cookie_consent') === 'accepted';
  } catch {
    return false;
  }
};

export const generateEventId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

// Fire browser-side pixel
const firePixel = (
  eventName: string,
  data: Record<string, unknown>,
  eventId: string
): void => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', eventName, data, { eventID: eventId });
};

// Send to server-side CAPI proxy (fire-and-forget)
const sendToCAPI = (
  eventName: string,
  eventData: Record<string, unknown>,
  eventId: string,
  sourceUrl: string
): void => {
  fetch('/api/meta/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventName, eventData, eventId, sourceUrl }),
  }).catch(() => {/* silently fail */});
};

// Shared dispatcher — consent check, eventId üretimi, her iki kanala gönderim
const track = (
  eventName: string,
  pixelData: Record<string, unknown>,
  eventId?: string
): void => {
  if (!hasMarketingConsent()) return;
  const id = eventId ?? generateEventId();
  const sourceUrl = typeof window !== 'undefined' ? window.location.href : '';
  firePixel(eventName, pixelData, id);
  sendToCAPI(eventName, pixelData, id, sourceUrl);
};

// ─── Public tracking functions ───────────────────────────────────────────────

export const trackViewContent = (product: {
  id: number | string;
  name: string;
  price: number;
}): void => {
  track('ViewContent', {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'TRY',
  });
};

export const trackAddToCart = (
  product: { id: number | string; name: string; price: number },
  quantity: number
): void => {
  track('AddToCart', {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: 'product',
    value: product.price * quantity,
    currency: 'TRY',
    num_items: quantity,
  });
};

export const trackInitiateCheckout = (
  items: { id: number | string; quantity: number }[],
  totalValue: number
): void => {
  track('InitiateCheckout', {
    content_ids: items.map(i => String(i.id)),
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    value: totalValue,
    currency: 'TRY',
  });
};

// eventId parametresi: Purchase için dışarıdan belirlenmiş ID ile hem pixel
// hem CAPI aynı ID'yi kullanır → Meta de-duplicate eder
export const trackPurchase = (
  orderId: string,
  items: { id: number | string; quantity: number }[],
  totalValue: number,
  eventId?: string
): void => {
  track('Purchase', {
    content_ids: items.map(i => String(i.id)),
    content_type: 'product',
    value: totalValue,
    currency: 'TRY',
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    order_id: orderId,
  }, eventId);
};
