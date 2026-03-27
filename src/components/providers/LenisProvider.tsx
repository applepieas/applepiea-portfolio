// src/components/providers/LenisProvider.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useIsMobile } from "@/hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

interface LenisControls {
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisControls | null>(null);

export function useLenisControls() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const lenisRef = useRef<Lenis | null>(null);

  // Stable control object — never changes identity, always acts on current instance.
  const controls = useMemo<LenisControls>(() => ({
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  }), []);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: !isMobile,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Stop immediately if the preloader hasn't been dismissed yet.
    // This is checked in the same tick as creation so there is no window
    // where Lenis accepts scroll input before being stopped.
    try {
      if (sessionStorage.getItem('preloaderSeen') !== 'true') {
        lenis.stop();
      }
    } catch (_) {}

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
      lenisRef.current = null;
    };
  }, [isMobile]); // re-run when mobile state is determined after hydration

  return (
    <LenisContext.Provider value={controls}>
      {children}
    </LenisContext.Provider>
  );
}