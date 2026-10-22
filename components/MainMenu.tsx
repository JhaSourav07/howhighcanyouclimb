'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Volume2, VolumeX, Trophy, Sparkles, Compass } from 'lucide-react';
import { audioSynth } from '@/game/utils/SoundSynthesizer';

interface MainMenuProps {
  bestHeight: number;
  onPlayClick: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

// Generate deterministic particles to prevent SSR hydration mismatch
const PARTICLES = Array.from({ length: 15 }, (_, i) => {
  const width = ((i * 7 + 3) % 8) + 4;
  const height = ((i * 9 + 5) % 8) + 4;
  const top = ((i * 23 + 11) % 90) + 5;
  const left = ((i * 41 + 17) % 90) + 5;
  const duration = ((i * 3 + 2) % 4) + 3;
  const delay = (i * 0.4) % 2;
  return { id: i, width, height, top, left, duration, delay };
});

export const MainMenu: React.FC<MainMenuProps> = ({
  bestHeight,
  onPlayClick,
  isMuted,
  onToggleMute
}) => {
  const handlePlayClick = () => {
    audioSynth.playClick();
    onPlayClick();
  };

  const handleMuteClick = () => {
    audioSynth.playClick();
    onToggleMute();
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-between p-6 overflow-hidden select-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950">
      {/* Dynamic Animated Clouds & Mountain Background */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center pointer-events-none transition-transform duration-1000 animate-float-slow"
        style={{ backgroundImage: `url('/assets/bg_mountains.png')` }}
      />
      <div 
        className="absolute inset-0 opacity-30 bg-repeat-x pointer-events-none animate-float"
        style={{ backgroundImage: `url('/assets/bg_clouds.png')` }}
      />

      {/* Floating Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-cyan-300/40 blur-xs animate-pulse-glow"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              top: `${p.top}%`,
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* Top Bar Navigation */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between py-4">
        {/* Best Height Badge */}
        <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-3 border border-amber-500/30 text-amber-300 shadow-lg shadow-amber-500/10">
          <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-200/80">Best Height</span>
          <span className="text-xl font-extrabold text-white tracking-tight">{bestHeight}m</span>
        </div>

        {/* Mute Sound Button */}
        <button
          onClick={handleMuteClick}
          className="glass-panel-interactive p-3 rounded-full text-slate-200 hover:text-cyan-400 cursor-pointer"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-6 h-6 text-rose-400" /> : <Volume2 className="w-6 h-6 text-cyan-400" />}
        </button>
      </header>

      {/* Center Main Content (Logo + Play Action) */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto max-w-lg text-center">
        {/* Game Logo */}
        <div className="relative w-[340px] sm:w-[420px] h-[180px] mb-6 animate-float">
          <Image
            src="/assets/game_logo.png"
            alt="How High Can You Climb Logo"
            fill
            sizes="(max-width: 640px) 340px, 420px"
            className="object-contain drop-shadow-[0_10px_25px_rgba(56,189,248,0.4)]"
            priority
          />
        </div>

        {/* Tagline Badge */}
        <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full glass-panel border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Procedural Endless Mountain Climber</span>
        </div>

        {/* Play Action Button */}
        <button
          onClick={handlePlayClick}
          className="glass-button w-full py-4 px-8 rounded-2xl flex items-center justify-center gap-4 text-white font-black text-xl tracking-wider uppercase cursor-pointer group shadow-2xl"
        >
          <Play className="w-7 h-7 text-cyan-300 fill-cyan-300 group-hover:scale-110 transition-transform" />
          <span>Start Adventure</span>
        </button>
      </main>

      {/* Footer Controls Tip */}
      <footer className="relative z-10 w-full max-w-md pb-4 text-center">
        <div className="glass-panel py-3 px-6 rounded-2xl text-xs text-slate-300 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <Compass className="w-4 h-4 text-cyan-400" /> Desktop: <kbd className="bg-slate-800/80 px-2 py-0.5 rounded text-white border border-slate-700">A</kbd> <kbd className="bg-slate-800/80 px-2 py-0.5 rounded text-white border border-slate-700">D</kbd> <kbd className="bg-slate-800/80 px-2 py-0.5 rounded text-white border border-slate-700">SPACE</kbd>
          </span>
        </div>
      </footer>
    </div>
  );
};
