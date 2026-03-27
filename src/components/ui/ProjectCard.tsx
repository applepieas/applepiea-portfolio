'use client';

import { useRef } from 'react';
import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  image: string;
  video?: string;
  tags: string[];
  href: string;
}

export default function ProjectCard({
  title,
  category,
  year,
  image,
  video,
  tags,
  href,
}: ProjectCardProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();

  // Create marquee text by joining tags
  const marqueeText = tags.join(', ') + ', ';

  const { contextSafe } = useGSAP({ scope: imageContainerRef });

  // Parallax scroll effect on the image — desktop only
  // On mobile: scrub animations on every card image are too costly per scroll tick
  useGSAP(() => {
    if (!imageContainerRef.current || !imageRef.current) return;

    // Skip parallax on mobile/touch devices — imperceptible on small screens,
    // costly on every scroll tick
    if (isMobile) return;

    gsap.fromTo(
      imageRef.current,
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: imageContainerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      }
    );
  }, { dependencies: [isMobile] });

  const handleMouseEnter = () => {
    contextSafe(() => {
      // Only animate video on desktop
      if (isMobile) return;

      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
        videoTimeoutRef.current = null;
      }

      if (imageRef.current) {
        gsap.killTweensOf(imageRef.current);
        gsap.to(imageRef.current, { scale: 0.99, filter: "blur(10px)", duration: 0.6, ease: "power3.out", overwrite: true });
      }
      if (videoContainerRef.current) {
        gsap.killTweensOf(videoContainerRef.current);
        gsap.fromTo(videoContainerRef.current,
          { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, y: 20 },
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1, overwrite: true }
        );
        const videoEl = videoContainerRef.current.querySelector('video');
        if (videoEl) {
          videoEl.play().catch(() => { });
        }
      }
    })();
  };

  const handleMouseLeave = () => {
    contextSafe(() => {
      if (isMobile) return;

      if (imageRef.current) {
        gsap.killTweensOf(imageRef.current);
        gsap.to(imageRef.current, { scale: 1.2, filter: "blur(0px)", duration: 0.5, ease: "power3.out", overwrite: true });
      }
      if (videoContainerRef.current) {
        gsap.killTweensOf(videoContainerRef.current);
        gsap.to(videoContainerRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.inOut",
          overwrite: true
        });
        const videoEl = videoContainerRef.current.querySelector('video');
        if (videoEl) {
          if (videoTimeoutRef.current) {
            clearTimeout(videoTimeoutRef.current);
          }
          videoTimeoutRef.current = setTimeout(() => {
            videoEl.pause();
            videoEl.currentTime = 0;
          }, 400);
        }
      }
    })();
  };

  return (
    <TransitionLink
      href={href}
      className="w-full bg-foreground rounded-[20px] p-4 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div
        ref={imageContainerRef}
        className="relative rounded-lg lg:rounded-xl overflow-hidden w-full h-65 md:h-87.5 lg:h-[clamp(500px,32vw,800px)] bg-neutral-900"
        onMouseEnter={isMobile ? undefined : handleMouseEnter}
        onMouseLeave={isMobile ? undefined : handleMouseLeave}
      >
        <Image
          ref={imageRef}
          src={image}
          alt={title}
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover scale-[1.2]"
        />

        {video && (
          <div className="absolute inset-0 items-center justify-center pointer-events-none hidden lg:flex z-10">
            <div
              ref={videoContainerRef}
              className="w-[50%] aspect-video rounded-lg overflow-hidden opacity-0 shadow-2xl translate-y-5 bg-black"
            >
              <video
                src={video}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Meta Row */}
      <div className="flex justify-between items-center py-4 px-2">
        {/* Left: Title */}
        <div className="flex pt-1 items-center gap-3">
          <span className="text-background font-semibold text-[clamp(16px,1.2vw,20px)] uppercase tracking-wide">
            {title}
          </span>
        </div>

        {/* Right: Category & Year */}
        <div className="flex items-center gap-2">
          <span className="text-background/60 font-semibold text-[clamp(14px,1.2vw,18px)] uppercase tracking-wide">
            {category}
          </span>
          <span className="text-background/60 font-semibold text-[clamp(14px,1.2vw,18px)] uppercase tracking-wide">
            {year}
          </span>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="relative overflow-hidden whitespace-nowrap pt-1">
        <div className="absolute -left-1 -top-1 -bottom-1 w-14 bg-linear-to-r from-foreground from-30% to-transparent z-10 pointer-events-none"></div>
        <div className="absolute -right-1 -top-1 -bottom-1 w-14 bg-linear-to-l from-foreground from-30% to-transparent z-10 pointer-events-none"></div>
        <div
          className="animate-marquee-slow inline-flex"
          style={{ animationDuration: `${marqueeText.length * 4 * 0.15}s` }}
        >
          <span className="text-bg-secondary text-[clamp(16px,1.2vw,20px)] font-normal uppercase tracking-wider">
            {marqueeText}{marqueeText}{marqueeText}{marqueeText}
          </span>
          <span className="text-bg-secondary text-[clamp(16px,1.2vw,20px)] font-normal uppercase tracking-wider">
            {marqueeText}{marqueeText}{marqueeText}{marqueeText}
          </span>
        </div>
      </div>
    </TransitionLink>
  );
}
