import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How High Can You Climb - Endless 2D Platformer",
  description: "A premium endless procedural vertical climber browser game. Climb infinite peak ledges, dodge crumbling rocks, and beat high score records!",
  keywords: ["endless climber", "phaser 3 game", "browser game", "vertical platformer", "procedural generation"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-950 antialiased">
      <body className="min-h-full flex flex-col font-sans select-none overflow-hidden">{children}</body>
    </html>
  );
}
