'use client';

import React, { useRef, useState } from 'react';
import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { MobileControls } from './MobileControls';
import { DesktopAdSlot } from './DesktopAdSlot';
import { GameManager } from '@/game/core/GameManager';

export const GameContainer: React.FC = () => {
  const managerRef = useRef<GameManager | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleManagerReady = (manager: GameManager) => {
    managerRef.current = manager;
    setIsReady(true);
  };

  const handleVirtualInput = (left: boolean, right: boolean, jump: boolean) => {
    if (managerRef.current) {
      managerRef.current.setVirtualInput(left, right, jump);
    }
  };

  const handleReset = () => {
    if (managerRef.current) {
      managerRef.current.resetGame();
    }
  };

  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#080808] flex items-center justify-center p-0 md:p-4 overflow-hidden select-none">
      <div className="relative w-full h-full max-w-7xl flex items-center justify-center gap-6">
        {/* Left Desktop Ad Unit */}
        <DesktopAdSlot position="left" />

        {/* 9:16 Portrait Playable Area */}
        <div className="relative w-full h-full max-h-[100dvh] aspect-[9/16] bg-black shadow-2xl border-0 md:border md:border-neutral-800 rounded-none md:rounded-lg overflow-hidden flex flex-col items-center justify-center">
          {/* Phaser Canvas */}
          <GameCanvas onManagerReady={handleManagerReady} />

          {/* In-Game HUD */}
          {isReady && <GameHUD onReset={handleReset} />}

          {/* Mobile Touch Controller (Visible on touch/mobile viewports) */}
          {isReady && (
            <div className="md:hidden">
              <MobileControls onInput={handleVirtualInput} />
            </div>
          )}
        </div>

        {/* Right Desktop Ad Unit */}
        <DesktopAdSlot position="right" />
      </div>
    </main>
  );
};
