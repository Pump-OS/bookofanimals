'use client';

import { create } from 'zustand';

export const TOTAL_LEAVES = 15;
export const TOTAL_SPREADS = TOTAL_LEAVES + 1; // 0..15, where 0=closed front, 15=closed back
export const TOTAL_CONTENT_PAGES = TOTAL_LEAVES * 2; // 30

interface BookState {
  currentSpread: number;
  isAnimating: boolean;
  quality: 'low' | 'med' | 'high';
  soundEnabled: boolean;
  tocOpen: boolean;
  settingsOpen: boolean;

  setSpread: (n: number) => void;
  nextSpread: () => void;
  prevSpread: () => void;
  setAnimating: (v: boolean) => void;
  setQuality: (q: 'low' | 'med' | 'high') => void;
  toggleSound: () => void;
  setTocOpen: (v: boolean) => void;
  setSettingsOpen: (v: boolean) => void;
}

export const useBookStore = create<BookState>((set) => ({
  currentSpread: 0,
  isAnimating: false,
  quality: 'med',
  soundEnabled: false,
  tocOpen: false,
  settingsOpen: false,

  setSpread: (n) =>
    set({ currentSpread: Math.max(0, Math.min(TOTAL_SPREADS - 1, n)) }),
  nextSpread: () =>
    set((s) => ({
      currentSpread: Math.min(s.currentSpread + 1, TOTAL_SPREADS - 1),
    })),
  prevSpread: () =>
    set((s) => ({
      currentSpread: Math.max(s.currentSpread - 1, 0),
    })),
  setAnimating: (v) => set({ isAnimating: v }),
  setQuality: (q) => set({ quality: q }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setTocOpen: (v) => set({ tocOpen: v, settingsOpen: false }),
  setSettingsOpen: (v) => set({ settingsOpen: v, tocOpen: false }),
}));
