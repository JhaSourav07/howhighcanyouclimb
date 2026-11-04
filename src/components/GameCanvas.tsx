'use client';

import React, { useEffect, useRef } from 'react';
import { GameManager } from '@/game/core/GameManager';

interface GameCanvasProps {
  onManagerReady?: (manager: GameManager) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ onManagerReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<GameManager | null>(null);
  const readyCallbackRef = useRef(onManagerReady);
  readyCallbackRef.current = onManagerReady;

  useEffect(() => {
    if (!containerRef.current || managerRef.current) return;

    const manager = new GameManager();
    manager.init(containerRef.current);
    managerRef.current = manager;

    readyCallbackRef.current?.(manager);

    return () => {
      manager.destroy();
      managerRef.current = null;
    };
  }, []); // Run strictly once on mount!

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-black overflow-hidden [&>canvas]:max-w-full [&>canvas]:max-h-full [&>canvas]:object-contain select-none"
    />
  );
};
