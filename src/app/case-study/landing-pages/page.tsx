'use client';

import Image from "next/image";

import CaseStudyLayout from "@/components/layout/CaseStudyLayout";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function LandingPagesCaseStudy() {
  const { isContentReady } = usePageTransition();
  const isMobile = useIsMobile();
  const qualityParam = isMobile ? '&max_resolution=720p' : '';

  return (
    <CaseStudyLayout
      title="Landing pages"
      year="2025"
      services={['UI', 'UX', 'Web Design', 'Motion Design', 'Figma', 'HTML', 'CSS']}
      summary="A collection of landing page designs showcasing my approach to composition, type hierarchy, and brand expression."
      isContentReady={isContentReady}
    >
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

        {/* Video carousel – MUX embeds */}
        <div className="flex gap-4">
          <div className="w-full rounded-lg lg:rounded-xl overflow-hidden">
            <iframe
              src={`https://player.mux.com/FR72TzFLeYwI18vzatAgEKieP6gud01uYbzOTnVf6jrk?autoplay=true&muted=1&loop=true${qualityParam}`}
              style={{ width: '100%', border: 'none', aspectRatio: '461/270' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              className="pointer-events-none"
            />
          </div>
          <div className="w-full rounded-lg lg:rounded-xl overflow-hidden">
            <iframe
              src={`https://player.mux.com/51WAD8vjFahGCcK8I7yByvC9qepu4g02B7YnL3xWFY004?autoplay=true&muted=1&loop=true${qualityParam}`}
              style={{ width: '100%', border: 'none', aspectRatio: '461/270' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              className="pointer-events-none"
            />
          </div>
        </div>

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
    </CaseStudyLayout>
  );
}

