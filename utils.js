// 카드 덱을 섞는 함수
export function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// 덱을 생성하는 함수
export function createDeck() {
  // 카드 덱 생성 로직
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
  deck.push('JOKER');
  deck.push('JOKER'); // 두 장의 조커 추가
  return deck;
}

// 카드 덱에서 1장 꺼내기
export function popFromDeck(deck) {
  return deck.pop(); // 덱의 마지막 카드 반환
}


// 카드 나누기 함수
export function dealHands(deck) {
  const hands = [[], [], [], []];

  // 각 플레이어에게 6장씩 카드를 분배
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      hands[j].push(popFromDeck(deck)); // 카드 한 장씩 꺼내서 각 플레이어의 핸드에 추가
    }
  }

  return hands;
}


export const checkWin = (board) => {
  // 승리 조건 검사 로직
  const directions = [
    {x: 1, y: 0},  // 가로
    {x: 0, y: 1},  // 세로
    {x: 1, y: 1},  // 대각선 /
    {x: 1, y: -1}  // 대각선 \
  ];

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const color = board[row][col].occupiedColor;
      if (!color) continue;

      for (const {x, y} of directions) {
        let count = 0;
        let r = row, c = col;

        while (
          r >= 0 && r < 10 &&
          c >= 0 && c < 10 &&
          board[r][c].occupiedColor === color
          ) {
          count++;
          if (count === 5) return color;  // 승리 조건 충족
          r += x;
          c += y;
        }
      }
    }
  }

  return ''
}
