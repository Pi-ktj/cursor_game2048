"use client";

import { GameBoard } from './Game';

interface BoardProps {
  board: GameBoard;
}

const getTileColor = (value: number): string => {
  const colors: { [key: number]: string } = {
    0: 'bg-gray-200',
    2: 'bg-[#eee4da] text-[#776e65]',
    4: 'bg-[#ede0c8] text-[#776e65]',
    8: 'bg-[#f2b179] text-white',
    16: 'bg-[#f59563] text-white',
    32: 'bg-[#f67c5f] text-white',
    64: 'bg-[#f65e3b] text-white',
    128: 'bg-[#edcf72] text-white',
    256: 'bg-[#edcc61] text-white',
    512: 'bg-[#edc850] text-white',
    1024: 'bg-[#edc53f] text-white',
    2048: 'bg-[#edc22e] text-white',
  };
  return colors[value] || 'bg-[#3c3a32] text-white';
};

const getTileSize = (value: number): string => {
  if (value >= 1000) return 'text-7xl sm:text-8xl';
  if (value >= 100) return 'text-8xl sm:text-9xl';
  return 'text-9xl sm:text-10xl';
};

export const Board = ({ board }: BoardProps) => {
  return (
    <div className="aspect-square w-full max-w-[650px] mx-auto bg-[#bbada0] p-4 rounded-xl shadow-xl">
      <div className="grid grid-cols-4 gap-3 h-full">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`aspect-square flex items-center justify-center ${getTileSize(cell)} font-bold rounded-xl transition-all duration-100 ${getTileColor(
                cell
              )}`}
              style={{
                transform: cell ? 'scale(1)' : 'scale(0.8)',
                fontSize: cell ? (cell >= 1000 ? '2.5rem' : (cell >= 100 ? '3rem' : '3.5rem')) : '0',
              }}
            >
              <div className="transform scale-90">
                {cell !== 0 && cell}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 