'use client';

import SlidingButton from '@/components/ui/SlidingButton';
import Copy from '@/components/ui/Copy';

export default function VoiceCta() {
  return (
    <section
      className="w-full mt-8 lg:mt-16 rounded-lg lg:rounded-xl px-5 lg:px-10 py-20 lg:py-[clamp(120px,10vw,240px)] flex flex-col items-center text-center gap-8 lg:gap-12"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="flex flex-col items-center gap-5 lg:gap-6 max-w-5xl">
        <Copy>
          {/* leading-[1.15] leaves room for descenders inside Copy's line masks */}
          <h2 className="text-[clamp(40px,5.5vw,140px)] font-semibold leading-[1.15] tracking-tight text-(--color-foreground)">
            Want a voice agent for your business?
          </h2>
        </Copy>
        <p className="text-[clamp(15px,1.2vw,26px)] leading-relaxed text-stone-600 max-w-2xl">
          I add voice to existing AI agents, chats and internal tools, and measure it until it&apos;s fast and cheap enough to use every day.
        </p>
      </div>
      <SlidingButton
        defaultText="Get in touch"
        hoverText="Say Ahoj! 👋"
        href="mailto:pavelros.webdev@gmail.com?subject=Voice agent for my business"
      />
    </section>
  );
}
