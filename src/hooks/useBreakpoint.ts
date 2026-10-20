// src/hooks/useBreakpoint.ts
'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

const getBreakpoint = (): Breakpoint => {
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * Subscribes to a value derived from the viewport (e.g. a breakpoint name).
 * SSR-safe: returns `serverValue` on the server and during hydration.
 * Resize events are debounced, and components only re-render when the
 * derived value actually changes — so mobile browser chrome showing/hiding
 * (a height-only resize) never causes a re-render.
 */
export function useViewportValue<T extends string | number | boolean>(
  compute: () => T,
  serverValue: T,
  debounceMs = 150,
): T {
  const subscribe = useCallback((onChange: () => void) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(onChange, debounceMs);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceMs]);

  return useSyncExternalStore(subscribe, compute, () => serverValue);
}

/**
 * Hook that returns the current Tailwind breakpoint based on viewport width.
 * SSR-safe: returns 'xs' on server, updates on client mount.
 */
export const useBreakpoint = (): Breakpoint => useViewportValue(getBreakpoint, 'xs', 150);

/**
 * Helper to check if current breakpoint is at or above a target.
 */
export const isBreakpointAtLeast = (current: Breakpoint, target: Breakpoint): boolean => {
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  return order.indexOf(current) >= order.indexOf(target);
};
