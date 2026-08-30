// frontend/src/pages/GameScreen.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket, { emitRejoin } from '../socket';
import ScreenShell from '../components/ScreenShell';
import LeaveButton from '../components/LeaveButton';

const GameScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [votingOpen, setVotingOpen] = useState(false);
  const [selectedVote, setSelectedVote] = useState('');
  const [roundResults, setRoundResults] = useState(null);
  const [currentGame, setCurrentGame] = useState(initialGame || 1);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [readyCount, setReadyCount] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState((initialPlayers || []).length);
  const [verbalReady, setVerbalReady] = useState(false);
  const [preparedCount, setPreparedCount] = useState(0);

  const currentPlayerId = localStorage.getItem('playerId');

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
        setTotalPlayers(data.players.filter((p) => p.isConnected !== false).length);
      }
      if (data.hostId) {
        setHostId(data.hostId);
        localStorage.setItem('hostId', data.hostId);
      }
      if (data.mode) setMode(data.mode);
      if (data.leagueGameNumber) setCurrentGame(data.leagueGameNumber);
      if (data.word) setCurrentWord(data.word);
      if (typeof data.isImposter === 'boolean') setIsImposter(data.isImposter);
      if (Array.isArray(data.clues) && data.clues.length) setClues(data.clues);
      if (typeof data.hasAcknowledgedWord === 'boolean') setHasAcknowledged(data.hasAcknowledgedWord);
      if (typeof data.hasVoted === 'boolean') setHasVoted(data.hasVoted);
      if (typeof data.hasVerballyPrepared === 'boolean') setVerbalReady(data.hasVerballyPrepared);
      if (data.status === 'voting') setVotingOpen(true);
      if (data.status === 'clue') {
        const speakerQueue = data.speakerQueue || [];
        const currentIndex = data.currentSpeakerIndex || 0;
        setIsMyTurn(speakerQueue[currentIndex] === currentPlayerId);
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
        setTotalPlayers(data.players.filter((p) => p.isConnected !== false).length);
      }
      if (data.mode) setMode(data.mode);
      if (data.leagueGameNumber) setCurrentGame(data.leagueGameNumber);

      if (data.status === 'clue') {
        const speakerQueue = data.speakerQueue || [];
        const currentIndex = data.currentSpeakerIndex || 0;
        setIsMyTurn(speakerQueue[currentIndex] === currentPlayerId);
        setVerbalReady(false);
      }
      if (data.status === 'discussion') {
        setIsMyTurn(false);
        setReadyCount(0);
      }
      if (data.status === 'voting') {
        setVotingOpen(true);
      }
      if (data.status === 'reveal') {
        setClues([]);
        setChatMessages([]);
        setHasVoted(false);
        setVotingOpen(false);
        setSelectedVote('');
        setRoundResults(null);
        setHasAcknowledged(false);
        setReadyCount(0);
        setVotedCount(0);
      }
    };

    const onClueSubmitted = (data) => {
      setClues((prev) => [...prev, { nickname: data.nickname, clue: data.clue }]);
    };
    const onYourTurn = () => setIsMyTurn(true);
    const onChatMessage = (data) => {
      setChatMessages((prev) => [...prev, { nickname: data.nickname, message: data.message }]);
    };
    const onRoundResults = (data) => {
      setRoundResults(data);
      setPhase('results');
      setVotingOpen(false);
    };
    const onNextRound = (data) => {
      setCurrentGame(data.leagueGameNumber);
      setPlayers(data.players || []);
      setClues([]);
      setChatMessages([]);
      setHasVoted(false);
      setVotingOpen(false);
      setRoundResults(null);
      setPhase('reveal');
      setHasAcknowledged(false);
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
      setTotalPlayers((data.players || []).filter((p) => p.isConnected !== false).length);
      if (data.hostId) localStorage.setItem('hostId', data.hostId);
    };
    const onPlayerReady = (data) => {
      setReadyCount(data.totalReady);
      setTotalPlayers(data.totalPlayers);
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
      setPreparedCount(data.preparedCount);
      setTotalPlayers(data.totalPlayers);
    };
    const onVoteSubmitted = () => {
      setHasVoted(true);
      setVotingOpen(false);
    };
    const onError = (data) => {
      if (data && data.message) setIsMyTurn(true);
      alert(data.message);
    };
    const onKicked = (data) => {
      alert(data.message);
      navigate('/');
    };

    socket.on('connect', onConnect);
    socket.on('game-state', onGameState);
    socket.on('your-word', onYourWord);
    socket.on('phase-changed', onPhaseChanged);
    socket.on('clue-submitted', onClueSubmitted);
    socket.on('your-turn', onYourTurn);
    socket.on('chat-message', onChatMessage);
    socket.on('round-results', onRoundResults);
    socket.on('next-round', onNextRound);
    socket.on('league-complete', onLeagueComplete);
    socket.on('players-updated', onPlayersUpdated);
    socket.on('player-ready', onPlayerReady);
    socket.on('ready-progress', onReadyProgress);
    socket.on('vote-progress', onVoteProgress);
    socket.on('verbal-progress', onVerbalProgress);
    socket.on('vote-submitted', onVoteSubmitted);
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
      socket.off('round-results', onRoundResults);
      socket.off('next-round', onNextRound);
      socket.off('league-complete', onLeagueComplete);
      socket.off('players-updated', onPlayersUpdated);
      socket.off('player-ready', onPlayerReady);
      socket.off('ready-progress', onReadyProgress);
      socket.off('vote-progress', onVoteProgress);
      socket.off('verbal-progress', onVerbalProgress);
      socket.off('vote-submitted', onVoteSubmitted);
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

  const handleSendChat = () => {
    if (!chatInput.trim() || hasVoted) return;
    socket.emit('send-chat', { message: chatInput.trim() });
    setChatInput('');
  };

  const handleReadyToVote = () => socket.emit('ready-to-vote');

  const handleCastVote = () => {
    if (!selectedVote) return;
    socket.emit('cast-vote', { accusedId: selectedVote });
  };

  const votingOverlay = (canClose) => (
    votingOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-xl text-bluff-charcoal">🔍 Who is the Imposter?</h3>
            {canClose && (
              <button type="button" onClick={() => setVotingOpen(false)} className="text-bluff-muted text-2xl">✕</button>
            )}
          </div>
          <div className="space-y-2">
            {players
              .filter((p) => p.playerId !== currentPlayerId && p.isConnected !== false)
              .map((p) => (
                <button
                  type="button"
                  key={p.playerId}
                  onClick={() => setSelectedVote(p.playerId)}
                  className={`w-full py-3 rounded-xl font-display font-semibold text-center ${
                    selectedVote === p.playerId
                      ? 'bg-bluff-purple text-white'
                      : 'bg-gray-100 text-bluff-charcoal'
                  }`}
                >
                  {p.nickname}
                </button>
              ))}
          </div>
          <button
            type="button"
            onClick={handleCastVote}
            disabled={!selectedVote}
            className="w-full mt-4 py-3 bg-bluff-gold text-bluff-charcoal font-display font-bold rounded-xl hover:bg-yellow-500 disabled:opacity-50"
          >
            ✅ Confirm Vote
          </button>
          {votedCount > 0 && (
            <p className="mt-2 text-center font-body text-sm text-bluff-muted">
              {votedCount}/{totalPlayers} voted
            </p>
          )}
        </div>
      </div>
    )
  );

  // ---- REVEAL PHASE ----
  if (phase === 'reveal') {
    return (
      <ScreenShell compact>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
              <p className="font-body text-bluff-muted text-sm mb-2">Game {currentGame} of 10</p>
              {!currentWord ? (
                <p className="font-body text-bluff-muted">Getting your secret word...</p>
              ) : isImposter ? (
                <>
                  <div className="text-6xl mb-4">🕵️</div>
                  <h2 className="font-display font-bold text-3xl text-bluff-pink mb-2">YOU ARE THE IMPOSTER!</h2>
                  <p className="font-body text-bluff-muted text-lg">Your word is:</p>
                  <p className="font-display font-extrabold text-5xl text-bluff-gold mt-3">
                    {currentWord}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">📝</div>
                  <p className="font-body text-bluff-muted text-lg">Your secret word is:</p>
                  <p className="font-display font-extrabold text-5xl text-bluff-gold mt-3">
                    {currentWord}
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  socket.emit('acknowledge-word');
                  setHasAcknowledged(true);
                }}
                disabled={!currentWord || hasAcknowledged}
                className="mt-6 py-3 px-8 bg-bluff-purple text-white font-display font-bold rounded-xl hover:bg-bluff-purple-dark disabled:opacity-50 transition-all"
              >
                {hasAcknowledged ? '⏳ Waiting for others...' : '👁️ I Know My Word'}
              </button>
            </div>
          </div>
        </div>
        <div className="shrink-0 pb-4">
          <LeaveButton compact />
        </div>
      </ScreenShell>
    );
  }

  // ---- CLUE PHASE ----
  if (phase === 'clue') {
    return (
      <ScreenShell compact>
        <div className="flex-1 flex flex-col">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-4">
            <h2 className="font-display font-bold text-xl text-white">Clue Phase</h2>
            <p className="font-body text-bluff-muted text-sm mb-1">Game {currentGame} of 10</p>
            <p className="font-body text-bluff-muted text-xs mb-3">
              Your word: <span className="font-display font-bold text-bluff-gold">{currentWord}</span>
              {isImposter && ' 🕵️'}
            </p>

            <div className="mb-3 max-h-40 overflow-y-auto space-y-1 bg-black/20 rounded-xl p-2">
              {clues.length === 0 && (
                <p className="font-body text-bluff-muted text-xs text-center">Waiting for first clue...</p>
              )}
              {clues.map((c, i) => (
                <p key={`${c.nickname}-${i}`} className="font-body text-sm text-white/80">
                  <span className="font-semibold text-bluff-gold">{c.nickname}</span> → {c.clue}
                </p>
              ))}
            </div>

            {mode === 'offline' ? (
              <button
                type="button"
                onClick={() => {
                  socket.emit('verbal-ready');
                  setVerbalReady(true);
                }}
                disabled={verbalReady}
                className="w-full py-3 bg-bluff-purple text-white font-display font-bold rounded-xl disabled:opacity-50 transition-all"
              >
                {verbalReady ? `⏳ Waiting... (${preparedCount}/${totalPlayers})` : "🗣️ I've said my clue out loud"}
              </button>
            ) : isMyTurn ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your clue (1-3 words)..."
                  className="flex-1 p-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bluff-purple font-body text-white placeholder:text-bluff-muted"
                  value={clue}
                  onChange={(e) => setClue(e.target.value)}
                  maxLength={30}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitClue()}
                />
                <button
                  type="button"
                  onClick={handleSubmitClue}
                  className="px-4 py-3 bg-bluff-purple text-white font-display font-bold rounded-xl hover:bg-bluff-purple-dark transition-all"
                >
                  Send
                </button>
              </div>
            ) : (
              <p className="font-body text-bluff-muted text-center py-3">⏳ Waiting for other players...</p>
            )}
          </div>
        </div>
        <div className="shrink-0 pb-4">
          <LeaveButton compact />
        </div>
      </ScreenShell>
    );
  }

  // ---- DISCUSSION / VOTING PHASE ----
  if (phase === 'discussion' || phase === 'voting') {
    return (
      <ScreenShell compact>
        <div className="flex-1 flex flex-col gap-3">
          {/* Clues Summary */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-3">
            <h2 className="font-display font-bold text-lg text-white">
              {phase === 'voting' ? '🗳️ Vote Now' : '💬 Discuss Now'}
            </h2>
            <p className="font-body text-bluff-muted text-xs">Game {currentGame} of 10</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {clues.map((c, i) => (
                <span key={`${c.nickname}-${i}`} className="font-body text-xs bg-black/30 rounded-full px-2 py-0.5 text-white/70">
                  <span className="font-semibold text-bluff-gold">{c.nickname}</span> → {c.clue}
                </span>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-3 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-1 max-h-40">
              {chatMessages.length === 0 && (
                <p className="font-body text-bluff-muted text-xs text-center">No messages yet...</p>
              )}
              {chatMessages.map((msg, i) => (
                <p key={`${msg.nickname}-${i}`} className="font-body text-sm text-white/80">
                  <span className="font-semibold text-bluff-gold">{msg.nickname}</span> → {msg.message}
                </p>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder={hasVoted ? 'You have voted. Chat locked.' : 'Type your message...'}
                className="flex-1 p-2 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bluff-purple font-body text-white placeholder:text-bluff-muted text-sm"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={hasVoted || phase === 'voting'}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button
                type="button"
                onClick={handleSendChat}
                disabled={hasVoted || phase === 'voting'}
                className="px-3 py-2 bg-bluff-blue text-white font-display font-bold rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all text-sm"
              >
                Send
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          {phase === 'discussion' && (
            <div className="flex gap-2 shrink-0">
              {!hasVoted && (
                <button
                  type="button"
                  onClick={() => setVotingOpen(true)}
                  className="flex-1 py-3 bg-bluff-pink text-white font-display font-bold rounded-xl hover:bg-pink-600 transition-all"
                >
                  🗳️ Vote
                </button>
              )}
              <button
                type="button"
                onClick={handleReadyToVote}
                className="flex-1 py-3 bg-white/10 text-white font-display font-bold rounded-xl hover:bg-white/20 transition-all border border-white/10"
              >
                Ready ({readyCount}/{totalPlayers || players.length})
              </button>
            </div>
          )}
        </div>
        <div className="shrink-0 pb-4">
          <LeaveButton compact />
        </div>
        {votingOverlay(phase === 'discussion')}
      </ScreenShell>
    );
  }

  // ---- RESULTS PHASE ----
  if (phase === 'results') {
    return (
      <ScreenShell compact>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              {roundResults ? (
                <>
                  <h2 className="font-display font-bold text-2xl text-center mb-3">
                    {roundResults.isImposterCaught ? (
                      <span className="text-bluff-green">✅ Imposter CAUGHT!</span>
                    ) : (
                      <span className="text-bluff-pink">❌ Imposter SURVIVED!</span>
                    )}
                  </h2>
                  <div className="text-center mb-4">
                    <p className="font-body text-bluff-muted">
                      🕵️ Imposter: <span className="font-bold text-white">{roundResults.imposter.nickname}</span>
                    </p>
                    <p className="font-body text-bluff-muted">
                      Word: <span className="font-display font-bold text-bluff-gold">{roundResults.imposter.word}</span>
                    </p>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">📊 Score Update</h3>
                  <div className="space-y-1 bg-black/20 rounded-xl p-3">
                    {roundResults.players.map((p) => (
                      <div key={p.playerId} className="flex justify-between font-body text-sm">
                        <span className="text-white/80">{p.nickname}{p.isImposter ? ' 🕵️' : ''}</span>
                        <span className="font-display font-bold text-bluff-gold">
                          {p.oldPoints} + {p.roundPoints} = {p.leaguePoints}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-center font-body text-bluff-muted text-xs">
                    Next round in 8 seconds...
                  </p>
                </>
              ) : (
                <p className="text-center font-body text-bluff-muted">Calculating results...</p>
              )}
            </div>
          </div>
        </div>
        <div className="shrink-0 pb-4">
          <LeaveButton compact />
        </div>
      </ScreenShell>
    );
  }

  // ---- LOADING ----
  return (
    <ScreenShell compact>
      <div className="flex-1 flex items-center justify-center">
        <p className="font-body text-bluff-muted">Loading game...</p>
      </div>
    </ScreenShell>
  );
};

export default GameScreen;