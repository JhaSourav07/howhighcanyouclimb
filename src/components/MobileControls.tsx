'use client';

import React, { useState } from 'react';

interface MobileControlsProps {
  onInput: (left: boolean, right: boolean, jump: boolean) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onInput }) => {
  const [leftDown, setLeftDown] = useState(false);
  const [rightDown, setRightDown] = useState(false);
  const [jumpDown, setJumpDown] = useState(false);

  const updateInput = (l: boolean, r: boolean, j: boolean) => {
    onInput(l, r, j);
  };

  return (
    <div className="absolute inset-x-0 bottom-4 px-6 flex justify-between items-end pointer-events-none select-none z-30">
      {/* Directional Pad */}
      <div className="flex gap-3 pointer-events-auto">
        <button
          type="button"
          aria-label="Walk Left"
          className={`w-16 h-16 rounded-full border-2 ${
            leftDown ? 'bg-amber-500/50 border-amber-400' : 'bg-black/60 border-neutral-600'
          } flex items-center justify-center text-white active:scale-95 transition-transform touch-none shadow-lg`}
          onTouchStart={(e) => {
            e.preventDefault();
            setLeftDown(true);
            updateInput(true, rightDown, jumpDown);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setLeftDown(false);
            updateInput(false, rightDown, jumpDown);
          }}
          onMouseDown={() => {
            setLeftDown(true);
            updateInput(true, rightDown, jumpDown);
          }}
          onMouseUp={() => {
            setLeftDown(false);
            updateInput(false, rightDown, jumpDown);
          }}
        >
          <span className="text-2xl font-bold">◀</span>
        </button>

        <button
          type="button"
          aria-label="Walk Right"
          className={`w-16 h-16 rounded-full border-2 ${
            rightDown ? 'bg-amber-500/50 border-amber-400' : 'bg-black/60 border-neutral-600'
          } flex items-center justify-center text-white active:scale-95 transition-transform touch-none shadow-lg`}
          onTouchStart={(e) => {
            e.preventDefault();
            setRightDown(true);
            updateInput(leftDown, true, jumpDown);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setRightDown(false);
            updateInput(leftDown, false, jumpDown);
          }}
          onMouseDown={() => {
            setRightDown(true);
            updateInput(leftDown, true, jumpDown);
          }}
          onMouseUp={() => {
            setRightDown(false);
            updateInput(leftDown, false, jumpDown);
          }}
        >
          <span className="text-2xl font-bold">▶</span>
        </button>
      </div>

      {/* Jump / Charge Action Button */}
      <div className="pointer-events-auto">
        <button
          type="button"
          aria-label="Jump Charge"
          className={`w-20 h-20 rounded-full border-2 ${
            jumpDown ? 'bg-red-600/70 border-red-400 scale-95' : 'bg-black/70 border-red-500'
          } flex flex-col items-center justify-center text-white active:scale-90 transition-transform touch-none shadow-xl`}
          onTouchStart={(e) => {
            e.preventDefault();
            setJumpDown(true);
            updateInput(leftDown, rightDown, true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setJumpDown(false);
            updateInput(leftDown, rightDown, false);
          }}
          onMouseDown={() => {
            setJumpDown(true);
            updateInput(leftDown, rightDown, true);
          }}
          onMouseUp={() => {
            setJumpDown(false);
            updateInput(leftDown, rightDown, false);
          }}
        >
          <span className="text-xs uppercase font-extrabold tracking-wider text-red-300">HOLD</span>
          <span className="text-lg font-black">JUMP</span>
        </button>
      </div>
    </div>
  );
};
