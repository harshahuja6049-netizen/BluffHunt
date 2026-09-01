// frontend/src/pages/GameScreen.jsx (Fully Fixed + Word Request)

import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket, { emitRejoin, setHasJoinedRoom } from '../socket';
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
  const [acknowledgedCount, setAcknowledgedCount] = useState(0);
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
  const [pendingAcknowledge, setPendingAcknowledge] = useState(false);
  const pendingTimeoutRef = useRef(null);

  const currentPlayerId = localStorage.getItem('playerId');
  const isHost = currentPlayerId === hostId;

  // DERIVED
  const currentPlayer = players.find((p) => p.playerId === currentPlayerId);
  const hasAcknowledged = currentPlayer ? currentPlayer.hasAcknowledgedWord : false;
  const displayWord = currentWord || (currentPlayer ? currentPlayer.word : '');
  const displayIsImposter = isImposter || (currentPlayer ? currentPlayer.isImposter : false);

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

    // ---------- EVENT HANDLERS ----------
    const onGameState = (data) => {
      console.log('📡 game-state received:', data);
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
      console.log('📡 your-word received:', data);
      if (data.word) {
        setCurrentWord(data.word);
        setIsImposter(Boolean(data.isImposter));
        if (data.leagueGameNumber) setCurrentGame(data.leagueGameNumber);
      }
    };

    const onPhaseChanged = (data) => {
      console.log('🔄 phase-changed received:', data);
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

      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
      setPendingAcknowledge(false);

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
        setHasVoted(false);
        setSelectedVote('');
        setVotedCount(0);
        if (data.isRevote) {
          setIsRevote(true);
          setTiedPlayerIds(data.tiedPlayerIds || []);
          setRevoteMessage(data.message || 'Tie detected! Revoting among tied players.');
        } else {
          setIsRevote(false);
          setTiedPlayerIds([]);
          setRevoteMessage('');
        }
      }

      if (data.status === 'results' && data.results) {
        console.log('📊 results data in phase-changed:', data.results);
        setRoundResults(data.results);
        if (data.results.isImposterCaught) {
          soundEffects.playImposterCaught();
        } else {
          soundEffects.playImposterEscaped();
        }
      }
    };

    const onRoundResults = (data) => {
      console.log('📊 round-results received:', data);
      setRoundResults(data);
      setPhase('results');
      if (data.isImposterCaught) {
        soundEffects.playImposterCaught();
      } else {
        soundEffects.playImposterEscaped();
      }
    };

    const onTurnChanged = (data) => {
      console.log('🔊 turn-changed received:', data);
      if (data.speakerQueue !== undefined) {
        setSpeakerQueue(data.speakerQueue);
        setCurrentSpeakerIndex(data.currentSpeakerIndex);
        updateSpeakerTurn(data.speakerQueue, data.currentSpeakerIndex, players);
      }
    };

    const onYourTurn = (data) => {
      console.log('🔊 your-turn received:', data);
      setIsMyTurn(true);
    };

    const onCluesUpdated = (data) => {
      console.log('📡 clues-updated received:', data);
      setClues(data.clues || []);
    };

    const onChatMessage = (data) => {
      setChatMessages((prev) => [...prev, data]);
    };

    const onReadyToVoteUpdated = (data) => {
      setReadyCount(data.readyCount);
      setTotalPlayers(data.totalPlayers);
    };

    const onVoteRecorded = (data) => {
      console.log('📡 vote-recorded received:', data);
      setVotedCount(data.votedCount);
      setTotalPlayers(data.totalPlayers);
      setHasVoted(true);
      soundEffects.playVoteCast();
    };

    const onVotingProgress = (data) => {
      setVotedCount(data.votedCount);
      setTotalPlayers(data.totalPlayers);
    };

    const onAcknowledgeProgress = (data) => {
      if (typeof data.acknowledgedCount === 'number') setAcknowledgedCount(data.acknowledgedCount);
      if (typeof data.totalPlayers === 'number') setTotalPlayers(data.totalPlayers);
      if (data.players) {
        setPlayers(data.players);
        if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
        setPendingAcknowledge(false);
      }
    };

    const onPlayerReady = (data) => {
      if (typeof data.totalReady === 'number') setAcknowledgedCount(data.totalReady);
      if (typeof data.totalPlayers === 'number') setTotalPlayers(data.totalPlayers);
    };

    const onRoundReset = (data) => {
      setPhase('reveal');
      setClue('');
      setClues([]);
      setChatMessages([]);
      setChatInput('');
      setAcknowledgedCount(0);
      setHasVoted(false);
      setSelectedVote('');
      setRoundResults(null);
      setIsReadyToVote(false);
      setReadyCount(0);
      setVotedCount(0);
      setIsRevote(false);
      setTiedPlayerIds([]);
      setIsWaitingSpectator(false);
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
      setPendingAcknowledge(false);
      if (data.leagueGameNumber) setCurrentGame(data.leagueGameNumber);
      if (data.players) setPlayers(data.players);
    };

    const onHostChanged = (data) => {
      setHostId(data.hostId);
      localStorage.setItem('hostId', data.hostId);
    };

    const onPlayersUpdated = (data) => {
      console.log('📡 players-updated received:', data);
      setPlayers(data.players || []);
      setHostId(data.hostId);
      if (data.hostId) localStorage.setItem('hostId', data.hostId);
      const activeCount = (data.players || []).filter((p) => p.isConnected !== false && !p.isWaitingForNextRound).length;
      setTotalPlayers(activeCount);
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
      setPendingAcknowledge(false);
    };

    const onLeagueReset = (data) => {
      navigate('/lobby', {
        state: {
          roomCode,
          players: data.players,
          hostId: data.hostId,
          mode: data.mode
        }
      });
    };

    // ---------- LEAGUE COMPLETE ----------
    const onLeagueComplete = (data) => {
      console.log('🏆 league-complete received:', data);
      navigate('/podium', {
        state: {
          players: data.players,
          roomCode: data.roomCode || roomCode,
          hostId: data.hostId || hostId
        }
      });
    };

    const onError = (data) => showToast(data.message || 'Game error', 'error');

    const onKicked = (data) => {
      showToast(data.message || 'You were removed from the match.', 'error');
      localStorage.removeItem('playerId');
      localStorage.removeItem('roomCode');
      navigate('/');
    };

    const onLeftRoom = () => {
      setHasJoinedRoom(false);
      navigate('/');
    };

    // ---------- REGISTER LISTENERS ----------
    socket.on('connect', onConnect);
    socket.on('game-state', onGameState);
    socket.on('your-word', onYourWord);
    socket.on('phase-changed', onPhaseChanged);
    socket.on('round-results', onRoundResults);
    socket.on('turn-changed', onTurnChanged);
    socket.on('your-turn', onYourTurn);
    socket.on('clues-updated', onCluesUpdated);
    socket.on('chat-message', onChatMessage);
    socket.on('ready-to-vote-updated', onReadyToVoteUpdated);
    socket.on('vote-recorded', onVoteRecorded);
    socket.on('voting-progress', onVotingProgress);
    socket.on('acknowledge-progress', onAcknowledgeProgress);
    socket.on('player-ready', onPlayerReady);
    socket.on('round-reset', onRoundReset);
    socket.on('host-changed', onHostChanged);
    socket.on('players-updated', onPlayersUpdated);
    socket.on('league-reset', onLeagueReset);
    socket.on('league-complete', onLeagueComplete);
    socket.on('error', onError);
    socket.on('kicked', onKicked);
    socket.on('left-room', onLeftRoom);

    return () => {
      socket.off('connect', onConnect);
      socket.off('game-state', onGameState);
      socket.off('your-word', onYourWord);
      socket.off('phase-changed', onPhaseChanged);
      socket.off('round-results', onRoundResults);
      socket.off('turn-changed', onTurnChanged);
      socket.off('your-turn', onYourTurn);
      socket.off('clues-updated', onCluesUpdated);
      socket.off('chat-message', onChatMessage);
      socket.off('ready-to-vote-updated', onReadyToVoteUpdated);
      socket.off('vote-recorded', onVoteRecorded);
      socket.off('voting-progress', onVotingProgress);
      socket.off('acknowledge-progress', onAcknowledgeProgress);
      socket.off('player-ready', onPlayerReady);
      socket.off('round-reset', onRoundReset);
      socket.off('host-changed', onHostChanged);
      socket.off('players-updated', onPlayersUpdated);
      socket.off('league-reset', onLeagueReset);
      socket.off('league-complete', onLeagueComplete);
      socket.off('error', onError);
      socket.off('kicked', onKicked);
      socket.off('left-room', onLeftRoom);
    };
  }, [navigate, roomCode, currentPlayerId, players, showToast]);

  // 🔥 NEW: If word is missing after 2 seconds, request it from server
  useEffect(() => {
    if (phase === 'reveal' && !currentWord && !pendingAcknowledge && currentPlayerId) {
      const timer = setTimeout(() => {
        if (!currentWord) {
          console.log('⏰ Word missing, requesting from server...');
          socket.emit('request-word');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, currentWord, pendingAcknowledge, currentPlayerId]);

  // ---------- HANDLERS ----------
  const handleSubmitClue = () => {
    if (!clue.trim()) return;
    socket.emit('submit-clue', { clue: clue.trim() });
    setClue('');
    setIsMyTurn(false); // Optimistically disable
  };

  const handleVerbalClueDone = () => {
    socket.emit('verbal-ready');
    setIsMyTurn(false);
  };

  const handleSendChat = () => {
  console.log('🔍 handleSendChat called:', { chatInput, hasVoted, phase });
  if (!chatInput.trim()) {
    console.log('⚠️ Chat input is empty');
    return;
  }
  if (hasVoted) {
    console.log('⚠️ Already voted, chat locked');
    return;
  }
  if (phase === 'voting') {
    console.log('⚠️ Voting phase, chat locked');
    return;
  }
  console.log('📤 Sending chat:', chatInput.trim());
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
    setHasVoted(true); // Optimistically update
    setVotedCount((prev) => prev + 1);
  };

  const handleKickPlayer = (targetPlayerId) => {
    if (window.confirm('Are you sure you want to kick this player from the game?')) {
      socket.emit('kick-player', { targetPlayerId });
    }
  };

  // Host Kick Drawer
  const hostKickModal = (
    showKickDrawer && (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-lg text-white">👑 Manage Match Players</h3>
            <button type="button" onClick={() => setShowKickDrawer(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {players.map((p) => {
              const isSelf = p.playerId === currentPlayerId;
              return (
                <div key={p.playerId} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-body text-sm text-white">{p.nickname} {isSelf && '(You)'}</span>
                  {!isSelf && (
                    <button type="button" onClick={() => handleKickPlayer(p.playerId)} className="px-2.5 py-1 text-xs font-display font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60 rounded-lg hover:bg-rose-900 transition-all active:scale-95">
                      Kick
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button type="button" onClick={() => setShowKickDrawer(false)} className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-display font-bold rounded-xl text-sm transition-all">Done</button>
        </div>
      </div>
    )
  );

  const gameHeader = (
    <div className="flex items-center justify-between p-2.5 px-3 bg-slate-900/80 border border-slate-800/80 rounded-xl mb-3 shrink-0 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="font-display font-black text-sm bg-gradient-to-r from-amber-300 to-purple-400 bg-clip-text text-transparent">BluffHunt</span>
        <span className="text-[11px] font-display font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">#{roomCode}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => setIsMuted(soundEffects.toggleMute())} className="p-1 px-2.5 rounded-lg text-xs font-display font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-1 active:scale-95" title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}>
          {isMuted ? '🔇 Muted' : '🔊 SFX'}
        </button>
        {isHost && (
          <button type="button" onClick={() => setShowKickDrawer(true)} className="px-2.5 py-1 rounded-lg text-xs font-display font-bold bg-purple-950/70 hover:bg-purple-900 text-purple-300 border border-purple-800/50 transition-all flex items-center gap-1 active:scale-95">
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
          <div className="w-full max-w-md card p-6 text-center bg-slate-900/90 border border-slate-700/60 shadow-2xl backdrop-blur-2xl">
            <div className="text-5xl mb-3 animate-bounce">🍿</div>
            <h2 className="font-display font-black text-2xl text-white mb-2">Spectating Match</h2>
            <p className="font-body text-slate-400 text-sm mb-4">You connected while Game {currentGame} was running. You will join the active roster automatically next game!</p>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl inline-block px-6">
              <p className="font-display font-bold text-xs text-amber-300 uppercase tracking-widest">Phase: {phase}</p>
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
    const isButtonDisabled = !displayWord || hasAcknowledged || pendingAcknowledge;
    const buttonText = hasAcknowledged || pendingAcknowledge
      ? `⏳ Waiting for other players... (${acknowledgedCount || 1}/${totalPlayers} ready)`
      : '👁️ I Memorized My Word';

    return (
      <ScreenShell compact>
        {gameHeader}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className={`card p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all ${displayIsImposter ? 'bg-gradient-to-b from-rose-950/40 via-slate-900/90 to-slate-900/90 border-rose-500/40 shadow-glow-pink' : 'bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900/90 border-indigo-500/40 shadow-glow-purple'}`}>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-[11px] font-display font-black tracking-widest text-amber-300 uppercase mb-3">
                Round {currentGame} of 10
              </div>

              {!displayWord ? (
                <p className="font-body text-slate-400 animate-pulse">Decrypting secret assignment...</p>
              ) : displayIsImposter ? (
                <>
                  <div className="text-6xl mb-2 animate-bounce">🕵️</div>
                  <h2 className="font-display font-black text-3xl text-rose-400 mb-1 tracking-tight">YOU ARE THE IMPOSTER!</h2>
                  <p className="font-body text-slate-300 text-xs sm:text-sm mb-3">Blend in! Pretend you know the Agents&apos; word.</p>
                  <p className="font-body text-slate-400 text-xs uppercase tracking-wider">Your Decoy Word Is:</p>
                  <div className="my-3 py-3 px-4 bg-slate-950/90 border border-rose-500/30 rounded-2xl">
                    <p className="font-display font-black text-4xl sm:text-5xl text-amber-300 tracking-wide drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]">{displayWord}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-2">🛡️</div>
                  <h2 className="font-display font-black text-3xl text-cyan-300 mb-1 tracking-tight">YOU ARE AN AGENT</h2>
                  <p className="font-body text-slate-300 text-xs sm:text-sm mb-3">Find out who does not know the secret word!</p>
                  <p className="font-body text-slate-400 text-xs uppercase tracking-wider">Your Secret Word Is:</p>
                  <div className="my-3 py-3 px-4 bg-slate-950/90 border border-indigo-500/30 rounded-2xl">
                    <p className="font-display font-black text-4xl sm:text-5xl text-amber-300 tracking-wide drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]">{displayWord}</p>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  if (pendingAcknowledge || hasAcknowledged || !displayWord) return;
                  setPendingAcknowledge(true);
                  soundEffects.playRevealSound();
                  socket.emit('acknowledge-word');
                  if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
                  pendingTimeoutRef.current = setTimeout(() => {
                    setPendingAcknowledge(false);
                    showToast('Server response delayed. Please check your connection.', 'warning');
                  }, 5000);
                }}
                disabled={isButtonDisabled}
                className={`w-full py-3.5 sm:py-4 mt-4 font-display font-black text-base rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg ${isButtonDisabled ? 'bg-slate-800/80 text-slate-400 border border-slate-700/50 shadow-none' : displayIsImposter ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-glow-pink' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple'}`}
              >
                {buttonText}
              </button>

              <div className="mt-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="flex justify-between items-center text-xs mb-1.5 font-display font-bold">
                  <span className="text-slate-400">Players Memorized:</span>
                  <span className="text-amber-300">{acknowledgedCount || (hasAcknowledged ? 1 : 0)} / {totalPlayers}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-300" style={{ width: `${Math.min(100, Math.max(8, ((acknowledgedCount || (hasAcknowledged ? 1 : 0)) / Math.max(1, totalPlayers)) * 100))}%` }} />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-800/80 justify-center">
                  {players.filter((p) => p.isConnected !== false && !p.isWaitingForNextRound).map((p) => {
                    const isSelf = p.playerId === currentPlayerId;
                    const isReady = p.hasAcknowledgedWord || (isSelf && hasAcknowledged);
                    return (
                      <span key={p.playerId} className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-body ${isReady ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>
                        <span>{p.avatar || '🕵️'}</span>
                        <span className="truncate max-w-[70px]">{p.nickname}</span>
                        <span>{isReady ? '✅' : '⏳'}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {isHost && (
                <button type="button" onClick={() => socket.emit('force-advance-reveal')} className="w-full mt-2.5 py-2.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-display font-bold text-xs rounded-xl transition-all active:scale-95">
                  ⏩ Start Clue Round Now (Host Override)
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
  // CLUE PHASE
  // =============================================
  if (phase === 'clue') {
    return (
      <ScreenShell compact>
        {gameHeader}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="card p-4 bg-slate-900/85 border border-slate-700/60 shadow-2xl backdrop-blur-2xl flex flex-col flex-1 min-h-0">
            <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-slate-800">
              <div>
                <h2 className="font-display font-black text-lg text-white">Clue Giving Round</h2>
                <p className="font-body text-slate-400 text-xs">Game {currentGame} of 10 ({mode === 'offline' ? '🗣️ Verbal Pass' : '🌐 Realtime Clues'})</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-display font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">1-2 Word Clues</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-3">
              {clues.length === 0 ? (
                <p className="font-body text-slate-500 text-xs text-center py-8">Waiting for players to submit their clues...</p>
              ) : (
                clues.map((c, i) => (
                  <div key={`${c.nickname}-${i}`} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                    <span className="text-lg shrink-0 p-1 bg-slate-800 rounded-lg">{c.avatar || '🕵️'}</span>
                    <div className="min-w-0 flex-1">
                      <span className="font-display font-bold text-xs text-amber-300 block">{c.nickname}</span>
                      <span className="font-body text-sm text-slate-100 font-medium break-words">{c.clue}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {mode === 'offline' ? (
              <div className="pt-1">
                {isMyTurn ? (
                  <div className="bg-purple-950/50 border border-purple-500/50 rounded-2xl p-4 text-center shadow-glow-purple">
                    <p className="font-display font-black text-white text-lg mb-0.5">🗣️ YOUR TURN!</p>
                    <p className="font-body text-amber-300 text-xs font-semibold mb-3">Say your clue out loud to the room now.</p>
                    <button type="button" onClick={handleVerbalClueDone} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black rounded-xl shadow-glow-purple transition-all active:scale-[0.98]">✅ I SAID MY CLUE</button>
                  </div>
                ) : (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center">
                    <p className="font-body text-slate-400 text-xs">Waiting for <span className="font-display font-bold text-amber-300">{currentSpeakerNickname || 'next player'}</span> to give their verbal clue...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-1">
                {isMyTurn ? (
                  <div className="space-y-1.5">
                    <p className="font-display font-black text-xs text-amber-300">👉 YOUR TURN! ENTER YOUR CLUE:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Give a subtle clue..."
                        className="flex-1 p-3 bg-slate-950/90 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-body text-white placeholder:text-slate-500 text-sm"
                        value={clue}
                        onChange={(e) => setClue(e.target.value)}
                        maxLength={80}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitClue()}
                      />
                      <button
                        type="button"
                        onClick={handleSubmitClue}
                        disabled={!clue.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black rounded-xl transition-all active:scale-95 shadow-glow-purple disabled:opacity-50 disabled:shadow-none"
                      >
                        Send
                      </button>
                    </div>
                    <p className="font-body text-right text-[10px] text-slate-500">{clue.length}/80 chars</p>
                  </div>
                ) : (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center">
                    <p className="font-body text-slate-400 text-xs">Waiting for <span className="font-display font-bold text-amber-300">{currentSpeakerNickname || 'player'}</span> to submit clue...</p>
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
        <div className="flex-1 flex flex-col gap-2.5 min-h-0">
          <div className="card p-3 bg-slate-900/85 border border-slate-700/60 shadow-xl shrink-0 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-slate-800">
              <h2 className="font-display font-black text-sm text-white">💬 Submitted Clues</h2>
              <span className="font-body text-[11px] text-slate-400">Game {currentGame}/10</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {clues.map((c, i) => (
                <span key={`${c.nickname}-${i}`} className="font-body text-xs bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200">
                  <span className="font-bold text-amber-300">{c.nickname}</span>: {c.clue}
                </span>
              ))}
            </div>
          </div>

          {/* Discussion Chat (Online only) */}
{mode === 'online' && (
  <div className="flex-1 card p-3 bg-slate-900/85 border border-slate-700/60 shadow-xl backdrop-blur-xl flex flex-col min-h-0">
    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
      {chatMessages.length === 0 ? (
        <p className="font-body text-slate-500 text-xs text-center py-6">Debate who gave the most suspicious clue!</p>
      ) : (
        chatMessages.map((msg, i) => (
          <div key={`${msg.nickname}-${i}`} className="text-sm font-body bg-slate-950/70 p-2 rounded-xl border border-slate-800">
            <span className="font-display font-bold text-amber-300 text-xs block">{msg.avatar || '🕵️'} {msg.nickname}</span>
            <span className="text-slate-100 text-xs sm:text-sm">{msg.message}</span>
          </div>
        ))
      )}
    </div>
    <div className="flex gap-2 mt-2 pt-2 border-t border-slate-800">
      <input
        type="text"
        placeholder="Discuss suspicious clues..."
        className="flex-1 p-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-body text-white placeholder:text-slate-500 text-xs sm:text-sm"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        maxLength={200}
        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
      />
      <button
        type="button"
        onClick={handleSendChat}
        disabled={!chatInput.trim()}
        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-display font-black rounded-xl disabled:opacity-50 text-xs sm:text-sm shadow-glow-cyan transition-all active:scale-95"
      >
        Send
      </button>
    </div>
  </div>
)}

{/* Offline mode: Show a message instead */}
{mode === 'offline' && (
  <div className="flex-1 card p-3 bg-slate-900/85 border border-slate-700/60 shadow-xl backdrop-blur-xl flex flex-col items-center justify-center">
    <p className="font-body text-slate-400 text-sm text-center">
      🗣️ Discuss verbally in the room!
    </p>
    <p className="font-body text-slate-500 text-xs text-center mt-1">
      Use the "I'm Ready to Vote" button when you're done.
    </p>
  </div>
)}


          <div className="shrink-0">
            <button
              type="button"
              onClick={handleReadyToVote}
              disabled={isReadyToVote}
              className={`w-full py-3.5 rounded-xl font-display font-black text-sm sm:text-base transition-all duration-150 active:scale-[0.98] ${isReadyToVote ? 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed' : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-glow-gold'}`}
            >
              {isReadyToVote ? `⏳ Waiting for Players (${readyCount}/${totalPlayers} ready)` : `🗳️ I'm Ready to Vote (${readyCount}/${totalPlayers} ready)`}
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
          <div className="card p-4 sm:p-5 bg-slate-900/85 border border-slate-700/60 shadow-2xl backdrop-blur-2xl flex flex-col flex-1 min-h-0">
            <div className="text-center mb-2.5">
              <h2 className="font-display font-black text-2xl text-white flex items-center justify-center gap-2">🗳️ Cast Your Vote</h2>
              <p className="font-body text-slate-400 text-xs">Game {currentGame}/10 • Tap on the player you think is the Imposter!</p>
            </div>

            {isRevote && (
              <div className="bg-rose-950/60 border border-rose-500/60 rounded-xl p-3 mb-2 text-center animate-pulse">
                <p className="font-display font-black text-rose-300 text-xs sm:text-sm">⚠️ {revoteMessage || "TIE VOTES! Revote between the tied suspects."}</p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1">
              {selectablePlayers.length === 0 ? (
                <p className="font-body text-slate-500 text-center py-6">No suspects available.</p>
              ) : (
                selectablePlayers.map((p) => {
                  const isSelected = selectedVote === p.playerId;
                  return (
                    <button
                      type="button"
                      key={p.playerId}
                      disabled={hasVoted}
                      onClick={() => setSelectedVote(p.playerId)}
                      className={`w-full p-3.5 rounded-xl font-display font-bold text-left flex items-center justify-between border transition-all active:scale-98 ${isSelected ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-300 text-white shadow-glow-purple scale-[1.01]' : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:bg-slate-800/80'} ${hasVoted ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-slate-900 rounded-lg">{p.avatar || '🕵️'}</span>
                        <span className="text-base">{p.nickname}</span>
                      </div>
                      {isSelected && <span className="text-amber-300 text-xl font-black">✓</span>}
                    </button>
                  );
                })
              )}
            </div>

            <div className="pt-2">
              {hasVoted ? (
                <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-xl p-3 text-center shadow-glow-green">
                  <p className="font-display font-black text-emerald-300 text-sm">✅ Vote recorded! Waiting for others...</p>
                  <p className="font-body text-emerald-400/80 text-xs mt-0.5">{votedCount}/{totalPlayers} votes submitted</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCastVote}
                  disabled={!selectedVote}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-black text-base rounded-xl transition-all shadow-glow-green active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  ✅ Lock In Vote
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
            <div className="card p-5 sm:p-6 shadow-2xl backdrop-blur-2xl text-center bg-slate-900/90 border border-slate-700/70">
              {roundResults ? (
                <>
                  <div className="text-5xl mb-1.5 animate-bounce">{roundResults.isImposterCaught ? '🎯' : '💨'}</div>
                  <h2 className="font-display font-black text-2xl mb-1">
                    {roundResults.isImposterCaught ? <span className="text-emerald-400">IMPOSTER CAUGHT!</span> : <span className="text-rose-400">IMPOSTER SURVIVED!</span>}
                  </h2>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 my-3">
                    <p className="font-body text-slate-400 text-xs">The secret imposter was:</p>
                    <p className="font-display font-black text-xl text-rose-400 flex items-center justify-center gap-2 mt-0.5">
                      <span>{roundResults.imposter.avatar || '🕵️'}</span>
                      <span>{roundResults.imposter.nickname}</span>
                    </p>
                    <p className="font-body text-slate-400 text-xs mt-1">
                      Their decoy word was: <span className="font-display font-bold text-amber-300">{roundResults.imposter.word}</span>
                    </p>
                  </div>

                  <h3 className="font-display font-black text-xs text-slate-300 mb-2 text-left uppercase tracking-wider">📊 Match Standings</h3>
                  <div className="space-y-1 bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 max-h-44 overflow-y-auto">
                    {[...roundResults.players].sort((a, b) => b.leaguePoints - a.leaguePoints).map((p) => (
                      <div key={p.playerId} className="flex justify-between items-center font-body text-xs sm:text-sm py-1 border-b border-slate-800/80 last:border-0">
                        <span className="text-slate-200 flex items-center gap-1.5 truncate">
                          <span>{p.avatar || '🕵️'}</span>
                          <span className="truncate">{p.nickname}</span>
                          {p.isImposter && <span className="text-[10px] px-1 rounded bg-rose-950 text-rose-300 border border-rose-800">Imposter</span>}
                        </span>
                        <span className="font-display font-black text-amber-300 text-xs shrink-0 ml-2">{p.oldPoints} + {p.roundPoints} = {p.leaguePoints} pts</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3.5 flex items-center justify-center gap-2">
                    <span className="animate-spin text-amber-300">⏳</span>
                    <p className="font-body text-slate-400 text-xs">{currentGame >= 10 ? 'Final Podium results loading...' : 'Next round starting in 8s...'}</p>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className="animate-spin text-3xl mb-2 text-purple-400">⚙️</div>
                  <p className="font-body text-slate-400 text-sm">Calculating round results...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {hostKickModal}
      </ScreenShell>
    );
  }

  // Loading
  return (
    <ScreenShell compact>
      {gameHeader}
      <div className="flex-1 flex items-center justify-center">
        <p className="font-body text-slate-400 animate-pulse">Loading BluffHunt session...</p>
      </div>
      {hostKickModal}
    </ScreenShell>
  );
};

export default GameScreen;