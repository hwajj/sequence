import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // 서버의 주소와 포트

socket.on('connect', () => {
  console.log('Connected to server'); // 클라이언트가 서버에 연결되면 출력됩니다
});

socket.on('disconnect', () => {
  console.log('Disconnected from server'); // 클라이언트가 서버와 연결이 끊어지면 출력됩니다
});
