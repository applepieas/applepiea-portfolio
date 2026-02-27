"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
    });

    // Keep ScrollTrigger in sync with Lenis on every scroll tick.
    // Without this, ScrollTrigger never receives position updates because
    // Lenis replaces native scroll events with its own RAF-driven loop.
    lenis.on("scroll", () => ScrollTrigger.update());

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}