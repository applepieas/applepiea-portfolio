'use client';

import { useState } from 'react';
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Services from "@/components/sections/Services";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import Preloader from "@/components/ui/Preloader";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Preloader onComplete={() => setIsLoaded(true)} />
      <Header isLoaded={isLoaded} />
      <Hero isLoaded={isLoaded} />
      <About />
      <Services />
      <Stack />
      <Footer />
      <BottomNav isLoaded={isLoaded} />
    </main>
  );
}

