// src/hooks/useBreakpoint.ts
'use client';

import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

const getBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * Hook that returns the current Tailwind breakpoint based on viewport width.
 * SSR-safe: returns 'xs' on server, updates on client mount.
 * Uses a debounced resize listener to avoid excessive re-renders.
 */
export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    // Set initial value immediately
    setBreakpoint(getBreakpoint(window.innerWidth));

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setBreakpoint(getBreakpoint(window.innerWidth));
      }, 150); // 150ms debounce — fast enough to feel responsive, avoids thrashing
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
};

/**
 * Helper to check if current breakpoint is at or above a target.
 */
export const isBreakpointAtLeast = (current: Breakpoint, target: Breakpoint): boolean => {
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  return order.indexOf(current) >= order.indexOf(target);
};
