'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
  href = "mailto:vapel.rosenberg@gmail.com?subject=Let's work together",
  className = '',
  onClick,
  isLoaded = true,
}: SlidingButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const lineHeight = 28; // Match text-[1.25rem] = 20px with some breathing room

  // Initial slide-up animation
  useGSAP(() => {
    if (!buttonRef.current || !isLoaded) return;

    gsap.fromTo(
      buttonRef.current,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.8 }
    );
  }, { dependencies: [isLoaded] });

  const handleCopy = (e: React.MouseEvent) => {
    if (href?.startsWith('mailto:')) {
      // Don't prevent default, allow mailto to open
      const email = href.replace('mailto:', '').split('?')[0];
      navigator.clipboard.writeText(email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
    onClick?.();
  };

  const buttonContent = (
    <div
      className="relative overflow-hidden"
      style={{ height: lineHeight }}
    >
      <motion.div
        className="flex flex-col"
        animate={isCopied ? "copied" : isHovered ? "hover" : "default"}
        variants={{
          default: { y: 0 },
          hover: { y: -lineHeight },
          copied: { y: -lineHeight * 2 },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Line 1: Default text */}
        <span
          className="block text-center whitespace-nowrap"
          style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}
        >
          {defaultText}
        </span>
        {/* Line 2: Hover text */}
        <span
          className="block text-center whitespace-nowrap"
          style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}
        >
          {hoverText}
        </span>
        {/* Line 3: Copied text */}
        <span
          className="block text-center whitespace-nowrap"
          style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}
        >
          Email copied! ✈️
        </span>
      </motion.div>
    </div>
  );

  const baseClasses = `
    inline-flex items-center justify-center
    lg:px-6 lg:py-3
    px-4 py-2
    bg-foreground text-background 
    rounded-[20px] font-semibold text-[1rem] lg:text-[1.25rem]
    cursor-pointer
    ${className}
  `.trim();

  const commonProps = {
    className: baseClasses,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: { opacity: 0, visibility: isLoaded ? 'visible' : 'hidden' } as React.CSSProperties,
  };

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        {...commonProps}
        href={href}
        onClick={handleCopy}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      {...commonProps}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
}
