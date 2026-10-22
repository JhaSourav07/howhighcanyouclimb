'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CharacterId, CharacterConfig } from '@/game/types/game';
import { ArrowLeft, Check, Zap, ArrowUp, Shield } from 'lucide-react';
import { audioSynth } from '@/game/utils/SoundSynthesizer';

const CHARACTERS: CharacterConfig[] = [
  {
    id: 'male',
    name: 'Leo',
    title: 'The Summit Explorer',
    spriteKey: 'male_climber',
    portraitUrl: '/assets/male_climber.png',
    description: 'Agile climber equipped with lightweight gear and high bounce sneakers.',
    stats: {
      agility: 92,
      jumpPower: 88,
      stamina: 90
    }
  },
  {
    id: 'female',
    name: 'Maya',
    title: 'The High Ridge Pathfinder',
    spriteKey: 'female_climber',
    portraitUrl: '/assets/female_climber.png',
    description: 'Precision climber specializing in icy rock ledges and high-altitude jumps.',
    stats: {
      agility: 90,
      jumpPower: 94,
      stamina: 86
    }
  }
];

interface CharacterSelectProps {
  onSelectCharacter: (id: CharacterId) => void;
  onBackToMenu: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onSelectCharacter,
  onBackToMenu
}) => {
  const [selectedId, setSelectedId] = useState<CharacterId>('male');

  const handleSelect = (id: CharacterId) => {
    audioSynth.playClick();
    setSelectedId(id);
  };

  const handleStart = () => {
    audioSynth.playClick();
    onSelectCharacter(selectedId);
  };

  const handleBack = () => {
    audioSynth.playClick();
    onBackToMenu();
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-between p-6 overflow-hidden select-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 opacity-30 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url('/assets/bg_mountains.png')` }}
      />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between py-4">
        <button
          onClick={handleBack}
          className="glass-panel-interactive px-4 py-2.5 rounded-full flex items-center gap-2 text-slate-200 hover:text-white text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-black tracking-wider text-white text-glow uppercase">
          Choose Your Climber
        </h1>

        <div className="w-20" /> {/* Spacer balance */}
      </header>

      {/* Character Cards Grid */}
      <main className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 my-auto">
        {CHARACTERS.map((char) => {
          const isSelected = selectedId === char.id;
          return (
            <div
              key={char.id}
              onClick={() => handleSelect(char.id)}
              className={`glass-panel-interactive rounded-3xl p-6 flex flex-col items-center cursor-pointer transition-all duration-300 relative group ${
                isSelected
                  ? 'border-2 border-cyan-400 shadow-[0_0_40px_rgba(56,189,248,0.35)] bg-slate-800/80 scale-[1.02]'
                  : 'border-white/10 opacity-80 hover:opacity-100 hover:border-cyan-500/40'
              }`}
            >
              {/* Selected Badge Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-cyan-500 text-slate-950 p-1.5 rounded-full shadow-lg">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              )}

              {/* Character Illustration */}
              <div className="relative w-44 h-56 mb-4 animate-float">
                <Image
                  src={char.portraitUrl}
                  alt={char.name}
                  fill
                  sizes="176px"
                  className="object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Character Details */}
              <h2 className="text-2xl font-black text-white tracking-wide">{char.name}</h2>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">{char.title}</span>
              <p className="text-xs text-slate-300 text-center mb-6 leading-relaxed px-2">{char.description}</p>

              {/* Stats Meters */}
              <div className="w-full space-y-2.5 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Agility
                  </span>
                  <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: `${char.stats.agility}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <ArrowUp className="w-3.5 h-3.5 text-cyan-400" /> Jump Power
                  </span>
                  <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-sky-300 rounded-full" style={{ width: `${char.stats.jumpPower}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Stamina
                  </span>
                  <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full" style={{ width: `${char.stats.stamina}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Footer Start Button */}
      <footer className="relative z-10 w-full max-w-md pb-4">
        <button
          onClick={handleStart}
          className="glass-button w-full py-4 px-8 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xl tracking-wider uppercase cursor-pointer shadow-xl"
        >
          <span>Begin Climb</span>
        </button>
      </footer>
    </div>
  );
};
