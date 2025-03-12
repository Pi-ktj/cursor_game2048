/**
 * 블랙잭 게임에 사용되는 타입 정의
 */

export type Suit = 'SPADE' | 'HEART' | 'DIAMOND' | 'CLUB';
export type Value = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  value: Value;
  hidden?: boolean;
}

export type Deck = Card[]; 