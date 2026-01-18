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
  { name: 'Work', href: '#work' },
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

  // Initial slide-up animation
  useGSAP(() => {
    if (!navRef.current || !isLoaded) return;

    gsap.fromTo(
      navRef.current,
      { yPercent: 125, scale: 0.75 },
      { yPercent: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
    );
  }, { dependencies: [isLoaded] });

  // Footer mode scroll trigger
  useGSAP(() => {
    if (!containerRef.current || !isLoaded) return;

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
  }, { dependencies: [isLoaded] });

  // Footer mode expansion animation - simple two-phase approach
  useGSAP(() => {
    if (!containerRef.current || !navRef.current) return;

    const tl = gsap.timeline();

    if (isFooterMode) {
      // Step 1: Hide main bar instantly (opacity only)
      tl.to(mainBarRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });

      // Step 2: WIDTH EXPAND (no height change yet)
      tl.to(containerRef.current, {
        width: 'calc(100vw - 40px)',
        duration: 0.6,
        ease: 'power3.out',
      });

      // Step 3: HEIGHT EXPAND (set height to target value)
      // First collapse mainBar height, then expand footer content
      tl.set(mainBarRef.current, { height: 0 });
      tl.set(footerContentRef.current, { opacity: 1 });
      tl.to(footerContentRef.current, {
        height: 'auto',
        duration: 0.5,
        ease: 'power3.out',
      });

      // Step 4: AFTER height is done, reveal text content (Copy.jsx style)
      tl.add(() => {
        if (footerContentRef.current) {
          const texts = footerContentRef.current.querySelectorAll('.footer-text');
          gsap.to(texts, {
            y: '0%',
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
          });
        }
      });

      // Step 5: Show footer bottom bar
      tl.to(footerBottomRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      }, '-=0.3');

    } else {
      // Collapse animation - reverse order

      // 1. Hide bottom bar
      tl.to(footerBottomRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
      });

      // 2. HEIGHT COLLAPSE (both footer content and bottom bar together)
      tl.to([footerContentRef.current, footerBottomRef.current], {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
      }, '-=0.2');

      // 3. Restore main bar
      tl.set(mainBarRef.current, { height: 'auto' });
      tl.to(mainBarRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      // 4. WIDTH COLLAPSE
      tl.to(containerRef.current, {
        width: '38vw',
        duration: 0.5,
        ease: 'power3.inOut',
      }, '-=0.2');
    }
  }, { dependencies: [isFooterMode] });

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
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
      style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
    >
      <div
        ref={containerRef}
        className="flex flex-col bg-foreground text-background rounded-2xl shadow-2xl w-[38vw] min-h-[96px] overflow-hidden"
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
                    className="footer-text block text-[32px] font-semibold text-center transition-colors duration-300 group-hover:text-foreground"
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
            <span className="text-[14px] text-background/50 font-medium">
              © {new Date().getFullYear()} All Rights Reserved
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
                  className="menu-item flex items-center gap-6 py-2 px-2 text-[20px] font-semibold rounded-xl hover:bg-background/10 transition-colors"
                  style={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-background flex-shrink-0">
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
            <div className="menu-divider h-px bg-background/20 mx-3 my-2" style={{ opacity: 0 }}></div>
          </div>
        )}

        {/* Main Bar */}
        <div ref={mainBarRef} className="flex items-center px-2 py-2 gap-4 overflow-hidden">

          {/* Left: Profile Image */}
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-background flex-shrink-0">
            <Image
              src="/image.png"
              alt="Profile"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center: Name and Marquee */}
          <div className="flex flex-col flex-1 overflow-hidden mx-2">
            <span className="text-base font-semibold text-[18px] mb-2">PAVEL ROSENBERG</span>
            <div className="relative overflow-hidden w-full">
              <div className="absolute -left-1 -top-1 -bottom-1 w-14 bg-gradient-to-r from-foreground from-20% to-transparent z-10 pointer-events-none"></div>
              <div className="absolute -right-1 -top-1 -bottom-1 w-14 bg-gradient-to-l from-foreground from-20% to-transparent z-10 pointer-events-none"></div>
              <div className="flex whitespace-nowrap animate-marquee px-1">
                <span className="text-[16px] text-bg-secondary font-400">
                  DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp; DEVELOPER &nbsp;•&nbsp;&nbsp;
                </span>
                <span className="text-[16px] text-bg-secondary font-400">
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
