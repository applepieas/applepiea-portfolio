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
  }, [isMobile]); // re-run when mobile state is determined after hydration

  return <>{children}</>;
}