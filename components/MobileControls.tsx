'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { TouchControlsState } from '@/game/types/game';

interface MobileControlsProps {
  onTouchChange: (controls: TouchControlsState) => void;
  touchState: TouchControlsState;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onTouchChange,
  touchState
}) => {
  const setControl = (key: keyof TouchControlsState, value: boolean) => {
    onTouchChange({
      ...touchState,
      [key]: value
    });
  };

  return (
    <div className="absolute bottom-6 left-0 right-0 px-6 flex items-center justify-between z-20 pointer-events-none select-none">
      {/* Left/Right Directional Pad */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onMouseDown={() => setControl('left', true)}
          onMouseUp={() => setControl('left', false)}
          onTouchStart={(e) => { e.preventDefault(); setControl('left', true); }}
          onTouchEnd={(e) => { e.preventDefault(); setControl('left', false); }}
          className={`glass-panel p-5 rounded-2xl text-white transition-transform active:scale-90 cursor-pointer ${
            touchState.left ? 'bg-cyan-500/40 border-cyan-400 scale-95' : 'bg-slate-900/60'
          }`}
        >
          <ArrowLeft className="w-8 h-8 text-cyan-300" />
        </button>

        <button
          onMouseDown={() => setControl('right', true)}
          onMouseUp={() => setControl('right', false)}
          onTouchStart={(e) => { e.preventDefault(); setControl('right', true); }}
          onTouchEnd={(e) => { e.preventDefault(); setControl('right', false); }}
          className={`glass-panel p-5 rounded-2xl text-white transition-transform active:scale-90 cursor-pointer ${
            touchState.right ? 'bg-cyan-500/40 border-cyan-400 scale-95' : 'bg-slate-900/60'
          }`}
        >
          <ArrowRight className="w-8 h-8 text-cyan-300" />
        </button>
      </div>

      {/* Jump Button */}
      <div className="pointer-events-auto">
        <button
          onMouseDown={() => setControl('jump', true)}
          onMouseUp={() => setControl('jump', false)}
          onTouchStart={(e) => { e.preventDefault(); setControl('jump', true); }}
          onTouchEnd={(e) => { e.preventDefault(); setControl('jump', false); }}
          className={`glass-panel p-6 rounded-3xl text-white transition-transform active:scale-90 cursor-pointer shadow-xl ${
            touchState.jump ? 'bg-indigo-500/50 border-indigo-400 scale-95' : 'bg-indigo-900/60 border-indigo-500/30'
          }`}
        >
          <ArrowUp className="w-9 h-9 text-indigo-200 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
