"use client";

import Game from '@/components/Game';
import Link from 'next/link';

export default function Game2048Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ef] p-4">
      <div className="w-full max-w-[1200px] mx-auto">
        <Link 
          href="/"
          className="inline-block mb-8 text-[#776e65] hover:text-[#574e4b] transition-colors"
        >
          <span className="text-2xl">←</span> 메인으로 돌아가기
        </Link>
        <Game />
      </div>
    </div>
  );
} 