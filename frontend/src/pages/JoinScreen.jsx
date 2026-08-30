// frontend/src/pages/JoinScreen.jsx

import { useEffect, useState, useRef } from 'react';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [connected, setConnected] = useState(socket.connected);
  
  const navigate = useNavigate();
  const { showToast } = useToast();
  const actionTimeoutRef = useRef(null);

  // Connection status listener
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

  // Room lifecycle socket listeners
  useEffect(() => {
    const clearPendingTimeout = () => {
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current);
        actionTimeoutRef.current = null;
      }
    };

    const onCreated = (data) => {
      clearPendingTimeout();
      setIsCreating(false);
      setErrorMessage('');
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
      clearPendingTimeout();
      setIsJoining(false);
      setIsPendingApproval(false);
      setErrorMessage('');
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

    const onJoinPending = (data) => {
      clearPendingTimeout();
      setIsJoining(false);
      setIsPendingApproval(true);
      setErrorMessage('');
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('roomCode', data.roomCode);
      showToast(data.message || 'Waiting for the host to admit you to the game...', 'info', 6000);
    };

    const onJoinDenied = (data) => {
      clearPendingTimeout();
      setIsJoining(false);
      setIsPendingApproval(false);
      const msg = data.message || 'The host denied your request to join.';
      setErrorMessage(msg);
      showToast(msg, 'error', 5000);
      localStorage.removeItem('playerId');
      localStorage.removeItem('roomCode');
    };

    const onJoinAdmitted = (data) => {
      clearPendingTimeout();
      setIsJoining(false);
      setIsPendingApproval(false);
      setErrorMessage('');
      persistSession(data, nickname, avatar);
      navigate('/game', {
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
      clearPendingTimeout();
      setIsCreating(false);
      setIsJoining(false);
      setIsPendingApproval(false);
      const msg = data?.message || 'Unable to join room. Please check the code.';
      setErrorMessage(msg);
      showToast(msg, 'error', 4000);
    };

    socket.on('room-created', onCreated);
    socket.on('room-joined', onJoined);
    socket.on('join-pending', onJoinPending);
    socket.on('join-denied', onJoinDenied);
    socket.on('join-admitted', onJoinAdmitted);
    socket.on('error', onError);
    socket.on('game-error', onError);

    return () => {
      clearPendingTimeout();
      socket.off('room-created', onCreated);
      socket.off('room-joined', onJoined);
      socket.off('join-pending', onJoinPending);
      socket.off('join-denied', onJoinDenied);
      socket.off('join-admitted', onJoinAdmitted);
      socket.off('error', onError);
      socket.off('game-error', onError);
    };
  }, [navigate, nickname, avatar, showToast]);

  const persistSession = (data, name, playerAvatar) => {
    localStorage.setItem('playerId', data.playerId);
    localStorage.setItem('hostId', data.hostId);
    localStorage.setItem('roomCode', data.roomCode);
    localStorage.setItem('nickname', name.trim());
    localStorage.setItem('avatar', playerAvatar);
  };

  const setSafetyTimeout = (type) => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      setIsCreating(false);
      setIsJoining(false);
      const msg = `${type} timed out. Please verify your connection or room code.`;
      setErrorMessage(msg);
      showToast(msg, 'warning', 4000);
    }, 8000);
  };

  const handleCreateRoom = () => {
    setErrorMessage('');
    if (!nickname.trim()) {
      setErrorMessage('Please enter your nickname.');
      showToast('Please enter your nickname.', 'warning');
      return;
    }
    setIsCreating(true);
    setSafetyTimeout('Creating room');
    socket.emit('create-room', {
      nickname: nickname.trim(),
      avatar,
      mode
    });
  };

  const handleJoinRoom = () => {
    setErrorMessage('');
    if (!nickname.trim()) {
      setErrorMessage('Please enter your nickname.');
      showToast('Please enter your nickname.', 'warning');
      return;
    }
    if (!roomCode.trim() || roomCode.trim().length !== 4) {
      setErrorMessage('Please enter a valid 4-digit room code.');
      showToast('Please enter a valid 4-digit room code.', 'warning');
      return;
    }

    setIsJoining(true);
    setSafetyTimeout('Joining room');

    // Only send existing playerId if reconnecting to the EXACT same room code
    const storedRoom = localStorage.getItem('roomCode');
    const existingPlayerId = storedRoom === roomCode.trim() ? localStorage.getItem('playerId') : undefined;

    socket.emit('join-room', {
      nickname: nickname.trim(),
      avatar,
      roomCode: roomCode.trim(),
      playerId: existingPlayerId
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
            {/* Inline Error Alert if any */}
            {errorMessage && (
              <div className="p-3 mb-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs font-body flex items-center gap-2 animate-bounce-short">
                <span className="text-base shrink-0">⚠️</span>
                <span className="flex-1">{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="text-rose-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Pending Host Approval Alert */}
            {isPendingApproval && (
              <div className="p-3 mb-3 bg-amber-950/80 border border-amber-500/50 rounded-xl text-amber-200 text-xs font-body flex items-center gap-2">
                <span className="text-base shrink-0 animate-spin">⏳</span>
                <span className="flex-1">Join request sent! Waiting for the Host to admit you...</span>
              </div>
            )}

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
                onChange={(e) => {
                  setNickname(e.target.value);
                  setErrorMessage('');
                }}
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
                onChange={(e) => {
                  setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 4));
                  setErrorMessage('');
                }}
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