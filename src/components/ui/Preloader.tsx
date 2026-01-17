'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const counterValue = useRef({ value: 0 });

  useEffect(() => {
    if (!containerRef.current || !counterRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    // Counter animation: 0 to 100 in 1.5s
    tl.to(counterValue.current, {
      value: 100,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(counterValue.current.value).toString();
        }
      }
    });

    // Slide up animation after counter completes
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut',
    }, '+=0.2');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="preloader">
      <span ref={counterRef} className="preloader-counter">0</span>
    </div>
  );
};

export default Preloader;
