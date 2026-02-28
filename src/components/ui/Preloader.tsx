'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

/** Images and video that need to be ready before the site is revealed. */
const PRELOAD_IMAGES = [
  '/desktop-showcase.jpg',
  '/card-showcase.jpg',
  '/design-service.jpg',
  '/development-service.jpg',
  '/integration-service.jpg',
  '/favicon-dark-680x680.jpg',
];
const HERO_VIDEO_URL =
  'https://res.cloudinary.com/dsh3yslek/video/upload/v1772040750/My_Movie_cjgr03.mp4';

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const counterValue = useRef({ value: 0 });

  useEffect(() => {
    if (!containerRef.current || !counterRef.current) return;

    let counterDone = false;
    let assetsDone = false;
    let exitStarted = false;
    const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];

    const startExit = () => {
      if (counterDone && assetsDone && !exitStarted && containerRef.current) {
        exitStarted = true;
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: onComplete,
        });
      }
    };

    // --- Asset preloading ---
    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // never block on network error
        img.src = src;
      });

    const preloadVideo = (src: string) =>
      new Promise<void>((resolve) => {
        let resolved = false;
        const done = () => {
          if (resolved) return;
          resolved = true;
          resolve();
        };
        const video = document.createElement('video');
        video.muted = true;
        video.preload = 'auto';
        video.addEventListener('canplay', done, { once: true });
        video.addEventListener('error', done, { once: true });
        // Timeout so a slow connection never blocks the preloader indefinitely
        const tid = setTimeout(done, 5000);
        pendingTimeouts.push(tid);
        video.src = src;
      });

    Promise.all([
      ...PRELOAD_IMAGES.map(preloadImage),
      preloadVideo(HERO_VIDEO_URL),
    ]).then(() => {
      assetsDone = true;
      startExit();
    });

    // --- Counter animation (minimum 1.5 s) ---
    const counterTween = gsap.to(counterValue.current, {
      value: 100,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(
            counterValue.current.value
          ).toString();
        }
      },
      onComplete: () => {
        counterDone = true;
        startExit();
      },
    });

    return () => {
      counterTween.kill();
      pendingTimeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="preloader">
      <span ref={counterRef} className="preloader-counter">0</span>
    </div>
  );
};

export default Preloader;
