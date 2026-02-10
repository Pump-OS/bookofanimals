import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Book of Animals',
  description: 'Interactive 3D animal encyclopedia',
    icons: { icon: { url: '/images/wildcat.jpg', type: 'image/jpeg' } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#1a1a2e] text-white antialiased">{children}</body>
    </html>
  );
}

