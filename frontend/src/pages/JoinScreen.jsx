// frontend/src/pages/JoinScreen.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import ScreenShell from '../components/ScreenShell';
import { useToast } from '../components/Toast';

const AVATARS = ['🕵️', '🦁', '🍕', '🎭', '🚀', '🦊', '👑', '🎯', '⚡', '🥑'];

const JoinScreen = () => {
  const [nickname, setNickname] = useState(() => localStorage.getItem('nickname') || '');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('avatar') || '🕵️');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState('online');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [connected, setConnected] = useState(socket.connected);
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      persistSession(data, nickname, avatar);
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
      persistSession(data, nickname, avatar);
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
      showToast(data.message || 'Something went wrong.', 'error');
    };

    socket.on('room-created', onCreated);
    socket.on('room-joined', onJoined);
    socket.on('error', onError);

    return () => {
      socket.off('room-created', onCreated);
      socket.off('room-joined', onJoined);
      socket.off('error', onError);
    };
  }, [navigate, nickname, avatar, showToast]);

  const persistSession = (data, name, playerAvatar) => {
    localStorage.setItem('playerId', data.playerId);
    localStorage.setItem('hostId', data.hostId);
    localStorage.setItem('roomCode', data.roomCode);
    localStorage.setItem('nickname', name.trim());
    localStorage.setItem('avatar', playerAvatar);
  };

  const handleCreateRoom = () => {
    if (!nickname.trim()) {
      showToast('Please enter a nickname.', 'warning');
      return;
    }
    setIsCreating(true);
    socket.emit('create-room', {
      nickname: nickname.trim(),
      avatar,
      mode
    });
  };

  const handleJoinRoom = () => {
    if (!nickname.trim()) {
      showToast('Please enter a nickname.', 'warning');
      return;
    }
    if (!roomCode.trim()) {
      showToast('Please enter a 4-digit room code.', 'warning');
      return;
    }
    setIsJoining(true);
    socket.emit('join-room', {
      nickname: nickname.trim(),
      avatar,
      roomCode: roomCode.trim(),
      playerId: localStorage.getItem('playerId') || undefined
    });
  };

  return (
    <ScreenShell compact>
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="w-full max-w-md">
          {/* Glowing Game Title Header */}
          <div className="text-center mb-4">
            <h1 className="font-display font-black text-5xl tracking-tight bg-gradient-to-r from-amber-300 via-purple-400 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(139,92,246,0.35)]">
              BluffHunt
            </h1>
            <p className="font-body text-slate-400 text-xs sm:text-sm font-medium mt-1">
              Everyone Knows. One Pretends.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 mt-2">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-ping'}`} />
              <span className={`font-body text-[11px] font-semibold ${connected ? 'text-emerald-300' : 'text-rose-300'}`}>
                {connected ? 'Server Online' : 'Connecting to Server...'}
              </span>
            </div>
          </div>

          {/* Form Game Card */}
          <div className="card p-5 sm:p-6 bg-slate-900/85 border border-slate-700/60 shadow-2xl backdrop-blur-2xl">
            {/* Avatar Selector */}
            <div className="mb-4">
              <label className="block text-[11px] font-display font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Choose Your Avatar
              </label>
              <div className="flex justify-between items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setAvatar(emoji);
                      localStorage.setItem('avatar', emoji);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-95 ${
                      avatar === emoji
                        ? 'bg-purple-600 ring-2 ring-purple-300 shadow-glow-purple scale-110 z-10'
                        : 'bg-slate-950/70 border border-slate-700/50 hover:bg-slate-800/80 text-slate-300 opacity-75'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Nickname Input */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Enter your nickname..."
                className="w-full p-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl
                         focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
                         font-body text-white placeholder:text-slate-500 text-base transition-all"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={15}
              />
            </div>

            {/* Room Code Input */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Enter 4-digit code..."
                className="w-full p-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl
                         focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
                         font-body text-white placeholder:text-slate-500 text-base tracking-widest text-center uppercase transition-all"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                inputMode="numeric"
              />
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                className={`flex-1 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all active:scale-95 ${
                  mode === 'online'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                    : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:bg-slate-800/60'
                }`}
                onClick={() => setMode('online')}
              >
                🌐 Online Mode
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all active:scale-95 ${
                  mode === 'offline'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                    : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:bg-slate-800/60'
                }`}
                onClick={() => setMode('offline')}
              >
                🗣️ Offline Pass & Play
              </button>
            </div>

            {/* Join Button */}
            <button
              type="button"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-extrabold text-base rounded-xl
                       shadow-glow-purple active:scale-[0.98] transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              onClick={handleJoinRoom}
              disabled={isJoining || isCreating || !connected}
            >
              {isJoining ? 'Connecting to Room...' : '🚀 Join Game Room'}
            </button>

            {/* Create Room Button */}
            <button
              type="button"
              className="w-full mt-3 py-2.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-display font-bold text-sm rounded-xl
                       transition-all active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCreateRoom}
              disabled={isCreating || isJoining || !connected}
            >
              {isCreating ? 'Creating Room...' : '✨ Host a New Game Room'}
            </button>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
};

export default JoinScreen;