'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { GameHUD } from './GameHUD';
import { MobileControls } from './MobileControls';
import { DesktopAdSlot } from './DesktopAdSlot';
import { PauseModal } from './PauseModal';
import { VictoryModal } from './VictoryModal';
import { InteractiveTutorial } from './InteractiveTutorial';
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
      } else if (e.code === 'KeyB' && !e.repeat) {
        useGameStore.getState().togglePlatformGuides();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, handleReset]);

  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#080808] flex items-center justify-center p-0 md:p-4 overflow-hidden select-none">
      <div className="relative w-full h-full max-w-[1920px] flex flex-col md:flex-row items-center justify-center gap-0 md:gap-4 xl:gap-6 min-w-0 min-h-0">
        {/* Left Desktop Ad Unit */}
        <DesktopAdSlot position="left" />

        {/* Responsive Playable Area */}
        {/* Strictly 4:3 native aspect ratio across laptop/desktop and mobile viewports */}
        <div className="relative w-full h-full md:w-auto md:h-full flex flex-col items-center justify-between md:justify-center min-w-0 min-h-0">
          <div
            className="relative w-full aspect-[4/3] md:w-auto md:h-full md:aspect-[4/3] bg-[#111111] shadow-2xl border-0 md:border md:border-neutral-800 rounded-none md:rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              maxHeight: 'calc(100dvh - 2rem)',
              maxWidth: 'min(100%, calc((100dvh - 2rem) * 4 / 3))',
            }}
          >
            {/* Phaser Canvas (SSR disabled) */}
            <GameCanvas onManagerReady={handleManagerReady} />

            {/* In-Game HUD */}
            {isReady && <GameHUD onReset={handleReset} />}

            {/* Pause Modal */}
            <PauseModal onResume={togglePause} onReset={handleReset} />

            {/* Summit Victory Modal */}
            <VictoryModal onRestart={handleReset} />

            {/* Interactive Tutorial */}
            {isReady && <InteractiveTutorial />}
          </div>

          {/* Mobile Touch Controller (Visible on touch/mobile viewports) */}
          {isReady && (
            <div className="md:hidden w-full flex-1 relative flex items-end justify-between px-6 pb-6 pt-2 select-none landscape:absolute landscape:inset-x-0 landscape:bottom-2 landscape:pointer-events-none">
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
