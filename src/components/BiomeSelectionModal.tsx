'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BIOME_CATALOG, BiomeDefinition } from '@/game/data/biomes';
import { BiomeId } from '@/types/game';
import {
  Compass,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Snowflake,
  TreePine,
  Droplets,
  Gauge,
  Orbit,
  Skull,
  Candy,
  Crown,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface BiomeSelectionModalProps {
  onSelectBiome?: (biomeId: BiomeId) => void;
}

const BIOME_ICONS: Record<BiomeId, React.ReactNode> = {
  default: <Crown size={16} className="text-amber-400" />,
  volcano: <Flame size={16} className="text-red-500" />,
  worldtree: <TreePine size={16} className="text-emerald-400" />,
  glacier: <Snowflake size={16} className="text-sky-300" />,
  cyberpunk: <Zap size={16} className="text-rose-400" />,
  atlantis: <Droplets size={16} className="text-teal-400" />,
  steampunk: <Gauge size={16} className="text-amber-500" />,
  necropolis: <Compass size={16} className="text-yellow-400" />,
  cosmic: <Orbit size={16} className="text-purple-400" />,
  gothic: <Skull size={16} className="text-rose-600" />,
  candyland: <Candy size={16} className="text-pink-400" />,
};

export const BiomeSelectionModal: React.FC<BiomeSelectionModalProps> = ({ onSelectBiome }) => {
  const { isBiomeSelectorOpen, selectedBiomeId, selectBiome, closeBiomeSelector } = useGameStore();
  const [highlightedId, setHighlightedId] = useState<BiomeId>(selectedBiomeId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const biomesList = Object.values(BIOME_CATALOG);
  const activeBiome = BIOME_CATALOG[highlightedId] || BIOME_CATALOG.default;

  // Sync highlighted with current selected when opening
  useEffect(() => {
    if (isBiomeSelectorOpen) {
      setHighlightedId(selectedBiomeId);
    }
  }, [isBiomeSelectorOpen, selectedBiomeId]);

  // Scroll active item into view
  useEffect(() => {
    if (!isBiomeSelectorOpen || !scrollContainerRef.current) return;
    const cardEl = scrollContainerRef.current.querySelector(`[data-biome-id="${highlightedId}"]`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [highlightedId, isBiomeSelectorOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isBiomeSelectorOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeBiomeSelector();
      } else if (e.key === 'ArrowRight') {
        const curIdx = biomesList.findIndex((b) => b.id === highlightedId);
        const nextIdx = (curIdx + 1) % biomesList.length;
        setHighlightedId(biomesList[nextIdx].id);
      } else if (e.key === 'ArrowLeft') {
        const curIdx = biomesList.findIndex((b) => b.id === highlightedId);
        const prevIdx = (curIdx - 1 + biomesList.length) % biomesList.length;
        setHighlightedId(biomesList[prevIdx].id);
      } else if (e.key === 'Enter') {
        handleConfirmSelection(highlightedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBiomeSelectorOpen, highlightedId, biomesList, closeBiomeSelector]);

  if (!isBiomeSelectorOpen) return null;

  const handleConfirmSelection = (id: BiomeId) => {
    selectBiome(id);
    if (onSelectBiome) {
      onSelectBiome(id);
    }
  };

  const handleScrollNav = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 280;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Biome Selection"
      className="absolute inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-neutral-950/95 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Ambient Top Glow in active biome's color */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: activeBiome.accentColor }}
        />

        {/* Modal Header */}
        <div className="relative px-6 pt-5 pb-3 flex items-center justify-between border-b border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold font-mono tracking-wide text-white flex items-center gap-2">
                <span>SELECT BIOME</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-normal">
                  {biomesList.length} Maps
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Choose your vertical climbing environment. Each biome features unique atmospheric screens and platform styles.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeBiomeSelector}
            aria-label="Close Biome Selector"
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Biome Carousel / Horizontal Cards List */}
        <div className="relative flex-1 min-h-0 flex flex-col py-4 px-6 overflow-hidden">
          {/* Scroll arrow buttons */}
          <button
            type="button"
            onClick={() => handleScrollNav('left')}
            aria-label="Scroll Left"
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white shadow-xl transition-transform active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => handleScrollNav('right')}
            aria-label="Scroll Right"
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white shadow-xl transition-transform active:scale-90"
          >
            <ChevronRight size={20} />
          </button>

          {/* Cards container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
            tabIndex={0}
            role="region"
            aria-label="Biome Options"
          >
            {biomesList.map((biome) => {
              const isSelected = selectedBiomeId === biome.id;
              const isHighlighted = highlightedId === biome.id;

              return (
                <div
                  key={biome.id}
                  data-biome-id={biome.id}
                  onClick={() => setHighlightedId(biome.id)}
                  onDoubleClick={() => handleConfirmSelection(biome.id)}
                  className={`relative flex-shrink-0 w-64 md:w-72 rounded-xl border p-3 cursor-pointer snap-center transition-all duration-300 flex flex-col ${
                    isHighlighted
                      ? 'bg-neutral-900/90 shadow-2xl scale-[1.02]'
                      : 'bg-neutral-950/60 hover:bg-neutral-900/50 hover:border-neutral-700 border-neutral-800/80'
                  }`}
                  style={{
                    borderColor: isHighlighted ? biome.accentColor : undefined,
                    boxShadow: isHighlighted ? `0 0 24px -4px ${biome.accentColor}33` : undefined,
                  }}
                >
                  {/* Card Thumbnail Image */}
                  <div className="relative w-full h-36 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 mb-3">
                    <img
                      src={biome.previewImage}
                      alt={biome.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                    {/* Active Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-black font-mono text-[10px] font-bold flex items-center gap-1 shadow-lg">
                        <Check size={12} strokeWidth={3} />
                        <span>ACTIVE</span>
                      </div>
                    )}

                    {/* Screen count badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-neutral-700 text-neutral-300 font-mono text-[10px]">
                      {biome.totalScreens} Screens
                    </div>

                    {/* Icon / Particle Badge */}
                    <div className="absolute top-2 left-2 p-1.5 rounded-md bg-black/75 backdrop-blur-sm border border-neutral-700">
                      {BIOME_ICONS[biome.id]}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-sm text-white font-mono truncate">{biome.name}</h3>
                    </div>
                    <p className="text-[11px] font-medium text-neutral-400 mb-2 truncate">
                      {biome.subtitle}
                    </p>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                      {biome.description}
                    </p>

                    {/* Altitude Tier Pills */}
                    <div className="mt-auto space-y-1 pt-2 border-t border-neutral-800/80">
                      <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                        Climb Route ({biome.tiers.length} Tiers)
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {biome.tiers.slice(0, 4).map((tier, idx) => (
                          <div
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] text-neutral-300 truncate"
                            title={`${tier.name} (Screens ${tier.range[0]}–${tier.range[1]})`}
                          >
                            <span className="text-neutral-400 font-mono mr-1">
                              S{tier.range[0]}–{tier.range[1]}
                            </span>
                            <span>{tier.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Highlighted Biome Details Strip */}
          <div className="mt-3 p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${activeBiome.accentColor}22`, border: `1px solid ${activeBiome.accentColor}66` }}
              >
                {BIOME_ICONS[activeBiome.id]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold font-mono text-sm text-white truncate">{activeBiome.name}</h4>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${activeBiome.accentColor}33`, color: activeBiome.accentColor }}
                  >
                    {activeBiome.subtitle}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 truncate max-w-xl">
                  {activeBiome.description}
                </p>
              </div>
            </div>

            {/* Selection Button */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={closeBiomeSelector}
                className="flex-1 md:flex-initial px-4 py-2 text-xs font-mono font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleConfirmSelection(activeBiome.id)}
                className="flex-1 md:flex-initial px-5 py-2 text-xs font-mono font-bold text-black rounded-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                style={{
                  backgroundColor: activeBiome.accentColor,
                  boxShadow: `0 4px 14px -2px ${activeBiome.accentColor}66`,
                }}
              >
                <span>{selectedBiomeId === activeBiome.id ? 'KEEP CURRENT' : 'SELECT & ASCEND'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
