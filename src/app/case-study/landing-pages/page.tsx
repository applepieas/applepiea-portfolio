'use client';

import Header from "@/components/layout/Header";
import Copy from "@/components/ui/Copy";
import Image from "next/image";
import VideoCarousel from "@/components/ui/VideoCarousel";
import { usePageTransition } from "@/components/providers/TransitionProvider";

export default function LandingPagesCaseStudy() {
  const textDelay = 0.1;
  const { isContentReady } = usePageTransition();

  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-foreground)">

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
        className="flex flex-col items-center gap-[clamp(64px,6vw,200px)] px-3 lg:px-6 pt-[clamp(64px,10vw,128px)] pb-3 lg:pb-4 rounded-2xl lg:rounded-[20px] mx-4 lg:mx-6 mt-20 lg:mt-60"
        style={{ backgroundColor: 'var(--color-foreground)' }}
      >

        {/* ============================================
            Hero Title
            - Massive centered project title
            ============================================ */}
        <div className="overflow-hidden">
          <Copy delay={textDelay} isReady={isContentReady}>
            <h1
              className="w-full text-center text-5xl md:text-[clamp(64px,8vw,180px)] font-bold uppercase leading-[0.85]"
              style={{ color: 'var(--color-background)' }}
            >
              Landing pages
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
                <Copy delay={textDelay} isReady={isContentReady}>
                  <p
                    className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    Year
                  </p>
                </Copy>
              </div>
              <div className="overflow-hidden">
                <Copy delay={textDelay} isReady={isContentReady}>
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
                <Copy delay={textDelay} isReady={isContentReady}>
                  <p
                    className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    Services
                  </p>
                </Copy>
              </div>
              <Copy delay={textDelay} isReady={isContentReady}>
                <div className="flex flex-wrap">
                  {['UI', 'UX', 'Web Design', 'Motion Design', 'Figma', 'HTML', 'CSS'].map((service, index) => (
                    <span
                      key={index}
                      className="inline-block mr-1.5 2xl:mr-2 mb-1.5 2xl:mb-2 text-[10px] lg:text-[clamp(12px,0.7vw,16px)] uppercase tracking-[1.1] px-2 xl:px-3 pt-2 pb-1.5 rounded-md whitespace-nowrap"
                      style={{
                        color: 'var(--color-background)',
                        backgroundColor: 'rgba(250, 250, 249, 0.1)'
                      }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </Copy>
            </div>

            {/* Spacer column */}
            <div className="hidden lg:block col-span-1"></div>

            {/* Column 3: Summary */}
            <div className="flex flex-col gap-3 col-span-5">
              <div className="overflow-hidden">
                <Copy delay={textDelay} isReady={isContentReady}>
                  <p
                    className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    Summary
                  </p>
                </Copy>
              </div>
              <div className="overflow-hidden">
                <Copy delay={textDelay} isReady={isContentReady}>
                  <p
                    className="text-[clamp(16px,1.3vw,30px)] font-medium leading-[1.3]"
                    style={{ color: 'var(--color-background)' }}
                  >
                    A collection of landing page designs showcasing my approach to composition, type hierarchy, and brand expression.
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
            <div className="w-full h-[57vw] rounded-lg lg:rounded-xl overflow-hidden relative">
              <Image
                alt="Landing page showcase mobile"
                fill
                className="object-cover"
                quality={100}
                priority
                sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), calc(100vw - 64px)"
                src="/case-study/mobile-showcase.jpg"
              />
            </div>

            {/* Video carousel */}
            <VideoCarousel
              className="w-full h-[57vw] rounded-lg lg:rounded-xl overflow-hidden"
              videos={[
                'https://res.cloudinary.com/dsh3yslek/video/upload/q_auto,f_auto/v1771232449/oravia-vid_fvpxwt.mp4',
                'https://res.cloudinary.com/dsh3yslek/video/upload/q_auto,f_auto/v1771232459/loom-vid_n2fjcn.mp4',
              ]}
            />

            {/* Full width image 2 */}
            <div className="w-full h-[57vw] rounded-lg lg:rounded-xl overflow-hidden relative">
              <Image
                alt="Landing page showcase desktop"
                fill
                className="object-cover"
                sizes="100vw"
                src="/desktop-showcase.jpg"
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
