'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CheckCircle2, Circle, ArrowRight, ShieldAlert, Sparkles, X } from 'lucide-react';

export const InteractiveTutorial: React.FC = () => {
  const {
    isTutorialActive,
    tutorialStep,
    hasMovedLeft,
    hasMovedRight,
    skipTutorial,
    completeTutorial,
  } = useGameStore();

  if (!isTutorialActive) return null;

  return (
    <div className="absolute inset-x-3 bottom-6 z-30 pointer-events-none select-none flex flex-col items-center">
      <div className="w-full max-w-sm bg-black/90 backdrop-blur-md border border-neutral-700/80 rounded-xl p-4 shadow-2xl text-white pointer-events-auto transition-all duration-300">
        {/* Header with step counter & skip */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
              {tutorialStep < 4 ? `Interactive Tutorial • Step ${tutorialStep + 1}/4` : 'Ready to Climb'}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              (e.currentTarget as HTMLElement)?.blur();
              skipTutorial();
            }}
            className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-neutral-800"
          >
            <span>Skip</span>
            <X size={12} />
          </button>
        </div>

        {/* Step 1: Walk Left & Right */}
        {tutorialStep === 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <span>1. Ground Movement</span>
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Use <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-600 text-amber-300 font-mono text-[11px]">A</kbd> / <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-600 text-amber-300 font-mono text-[11px]">D</kbd> or <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-600 text-amber-300 font-mono text-[11px]">◀</kbd> / <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-600 text-amber-300 font-mono text-[11px]">▶</kbd> to walk along platforms.
            </p>
            <div className="flex gap-4 pt-1">
              <div className={`flex items-center gap-1.5 text-xs font-mono ${hasMovedLeft ? 'text-emerald-400 font-bold' : 'text-neutral-500'}`}>
                {hasMovedLeft ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} />}
                <span>Walk Left</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-mono ${hasMovedRight ? 'text-emerald-400 font-bold' : 'text-neutral-500'}`}>
                {hasMovedRight ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} />}
                <span>Walk Right</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Low Hop */}
        {tutorialStep === 1 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <span>2. Quick Low Hop</span>
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Tap <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-600 text-amber-300 font-mono text-[11px]">SPACE</kbd> quickly for a short hop. Ideal for minor elevation adjustments.
            </p>
            <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800 text-xs font-mono text-amber-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Action: Tap SPACE right now to hop</span>
            </div>
          </div>
        )}

        {/* Step 3: Charged High Jump */}
        {tutorialStep === 2 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <span>3. Charged High Leap</span>
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Hold <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-600 text-amber-300 font-mono text-[11px]">SPACE</kbd> to build jump charge. Notice the power meter in the HUD, then release to launch!
            </p>
            <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Action: Hold SPACE past 50% power & release</span>
            </div>
          </div>
        )}

        {/* Step 4: Directional Jump & Ricochet */}
        {tutorialStep === 3 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-400" />
              <span>4. Directional Leap & Ricochet</span>
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Hold <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-600 text-amber-300 font-mono text-[11px]">A</kbd> or <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-600 text-amber-300 font-mono text-[11px]">D</kbd> while releasing <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-600 text-amber-300 font-mono text-[11px]">SPACE</kbd>.
            </p>
            <div className="text-[11px] text-neutral-400 italic bg-black/40 p-2 rounded border border-neutral-800/80">
              ⚡ Crucial: You have ZERO air control once airborne! Hitting vertical walls ricochets you with 75% speed.
            </div>
            <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800 text-xs font-mono text-amber-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Action: Leap sideways or bounce off a wall</span>
            </div>
          </div>
        )}

        {/* Step 5: Completed */}
        {tutorialStep >= 4 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Sparkles size={16} />
              <span>Tutorial Completed!</span>
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              You know the fundamentals. 43 handcrafted vertical screens stand between you and the summit. Be patient with your falls!
            </p>
            <button
              type="button"
              onClick={(e) => {
                (e.currentTarget as HTMLElement)?.blur();
                completeTutorial();
              }}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
            >
              <span>START CLIMB</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-3 pt-2 border-t border-neutral-800">
          {[0, 1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1 rounded-full transition-all duration-200 ${
                tutorialStep === step
                  ? 'w-5 bg-amber-400'
                  : tutorialStep > step
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
