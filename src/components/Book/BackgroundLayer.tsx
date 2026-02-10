'use client';

import { useRef, useCallback } from 'react';

const VIDEO_START = 31; // seconds — skip the first 30s
const VIDEO_END_OFFSET = 45; // seconds — cut the last 45s, then loop

/**
 * Full-screen looping background video (vid.mp4) with a slight blur.
 * Plays segment: from 31s to (duration - 45s), then loops back to 31s.
 */
export default function BackgroundLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = VIDEO_START;
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    const loopEnd = v.duration - VIDEO_END_OFFSET;
    if (loopEnd <= VIDEO_START) return; // avoid invalid range
    if (v.currentTime < VIDEO_START) {
      v.currentTime = VIDEO_START;
    } else if (v.currentTime >= loopEnd) {
      v.currentTime = VIDEO_START;
      v.play();
    }
  }, []);

  const handleEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = VIDEO_START;
      v.play();
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ background: '#06060c' }}>
      {/* Looping background video */}
      <video
        ref={videoRef}
        src="/images/vid.mp4"
        autoPlay
        muted
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          objectFit: 'cover',
          filter: 'blur(6px) brightness(0.35)',
          transform: 'scale(1.05)',
        }}
      />

      {/* Center vignette — darkens the middle so the book stands out */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 65%, rgba(6,6,12,0.7) 0%, transparent 100%)',
        }}
      />

      {/* Edge vignette — darkens the outer edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(6,6,12,0.85) 100%)',
        }}
      />
    </div>
  );
}
