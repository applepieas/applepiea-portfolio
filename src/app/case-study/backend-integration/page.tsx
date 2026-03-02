'use client';

import Image from "next/image";
import ArchitectureDiagram from "@/components/ui/ArchitectureDiagram";
import { CodeSummary, CodeSnippet } from "@/components/ui/CodeShowcase";
import ProjectStats from "@/components/portfolio/ProjectStats";
import CaseStudyLayout from "@/components/layout/CaseStudyLayout";
import { usePageTransition } from "@/components/providers/TransitionProvider";

export default function BackendIntegrationCaseStudy() {
  const { isContentReady } = usePageTransition();

  return (
    <CaseStudyLayout
      title="Backend Integration"
      year="2025"
      services={['Next.js', 'PostgreSQL', 'Drizzle ORM', 'Audit Logging', 'Type-safe APIs', 'TypeScript']}
      summary="Backend infrastructure for an e-commerce platform — handling authentication, sessions, and complete audit trails for security and compliance. Built with PostgreSQL and Drizzle ORM."
      isContentReady={isContentReady}
    >
      <div className="flex flex-col gap-4 lg:gap-5">

        {/* Interactive architecture diagram */}
        <ArchitectureDiagram className="w-full h-[57vw] rounded-lg lg:rounded-xl" />

        {/* Code showcase — two square cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          <CodeSummary className="aspect-square" />
          <CodeSnippet className="aspect-square" />
        </div>

        {/* Project stats showcase */}
        <ProjectStats />

        {/* Full width image 2 */}
        <div className="w-full h-[57vw] rounded-lg lg:rounded-xl overflow-hidden relative">
          <Image
            alt="Backend integration showcase"
            fill
            className="object-cover object-left"
            sizes="100vw"
            src="/case-study/card-showcase.jpg"
          />
        </div>

        {/* Product listing mockup — full width */}
        <div className="w-full h-[57vw] rounded-lg lg:rounded-xl overflow-hidden relative">
          <Image
            alt="Product listing page mockup"
            fill
            className="object-cover"
            sizes="100vw"
            src="/case-study/mockup-products.jpg"
          />
        </div>

        {/* Product details mockup — full width */}
        <div className="w-full h-[57vw] rounded-lg lg:rounded-xl overflow-hidden relative">
          <Image
            alt="Product details page mockup"
            fill
            className="object-cover"
            sizes="100vw"
            src="/case-study/mockup-product-details.jpg"
          />
        </div>

        {/* Mobile mockups — two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          <div className="w-full aspect-9/16 rounded-lg lg:rounded-xl overflow-hidden relative">
            <Image
              alt="Product listing mobile mockup"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/case-study/mockup-products-mobile.jpg"
            />
          </div>
          <div className="w-full aspect-9/16 rounded-lg lg:rounded-xl overflow-hidden relative">
            <Image
              alt="Product details mobile mockup"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/case-study/mockup-product-details-mobile.jpg"
            />
          </div>
        </div>

      </div>
    </CaseStudyLayout>
  );
}

