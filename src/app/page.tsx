'use client';

import { useEffect, useRef, useState } from 'react';
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Services from "@/components/sections/Services";
import BottomNav from "@/components/layout/BottomNav";
import Preloader from "@/components/ui/Preloader";
import Projects from "@/components/sections/Projects";
import { useLenisControls } from "@/components/providers/LenisProvider";

export default function Home() {
  const [hasSeenPreloader, setHasSeenPreloader] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const lenis = useLenisControls();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem('preloaderSeen') === 'true';
    setHasSeenPreloader(seen);
  }, []);

  const isReady = isLoaded || hasSeenPreloader;
  const showPreloader = !isReady;

  useEffect(() => {
    const handlePageHide = () => sessionStorage.removeItem('preloaderSeen');
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloaderSeen', 'true');
    setIsLoaded(true);
    // Wait 200 ms so Hero animations have a head-start before the user can scroll.
    timerRef.current = setTimeout(() => {
      document.documentElement.style.overflow = '';
      lenis?.start();
    }, 1300);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <Header isLoaded={isReady} />
      <Hero isLoaded={isReady} />
      <About />
      <Projects />
      <Services />
      <Stack />
      <BottomNav isLoaded={isReady} />
    </main>
  );
}
