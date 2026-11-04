'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Trophy, RotateCcw } from 'lucide-react';

interface VictoryModalProps {
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ onRestart }) => {
  const { isVictory, jumpCount, fallsCount, altitudeMeters } = useGameStore();

  if (!isVictory) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 select-none animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1a1608] border-2 border-amber-500 rounded-xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col items-center text-center font-mono">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
          <Trophy size={32} />
        </div>

        <h2 className="text-xs uppercase font-extrabold tracking-widest text-amber-300 mb-1">
          THERE IS A SMOKING HOT BABE AT THE TOP!
        </h2>
        <h1 className="text-2xl font-black text-amber-400 mb-6 tracking-wide drop-shadow">
          YOU CONQUERED THE SUMMIT!
        </h1>

        {/* Victory Stats */}
        <div className="w-full bg-black/60 rounded-lg border border-neutral-800 p-4 mb-6 space-y-3 text-sm">
          <div className="flex justify-between items-center text-neutral-400">
            <span>Peak Altitude:</span>
            <span className="text-emerald-400 font-bold">{altitudeMeters}m</span>
          </div>
          <div className="flex justify-between items-center text-neutral-400">
            <span>Total Jumps:</span>
            <span className="text-amber-400 font-bold">{jumpCount}</span>
          </div>
          <div className="flex justify-between items-center text-neutral-400">
            <span>Total Falls:</span>
            <span className="text-red-400 font-bold">{fallsCount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <RotateCcw size={18} />
          <span>CLIMB AGAIN</span>
        </button>
      </div>
    </div>
  );
};
