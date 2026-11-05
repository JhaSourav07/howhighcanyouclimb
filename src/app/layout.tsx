import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'How High Can You Climb ?',
  description: 'How High Can You Climb ? — Tactical high-stakes vertical climbing platformer featuring Sir Hopsalot and 11 handcrafted biomes.',
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
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WH6PBC4M45"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WH6PBC4M45');
          `}
        </Script>
      </head>
      <body className="antialiased bg-[#080808] text-white overflow-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
