'use client';

import { RefObject } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAPResize } from '@/components/providers/GSAPProvider';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered reveal for chart marks inside `scope`:
 * - `[data-bar]`  grows from its start edge (scaleX, or scaleY with `data-bar="y"`)
 * - `[data-pop]`  scales in from 0
 *
 * Re-runs on `resizeKey` — GSAPProvider kills every ScrollTrigger on large
 * resizes, and a killed `from` tween would otherwise leave marks stuck at 0.
 */
export function useChartReveal(scope: RefObject<HTMLElement | null>) {
  const { resizeKey } = useGSAPResize();

  useGSAP(() => {
    if (!scope.current) return;

    const barsX = scope.current.querySelectorAll('[data-bar="x"]');
    const barsY = scope.current.querySelectorAll('[data-bar="y"]');
    const pops = scope.current.querySelectorAll('[data-pop]');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: scope.current, start: 'top 75%', once: true },
    });

    if (barsX.length) {
      tl.from(barsX, {
        scaleX: 0, transformOrigin: 'left center', duration: 1.1,
        ease: 'power3.out', stagger: 0.05, force3D: true,
      }, 0);
    }
    if (barsY.length) {
      tl.from(barsY, {
        scaleY: 0, transformOrigin: 'center bottom', duration: 1.1,
        ease: 'power3.out', stagger: 0.06, force3D: true,
      }, 0);
    }
    if (pops.length) {
      tl.from(pops, {
        scale: 0, opacity: 0, duration: 0.6,
        ease: 'back.out(2)', stagger: 0.04,
      }, 0.3);
    }
  }, { scope, dependencies: [resizeKey] });
}
