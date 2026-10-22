'use client';

import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { GameScene } from '@/game/scenes/GameScene';
import { CharacterId, TouchControlsState } from '@/game/types/game';
import { HUDOverlay } from './HUDOverlay';
import { MobileControls } from './MobileControls';
import { PauseModal } from './PauseModal';
import { audioSynth } from '@/game/utils/SoundSynthesizer';

interface GameContainerProps {
  selectedCharacter: CharacterId;
  bestHeight: number;
  onUpdateBestHeight: (newBest: number) => void;
  onBackToMenu: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  selectedCharacter,
  bestHeight,
  onUpdateBestHeight,
  onBackToMenu
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<GameScene | null>(null);

  const [currentHeight, setCurrentHeight] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

  const [touchState, setTouchState] = useState<TouchControlsState>({
    left: false,
    right: false,
    jump: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobileDevice(isMobile);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const scene = new GameScene();
    sceneRef.current = scene;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: true,
      pixelArt: false,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 920 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [scene]
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.once('ready', () => {
      game.scene.start('GameScene', {
        characterId: selectedCharacter,
        seed: Math.floor(Math.random() * 100000),
        onHeightUpdate: (h: number) => {
          setCurrentHeight(h);
          if (h > bestHeight) {
            onUpdateBestHeight(h);
            setIsNewRecord(true);
          }
        },
        onGameOver: () => {
          setIsGameOver(true);
        }
      });
    });

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [selectedCharacter]);

  const handlePause = () => {
    if (gameRef.current && sceneRef.current) {
      sceneRef.current.scene.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (gameRef.current && sceneRef.current) {
      sceneRef.current.scene.resume();
      setIsPaused(false);
    }
  };

  const handleRestart = () => {
    setIsPaused(false);
    setIsGameOver(false);
    setIsNewRecord(false);
    setCurrentHeight(0);

    if (gameRef.current && sceneRef.current) {
      sceneRef.current.scene.restart({
        characterId: selectedCharacter,
        seed: Math.floor(Math.random() * 100000),
        onHeightUpdate: (h: number) => {
          setCurrentHeight(h);
          if (h > bestHeight) {
            onUpdateBestHeight(h);
            setIsNewRecord(true);
          }
        },
        onGameOver: () => {
          setIsGameOver(true);
        }
      });
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioSynth.setMuted(nextMuted);
  };

  const handleTouchChange = (newControls: TouchControlsState) => {
    setTouchState(newControls);
    if (sceneRef.current) {
      sceneRef.current.setTouchControls(newControls);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden select-none">
      {/* Dynamic Full Screen Responsive Phaser Game Canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden" />

      {/* In-Game Glassmorphic HUD */}
      {!isPaused && !isGameOver && (
        <HUDOverlay
          currentHeight={currentHeight}
          bestHeight={bestHeight}
          onPause={handlePause}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Mobile Touch Controls */}
      {!isPaused && !isGameOver && isMobileDevice && (
        <MobileControls onTouchChange={handleTouchChange} touchState={touchState} />
      )}

      {/* Pause & Game Over Modals */}
      {(isPaused || isGameOver) && (
        <PauseModal
          isGameOver={isGameOver}
          currentHeight={currentHeight}
          bestHeight={bestHeight}
          isNewRecord={isNewRecord}
          onResume={isPaused ? handleResume : undefined}
          onRestart={handleRestart}
          onMainMenu={onBackToMenu}
        />
      )}
    </div>
  );
};
