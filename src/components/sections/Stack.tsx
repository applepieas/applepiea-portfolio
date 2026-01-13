"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================
   TECH STACK SECTION
   ============================================
   Grid layout displaying technology logos
   with a large "MODERN TECHSTACK" heading.
   
   HOVER EFFECT: Shared layout animation - the dark
   highlight "flies" between cells using Framer Motion's
   layoutId for a morphing transition effect.
   
   CLICK: Each cell links to the technology's website.
   ============================================ */

/* --- Logo Data --- */
/* Each logo entry with its source path, alt text, and website URL */
const logos = [
  { src: "/logos/imgi_13_react-logo.svg", alt: "React", url: "https://react.dev" },
  { src: "/logos/imgi_14_nextjs-logotype-light-background.svg", alt: "Next.js", url: "https://nextjs.org" },
  { src: "/logos/imgi_16_gsap-black.svg", alt: "GSAP", url: "https://gsap.com" },
  { src: "/logos/imgi_15_typescript-logo.svg", alt: "TypeScript", url: "https://www.typescriptlang.org" },
  { src: "/logos/imgi_17_motion.svg", alt: "Motion", url: "https://motion.dev" },
  { src: "/logos/imgi_18_tailwindcss-logo.svg", alt: "Tailwind CSS", url: "https://tailwindcss.com" },
  { src: "/logos/imgi_21_vercel-logotype-light.svg", alt: "Vercel", url: "https://vercel.com" },
  { src: "/logos/imgi_22_figma-logo.svg", alt: "Figma", url: "https://figma.com" },
];

/* --- Border Classes for Grid Cells --- */
/* Maps each cell index to its specific border classes (internal borders only) */
const borderClasses = [
  "border-r border-secondary",           // Cell 0 - React: right border
  "md:border-r border-secondary",         // Cell 1 - Next.js: right border on md+
  "border-r border-secondary",            // Cell 2 - GSAP: right border
  "",                                      // Cell 3 - TypeScript: no right border (last column)
  "border-t border-r border-secondary",   // Cell 4 - Motion: top + right border
  "border-t md:border-r border-secondary", // Cell 5 - Tailwind: top + right on md+
  "border-t border-r border-secondary",   // Cell 6 - Vercel: top + right border
  "border-t border-secondary",            // Cell 7 - Figma: top border only (last column)
];

export default function Stack() {
  /* --- Hover State --- */
  /* Track which cell is currently hovered for the shared layout animation */
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    /* --- Section Container --- */
    <section className="py-20 w-full">

      {/* --- Section Header --- */}
      {/* Large "MODERN TECHSTACK" heading matching hero text style */}
      <div className="text-center mb-16 px-10 pb-32">
        <h2 className="font-bold text-[80px] md:text-[140px] lg:text-[209px] uppercase tracking-tighter leading-[0.85]">
          Modern
          <br />
          Techstack
        </h2>
      </div>

      {/* --- Logo Grid Container --- */}
      <div className="px-10">

        {/* --- Logo Grid --- */}
        {/* 4-column grid with internal separating lines */}
        <div className="grid grid-cols-2 md:grid-cols-4">

          {logos.map((logo, index) => (
            /* --- Grid Cell --- */
            /* Each cell is a link with relative positioning for the highlight */
            <Link
              key={logo.alt}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                relative flex items-center justify-center
                h-[180px] md:h-[280px] lg:h-[350px]
                ${borderClasses[index]}
                transition-colors duration-500
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* --- Shared Layout Highlight --- */}
              {/* Dark background that "flies" between cells using layoutId */}
              <AnimatePresence initial={false}>
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute inset-0 bg-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                    style={{ zIndex: 0 }}
                  />
                )}
              </AnimatePresence>

              {/* --- Logo Image --- */}
              {/* z-10 ensures logo stays above the highlight */}
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={120}
                className={`
                  relative z-10
                  w-12 h-12 md:w-[72px] md:h-[72px] lg:w-24 lg:h-24
                  object-contain transition-all duration-500
                  ${hoveredIndex === index ? "invert" : ""}
                `}
              />
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}