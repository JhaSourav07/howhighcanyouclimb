'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { GameHUD } from './GameHUD';
import { MobileControls } from './MobileControls';
import { DesktopAdSlot } from './DesktopAdSlot';
import { PauseModal } from './PauseModal';
import { VictoryModal } from './VictoryModal';
import { useGameStore } from '@/store/gameStore';
import type { GameManager } from '@/game/core/GameManager';

const GameCanvas = dynamic(
  () => import('./GameCanvas').then((mod) => mod.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-black flex items-center justify-center text-neutral-400 font-mono text-xs tracking-wider">
        INITIALIZING JUMP KING...
      </div>
    ),
  }
);

export const GameContainer: React.FC = () => {
  const managerRef = useRef<GameManager | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleManagerReady = React.useCallback((manager: GameManager) => {
    managerRef.current = manager;
    setIsReady(true);
  }, []);

  const handleVirtualInput = React.useCallback((left: boolean, right: boolean, jump: boolean) => {
    if (managerRef.current) {
      managerRef.current.setVirtualInput(left, right, jump);
    }
  }, []);

  const handleReset = React.useCallback(() => {
    if (managerRef.current) {
      managerRef.current.resetGame();
    }
  }, []);

  const { isPaused, togglePause } = useGameStore();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        togglePause();
      } else if (e.code === 'KeyR' && !e.repeat) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause]);

  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#080808] flex items-center justify-center p-0 md:p-4 overflow-hidden select-none">
      <div className="relative w-full h-full max-w-7xl flex items-center justify-center gap-6">
        {/* Left Desktop Ad Unit */}
        <DesktopAdSlot position="left" />

        {/* 9:16 Portrait Playable Area */}
        <div className="relative w-full h-full max-h-[100dvh] aspect-[9/16] bg-black shadow-2xl border-0 md:border md:border-neutral-800 rounded-none md:rounded-lg overflow-hidden flex flex-col items-center justify-center">
          {/* Phaser Canvas (SSR disabled) */}
          <GameCanvas onManagerReady={handleManagerReady} />

          {/* In-Game HUD */}
          {isReady && <GameHUD onReset={handleReset} />}

          {/* Mobile Touch Controller (Visible on mobile/touch viewports) */}
          {isReady && (
            <div className="md:hidden">
              <MobileControls onInput={handleVirtualInput} />
            </div>
          )}

          {/* Pause Modal */}
          <PauseModal onResume={togglePause} onReset={handleReset} />

          {/* Summit Victory Modal */}
          <VictoryModal onRestart={handleReset} />
        </div>

        {/* Right Desktop Ad Unit */}
        <DesktopAdSlot position="right" />
      </div>
    </main>
  );
};
