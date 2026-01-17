"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ============================================
   FOOTER COMPONENT
   ============================================
   Grid-based footer with:
   - 2-column main nav (Work, About) with hover wipe effect
   - Bottom row with socials and copyright
   
   COLOR MAPPING (Theme Colors):
   - Default: bg-background (#FAFAF9), text-foreground (#171717)
   - Hover: Colors invert (bg-foreground, text-background)
   
   HOVER WIPE EFFECT:
   Using Framer Motion to animate a pseudo-element that 
   wipes from left to right on hover.
   ============================================ */

/* --- Navigation Items Data --- */
const navItems = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

/* --- Social Links Data --- */
const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: "/logos/instagram-svgrepo-com.svg"
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: "/logos/linkedin-svgrepo-com.svg"
  },
  {
    name: "X",
    href: "https://x.com",
    icon: "/logos/x-icon.svg"
  },
];

/* --- Arrow SVG Component --- */
/* Arrow pointing top-right, used in nav boxes */
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* --- Nav Box Component with Wipe Effect --- */
interface NavBoxProps {
  label: string;
  href: string;
}

function NavBox({ label, href }: NavBoxProps) {
  return (
    <Link href={href} className="group relative block">
      {/* 
        CONTAINER SETUP:
        - relative: Positions the wipe layer absolutely within
        - overflow-hidden: Clips the wipe animation to the box bounds
        - h-[300px]: Height of the nav box (adjust as needed)
        
        DEFAULT STATE COLORS:
        - bg-[var(--color-foreground)]: Dark background (#171717)
        - text-[var(--color-background)]: Light text (#FAFAF9)
        
        TRANSITION: Controls how fast the text/arrow color changes
        - transition-colors duration-300: Smooth color swap over 300ms
      */}
      <div
        className="
          relative overflow-hidden
          h-[200px] md:h-[300px]
          bg-[var(--color-foreground)] text-[var(--color-background)]
          group-hover:text-[var(--color-foreground)]
          transition-colors duration-300
          flex items-end justify-between
          p-6 md:p-10
        "
      >
        {/* 
          WIPE LAYER (Framer Motion):
          This is the background that wipes in from left to right on hover.
          
          POSITIONING:
          - absolute inset-0: Fills the entire parent container
          - z-0: Behind the text content
          
          HOVER STATE COLOR:
          - bg-[var(--color-background)]: Light background (#FAFAF9) on hover
          
          ANIMATION:
          - initial: scaleX(0) - starts with 0 width
          - whileHover on parent triggers animate: scaleX(1) - expands to full width
          - originX: 0 - scales from the left edge
          
          TIMING (Adjust these for wipe "physics"):
          - duration: 0.4s - how long the wipe takes
          - ease: [0.25, 0.1, 0.25, 1] - cubic-bezier for smooth easeOut feel
        */}
        <motion.div
          className="absolute inset-0 z-0 bg-[var(--color-background)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{
            duration: 0.4,         /* WIPE DURATION: Adjust for faster/slower wipe */
            ease: [0.25, 0.1, 0.25, 1], /* EASING: Cubic bezier for smooth feel */
          }}
          style={{ originX: 0 }}   /* WIPE DIRECTION: 0 = left-to-right, 1 = right-to-left */
        />

        {/* 
          HOVER TRIGGER LAYER:
          Since the parent Link has `group` class, we need to trigger
          the hover state on the motion.div. This invisible layer 
          detects hover and triggers the animation via a parent motion component.
        */}

        {/* 
          TEXT CONTENT:
          - z-10: Above the wipe layer so it remains visible
          - Text color inherits from parent and transitions on hover
        */}
        <span className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
          {label}
        </span>

        {/* 
          ARROW ICON:
          - z-10: Above the wipe layer
          - Color inherits and transitions with text
        */}
        <ArrowIcon className="relative z-10 w-8 h-8 md:w-12 md:h-12" />
      </div>
    </Link>
  );
}

/* --- Hover-Enabled Nav Box Wrapper --- */
/* Wraps NavBox with motion to properly trigger hover animation */
function AnimatedNavBox({ label, href, showBorder }: NavBoxProps & { showBorder?: boolean }) {
  return (
    <motion.div
      initial="idle"
      whileHover="hover"
      className="group"
    >
      <Link href={href} className="block">
        <div
          className={`
            relative overflow-hidden
            h-[200px] md:h-[300px]
            bg-[var(--color-background)] text-[var(--color-foreground)]
            flex items-end justify-between
            p-6 md:p-10
            border-t border-[var(--color-secondary)]
            ${showBorder ? 'md:border-r' : ''}
          `}
        >
          {/* 
            WIPE LAYER:
            - Expands from left to right on hover
            - DURATION: 0.4s (adjust for faster/slower)
            - EASING: easeOut for smooth deceleration
          */}
          <motion.div
            className="absolute inset-0 z-0 bg-[var(--color-foreground)]"
            variants={{
              idle: { scaleX: 0 },
              hover: { scaleX: 1 },
            }}
            transition={{
              duration: 0.4,         /* WIPE DURATION */
              ease: "easeOut",       /* WIPE EASING */
            }}
            style={{ originX: 0 }}   /* WIPE ORIGIN: 0 = left, 1 = right */
          />

          {/* TEXT: Label with color inversion on hover */}
          <motion.span
            className="relative z-10 text-[46px] md:text-[56px] lg:text-[56px] font-semibold tracking-tight"
            variants={{
              idle: { color: "var(--color-foreground)" },
              hover: { color: "var(--color-background)" },
            }}
            transition={{ duration: 0.3 }} /* TEXT COLOR TRANSITION */
          >
            {label}
          </motion.span>

          {/* ARROW: Points top-right with color inversion */}
          <motion.div
            className="relative z-10"
            variants={{
              idle: { color: "var(--color-foreground)" },
              hover: { color: "var(--color-background)" },
            }}
            transition={{ duration: 0.3 }} /* ARROW COLOR TRANSITION */
          >
            <ArrowIcon className="w-8 h-8 md:w-12 md:h-12" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

/* --- Main Footer Component --- */
export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-background)] mt-40">

      {/* 
        TOP ROW: Main Navigation
        - 2-column grid on desktop, stacks on mobile
        - Each box takes 50% width on larger screens
      */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {navItems.map((item, index) => (
          <AnimatedNavBox
            key={item.label}
            label={item.label}
            href={item.href}
            showBorder={index === 0} /* Show right border on first cell */
          />
        ))}
      </div>

      {/* 
        BOTTOM ROW: Socials & Copyright
        - Thinner bar below main nav
        - Flexbox layout: copyright left, socials right
      */}
      <div
        className="
          flex flex-col md:flex-row items-center justify-between
          px-6 md:px-10 py-6
          border-t border-[var(--color-secondary)]
          text-[var(--color-muted)]
        "
      >
        {/* Copyright */}
        <p className="text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} All Rights Reserved
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-6">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                opacity-60 hover:opacity-100
                transition-opacity duration-200
              "
              aria-label={social.name}
            >
              {/* 
                SOCIAL ICONS:
                Using Next.js Image component for optimization.
                Icons are inverted (filter invert) to appear light on dark bg.
              */}
              <Image
                src={social.icon}
                alt={social.name}
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
