'use client';

import Header from "@/components/layout/Header";
import Copy from "@/components/ui/Copy";
import Image from "next/image";

export default function CaseStudy() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">

      {/* ============================================
          Header - Fixed at top
          ============================================ */}
      <Header isLoaded={true} />

      {/* ============================================
          MAIN CONTAINER
          - Dark foreground background with rounded corners
          - Responsive padding and gaps using clamp()
          ============================================ */}
      <div
        className="flex flex-col items-center gap-[clamp(64px,6vw,200px)] px-3 lg:px-4 pt-[clamp(64px,10vw,128px)] pb-3 lg:pb-4 rounded-2xl lg:rounded-[20px] mx-4 lg:mx-6 mt-24"
        style={{ backgroundColor: 'var(--color-foreground)' }}
      >

        {/* ============================================
            Hero Title
            - Massive centered project title
            ============================================ */}
        <div className="overflow-hidden">
          <Copy>
            <h1
              className="w-full text-center text-5xl md:text-[clamp(64px,8vw,180px)] font-bold uppercase leading-[0.85]"
              style={{ color: 'var(--color-background)' }}
            >
              Jazmin Wong
            </h1>
          </Copy>
        </div>

        {/* ============================================
            Inner Card Container
            - Slightly lighter dark background
            - Contains metadata and gallery
            ============================================ */}
        <div
          className="flex flex-col gap-12 lg:gap-16 2xl:gap-[clamp(64px,5vw,150px)] px-4 lg:px-5 pt-5 lg:pt-6 pb-4 lg:pb-5 rounded-lg lg:rounded-xl w-full"
          style={{ backgroundColor: 'var(--color-foreground-secondary)' }}
        >

          {/* ============================================
              Metadata Grid
              - Year, Services, Summary columns
              ============================================ */}
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12">

            {/* Column 1: Year */}
            <div className="flex flex-col gap-3 col-span-2">
              <div className="overflow-hidden">
                <Copy>
                  <p
                    className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    Year
                  </p>
                </Copy>
              </div>
              <div className="overflow-hidden">
                <Copy>
                  <p
                    className="text-[clamp(48px,3.5vw,96px)] font-semibold tracking-tight leading-[0.8]"
                    style={{ color: 'var(--color-background)' }}
                  >
                    2025
                  </p>
                </Copy>
              </div>
            </div>

            {/* Column 2: Services Tags */}
            <div className="flex flex-col gap-3 col-span-4">
              <div className="overflow-hidden">
                <Copy>
                  <p
                    className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    Services
                  </p>
                </Copy>
              </div>
              <ul className="flex gap-1.5 2xl:gap-2 flex-wrap">
                {['Art Direction', 'Voice & Tone', 'UI', 'UX', 'Next.js', 'Tailwind CSS', 'GSAP', 'Motion', 'Matter.js', 'Lenis', 'Vercel'].map((service, index) => (
                  <li
                    key={index}
                    className="text-[10px] lg:text-[clamp(12px,0.7vw,16px)] uppercase tracking-[1.1] px-2 xl:px-3 pt-2 pb-1.5 rounded-md whitespace-nowrap"
                    style={{
                      color: 'var(--color-background)',
                      backgroundColor: 'rgba(250, 250, 249, 0.1)' /* --color-background with 10% opacity */
                    }}
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Spacer column */}
            <div className="hidden lg:block col-span-1"></div>

            {/* Column 3: Summary */}
            <div className="flex flex-col gap-3 col-span-5">
              <div className="overflow-hidden">
                <Copy>
                  <p
                    className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    Summary
                  </p>
                </Copy>
              </div>
              <div className="overflow-hidden">
                <Copy>
                  <p
                    className="text-[clamp(16px,1.3vw,30px)] font-medium leading-[1.3]"
                    style={{ color: 'var(--color-background)' }}
                  >
                    Designed and developed a personal website for Jazmin Wong, a creative content strategist. The project emphasized a bold, engaging layout with playful micro-interactions to reflect her dynamic approach to content creation.
                  </p>
                </Copy>
              </div>

            </div>
          </div>

          {/* ============================================
              Image Gallery
              - Various layouts: full width, split, etc.
              ============================================ */}
          <div className="flex flex-col gap-4 lg:gap-5">

            {/* Full width image 1 */}
            <div className="w-full h-[200px] lg:h-[clamp(600px,57vw,1200px)] rounded-lg lg:rounded-xl overflow-hidden relative">
              <Image
                alt="Jazmin Wong"
                fill
                className="object-cover"
                sizes="100vw"
                src="/image.png"
              />
            </div>

            {/* Video placeholder (using image for now) */}
            <div className="w-full h-[200px] lg:h-[clamp(600px,57vw,1200px)] rounded-lg lg:rounded-xl overflow-hidden relative">
              <Image
                alt="Jazmin Wong video"
                fill
                className="object-cover"
                sizes="100vw"
                src="/image.png"
              />
            </div>

            {/* Split layout: 2 images side by side */}
            <div className="flex gap-4 lg:gap-5">
              <div className="w-1/2 h-[160px] lg:h-[clamp(600px,40vw,1200px)] rounded-lg lg:rounded-xl overflow-hidden relative">
                <Image
                  alt="Jazmin Wong"
                  fill
                  className="object-cover"
                  sizes="50vw"
                  src="/image.png"
                />
              </div>

              <div className="w-1/2 h-[160px] lg:h-[clamp(600px,40vw,1200px)] rounded-lg lg:rounded-xl overflow-hidden relative">
                <Image
                  alt="Jazmin Wong"
                  fill
                  className="object-cover"
                  sizes="50vw"
                  src="/image.png"
                />
              </div>
            </div>

            {/* Full width image 2 */}
            <div className="w-full h-[200px] lg:h-[clamp(600px,57vw,1200px)] rounded-lg lg:rounded-xl overflow-hidden relative">
              <Image
                alt="Jazmin Wong"
                fill
                className="object-cover"
                sizes="100vw"
                src="/image.png"
              />
            </div>

            {/* Full width image 3 */}
            <div className="w-full h-[200px] lg:h-[clamp(600px,57vw,1200px)] rounded-lg lg:rounded-xl overflow-hidden relative">
              <Image
                alt="Jazmin Wong"
                fill
                className="object-cover"
                sizes="100vw"
                src="/image.png"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>

    </main>
  );
}
