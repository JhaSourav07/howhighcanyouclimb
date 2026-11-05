import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jump King Browser - High Fidelity Recreation',
  description: 'High-fidelity browser recreation of the tactical jumping adventure Jump King.',
  icons: {
    icon: '/assets/images/pla-sheet0.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#080808] text-white overflow-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
