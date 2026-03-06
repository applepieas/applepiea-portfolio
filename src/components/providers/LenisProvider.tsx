// src/components/providers/LenisProvider.tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useIsMobile } from "@/hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: !isMobile,
      touchMultiplier: 1.5,
    });

    // Use gsap.ticker to drive both Lenis and ScrollTrigger on the rAF loop.
    // This is the recommended pattern from GSAP + Lenis docs:
    //   https://gsap.com/community/forums/topic/38588
    // Wiring ScrollTrigger.update() off the `scroll` event (the previous approach)
    // caused the Firefox "scroll-linked positioning effect" warning because the
    // browser flags any JS that mutates layout in a scroll listener.
    // Running everything inside gsap.ticker means no scroll-event listeners at
    // all — the browser compositor can pan natively while GSAP stays in sync.
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // gsap ticker gives seconds, Lenis expects ms
    };

    gsap.ticker.add(tickerCallback);

    // Prevent gsap.ticker from auto-applying its own lag smoothing on top of
    // Lenis' own smoothing (they would double-compensate for tab-hidden delays).
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger positions up-to-date on every Lenis tick.
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, [isMobile]); // re-run when mobile state is determined after hydration

  return <>{children}</>;
}