const LEAGUE_GAMES = 10;
const AGENT_BONUS = 3;
const IMPOSTER_SURVIVAL_BONUS = 5;
const CORRECT_DETECTIVE_BONUS = 2;
const ZERO_VOTES_BONUS = 2;
const MAX_PLAYERS = 10;
const IN_PROGRESS_STATUSES = ['reveal', 'clue', 'discussion', 'voting', 'results'];

function connectedPlayers(session) {
  return (session.players || []).filter((p) => p.isConnected !== false);
}

function roundPlayers(session) {
  return connectedPlayers(session).filter((p) => p.isWaitingForNextRound !== true);
}

function publicPlayers(session) {
  return session.players.map((p) => ({
    playerId: p.playerId,
    nickname: p.nickname,
    isConnected: p.isConnected,
    leaguePoints: p.leaguePoints,
    clueSubmitted: p.clueSubmitted,
    hasAcknowledgedWord: p.hasAcknowledgedWord,
    hasVoted: p.hasVoted,
    hasVerballyPrepared: p.hasVerballyPrepared,
    isWaitingForNextRound: p.isWaitingForNextRound === true,
    joinedAt: p.joinedAt || null
  }));
}

function publicPendingJoins(session) {
  return (session.pendingJoins || []).map((req) => ({
    requestId: req.requestId,
    playerId: req.playerId,
    nickname: req.nickname
  }));
}

function transferHostIfNeeded(session, leavingPlayerId) {
  if (session.hostId !== leavingPlayerId) return false;
  const nextHost = connectedPlayers(session)[0];
  session.hostId = nextHost ? nextHost.playerId : null;
  return true;
}

function promoteWaitingPlayers(session) {
  (session.players || []).forEach((p) => {
    if (p.isConnected !== false) p.isWaitingForNextRound = false;
  });
}

function roomOccupancy(session) {
  return connectedPlayers(session).length + (session.pendingJoins || []).length;
}

function validateNickname(nickname) {
  if (!nickname || String(nickname).trim().length < 2 || String(nickname).trim().length > 15) {
    return 'Nickname must be 2-15 characters.';
  }
  return null;
}

function containsSecretWord(text, word, minWordLength = 0) {
  if (!word) return false;
  if (word.length < minWordLength) return false;
  return String(text).toLowerCase().includes(String(word).toLowerCase());
}

function secretWords(session) {
  const agentWord = session.players.find((p) => p.isImposter === false)?.word || '';
  const imposterWord = session.players.find((p) => p.isImposter === true)?.word || '';
  return { agentWord, imposterWord };
}

function validateClue(session, playerId, clue) {
  const player = session.players.find((p) => p.playerId === playerId);
  if (!player) return 'Player not found.';
  if (player.clueSubmitted) return 'You already submitted a clue.';

  const trimmedClue = String(clue || '').trim();
  if (!trimmedClue) return 'Please type a clue.';

  const wordCount = trimmedClue.split(/\s+/).length;
  if (wordCount < 1 || wordCount > 3) return 'Type 1 to 3 words only.';
  if (trimmedClue.replace(/\s/g, '').length > 20) {
    return 'Maximum 20 characters (ignoring spaces).';
  }

  const duplicate = session.players.some(
    (p) => p.clueSubmitted && p.clueSubmitted.toLowerCase() === trimmedClue.toLowerCase()
  );
  if (duplicate) return 'That clue was already used by someone else.';

  const { agentWord, imposterWord } = secretWords(session);
  if (containsSecretWord(trimmedClue, agentWord)) {
    return 'Your clue contains the secret word!';
  }
  if (containsSecretWord(trimmedClue, imposterWord)) {
    return "Your clue contains the Imposter's word!";
  }
  return null;
}

function validateChat(session, playerId, message) {
  const player = session.players.find((p) => p.playerId === playerId);
  if (!player) return 'Player not found.';
  if (player.hasVoted) return 'You have already voted. Chat is locked.';

  const trimmedMessage = String(message || '').trim();
  if (!trimmedMessage) return 'Please type a message.';
  if (trimmedMessage.length > 200) return 'Maximum 200 characters.';

  const { agentWord, imposterWord } = secretWords(session);
  if (containsSecretWord(trimmedMessage, agentWord, 3)) {
    return 'Your message contains the secret word!';
  }
  if (containsSecretWord(trimmedMessage, imposterWord, 3)) {
    return "Your message contains the Imposter's word!";
  }
  return null;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function assignWordsAndImposter(session, wordBank) {
  const usedAgentWords = (session.usedPairs || []).map((p) => p.agent);
  const usedImposterWords = (session.usedPairs || []).map((p) => p.imposter);
  const allUsedWords = [...usedAgentWords, ...usedImposterWords];
  let availablePairs = wordBank.filter(
    (pair) => !allUsedWords.includes(pair.agent) && !allUsedWords.includes(pair.imposter)
  );
  if (availablePairs.length === 0) {
    session.usedPairs = [];
    availablePairs = wordBank;
  }

  const selectedPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
  session.usedPairs = session.usedPairs || [];
  session.usedPairs.push({ agent: selectedPair.agent, imposter: selectedPair.imposter });

  promoteWaitingPlayers(session);
  const active = roundPlayers(session);
  if (active.length === 0) return selectedPair;
  const imposter = active[Math.floor(Math.random() * active.length)];

  session.players.forEach((p) => {
    if (p.playerId === imposter.playerId) {
      p.isImposter = true;
      p.word = selectedPair.imposter;
    } else {
      p.isImposter = false;
      p.word = selectedPair.agent;
    }
    p.clueSubmitted = '';
    p.hasVerballyPrepared = false;
    p.hasVoted = false;
    p.votesReceived = 0;
    p.hasAcknowledgedWord = false;
  });

  session.votes = [];
  session.readyToVote = [];
  session.speakerQueue = [];
  session.currentSpeakerIndex = 0;
  return { pair: selectedPair, imposter };
}

function applyRoundScoring(session) {
  const imposter = session.players.find((p) => p.isImposter);
  if (!imposter) return { error: 'no-imposter' };

  const oldPoints = {};
  session.players.forEach((p) => {
    oldPoints[p.playerId] = p.leaguePoints || 0;
  });

  const voteCount = {};
  (session.votes || []).forEach((v) => {
    voteCount[v.accusedId] = (voteCount[v.accusedId] || 0) + 1;
  });
  const maxVotes = Math.max(...Object.values(voteCount), 0);
  const accusedWithMaxVotes = Object.keys(voteCount).filter((id) => voteCount[id] === maxVotes);
  const isImposterCaught =
    accusedWithMaxVotes.length === 1 && accusedWithMaxVotes[0] === imposter.playerId;

  session.players.forEach((p) => {
    p.votesReceived = 0;
  });
  (session.votes || []).forEach((v) => {
    const target = session.players.find((p) => p.playerId === v.accusedId);
    if (target) target.votesReceived += 1;
  });

  if (isImposterCaught) {
    session.players.forEach((p) => {
      if (!p.isImposter && p.isConnected !== false && p.isWaitingForNextRound !== true) {
        p.leaguePoints += AGENT_BONUS;
      }
    });
  } else {
    imposter.leaguePoints += IMPOSTER_SURVIVAL_BONUS;
    if (imposter.votesReceived === 0) imposter.leaguePoints += ZERO_VOTES_BONUS;
  }

  (session.votes || []).forEach((v) => {
    if (v.accusedId === imposter.playerId) {
      const voter = session.players.find((p) => p.playerId === v.voterId);
      if (voter && !voter.isImposter) voter.leaguePoints += CORRECT_DETECTIVE_BONUS;
    }
  });

  return { imposter, isImposterCaught, oldPoints };
}

function nextLeagueStatus(leagueGameNumber) {
  const next = leagueGameNumber + 1;
  if (next > LEAGUE_GAMES) {
    return { leagueGameNumber: next, isLeagueComplete: true, status: 'podium' };
  }
  return { leagueGameNumber: next, isLeagueComplete: false, status: 'reveal' };
}

module.exports = {
  LEAGUE_GAMES,
  MAX_PLAYERS,
  IN_PROGRESS_STATUSES,
  AGENT_BONUS,
  IMPOSTER_SURVIVAL_BONUS,
  CORRECT_DETECTIVE_BONUS,
  ZERO_VOTES_BONUS,
  connectedPlayers,
  roundPlayers,
  publicPlayers,
  publicPendingJoins,
  transferHostIfNeeded,
  promoteWaitingPlayers,
  roomOccupancy,
  validateNickname,
  containsSecretWord,
  validateClue,
  validateChat,
  shuffle,
  assignWordsAndImposter,
  applyRoundScoring,
  nextLeagueStatus
};
