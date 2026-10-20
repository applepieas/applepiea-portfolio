'use client';

import { BLUE, ORANGE, PURPLE } from './shared';

export default function VoiceStats() {
  return (
    <section className="w-full md:h-[57vw] bg-black p-4 lg:p-5 rounded-lg lg:rounded-xl">

      {/* 12-column grid — same structure as ProjectStats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 md:h-full">

        {/* ── Title ── */}
        <div className="flex flex-col justify-between gap-4 pb-2 md:pb-6 md:col-span-6 mt-4 ml-1">
          <h2 className="text-[clamp(36px,3.5vw,96px)] font-semibold leading-[1] tracking-tight text-white">
            Measured first.
            <br />
            Then made it fast.
          </h2>
          <p className="text-[clamp(13px,1vw,18px)] leading-relaxed text-neutral-400 max-w-md ml-1">
            The voice provider wasn&apos;t the bottleneck. The agent&apos;s prompt was.
          </p>
        </div>

        {/* ── Blue card ── */}
        <div className="flex flex-col justify-between rounded-[12px] p-8 md:p-10 md:col-span-6 min-h-[180px]" style={{ backgroundColor: BLUE }}>
          <h3 className="text-[clamp(54px,9vw,122px)] font-semibold leading-[0.85] tracking-tight text-black">
            −39%
          </h3>
          <p className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[260px]">
            End of speech to first audio — 6.4&nbsp;s down to 3.9&nbsp;s
          </p>
        </div>

        {/* ── Orange card ── */}
        <div className="flex flex-col gap-2 justify-between rounded-[12px] p-8 md:p-10 md:col-span-7 min-h-[180px]" style={{ backgroundColor: ORANGE }}>
          <h3 className="text-[clamp(40px,7vw,122px)] font-semibold leading-[0.85] tracking-tight text-black">
            32 → 4 tools
          </h3>
          <p className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[300px]">
            Prompt 65% smaller: voice gets only the tools it needs
          </p>
        </div>

        {/* ── Purple card ── */}
        <div className="flex flex-col justify-center gap-10 md:items-center md:text-center rounded-[12px] p-8 md:p-10 md:col-span-5 min-h-[180px]" style={{ backgroundColor: PURPLE }}>
          <h3 className="text-[clamp(48px,6vw,110px)] font-semibold leading-[0.85] tracking-tight text-black whitespace-nowrap">
            ~4.70 Kč
          </h3>
          <p className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[240px]">
            All-in cost of a 2.5-minute call. Model cost cut by 68%.
          </p>
        </div>

      </div>
    </section>
  );
}
