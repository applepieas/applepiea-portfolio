'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface SlidingButtonProps {
  defaultText?: string;
  hoverText?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
  isLoaded?: boolean;
}

export default function SlidingButton({
  defaultText = 'Get in touch',
  hoverText = 'Say Ahoj! 👋',
  href = "mailto:pavelros.webdev@gmail.com?subject=Let's work together",
  className = '',
  onClick,
  isLoaded = true,
}: SlidingButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const lineHeight = 28;
  const isMobile = useIsMobile();

  // Initial slide-up reveal
  useGSAP(() => {
    if (!buttonRef.current || !isLoaded) return;
    gsap.fromTo(
      buttonRef.current,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.8 }
    );
  }, { dependencies: [isLoaded] });

  const slideTo = (index: number) => {
    if (!slideRef.current) return;
    gsap.to(slideRef.current, {
      y: -lineHeight * index,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: true,
    });
  };

  const handleMouseEnter = () => { if (!isMobile && !isCopied) slideTo(1); };
  const handleMouseLeave = () => { if (!isMobile && !isCopied) slideTo(0); };

  const handleCopy = () => {
    if (href?.startsWith('mailto:')) {
      const email = href.replace('mailto:', '').split('?')[0];
      navigator.clipboard.writeText(email);
      setIsCopied(true);
      slideTo(2);
      setTimeout(() => {
        setIsCopied(false);
        slideTo(0);
      }, 2000);
    }
    onClick?.();
  };

  const buttonContent = (
    <div className="relative overflow-hidden" style={{ height: lineHeight }}>
      <div ref={slideRef} className="flex flex-col" style={{ transform: 'translateY(0px)' }}>
        {[defaultText, hoverText, 'Email copied! ✈️'].map((text) => (
          <span
            key={text}
            className="block text-center whitespace-nowrap"
            style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );

  const baseClasses = `inline-flex items-center justify-center lg:px-6 lg:py-3 px-4 py-2 bg-foreground text-background rounded-[20px] font-semibold text-[1rem] lg:text-[1.25rem] cursor-pointer ${className}`.trim();

  const commonProps = {
    className: baseClasses,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    style: { opacity: 0, visibility: (isLoaded ? 'visible' : 'hidden') } as React.CSSProperties,
  };

  if (href) {
    return (
      <a ref={buttonRef as React.RefObject<HTMLAnchorElement>} {...commonProps} href={href} onClick={handleCopy}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button ref={buttonRef as React.RefObject<HTMLButtonElement>} {...commonProps} onClick={onClick}>
      {buttonContent}
    </button>
  );
}
