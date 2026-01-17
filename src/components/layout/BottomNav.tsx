'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface BottomNavProps {
  isLoaded?: boolean;
}

export default function BottomNav({ isLoaded = false }: BottomNavProps) {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!navRef.current || !isLoaded) return;

    gsap.fromTo(
      navRef.current,
      {
        yPercent: 125,
        scale: 0.75,
      },
      {
        yPercent: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4,
      }
    );
  }, { dependencies: [isLoaded] });

  return (
    <nav ref={navRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
      <div className="flex items-center bg-foreground text-background rounded-2xl px-2 py-2 gap-4 shadow-2xl w-[38vw]">

        {/* Left: Profile Image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-background flex-shrink-0">
          <Image
            src="/image.png"
            alt="Profile"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Center: Name and Marquee */}
        <div className="flex flex-col flex-1 overflow-hidden mx-2">
          <span className="text-base font-semibold tracking-tight text-[18px] mb-2">PAVEL ROSENBERG</span>
          <div className="relative overflow-hidden w-full">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-foreground to-transparent z-10 pointer-events-none"></div>
            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-foreground to-transparent z-10 pointer-events-none"></div>
            <div className="flex whitespace-nowrap animate-marquee">
              <span className="text-[16px] text-background/60 font-medium">
                DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp;&nbsp;
              </span>
              <span className="text-[16px] text-background/60 font-medium">
                DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </div>

        {/* Right: Hamburger Menu */}
        <button className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 flex-shrink-0 cursor-pointer mr-4">
          <span className="w-6 h-0.5 bg-background rounded-full"></span>
          <span className="w-6 h-0.5 bg-background rounded-full"></span>
          <span className="w-6 h-0.5 bg-background rounded-full"></span>
        </button>

      </div>
    </nav>
  );
}

