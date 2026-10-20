'use client';

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useLenisControls } from '@/components/providers/LenisProvider';

interface TransitionContextType {
  navigateTo: (href: string) => void;
  isContentReady: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => { },
  isContentReady: true,
});

export const usePageTransition = () => useContext(TransitionContext);

// ── Style helpers ──────────────────────────────────────────────────────────
type ContentStyle = 'opacity' | 'visibility' | 'transform' | 'position' | 'zIndex' | 'scale';
function applyContentStyles(el: HTMLDivElement, patch: Partial<Record<ContentStyle, string>>) {
  (Object.keys(patch) as ContentStyle[]).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el.style as any)[key] = patch[key] ?? '';
  });
}
function clearContentStyles(el: HTMLDivElement) {
  const keys: ContentStyle[] = ['opacity', 'visibility', 'transform', 'position', 'zIndex', 'scale'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keys.forEach((key) => { (el.style as any)[key] = ''; });
}
// ─────────────────────────────────────────────────────────────────────────────

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenisControls();
  const [isContentReady, setIsContentReady] = useState(true);
  const isAnimatingRef = useRef(false);
  const targetHrefRef = useRef<string | null>(null);
  const contentReadyFiredRef = useRef(false);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetOverlay = useCallback(() => {
    if (!overlayRef.current) return;
    gsap.set(overlayRef.current, { clearProps: 'top,left,right,bottom,borderRadius,y,opacity' });
    overlayRef.current.style.display = 'none';
  }, []);

  const runEnterAnimation = useCallback(() => {
    if (!overlayRef.current) return;

    // Fire isContentReady immediately so Copy animations start right away
    if (!contentReadyFiredRef.current) {
      contentReadyFiredRef.current = true;
      setIsContentReady(true);
    }

    // Keep content hidden behind the overlay initially
    if (contentWrapperRef.current) {
      applyContentStyles(contentWrapperRef.current, {
        position: 'relative',
        zIndex: '1',
        transform: 'none',
        visibility: 'visible',
        opacity: '0',
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Clean up all inline styles from content wrapper
        if (contentWrapperRef.current) {
          clearContentStyles(contentWrapperRef.current);
        }
        resetOverlay();
        isAnimatingRef.current = false;
        targetHrefRef.current = null;
        contentReadyFiredRef.current = false;
        setIsContentReady(true);
        // Unlock scroll 1 s after the enter animation finishes so page
        // animations have a head-start before the user can scroll away.
        scrollUnlockTimerRef.current = setTimeout(() => {
          document.documentElement.style.overflow = '';
          lenis?.start();
        }, 130);
      },
    });

    // Step 1: Fade in content underneath the solid overlay
    tl.to(contentWrapperRef.current, {
      opacity: 1,
      duration: 0.2,
      ease: 'power1.out',
    });

    // Step 2: Fade out the overlay to reveal the content beneath
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
    });
  }, [resetOverlay, lenis]);

  const navigateTo = useCallback((href: string) => {
    // Kill any existing animations
    gsap.killTweensOf([contentWrapperRef.current, overlayRef.current]);

    // Cancel any pending scroll unlock from a previous transition.
    if (scrollUnlockTimerRef.current) {
      clearTimeout(scrollUnlockTimerRef.current);
      scrollUnlockTimerRef.current = null;
    }

    if (isAnimatingRef.current) {
      // Force reset if animation is stuck
      isAnimatingRef.current = false;
      targetHrefRef.current = null;
      contentReadyFiredRef.current = false;
      document.documentElement.style.overflow = '';
      lenis?.start();
      resetOverlay();
      // Restore content wrapper visibility
      if (contentWrapperRef.current) {
        clearContentStyles(contentWrapperRef.current);
      }
    }

    isAnimatingRef.current = true;
    targetHrefRef.current = href;
    contentReadyFiredRef.current = false;
    setIsContentReady(false);

    const isSamePage = pathname === href;

    document.documentElement.style.overflow = 'hidden';
    lenis?.stop();

    // Responsive values to match the dark card on /case-study
    const isLg = window.innerWidth >= 1024;
    const sideMargin = isLg ? 24 : 16;
    const topMargin = isLg ? 240 : 80;
    const radius = isLg ? 20 : 16;

    const tl = gsap.timeline();

    // Phase 1: Fade out current page
    tl.to(contentWrapperRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        if (contentWrapperRef.current) {
          contentWrapperRef.current.style.visibility = 'hidden';
        }
      },
    });

    // Phase 2a: Position overlay as card shape, below viewport
    tl.set(overlayRef.current, {
      display: 'block',
      opacity: 1,
      top: topMargin,
      left: sideMargin,
      right: sideMargin,
      bottom: 0,
      borderRadius: `${radius}px ${radius}px 0 0`,
      y: '100vh',
    }, 0.15);

    // Phase 2b: Slide overlay up to card position
    tl.to(overlayRef.current, {
      y: 0,
      duration: 0.55,
      ease: 'power3.out',
    }, 0.15);

    // Phase 2c: Settle overlay into final card layout
    tl.to(overlayRef.current, {
      top: topMargin,
      left: sideMargin,
      right: sideMargin,
      borderRadius: `${radius}px ${radius}px 0 0`,
      duration: 0.35,
      ease: 'power2.inOut',
    });

    // Phase 3: Navigate when overlay covers screen
    tl.call(() => {
      window.scrollTo(0, 0);

      // Keep content wrapper hidden — runEnterAnimation will reveal it.
      if (contentWrapperRef.current) {
        applyContentStyles(contentWrapperRef.current, {
          opacity: '0',
          visibility: 'hidden',
          transform: 'none',
          scale: '',
        });
      }

      if (isSamePage) {
        // Same page navigation - manually trigger enter animation
        setTimeout(() => runEnterAnimation(), 0);
      } else {
        // Different page - router.push will trigger pathname change
        router.push(href);
      }
    });

  }, [pathname, router, runEnterAnimation, resetOverlay, lenis]);

  // Clean up pending scroll unlock timer on unmount.
  useEffect(() => () => {
    if (scrollUnlockTimerRef.current) clearTimeout(scrollUnlockTimerRef.current);
  }, []);

  // Enter phase - triggered when pathname changes to target
  useEffect(() => {
    if (!isAnimatingRef.current || !targetHrefRef.current) return;
    if (pathname !== targetHrefRef.current) return;

    // Small delay to let React finish rendering the new page
    const timer = setTimeout(() => runEnterAnimation(), 0);

    return () => clearTimeout(timer);
  }, [pathname, runEnterAnimation]);

  return (
    <TransitionContext.Provider value={{ navigateTo, isContentReady }}>
      <div ref={contentWrapperRef}>
        {children}
      </div>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          backgroundColor: 'var(--color-foreground)',
          zIndex: 9999,
          display: 'none',
        }}
      />
    </TransitionContext.Provider>
  );
}
