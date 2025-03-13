"use client";

import { useState, useEffect } from 'react';
import type { Card, Deck } from './gameTypes';
import { createDeck, drawCard, calculateHandValue } from './utils';
import Link from 'next/link';

export const BlackjackGame = () => {
  const [deck, setDeck] = useState<Deck>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [message, setMessage] = useState<string>('');
  const [bet, setBet] = useState<number>(10);
  const [chips, setChips] = useState<number>(1000);

  const initializeGame = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('betting');
    setMessage('베팅 금액을 선택하세요');
  };

  const startRound = () => {
    if (chips < bet) {
      setMessage('칩이 부족합니다!');
      return;
    }

    setChips(prev => prev - bet);
    const { cards: playerCards, remainingDeck: deck1 } = drawCard(deck, 2);
    const { cards: dealerCards, remainingDeck: deck2 } = drawCard(deck1, 1);

    dealerCards[0] = { ...dealerCards[0], hidden: false };

    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setDeck(deck2);
    setGameStatus('playing');
  };

  const hit = () => {
    const { cards, remainingDeck } = drawCard(deck, 1);
    const newHand = [...playerHand, ...cards];
    setPlayerHand(newHand);
    setDeck(remainingDeck);

    const value = calculateHandValue(newHand);
    if (value > 21) {
      setMessage('버스트! 게임 오버');
      setGameStatus('gameOver');
    }
  };

  const stand = async () => {
    setGameStatus('dealerTurn');
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];

    while (calculateHandValue(currentDealerHand) < 17) {
      const { cards, remainingDeck } = drawCard(currentDeck, 1);
      currentDealerHand = [...currentDealerHand, ...cards];
      currentDeck = remainingDeck;
    }

    setDealerHand(currentDealerHand);
    setDeck(currentDeck);

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(currentDealerHand);

    if (dealerValue > 21) {
      setMessage('딜러 버스트! 승리!');
      setChips(prev => prev + bet * 2);
    } else if (dealerValue > playerValue) {
      setMessage('딜러 승리!');
    } else if (playerValue > dealerValue) {
      setMessage('플레이어 승리!');
      setChips(prev => prev + bet * 2);
    } else {
      setMessage('무승부!');
      setChips(prev => prev + bet);
    }

    setGameStatus('gameOver');
  };
/*
  const getCardColor = (suit: string) => {
    return suit === 'HEART' || suit === 'DIAMOND' ? 'text-red-600' : 'text-gray-900';
  };

  const getCardBg = (suit: string) => {
    return suit === 'HEART' || suit === 'DIAMOND' ? 'bg-red-100' : 'bg-gray-100';
  };
*/
  const getSuitText = (suit: string) => {
    switch (suit) {
      case 'HEART': return '♥';
      case 'DIAMOND': return '♦';
      case 'CLUB': return '♣';
      case 'SPADE': return '♠';
      default: return '';
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="w-full max-w-[900px] mx-auto text-center bg-[#004d40] rounded-3xl p-8 shadow-2xl border-4 border-[#00796b]">
      <div className="absolute top-4 left-4">
        <Link href="/" className="px-6 py-3 bg-[#b71c1c] text-white rounded-xl hover:bg-[#d32f2f] transition-all duration-200 shadow-lg text-4xl font-bold border-2 border-[#ffcdd2] flex items-center">
          <span className="mr-2">←</span> 메인으로
        </Link>
      </div>

      <div className="mb-12 mt-10">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-[#00796b] px-10 py-5 rounded-2xl shadow-lg border-2 border-[#b2dfdb]">
            <h2 className="text-6xl font-bold text-yellow-300">칩: {chips.toLocaleString()}</h2>
          </div>
          {gameStatus === 'betting' && (
            <div className="bg-[#00796b] px-10 py-5 rounded-2xl shadow-lg border-2 border-[#b2dfdb]">
              <span className="text-6xl font-bold text-yellow-300">베팅: {bet.toLocaleString()}</span>
            </div>
          )}
        </div>
        {gameStatus === 'betting' && (
          <div className="space-y-8">
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setBet(Math.max(10, bet - 10))}
                className="px-10 py-6 bg-[#e53935] text-white rounded-2xl hover:bg-[#c62828] transition-all duration-200 shadow-lg text-4xl font-bold border-2 border-[#ffcdd2] hover:scale-105"
              >
                -10
              </button>
              <button
                onClick={() => setBet(Math.min(chips, bet + 10))}
                className="px-10 py-6 bg-[#43a047] text-white rounded-2xl hover:bg-[#2e7d32] transition-all duration-200 shadow-lg text-4xl font-bold border-2 border-[#c8e6c9] hover:scale-105"
              >
                +10
              </button>
            </div>
            <button
              onClick={startRound}
              className="w-full px-8 py-6 bg-[#ffc107] text-[#212121] rounded-2xl hover:bg-[#ffa000] transition-all duration-200 shadow-lg text-5xl font-bold border-2 border-[#ffecb3] hover:scale-105"
            >
              게임 시작
            </button>
          </div>
        )}
      </div>

      {gameStatus !== 'betting' && (
        <div className="relative">
          <div className="mb-16">
            <h3 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>딜러의 카드</h3>
            <div className="flex flex-row justify-start items-center gap-16 overflow-x-auto pb-6 px-8 min-h-[240px] w-full bg-[#00695c] rounded-xl p-6 border-2 border-[#b2dfdb]">
              {dealerHand.map((card, i) => (
                <div 
                  key={i} 
                  style={{
                    width: '200px',
                    height: '280px',
                    backgroundColor: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '#ffebee' : '#f5f5f5',
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    position: 'relative',
                    margin: '0 8px',
                    flexShrink: 0,
                    border: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '3px solid #d32f2f' : '3px solid #212121'
                  }}
                >
                  {card.hidden ? (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: '#1565c0',
                      borderRadius: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '96px',
                      fontWeight: 'bold',
                      backgroundImage: 'repeating-linear-gradient(45deg, #1565c0, #1565c0 10px, #0d47a1 10px, #0d47a1 20px)'
                    }}>
                      ?
                    </div>
                  ) : (
                    <>
                      <div style={{
                        color: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '#d32f2f' : '#212121',
                        fontSize: '48px',
                        fontWeight: 'bold',
                        textAlign: 'left',
                        marginBottom: '8px'
                      }}>
                        {card.value}
                      </div>
                      
                      <div style={{
                        color: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '#d32f2f' : '#212121',
                        fontSize: '96px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getSuitText(card.suit)}
                      </div>
                      
                      <div style={{
                        color: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '#d32f2f' : '#212121',
                        fontSize: '48px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        transform: 'rotate(180deg)',
                        marginTop: '8px'
                      }}>
                        {card.value}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h3 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>내 카드</h3>
            <div className="flex flex-row justify-start items-center gap-16 overflow-x-auto pb-6 px-8 min-h-[240px] w-full bg-[#00695c] rounded-xl p-6 border-2 border-[#b2dfdb]">
              {playerHand.map((card, i) => (
                <div 
                  key={i} 
                  style={{
                    width: '200px',
                    height: '280px',
                    backgroundColor: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '#ffebee' : '#f5f5f5',
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    position: 'relative',
                    margin: '0 8px',
                    flexShrink: 0,
                    border: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '3px solid #d32f2f' : '3px solid #212121'
                  }}
                >
                  <div style={{
                    color: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '#d32f2f' : '#212121',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    marginBottom: '8px'
                  }}>
                    {card.value}
                  </div>
                  
                  <div style={{
                    color: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '#d32f2f' : '#212121',
                    fontSize: '96px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getSuitText(card.suit)}
                  </div>
                  
                  <div style={{
                    color: card.suit === 'HEART' || card.suit === 'DIAMOND' ? '#d32f2f' : '#212121',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    transform: 'rotate(180deg)',
                    marginTop: '8px'
                  }}>
                    {card.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {gameStatus === 'playing' && (
            <div className="mt-8 flex justify-center gap-12 bg-[#004d40] px-10 py-8 rounded-2xl border-4 border-[#b2dfdb] shadow-2xl w-full max-w-[900px] mx-auto">
              <button
                onClick={hit}
                style={{ 
                  padding: '1.5rem 2rem', 
                  backgroundColor: '#f44336', 
                  color: 'white', 
                  borderRadius: '1rem', 
                  fontSize: '3rem', 
                  fontWeight: 'bold', 
                  minWidth: '200px',
                  width: '200px',
                  border: '3px solid #ffcdd2',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  letterSpacing: '0.1em'
                }}
                className="hover:bg-[#d32f2f]"
              >
                히트
              </button>
              <button
                onClick={stand}
                style={{ 
                  padding: '1.5rem 2rem', 
                  backgroundColor: '#2196f3', 
                  color: 'white', 
                  borderRadius: '1rem', 
                  fontSize: '3rem', 
                  fontWeight: 'bold', 
                  minWidth: '280px',
                  width: '280px',
                  border: '3px solid #bbdefb',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap'
                }}
                className="hover:bg-[#1976d2]"
              >
                스탠드
              </button>
            </div>
          )}

          {gameStatus === 'gameOver' && (
            <div className="space-y-8">
              <div className="bg-[#00796b] px-10 py-8 rounded-2xl inline-block shadow-lg border-2 border-[#b2dfdb]">
                <p className="text-6xl font-bold text-yellow-300">{message}</p>
              </div>
              <div className="flex gap-6 justify-center">
                <button
                  onClick={initializeGame}
                  style={{
                    padding: '1.5rem 3rem',
                    backgroundColor: '#ffc107',
                    color: '#212121',
                    borderRadius: '1rem',
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    minWidth: '250px',
                    border: '3px solid #ffecb3',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover:bg-[#ffa000] hover:scale-105"
                >
                  새 게임
                </button>
                <Link 
                  href="/"
                  style={{
                    padding: '1.5rem 3rem',
                    backgroundColor: '#b71c1c',
                    color: 'white',
                    borderRadius: '1rem',
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    minWidth: '250px',
                    border: '3px solid #ffcdd2',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.2s ease',
                    display: 'inline-block',
                    textAlign: 'center'
                  }}
                  className="hover:bg-[#d32f2f] hover:scale-105"
                >
                  메인으로
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 