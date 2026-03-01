// src/components/ui/Preloader.tsx
'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

// All critical assets to preload before the site is revealed.
// Add/remove paths here to match your actual above-fold assets.
const PRELOAD_IMAGES = [
  '/design-service.jpg',
  '/development-service.jpg',
  '/integration-service.jpg',
  '/case-study/card-showcase.jpg',
  '/case-study/desktop-showcase.jpg',
  '/case-study/mobile-showcase.jpg',
];

const PRELOAD_VIDEO =
  'https://res.cloudinary.com/dsh3yslek/video/upload/v1772040750/My_Movie_cjgr03.mp4';

// Safety timeout: if assets haven't loaded after 5 s, proceed anyway
const SAFETY_TIMEOUT_MS = 5000;

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  // Mutable object so gsap.to() can tween it without stale-closure issues
  const displayValue = useRef({ value: 0 });

  useEffect(() => {
    if (!containerRef.current || !counterRef.current) return;

    let completed = false;

    // Animate the displayed counter to a new target percentage
    const animateCounterTo = (target: number, onDone?: () => void) => {
      gsap.to(displayValue.current, {
        value: target,
        duration: 0.35,
        ease: 'power1.out',
        overwrite: 'auto',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(
              displayValue.current.value
            ).toString();
          }
        },
        onComplete: onDone,
      });
    };

    // Slide the preloader up and call onComplete
    const runExitAnimation = () => {
      if (completed) return;
      completed = true;

      animateCounterTo(100, () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          delay: 0.2,
          onComplete,
        });
      });
    };

    // Safety net — never block the user for more than SAFETY_TIMEOUT_MS
    const safetyTimer = setTimeout(runExitAnimation, SAFETY_TIMEOUT_MS);

    // Preload all assets and drive counter progress
    const total = PRELOAD_IMAGES.length + 1; // +1 for video
    let loaded = 0;

    const onAssetLoaded = () => {
      loaded++;
      const pct = Math.round((loaded / total) * 100);
      animateCounterTo(pct);
      if (loaded === total) {
        clearTimeout(safetyTimer);
        runExitAnimation();
      }
    };

    // Preload images
    PRELOAD_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = onAssetLoaded;
      img.onerror = onAssetLoaded; // count errors as "done" so we don't block
      img.src = src;
    });

    // Preload video — use 'metadata' on mobile to avoid heavy buffering,
    // 'auto' on desktop to start buffering the full file
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const vid = document.createElement('video');
    vid.preload = isMobile ? 'metadata' : 'auto';
    vid.muted = true;
    vid.playsInline = true;
    vid.oncanplaythrough = onAssetLoaded;
    vid.onerror = onAssetLoaded;
    vid.src = PRELOAD_VIDEO;

    return () => {
      clearTimeout(safetyTimer);
      gsap.killTweensOf(displayValue.current);
      if (containerRef.current) gsap.killTweensOf(containerRef.current);
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="preloader">
      <span ref={counterRef} className="preloader-counter">0</span>
    </div>
  );
};

export default Preloader;
