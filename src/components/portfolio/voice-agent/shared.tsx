'use client';

import Copy from '@/components/ui/Copy';

/* Accent palette shared with ProjectStats */
export const BLUE = '#7CB9E8';
export const ORANGE = '#FF6F4E';
export const PURPLE = '#C4A4E8';

export function Eyebrow({ children, dark = true }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider"
      style={{ color: dark ? 'var(--color-muted)' : '#78716C' }}
    >
      {children}
    </p>
  );
}

export function PanelHeading({ children, dark = true, className = '' }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <Copy>
      <h2
        className={`text-[clamp(30px,3vw,80px)] font-semibold leading-[1.15] tracking-tight ${className}`}
        style={{ color: dark ? 'var(--color-background)' : 'var(--color-foreground)' }}
      >
        {children}
      </h2>
    </Copy>
  );
}

export function LegendItem({ color, label, shape = 'square' }: { color: string; label: string; shape?: 'square' | 'circle' | 'diamond' }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] lg:text-[clamp(12px,0.7vw,15px)] uppercase tracking-wider text-neutral-300">
      <span
        className={shape === 'circle' ? 'w-2.5 h-2.5 rounded-full' : shape === 'diamond' ? 'w-2.5 h-2.5 rotate-45 rounded-[2px]' : 'w-2.5 h-2.5 rounded-[3px]'}
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
