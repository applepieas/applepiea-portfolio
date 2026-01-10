import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Services from "@/components/sections/Services";
import Footer from "@/components/layout/Footer";
import Outro from "@/components/sections/Outro";
import Lenis from 'lenis'

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <Hero />
      <Outro />
    </main>
  );
}
