'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Copy from '../ui/Copy';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger, SplitText);

const breakpoints = [
  { maxWidth: 900, translateY: -15, movMultiplier: 450, scale: 0.65 },
  { maxWidth: 1024, translateY: -20, movMultiplier: 500, scale: 0.55 },
  { maxWidth: 1100, translateY: -20, movMultiplier: 500, scale: 0.55 },
  { maxWidth: 1200, translateY: -20, movMultiplier: 550, scale: 0.55 },
  { maxWidth: 1300, translateY: -15, movMultiplier: 600, scale: 0.45 },
  { maxWidth: 1400, translateY: -10, movMultiplier: 600, scale: 0.45 },
];

const getInitialValues = (width: number) => {
  for (const bp of breakpoints) {
    if (width <= bp.maxWidth) {
      return { translateY: bp.translateY, movMultiplier: bp.movMultiplier, scale: bp.scale };
    }
  }
  return { translateY: -10, movMultiplier: 650, scale: 0.35 }; // Desktop defaults
};

interface HeroProps {
  isLoaded?: boolean;
}

const Hero = ({ isLoaded = false }: HeroProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoMaskRef = useRef<HTMLDivElement>(null);
  const mobileVideoContainerRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoReadyToPlay, setIsVideoReadyToPlay] = useState(false);

  // Start video playback immediately once the preloader signals isLoaded
  useEffect(() => {
    if (isLoaded) {
      setIsVideoReadyToPlay(true);
    }
  }, [isLoaded]);

  // Handle video play on state changes or resize
  useEffect(() => {
    if (isVideoReadyToPlay) {
      if (!isMobile && desktopVideoRef.current) {
        desktopVideoRef.current.play().catch((e) => console.error("Video play failed:", e));
      } else if (isMobile && mobileVideoRef.current) {
        mobileVideoRef.current.play().catch((e) => console.error("Video play failed:", e));
      }
    }
  }, [isVideoReadyToPlay, isMobile]);


  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 770);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ScrollTrigger reel animation (desktop only)
  useGSAP(() => {
    // Skip animation setup on mobile
    if (isMobile) return;

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
      const { translateY, scale } = getInitialValues(window.innerWidth);
      // Start slightly above center:  -50 is center, so -60 would be 10% above center
      const startYPercent = -50 + translateY;



      gsap.killTweensOf(videoRef.current);

      gsap.set(videoRef.current, {
        xPercent: -50,
        yPercent: startYPercent,
        scale: scale,
        x: 0,
        autoAlpha: 1,
        transformOrigin: "center center",
        overwrite: 'auto'
      });

      createScrollAnimation(startYPercent);
    };

    gsap.delayedCall(0.01, updateInitialState);

    let mouseMoveRafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle to one execution per animation frame — prevents calling
      // gsap.to() and getProperty() 200 times/sec on fast mouse movement
      if (mouseMoveRafId !== null) return;
      mouseMoveRafId = requestAnimationFrame(() => {
        mouseMoveRafId = null;
        if (!videoRef.current) return;

        const targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const currentScale = gsap.getProperty(videoRef.current, "scale") as number;
        const { movMultiplier } = getInitialValues(window.innerWidth);
        const scaleMovMultiplier = (1 - currentScale) * movMultiplier;

        const baseOffset = currentScale < 0.95 ? targetMouseX * scaleMovMultiplier : 0;
        currentXOffset = baseOffset;

        const xOffset = baseOffset * (1 - scrollProgress);
        gsap.to(videoRef.current, {
          x: xOffset,
          duration: 0.5,
          overwrite: 'auto'
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', updateInitialState);

    return () => {
      if (mouseMoveRafId !== null) cancelAnimationFrame(mouseMoveRafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateInitialState);
      if (scrollTween) scrollTween.kill();
      // Kill all ScrollTriggers in this scope when switching views
      ScrollTrigger.getAll().forEach(t => t.kill());
    };

  }, { scope: containerRef, dependencies: [isMobile] });

  // Set initial hidden state for video mask (before preloader completes)
  useGSAP(() => {
    // Desktop mask
    if (videoMaskRef.current) {
      gsap.set(videoMaskRef.current, { yPercent: -110 });
    }
    // Mobile container — same starting position so it slides from the top
    if (mobileVideoContainerRef.current) {
      gsap.set(mobileVideoContainerRef.current, { yPercent: -110 });
    }
  }, { dependencies: [isMobile] }); // Re-run when mobile state changes

  // Video mask reveal animation (from top) - wait for preloader
  useGSAP(() => {
    if (!isLoaded) return;

    const revealProps = { yPercent: 0, duration: 1.2, ease: 'power3.out', delay: 0.8 };

    // Reveal whichever container is currently mounted
    if (videoMaskRef.current) {
      gsap.to(videoMaskRef.current, revealProps);
    }
    if (mobileVideoContainerRef.current) {
      gsap.to(mobileVideoContainerRef.current, revealProps);
    }
  }, { dependencies: [isLoaded, isMobile] }); // Re-run when mobile state or load state changes

  const textDelay = 0.3;

  return (
    <section ref={containerRef} className='block pb-10 h-[100vh] md:h-[120vh] lg:h-[200vh] bg-background'>
      {/* Desktop: Animated video with scroll effects */}
      {!isMobile && (
        <div className="intro">
          <div ref={videoRef} className="video-mask" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
            <div ref={videoMaskRef} className="video-container-desktop">
              <div className="video-preview">
                <div className="video-wrapper">
                  <video
                    ref={desktopVideoRef}
                    src="https://res.cloudinary.com/dsh3yslek/video/upload/v1772040750/My_Movie_cjgr03.mp4"
                    preload="auto"
                    poster="/Mockup-product-details.jpg"
                    loop
                    muted
                    playsInline
                    className='iframe-desktop pointer-events-none'
                    title='fish video'
                    onPause={(e) => { e.currentTarget.play().catch(() => { }); }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Static video with initial reveal animation, no scroll/mouse animations */}
      {/* Outer mask — stays static, clips overflow so the slide is invisible outside this box */}
      {isMobile && (
        <div className='w-[90vw] aspect-video mx-auto mt-32 rounded-2xl overflow-hidden isolate'>
          {/* Inner container — this is what GSAP animates from yPercent -110 → 0 */}
          <div ref={mobileVideoContainerRef} className='w-full h-full'>
            <video
              ref={mobileVideoRef}
              src="https://res.cloudinary.com/dsh3yslek/video/upload/v1772040750/My_Movie_cjgr03.mp4"
              preload="metadata"
              poster="/Mockup-product-details.jpg"
              loop
              muted
              playsInline
              className='w-full h-full pointer-events-none rounded-2xl object-cover'
              title='fish video'
              onPause={(e) => { e.currentTarget.play().catch(() => { }); }}
            />
          </div>
        </div>
      )}

      {/* Mobile: "A PRETTY DECENT" at top under header */}
      <div className='flex justify-between font-semibold text-[14px] uppercase absolute top-20 left-5 right-8 lg:hidden'>
        <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
          <p className="ml-4">A</p>
        </Copy>
        <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
          <p className="ml-6">PRETTY</p>
        </Copy>
        <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
          <p>DECENT</p>
        </Copy>
      </div>

      <div className='flex flex-col uppercase absolute bottom-[15vh] lg:bottom-[20vh] lg:left-5 lg:right-8 left-0 right-0 z-100 max-lg:text-center max-lg:items-center text-[20px] overflow-visible'>
        <div className='flex justify-between font-semibold text-lg hidden lg:flex'>
          <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
            <p className="ml-4">A</p>
          </Copy>
          <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
            <p>PRETTY</p>
          </Copy>
          <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
            <p>DECENT</p>
          </Copy>
        </div>


        <Copy animateOnScroll={false} delay={textDelay} className='w-full ' isReady={isLoaded}>
          <h1 className='font-bold hero-title text-[clamp(11.7vw,20vw,11.5vw)] max-lg:text-[20vw] w-full whitespace-nowrap max-lg:whitespace-normal max-lg:text-center tracking-tighter leading-[0.85] md:align-middle overflow-visible'>
            <span className='inline max-lg:block max-lg:w-fit max-lg:mx-auto'>DESIGN</span>
            <span className='inline max-lg:hidden'> </span>
            <span className='inline pr-[1.6vw] lg:pr-0 max-lg:block max-lg:w-fit max-lg:mx-auto'>ENGINEER</span>
          </h1>
        </Copy>
      </div>

      <Copy animateOnScroll={false} delay={textDelay} className='absolute flex items-center left-[calc(2.5rem-10px)] bottom-8 font-semibold text-[18px] lg:text-[20px] hidden lg:flex' isReady={isLoaded}>
        <Image src="/arrow.svg" alt="arrow"
          width={24}
          height={24}
          className='inline-block mr-1 flex-shrink-0 animate-bounce-arrow py-2' />
        <p>SCROLL DOWN</p>
      </Copy>

      <Copy animateOnScroll={false} delay={textDelay} className='absolute flex right-10 bottom-8 font-semibold text-[18px] lg:text-[20px] hidden lg:flex' isReady={isLoaded}>
        <p>FOR MORE</p>
        <Image src="/arrow.svg" alt="arrow"
          width={24}
          height={24}
          className='inline-block ml-1 animate-bounce-arrow py-2' />
      </Copy>

      <div className='flex justify-center align-center font-semibold text-[20px] h-[100vh]'>
        <p className='text-background'>OUTRO</p>
      </div>
    </section >
  )
}

export default Hero