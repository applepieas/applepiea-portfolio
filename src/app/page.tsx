'use client';

import { useEffect, useState } from 'react';
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Services from "@/components/sections/Services";
import BottomNav from "@/components/layout/BottomNav";
import Preloader from "@/components/ui/Preloader";
import Projects from "@/components/sections/Projects";

export default function Home() {
  const [hasSeenPreloader, setHasSeenPreloader] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Read sessionStorage only on the client after hydration
    setHasSeenPreloader(sessionStorage.getItem('preloaderSeen') === 'true');
  }, []);
  const isReady = isLoaded || hasSeenPreloader;
  const showPreloader = !isReady;

  useEffect(() => {
    const handlePageHide = () => {
      sessionStorage.removeItem('preloaderSeen');
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloaderSeen', 'true');
    setIsLoaded(true);
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

