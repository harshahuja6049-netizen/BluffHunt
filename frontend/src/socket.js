import { io } from 'socket.io-client';

// ✅ Directly use VITE_API_URL (already set in Vercel)
const socketUrl = import.meta.env.VITE_API_URL || undefined;

let hasJoinedRoom = false;

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
  if (playerId && roomCode && nickname && socket.connected && !hasJoinedRoom) {
    hasJoinedRoom = true;
    socket.emit('join-room', { playerId, roomCode, nickname });
  }
}

export function setHasJoinedRoom(value) {
  hasJoinedRoom = value;
}

export function clearRoomSession() {
  localStorage.removeItem('playerId');
  localStorage.removeItem('roomCode');
  localStorage.removeItem('hostId');
  hasJoinedRoom = false;
}

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
  hasJoinedRoom = false;
});

socket.on('connect_error', (err) => {
  console.error('Socket connect error:', err.message);
});

export default socket;