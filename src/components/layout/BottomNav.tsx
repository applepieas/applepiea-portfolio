'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BottomNavProps {
  isLoaded?: boolean;
}

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Projects', href: '#projects' },
  { name: 'About', href: '#about' },
];

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com', icon: '/logos/instagram-svgrepo-com.svg' },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: '/logos/linkedin-svgrepo-com.svg' },
  { name: 'X', href: 'https://x.com', icon: '/logos/x-icon.svg' },
];

export default function BottomNav({ isLoaded = false }: BottomNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const footerContentRef = useRef<HTMLDivElement>(null);
  const footerBottomRef = useRef<HTMLDivElement>(null);
  const mainBarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFooterMode, setIsFooterMode] = useState(false);
  // Track current breakpoint to re-run animation when crossing any breakpoint
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Detect breakpoint changes for all 3 breakpoints (mobile < 768, tablet 768-1023, desktop >= 1024)
  useEffect(() => {
    const getBreakpoint = () => {
      if (window.innerWidth >= 1024) return 'desktop';
      if (window.innerWidth >= 768) return 'tablet';
      return 'mobile';
    };

    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial slide-up animation - re-runs on any breakpoint change to prevent stale states
  useGSAP(() => {
    if (!navRef.current || !containerRef.current || !isLoaded) return;

    // Kill any existing animations on the nav and container elements
    gsap.killTweensOf(navRef.current);
    gsap.killTweensOf(containerRef.current);

    // Reset container width based on current breakpoint (matches CSS breakpoints)
    const responsiveWidths = {
      mobile: 'calc(100vw - 40px)',
      tablet: '80vw',
      desktop: '38vw'
    };
    gsap.set(containerRef.current, { width: responsiveWidths[breakpoint] });

    // Reset and re-animate to ensure clean state after resize
    gsap.fromTo(
      navRef.current,
      { yPercent: 125, scale: 0.75 },
      { yPercent: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
    );
  }, { dependencies: [isLoaded, breakpoint] });

  // Footer mode scroll trigger - only on desktop and tablet, not mobile
  useGSAP(() => {
    if (!containerRef.current || !isLoaded) return;

    // Skip footer expansion on mobile
    if (breakpoint === 'mobile') {
      setIsFooterMode(false);
      return;
    }

    ScrollTrigger.create({
      trigger: 'body',
      start: 'bottom bottom+=100',
      end: 'bottom bottom',
      onEnter: () => setIsFooterMode(true),
      onLeaveBack: () => setIsFooterMode(false),
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { dependencies: [isLoaded, breakpoint] });

  // Footer mode expansion animation - smooth two-phase approach (desktop/tablet only)
  useGSAP(() => {
    if (!containerRef.current || !navRef.current) return;
    // Skip footer expansion animation on mobile
    if (breakpoint === 'mobile') return;

    const tl = gsap.timeline();

    if (isFooterMode) {
      // Set min-height to prevent shrinking during phase 1, while still allowing expansion
      const currentHeight = containerRef.current.offsetHeight;
      tl.set(containerRef.current, { minHeight: currentHeight });

      // PHASE 1: Fade out main bar content WHILE expanding width (simultaneous)
      tl.to(mainBarRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      });
      // Width expansion happens at the same time as fade out
      tl.to(containerRef.current, {
        width: 'calc(100vw - 40px)',
        duration: 0.5,
        ease: 'power3.out',
      }, '<'); // '<' means start at same time as previous animation

      // PHASE 2: After width is complete, expand height and fade in content
      // First collapse mainBar height to make room
      tl.set(mainBarRef.current, { height: 0 });

      // Set footer content ready but invisible
      tl.set(footerContentRef.current, { opacity: 1, height: 0 });

      // Expand footer content height
      tl.to(footerContentRef.current, {
        height: 'auto',
        duration: 0.4,
        ease: 'power3.out',
      });

      // Reveal text content with stagger (after height expansion)
      tl.add(() => {
        if (footerContentRef.current) {
          const texts = footerContentRef.current.querySelectorAll('.footer-text');
          gsap.to(texts, {
            y: '0%',
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
          });
        }
      });

      // Show footer bottom bar (slightly overlapping with text reveal)
      tl.to(footerBottomRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out',
      }, '-=0.25');

    } else {
      // Collapse animation - reverse order, also smooth

      // 1. First fade out and collapse footer content
      tl.to(footerBottomRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power3.in',
      });

      tl.to(footerContentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
      }, '-=0.15');

      // Reset footer text positions for next expansion
      tl.add(() => {
        if (footerContentRef.current) {
          const texts = footerContentRef.current.querySelectorAll('.footer-text');
          gsap.set(texts, { y: '110%' });
        }
      });

      // 2. After content is hidden, restore main bar and collapse width (simultaneous)
      tl.set(mainBarRef.current, { height: 'auto' });

      // Collapse width while fading in main bar content
      const responsiveWidths = {
        mobile: 'calc(100vw - 40px)',
        tablet: '80vw',
        desktop: '38vw'
      };
      tl.to(containerRef.current, {
        width: responsiveWidths[breakpoint],
        duration: 0.4,
        ease: 'power3.inOut',
      });
      tl.to(mainBarRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      }, '<0.1'); // Start slightly after width collapse begins
    }
  }, { dependencies: [isFooterMode, breakpoint] });

  // Menu expand/collapse animation with staggered items (for hamburger menu)
  useGSAP(() => {
    if (!menuRef.current || isFooterMode) return;

    const menuItems = menuRef.current.querySelectorAll('.menu-item');
    const divider = menuRef.current.querySelector('.menu-divider');
    const elementsToAnimate = [divider, ...Array.from(menuItems).reverse()];

    if (isOpen) {
      gsap.to(menuRef.current, {
        height: 'auto',
        duration: 0.3,
        ease: 'power3.out',
      });

      gsap.fromTo(
        elementsToAnimate,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.15, delay: 0.15 }
      );
    } else {
      const elementsToHide = [...Array.from(menuItems), divider];

      gsap.to(elementsToHide, {
        opacity: 0,
        duration: 0.25,
        ease: 'power3.in',
        stagger: 0.1,
      });

      gsap.to(menuRef.current, {
        height: 0,
        duration: 0.3,
        ease: 'power3.in',
        delay: 0.1,
      });
    }
  }, { dependencies: [isOpen, isFooterMode] });

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      className="fixed sm:bottom-3 bottom-5  left-1/2 -translate-x-1/2 z-[1000]"
      style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
    >
      <div
        ref={containerRef}
        className="flex flex-col bg-foreground text-background rounded-2xl shadow-2xl w-[calc(100vw_-_40px)] md:w-[80vw] lg:w-[38vw] overflow-hidden"
      >

        {/* Footer Mode Content - 3 larger sections with text */}
        <div
          ref={footerContentRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="grid grid-cols-3 border-b border-background/20">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative flex items-center justify-center py-12 group overflow-hidden ${index < navLinks.length - 1 ? 'border-r border-background/20' : ''
                  }`}
              >
                {/* Hover wipe overlay - rises from bottom */}
                <div
                  className="absolute inset-0 bg-background origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"
                ></div>

                {/* Text with mask reveal - fixed height container */}
                <div className="overflow-hidden h-[40px] flex items-center justify-center relative z-10">
                  <span
                    className="footer-text block text-[30px] md:text-[32px] font-semibold text-center transition-colors duration-300 group-hover:text-foreground"
                    style={{ transform: 'translateY(110%)' }}
                  >
                    {link.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Bottom Bar - Copyright and Socials */}
        <div
          ref={footerBottomRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Copyright */}
            <span className="text-[12px] md:text-[14px] text-background/50 font-medium">
              {new Date().getFullYear()}
            </span>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-50 hover:opacity-100 transition-opacity"
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={20}
                    height={20}
                    className="w-5 h-5 invert"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable Menu (hamburger) - Hidden in footer mode */}
        {!isFooterMode && (
          <div
            ref={menuRef}
            className="overflow-hidden"
            style={{ height: 0 }}
          >
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="menu-item flex items-center gap-6 py-2 px-2 text-[18px] md:text-[20px] font-semibold rounded-xl hover:bg-background/10 transition-colors"
                  style={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-xl overflow-hidden bg-background flex-shrink-0">
                    <Image
                      src="/image.png"
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
            <div className="menu-divider h-px bg-background/20 mx-3 my-1 lg:my-2" style={{ opacity: 0 }}></div>
          </div>
        )}

        {/* Main Bar */}
        <div ref={mainBarRef} className="flex items-center px-2 py-2 gap-4 overflow-hidden">

          {/* Left: Profile Image */}
          <div className="w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-xl overflow-hidden bg-background flex-shrink-0">
            <Image
              src="/image.png"
              alt="Profile"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center: Name and Marquee */}
          <div className="flex flex-col flex-1 overflow-hidden mx-2 justify-center">
            <span className="text-base font-semibold text-[16px] md:text-[18px]">PAVEL ROSENBERG</span>
            <div className="relative overflow-hidden w-full">
              <div className="absolute -left-1 -top-1 -bottom-1 w-14 bg-gradient-to-r from-foreground from-20% to-transparent z-10 pointer-events-none"></div>
              <div className="absolute -right-1 -top-1 -bottom-1 w-14 bg-gradient-to-l from-foreground from-20% to-transparent z-10 pointer-events-none"></div>
              <div className="flex whitespace-nowrap animate-marquee px-1 mt-2">
                <span className="text-[14px] md:text-[16px] text-bg-secondary font-400">
                  DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp;&nbsp;
                </span>
                <span className="text-[14px] md:text-[16px] text-bg-secondary font-400">
                  DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp;&nbsp;
                </span>
              </div>
            </div>
          </div>

          {/* Right: Hamburger/Close Menu - Hidden in footer mode */}
          {!isFooterMode && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 flex-shrink-0 cursor-pointer mr-4 relative"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <span
                className="w-6 h-0.5 bg-background rounded-full transition-all duration-300 ease-out absolute"
                style={{
                  transform: isOpen
                    ? 'translateY(0) rotate(45deg)'
                    : 'translateY(-6px) rotate(0deg)',
                }}
              ></span>
              <span
                className="w-6 h-0.5 bg-background rounded-full transition-all duration-300 ease-out"
                style={{
                  opacity: isOpen ? 0 : 1,
                  transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
                }}
              ></span>
              <span
                className="w-6 h-0.5 bg-background rounded-full transition-all duration-300 ease-out absolute"
                style={{
                  transform: isOpen
                    ? 'translateY(0) rotate(-45deg)'
                    : 'translateY(6px) rotate(0deg)',
                }}
              ></span>
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}
