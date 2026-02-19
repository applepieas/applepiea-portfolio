'use client';

export default function ProjectStats() {
  return (
    <section className="w-full md:h-[57vw] bg-black p-4 lg:p-5 rounded-lg lg:rounded-xl">

      {/* 12-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 md:h-full">

        {/* ── Title ── */}
        <div className="flex flex-col justify-between gap-4 pb-2 md:pb-6 md:col-span-6 mt-4 ml-1">
          <h2 className="text-[clamp(36px,3.5vw,96px)] font-semibold leading-[1] tracking-tight text-white">
            Secure,{' '}traceable,
            <br />
            built to scale.
          </h2>
          <p className="text-[clamp(13px,1vw,18px)] leading-relaxed text-neutral-400 max-w-md ml-1">
            A robust backend foundation designed for security, auditability, and long-term maintenance.
          </p>
        </div>

        {/* ── Blue card ── */}
        <div className="flex flex-col justify-between bg-[#7CB9E8] rounded-[12px] p-8 md:p-10 md:col-span-6 min-h-[180px]">
          <h3 className="text-[clamp(64px,9vw,122px)] font-semibold leading-[0.85] tracking-tight text-black">
            &lt;100ms
          </h3>
          <p className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[240px]">
            Database updates with full audit logging
          </p>
        </div>

        {/* ── Orange card ── */}
        <div className="flex flex-col justify-between bg-[#FF6F4E] rounded-[12px] p-8 md:p-10 md:col-span-7 min-h-[180px]">
          <h3 className="text-[clamp(40px,7vw,122px)] font-semibold leading-[0.85] tracking-tight text-black">
            Complete
            audit trail
          </h3>
          <p className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[240px]">
            Every database change tracked with
            user, timestamp, and context
          </p>
        </div>

        {/* ── Purple card ── */}
        <div className="flex flex-col justify-center gap-10 md:items-center md:text-center bg-[#C4A4E8] rounded-[12px] p-8 md:p-10 md:col-span-5 min-h-[180px]">
          <h3 className="text-[clamp(64px,9vw,140px)] font-semibold leading-[0.85] tracking-tight text-black">
            90%
          </h3>
          <p className="text-[clamp(14px,1vw,18px)] leading-snug text-black/70 max-w-[240px]">
            TypeScript coverage across the entire codebase
          </p>
        </div>

      </div>
    </section>
  );
}
