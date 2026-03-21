/**
 * HeroVideo — Mux player configured for a "reveal then play" hero.
 *
 * HOW IT WORKS
 * ─────────────
 * The parent (Hero.tsx) keeps the player paused while its GSAP slide-down
 * animation runs (yPercent -110 → 0). Once the animation's `onComplete`
 * fires, the parent calls `playerRef.current?.play()` to begin playback.
 *
 * HOW TO CHANGE THE POSTER FRAME
 * ─────────────────────────────────
 * Adjust `thumbnailTime` below (in seconds). Default is 0 (first frame).
 * e.g. thumbnailTime={3} → poster shows the frame at the 3-second mark.
 */

'use client';

import MuxPlayer from '@mux/mux-player-react';
import { forwardRef } from 'react';
import React from 'react';

// Derive the element ref type from the MuxPlayer component itself,
// avoiding a direct import from the peer-dependency @mux/mux-player.
type MuxPlayerRefElement = React.ElementRef<typeof MuxPlayer>;

interface HeroVideoProps {
  playbackId: string;
  className?: string;
}

const HeroVideo = forwardRef<MuxPlayerRefElement, HeroVideoProps>(
  ({ playbackId, className }, ref) => {
    return (
      <MuxPlayer
        ref={ref}
        playbackId={playbackId}
        // First frame is the static poster shown while the reveal animation runs
        thumbnailTime={0}
        // Start paused — parent calls .play() when the animation completes
        autoPlay={false}
        muted
        playsInline
        loop
        // Center play button is also suppressed in globals.css via
        //   mux-player::part(center-play-button) { display: none; }
        // and --controls: none hides all chrome
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '1.5rem',
        }}
        className={className}
        onError={(e) => {
          console.error('HeroVideo playback error:', e);
        }}
      />
    );
  }
);

HeroVideo.displayName = 'HeroVideo';

export default HeroVideo;
export type { MuxPlayerRefElement };
