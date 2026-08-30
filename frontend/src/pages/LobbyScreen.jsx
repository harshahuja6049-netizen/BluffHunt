// frontend/src/pages/LobbyScreen.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import socket, { emitRejoin } from '../socket';
import ScreenShell from '../components/ScreenShell';
import LeaveButton from '../components/LeaveButton';
import JoinRequestModal from '../components/JoinRequestModal';

const LobbyScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

    const onError = (data) => alert(data.message);
    
    const onKicked = (data) => {
      alert(data.message);
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
  }, [navigate, roomCode, currentPlayerId, initialPlayers]);

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(`Room code: ${roomCode}`);
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
      <div className="flex-1 flex flex-col">
        {/* Room Code Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="font-display font-bold text-xl text-white">
            Room #{roomCode}
          </h2>
          <button
            type="button"
            onClick={handleCopyRoomCode}
            className="flex items-center gap-1 text-sm text-bluff-gold font-display font-semibold hover:text-white transition-colors"
          >
            {copied ? (
              <CheckIcon className="w-5 h-5 text-bluff-green" />
            ) : (
              <ClipboardIcon className="w-5 h-5" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Player List */}
        <div className="flex-1 min-h-0">
          <h3 className="font-body font-semibold text-bluff-muted text-sm mb-2">
            Players ({connectedPlayers.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {players.map((player) => {
              const isConnected = player.isConnected !== false;
              const isThisPlayer = player.playerId === currentPlayerId;
              const isPlayerHost = player.playerId === hostId;
              const isWaiting = player.isWaitingForNextRound === true;

              return (
                <div
                  key={player.playerId}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    isConnected
                      ? 'border-white/10 bg-white/5'
                      : 'border-bluff-pink/30 bg-bluff-pink/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-body font-semibold text-white">
                      {player.nickname}
                      {isThisPlayer && ' (You)'}
                      {isWaiting && ' ⏳'}
                    </span>
                    {isPlayerHost && <span className="text-bluff-gold text-lg">👑</span>}
                    {!isConnected && (
                      <span className="text-xs text-bluff-pink font-body">(Disconnected)</span>
                    )}
                  </div>
                  {isHost && !isThisPlayer && (
                    <button
                      type="button"
                      onClick={() => handleKickPlayer(player.playerId)}
                      className="text-bluff-pink hover:text-pink-400 font-body text-sm font-semibold transition-colors"
                    >
                      ✕ Kick
                    </button>
                  )}
                </div>
              );
            })}
            {players.length === 0 && (
              <p className="font-body text-bluff-muted text-sm text-center py-4">
                Waiting for players to join...
              </p>
            )}
          </div>
        </div>

        {/* Mode Toggle (Host only) */}
        {isHost && (
          <div className="flex gap-2 mt-4 shrink-0">
            <button
              type="button"
              onClick={() => handleChangeMode('online')}
              className={`flex-1 py-2 rounded-xl font-display font-semibold text-sm transition-all ${
                mode === 'online'
                  ? 'bg-bluff-blue text-white'
                  : 'bg-white/5 text-bluff-muted hover:bg-white/10'
              }`}
            >
              🌐 Online
            </button>
            <button
              type="button"
              onClick={() => handleChangeMode('offline')}
              className={`flex-1 py-2 rounded-xl font-display font-semibold text-sm transition-all ${
                mode === 'offline'
                  ? 'bg-bluff-blue text-white'
                  : 'bg-white/5 text-bluff-muted hover:bg-white/10'
              }`}
            >
              🗣️ Offline
            </button>
          </div>
        )}

        {/* Start Game Button (Host only) */}
        {isHost && (
          <button
            type="button"
            onClick={handleStartGame}
            disabled={!canStart}
            className={`w-full mt-4 py-3 rounded-xl font-display font-bold text-white transition-all ${
              canStart
                ? 'bg-bluff-purple hover:bg-bluff-purple-dark'
                : 'bg-white/10 text-bluff-muted cursor-not-allowed'
            }`}
          >
            {connectedPlayers.length < 3
              ? `Need ${3 - connectedPlayers.length} more player(s)`
              : '🚀 Start Game'}
          </button>
        )}

        {!isHost && (
          <p className="text-center font-body text-bluff-muted text-sm mt-4">
            Waiting for the Host to start the game...
          </p>
        )}

        {/* Leave Button */}
        <div className="mt-4 shrink-0">
          <LeaveButton />
        </div>
      </div>

      {/* Join Request Modal */}
      <JoinRequestModal requests={pendingJoins} isHost={isHost} />
    </ScreenShell>
  );
};

export default LobbyScreen;