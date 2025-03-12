"use client";

import Link from 'next/link';
import { BlackjackGame } from '@/components/Blackjack/Game';

export default function BlackjackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1012] to-[#1a1b1f] p-8">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-lg"
          >
            <span className="text-2xl">←</span>
            <span>메인으로 돌아가기</span>
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">블랙잭</h1>
          <div className="w-[180px]"></div>
        </div>
        <BlackjackGame />
      </div>
    </div>
  );
} 