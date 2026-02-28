// src/components/ui/VideoCarousel.tsx
'use client';

import { useRef, useState, useCallback } from 'react';

interface VideoCarouselProps {
  videos: string[];
  className?: string;
}

export default function VideoCarousel({ videos, className = '' }: VideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goTo = useCallback((index: number) => {
    const next = (index + videos.length) % videos.length;
    setActiveIndex(next);

    const video = videoRefs.current[next];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => { });
    }
  }, [videos.length]);

  const handleVideoEnd = useCallback((index: number) => {
    if (index === activeIndex) {
      goTo(activeIndex + 1);
    }
  }, [activeIndex, goTo]);

  return (
    <div className={`relative group ${className}`}>
      {/* Sliding track */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {videos.map((src, i) => {
          // Only give a src to the active video and the next one (for instant transition).
          // All others get preload="none" and no src until they become active.
          const isActive = i === activeIndex;
          const isNext = i === (activeIndex + 1) % videos.length;
          const shouldLoad = isActive || isNext;

          return (
            <div key={src} className="w-full h-full flex-shrink-0">
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                autoPlay={i === 0}
                muted
                playsInline
                preload={isActive ? 'auto' : 'none'}
                src={shouldLoad ? src : undefined}
                className="w-full h-full object-cover"
                onEnded={() => handleVideoEnd(i)}
              />
            </div>
          );
        })}
      </div>

      {/* Left arrow */}
      <button
        onClick={() => goTo(activeIndex - 1)}
        className="absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-black/60"
        aria-label="Previous video"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={() => goTo(activeIndex + 1)}
        className="absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-black/60"
        aria-label="Next video"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
              }`}
            aria-label={`Go to video ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
