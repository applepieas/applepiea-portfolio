'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Context to share resize key with components
const GSAPContext = createContext<{ resizeKey: number }>({ resizeKey: 0 });

export const useGSAPResize = () => useContext(GSAPContext);

export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  const [resizeKey, setResizeKey] = useState(0);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth;

        // Only trigger on significant width changes (crossing breakpoints)
        if (Math.abs(newWidth - lastWidth) > 50) {
          lastWidth = newWidth;

          // Kill all existing ScrollTriggers
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());

          // Increment key to force re-initialization
          setResizeKey(prev => prev + 1);
        } else {
          // For small changes, just refresh
          ScrollTrigger.refresh();
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <GSAPContext.Provider value={{ resizeKey }}>
      {children}
    </GSAPContext.Provider>
  );
}
