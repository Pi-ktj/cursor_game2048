"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8ef] p-4">
      <h1 className="text-5xl sm:text-6xl font-bold text-[#776e65] mb-8">커서 게임즈</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[800px] w-full">
        <Link href="/2048" 
          className="bg-[#bbada0] rounded-xl p-6 text-center hover:bg-[#a59a90] transition-colors group">
          <h2 className="text-4xl font-bold text-white mb-4">2048</h2>
          <p className="text-[#eee4da] text-lg">숫자를 합쳐 2048을 만드세요!</p>
        </Link>
        <Link href="/blackjack"
          className="bg-[#2d5a27] rounded-xl p-6 text-center hover:bg-[#1d4a17] transition-colors group">
          <h2 className="text-4xl font-bold text-white mb-4">블랙잭</h2>
          <p className="text-[#98c194] text-lg">딜러와 승부를 겨루세요!</p>
        </Link>
      </div>
    </div>
  );
}
