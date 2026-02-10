'use client';

import dynamic from 'next/dynamic';

const BookScene = dynamic(() => import('@/components/Book/BookScene'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0a0a12]">
      <p className="text-white/60 text-lg">Loading Book of Animals...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <BookScene />
    </main>
  );
}
