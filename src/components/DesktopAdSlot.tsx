'use client';

import React from 'react';

interface DesktopAdSlotProps {
  position: 'left' | 'right';
}

export const DesktopAdSlot: React.FC<DesktopAdSlotProps> = ({ position }) => {
  return (
    <aside
      aria-label={`${position} advertisement`}
      className="hidden xl:flex flex-col items-center justify-center w-48 h-full bg-[#111111] border border-[#222222] rounded-lg p-4 text-[#555555] text-xs font-mono select-none"
    >
      <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-[#333333] rounded p-2 text-center">
        <span className="font-bold uppercase tracking-wider text-[#777777] mb-2">
          {position} Sponsor
        </span>
        <span className="text-[10px] text-[#444444]">160 x 600 Skyscraper</span>
      </div>
    </aside>
  );
};
