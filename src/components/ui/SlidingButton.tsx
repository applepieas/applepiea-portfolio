'use client';

import { useRef } from 'react';
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
  href,
  className = '',
  onClick,
  isLoaded = true,
}: SlidingButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
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

  const buttonContent = (
    <div
      className="relative overflow-hidden"
      style={{ height: lineHeight }}
    >
      <motion.div
        className="flex flex-col"
        variants={{
          default: { y: 0 },
          hover: { y: -lineHeight },
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

  if (href) {
    return (
      <motion.a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={baseClasses}
        initial="default"
        whileHover="hover"
        style={{ opacity: 0, visibility: isLoaded ? 'visible' : 'hidden' }}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={baseClasses}
      initial="default"
      whileHover="hover"
      style={{ opacity: 0, visibility: isLoaded ? 'visible' : 'hidden' }}
    >
      {buttonContent}
    </motion.button>
  );
}
