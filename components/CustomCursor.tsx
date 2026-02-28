'use client';

import { useEffect, useState, useCallback } from 'react';

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setVisible(true);
  }, []);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    const handleOver = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"], input, select, textarea, label')) {
        setHovering(true);
      }
    };
    const handleOut = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"], input, select, textarea, label')) {
        setHovering(false);
      }
    };
    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    document.documentElement.addEventListener('mouseleave', handleLeave);
    document.documentElement.addEventListener('mouseenter', handleEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      document.documentElement.removeEventListener('mouseenter', handleEnter);
    };
  }, [handleMouseMove]);

  if (!visible) return null;

  return (
    <div
      className={`custom-cursor${hovering ? ' custom-cursor--hover' : ''}`}
      style={{ left: pos.x, top: pos.y }}
      aria-hidden="true"
    />
  );
};
