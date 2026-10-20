'use client';
import { useSyncExternalStore } from 'react';

const QUERY = '(max-width: 1023px)';

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Returns true when viewport width < 1024px (lg breakpoint).
 * SSR-safe: returns false on server, updates after hydration.
 * matchMedia only fires when the query flips, so there is no resize thrashing.
 * Single source of truth — replaces all ad-hoc mobile checks across the codebase.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
