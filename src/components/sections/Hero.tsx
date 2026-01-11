'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  const [isMobile, setIsMobile] = useState(false);

  useGSAP(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      return mobile;
    };

    if (checkMobile()) return;

    if (!videoRef.current || !containerRef.current) return;

    let scrollTween: gsap.core.Tween | null = null;

    const createScrollAnimation = (startYPercent: number) => {
      if (scrollTween) scrollTween.kill();

      scrollTween = gsap.to(videoRef.current, {
        yPercent: -12.5,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom 90%',
          scrub: true,
          invalidateOnRefresh: true,
          markers: false,
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
      const xOffset = currentScale < 0.95 ? targetMouseX * scaleMovMultiplier : 0;

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

  return (
    <section ref={containerRef} className='block pb-10 h-[200vh]'>
      <div className="intro">
        {!isMobile && (
          <div ref={videoRef} className="video-container-desktop">
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
        )}
      </div>

      <div className='flex flex-col uppercase absolute bottom-[15vh] lg:bottom-[20vh] left-5 right-8'>
        <div className='flex justify-between font-semibold text-[20px]'>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;A</p>
          <p>PRETTY</p>
          <p>DECENT</p>
        </div>

        <div>
          <h1 className='font-bold text-[208.5px] tracking-tighter leading-[0.85]'>DESIGN ENGINEER</h1>
        </div>
      </div>

      <div className='overflow-hidden absolute left-10 bottom-10 font-semibold text-[20px]'>
        <p>SCROLL DOWN</p>
      </div>

      <div className='overflow-hidden absolute right-10 bottom-10 font-semibold text-[20px]'>
        <p>FOR MORE</p>
      </div>

      <div className='flex justify-center align-center font-semibold text-[20px] h-[100vh]'>
        <p>OUTRO</p>
      </div>
    </section>
  )
}

export default Hero