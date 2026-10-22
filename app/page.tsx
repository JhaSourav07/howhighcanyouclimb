'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MainMenu } from '@/components/MainMenu';
import { CharacterSelect } from '@/components/CharacterSelect';
import { CharacterId } from '@/game/types/game';
import { audioSynth } from '@/game/utils/SoundSynthesizer';

// Dynamically import GameContainer with SSR disabled because Phaser requires window & canvas DOM
const DynamicGameContainer = dynamic(
  () => import('@/components/GameContainer').then((mod) => mod.GameContainer),
  { ssr: false }
);

type ScreenState = 'menu' | 'select' | 'playing';

export default function HomePage() {
  const [screen, setScreen] = useState<ScreenState>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('male');
  const [bestHeight, setBestHeight] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Load High Score from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('howhigh_best_height');
      if (saved) {
        setBestHeight(parseInt(saved, 10) || 0);
      }
    }
  }, []);

  const handleUpdateBestHeight = (newBest: number) => {
    if (newBest > bestHeight) {
      setBestHeight(newBest);
      if (typeof window !== 'undefined') {
        localStorage.setItem('howhigh_best_height', newBest.toString());
      }
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioSynth.setMuted(nextMuted);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950">
      {screen === 'menu' && (
        <MainMenu
          bestHeight={bestHeight}
          onPlayClick={() => setScreen('select')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {screen === 'select' && (
        <CharacterSelect
          onSelectCharacter={(id) => {
            setSelectedCharacter(id);
            setScreen('playing');
          }}
          onBackToMenu={() => setScreen('menu')}
        />
      )}

      {screen === 'playing' && (
        <DynamicGameContainer
          selectedCharacter={selectedCharacter}
          bestHeight={bestHeight}
          onUpdateBestHeight={handleUpdateBestHeight}
          onBackToMenu={() => setScreen('menu')}
        />
      )}
    </main>
  );
}
