'use client';

import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/**
 * Hook that returns the current Tailwind breakpoint based on viewport width.
 * SSR-safe: returns 'xs' on server, updates on client mount.
 * 
 * @returns Current breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    const getBreakpoint = (width: number): Breakpoint => {
      if (width >= BREAKPOINTS.xl) return 'xl';
      if (width >= BREAKPOINTS.lg) return 'lg';
      if (width >= BREAKPOINTS.md) return 'md';
      if (width >= BREAKPOINTS.sm) return 'sm';
      return 'xs';
    };

    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    // Set initial value
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

/**
 * Helper to check if current breakpoint is at or above a target.
 * @param current - Current breakpoint from useBreakpoint()
 * @param target - Target breakpoint to compare against
 */
export const isBreakpointAtLeast = (current: Breakpoint, target: Breakpoint): boolean => {
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  return order.indexOf(current) >= order.indexOf(target);
};
