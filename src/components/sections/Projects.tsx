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
    title: "Landing Pages",
    authorName: "Pavel Rosenberg",
    category: "Design",
    year: "2025",
    image: "/desktop-showcase.jpg",
    video: "https://res.cloudinary.com/dsh3yslek/video/upload/v1772051704/portfolio-showreel-landingpages_lmbquz.mp4",
    tags: ["UI", "UX", "Web Design", "Motion Design", "Figma", "HTML", "CSS"],
    href: "/case-study/landing-pages",
  },
  {
    title: "Backend Integration",
    authorName: "Pavel Rosenberg",
    category: "Backend",
    year: "2026",
    image: "/case-study/card-showcase.jpg",
    video: "https://res.cloudinary.com/dsh3yslek/video/upload/v1772051657/portfolio-showreel-nike_tqyica.mp4",
    tags: ["Next.js", "PostgreSQL", "Drizzle ORM", "Audit Logging", "Type-safe APIs", "TypeScript"],
    href: "/case-study/backend-integration",
  },
];

export default function Projects() {
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Card reveal animation - staggered from bottom
  useGSAP(() => {
    if (!cardsContainerRef.current) return;

    const cards = cardsContainerRef.current.querySelectorAll('.project-card');

    gsap.set(cards, { y: 100, opacity: 0, willChange: 'transform, opacity' });

    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      force3D: true,
      scrollTrigger: {
        trigger: cardsContainerRef.current,
        start: 'top 80%',
        once: true,
      },
      onComplete: () => {
        // Free GPU memory after animation completes
        gsap.set(cards, { willChange: 'auto' });
      }
    });
  });

  return (
    <section id="projects" className="w-full px-3 lg:px-6 pt-32">
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
              video={project.video}
              tags={project.tags}
              href={project.href}
            />
          </div>
        ))}
      </div>

    </section>
  );
}