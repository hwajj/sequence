import io from 'socket.io-client';

console.log('Starting client...');

const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
