'use client';

import Image from 'next/image';

/*
 * Desktop + mobile screenshots side by side at equal height.
 * Column fractions match each image's aspect ratio (1916/958 and 750/1624),
 * so neither image is cropped — the desktop shot is simply scaled down.
 */
export function ChatShot() {
  return (
    <figure className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-[2000fr_462fr] gap-4 lg:gap-5">
        <div className="relative w-full aspect-1916/958 rounded-lg lg:rounded-xl overflow-hidden">
          <Image
            src="/case-study/voice-agent/chat-desktop.jpg"
            alt="The company chat with a “Mluvit” (Talk) button in the message field and a “Hlasový režim” (Voice mode) entry in the sidebar"
            fill
            quality={100}
            priority
            sizes="(max-width: 768px) calc(100vw - 56px), 76vw"
            className="object-cover"
          />
        </div>
        <div className="relative w-2/3 mx-auto md:w-full aspect-750/1624 rounded-lg lg:rounded-xl overflow-hidden">
          <Image
            src="/case-study/voice-agent/chat-mobile.jpg"
            alt="Mobile view of the chat with the “Mluvit” (Talk) button in the message field"
            fill
            quality={100}
            sizes="(max-width: 768px) 66vw, 20vw"
            className="object-cover"
          />
        </div>
      </div>
      <figcaption className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 px-1">
        <span className="text-xs lg:text-[clamp(13px,0.75vw,16px)] uppercase font-medium tracking-wider" style={{ color: 'var(--color-muted)' }}>
          Live in the client’s chat · desktop & mobile
        </span>
        <span className="text-[13px] lg:text-[clamp(13px,0.85vw,18px)] text-neutral-300">
          “Mluvit” (Talk) in the message field, “Hlasový režim” (Voice mode) in the sidebar
        </span>
      </figcaption>
    </figure>
  );
}
