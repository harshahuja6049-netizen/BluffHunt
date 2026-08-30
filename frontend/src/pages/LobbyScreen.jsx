// frontend/src/pages/LobbyScreen.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import socket, { emitRejoin } from '../socket';
import ScreenShell from '../components/ScreenShell';
import LeaveButton from '../components/LeaveButton';
import JoinRequestModal from '../components/JoinRequestModal';
import { useToast } from '../components/Toast';

const LobbyScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    roomCode: stateRoomCode,
    players: initialPlayers,
    hostId: initialHostId,
    mode: initialMode
  } = location.state || {};

  const [roomCode] = useState(stateRoomCode || localStorage.getItem('roomCode') || '');
  const [players, setPlayers] = useState(initialPlayers || []);
  const [hostId, setHostId] = useState(initialHostId || localStorage.getItem('hostId') || '');
  const [mode, setMode] = useState(initialMode || 'online');
  const [copied, setCopied] = useState(false);
  const [pendingJoins, setPendingJoins] = useState([]);
  const [showJoinRequests, setShowJoinRequests] = useState(false);

  const currentPlayerId = localStorage.getItem('playerId');
  const isHost = currentPlayerId === hostId;
  const connectedPlayers = players.filter((p) => p.isConnected !== false);
  const canStart = isHost && connectedPlayers.length >= 3;

  useEffect(() => {
    if (!roomCode) {
      navigate('/');
      return;
    }

    const nickname = localStorage.getItem('nickname');
    if (nickname && currentPlayerId) {
      emitRejoin();
    }

    const onConnect = () => emitRejoin();

    const onPlayersUpdated = (data) => {
      setPlayers(data.players || []);
      setHostId(data.hostId);
      setPendingJoins(data.pendingJoins || []);
      if (data.hostId) localStorage.setItem('hostId', data.hostId);
      if (data.mode) setMode(data.mode);
    };

    const onJoinRequests = (data) => {
      setPendingJoins(data.pendingJoins || []);
      setShowJoinRequests(true);
    };

    const onModeChanged = (data) => setMode(data.mode);
    
    const onGameStarted = (data) => {
      navigate('/game', {
        state: {
          roomCode,
          players: data.players,
          hostId: data.hostId,
          mode: data.mode,
          leagueGameNumber: data.leagueGameNumber
        }
      });
    };

    const onHostChanged = (data) => {
      setHostId(data.hostId);
      localStorage.setItem('hostId', data.hostId);
    };

    const onLeagueReset = (data) => {
      setPlayers(data.players || []);
      setHostId(data.hostId);
      if (data.mode) setMode(data.mode);
    };

    const onError = (data) => showToast(data.message || 'Error', 'error');
    
    const onKicked = (data) => {
      showToast(data.message || 'You were removed by the Host.', 'error');
      localStorage.removeItem('playerId');
      localStorage.removeItem('roomCode');
      navigate('/');
    };
    
    const onLeftRoom = () => navigate('/');

    socket.on('connect', onConnect);
    socket.on('players-updated', onPlayersUpdated);
    socket.on('join-requests', onJoinRequests);
    socket.on('mode-changed', onModeChanged);
    socket.on('game-started', onGameStarted);
    socket.on('host-changed', onHostChanged);
    socket.on('league-reset', onLeagueReset);
    socket.on('error', onError);
    socket.on('kicked', onKicked);
    socket.on('left-room', onLeftRoom);

    return () => {
      socket.off('connect', onConnect);
      socket.off('players-updated', onPlayersUpdated);
      socket.off('join-requests', onJoinRequests);
      socket.off('mode-changed', onModeChanged);
      socket.off('game-started', onGameStarted);
      socket.off('host-changed', onHostChanged);
      socket.off('league-reset', onLeagueReset);
      socket.off('error', onError);
      socket.off('kicked', onKicked);
      socket.off('left-room', onLeftRoom);
    };
  }, [navigate, roomCode, currentPlayerId, initialPlayers, showToast]);

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      showToast(`Copied room code: ${roomCode}`, 'success', 2000);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(`Room code: ${roomCode}`, 'info', 4000);
    }
  };

  const handleChangeMode = (nextMode) => {
    if (!isHost) return;
    setMode(nextMode);
    socket.emit('change-mode', { mode: nextMode });
  };

  const handleStartGame = () => socket.emit('start-game');
  
  const handleKickPlayer = (playerId) => {
    if (window.confirm('Are you sure you want to kick this player?')) {
      socket.emit('kick-player', { targetPlayerId: playerId });
    }
  };

  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col min-h-0">
        {/* Room Code Header */}
        <div className="flex items-center justify-between p-3.5 mb-3 bg-slate-900/85 border border-slate-700/60 rounded-2xl shadow-xl shrink-0 backdrop-blur-xl">
          <div>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block">Game Room</span>
            <span className="font-display font-black text-2xl tracking-widest text-amber-300">#{roomCode}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyRoomCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 rounded-xl text-xs text-amber-300 font-display font-bold transition-all active:scale-95 shadow-sm"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-emerald-400" />
            ) : (
              <ClipboardIcon className="w-4 h-4 text-amber-300" />
            )}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        {/* Player List Card */}
        <div className="flex-1 min-h-0 card p-4 bg-slate-900/85 border border-slate-700/60 shadow-xl backdrop-blur-2xl flex flex-col">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
            <h3 className="font-display font-bold text-slate-300 text-xs uppercase tracking-wider">
              Lobby Players
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-display font-bold bg-purple-950/80 text-purple-300 border border-purple-800/50">
              {connectedPlayers.length}/10 Active
            </span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {players.map((player) => {
              const isConnected = player.isConnected !== false;
              const isThisPlayer = player.playerId === currentPlayerId;
              const isPlayerHost = player.playerId === hostId;
              const isWaiting = player.isWaitingForNextRound === true;

              return (
                <div
                  key={player.playerId}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isConnected
                      ? isThisPlayer
                        ? 'border-purple-500/40 bg-purple-950/30'
                        : 'border-slate-800/80 bg-slate-950/60'
                      : 'border-rose-900/40 bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0 p-1 bg-slate-800/60 rounded-lg border border-slate-700/50">{player.avatar || '🕵️'}</span>
                    <div className="truncate">
                      <span className="font-body font-bold text-white text-sm block truncate">
                        {player.nickname}
                        {isThisPlayer && <span className="text-purple-400 font-normal text-xs ml-1">(You)</span>}
                        {isWaiting && <span className="text-amber-400 text-xs ml-1">⏳ Spectating</span>}
                      </span>
                    </div>
                    {isPlayerHost && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-display font-black tracking-wider shrink-0">
                        👑 HOST
                      </span>
                    )}
                    {!isConnected && (
                      <span className="text-[10px] text-rose-400 font-body font-semibold shrink-0">(Away)</span>
                    )}
                  </div>
                  {isHost && !isThisPlayer && (
                    <button
                      type="button"
                      onClick={() => handleKickPlayer(player.playerId)}
                      className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300 rounded-lg text-xs font-display font-bold transition-all active:scale-95"
                    >
                      Kick
                    </button>
                  )}
                </div>
              );
            })}
            {players.length === 0 && (
              <p className="font-body text-slate-500 text-sm text-center py-6">
                Waiting for players to join...
              </p>
            )}
          </div>
        </div>

        {/* Mode Toggle (Host only) */}
        {isHost && (
          <div className="flex gap-2 mt-3 shrink-0">
            <button
              type="button"
              onClick={() => handleChangeMode('online')}
              className={`flex-1 py-2.5 rounded-xl font-display font-bold text-xs transition-all active:scale-95 ${
                mode === 'online'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              🌐 Online Mode
            </button>
            <button
              type="button"
              onClick={() => handleChangeMode('offline')}
              className={`flex-1 py-2.5 rounded-xl font-display font-bold text-xs transition-all active:scale-95 ${
                mode === 'offline'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              🗣️ Offline Pass & Play
            </button>
          </div>
        )}

        {/* Start Game Button (Host only) */}
        {isHost && (
          <button
            type="button"
            onClick={handleStartGame}
            disabled={!canStart}
            className={`w-full mt-3 py-3.5 rounded-xl font-display font-black text-base transition-all duration-150 active:scale-[0.98] ${
              canStart
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-glow-green cursor-pointer'
                : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            {connectedPlayers.length < 3
              ? `Waiting for ${3 - connectedPlayers.length} More Player(s)...`
              : '🚀 Start Match (Game 1 of 10)'}
          </button>
        )}

        {!isHost && (
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center mt-3 shrink-0">
            <p className="font-body text-slate-400 text-xs animate-pulse">
              ⏳ Waiting for the Host to start the match...
            </p>
          </div>
        )}

        {/* Leave Button */}
        <div className="mt-3 shrink-0">
          <LeaveButton />
        </div>
      </div>

      {/* Join Request Modal */}
      <JoinRequestModal requests={pendingJoins} isHost={isHost} />
    </ScreenShell>
  );
};

export default LobbyScreen;