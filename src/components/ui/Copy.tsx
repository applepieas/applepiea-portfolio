'use client'

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';
import { useGSAPResize } from '@/components/providers/GSAPProvider';

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CopyProps {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  className?: string;
  isReady?: boolean;
}

export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
  className = '',
  isReady = true,
}: CopyProps) {
  const { resizeKey } = useGSAPResize();
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<Element[]>([]);
  const splitRef = useRef<ReturnType<typeof SplitText.create>[]>([]);
  const lines = useRef<(Element | Element[])[]>([]);
  const masksRef = useRef<{ mask: HTMLDivElement; element: Element }[]>([]);
  // Start hidden to prevent flash before GSAP takes control
  const [initialHidden, setInitialHidden] = useState(true);

  useGSAP(() => {
    if (!containerRef.current || !isReady) return;

    // Wait for all fonts to finish loading before splitting text.
    // SplitText measures line breaks using actual font metrics — running it
    // before fonts are ready causes incorrect splits that break silently
    // when the real font swaps in (GSAP warns: "SplitText called before fonts loaded").
    let cancelled = false;

    document.fonts.ready.then(() => {
      // Guard against the component unmounting or effect re-running
      // while we were waiting for fonts
      if (cancelled || !containerRef.current) return;

      splitRef.current = [];
      elementRef.current = [];
      lines.current = [];

      let elements: Element[] = [];
      if (containerRef.current.hasAttribute('data-copy-wrapper')) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        const tagName = element.tagName?.toLowerCase();

        if (['img', 'svg'].includes(tagName)) {
          const mask = document.createElement('div');
          mask.style.overflow = 'hidden';
          mask.style.display = 'inline-block';
          mask.style.verticalAlign = 'middle';
          mask.style.lineHeight = '0';

          const computedStyle = window.getComputedStyle(element as HTMLElement);
          mask.style.margin = computedStyle.margin;
          (element as HTMLElement).style.margin = '0';

          element.parentNode?.insertBefore(mask, element);
          mask.appendChild(element);

          lines.current.push(element);
          masksRef.current.push({ mask, element });
          return;
        }

        if (element.textContent?.trim().length ?? 0 > 0) {
          elementRef.current.push(element);

          const split = SplitText.create(element as HTMLElement, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'line++'
          });

          splitRef.current.push(split);

          const computedStyle = window.getComputedStyle(element as HTMLElement);
          const textIndent = computedStyle.textIndent;

          if (textIndent && textIndent !== '0px') {
            if (split.lines.length > 0) {
              (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
            }
            (element as HTMLElement).style.textIndent = '0';
          }

          lines.current.push(split.lines);

          split.lines.forEach((line) => {
            if ((line as HTMLElement).parentElement?.style) {
              (line as HTMLElement).parentElement!.style.overflowX = 'visible';
              (line as HTMLElement).parentElement!.style.overflowY = 'clip';
            }
          });
        }
      });

      gsap.set(lines.current, { y: '100%' });

      setInitialHidden(false);

      const animationProps = {
        y: '0%',
        duration: 1.5,
        ease: 'power3.out',
        stagger: 0.1,
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          }
        });
      } else {
        gsap.to(lines.current, animationProps);
      }
    });

    return () => {
      // Signal the fonts.ready callback to abort if it fires after cleanup
      cancelled = true;

      splitRef.current.forEach((split) => {
        if (split) split.revert();
      });
      masksRef.current.forEach(({ mask, element }) => {
        if (mask && mask.parentNode) {
          mask.parentNode.insertBefore(element, mask);
          mask.parentNode.removeChild(mask);
        }
      });
    };

  }, { scope: containerRef, dependencies: [animateOnScroll, delay, isReady, resizeKey] });

  // Hide content when isReady is false (before preloader completes) OR before GSAP has set initial positions
  const hiddenStyle = (!isReady || initialHidden) ? { visibility: 'hidden' as const } : {};

  return (
    <div ref={containerRef} className={className} data-copy-wrapper="true" style={hiddenStyle}>
      {children}
    </div>
  )
}
