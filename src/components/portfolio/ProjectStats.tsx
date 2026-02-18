'use client';

export default function ProjectStats() {
  return (
    <section className="w-full h-[57vw] bg-black p-4 lg:p-5 rounded-lg lg:rounded-xl">

      {/* 12-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 h-full">

        {/* ── Top-left: Title — 6 cols ── */}
        <div className="flex flex-col justify-between gap-4 pb-4 md:pb-6 md:col-span-6 mt-4">
          <h2 className="text-[clamp(48px,3.5vw,96px)] font-semibold leading-[1] tracking-tight text-white">
            Built for scale,{' '}
            <br className="hidden md:block" />
            crafted with care
          </h2>
          <p className="text-[clamp(13px,1vw,18px)] leading-relaxed text-neutral-400 max-w-md">
            The secret to a great product? Obsessing over every query, every component, every pixel.
          </p>
        </div>

        {/* ── Top-right: Blue card — 6 cols ── */}
        <div className="flex flex-col justify-between bg-[#7CB9E8] rounded-[12px] p-8 md:p-10 md:col-span-6">
          <h3 className="text-[clamp(72px,9vw,180px)] font-bold leading-[0.85] tracking-tight text-black">
            50+
          </h3>
          <p className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[240px]">
            React components powering the storefront experience
          </p>
        </div>

        {/* ── Bottom-left: Orange/coral card — 7 cols ── */}
        <div className="flex flex-col justify-between bg-[#FF6F4E] rounded-[12px] p-8 md:p-10 md:col-span-7">
          <h3 className="text-[clamp(72px,9vw,180px)] font-bold leading-[0.85] tracking-tight text-black">
            20+
          </h3>
          <p className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[240px]">
            Database tables with type-safe Drizzle ORM queries
          </p>
        </div>

        {/* ── Bottom-right: Purple card — 5 cols, centered ── */}
        <div className="flex flex-col items-center justify-between text-center bg-[#C4A4E8] rounded-[12px] p-8 md:p-10 md:col-span-5">
          <h3 className="text-[clamp(72px,9vw,180px)] font-bold leading-[0.85] tracking-tight text-black">
            99%
          </h3>
          <p className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[240px]">
            TypeScript coverage across the entire codebase
          </p>
        </div>

      </div>
    </section>
  );
}
