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
    description: "I design clean interfaces and build reusable component systems in Figma. Focus on layouts that look intentional, animations that feel smooth, and details that make the experience feel premium.",
    tags: ["UI/UX DESIGN", "DESIGN SYSTEMS", "PROTOTYPING", "FIGMA"],
    image: "/design-service.jpg",
  },
  {
    number: "02",
    title: "Development",
    description: "I build full-stack web apps — everything from animated landing pages to complete platforms with databases. Clean code, smooth interactions, and backends that actually scale.",
    tags: ["REACT", "NEXT.JS", "TYPESCRIPT", "POSTGRESQL", "TAILWIND CSS", "FRAMER MOTION", "WEBFLOW"],
    image: "/development-service.jpg",
  },
  {
    number: "03",
    title: "Integration",
    description: "I connect design and code seamlessly. From prototypes to production, optimizing performance, building API architecture, and making sure everything works together perfectly.",
    tags: ["FULL-STACK INTEGRATION", "PERFORMANCE OPTIMIZATION", "API ARCHITECTURE", "DESIGN-TO-CODE"],
    image: "/integration-service.jpg",
    imagePosition: "object-[50%_75%]",
  }
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const imageContainers = gsap.utils.toArray<HTMLElement>('.service-image-container');

    imageContainers.forEach((imageContainer) => {
      const imageInner = imageContainer.querySelector<HTMLElement>('.image-inner');
      const img = imageContainer.querySelector<HTMLElement>('img');
      if (!imageInner || !img) return;

      // Mask reveal — gsap.from() handles both initial state (yPercent: -100)
      // and the animation atomically, avoiding race conditions when elements
      // are already in viewport on mobile/tablet at load time.
      gsap.from(imageInner, {
        yPercent: -100,
        duration: 0.8,
        delay: 0.1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: imageContainer,
          start: 'top 95%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        }
      });

      // Parallax scroll effect on the image itself
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
            invalidateOnRefresh: true,
          }
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full px-3 lg:px-6 py-64">
      {/* Dark container with rounded corners */}
      <div className="bg-foreground text-background rounded-3xl h-full p-5 pt-6 lg:pt-25 flex flex-col">

        {/* Header section */}

        <div className="mb-6 ml-1 lg:ml-0 lg:mb-16 grid grid-cols-12 gap-6 lg:gap-8">
          <div className="col-span-12 lg:col-span-10 lg:col-start-3">
            <Copy animateOnScroll={true} delay={0}>
              <p className="text-muted text-[clamp(14px,0.8vw,18px)] font-semibold uppercase tracking-wider mb-6">
                Services
              </p>
            </Copy>
            <Copy animateOnScroll={true} delay={0.1}>
              <h2 className="text-[clamp(24px,3.3vw,56px)] font-medium leading-tight">
                Building things that work and look good. From the first design to the final deploy, I handle both the pixels and the code to turn ideas into polished digital products.
              </h2>
            </Copy>
          </div>
        </div>

        {/* Services list */}
        {/* FIX THE IMAGES PARALLAX */}
        <div className="bg-foreground-secondary rounded-3xl h-full px-5 py-10 mt-10 flex flex-col">
          <div className="flex-1 flex flex-col">

            {services.map((service, index) => (
              <div key={service.number}>

                {/* Service row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-start">
                  {/* Number */}
                  <div className="lg:col-span-2 mb-3">
                    <Copy animateOnScroll={true} delay={0}>
                      <span className="text-muted text-[clamp(14px,0.8vw,18px)] font-medium">
                        {service.number}
                      </span>
                    </Copy>
                  </div>

                  {/* Title */}
                  <div className="lg:col-span-4 leading-none mb-6">
                    <Copy animateOnScroll={true} delay={0.05}>
                      <h3 className="text-[clamp(24px,3.3vw,56px)] font-medium">
                        {service.title}
                      </h3>
                    </Copy>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-3 mb-9 lg:mb-0">
                    <Copy animateOnScroll={true} delay={0.1}>
                      <p className="text-[clamp(16px,1.2vw,20px) text-[#e5e5e5] leading-relaxed lg:max-w-xs">
                        {service.description}
                      </p>
                    </Copy>
                    <Copy animateOnScroll={true} delay={0.15} className="mt-3 lg:mt-6">
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block mr-2 px-4 py-1.75 bg-[#525252]/40 text-sm font-normal rounded-lg uppercase text-[#e5e5e5] tracking-wide box-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Copy>
                  </div>

                  {/* Image with mask reveal and parallax */}
                  <div className="lg:col-span-3">
                    <div
                      className="service-image-container w-full h-[calc(200px_+_4.4vw)] md:h-[calc(400px_+_4.4vw)] lg:h-[320px] rounded-xl overflow-hidden"
                    >
                      <div className="image-inner relative w-full h-full">
                        <Image
                          src={service.image}
                          alt={`${service.title} preview`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 25vw"
                          className={`object-cover scale-[1.2] ${service.imagePosition || ''}`}
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
