'use client';
import { useState, useEffect } from 'react';

/**
 * Returns true when viewport width < 1024px (lg breakpoint).
 * SSR-safe: returns false on server, updates after hydration.
 * Uses a debounced resize listener to avoid thrashing.
 * Single source of truth — replaces all ad-hoc mobile checks across the codebase.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);

    let rafId: number;
    const handler = (e: MediaQueryListEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsMobile(e.matches));
    };

    mq.addEventListener('change', handler);
    return () => {
      cancelAnimationFrame(rafId);
      mq.removeEventListener('change', handler);
    };
  }, []);

  return isMobile;
}
