'use client';

import { alsoShipped } from '@/data/voiceAgent';
import { Eyebrow } from './shared';

export default function AlsoShipped() {
  return (
    <section
      className="w-full rounded-lg lg:rounded-xl p-5 lg:p-10 xl:p-14 flex flex-col gap-8"
      style={{ backgroundColor: 'var(--color-foreground)' }}
    >
      <Eyebrow>Also shipped on the engagement</Eyebrow>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-6">
        {alsoShipped.map((item, i) => (
          <li key={item.title} className="flex flex-col gap-2 border-t border-white/10 pt-4">
            <span className="text-xs lg:text-[clamp(12px,0.7vw,15px)] font-mono tabular-nums" style={{ color: 'var(--color-muted)' }}>0{i + 1}</span>
            <span className="text-[16px] lg:text-[clamp(16px,1.15vw,26px)] font-semibold tracking-tight text-(--color-background)">{item.title}</span>
            <span className="text-[13px] lg:text-[clamp(13px,0.85vw,18px)] leading-snug text-neutral-400">{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
