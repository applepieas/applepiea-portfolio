// src/components/providers/LenisProvider.tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable Lenis smooth scroll on touch/mobile devices — the browser's
    // native momentum scroll is better optimised and has lower input latency.
    const isTouchDevice =
      typeof navigator !== 'undefined' &&
      (/Mobi|Android/i.test(navigator.userAgent) ||
        navigator.maxTouchPoints > 1);

    const lenis = new Lenis({
      smoothWheel: !isTouchDevice,
      touchMultiplier: 1.5,
    });

    // Keep ScrollTrigger in sync with Lenis on every scroll tick.
    lenis.on("scroll", () => ScrollTrigger.update());

    // Store the rAF id so we can cancel it on cleanup — without this,
    // the recursive rAF loop outlives the component and leaks.
    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId); // cancel BEFORE destroy
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}