'use client';

import { useRef, useState } from 'react';
import { latencyStages } from '@/data/voiceAgent';
import { useChartReveal } from '@/hooks/useChartReveal';
import { BLUE, ORANGE, PURPLE, Eyebrow, LegendItem, PanelHeading } from './shared';

const MAX = 8; // seconds on the axis — headroom for the total label
const TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const segments = [
  { key: 'detection', label: 'End-of-speech detection', color: PURPLE },
  { key: 'agent', label: 'Service + agent to first sentence', color: ORANGE },
  { key: 'rest', label: 'Speech synthesis & transport', color: BLUE },
] as const;

type SegmentKey = typeof segments[number]['key'];

const rows = latencyStages.map((s) => ({
  ...s,
  values: {
    detection: s.detection,
    agent: s.agent,
    rest: Math.round((s.total - s.detection - s.agent) * 10) / 10,
  } as Record<SegmentKey, number>,
}));


export default function LatencyBreakdown() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<{ row: number; seg: SegmentKey } | null>(null);
  useChartReveal(ref);

  const readout = active
    ? `${rows[active.row].label} · ${segments.find((s) => s.key === active.seg)!.label} · ${rows[active.row].values[active.seg].toFixed(1)} s`
    : 'Hover or tap a segment';

  return (
    <section
      ref={ref}
      className="w-full rounded-lg lg:rounded-xl p-5 lg:p-10 xl:p-14 flex flex-col gap-10 lg:gap-14"
      style={{ backgroundColor: 'var(--color-foreground)' }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Eyebrow>Latency breakdown · median per turn</Eyebrow>
          <PanelHeading>6.4 s → 3.9 s</PanelHeading>
          <p className="text-[clamp(13px,0.9vw,18px)] leading-relaxed text-neutral-400 max-w-xl">
            From the user going quiet to the first sound back, measured live.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {segments.map((s) => <LegendItem key={s.key} color={s.color} label={s.label} />)}
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] lg:text-[clamp(11px,0.7vw,15px)] font-mono text-neutral-400 h-4" aria-live="polite">{readout}</p>

        <div className="relative flex flex-col gap-5 lg:gap-[clamp(20px,1.8vw,44px)]">
          {rows.map((row, ri) => (
            <div key={row.label} className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
              <div className="lg:w-[clamp(150px,13vw,300px)] shrink-0 flex lg:flex-col justify-between lg:justify-start gap-0.5">
                <span className="text-[14px] lg:text-[clamp(14px,1vw,22px)] font-semibold text-(--color-background)">{row.label}</span>
                <span className="text-[12px] lg:text-[clamp(11px,0.7vw,15px)] text-neutral-500">{row.note}</span>
              </div>

              <div className="relative flex-1 flex items-center">
                <div data-bar="x" className="flex gap-[2px] h-[clamp(28px,2.4vw,56px)]" style={{ width: `${(row.total / MAX) * 100}%` }}>
                  {segments.map((s) => {
                    const v = row.values[s.key];
                    const isActive = active?.row === ri && active.seg === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        aria-label={`${row.label}, ${s.label}: ${v.toFixed(1)} seconds`}
                        onMouseEnter={() => setActive({ row: ri, seg: s.key })}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive({ row: ri, seg: s.key })}
                        onBlur={() => setActive(null)}
                        onClick={() => setActive({ row: ri, seg: s.key })}
                        className="h-full min-w-0 first:rounded-l-[4px] last:rounded-r-[4px] flex items-center justify-center overflow-hidden cursor-pointer transition-opacity duration-200"
                        style={{
                          flexGrow: v,
                          flexBasis: 0,
                          backgroundColor: s.color,
                          opacity: active && !isActive ? 0.45 : 1,
                        }}
                      >
                        {v >= 0.7 && (
                          <span className="text-[11px] lg:text-[clamp(11px,0.75vw,16px)] font-semibold text-black/75 tabular-nums">
                            {v.toFixed(1)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <span
                  className="absolute pl-3 text-[15px] lg:text-[clamp(15px,1.2vw,28px)] font-semibold text-(--color-background) tabular-nums whitespace-nowrap"
                  style={{ left: `${(row.total / MAX) * 100}%` }}
                >
                  {row.total.toFixed(1)} s
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Axis */}
        <div className="flex flex-col lg:flex-row lg:gap-6 mt-2">
          <div className="hidden lg:block lg:w-[clamp(150px,13vw,300px)] shrink-0" />
          <div className="relative flex-1 h-5 border-t border-white/10">
            {TICKS.map((t) => (
              <span
                key={t}
                className="absolute top-1.5 -translate-x-1/2 text-[10px] lg:text-[clamp(10px,0.6vw,13px)] font-mono text-neutral-500 tabular-nums"
                style={{ left: `${(t / MAX) * 100}%` }}
              >
                {t}s
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
