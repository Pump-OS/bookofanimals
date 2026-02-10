'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookStore, TOTAL_SPREADS } from '@/store/useBookStore';
import { animals } from '@/data/animals';

/* ── Helpers ── */

/** Dispatch custom event that Book listens for */
function nav(dir: 'forward' | 'backward') {
  window.dispatchEvent(new CustomEvent('book-nav', { detail: dir }));
}

/** Compute which spread contains animal at 0-based index */
function animalToSpread(animalIndex: number): number {
  return Math.ceil((animalIndex + 2) / 2);
}

/* ── Main Overlay ── */

export default function Overlay() {
  const currentSpread = useBookStore((s) => s.currentSpread);
  const isAnimating = useBookStore((s) => s.isAnimating);
  const tocOpen = useBookStore((s) => s.tocOpen);
  const settingsOpen = useBookStore((s) => s.settingsOpen);
  const canPrev = currentSpread > 0 && !isAnimating;
  const canNext = currentSpread < TOTAL_SPREADS - 1 && !isAnimating;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 pt-3 pointer-events-auto">
        <div className="flex gap-2">
          <ToolbarBtn
            onClick={() =>
              useBookStore.getState().setTocOpen(!tocOpen)
            }
            active={tocOpen}
          >
            ☰ Contents
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() =>
              useBookStore.getState().setSettingsOpen(!settingsOpen)
            }
            active={settingsOpen}
          >
            ⚙ Settings
          </ToolbarBtn>
        </div>
      </div>

      {/* ── Nav arrows + page indicator ── */}
      <div className="flex-1 flex items-center justify-between px-2">
        {/* Left arrow */}
        <button
          className={`pointer-events-auto rounded-full w-11 h-11 flex items-center justify-center text-2xl
            transition-all duration-200
            ${canPrev ? 'bg-white/10 hover:bg-white/20 text-white/80' : 'text-white/20 cursor-default'}`}
          onClick={() => canPrev && nav('backward')}
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* Right arrow */}
        <button
          className={`pointer-events-auto rounded-full w-11 h-11 flex items-center justify-center text-2xl
            transition-all duration-200
            ${canNext ? 'bg-white/10 hover:bg-white/20 text-white/80' : 'text-white/20 cursor-default'}`}
          onClick={() => canNext && nav('forward')}
          aria-label="Next page"
        >
          ›
        </button>
      </div>

      {/* ── Table of Contents panel ── */}
      <AnimatePresence>
        {tocOpen && <TOCPanel />}
      </AnimatePresence>

      {/* ── Settings panel ── */}
      <AnimatePresence>
        {settingsOpen && <SettingsPanel />}
      </AnimatePresence>
    </div>
  );
}

/* ── Toolbar button ── */

function ToolbarBtn({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      className={`px-3 py-1.5 rounded-md text-xs font-sans tracking-wide transition-all duration-150
        ${active ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ── TOC Panel ── */

function TOCPanel() {
  const isAnimating = useBookStore((s) => s.isAnimating);

  const jumpTo = useCallback(
    (idx: number) => {
      if (isAnimating) return;
      const spread = animalToSpread(idx);
      useBookStore.getState().setSpread(spread);
      useBookStore.getState().setTocOpen(false);
    },
    [isAnimating],
  );

  return (
    <motion.div
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="pointer-events-auto absolute top-12 left-2 bottom-16 w-72
                 bg-black/70 backdrop-blur-md rounded-xl border border-white/10
                 overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-white/10">
        <h2 className="text-white/90 text-sm font-bold tracking-widest">
          TABLE OF CONTENTS
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {/* Cover */}
        <TocItem
          label="Cover"
          onClick={() => {
            if (!isAnimating) {
              useBookStore.getState().setSpread(0);
              useBookStore.getState().setTocOpen(false);
            }
          }}
        />
        {/* Animals */}
        {animals.map((a, i) => (
          <TocItem
            key={a.id}
            label={`${i + 1}. ${a.nameEn}`}
            sub={`${a.size} · ${a.weight}`}
            onClick={() => jumpTo(i)}
          />
        ))}
        {/* Back cover */}
        <TocItem
          label="Back Cover"
          onClick={() => {
            if (!isAnimating) {
              useBookStore.getState().setSpread(TOTAL_SPREADS - 1);
              useBookStore.getState().setTocOpen(false);
            }
          }}
        />
      </div>
    </motion.div>
  );
}

function TocItem({
  label,
  sub,
  onClick,
}: {
  label: string;
  sub?: string;
  onClick: () => void;
}) {
  return (
    <button
      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors
                 text-white/80 text-xs font-sans flex flex-col"
      onClick={onClick}
    >
      <span>{label}</span>
      {sub && <span className="text-white/40 text-[10px]">{sub}</span>}
    </button>
  );
}

/* ── Settings Panel ── */

function SettingsPanel() {
  const quality = useBookStore((s) => s.quality);

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="pointer-events-auto absolute top-12 right-2 w-64
                 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 p-4 flex flex-col gap-4"
    >
      <h2 className="text-white/90 text-sm font-bold tracking-widest">
        SETTINGS
      </h2>

      {/* Quality */}
      <div className="flex flex-col gap-1">
        <label className="text-white/50 text-xs">Render Quality</label>
        <div className="flex gap-2">
          {(['low', 'med', 'high'] as const).map((q) => (
            <button
              key={q}
              className={`flex-1 py-1.5 rounded-md text-xs font-sans transition-all
                ${quality === q ? 'bg-white/25 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              onClick={() => useBookStore.getState().setQuality(q)}
            >
              {q.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Controls info */}
      <div className="border-t border-white/10 pt-3 text-white/40 text-[10px] leading-relaxed">
        <p>← → keys · click/drag · scroll · swipe</p>
      </div>
    </motion.div>
  );
}
