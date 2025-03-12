"use client";

import { useEffect } from 'react';

interface GameControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const GameControls = ({ onMove }: GameControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          onMove('up');
          break;
        case 'ArrowDown':
          onMove('down');
          break;
        case 'ArrowLeft':
          onMove('left');
          break;
        case 'ArrowRight':
          onMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove]);

  return (
    <div className="w-full max-w-[650px] mx-auto mt-8">
      <p className="text-center text-lg sm:text-xl text-[#776e65] mb-6">
        방향키를 사용하거나 아래 버튼을 클릭하세요
      </p>
      <div className="grid grid-cols-3 gap-3 max-w-[300px] mx-auto">
        <button
          onClick={() => onMove('left')}
          className="aspect-square bg-[#bbada0] text-white rounded-xl hover:bg-[#a59a90] transition-colors text-2xl sm:text-3xl flex items-center justify-center"
        >
          ←
        </button>
        <div className="grid grid-rows-2 gap-3">
          <button
            onClick={() => onMove('up')}
            className="aspect-square bg-[#bbada0] text-white rounded-xl hover:bg-[#a59a90] transition-colors text-2xl sm:text-3xl flex items-center justify-center"
          >
            ↑
          </button>
          <button
            onClick={() => onMove('down')}
            className="aspect-square bg-[#bbada0] text-white rounded-xl hover:bg-[#a59a90] transition-colors text-2xl sm:text-3xl flex items-center justify-center"
          >
            ↓
          </button>
        </div>
        <button
          onClick={() => onMove('right')}
          className="aspect-square bg-[#bbada0] text-white rounded-xl hover:bg-[#a59a90] transition-colors text-2xl sm:text-3xl flex items-center justify-center"
        >
          →
        </button>
      </div>
    </div>
  );
}; 