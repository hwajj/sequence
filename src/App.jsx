import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Board from '@/components/Board';
import Hand from '@/components/Hand';
import './index.css';
import { BOARD } from "@/util/constants.js";

const socket = io('http://localhost:4000');

const App = () => {
  const [board, setBoard] = useState(BOARD);
  const [hand, setHand] = useState([]);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [winner, setWinner] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [playerIndex, setPlayerIndex] = useState(0);

  useEffect(() => {
    // 서버로부터 게임 상태 업데이트 수신
    socket.on('gameStateUpdate', (gameState) => {
      setBoard(gameState.board);
      setWinner(gameState.winner);
      setCurrentPlayer(gameState.currentPlayer);
       console.log(gameState)
    });

    // 서버로부터 플레이어 정보 수신
    socket.on('playerInfo', (info) => {
      console.log(info)
      setPlayerInfo(info);
      setHand(info.deck); // 플레이어의 핸드를 업데이트
    });

    // 게임 시작 이벤트 수신
    socket.emit('startGame');

    // 플레이어 정보 요청
    socket.emit('getPlayerInfo');

    return () => {
      socket.off('gameStateUpdate');
      socket.off('playerInfo');
    };
  }, [playerIndex]);

  const handleCardClick = (rowIndex, colIndex) => {
    socket.emit('placeCard', { rowIndex, colIndex, card: hand[0] }); // 예시로 첫 카드를 사용
    const newBoard = [...board];
    newBoard[rowIndex][colIndex].isOccupied = true;
    setBoard(newBoard);
  };

  const handleCardSelect = (index) => {
    console.log(`Selected card: ${hand[index].value}`);
    // 카드 선택 로직 추가 가능
  };

  return (
    <div className="text-center border-red flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Sequence Game</h1>
      {playerInfo && (
        <div>
          <h2>Player {playerInfo.playerNumber + 1}</h2>
          <p>Team Color: {playerInfo.team}</p>
          <p>Deck: {playerInfo.deck.map(card => card.value).join(', ')}</p>
        </div>
      )}
      <Board board={board} onCardClick={handleCardClick} />
      <Hand hand={hand} onCardSelect={handleCardSelect} />
    </div>
  );
};

export default App;
