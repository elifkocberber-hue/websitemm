'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
}

export const ScrollReveal = ({ children, className = '', direction = 'up', delay = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const visibleClass =
      direction === 'left' ? 'reveal-left--visible' :
      direction === 'right' ? 'reveal-right--visible' :
      direction === 'scale' ? 'reveal-scale--visible' :
      'reveal--visible';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add(visibleClass), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  const baseClass =
    direction === 'left' ? 'reveal-left' :
    direction === 'right' ? 'reveal-right' :
    direction === 'scale' ? 'reveal-scale' :
    'reveal';

  return (
    <div ref={ref} className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
};
