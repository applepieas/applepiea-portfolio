'use client';

import { useRef } from 'react';
import { localModels, longInput } from '@/data/voiceAgent';
import { useChartReveal } from '@/hooks/useChartReveal';
import { Eyebrow, PanelHeading } from './shared';

const LONG_MAX = 400;

export default function LocalModels() {
  const ref = useRef<HTMLElement>(null);
  useChartReveal(ref);

  return (
    <section
      ref={ref}
      className="w-full rounded-lg lg:rounded-xl p-5 lg:p-10 xl:p-14 flex flex-col gap-10 lg:gap-14"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="flex flex-col gap-3 lg:col-span-7">
          <Eyebrow dark={false}>Side quest · local model on the same VPS</Eyebrow>
          <PanelHeading dark={false}>Can a small model run on 8 CPUs and no GPU?</PanelHeading>
        </div>
        <p className="lg:col-span-5 lg:self-end text-[clamp(13px,0.95vw,20px)] leading-relaxed text-stone-600">
          For background jobs like sorting e-mail and pulling out amounts and company IDs. 15 test messages, 4 fields each.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-5">
        {/* Accuracy table */}
        <div className="lg:col-span-7">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] lg:text-[clamp(11px,0.65vw,14px)] uppercase tracking-wider text-stone-500">
                <th className="font-medium pb-3 pr-4">Model</th>
                <th className="font-medium pb-3 pr-4 sm:w-[38%]">All 4 correct</th>
                <th className="font-medium pb-3 pr-4 text-right">Median / msg</th>
                <th className="hidden sm:table-cell font-medium pb-3 pr-4 text-right">Peak RAM</th>
                <th className="hidden sm:table-cell font-medium pb-3 text-right">Tokens/s</th>
              </tr>
            </thead>
            <tbody>
              {localModels.map((m) => (
                <tr key={m.name} className="border-t border-stone-200 text-[13px] lg:text-[clamp(13px,0.85vw,18px)] tabular-nums">
                  <td className="py-4 pr-4">
                    <span className={`block ${m.best ? 'font-semibold text-(--color-foreground)' : 'text-stone-700'}`}>{m.name}</span>
                    <span className="block font-mono text-[11px] text-stone-400">{m.quant}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-[clamp(10px,0.8vw,18px)] rounded-[4px] bg-stone-200/70">
                        <div
                          data-bar="x"
                          className="h-full rounded-[4px]"
                          style={{ width: `${(m.correct / 15) * 100}%`, backgroundColor: m.best ? 'var(--color-foreground)' : '#A8A29E' }}
                        />
                      </div>
                      <span className={m.best ? 'font-semibold text-(--color-foreground)' : 'text-stone-600'}>{m.correct}/15</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-right text-stone-700">{m.median.toFixed(1)} s</td>
                  <td className="hidden sm:table-cell py-4 pr-4 text-right text-stone-700">~{m.ram.toFixed(1)} GB</td>
                  <td className="hidden sm:table-cell py-4 text-right text-stone-700">{m.tps.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Long input — Gemma 4 E2B, time to first answer */}
        <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-4">
          <p className="text-[11px] lg:text-[clamp(11px,0.65vw,14px)] uppercase tracking-wider text-stone-500">
            Long input · Gemma 4 E2B · time to first answer
          </p>
          <div className="flex items-end gap-2 h-[clamp(160px,13vw,320px)]">
            {longInput.map((l) => (
              <div key={l.tokens} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5">
                <span className="text-[11px] lg:text-[clamp(11px,0.7vw,15px)] font-semibold text-(--color-foreground) tabular-nums">{l.seconds}s</span>
                <div
                  data-bar="y"
                  className="w-full rounded-t-[4px]"
                  style={{ height: `${(l.seconds / LONG_MAX) * 100}%`, minHeight: 4, backgroundColor: 'var(--color-foreground)' }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-stone-300 pt-2">
            {longInput.map((l) => (
              <span key={l.tokens} className="flex-1 text-center text-[10px] lg:text-[clamp(10px,0.6vw,13px)] font-mono text-stone-500">{l.tokens}</span>
            ))}
          </div>
          <p className="text-[12px] lg:text-[clamp(12px,0.7vw,15px)] text-stone-500 leading-snug">Input tokens. Answers stayed correct at every length; speed is what breaks.</p>
        </div>
      </div>

      <div className="border-t border-stone-300 pt-5 flex flex-col lg:flex-row lg:items-baseline gap-2 lg:gap-6">
        <span className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider text-stone-500 shrink-0">Verdict</span>
        <p className="text-[clamp(18px,1.5vw,34px)] font-medium leading-[1.3] text-(--color-foreground)">
          Gemma 4 E2B is right for background jobs, not for chat.
        </p>
      </div>
    </section>
  );
}
