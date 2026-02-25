/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const copyBlocksRef = useRef<(HTMLParagraphElement | null)[]>([]);

  // Access Lenis from your existing provider
  const lenis = useLenis();

  useEffect(() => {
    if (!containerRef.current) return;

    let targetVelocity = 0;
    let marqueePosition = 0;
    let smoothVelocity = 0;

    // Track scroll velocity from Lenis
    const handleScroll = (e: { velocity: number }) => {
      targetVelocity = Math.abs(e.velocity) * 0.02;
      ScrollTrigger.update();
    };

    lenis?.on("scroll", handleScroll);

    // Split text instances
    const textBlocks = copyBlocksRef.current.filter(Boolean) as HTMLParagraphElement[];
    const splitInstances = textBlocks.map((block) =>
      SplitText.create(block, { type: "words", mask: "words" })
    );

    // Initial positions - hidden below (negative yPercent means visually below due to mask)
    if (splitInstances[1]) gsap.set(splitInstances[1].words, { yPercent: -100 });
    if (splitInstances[2]) gsap.set(splitInstances[2].words, { yPercent: -100 });

    const overlapCount = 3;

    const getWordProgress = (phaseProgress: number, wordIndex: number, totalWords: number) => {
      const totalLength = 1 + overlapCount / totalWords;
      const scale =
        1 /
        Math.min(
          totalLength,
          1 + (totalWords - 1) / totalWords + overlapCount / totalWords
        );

      const startTime = (wordIndex / totalWords) * scale;
      const endTime = startTime + (overlapCount / totalWords) * scale;
      const duration = endTime - startTime;

      if (phaseProgress <= startTime) return 0;
      if (phaseProgress >= endTime) return 1;
      return (phaseProgress - startTime) / duration;
    };

    const animateBlock = (outBlock: SplitText, inBlock: SplitText, phaseProgress: number) => {
      outBlock.words.forEach((word, i) => {
        const progress = getWordProgress(phaseProgress, i, outBlock.words.length);
        gsap.set(word, { yPercent: progress * 100 }); // Move DOWN to disappear
      });

      inBlock.words.forEach((word, i) => {
        const progress = getWordProgress(phaseProgress, i, inBlock.words.length);
        gsap.set(word, { yPercent: -100 + progress * 100 }); // Come from BELOW (start at -100, end at 0)
      });
    };

    // Clone marquee items
    const marqueeTrack = marqueeTrackRef.current;
    if (marqueeTrack) {
      const items = marqueeTrack.querySelectorAll(".marquee-item");
      items.forEach((item) => marqueeTrack.appendChild(item.cloneNode(true)));
    }

    // Marquee animation ticker
    const tickerCallback = () => {
      smoothVelocity += (targetVelocity - smoothVelocity) * 0.5;
      const baseSpeed = 0.45;
      const speed = baseSpeed + smoothVelocity * 9;
      marqueePosition -= speed;

      if (marqueeTrack) {
        const trackWidth = marqueeTrack.scrollWidth / 2;
        if (marqueePosition <= -trackWidth) {
          marqueePosition = 0;
        }
        gsap.set(marqueeTrack, { x: marqueePosition });
      }

      targetVelocity *= 0.9;
    };

    gsap.ticker.add(tickerCallback);

    // ScrollTrigger for text animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const scrollProgress = self.progress;

        if (scrollProgress <= 0.5) {
          const phase1 = scrollProgress / 0.5;
          if (splitInstances[0] && splitInstances[1]) {
            animateBlock(splitInstances[0], splitInstances[1], phase1);
          }
        } else {
          const phase2 = (scrollProgress - 0.5) / 0.5;
          if (splitInstances[0]) gsap.set(splitInstances[0].words, { yPercent: 100 }); // Keep hidden below
          if (splitInstances[1] && splitInstances[2]) {
            animateBlock(splitInstances[1], splitInstances[2], phase2);
          }
        }
      },
    });

    // Cleanup
    return () => {
      lenis?.off("scroll", handleScroll);
      gsap.ticker.remove(tickerCallback);
      scrollTrigger.kill();
      splitInstances.forEach((instance) => instance.revert());
    };
  }, [lenis]);

  return (
    <div id="about" ref={containerRef} className="relative mt-0 lg:mt-32 mx-10 h-[600vh] w-full">
      <section className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <div className="absolute pb-20 lg:pb-0 inset-0 flex justify-center items-center px-8 max-w-7xl mx-auto flex-col lg:flex-row gap-20 lg:gap-24">

          {[
            "18-year-old designer and developer from Prague, teaching myself by building real things.",
            "Design ideas need code to come alive — so I learned both to bring my own visions to life.",
            "I love making stuff that looks good, works fast, and feels intentional in every interaction."
          ].map((text, i) => (
            <div key={i} className="copy-block">
              <p ref={(el) => { copyBlocksRef.current[i] = el; }}
                className="text-[1.75rem] font-semibold -tracking-[0.025rem] leading-[2rem]"
              >{text}</p>
            </div>
          ))}
        </div>

        <div className="marquee">
          <div ref={marqueeTrackRef} className="marquee-track">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="marquee-item">
                <img className="w-full h-full object-cover" src="/image.png" alt="fish" />
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
