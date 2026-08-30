// frontend/src/pages/GameScreen.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket, { emitRejoin } from '../socket';
import ScreenShell from '../components/ScreenShell';
import LeaveButton from '../components/LeaveButton';
import { soundEffects } from '../utils/soundEffects';
import { useToast } from '../components/Toast';

const GameScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    roomCode: stateRoomCode,
    players: initialPlayers,
    hostId: initialHostId,
    mode: initialMode,
    leagueGameNumber: initialGame
  } = location.state || {};

  const [roomCode] = useState(stateRoomCode || localStorage.getItem('roomCode') || '');
  const [players, setPlayers] = useState(initialPlayers || []);
  const [hostId, setHostId] = useState(initialHostId || localStorage.getItem('hostId') || '');
  const [mode, setMode] = useState(initialMode || 'online');
  const [phase, setPhase] = useState(location.state?.status || 'reveal');
  const [currentWord, setCurrentWord] = useState('');
  const [isImposter, setIsImposter] = useState(false);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [clue, setClue] = useState('');
  const [clues, setClues] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedVote, setSelectedVote] = useState('');
  const [roundResults, setRoundResults] = useState(null);
  const [currentGame, setCurrentGame] = useState(initialGame || 1);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentSpeakerNickname, setCurrentSpeakerNickname] = useState('');
  const [speakerQueue, setSpeakerQueue] = useState([]);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [isReadyToVote, setIsReadyToVote] = useState(false);
  const [votedCount, setVotedCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState((initialPlayers || []).length);
  const [isRevote, setIsRevote] = useState(false);
  const [tiedPlayerIds, setTiedPlayerIds] = useState([]);
  const [revoteMessage, setRevoteMessage] = useState('');
  const [showKickDrawer, setShowKickDrawer] = useState(false);
  const [isWaitingSpectator, setIsWaitingSpectator] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundEffects.getMuted());

  const currentPlayerId = localStorage.getItem('playerId');
  const isHost = currentPlayerId === hostId;

  const updateSpeakerTurn = (queue, index, playerList) => {
    if (!queue || !queue.length) {
      setIsMyTurn(false);
      setCurrentSpeakerNickname('');
      return;
    }
    const activeSpeakerId = queue[index];
    setIsMyTurn(activeSpeakerId === currentPlayerId);
    const speaker = (playerList || players).find((p) => p.playerId === activeSpeakerId);
    setCurrentSpeakerNickname(speaker ? speaker.nickname : 'Someone');
  };

  useEffect(() => {
    if (!roomCode) {
      navigate('/');
      return undefined;
    }

    const nickname = localStorage.getItem('nickname');
    if (nickname && currentPlayerId) {
      emitRejoin();
    }

    const onConnect = () => emitRejoin();

    const onGameState = (data) => {
      if (data.status) setPhase(data.status);
      if (data.players) {
        setPlayers(data.players);
        const activeCount = data.players.filter((p) => p.isConnected !== false && !p.isWaitingForNextRound).length;
        setTotalPlayers(activeCount);
      }
      if (data.hostId) {
        setHostId(data.hostId);
        localStorage.setItem('hostId', data.hostId);
      }
      if (data.mode) setMode(data.mode);
      if (data.leagueGameNumber) setCurrentGame(data.leagueGameNumber);
      if (data.word) setCurrentWord(data.word);
      if (typeof data.isImposter === 'boolean') setIsImposter(data.isImposter);
      if (typeof data.waiting === 'boolean') setIsWaitingSpectator(data.waiting);
      if (Array.isArray(data.clues) && data.clues.length) setClues(data.clues);
      if (typeof data.hasAcknowledgedWord === 'boolean') setHasAcknowledged(data.hasAcknowledgedWord);
      if (typeof data.hasVoted === 'boolean') setHasVoted(data.hasVoted);
      if (typeof data.readyCount === 'number') setReadyCount(data.readyCount);
      if (typeof data.isRevote === 'boolean') setIsRevote(data.isRevote);
      if (Array.isArray(data.tiedPlayerIds)) setTiedPlayerIds(data.tiedPlayerIds);

      if (data.speakerQueue) {
        setSpeakerQueue(data.speakerQueue);
        setCurrentSpeakerIndex(data.currentSpeakerIndex || 0);
        updateSpeakerTurn(data.speakerQueue, data.currentSpeakerIndex || 0, data.players);
      }
    };

    const onYourWord = (data) => {
      setCurrentWord(data.word || '');
      setIsImposter(Boolean(data.isImposter));
      if (data.leagueGameNumber) setCurrentGame(data.leagueGameNumber);
    };

    const onPhaseChanged = (data) => {
      setPhase(data.status);
      if (data.players) {
        setPlayers(data.players);
        const activeCount = data.players.filter((p) => p.isConnected !== false && !p.isWaitingForNextRound).length;
        setTotalPlayers(activeCount);
      }
      if (data.mode) setMode(data.mode);
      if (data.leagueGameNumber) setCurrentGame(data.leagueGameNumber);
      if (typeof data.isRevote === 'boolean') setIsRevote(data.isRevote);
      if (Array.isArray(data.tiedPlayerIds)) setTiedPlayerIds(data.tiedPlayerIds);

      if (data.status === 'clue') {
        const queue = data.speakerQueue || [];
        const index = data.currentSpeakerIndex || 0;
        setSpeakerQueue(queue);
        setCurrentSpeakerIndex(index);
        updateSpeakerTurn(queue, index, data.players);
      }

      if (data.status === 'discussion') {
        setIsMyTurn(false);
        setReadyCount(0);
        setIsReadyToVote(false);
      }

      if (data.status === 'voting') {
        setSelectedVote('');
        setHasVoted(false);
        setVotedCount(0);
      }

      if (data.status === 'reveal') {
        setClues([]);
        setChatMessages([]);
        setHasVoted(false);
        setSelectedVote('');
        setRoundResults(null);
        setHasAcknowledged(false);
        setReadyCount(0);
        setIsReadyToVote(false);
        setVotedCount(0);
        setIsRevote(false);
        setTiedPlayerIds([]);
        setRevoteMessage('');
      }
    };

    const onClueSubmitted = (data) => {
      setClues((prev) => [...prev, { nickname: data.nickname, avatar: data.avatar || '🕵️', clue: data.clue }]);
    };

    const onYourTurn = () => {
      setIsMyTurn(true);
      soundEffects.playTurnChime();
    };

    const onChatMessage = (data) => {
      setChatMessages((prev) => [...prev, { nickname: data.nickname, avatar: data.avatar || '🕵️', message: data.message }]);
    };

    const onReadyProgress = (data) => {
      setReadyCount(data.readyCount);
      setTotalPlayers(data.totalPlayers);
    };

    const onVoteProgress = (data) => {
      setVotedCount(data.votedCount);
      setTotalPlayers(data.totalPlayers);
    };

    const onVerbalProgress = (data) => {
      setCurrentSpeakerIndex(data.preparedCount);
      setTotalPlayers(data.totalPlayers);
      if (speakerQueue.length) {
        updateSpeakerTurn(speakerQueue, data.preparedCount, players);
      }
    };

    const onRevoteStarted = (data) => {
      setIsRevote(true);
      setTiedPlayerIds(data.tiedPlayerIds || []);
      setRevoteMessage(data.message || "IT'S A TIE! Revote between tied players.");
      setHasVoted(false);
      setSelectedVote('');
      setVotedCount(0);
      showToast("It's a tie! Re-voting between tied players.", 'warning');
    };

    const onVoteSubmitted = () => {
      setHasVoted(true);
      soundEffects.playVoteSound();
      showToast('Vote confirmed!', 'success', 2000);
    };

    const onRoundResults = (data) => {
      setRoundResults(data);
      setPhase('results');
      if (data?.isImposterCaught) {
        soundEffects.playImposterCaughtSound();
      } else {
        soundEffects.playImposterEscapedSound();
      }
    };

    const onNextRound = (data) => {
      setCurrentGame(data.leagueGameNumber);
      setPlayers(data.players || []);
      setClues([]);
      setChatMessages([]);
      setHasVoted(false);
      setSelectedVote('');
      setRoundResults(null);
      setPhase('reveal');
      setHasAcknowledged(false);
      setReadyCount(0);
      setIsReadyToVote(false);
      setIsRevote(false);
      setTiedPlayerIds([]);
      setRevoteMessage('');
    };

    const onReturnedToLobby = (data) => {
      showToast(data.message || 'Returned to lobby.', 'info');
      navigate('/lobby', {
        state: {
          roomCode: data.roomCode || roomCode,
          players: data.players,
          hostId: data.hostId,
          mode: data.mode
        }
      });
    };

    const onLeagueComplete = (data) => {
      navigate('/podium', {
        state: {
          players: data.players,
          roomCode: data.roomCode || roomCode,
          hostId: data.hostId || hostId
        }
      });
    };

    const onPlayersUpdated = (data) => {
      setPlayers(data.players || []);
      setHostId(data.hostId);
      const activeCount = (data.players || []).filter((p) => p.isConnected !== false && !p.isWaitingForNextRound).length;
      setTotalPlayers(activeCount);
      if (data.hostId) localStorage.setItem('hostId', data.hostId);
    };

    const onError = (data) => {
      showToast(data.message || 'Something went wrong.', 'error');
    };

    const onKicked = (data) => {
      showToast(data.message || 'You were removed by the Host.', 'error');
      navigate('/');
    };

    socket.on('connect', onConnect);
    socket.on('game-state', onGameState);
    socket.on('your-word', onYourWord);
    socket.on('phase-changed', onPhaseChanged);
    socket.on('clue-submitted', onClueSubmitted);
    socket.on('your-turn', onYourTurn);
    socket.on('chat-message', onChatMessage);
    socket.on('ready-progress', onReadyProgress);
    socket.on('vote-progress', onVoteProgress);
    socket.on('verbal-progress', onVerbalProgress);
    socket.on('revote-started', onRevoteStarted);
    socket.on('vote-submitted', onVoteSubmitted);
    socket.on('round-results', onRoundResults);
    socket.on('next-round', onNextRound);
    socket.on('returned-to-lobby', onReturnedToLobby);
    socket.on('league-complete', onLeagueComplete);
    socket.on('players-updated', onPlayersUpdated);
    socket.on('error', onError);
    socket.on('kicked', onKicked);

    return () => {
      socket.off('connect', onConnect);
      socket.off('game-state', onGameState);
      socket.off('your-word', onYourWord);
      socket.off('phase-changed', onPhaseChanged);
      socket.off('clue-submitted', onClueSubmitted);
      socket.off('your-turn', onYourTurn);
      socket.off('chat-message', onChatMessage);
      socket.off('ready-progress', onReadyProgress);
      socket.off('vote-progress', onVoteProgress);
      socket.off('verbal-progress', onVerbalProgress);
      socket.off('revote-started', onRevoteStarted);
      socket.off('vote-submitted', onVoteSubmitted);
      socket.off('round-results', onRoundResults);
      socket.off('next-round', onNextRound);
      socket.off('returned-to-lobby', onReturnedToLobby);
      socket.off('league-complete', onLeagueComplete);
      socket.off('players-updated', onPlayersUpdated);
      socket.off('error', onError);
      socket.off('kicked', onKicked);
    };
  }, [navigate, roomCode, currentPlayerId, hostId]);

  const handleSubmitClue = () => {
    if (!clue.trim()) return;
    socket.emit('submit-clue', { clue: clue.trim() });
    setClue('');
    setIsMyTurn(false);
  };

  const handleVerbalClueDone = () => {
    socket.emit('verbal-ready');
    setIsMyTurn(false);
  };

  const handleSendChat = () => {
    if (!chatInput.trim() || hasVoted || phase === 'voting') return;
    socket.emit('send-chat', { message: chatInput.trim() });
    setChatInput('');
  };

  const handleReadyToVote = () => {
    if (isReadyToVote) return;
    setIsReadyToVote(true);
    socket.emit('ready-to-vote');
  };

  const handleCastVote = () => {
    if (!selectedVote) return;
    socket.emit('cast-vote', { accusedId: selectedVote });
  };

  const handleKickPlayer = (targetPlayerId) => {
    if (window.confirm('Are you sure you want to kick this player from the game?')) {
      socket.emit('kick-player', { targetPlayerId });
    }
  };

  // Host Kick Drawer / Modal Component
  const hostKickModal = (
    showKickDrawer && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-lg text-white">👢 Manage Players</h3>
            <button
              type="button"
              onClick={() => setShowKickDrawer(false)}
              className="text-bluff-muted hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {players.map((p) => {
              const isSelf = p.playerId === currentPlayerId;
              return (
                <div
                  key={p.playerId}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
                >
                  <span className="font-body text-sm text-white">
                    {p.nickname} {isSelf && '(You)'}
                  </span>
                  {!isSelf && (
                    <button
                      type="button"
                      onClick={() => handleKickPlayer(p.playerId)}
                      className="px-2.5 py-1 text-xs font-display font-bold bg-bluff-pink/20 text-bluff-pink border border-bluff-pink/40 rounded-lg hover:bg-bluff-pink hover:text-white transition-all"
                    >
                      Kick
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setShowKickDrawer(false)}
            className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 text-white font-display font-semibold rounded-xl text-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    )
  );

  // Top header with Host tools & Leave
  const gameHeader = (
    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 shrink-0">
      <div>
        <span className="font-display font-extrabold text-sm text-bluff-gold">BluffHunt</span>
        <span className="text-xs text-bluff-muted ml-2">#{roomCode}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsMuted(soundEffects.toggleMute())}
          className="p-1 px-2 rounded-lg text-xs font-display font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all flex items-center gap-1"
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        {isHost && (
          <button
            type="button"
            onClick={() => setShowKickDrawer(true)}
            className="px-2.5 py-1 rounded-lg text-xs font-display font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all flex items-center gap-1"
          >
            👑 Players
          </button>
        )}
        <LeaveButton compact />
      </div>
    </div>
  );

  // Spectator Banner
  if (isWaitingSpectator) {
    return (
      <ScreenShell compact>
        {gameHeader}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6 text-center">
            <div className="text-5xl mb-3">🍿</div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">Spectating Round</h2>
            <p className="font-body text-bluff-muted text-sm mb-4">
              You joined while Game {currentGame} was in progress. You will enter the action automatically on the next round!
            </p>
            <div className="p-3 bg-black/20 rounded-xl">
              <p className="font-body text-xs text-bluff-gold">Phase: {phase.toUpperCase()}</p>
            </div>
          </div>
        </div>
        {hostKickModal}
      </ScreenShell>
    );
  }

  // =============================================
  // REVEAL PHASE
  // =============================================
  if (phase === 'reveal') {
    return (
      <ScreenShell compact>
        {gameHeader}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
              <p className="font-display font-bold text-bluff-muted text-sm uppercase tracking-wider mb-2">
                Game {currentGame} of 10
              </p>
              {!currentWord ? (
                <p className="font-body text-bluff-muted">Getting your secret word...</p>
              ) : isImposter ? (
                <>
                  <div className="text-6xl mb-3 animate-pulse">🕵️</div>
                  <h2 className="font-display font-extrabold text-3xl text-bluff-pink mb-1">
                    YOU ARE THE IMPOSTER!
                  </h2>
                  <p className="font-body text-bluff-muted text-sm mb-2">
                    Blend in with the agents without knowing their word!
                  </p>
                  <p className="font-body text-bluff-muted text-xs">Your decoy word is:</p>
                  <p className="font-display font-black text-5xl text-bluff-gold mt-2 tracking-wide">
                    {currentWord}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-3">📝</div>
                  <h2 className="font-display font-extrabold text-2xl text-white mb-1">
                    YOU ARE AN AGENT
                  </h2>
                  <p className="font-body text-bluff-muted text-sm mb-2">
                    Find out who does not know the secret word!
                  </p>
                  <p className="font-body text-bluff-muted text-xs">Your secret word is:</p>
                  <p className="font-display font-black text-5xl text-bluff-gold mt-2 tracking-wide">
                    {currentWord}
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  soundEffects.playRevealSound();
                  socket.emit('acknowledge-word');
                  setHasAcknowledged(true);
                }}
                disabled={hasAcknowledged}
                className="w-full py-4 mt-8 bg-bluff-purple hover:bg-bluff-purple-dark text-white font-display font-extrabold text-lg rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasAcknowledged ? '⏳ Waiting for other players...' : '👁️ I Know My Secret Word'}
              </button>
            </div>
          </div>
        </div>
        {hostKickModal}
      </ScreenShell>
    );
  }

  // =============================================
  // CLUE PHASE
  // =============================================
  if (phase === 'clue') {
    return (
      <ScreenShell compact>
        {gameHeader}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-4 flex flex-col flex-1 min-h-0">
            {/* Header info */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/10">
              <div>
                <h2 className="font-display font-bold text-lg text-white">Clue Phase</h2>
                <p className="font-body text-bluff-muted text-xs">Game {currentGame} of 10 ({mode === 'offline' ? '🗣️ Offline' : '🌐 Online'})</p>
              </div>
            </div>

            {/* Clues Stream */}
            <div className="flex-1 overflow-y-auto space-y-2 bg-black/20 rounded-xl p-3 mb-3">
              {clues.length === 0 ? (
                <p className="font-body text-bluff-muted text-xs text-center py-6">
                  Waiting for players to submit their clues...
                </p>
              ) : (
                clues.map((c, i) => (
                  <div key={`${c.nickname}-${i}`} className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2">
                    <span className="text-base shrink-0">{c.avatar || '🕵️'}</span>
                    <span className="font-display font-bold text-sm text-bluff-gold shrink-0">{c.nickname}:</span>
                    <span className="font-body text-sm text-white break-words">{c.clue}</span>
                  </div>
                ))
              )}
            </div>

            {/* Offline Turn Controls */}
            {mode === 'offline' ? (
              <div className="pt-2">
                {isMyTurn ? (
                  <div className="bg-bluff-purple/20 border border-bluff-purple rounded-xl p-4 text-center">
                    <p className="font-display font-bold text-white text-base mb-1">🗣️ YOUR TURN!</p>
                    <p className="font-body text-bluff-gold text-sm mb-3">Say your clue out loud to the room.</p>
                    <button
                      type="button"
                      onClick={handleVerbalClueDone}
                      className="w-full py-3 bg-bluff-purple hover:bg-bluff-purple-dark text-white font-display font-extrabold rounded-xl transition-all shadow-lg"
                    >
                      ✅ I SAID MY CLUE
                    </button>
                  </div>
                ) : (
                  <div className="bg-black/30 rounded-xl p-4 text-center">
                    <p className="font-body text-bluff-muted text-sm">
                      Waiting for <span className="font-display font-bold text-bluff-gold">{currentSpeakerNickname || 'current player'}</span> to say their clue out loud...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Online Clue Controls */
              <div className="pt-2">
                {isMyTurn ? (
                  <div className="space-y-2">
                    <p className="font-display font-bold text-xs text-bluff-gold">👉 YOUR TURN TO GIVE A CLUE:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter your clue..."
                        className="flex-1 p-3 bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-bluff-purple font-body text-white placeholder:text-bluff-muted text-sm"
                        value={clue}
                        onChange={(e) => setClue(e.target.value)}
                        maxLength={80}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitClue()}
                      />
                      <button
                        type="button"
                        onClick={handleSubmitClue}
                        disabled={!clue.trim()}
                        className="px-5 py-3 bg-bluff-purple hover:bg-bluff-purple-dark text-white font-display font-bold rounded-xl transition-all disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                    <p className="font-body text-right text-[10px] text-bluff-muted">
                      {clue.length}/80 chars
                    </p>
                  </div>
                ) : (
                  <div className="bg-black/30 rounded-xl p-3 text-center">
                    <p className="font-body text-bluff-muted text-sm">
                      Waiting for <span className="font-display font-bold text-bluff-gold">{currentSpeakerNickname || 'player'}</span> to submit their clue...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {hostKickModal}
      </ScreenShell>
    );
  }

  // =============================================
  // DISCUSSION PHASE
  // =============================================
  if (phase === 'discussion') {
    return (
      <ScreenShell compact>
        {gameHeader}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Clues Summary */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-3 shrink-0">
            <div className="flex justify-between items-center mb-1.5">
              <h2 className="font-display font-bold text-base text-white">💬 Discussion Time</h2>
              <span className="font-body text-xs text-bluff-muted">Game {currentGame} of 10</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {clues.map((c, i) => (
                <span key={`${c.nickname}-${i}`} className="font-body text-xs bg-black/30 rounded-lg px-2.5 py-1 text-white border border-white/5">
                  <span className="font-semibold text-bluff-gold">{c.nickname}</span>: {c.clue}
                </span>
              ))}
            </div>
          </div>

          {/* Discussion Chat (Online) */}
          <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-3 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {chatMessages.length === 0 ? (
                <p className="font-body text-bluff-muted text-xs text-center py-4">
                  Discuss the clues! Who is the imposter?
                </p>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={`${msg.nickname}-${i}`} className="text-sm font-body bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="font-display font-bold text-bluff-gold text-xs block">
                      {msg.avatar || '🕵️'} {msg.nickname}
                    </span>
                    <span className="text-white/90 text-sm">{msg.message}</span>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2.5 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bluff-purple font-body text-white placeholder:text-bluff-muted text-sm"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                maxLength={200}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button
                type="button"
                onClick={handleSendChat}
                disabled={!chatInput.trim()}
                className="px-4 py-2 bg-bluff-blue hover:bg-blue-600 text-white font-display font-bold rounded-xl disabled:opacity-50 text-sm transition-all"
              >
                Send
              </button>
            </div>
          </div>

          {/* Single Unified Ready to Vote Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleReadyToVote}
              disabled={isReadyToVote}
              className={`w-full py-3.5 rounded-xl font-display font-bold text-base transition-all shadow-lg ${
                isReadyToVote
                  ? 'bg-white/10 text-bluff-muted border border-white/10 cursor-not-allowed'
                  : 'bg-bluff-gold hover:bg-yellow-500 text-bluff-charcoal shadow-yellow-500/20'
              }`}
            >
              {isReadyToVote
                ? `⏳ Waiting for others... (${readyCount}/${totalPlayers} ready)`
                : `🗳️ I'm Ready to Vote (${readyCount}/${totalPlayers} ready)`}
            </button>
          </div>
        </div>
        {hostKickModal}
      </ScreenShell>
    );
  }

  // =============================================
  // VOTING PHASE
  // =============================================
  if (phase === 'voting') {
    const selectablePlayers = players.filter((p) => {
      if (p.playerId === currentPlayerId || p.isConnected === false || p.isWaitingForNextRound) return false;
      if (isRevote && tiedPlayerIds.length > 0) {
        return tiedPlayerIds.includes(p.playerId);
      }
      return true;
    });

    return (
      <ScreenShell compact>
        {gameHeader}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-5 flex flex-col flex-1 min-h-0">
            <div className="text-center mb-3">
              <h2 className="font-display font-black text-2xl text-white flex items-center justify-center gap-2">
                🗳️ Cast Your Vote
              </h2>
              <p className="font-body text-bluff-muted text-xs">
                Game {currentGame} of 10 • Point your finger at the Imposter!
              </p>
            </div>

            {/* Tie Revote Alert */}
            {isRevote && (
              <div className="bg-bluff-pink/20 border border-bluff-pink/50 rounded-xl p-3 mb-3 text-center animate-pulse">
                <p className="font-display font-bold text-bluff-pink text-sm">
                  ⚠️ {revoteMessage || "IT'S A TIE! Revote between the tied players."}
                </p>
              </div>
            )}

            {/* Candidates Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {selectablePlayers.length === 0 ? (
                <p className="font-body text-bluff-muted text-center py-6">No eligible candidates to vote for.</p>
              ) : (
                selectablePlayers.map((p) => {
                  const isSelected = selectedVote === p.playerId;
                  return (
                    <button
                      type="button"
                      key={p.playerId}
                      disabled={hasVoted}
                      onClick={() => setSelectedVote(p.playerId)}
                      className={`w-full p-3.5 rounded-xl font-display font-bold text-left flex items-center justify-between border transition-all ${
                        isSelected
                          ? 'bg-bluff-purple border-white/40 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'
                      } ${hasVoted ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.avatar || '🕵️'}</span>
                        <span>{p.nickname}</span>
                      </div>
                      {isSelected && <span className="text-bluff-gold text-lg">✓</span>}
                    </button>
                  );
                })
              )}
            </div>

            {/* Status & Confirm Button */}
            <div className="pt-2">
              {hasVoted ? (
                <div className="bg-bluff-green/20 border border-bluff-green/40 rounded-xl p-3 text-center">
                  <p className="font-display font-bold text-bluff-green text-sm">
                    ✅ Vote recorded! Waiting for remaining votes...
                  </p>
                  <p className="font-body text-bluff-muted text-xs mt-1">
                    {votedCount}/{totalPlayers} players voted
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCastVote}
                  disabled={!selectedVote}
                  className="w-full py-3.5 bg-bluff-gold hover:bg-yellow-500 text-bluff-charcoal font-display font-extrabold text-base rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✅ Confirm Vote
                </button>
              )}
            </div>
          </div>
        </div>
        {hostKickModal}
      </ScreenShell>
    );
  }

  // =============================================
  // RESULTS PHASE
  // =============================================
  if (phase === 'results') {
    return (
      <ScreenShell compact>
        {gameHeader}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-2xl text-center">
              {roundResults ? (
                <>
                  <div className="text-5xl mb-2">
                    {roundResults.isImposterCaught ? '🎯' : '💨'}
                  </div>
                  <h2 className="font-display font-black text-2xl mb-1">
                    {roundResults.isImposterCaught ? (
                      <span className="text-bluff-green">IMPOSTER CAUGHT!</span>
                    ) : (
                      <span className="text-bluff-pink">IMPOSTER SURVIVED!</span>
                    )}
                  </h2>

                  <div className="bg-black/30 border border-white/10 rounded-xl p-3 my-3">
                    <p className="font-body text-bluff-muted text-xs">The imposter was:</p>
                    <p className="font-display font-black text-xl text-bluff-pink flex items-center justify-center gap-2">
                      <span>{roundResults.imposter.avatar || '🕵️'}</span>
                      <span>{roundResults.imposter.nickname}</span>
                    </p>
                    <p className="font-body text-bluff-muted text-xs mt-1">
                      Their secret decoy word was:{' '}
                      <span className="font-display font-bold text-bluff-gold">
                        {roundResults.imposter.word}
                      </span>
                    </p>
                  </div>

                  <h3 className="font-display font-bold text-sm text-white mb-2 text-left uppercase tracking-wider">
                    📊 League Scores
                  </h3>
                  <div className="space-y-1.5 bg-black/20 rounded-xl p-3 max-h-48 overflow-y-auto">
                    {[...roundResults.players]
                      .sort((a, b) => b.leaguePoints - a.leaguePoints)
                      .map((p) => (
                        <div key={p.playerId} className="flex justify-between items-center font-body text-sm py-1 border-b border-white/5 last:border-0">
                          <span className="text-white/90 flex items-center gap-1.5">
                            <span>{p.avatar || '🕵️'}</span>
                            <span>{p.nickname}</span>
                            {p.isImposter && '🕵️'}
                          </span>
                          <span className="font-display font-bold text-bluff-gold text-xs">
                            {p.oldPoints} + {p.roundPoints} = {p.leaguePoints} pts
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="animate-spin text-bluff-gold">⏳</span>
                    <p className="font-body text-bluff-muted text-xs">
                      {currentGame >= 10 ? 'Final scores loading...' : 'Next round starting in 8 seconds...'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className="animate-spin text-3xl mb-2 text-bluff-purple">⚙️</div>
                  <p className="font-body text-bluff-muted">Calculating round results...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {hostKickModal}
      </ScreenShell>
    );
  }

  // Loading Screen
  return (
    <ScreenShell compact>
      {gameHeader}
      <div className="flex-1 flex items-center justify-center">
        <p className="font-body text-bluff-muted">Loading BluffHunt session...</p>
      </div>
      {hostKickModal}
    </ScreenShell>
  );
};

export default GameScreen;