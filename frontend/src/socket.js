import { io } from 'socket.io-client';

const configured = (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || '').trim();
const socketUrl = configured || undefined;

const socket = io(socketUrl, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  transports: ['websocket', 'polling']
});

export function emitRejoin() {
  const playerId = localStorage.getItem('playerId');
  const roomCode = localStorage.getItem('roomCode');
  const nickname = localStorage.getItem('nickname');
  if (playerId && roomCode && nickname) {
    socket.emit('join-room', { playerId, roomCode, nickname });
  }
}

export function clearRoomSession() {
  localStorage.removeItem('playerId');
  localStorage.removeItem('roomCode');
  localStorage.removeItem('hostId');
}

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (err) => {
  console.error('Socket connect error:', err.message);
});

export default socket;
