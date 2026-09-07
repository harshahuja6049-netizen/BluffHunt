// frontend/src/pages/GameScreen.jsx

import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket, { emitRejoin, setHasJoinedRoom } from '../socket';
import ScreenShell from '../components/ScreenShell';
import LeaveButton from '../components/LeaveButton';
import { soundEffects } from '../utils/soundEffects';
import { VoiceChatManager } from '../utils/voiceChat';
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
  const [readyPlayerIds, setReadyPlayerIds] = useState([]);
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
  const [voiceStatus, setVoiceStatus] = useState({ isEnabled: false, isMuted: true, error: null });
  const [speakingPlayers, setSpeakingPlayers] = useState({});
  const voiceManagerRef = useRef(null);
  const pendingTimeoutRef = useRef(null);
  const playedResultsSoundRef = useRef(false);

  const currentPlayerId = localStorage.getItem('playerId');
  const isHost = currentPlayerId === hostId;

  // DERIVED
  const currentPlayer = players.find((p) => p.playerId === currentPlayerId);
  const hasAcknowledged = currentPlayer ? currentPlayer.hasAcknowledgedWord : false;
  const displayWord = currentWord || (currentPlayer ? currentPlayer.word : '');
  const displayIsImposter = isImposter || (currentPlayer ? currentPlayer.isImposter : false);

  const playResultsAudio = (isCaught) => {
    if (playedResultsSoundRef.current) return;
    playedResultsSoundRef.current = true;
    if (isCaught) {
      soundEffects.playImposterCaught();
    } else {
      soundEffects.playImposterEscaped();
    }
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
      if (typeof data.hasVoted === 'boolean') setHasVoted(data.hasVoted);
      if (typeof data.readyCount === 'number') setReadyCount(data.readyCount);
      if (Array.isArray(data.readyPlayerIds)) setReadyPlayerIds(data.readyPlayerIds);
      if (typeof data.isRevote === 'boolean') setIsRevote(data.isRevote);
      if (Array.isArray(data.tiedPlayerIds)) setTiedPlayerIds(data.tiedPlayerIds);
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

      if (data.status === 'reveal') {
        playedResultsSoundRef.current = false;
        setHasVoted(false);
        setSelectedVote('');
        setRoundResults(null);
        setIsReadyToVote(false);
        setReadyCount(0);
        setReadyPlayerIds([]);
        setVotedCount(0);
        setIsRevote(false);
        setTiedPlayerIds([]);
      }

      if (data.status === 'discussion') {
        setReadyCount(data.readyCount || 0);
        setIsReadyToVote(false);
        setReadyPlayerIds(data.readyPlayerIds || []);
      }

      if (data.status === 'voting') {
        setHasVoted(false);
        setSelectedVote('');
        setVotedCount(0);
        if (data.isRevote) {
          setIsRevote(true);
          setTiedPlayerIds(data.tiedPlayerIds || []);
          setRevoteMessage(data.message || 'Tie detected! Revoting among tied players.');
          soundEffects.playTieSound();
        } else {
          setIsRevote(false);
          setTiedPlayerIds([]);
          setRevoteMessage('');
        }
      }

      if (data.status === 'results' && data.results) {
        console.log('📊 results data in phase-changed:', data.results);
        setRoundResults(data.results);
        playResultsAudio(data.results.isImposterCaught);
      }
    };

    const onRoundResults = (data) => {
      console.log('📊 round-results received:', data);
      setRoundResults(data);
      setPhase('results');
      playResultsAudio(data.isImposterCaught);
    };

    const onReadyProgress = (data) => {
      if (typeof data.readyCount === 'number') setReadyCount(data.readyCount);
      if (typeof data.totalPlayers === 'number') setTotalPlayers(data.totalPlayers);
      if (Array.isArray(data.readyPlayerIds)) setReadyPlayerIds(data.readyPlayerIds);
    };

    const onReadyToVoteUpdated = (data) => {
      if (typeof data.readyCount === 'number') setReadyCount(data.readyCount);
      if (typeof data.totalPlayers === 'number') setTotalPlayers(data.totalPlayers);
      if (Array.isArray(data.readyPlayerIds)) setReadyPlayerIds(data.readyPlayerIds);
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

    const onNextRound = (data) => {
      playedResultsSoundRef.current = false;
      setPhase('reveal');
      setAcknowledgedCount(0);
      setHasVoted(false);
      setSelectedVote('');
      setRoundResults(null);
      setIsReadyToVote(false);
      setReadyCount(0);
      setReadyPlayerIds([]);
      setVotedCount(0);
      setIsRevote(false);
      setTiedPlayerIds([]);
      setIsWaitingSpectator(false);
      if (pendingTimeoutRef.current) clearTimeout(pendingTimeoutRef.current);
      setPendingAcknowledge(false);
      if (data.leagueGameNumber) setCurrentGame(data.leagueGameNumber);
      if (data.players) setPlayers(data.players);
    };

    const onRoundReset = (data) => {
      onNextRound(data);
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
    socket.on('ready-progress', onReadyProgress);
    socket.on('ready-to-vote-updated', onReadyToVoteUpdated);
    socket.on('vote-recorded', onVoteRecorded);
    socket.on('voting-progress', onVotingProgress);
    socket.on('acknowledge-progress', onAcknowledgeProgress);
    socket.on('player-ready', onPlayerReady);
    socket.on('next-round', onNextRound);
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
      socket.off('ready-progress', onReadyProgress);
      socket.off('ready-to-vote-updated', onReadyToVoteUpdated);
      socket.off('vote-recorded', onVoteRecorded);
      socket.off('voting-progress', onVotingProgress);
      socket.off('acknowledge-progress', onAcknowledgeProgress);
      socket.off('player-ready', onPlayerReady);
      socket.off('next-round', onNextRound);
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

  // Sync peers for voice chat
  useEffect(() => {
    if (voiceManagerRef.current && voiceManagerRef.current.isEnabled) {
      voiceManagerRef.current.syncPeers(players);
    }
  }, [players]);

  // Clean up voice manager on unmount
  useEffect(() => {
    return () => {
      if (voiceManagerRef.current) {
        voiceManagerRef.current.destroy();
        voiceManagerRef.current = null;
      }
    };
  }, []);

  // Request word from server if missing in reveal phase
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
  const handleToggleMic = async () => {
    if (!voiceManagerRef.current) {
      const vm = new VoiceChatManager(socket, currentPlayerId, {
        onSpeakingChange: (speakingId, isSpeaking) => {
          setSpeakingPlayers((prev) => ({ ...prev, [speakingId]: isSpeaking }));
        },
        onStatusChange: (status) => {
          setVoiceStatus(status);
        }
      });
      voiceManagerRef.current = vm;
      const success = await vm.init();
      if (success) {
        soundEffects.playMicToggleSound(true);
        vm.syncPeers(players);
      } else {
        showToast('Microphone access denied: ' + (vm.error || 'Please check browser permissions'), 'error');
      }
      return;
    }

    const vm = voiceManagerRef.current;
    if (!vm.isEnabled) {
      const success = await vm.init();
      if (success) {
        soundEffects.playMicToggleSound(true);
        vm.syncPeers(players);
      }
      return;
    }

    const nowMuted = vm.toggleMute();
    soundEffects.playMicToggleSound(!nowMuted);
  };

  const handleReadyToVote = () => {
    if (isReadyToVote) return;
    setIsReadyToVote(true);
    soundEffects.playReadySound();
    socket.emit('ready-to-vote');
  };

  const handleCastVote = () => {
    if (!selectedVote || hasVoted) return;
    soundEffects.playVoteCast();
    socket.emit('cast-vote', { accusedId: selectedVote });
    setHasVoted(true);
    setVotedCount((prev) => prev + 1);
  };

  const handleStartNextGame = () => {
    if (!isHost) return;
    soundEffects.playStartGameSound();
    socket.emit('start-next-game');
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
                  ⏩ Start Discussion Now (Host Override)
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
  // DISCUSSION PHASE (Direct Clue Sharing via Mic or Circle)
  // =============================================
  if (phase === 'discussion' || phase === 'clue') {
    return (
      <ScreenShell compact>
        {gameHeader}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Secret / Decoy Word Reminder Card */}
          <div className="card p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg shrink-0 flex items-center justify-between backdrop-blur-xl">
            <div>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block">
                {displayIsImposter ? '🕵️ Your Decoy Word' : '🛡️ Your Secret Word'}
              </span>
              <span className="font-display font-black text-xl sm:text-2xl text-amber-300">
                {displayWord || 'Secret Word'}
              </span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-display font-black uppercase tracking-wider ${displayIsImposter ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'}`}>
              {displayIsImposter ? 'Imposter' : 'Agent'}
            </span>
          </div>

          {/* ONLINE MODE: Real-Time Voice Chat & Speaking Indicators */}
          {mode === 'online' && (
            <div className="flex-1 card p-4 bg-slate-900/85 border border-slate-700/60 shadow-xl backdrop-blur-xl flex flex-col justify-between min-h-0">
              <div className="text-center mb-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-display font-bold text-cyan-300 mb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Live Voice Clue Discussion
                </div>
                <p className="font-body text-xs text-slate-300">
                  Share clues by talking out loud! No typing — mic discussion only.
                </p>
              </div>

              {/* Voice Chat Speaking Avatars Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 my-2 max-h-48 overflow-y-auto p-1">
                {players
                  .filter((p) => p.isConnected !== false && !p.isWaitingForNextRound)
                  .map((p) => {
                    const isSpeaking = Boolean(speakingPlayers[p.playerId]);
                    const isSelf = p.playerId === currentPlayerId;
                    const isPlayerReady = (readyPlayerIds || []).includes(p.playerId);

                    return (
                      <div
                        key={p.playerId}
                        className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all duration-200 ${
                          isSpeaking
                            ? 'bg-emerald-950/70 border-emerald-400 shadow-glow-green scale-105 ring-2 ring-emerald-400/50'
                            : 'bg-slate-950/70 border-slate-800/80'
                        }`}
                      >
                        <div className="relative">
                          <span className="text-3xl">{p.avatar || '🕵️'}</span>
                          {isSpeaking && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                            </span>
                          )}
                        </div>
                        <span className="font-display font-bold text-xs text-white mt-1 truncate max-w-[80px]">
                          {p.nickname} {isSelf && '(You)'}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          {isSpeaking ? (
                            <span className="text-[10px] font-display font-bold text-emerald-300 flex items-center gap-0.5">
                              <span className="animate-bounce">🎙️</span> Talking
                            </span>
                          ) : isPlayerReady ? (
                            <span className="text-[10px] font-display font-bold text-amber-300">✅ Ready</span>
                          ) : (
                            <span className="text-[10px] font-display text-slate-500">⏳ Clue</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Mic Button & Control */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`w-full py-3.5 sm:py-4 rounded-2xl font-display font-black text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl ${
                    !voiceStatus.isEnabled
                      ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-glow-purple ring-2 ring-cyan-400/40 animate-pulse'
                      : voiceStatus.isMuted
                      ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/50'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-glow-green ring-2 ring-emerald-400/60'
                  }`}
                >
                  {!voiceStatus.isEnabled ? (
                    <>
                      <span className="text-xl animate-bounce">🎙️</span>
                      <span>Turn On Microphone to Talk</span>
                    </>
                  ) : voiceStatus.isMuted ? (
                    <>
                      <span className="text-xl">🔇</span>
                      <span>Mic Muted (Tap to Unmute & Speak)</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl animate-pulse">🎙️</span>
                      <span>Mic LIVE (Tap to Mute)</span>
                    </>
                  )}
                </button>

                {/* Ready to Vote Button PLACED DIRECTLY BELOW MIC */}
                <button
                  type="button"
                  onClick={handleReadyToVote}
                  disabled={isReadyToVote}
                  className={`w-full py-3.5 rounded-2xl font-display font-black text-base transition-all duration-150 active:scale-[0.98] shadow-lg ${
                    isReadyToVote
                      ? 'bg-slate-800/80 text-slate-400 border border-slate-700/50 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-glow-gold'
                  }`}
                >
                  {isReadyToVote
                    ? `⏳ Waiting for Players (${readyCount}/${totalPlayers} Ready)`
                    : `🗳️ I'm Ready to Vote (${readyCount}/${totalPlayers} Ready)`}
                </button>

                {isHost && (
                  <button
                    type="button"
                    onClick={() => socket.emit('force-advance-discussion')}
                    className="w-full py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-display font-bold text-xs rounded-xl transition-all active:scale-95"
                  >
                    ⏩ Force Start Voting (Host Override)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* OFFLINE MODE: In-Person Circle Discussion */}
          {mode === 'offline' && (
            <div className="flex-1 card p-5 bg-slate-900/85 border border-slate-700/60 shadow-xl backdrop-blur-xl flex flex-col justify-between min-h-0 text-center">
              <div>
                <div className="text-5xl mb-2">🗣️</div>
                <h3 className="font-display font-black text-2xl text-white mb-2">Circle Discussion</h3>
                <p className="font-body text-slate-300 text-sm mb-4 leading-relaxed">
                  Sit together in a circle! Say your clues out loud to each other in any order you choose. Debate and catch the Imposter!
                </p>

                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl mb-4">
                  <p className="font-body text-xs text-amber-300 font-bold mb-1">
                    When everyone in your circle has spoken and you&apos;re ready to vote, press the button below:
                  </p>
                  <p className="font-display font-black text-sm text-white">
                    {readyCount} of {totalPlayers} players ready to vote
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5 justify-center">
                    {players
                      .filter((p) => p.isConnected !== false && !p.isWaitingForNextRound)
                      .map((p) => {
                        const isReady = (readyPlayerIds || []).includes(p.playerId) || (p.playerId === currentPlayerId && isReadyToVote);
                        return (
                          <span
                            key={p.playerId}
                            className={`text-[11px] px-2.5 py-1 rounded-full font-display font-bold flex items-center gap-1 ${
                              isReady
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                : 'bg-slate-950 text-slate-500 border border-slate-800'
                            }`}
                          >
                            <span>{p.avatar || '🕵️'}</span>
                            <span>{p.nickname}</span>
                            <span>{isReady ? '✅' : '⏳'}</span>
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleReadyToVote}
                  disabled={isReadyToVote}
                  className={`w-full py-4 rounded-2xl font-display font-black text-base transition-all duration-150 active:scale-[0.98] shadow-lg ${
                    isReadyToVote
                      ? 'bg-slate-800/80 text-slate-400 border border-slate-700/50 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-glow-gold'
                  }`}
                >
                  {isReadyToVote
                    ? `⏳ Waiting for Circle (${readyCount}/${totalPlayers} Ready)`
                    : `🗳️ I'm Ready to Vote (${readyCount}/${totalPlayers} Ready)`}
                </button>

                {isHost && (
                  <button
                    type="button"
                    onClick={() => socket.emit('force-advance-discussion')}
                    className="w-full py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-display font-bold text-xs rounded-xl transition-all active:scale-95"
                  >
                    ⏩ Force Start Voting (Host Override)
                  </button>
                )}
              </div>
            </div>
          )}
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
                      onClick={() => {
                        if (hasVoted) return;
                        setSelectedVote(p.playerId);
                        soundEffects.playSelectSound();
                      }}
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
  // RESULTS PHASE (Host Controls Next Game - No Auto 8s Timer)
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

                  {/* Next Game Host Trigger - No 8s Countdown */}
                  <div className="mt-4 pt-2 border-t border-slate-800">
                    {currentGame >= 10 ? (
                      <div className="flex items-center justify-center gap-2 text-amber-300 py-2">
                        <span className="animate-spin">🏆</span>
                        <p className="font-display font-black text-sm">League Complete! Loading Grand Finale Podium...</p>
                      </div>
                    ) : isHost ? (
                      <button
                        type="button"
                        onClick={handleStartNextGame}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-display font-black text-base rounded-2xl shadow-glow-purple transition-all duration-150 active:scale-[0.98]"
                      >
                        🎮 Start Game {currentGame + 1} of 10
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-slate-400 py-2">
                        <span className="animate-spin text-amber-300">⏳</span>
                        <p className="font-display font-bold text-xs sm:text-sm">
                          Waiting for Host to start Game {currentGame + 1}...
                        </p>
                      </div>
                    )}
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