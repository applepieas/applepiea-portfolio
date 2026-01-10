'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

const breakpoints = [
  { maxWidth: 900, translateY: -135, movMultiplier: 450 },
  { maxWidth: 1100, translateY: -130, movMultiplier: 500 },
  { maxWidth: 1200, translateY: -125, movMultiplier: 550 },
  { maxWidth: 1400, translateY: -120, movMultiplier: 600 },
];

const getInitialValues = () => {
  const width = window.innerWidth;

  for (const bp of breakpoints) {
    if (width <= bp.maxWidth) {
      return { translateY: bp.translateY, movMultiplier: bp.movMultiplier };
    }
  }

  return { translateY: -110, movMultiplier: 650 };
}



const Hero = () => {

  useEffect(() => {
    if (window.innerWidth < 900) return;

    const initialValues = getInitialValues();

    const animationState = {
      scrollProgress: 0,
      initialTranslateY: initialValues.translateY,
      currentTranslateY: initialValues.translateY,
      movMultiplier: initialValues.movMultiplier,
      scale: 0.25,
      targetMouseX: 0,
      currentMouseX: 0,
    };

    const videoContainer = document.querySelector('.video-container-desktop') as HTMLElement;


    window.addEventListener('resize', () => {
      const newValues = getInitialValues();
      animationState.initialTranslateY = newValues.translateY;
      animationState.movMultiplier = newValues.movMultiplier;

      if (animationState.scrollProgress === 0) {
        animationState.currentTranslateY = newValues.translateY;
      }
    });

    const lenis = new Lenis();

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    gsap.timeline({
      scrollTrigger: {
        trigger: '.intro',
        start: 'top bottom',
        end: ' top 10%',
        scrub: true,
        onUpdate: (self) => {
          animationState.scrollProgress = self.progress;

          animationState.currentTranslateY = gsap.utils.interpolate(
            animationState.initialTranslateY,
            0,
            animationState.scrollProgress
          );

          animationState.scale = gsap.utils.interpolate(
            0.25,
            1,
            animationState.scrollProgress
          );
        }
      }
    });

    document.addEventListener('mousemove', (e) => {
      animationState.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    });

    const animate = () => {
      if (window.innerWidth < 900) return;

      const {
        scale,
        targetMouseX,
        currentMouseX,
        movMultiplier,
        currentTranslateY
      } = animationState;

      const scaleMovMultiplier = (1 - scale) * movMultiplier;

      const maxHorizontalMovement =
        scale < 0.95 ? targetMouseX * scaleMovMultiplier : 0;

      animationState.currentMouseX = gsap.utils.interpolate(
        currentMouseX,
        maxHorizontalMovement,
        0.05
      );

      videoContainer.style.transform = `translateX(${animationState.currentMouseX}px) translateY(${currentTranslateY}px) scale(${scale})`;

      requestAnimationFrame(animate);

    };

    animate();

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);


  return (
    <section className='block pb-10 h-[100vh]'>
      <div className="intro">
        <div className="video-container-desktop">
          <div className="video-preview">
            <div className="video-wrapper">
              <iframe src="https://www.youtube.com/embed/haJfJAwpViI?autoplay=1&mute=1&loop=1&playlist=haJfJAwpViI&controls=0&playsinline=1"
                frameBorder="0"
                allow='autoplay; fullscreen; picture-in-picture'
                className='pointer-events-none'
                loading='lazy'
                title='fish video'
              ></iframe>
            </div>
          </div>
        </div>

        {/*
        <div className="video-container-mobile">
          <div className="video-preview">
            <div className="video-wrapper">
              <iframe src="https://www.youtube.com/embed/haJfJAwpViI?autoplay=1&mute=1&loop=1&playlist=haJfJAwpViI&controls=0&playsinline=1"
                frameBorder="0"
                allow='autoplay; fullscreen; picture-in-picture'
                className='pointer-events-none'
                loading='lazy'
                title='fish video'
              ></iframe>
            </div>
          </div>
        </div>
      */}
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


    </section >
  )
}

export default Hero