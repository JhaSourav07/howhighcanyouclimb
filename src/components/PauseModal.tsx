'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Play, RotateCcw } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onReset: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ onResume, onReset }) => {
  const { isPaused } = useGameStore();

  if (!isPaused) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 select-none animate-fadeIn">
      <div className="w-full max-w-xs bg-[#111111] border border-neutral-700 rounded-lg p-6 shadow-2xl flex flex-col items-center text-center font-mono">
        <h2 className="text-xl font-black tracking-widest text-amber-400 mb-4 uppercase">
          Game Paused
        </h2>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play size={16} />
            <span>RESUME</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded flex items-center justify-center gap-2 transition-transform active:scale-95 text-xs"
          >
            <RotateCcw size={14} />
            <span>RESTART RUN</span>
          </button>
        </div>

        {/* Controls Cheat-Sheet */}
        <div className="w-full border-t border-neutral-800 pt-4 text-left text-[11px] text-neutral-400 space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">Walk Left / Right:</span>
            <span className="text-neutral-200 font-bold">A / D or ← / →</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Charge Jump:</span>
            <span className="text-neutral-200 font-bold">HOLD SPACE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Execute Jump:</span>
            <span className="text-neutral-200 font-bold">RELEASE SPACE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Pause / Resume:</span>
            <span className="text-neutral-200 font-bold">ESC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
