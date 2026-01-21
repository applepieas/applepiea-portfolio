'use client';

import Copy from '../ui/Copy';
import SlidingButton from '../ui/SlidingButton';

interface HeaderProps {
  isLoaded?: boolean;
}

export default function Header({ isLoaded = false }: HeaderProps) {


  const textDelay = 0.8;

  return (
    <header>

      <div className="overflow-hidden lg:text-[20px] md:text-[18px] text-[16px] fixed left-8 right-8 top-4 lg:top-5 grid grid-cols-12 gap-4 lg:gap-8 z-50 font-medium header-text">

        {/* Col 1: Location */}
        <div className="col-span-6 lg:col-span-3 flex flex-col items-start gap-0.8">
          <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
            <span className="font-semibold text-foreground whitespace-nowrap">Prague Based</span>
          </Copy>
          <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
            <span className="font-medium text-muted">Global reach</span>
          </Copy>
        </div>

        {/* Col 2: Status */}
        <div className="col-span-3 flex flex-col items-start gap-0.8 hidden lg:flex">
          <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
            <span className="font-semibold text-foreground">Currently</span>
          </Copy>
          <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
            <span className="font-medium text-muted">Learning Three.js</span>
          </Copy>
        </div>

        {/* Col 3: Local Time */}
        <div className="col-span-3 flex flex-col items-start gap-0.8 hidden lg:flex">
          <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
            <span className="font-semibold text-foreground">Local time</span>
          </Copy>
          <Copy animateOnScroll={false} delay={textDelay} isReady={isLoaded}>
            <span className="font-medium text-muted">22:03 GMT+</span>
          </Copy>
        </div>

      </div>

      <div className="fixed right-4 lg:right-8 top-5 lg:top-6 group cursor-pointer z-50 overflow-hidden">
        <SlidingButton
          defaultText="Get in touch"
          hoverText="Say Ahoj! 👋"
          isLoaded={isLoaded}
        />
      </div>

    </header>
  );
}

