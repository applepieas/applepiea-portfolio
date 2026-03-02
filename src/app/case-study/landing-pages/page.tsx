'use client';

import Image from "next/image";
import VideoCarousel from "@/components/ui/VideoCarousel";
import CaseStudyLayout from "@/components/layout/CaseStudyLayout";
import { usePageTransition } from "@/components/providers/TransitionProvider";

export default function LandingPagesCaseStudy() {
  const { isContentReady } = usePageTransition();

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
    </CaseStudyLayout>
  );
}

