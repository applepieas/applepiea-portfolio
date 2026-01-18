"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ============================================
   TECH STACK SECTION
   ============================================
   Grid layout displaying technology logos
   with a large "MODERN TECHSTACK" heading.
   
   HOVER EFFECT: Single persistent highlight that
   animates its position/size to the active cell.
   This prevents snap issues from conditional rendering.
   
   CLICK: Each cell links to the technology's website.
   ============================================ */

/* --- Logo Data --- */
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
const borderClasses = [
  "border-r border-secondary",
  "md:border-r border-secondary",
  "border-r border-secondary",
  "",
  "border-t border-r border-secondary",
  "border-t md:border-r border-secondary",
  "border-t border-r border-secondary",
  "border-t border-secondary",
];

export default function Stack() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* --- Character Flip Animation --- */
  useGSAP(() => {
    if (!headingRef.current || !sectionRef.current) return;

    // Split the heading into characters
    const split = SplitText.create(headingRef.current, {
      type: "chars",
      charsClass: "flip-char",
    });

    // Wrap each character in a container for the flip effect
    split.chars.forEach((char) => {
      const wrapper = document.createElement("span");
      wrapper.className = "flip-wrapper";
      wrapper.style.cssText = "display: inline-block; overflow: hidden; position: relative;";

      // Clone the character for the "incoming" animation
      const clone = char.cloneNode(true) as HTMLElement;
      clone.className = "flip-char-clone";
      clone.style.cssText = "display: block; position: absolute; top: 100%; left: 0;";

      // Wrap the original char
      char.parentNode?.insertBefore(wrapper, char);
      (char as HTMLElement).style.display = "block";
      wrapper.appendChild(char);
      wrapper.appendChild(clone);
    });

    // Get all wrappers
    const wrappers = headingRef.current.querySelectorAll(".flip-wrapper");

    // Define stagger order - some chars flip at the same time
    // This creates a interesting pattern across the text
    const staggerOrder = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9, 13, 10, 15, 11, 16, 12, 14];

    wrappers.forEach((wrapper, i) => {
      const original = wrapper.querySelector(".flip-char") as HTMLElement;
      const clone = wrapper.querySelector(".flip-char-clone") as HTMLElement;

      if (!original || !clone) return;

      const staggerIndex = staggerOrder[i % staggerOrder.length] || i;
      const startPercent = (staggerIndex / wrappers.length) * 0.4; // Spread over 40% of scroll
      const endPercent = startPercent + 0.15; // Each char animates over 15% of scroll

      // Original char goes up
      gsap.to(original, {
        yPercent: -100,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `top+=${startPercent * 95}% 90%`,
          end: `top+=${endPercent * 95}% 40%`,
          scrub: 1.5,
        }
      });

      // Clone comes in from bottom
      gsap.to(clone, {
        top: "0%",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `top+=${startPercent * 100}% 80%`,
          end: `top+=${endPercent * 100}% 40%`,
          scrub: 1.5,
        }
      });
    });

    return () => {
      split.revert();
    };
  }, { scope: sectionRef });

  /* Highlight position/size state */
  const [highlightStyle, setHighlightStyle] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  /* Update highlight position when activeIndex changes */
  useEffect(() => {
    if (activeIndex === null || !gridRef.current) return;

    const cell = cellRefs.current[activeIndex];
    const grid = gridRef.current;

    if (cell) {
      const gridRect = grid.getBoundingClientRect();
      const cellRect = cell.getBoundingClientRect();

      setHighlightStyle({
        x: cellRect.left - gridRect.left - 2,
        y: cellRect.top - gridRect.top - 2,
        width: cellRect.width + 4,
        height: cellRect.height + 4,
      });
    }
  }, [activeIndex]);

  /* Recalculate on resize */
  useEffect(() => {
    const handleResize = () => {
      if (activeIndex !== null) {
        const cell = cellRefs.current[activeIndex];
        const grid = gridRef.current;

        if (cell && grid) {
          const gridRect = grid.getBoundingClientRect();
          const cellRect = cell.getBoundingClientRect();

          setHighlightStyle({
            x: cellRect.left - gridRect.left - 2,
            y: cellRect.top - gridRect.top - 2,
            width: cellRect.width + 4,
            height: cellRect.height + 4,
          });
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  return (
    <section ref={sectionRef} className="py-20 w-full mb-[40vh]">

      {/* --- Section Header --- */}
      <div className="text-center mb-16 px-10 pb-32">
        <h2 ref={headingRef} className="font-bold text-[80px] md:text-[140px] lg:text-[209px] uppercase tracking-[-0.03em] leading-[0.85]">
          Modern
          <br />
          Techstack
        </h2>
      </div>

      {/* --- Logo Grid Container --- */}
      <div className="px-10">

        {/* --- Logo Grid --- */}
        <div ref={gridRef} className="relative grid grid-cols-2 md:grid-cols-4 overflow-hidden">

          {/* --- Single Persistent Highlight --- */}
          {/* Always rendered, animates position/size to active cell */}
          {activeIndex !== null && (
            <motion.div
              className="absolute bg-foreground z-10 pointer-events-none"
              animate={{
                x: highlightStyle.x,
                y: highlightStyle.y,
                width: highlightStyle.width,
                height: highlightStyle.height,
              }}
              transition={{
                type: "spring",
                bounce: 0.1,
                duration: 0.6,
              }}
            />
          )}

          {logos.map((logo, index) => (
            <Link
              key={logo.alt}
              ref={(el) => { cellRefs.current[index] = el; }}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                relative flex items-center justify-center
                h-[180px] md:h-[280px] lg:h-[350px]
                ${borderClasses[index]}
              `}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* --- Logo Image --- */}
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={120}
                className={`
                  relative z-20
                  w-12 h-12 md:w-[72px] md:h-[72px] lg:w-24 lg:h-24
                  object-contain transition-all duration-300
                  ${activeIndex === index ? "invert" : ""}
                `}
              />
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}