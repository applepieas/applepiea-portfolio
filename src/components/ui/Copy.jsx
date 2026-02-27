'use client'

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';
import React from 'react';
import { useGSAPResize } from '@/components/providers/GSAPProvider';

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Copy({ children, animateOnScroll = true, delay = 0, className = '', isReady = true }) {
  const { resizeKey } = useGSAPResize();
  const containerRef = useRef(null);
  const elementRef = useRef([]);
  const splitRef = useRef([]);
  const lines = useRef([]);
  const masksRef = useRef([]);
  // Start hidden to prevent flash before GSAP takes control
  const [initialHidden, setInitialHidden] = useState(true);

  useGSAP(() => {

    if (!containerRef.current || !isReady) return;

    splitRef.current = [];
    elementRef.current = [];
    lines.current = [];

    let elements = [];
    if (containerRef.current.hasAttribute('data-copy-wrapper')) {
      elements = Array.from(containerRef.current.children);
    } else {
      elements = [containerRef.current];
    }

    elements.forEach((element) => {
      const tagName = element.tagName?.toLowerCase();

      // If it's an image or SVG, wrap it in a mask div so it can be revealed like text
      if (['img', 'svg'].includes(tagName)) {
        const mask = document.createElement('div');
        mask.style.overflow = 'hidden';
        mask.style.display = 'inline-block';
        mask.style.verticalAlign = 'middle';
        mask.style.lineHeight = '0'; // Prevent extra spacing

        // Move any margin from the image to the mask container
        const computedStyle = window.getComputedStyle(element);
        mask.style.margin = computedStyle.margin;
        element.style.margin = '0';

        element.parentNode?.insertBefore(mask, element);
        mask.appendChild(element);

        lines.current.push(element);
        masksRef.current.push({ mask, element });
        return;
      }

      // Only apply SplitText to elements with actual text
      if (element.textContent?.trim().length > 0) {
        elementRef.current.push(element);

        const split = SplitText.create(element, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'line++'
        });

        splitRef.current.push(split);

        const computedStyle = window.getComputedStyle(element);
        const textIndent = computedStyle.textIndent;

        if (textIndent && textIndent !== '0px') {
          if (split.lines.length > 0) {
            split.lines[0].style.paddingLeft = textIndent;
          }
          element.style.textIndent = '0';
        }

        lines.current.push(split.lines);

        // SplitText mask:'lines' creates wrappers with overflow:hidden.
        // Switch to overflow-y:clip (keeps vertical mask for reveal animation)
        // + overflow-x:visible (prevents horizontal clipping of letters like "R"
        // on tight line-heights). CSS 'clip' can be mixed with 'visible' per-axis.
        split.lines.forEach((line) => {
          if (line.parentElement?.style) {
            line.parentElement.style.overflowX = 'visible';
            line.parentElement.style.overflowY = 'clip';
          }
        });
      }
    });

    gsap.set(lines.current, { y: '100%' });

    // Content is now positioned, reveal it
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
      })
    } else {
      gsap.to(lines.current, animationProps);
    };

    return () => {
      // Revert SplitText
      splitRef.current.forEach((split) => {
        if (split) {
          split.revert();
        }
      });
      // Unwrap any images from our manual masks
      masksRef.current.forEach(({ mask, element }) => {
        if (mask && mask.parentNode) {
          mask.parentNode.insertBefore(element, mask);
          mask.parentNode.removeChild(mask);
        }
      });
    };

  }, { scope: containerRef, dependencies: [animateOnScroll, delay, isReady, resizeKey] });

  // Hide content when isReady is false (before preloader completes) OR before GSAP has set initial positions
  const hiddenStyle = (!isReady || initialHidden) ? { visibility: 'hidden' } : {};

  return (
    <div ref={containerRef} className={className} data-copy-wrapper="true" style={hiddenStyle}>
      {children}
    </div>
  )
}

