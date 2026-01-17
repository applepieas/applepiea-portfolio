'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Copy from '../ui/Copy';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Design",
    description: "I design high-fidelity interfaces and design systems. I focus on aesthetics that reflect the brand's identity while ensuring a seamless user experience.",
    tags: ["UI/UX DESIGN", "DESIGN SYSTEMS", "PROTOTYPING", "FIGMA"]
  },
  {
    number: "02",
    title: "Development",
    description: "Evolving with every brief and built for impact, my process spans design, development, and brand strategy.",
    tags: ["REACT", "NEXT.JS", "GSAP", "TYPESCRIPT", "TAILWIND CSS", "FRAMER MOTION"]
  },
  {
    number: "03",
    title: "Strategy",
    description: "Evolving with every brief and built for impact, my process spans design, development, and brand strategy.",
    tags: ["RESEARCH & INSIGHTS", "BRAND STRATEGY", "COMPETITIVE STUDY", "VOICE & TONE"]
  }
];

export default function Services() {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    imageRefs.current.forEach((imageContainer) => {
      if (!imageContainer) return;

      const imageInner = imageContainer.querySelector('.image-inner');
      const img = imageContainer.querySelector('img');
      if (!imageInner || !img) return;

      // Mask reveal animation (from top)
      gsap.fromTo(
        imageInner,
        { yPercent: -100 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: 'easeInOut',
          scrollTrigger: {
            trigger: imageContainer,
            start: 'top 80%',
            once: true,
          }
        }
      );

      // Parallax scroll effect on the image
      gsap.fromTo(
        img,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: imageContainer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        }
      );
    });
  });

  return (
    <section className="w-full px-6 py-64">
      {/* Dark container with rounded corners */}
      <div className="bg-foreground text-background rounded-3xl h-full p-5 pt-25 flex flex-col">

        {/* Header section */}
        <div className="mb-16 grid grid-cols-12 gap-8">
          <div className="col-span-10 col-start-3">
            <Copy animateOnScroll={true} delay={0}>
              <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-6">
                Services
              </p>
            </Copy>
            <Copy animateOnScroll={true} delay={0.1}>
              <h2 className="text-14 md:text-5xl lg:text-[3.5rem] font-medium leading-tight">
                Building things that work and look good. From the first sketch to the final deploy, I combine design and full-stack development to turn complex ideas into sharp, high-impact digital reality
              </h2>
            </Copy>
          </div>
        </div>

        {/* Services list */}
        <div className="bg-foreground-secondary rounded-3xl h-full px-5 py-10 mt-10 flex flex-col">
          <div className="flex-1 flex flex-col">
            {services.map((service, index) => (
              <div key={service.number}>

                {/* Service row */}
                <div className="grid grid-cols-12 gap-8 items-start">
                  {/* Number */}
                  <div className="col-span-2">
                    <Copy animateOnScroll={true} delay={0}>
                      <span className="text-muted text-sm font-medium">
                        {service.number}
                      </span>
                    </Copy>
                  </div>

                  {/* Title */}
                  <div className="col-span-4 leading-none">
                    <Copy animateOnScroll={true} delay={0.05}>
                      <h3 className="text-[56px] font-medium">
                        {service.title}
                      </h3>
                    </Copy>
                  </div>

                  {/* Description */}
                  <div className="col-span-3">
                    <Copy animateOnScroll={true} delay={0.1}>
                      <p className="text-[20px] text-[#e5e5e5] leading-relaxed max-w-xs">
                        {service.description}
                      </p>
                    </Copy>
                    <Copy animateOnScroll={true} delay={0.15} className="mt-6">
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block mr-2 px-4 py-1.75 bg-[#525252]/30 text-sm font-medium rounded-lg uppercase text-[#e5e5e5] tracking-wide box-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Copy>
                  </div>

                  {/* Image with mask reveal and parallax */}
                  <div className="col-span-3">
                    <div
                      ref={(el) => { imageRefs.current[index] = el; }}
                      className="w-[400px] h-[300px] rounded-xl overflow-hidden"
                    >
                      <div className="image-inner relative w-full h-[120%]">
                        <Image
                          src="/image.png"
                          alt={`${service.title} preview`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider - only between rows, not after the last one */}
                {index < services.length - 1 && (
                  <div className="py-10">
                    <div className="w-full h-px bg-muted/30" />
                  </div>
                )}

              </div>

            ))}

          </div>
        </div>


      </div>
    </section>
  );
}
