'use client';

import React from 'react';
import { Pause, Trophy, Mountain, Volume2, VolumeX } from 'lucide-react';
import { audioSynth } from '@/game/utils/SoundSynthesizer';

interface HUDOverlayProps {
  currentHeight: number;
  bestHeight: number;
  onPause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  currentHeight,
  bestHeight,
  onPause,
  isMuted,
  onToggleMute
}) => {
  const handlePause = () => {
    audioSynth.playClick();
    onPause();
  };

  const handleMute = () => {
    audioSynth.playClick();
    onToggleMute();
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 pointer-events-none select-none">
      {/* Left Stack: Real-time Height & Best Height */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Current Altitude HUD */}
        <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Mountain className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300/80">Altitude</span>
            <span className="text-2xl font-black text-white tracking-tight text-glow leading-none">
              {currentHeight}<span className="text-sm font-semibold text-cyan-300 ml-0.5">m</span>
            </span>
          </div>
        </div>

        {/* Best Height HUD */}
        <div className="hidden sm:flex glass-panel px-4 py-2.5 rounded-2xl items-center gap-2.5 border border-amber-500/20 text-amber-300">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase font-semibold text-amber-200/70">Best:</span>
          <span className="text-base font-extrabold text-white">{bestHeight}m</span>
        </div>
      </div>

      {/* Right Controls: Mute & Pause */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={handleMute}
          className="glass-panel-interactive p-3 rounded-2xl text-slate-200 hover:text-cyan-400 cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
        </button>

        <button
          onClick={handlePause}
          className="glass-panel-interactive p-3 rounded-2xl text-slate-200 hover:text-white cursor-pointer"
          title="Pause Game"
        >
          <Pause className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
