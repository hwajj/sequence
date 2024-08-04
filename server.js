import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { createDeck, shuffleDeck, dealHands } from './utils.js';
import { BOARD } from './constants.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 게임 상태 초기화
let gameState = {
  board: BOARD,
  deck: shuffleDeck(createDeck()), // 초기화
  winner: '',
  currentPlayer: 0,
  playerInfo: []
};

// 클라이언트 연결 처리
io.on('connection', (socket) => {
  console.log('A user connected');

  const playerIndex = gameState.playerInfo.length;
  const playerColor = playerIndex % 2 === 0 ? 'black' : 'white';

  let hands = [];
  if (playerIndex === 0) {
    // 첫 플레이어가 연결될 때 덱을 섞고 카드 나누기

    let deck = shuffleDeck(createDeck());
    hands = dealHands(deck);

    console.log(hands)
    gameState.deck = deck; // 업데이트된 덱 저장

    // 각 플레이어의 핸드 설정
    gameState.playerInfo = hands.map((hand, index) => ({
      playerNumber: index,
      team: index % 2 === 0 ? 'black' : 'white',
      deck: hand
    }));
  } else {
    // 다른 플레이어가 연결될 때는 핸드만 빈 배열로 설정
    hands = Array.from({ length: 6 }, () => []); // 빈 핸드 배열
  }

  // 새로운 플레이어의 정보 설정
  const playerInfo = {
    playerNumber: playerIndex,
    team: playerColor,
    deck: gameState.playerInfo[playerIndex]?.deck || [] // 빈 배열로 초기화
  };

  // 새로운 플레이어의 정보 추가
  if (playerIndex > 0) {
    gameState.playerInfo.push(playerInfo);
  }

  // 클라이언트에게 자신의 정보 전송
  socket.emit('playerInfo', playerInfo);
  // 게임 상태 전송
  socket.emit('gameStateUpdate', {
    board: gameState.board,
    winner: gameState.winner,
    currentPlayer: gameState.currentPlayer
  });

  // 클라이언트가 카드를 놓는 요청 처리
  socket.on('placeCard', ({ rowIndex, colIndex, card }) => {
    if (gameState.board[rowIndex][colIndex].occupiedColor === '') {
      gameState.board[rowIndex][colIndex].occupiedColor = gameState.playerInfo[gameState.currentPlayer].team;
      gameState.currentPlayer = (gameState.currentPlayer + 1) % 4;

      const cardIndex = gameState.playerInfo[gameState.currentPlayer].deck.indexOf(card);
      if (cardIndex > -1) {
        gameState.playerInfo[gameState.currentPlayer].deck.splice(cardIndex, 1);
        io.emit('gameStateUpdate', {
          board: gameState.board,
          winner: gameState.winner,
          currentPlayer: gameState.currentPlayer
        });
      }
    }
  });

  // 플레이어 연결 종료 처리
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    gameState.playerInfo = gameState.playerInfo.filter(player => player.playerNumber !== playerIndex);
    io.emit('playerInfo', gameState.playerInfo); // 모든 클라이언트에게 업데이트된 플레이어 정보 전송
  });
});

// 서버 포트 설정
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
