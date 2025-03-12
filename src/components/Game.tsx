"use client";

import { useEffect, useState } from 'react';
import { Board } from './Board';
import { GameControls } from './GameControls';

export type Cell = number;
export type GameBoard = Cell[][];

const createEmptyBoard = (): GameBoard => {
  return Array(4).fill(null).map(() => Array(4).fill(0));
};

const addRandomTile = (board: GameBoard): GameBoard => {
  const emptyTiles = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyTiles.push({ x: i, y: j });
      }
    }
  }

  if (emptyTiles.length === 0) return board;

  const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[x][y] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
};

const rotateBoard = (board: GameBoard, times: number = 1): GameBoard => {
  let newBoard = board.map(row => [...row]);
  for (let i = 0; i < times; i++) {
    const rotated = Array(4).fill(null).map(() => Array(4).fill(0));
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        rotated[col][3 - row] = newBoard[row][col];
      }
    }
    newBoard = rotated;
  }
  return newBoard;
};

const moveLeft = (board: GameBoard): { board: GameBoard; score: number } => {
  let score = 0;
  const newBoard = board.map(row => {
    // 먼저 모든 숫자를 왼쪽으로 이동
    const filtered = row.filter(cell => cell !== 0);
    const merged = [];
    
    // 같은 숫자 병합
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        score += filtered[i] * 2;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }
    
    // 나머지 공간을 0으로 채움
    while (merged.length < 4) {
      merged.push(0);
    }
    
    return merged;
  });
  
  return { board: newBoard, score };
};

const Game = () => {
  const [board, setBoard] = useState<GameBoard>(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // 초기 보드 설정을 클라이언트 사이드에서만 실행
    const emptyBoard = createEmptyBoard();
    const initialBoard = addRandomTile(addRandomTile(emptyBoard));
    setBoard(initialBoard);
  }, []);

  const checkGameOver = (board: GameBoard): boolean => {
    // 빈 칸이 있는지 확인
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false;
      }
    }

    // 인접한 같은 숫자가 있는지 확인
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board[i][j];
        if (
          (i < 3 && board[i + 1][j] === current) ||
          (j < 3 && board[i][j + 1] === current)
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const moveBoard = (direction: 'up' | 'down' | 'left' | 'right') => {
    let rotations = 0;
    switch (direction) {
      case 'up':
        rotations = 3;
        break;
      case 'right':
        rotations = 2;
        break;
      case 'down':
        rotations = 1;
        break;
      case 'left':
      default:
        rotations = 0;
    }

    // 보드를 회전하여 모든 방향의 이동을 왼쪽 이동으로 변환
    let newBoard = rotateBoard(board, rotations);
    const { board: movedBoard, score: moveScore } = moveLeft(newBoard);
    newBoard = rotateBoard(movedBoard, (4 - rotations) % 4);

    // 보드가 변경되었는지 확인
    const boardChanged = JSON.stringify(board) !== JSON.stringify(newBoard);

    if (boardChanged) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(prevScore => prevScore + moveScore);

      // 게임 오버 체크
      if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    const emptyBoard = createEmptyBoard();
    setBoard(addRandomTile(addRandomTile(emptyBoard)));
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-[650px] mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-6xl sm:text-7xl font-bold text-[#776e65] text-center sm:text-left">2048</h1>
            <p className="text-xl sm:text-2xl text-[#776e65] mt-2 text-center sm:text-left">숫자를 합쳐 2048을 만드세요!</p>
          </div>
          <div className="flex sm:flex-col gap-4">
            <div className="bg-[#bbada0] rounded-xl p-4 text-center min-w-[120px] sm:min-w-[150px]">
              <div className="text-xl sm:text-2xl text-[#eee4da] font-semibold">점수</div>
              <div className="text-3xl sm:text-5xl text-white font-bold">{score}</div>
            </div>
            <button
              onClick={resetGame}
              className="bg-[#8f7a66] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-[#7f6a56] transition-colors font-bold text-xl sm:text-2xl"
            >
              새 게임
            </button>
          </div>
        </div>
      </div>
      <Board board={board} />
      <GameControls onMove={moveBoard} />
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl text-center max-w-[400px] w-full">
            <h2 className="text-5xl font-bold text-[#776e65] mb-4">게임 오버!</h2>
            <p className="text-3xl text-[#776e65] mb-6">최종 점수: {score}</p>
            <button
              onClick={resetGame}
              className="bg-[#8f7a66] text-white px-6 py-3 rounded-xl hover:bg-[#7f6a56] transition-colors font-bold text-2xl"
            >
              다시 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game; 