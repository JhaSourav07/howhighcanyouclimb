'use client';

import React from 'react';
import { Play, RotateCcw, Home, Trophy, Mountain } from 'lucide-react';
import { audioSynth } from '@/game/utils/SoundSynthesizer';

interface PauseModalProps {
  isGameOver?: boolean;
  currentHeight: number;
  bestHeight: number;
  isNewRecord?: boolean;
  onResume?: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isGameOver = false,
  currentHeight,
  bestHeight,
  isNewRecord = false,
  onResume,
  onRestart,
  onMainMenu
}) => {
  const handleResume = () => {
    audioSynth.playClick();
    if (onResume) onResume();
  };

  const handleRestart = () => {
    audioSynth.playClick();
    onRestart();
  };

  const handleMainMenu = () => {
    audioSynth.playClick();
    onMainMenu();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl flex flex-col items-center text-center shadow-2xl border border-white/15 relative overflow-hidden">
        {/* Glow accent decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {isGameOver ? (
          <>
            {/* Game Over Title & Icon */}
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/10 animate-bounce">
              <Mountain className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-black text-white tracking-wide uppercase mb-1">
              You Fell!
            </h2>
            <p className="text-xs text-slate-300 mb-6">Every step counts in the high mountain peaks.</p>

            {/* Score & Record Panel */}
            <div className="w-full bg-slate-900/80 p-5 rounded-2xl border border-white/10 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Climb Altitude</span>
                <span className="text-2xl font-black text-cyan-300">{currentHeight}m</span>
              </div>

              <div className="h-px bg-white/10 w-full" />

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" /> High Score
                </span>
                <span className="text-xl font-bold text-amber-300">{bestHeight}m</span>
              </div>

              {isNewRecord && (
                <div className="mt-2 py-1.5 px-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-300 text-xs font-extrabold tracking-wider uppercase animate-pulse">
                  🎉 New High Altitude Record!
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Pause Game Title */}
            <h2 className="text-3xl font-black text-white tracking-wide uppercase mb-2">
              Game Paused
            </h2>
            <p className="text-xs text-slate-300 mb-6">Take a breather, the peak awaits your return.</p>
          </>
        )}

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          {!isGameOver && onResume && (
            <button
              onClick={handleResume}
              className="glass-button w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-base uppercase tracking-wider cursor-pointer"
            >
              <Play className="w-5 h-5 text-cyan-300 fill-cyan-300" />
              <span>Resume Climb</span>
            </button>
          )}

          <button
            onClick={handleRestart}
            className="w-full py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 flex items-center justify-center gap-2 text-white font-bold text-base uppercase tracking-wider transition cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-slate-300" />
            <span>Try Again</span>
          </button>

          <button
            onClick={handleMainMenu}
            className="w-full py-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-white/5 flex items-center justify-center gap-2 text-slate-300 hover:text-white font-medium text-sm transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
