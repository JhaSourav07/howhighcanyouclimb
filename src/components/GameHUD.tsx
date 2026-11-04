'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface GameHUDProps {
  onReset: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onReset }) => {
  const {
    screenIndex,
    totalScreens,
    jumpChargePercent,
    isCharging,
    altitudeMeters,
    jumpCount,
    fallsCount,
    isMuted,
    toggleMute,
  } = useGameStore();

  return (
    <div className="absolute inset-x-0 top-0 p-4 pointer-events-none select-none z-20 flex flex-col gap-2">
      {/* Top Bar Stats */}
      <div className="flex justify-between items-center text-xs font-mono font-bold tracking-wider text-neutral-300 drop-shadow-md">
        <div className="bg-black/60 px-3 py-1.5 rounded border border-neutral-800 pointer-events-auto flex items-center gap-3">
          <span className="text-amber-400">
            SCREEN {screenIndex + 1}/{totalScreens}
          </span>
          <span className="text-neutral-500">•</span>
          <span className="text-emerald-400">{altitudeMeters}m</span>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              (e.currentTarget as HTMLElement)?.blur();
              toggleMute();
            }}
            className="p-1.5 rounded bg-black/60 border border-neutral-800 text-neutral-400 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 outline-none transition-colors"
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              (e.currentTarget as HTMLElement)?.blur();
              onReset();
            }}
            className="p-1.5 rounded bg-black/60 border border-neutral-800 text-neutral-400 hover:text-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 outline-none transition-colors"
            aria-label="Restart Run (Press R)"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Charge Power Gauge */}
      {isCharging && (
        <div className="w-full max-w-[240px] mx-auto mt-2 bg-black/80 p-1.5 rounded border border-neutral-700 shadow-2xl animate-pulse">
          <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1 px-1">
            <span>CHARGE</span>
            <span className="text-amber-400 font-bold">{Math.round(jumpChargePercent)}%</span>
          </div>
          <div className="w-full h-3 bg-neutral-900 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-75 ${
                jumpChargePercent >= 100
                  ? 'bg-red-500'
                  : jumpChargePercent > 50
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${jumpChargePercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Small Jumps / Falls counter */}
      <div className="flex justify-between text-[10px] font-mono text-neutral-400 px-1 opacity-70">
        <span>JUMPS: {jumpCount}</span>
        <span>FALLS: {fallsCount}</span>
      </div>
    </div>
  );
};
