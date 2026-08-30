// frontend/src/pages/JoinScreen.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import ScreenShell from '../components/ScreenShell';

const JoinScreen = () => {
  const [nickname, setNickname] = useState(() => localStorage.getItem('nickname') || '');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState('online');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [connected, setConnected] = useState(socket.connected);
  const navigate = useNavigate();

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onConnectError = () => setConnected(false);
    setConnected(socket.connected);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  useEffect(() => {
    const onCreated = (data) => {
      setIsCreating(false);
      persistSession(data, nickname);
      navigate('/lobby', {
        state: {
          roomCode: data.roomCode,
          players: data.players,
          hostId: data.hostId,
          mode: data.mode
        }
      });
    };

    const onJoined = (data) => {
      setIsJoining(false);
      persistSession(data, nickname);
      const destination = data.status && data.status !== 'lobby' && data.status !== 'podium'
        ? '/game'
        : data.status === 'podium'
          ? '/podium'
          : '/lobby';
      navigate(destination, {
        state: {
          roomCode: data.roomCode,
          players: data.players,
          hostId: data.hostId,
          mode: data.mode,
          status: data.status,
          leagueGameNumber: data.leagueGameNumber
        }
      });
    };

    const onError = (data) => {
      setIsCreating(false);
      setIsJoining(false);
      alert(data.message || 'Something went wrong.');
    };

    socket.on('room-created', onCreated);
    socket.on('room-joined', onJoined);
    socket.on('error', onError);

    return () => {
      socket.off('room-created', onCreated);
      socket.off('room-joined', onJoined);
      socket.off('error', onError);
    };
  }, [navigate, nickname]);

  const persistSession = (data, name) => {
    localStorage.setItem('playerId', data.playerId);
    localStorage.setItem('hostId', data.hostId);
    localStorage.setItem('roomCode', data.roomCode);
    localStorage.setItem('nickname', name.trim());
  };

  const handleCreateRoom = () => {
    if (!nickname.trim()) {
      alert('Please enter a nickname.');
      return;
    }
    setIsCreating(true);
    socket.emit('create-room', {
      nickname: nickname.trim(),
      mode
    });
  };

  const handleJoinRoom = () => {
    if (!nickname.trim()) {
      alert('Please enter a nickname.');
      return;
    }
    if (!roomCode.trim()) {
      alert('Please enter a room code.');
      return;
    }
    setIsJoining(true);
    socket.emit('join-room', {
      nickname: nickname.trim(),
      roomCode: roomCode.trim(),
      playerId: localStorage.getItem('playerId') || undefined
    });
  };

  return (
    <ScreenShell compact>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <h1 className="font-display font-extrabold text-5xl text-center mb-2 bg-gradient-to-r from-bluff-gold via-bluff-purple to-bluff-pink bg-clip-text text-transparent">
            Bluff Hunt
          </h1>
          <p className="font-body text-bluff-muted text-center mb-2">
            Say Your Clue. Hide Your Truth.
          </p>
          <p className={`font-body text-center text-sm mb-6 ${connected ? 'text-bluff-green' : 'text-bluff-pink'}`}>
            {connected ? '✅ Connected to server' : '⏳ Connecting to server...'}
          </p>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            {/* Nickname Input */}
            <input
              type="text"
              placeholder="Enter your nickname..."
              className="w-full p-3 bg-black/30 border border-white/10 rounded-xl mb-4
                       focus:outline-none focus:ring-2 focus:ring-bluff-purple
                       font-body text-white placeholder:text-bluff-muted text-base"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={15}
            />

            {/* Room Code Input */}
            <input
              type="text"
              placeholder="Enter room code..."
              className="w-full p-3 bg-black/30 border border-white/10 rounded-xl mb-4
                       focus:outline-none focus:ring-2 focus:ring-bluff-purple
                       font-body text-white placeholder:text-bluff-muted text-base tracking-widest"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              inputMode="numeric"
            />

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                className={`flex-1 py-2 rounded-xl font-display font-semibold text-sm transition-all ${
                  mode === 'online'
                    ? 'bg-bluff-blue text-white'
                    : 'bg-white/5 text-bluff-muted hover:bg-white/10'
                }`}
                onClick={() => setMode('online')}
              >
                🌐 Online
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-xl font-display font-semibold text-sm transition-all ${
                  mode === 'offline'
                    ? 'bg-bluff-blue text-white'
                    : 'bg-white/5 text-bluff-muted hover:bg-white/10'
                }`}
                onClick={() => setMode('offline')}
              >
                🗣️ Offline
              </button>
            </div>

            {/* Join Button */}
            <button
              type="button"
              className="w-full py-3 bg-bluff-purple text-white font-display font-bold rounded-xl
                       hover:bg-bluff-purple-dark transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleJoinRoom}
              disabled={isJoining || isCreating || !connected}
            >
              {isJoining ? 'Joining...' : '🚀 Join Room'}
            </button>

            {/* Create Room Link */}
            <button
              type="button"
              className="w-full mt-3 py-2 text-bluff-gold font-display font-semibold text-sm
                       hover:text-white transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCreateRoom}
              disabled={isCreating || isJoining || !connected}
            >
              {isCreating ? 'Creating...' : '✨ Or Create a New Room'}
            </button>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
};

export default JoinScreen;