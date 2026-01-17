'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Copy from '../ui/Copy';

gsap.registerPlugin(ScrollTrigger, SplitText);

const breakpoints = [
  { maxWidth: 900, translateY: -35, movMultiplier: 450 },
  { maxWidth: 1100, translateY: -30, movMultiplier: 500 },
  { maxWidth: 1200, translateY: -25, movMultiplier: 550 },
  { maxWidth: 1400, translateY: -20, movMultiplier: 600 },
];

const getInitialValues = (width: number) => {
  for (const bp of breakpoints) {
    if (width <= bp.maxWidth) {
      return { translateY: bp.translateY, movMultiplier: bp.movMultiplier };
    }
  }
  return { translateY: -10, movMultiplier: 650 }; // Small offset from center
};

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoMaskRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ScrollTrigger reel animation
  useGSAP(() => {

    const checkMobile = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      return mobile;
    };

    if (checkMobile()) return;

    if (!videoRef.current || !containerRef.current) return;

    let scrollTween: gsap.core.Tween | null = null;
    let scrollProgress = 0;
    let currentXOffset = 0; // Track the current mouse-induced X offset

    const createScrollAnimation = (startYPercent: number) => {
      if (scrollTween) scrollTween.kill();

      scrollTween = gsap.to(videoRef.current, {
        yPercent: -9,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom 90%',
          scrub: true,
          invalidateOnRefresh: true,
          markers: false,
          onUpdate: (self) => {
            scrollProgress = self.progress;

            // Gradually move x towards center based on scroll progress
            // At progress 0: full offset, at progress 1: x = 0
            const targetX = currentXOffset * (1 - scrollProgress);
            gsap.set(videoRef.current, { x: targetX });
          }
        }
      });
    };

    const updateInitialState = () => {
      const { translateY } = getInitialValues(window.innerWidth);
      // Start slightly above center:  -50 is center, so -60 would be 10% above center
      const startYPercent = -50 + translateY;

      console.log('Hero:  Setting initial state', { translateY, startYPercent });

      gsap.killTweensOf(videoRef.current);

      gsap.set(videoRef.current, {
        xPercent: -50,
        yPercent: startYPercent,
        scale: 0.35,
        x: 0,
        autoAlpha: 1,
        transformOrigin: "center center",
        overwrite: 'auto'
      });

      createScrollAnimation(startYPercent);
    };

    gsap.delayedCall(0.01, updateInitialState);

    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current) return;

      const targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const currentScale = gsap.getProperty(videoRef.current, "scale") as number;
      const { movMultiplier } = getInitialValues(window.innerWidth);
      const scaleMovMultiplier = (1 - currentScale) * movMultiplier;

      // Calculate base offset from mouse position and scale
      const baseOffset = currentScale < 0.95 ? targetMouseX * scaleMovMultiplier : 0;

      // Store the base offset so scroll can gradually reduce it
      currentXOffset = baseOffset;

      // Apply with scroll progress reduction
      const xOffset = baseOffset * (1 - scrollProgress);

      gsap.to(videoRef.current, {
        x: xOffset,
        duration: 0.5,
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateInitialState);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateInitialState);
      if (scrollTween) scrollTween.kill();
    };

  }, { scope: containerRef, dependencies: [] });

  // Video mask reveal animation (from top)
  useGSAP(() => {
    if (isMobile || !videoMaskRef.current) return;

    gsap.fromTo(
      videoMaskRef.current,
      { yPercent: -100 },
      { yPercent: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );
  }, { dependencies: [isMobile] });

  return (
    <section ref={containerRef} className='block pb-10 h-[200vh]'>
      <div className="intro">
        {!isMobile && (
          <div ref={videoRef} className="video-mask">
            <div ref={videoMaskRef} className="video-container-desktop">
              <div className="video-preview">
                <div className="video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/haJfJAwpViI?autoplay=1&mute=1&loop=1&playlist=haJfJAwpViI&controls=0&playsinline=1"
                    frameBorder="0"
                    allow='autoplay; fullscreen; picture-in-picture'
                    className='pointer-events-none'
                    loading='lazy'
                    title='fish video'
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='flex flex-col uppercase absolute bottom-[15vh] lg:bottom-[20vh] left-5 right-8'>
        <div className='flex justify-between font-semibold text-[20px]'>
          <Copy animateOnScroll={false} delay={0.5}>
            <p className="ml-4">A</p>
          </Copy>
          <Copy animateOnScroll={false} delay={0.6}>
            <p>PRETTY</p>
          </Copy>
          <Copy animateOnScroll={false} delay={0.7}>
            <p>DECENT</p>
          </Copy>
        </div>

        <Copy animateOnScroll={false} delay={0.3} className='w-full'>
          <h1 className='font-bold text-[208px] tracking-tighter leading-[0.85] whitespace-nowrap'>DESIGN ENGINEER</h1>
        </Copy>
      </div>

      <Copy animateOnScroll={false} delay={0.7} className='absolute left-10 bottom-10 font-semibold text-[20px]'>
        <p>SCROLL DOWN</p>
      </Copy>

      <Copy animateOnScroll={false} delay={0.8} className='absolute right-10 bottom-10 font-semibold text-[20px]'>
        <p>FOR MORE</p>
      </Copy>

      <div className='flex justify-center align-center font-semibold text-[20px] h-[100vh]'>
        <p className='text-background'>OUTRO</p>
      </div>
    </section>
  )
}

export default Hero