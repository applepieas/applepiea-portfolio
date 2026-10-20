'use client';

import { useRef, useState } from 'react';
import { telephonyRuns } from '@/data/voiceAgent';
import { useChartReveal } from '@/hooks/useChartReveal';
import { BLUE, ORANGE, PURPLE, Eyebrow, LegendItem, PanelHeading } from './shared';

const MAX = 45; // headroom so the 36 s label never overflows on mobile
const TICKS = [0, 10, 20, 30, 40];

const paths = [
  { key: 'engine', label: 'Speech Engine + our service', color: BLUE, shape: 'circle' },
  { key: 'agents', label: 'ElevenLabs Agents, custom LLM', color: ORANGE, shape: 'diamond' },
] as const;

const verdicts = [
  { value: '6.2 vs 6.0 s', text: 'Median without the time question. Same speed.', color: BLUE },
  { value: '~$0.08/min', text: '~3.7 credits per second of call in both paths. Same cost.', color: PURPLE },
  { value: '4 s', text: 'Default wait for a custom LLM’s first token (max 15 s). Tool calls failed silently.', color: ORANGE },
];

const checklist = [
  'Tool calls reliably under 15 s',
  'Give the agent the current time',
  'A filler line while it works — “One moment, let me check…”',
  'A stable endpoint instead of a tunnel',
];

const pct = (v: number) => `${(v / MAX) * 100}%`;

export default function TelephonyComparison() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  useChartReveal(ref);

  return (
    <section ref={ref} className="w-full rounded-lg lg:rounded-xl bg-black p-5 lg:p-10 xl:p-14 flex flex-col gap-12 lg:gap-16">

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="flex flex-col gap-3 lg:col-span-7">
          <Eyebrow>The telephony decision</Eyebrow>
          <PanelHeading>Build on our layer, or switch to the off-the-shelf one?</PanelHeading>
        </div>
        <p className="lg:col-span-5 lg:self-end text-[clamp(13px,0.95vw,20px)] leading-relaxed text-neutral-400">
          For phone calls, the client could switch to ElevenLabs Agents. I ran both paths with the same voice, model and questions, twice each.
        </p>
      </div>

      {/* Dot plot */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {paths.map((p) => <LegendItem key={p.key} color={p.color} label={p.label} shape={p.shape} />)}
          </div>
          <p className="text-[11px] lg:text-[clamp(11px,0.7vw,15px)] font-mono text-neutral-400 h-4" aria-live="polite">
            {active ?? 'End of speech → first audio · hover a point'}
          </p>
        </div>

        <div className="flex flex-col">
          {telephonyRuns.map((q) => (
            <div
              key={q.question}
              className="grid grid-cols-1 lg:grid-cols-[clamp(180px,16vw,360px)_1fr] items-center gap-2 lg:gap-6 py-4 lg:py-[clamp(16px,1.3vw,32px)] border-t border-white/10 rounded-md"
              style={q.highlight ? { backgroundColor: 'rgba(255,111,78,0.08)' } : undefined}
            >
              <div className="flex flex-col gap-1 lg:pl-3">
                <span className={`text-[14px] lg:text-[clamp(14px,1vw,22px)] ${q.highlight ? 'font-semibold text-(--color-background)' : 'text-neutral-300'}`}>
                  {q.question}
                </span>
                {q.highlight && (
                  <span className="text-[12px] lg:text-[clamp(11px,0.7vw,15px)] leading-snug" style={{ color: ORANGE }}>
                    Hit the 4 s timeout → retried, agent restarted from zero
                  </span>
                )}
              </div>

              <div className="relative flex flex-col gap-3">
                {/* Gridlines */}
                <div className="absolute inset-0 pointer-events-none">
                  {TICKS.map((t) => (
                    <span key={t} className="absolute inset-y-0 w-px bg-white/5" style={{ left: pct(t) }} />
                  ))}
                </div>

                {paths.map((p) => {
                  const runs = q[p.key];
                  const lo = Math.min(...runs), hi = Math.max(...runs);
                  return (
                    <div key={p.key} className="relative h-4 lg:h-[clamp(16px,1.2vw,28px)]">
                      {/* Range between the two runs */}
                      <span
                        data-bar="x"
                        className="absolute top-1/2 -translate-y-1/2 h-[2px] rounded-full"
                        style={{ left: pct(lo), width: `calc(${pct(hi - lo)})`, backgroundColor: p.color, opacity: 0.4 }}
                      />
                      {runs.map((v, i) => {
                        const label = `${q.question} · ${p.label} · run ${i + 1} · ${v.toFixed(2)} s`;
                        return (
                          <button
                            key={i}
                            type="button"
                            aria-label={label}
                            onMouseEnter={() => setActive(label)}
                            onMouseLeave={() => setActive(null)}
                            onFocus={() => setActive(label)}
                            onBlur={() => setActive(null)}
                            onClick={() => setActive(label)}
                            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer"
                            style={{ left: pct(v) }}
                          >
                            <span
                              data-pop
                              className={p.shape === 'circle' ? 'w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full' : 'w-2.5 h-2.5 lg:w-3 lg:h-3 rotate-45 rounded-[2px]'}
                              style={{ backgroundColor: p.color, boxShadow: '0 0 0 2px #000' }}
                            />
                          </button>
                        );
                      })}
                      {/* Direct label on the slower run */}
                      <span
                        className="absolute top-1/2 -translate-y-1/2 pl-4 text-[11px] lg:text-[clamp(11px,0.7vw,15px)] font-mono text-neutral-400 tabular-nums whitespace-nowrap"
                        style={{ left: pct(hi) }}
                      >
                        {hi.toFixed(1)} s
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Axis */}
          <div className="grid grid-cols-1 lg:grid-cols-[clamp(180px,16vw,360px)_1fr] lg:gap-6 border-t border-white/10">
            <div className="hidden lg:block" />
            <div className="relative h-6">
              {TICKS.map((t) => (
                <span
                  key={t}
                  className="absolute top-2 -translate-x-1/2 text-[10px] lg:text-[clamp(10px,0.6vw,13px)] font-mono text-neutral-500 tabular-nums"
                  style={{ left: pct(t) }}
                >
                  {t}s
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verdict cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {verdicts.map((v) => (
          <div key={v.value} className="flex flex-col justify-between gap-8 rounded-[12px] p-6 lg:p-8 min-h-[160px] lg:min-h-[clamp(200px,15vw,360px)]" style={{ backgroundColor: v.color }}>
            <span className="text-[clamp(36px,3.6vw,88px)] font-semibold leading-[0.9] tracking-tight text-black">{v.value}</span>
            <span className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[280px]">{v.text}</span>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-5">
        <div className="lg:col-span-6 flex flex-col gap-5">
          <Eyebrow>Recommendation</Eyebrow>
          <p className="text-[clamp(18px,1.5vw,34px)] font-medium leading-[1.3] text-(--color-background)">
            Switching works, at the same speed and cost. It goes live once:
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 flex flex-col gap-5 lg:pt-9">
          <ul className="flex flex-col gap-2.5">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[13px] lg:text-[clamp(13px,0.9vw,19px)] leading-snug text-neutral-300">
                <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[12px] lg:text-[clamp(12px,0.7vw,15px)] text-neutral-500">
            The test caught the hidden timeout before customers on the phone did.
          </p>
        </div>
      </div>
    </section>
  );
}
