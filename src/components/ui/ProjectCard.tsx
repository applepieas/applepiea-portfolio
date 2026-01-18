'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  title: string;
  authorName: string;
  authorIcon?: string;
  category: string;
  year: string;
  image: string;
  tags: string[];
}

export default function ProjectCard({
  title,
  authorName,
  authorIcon = '/image.png',
  category,
  year,
  image,
  tags,
}: ProjectCardProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Create marquee text by joining tags
  const marqueeText = tags.join(', ') + ', ';

  // Parallax scroll effect on the image
  useGSAP(() => {
    if (!imageContainerRef.current) return;

    const img = imageContainerRef.current.querySelector('img');
    if (!img) return;

    gsap.fromTo(
      img,
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: imageContainerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      }
    );
  });

  return (
    <div className="w-full bg-foreground rounded-[20px] p-4 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div
        ref={imageContainerRef}
        className="relative rounded-lg lg:rounded-xl overflow-hidden w-full h-[260px] md:h-[350px] lg:h-[clamp(500px,32vw,800px)]"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover scale-[1.2]"
        />
      </div>

      {/* Meta Row */}
      <div className="flex justify-between items-center py-4 px-2">
        {/* Left: Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex-shrink-0">
            <Image
              src={authorIcon}
              alt={authorName}
              width={42}
              height={42}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-background font-semibold text-[18px] uppercase tracking-wide">
            {authorName}
          </span>
        </div>

        {/* Right: Category & Year */}
        <div className="flex items-center gap-2">
          <span className="text-background/60 font-semibold text-[18px] uppercase tracking-wide">
            {category}
          </span>
          <span className="text-background/60 font-semibold text-[18px] uppercase tracking-wide">
            {year}
          </span>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="relative overflow-hidden whitespace-nowrap pt-1">
        <div className="absolute -left-1 -top-1 -bottom-1 w-14 bg-gradient-to-r from-foreground from-30% to-transparent z-10 pointer-events-none"></div>
        <div className="absolute -right-1 -top-1 -bottom-1 w-14 bg-gradient-to-l from-foreground from-30% to-transparent z-10 pointer-events-none"></div>
        <div className="animate-marquee-slow inline-flex">
          <span className="text-bg-secondary text-[18px] font-400 uppercase tracking-wider">
            {marqueeText}{marqueeText}{marqueeText}{marqueeText}
          </span>
          <span className="text-bg-secondary text-[18px] font-400 uppercase tracking-wider">
            {marqueeText}{marqueeText}{marqueeText}{marqueeText}
          </span>
        </div>
      </div>
    </div>
  );
}
