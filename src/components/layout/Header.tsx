'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Copy from '../ui/Copy';

export default function Header() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!buttonRef.current) return;

    gsap.fromTo(
      buttonRef.current,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    );
  });

  return (
    <header>

      <div className="overflow-hidden fixed left-4 lg:left-8 right-4 lg:right-8 top-4 lg:top-5 grid grid-cols-12 gap-4 lg:gap-8 z-50 font-medium text-[20px]">

        {/* Col 1: Location */}
        <div className="col-span-3 flex flex-col items-start gap-0.8">
          <Copy animateOnScroll={false} delay={0.1}>
            <span className="font-semibold text-foreground">Prague Based</span>
          </Copy>
          <Copy animateOnScroll={false} delay={0.15}>
            <span className="font-medium text-muted">Will work globally</span>
          </Copy>
        </div>

        {/* Col 2: Status */}
        <div className="col-span-3 flex flex-col items-start gap-0.8">
          <Copy animateOnScroll={false} delay={0.2}>
            <span className="font-semibold text-foreground">Currently</span>
          </Copy>
          <Copy animateOnScroll={false} delay={0.25}>
            <span className="font-medium text-muted">Learning Three.js</span>
          </Copy>
        </div>

        {/* Col 3: Local Time */}
        <div className="col-span-3 flex flex-col items-start gap-0.8">
          <Copy animateOnScroll={false} delay={0.3}>
            <span className="font-semibold text-foreground">Local time</span>
          </Copy>
          <Copy animateOnScroll={false} delay={0.35}>
            <span className="font-medium text-muted">22:03 GMT+</span>
          </Copy>
        </div>

      </div>

      <div className="fixed right-4 lg:right-8 top-4 lg:top-6 group cursor-pointer z-50 overflow-hidden">
        <button
          ref={buttonRef}
          className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3.5 rounded-[20px] font-semibold text-[1.25rem] cursor-pointer"
          style={{ opacity: 0 }}
        >
          Get in touch
        </button>
      </div>

    </header>
  );
}
