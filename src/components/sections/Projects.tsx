'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from '../ui/ProjectCard';
import Copy from '../ui/Copy';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Sidecar Portfolio",
    authorName: "Pavel Rosenberg",
    category: "Portfolio",
    year: "2025",
    image: "/image.png",
    tags: ["NEXT.JS", "TAILWIND CSS", "GSAP", "FRAMER MOTION", "REACT", "TYPESCRIPT"],
  },
  {
    title: "E-commerce Platform",
    authorName: "Pavel Rosenberg",
    category: "Product",
    year: "2024",
    image: "/image.png",
    tags: ["UI/UX", "DESIGN SYSTEM", "FIGMA", "PROTOTYPING", "ART DIRECTION"],
  },

];

export default function Projects() {
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Card reveal animation - staggered from bottom
  useGSAP(() => {
    if (!cardsContainerRef.current) return;

    const cards = cardsContainerRef.current.querySelectorAll('.project-card');

    gsap.set(cards, { y: 100, opacity: 0 });

    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardsContainerRef.current,
        start: 'top 80%',
        once: true,
      }
    });
  });

  return (
    <section className="w-full px-3 lg:px-6 pt-32">
      {/* Header section */}
      <div className="mb-4 flex justify-between items-end text-[12vw] font-bold leading-none tracking-tighter uppercase">
        <Copy animateOnScroll={true} delay={0}>
          <h2>
            Projects
          </h2>
        </Copy>
        <Copy animateOnScroll={true} delay={0.1}>
          <span>
            &apos;26
          </span>
        </Copy>
      </div>

      {/* Projects grid - 1 column on mobile, 2 columns on tablet/desktop */}
      <div ref={cardsContainerRef} className="flex flex-col lg:grid lg:grid-cols-2 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.title} className="project-card">
            <ProjectCard
              title={project.title}
              authorName={project.authorName}
              category={project.category}
              year={project.year}
              image={project.image}
              tags={project.tags}
            />
          </div>
        ))}
      </div>

    </section>
  );
}