'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId() {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
}

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTracked = useRef('');

  useEffect(() => {
    // Admin sayfalarını takip etme
    if (pathname.startsWith('/admin')) return;
    // Aynı sayfayı tekrar takip etme
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const trackVisit = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer || null,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            language: navigator.language,
            sessionId: getSessionId(),
          }),
        });
      } catch {
        // Sessizce başarısızlık - kullanıcı deneyimini etkilemez
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
