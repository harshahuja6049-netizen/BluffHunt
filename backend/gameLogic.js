const LEAGUE_GAMES = 10;
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 10;
const AGENT_BONUS = 3;
const IMPOSTER_SURVIVAL_BONUS = 5;
const ZERO_VOTES_BONUS = 2;
const IN_PROGRESS_STATUSES = ['reveal', 'clue', 'discussion', 'voting', 'results'];

function connectedPlayers(session) {
  return (session.players || []).filter((p) => p.isConnected !== false);
}

function roundPlayers(session) {
  return connectedPlayers(session).filter((p) => p.isWaitingForNextRound !== true);
}

function publicPlayers(session) {
  return (session.players || []).map((p) => ({
    playerId: p.playerId,
    nickname: p.nickname,
    avatar: p.avatar || '🕵️',
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
    nickname: req.nickname,
    avatar: req.avatar || '🕵️'
  }));
}

function transferHostIfNeeded(session, leavingPlayerId) {
  if (session.hostId !== leavingPlayerId) return false;
  const remainingConnected = connectedPlayers(session).filter((p) => p.playerId !== leavingPlayerId);
  const nextHost = remainingConnected[0];
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
  if (!nickname || typeof nickname !== 'string' || nickname.trim().length < 2 || nickname.trim().length > 15) {
    return 'Nickname must be 2-15 characters.';
  }
  return null;
}

function escapeRegExp(string) {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsSecretWord(text, word, minWordLength = 0) {
  if (!word || !text) return false;
  const trimmedWord = String(word).trim();
  if (!trimmedWord || trimmedWord.length < minWordLength) return false;

  const cleanWord = trimmedWord.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  const cleanText = String(text).toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();

  if (!cleanWord) return false;

  const escaped = escapeRegExp(cleanWord);
  const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  return regex.test(cleanText);
}

function secretWords(session) {
  const agentWord = session.players.find((p) => p.isImposter === false)?.word || '';
  const imposterWord = session.players.find((p) => p.isImposter === true)?.word || '';
  return { agentWord, imposterWord };
}

const COMMON_FILLER_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
  'and', 'or', 'but', 'if', 'it', 'its', 'of', 'to', 'in', 'on', 'at',
  'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'from', 'up', 'down', 'out', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now'
]);

function extractMeaningfulWords(text) {
  const normalized = String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]/gu, ' ')
    .replace(/\s+/g, ' ');

  if (!normalized) return [];

  const words = normalized.split(' ').filter(Boolean);
  const meaningful = words.filter((w) => !COMMON_FILLER_WORDS.has(w));

  return meaningful.length > 0 ? meaningful : words;
}

function normalizeClue(clue) {
  return String(clue || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

function validateClue(session, playerId, clue) {
  const player = session.players.find((p) => p.playerId === playerId);
  if (!player) return 'Player not found.';
  if (player.clueSubmitted) return 'You already submitted a clue.';

  const trimmedClue = String(clue || '').trim();
  if (!trimmedClue) return 'Please enter a clue.';
  if (trimmedClue.length > 80) {
    return 'Clue must be 80 characters or less.';
  }

  const newWords = extractMeaningfulWords(trimmedClue);
  if (!newWords.length) return 'Please enter a valid clue.';

  const existingClues = session.players
    .filter((p) => p.playerId !== playerId && p.clueSubmitted)
    .map((p) => p.clueSubmitted);

  const usedWordsInRound = new Set();
  existingClues.forEach((prevClue) => {
    extractMeaningfulWords(prevClue).forEach((w) => usedWordsInRound.add(w));
  });

  const hasOverlap = newWords.some((word) => usedWordsInRound.has(word));
  if (hasOverlap) {
    return "That clue uses a word that's already been used. Try a different clue.";
  }

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
  if (containsSecretWord(trimmedMessage, agentWord, 2)) {
    return 'Your message contains the secret word!';
  }
  if (containsSecretWord(trimmedMessage, imposterWord, 2)) {
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

function isSamePair(p1, p2) {
  const a1 = (p1.agent || '').toLowerCase().trim();
  const i1 = (p1.imposter || '').toLowerCase().trim();
  const a2 = (p2.agent || '').toLowerCase().trim();
  const i2 = (p2.imposter || '').toLowerCase().trim();
  return (a1 === a2 && i1 === i2) || (a1 === i2 && i1 === a2);
}

function assignWordsAndImposter(session, wordBank) {
  session.usedPairs = session.usedPairs || [];
  let availablePairs = wordBank.filter(
    (pair) => !session.usedPairs.some((used) => isSamePair(used, pair))
  );
  if (availablePairs.length === 0) {
    session.usedPairs = [];
    availablePairs = wordBank;
  }

  const selectedPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
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
  session.isRevote = false;
  session.tiedPlayerIds = [];
  return { pair: selectedPair, imposter };
}

function checkVotingTies(session) {
  const active = roundPlayers(session);
  const voteCount = {};
  (session.votes || []).forEach((v) => {
    if (v.accusedId) {
      voteCount[v.accusedId] = (voteCount[v.accusedId] || 0) + 1;
    }
  });

  const voteValues = Object.values(voteCount);
  if (voteValues.length === 0) {
    return { isTie: false, accusedWinnerId: null, maxVotes: 0 };
  }

  const maxVotes = Math.max(...voteValues);
  const accusedWithMaxVotes = Object.keys(voteCount).filter((id) => voteCount[id] === maxVotes);
  
  if (accusedWithMaxVotes.length > 1) {
    return { isTie: true, tiedPlayerIds: accusedWithMaxVotes, maxVotes };
  }
  
  return { isTie: false, accusedWinnerId: accusedWithMaxVotes[0], maxVotes };
}

// ✅ UPDATED applyRoundScoring – agents get points even if impostor survives
function applyRoundScoring(session, explicitCaughtAccusedId = null) {
  const imposter = session.players.find((p) => p.isImposter);
  if (!imposter) return { error: 'no-imposter' };

  const oldPoints = {};
  session.players.forEach((p) => {
    oldPoints[p.playerId] = p.leaguePoints || 0;
    p.votesReceived = 0;
  });

  (session.votes || []).forEach((v) => {
    const target = session.players.find((p) => p.playerId === v.accusedId);
    if (target) target.votesReceived += 1;
  });

  let isImposterCaught = false;
  if (explicitCaughtAccusedId) {
    isImposterCaught = explicitCaughtAccusedId === imposter.playerId;
  } else {
    const { isTie, accusedWinnerId } = checkVotingTies(session);
    isImposterCaught = !isTie && accusedWinnerId === imposter.playerId;
  }

  // ✅ Agents ALWAYS get +3 if they voted for the imposter
  session.players.forEach((p) => {
    if (!p.isImposter && p.isConnected !== false && p.isWaitingForNextRound !== true) {
      const votedForImposter = (session.votes || []).some(
        (v) => v.voterId === p.playerId && v.accusedId === imposter.playerId
      );
      if (votedForImposter) {
        p.leaguePoints += AGENT_BONUS;
      }
    }
  });

  // ✅ Imposter gets survival bonus only if NOT caught
  if (!isImposterCaught) {
    imposter.leaguePoints += IMPOSTER_SURVIVAL_BONUS;
    if (imposter.votesReceived === 0) {
      imposter.leaguePoints += ZERO_VOTES_BONUS;
    }
  }

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
  MIN_PLAYERS,
  MAX_PLAYERS,
  IN_PROGRESS_STATUSES,
  AGENT_BONUS,
  IMPOSTER_SURVIVAL_BONUS,
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
  normalizeClue,
  extractMeaningfulWords,
  validateClue,
  validateChat,
  shuffle,
  isSamePair,
  assignWordsAndImposter,
  checkVotingTies,
  applyRoundScoring,
  nextLeagueStatus
};