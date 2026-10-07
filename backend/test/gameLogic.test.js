const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  validateNickname,
  validateClue,
  validateChat,
  containsSecretWord,
  isSamePair,
  assignWordsAndImposter,
  checkVotingTies,
  applyRoundScoring,
  nextLeagueStatus,
  transferHostIfNeeded,
  connectedPlayers,
  roundPlayers,
  publicPlayers,
  AGENT_BONUS,
  IMPOSTER_SURVIVAL_BONUS,
  ZERO_VOTES_BONUS,
  LEAGUE_DIFFICULTY_SCHEDULE,
  getTargetDifficulty,
  LEAGUE_GAMES,
  MAX_PLAYERS,
  MIN_PLAYERS
} = require('../gameLogic');
const wordBank = require('../data/wordBank');

function player(id, extra = {}) {
  return {
    playerId: id,
    nickname: id,
    isImposter: false,
    word: '',
    clueSubmitted: '',
    hasVerballyPrepared: false,
    hasAcknowledgedWord: false,
    hasVoted: false,
    votesReceived: 0,
    leaguePoints: 0,
    isConnected: true,
    ...extra
  };
}

describe('constants and limits', () => {
  it('enforces 3 to 10 players limit and 10 league games', () => {
    assert.equal(MIN_PLAYERS, 3);
    assert.equal(MAX_PLAYERS, 10);
    assert.equal(LEAGUE_GAMES, 10);
  });
});

describe('nickname validation', () => {
  it('rejects short, long, and missing names', () => {
    assert.ok(validateNickname('A'));
    assert.ok(validateNickname(''));
    assert.ok(validateNickname('abcdefghijklmnop'));
    assert.equal(validateNickname('Al'), null);
    assert.equal(validateNickname('Alice'), null);
    assert.equal(validateNickname('  Bob  '), null);
  });
});

describe('secret word leak detection with boundaries', () => {
  it('blocks exact word and case differences but allows innocent substrings', () => {
    assert.equal(containsSecretWord('I am eating Ram', 'Ram'), true);
    assert.equal(containsSecretWord('Look at the camera', 'Ram'), false);
    assert.equal(containsSecretWord('I love gulab jamun!', 'Gulab Jamun'), true);
    assert.equal(containsSecretWord('I love GULAB  JAMUN', 'Gulab Jamun'), true);
    assert.equal(containsSecretWord('I love gulab-jamun', 'Gulab Jamun'), true);
    assert.equal(containsSecretWord('steam engine', 'Tea'), false);
    assert.equal(containsSecretWord('Hot tea please', 'Tea'), true);
  });
});

describe('clue validation and word overlap', () => {
  const session = {
    players: [
      player('a', { word: 'Samosa', isImposter: false, clueSubmitted: 'crispy snack' }),
      player('b', { word: 'Pizza', isImposter: true })
    ]
  };

  it('allows words, phrases, sentences up to 80 chars, blocks secrets and word overlap', () => {
    assert.ok(validateClue(session, 'b', ''));
    // Over 80 chars is rejected:
    assert.ok(validateClue(session, 'b', 'A'.repeat(81)));
    // Secret word leaks are rejected:
    assert.ok(validateClue(session, 'b', 'I love samosa'));
    assert.ok(validateClue(session, 'b', 'Delicious pizza'));
    // Word overlap (e.g. "snack" or "crispy") is rejected:
    assert.equal(
      validateClue(session, 'b', 'snack'),
      "That clue uses a word that's already been used. Try a different clue."
    );
    assert.equal(
      validateClue(session, 'b', 'crispy'),
      "That clue uses a word that's already been used. Try a different clue."
    );
    assert.equal(
      validateClue(session, 'b', 'very crispy snack!'),
      "That clue uses a word that's already been used. Try a different clue."
    );
    assert.ok(validateClue(session, 'missing', 'ok'));
    // Non-overlapping clues are allowed:
    assert.equal(validateClue(session, 'b', 'golden triangular pastry'), null);
    assert.equal(validateClue(session, 'b', 'tasty treat'), null);
  });

  it('rejects a second clue from the same player', () => {
    const again = {
      players: [player('a', { clueSubmitted: 'already' })]
    };
    assert.ok(validateClue(again, 'a', 'new clue'));
  });
});

describe('chat validation', () => {
  const session = {
    players: [
      player('a', { word: 'Tea', isImposter: false }),
      player('b', { word: 'Lassi', isImposter: true, hasVoted: true })
    ]
  };

  it('blocks secret words and voted players', () => {
    assert.ok(validateChat(session, 'a', 'I love tea time'));
    assert.ok(validateChat(session, 'b', 'hello'));
    assert.equal(validateChat(session, 'a', 'hmm maybe them'), null);
  });
});

describe('unordered word pair assignment', () => {
  it('detects unordered duplicate pairs', () => {
    assert.equal(isSamePair({ agent: 'Samosa', imposter: 'Pizza' }, { agent: 'Pizza', imposter: 'Samosa' }), true);
    assert.equal(isSamePair({ agent: 'Samosa', imposter: 'Pizza' }, { agent: 'Samosa', imposter: 'Pizza' }), true);
    assert.equal(isSamePair({ agent: 'Samosa', imposter: 'Pizza' }, { agent: 'Dosa', imposter: 'Burger' }), false);
  });

  it('gives agents one word and the imposter another without repeating reversed pairs', () => {
    const bank = [
      { agent: 'Samosa', imposter: 'Pizza' },
      { agent: 'Dosa', imposter: 'Burger' }
    ];
    const session = {
      usedPairs: [{ agent: 'Pizza', imposter: 'Samosa' }], // reversed!
      players: [player('a'), player('b'), player('c')]
    };
    const { pair, imposter } = assignWordsAndImposter(session, bank);
    assert.equal(pair.agent, 'Dosa');
    assert.equal(session.players.filter((p) => p.isImposter).length, 1);
    assert.equal(imposter.word, 'Burger');
    session.players.filter((p) => !p.isImposter).forEach((p) => {
      assert.equal(p.word, 'Dosa');
    });
    assert.equal(session.usedPairs.length, 2);
  });

  it('excludes the previous imposter in consecutive rounds for 5 or more players', () => {
    const bank = [
      { agent: 'WordA', imposter: 'WordB' },
      { agent: 'WordC', imposter: 'WordD' },
      { agent: 'WordE', imposter: 'WordF' },
      { agent: 'WordG', imposter: 'WordH' }
    ];
    const session = {
      usedPairs: [],
      players: [player('a'), player('b'), player('c'), player('d'), player('e')]
    };

    let previousImposterId = null;
    for (let round = 1; round <= 30; round++) {
      const { imposter } = assignWordsAndImposter(session, bank);
      if (previousImposterId !== null) {
        assert.notEqual(
          imposter.playerId,
          previousImposterId,
          `Round ${round} selected same imposter as previous round: ${imposter.playerId}`
        );
      }
      previousImposterId = imposter.playerId;
      assert.equal(session.lastImposterId, imposter.playerId);
    }
  });

  it('allows the previous imposter to be chosen again for 3 to 4 players', () => {
    const bank = [
      { agent: 'WordA', imposter: 'WordB' },
      { agent: 'WordC', imposter: 'WordD' }
    ];
    const session = {
      usedPairs: [],
      players: [player('a'), player('b'), player('c')]
    };

    let consecutiveOccurred = false;
    let previousImposterId = null;

    // In 50 rounds with 3 players, probability of never repeating consecutively is (2/3)^49 ~ 2e-9
    for (let round = 1; round <= 50; round++) {
      const { imposter } = assignWordsAndImposter(session, bank);
      if (previousImposterId !== null && imposter.playerId === previousImposterId) {
        consecutiveOccurred = true;
      }
      previousImposterId = imposter.playerId;
    }

    assert.equal(
      consecutiveOccurred,
      true,
      'Expected the previous imposter to be eligible and selected consecutively at least once with 3 players'
    );
  });
});

describe('voting tie detection and round scoring', () => {
  it('detects ties and single winners', () => {
    const tiedSession = {
      players: [player('a'), player('b'), player('c')],
      votes: [
        { voterId: 'a', accusedId: 'b' },
        { voterId: 'b', accusedId: 'c' },
        { voterId: 'c', accusedId: 'b' },
        { voterId: 'd', accusedId: 'c' }
      ]
    };
    const tieResult = checkVotingTies(tiedSession);
    assert.equal(tieResult.isTie, true);
    assert.deepEqual(tieResult.tiedPlayerIds.sort(), ['b', 'c']);

    const clearSession = {
      players: [player('a'), player('b'), player('c')],
      votes: [
        { voterId: 'a', accusedId: 'b' },
        { voterId: 'c', accusedId: 'b' }
      ]
    };
    const clearResult = checkVotingTies(clearSession);
    assert.equal(clearResult.isTie, false);
    assert.equal(clearResult.accusedWinnerId, 'b');
  });

  it('rewards agents who voted for imposter when caught', () => {
    const session = {
      players: [
        player('imp', { isImposter: true, leaguePoints: 0 }),
        player('a', { leaguePoints: 0 }),
        player('b', { leaguePoints: 0 }),
        player('c', { leaguePoints: 0 })
      ],
      votes: [
        { voterId: 'a', accusedId: 'imp' },
        { voterId: 'b', accusedId: 'imp' },
        { voterId: 'c', accusedId: 'a' }, // voted wrong
        { voterId: 'imp', accusedId: 'b' }
      ]
    };
    const { isImposterCaught } = applyRoundScoring(session);
    assert.equal(isImposterCaught, true);
    assert.equal(session.players[1].leaguePoints, AGENT_BONUS); // a voted correct -> +3
    assert.equal(session.players[2].leaguePoints, AGENT_BONUS); // b voted correct -> +3
    assert.equal(session.players[3].leaguePoints, 0); // c voted wrong -> 0
    assert.equal(session.players[0].leaguePoints, 0); // imp caught -> 0
  });

  it('rewards a surviving imposter with zero-votes bonus', () => {
    const session = {
      players: [
        player('imp', { isImposter: true, leaguePoints: 0 }),
        player('a', { leaguePoints: 0 }),
        player('b', { leaguePoints: 0 })
      ],
      votes: [
        { voterId: 'a', accusedId: 'b' },
        { voterId: 'b', accusedId: 'a' },
        { voterId: 'imp', accusedId: 'a' }
      ]
    };
    const { isImposterCaught } = applyRoundScoring(session);
    assert.equal(isImposterCaught, false);
    assert.equal(session.players[0].leaguePoints, IMPOSTER_SURVIVAL_BONUS + ZERO_VOTES_BONUS);
  });
});

describe('league progression', () => {
  it('opens the podium after game 10', () => {
    assert.deepEqual(nextLeagueStatus(9), {
      leagueGameNumber: 10,
      isLeagueComplete: false,
      status: 'reveal'
    });
    assert.deepEqual(nextLeagueStatus(10), {
      leagueGameNumber: 11,
      isLeagueComplete: true,
      status: 'podium'
    });
  });
});

describe('host transfer and public players', () => {
  it('passes the host to the next connected player', () => {
    const session = {
      hostId: 'a',
      players: [player('a'), player('b')]
    };
    transferHostIfNeeded(session, 'a');
    assert.equal(session.hostId, 'b');
  });

  it('gives host to the earliest remaining joiner, skipping disconnected players', () => {
    const session = {
      hostId: 'host',
      players: [
        player('host'),
        player('first', { isConnected: false }),
        player('second')
      ]
    };
    transferHostIfNeeded(session, 'host');
    assert.equal(session.hostId, 'second');
  });

  it('excludes waiting joiners from the current round', () => {
    const session = {
      players: [player('a'), player('b', { isWaitingForNextRound: true })]
    };
    assert.equal(connectedPlayers(session).length, 2);
    assert.equal(roundPlayers(session).length, 1);
  });

  it('omits disconnected players from connectedPlayers', () => {
    const session = {
      players: [player('a'), player('b', { isConnected: false })]
    };
    assert.equal(connectedPlayers(session).length, 1);
    assert.equal(publicPlayers(session).length, 2);
  });
});

describe('10-game league difficulty schedule and word bank distribution', () => {
  it('enforces the 5 easy : 3 medium : 2 hard progression across 10 games', () => {
    const expectedSchedule = [
      'easy',    // Game 1
      'medium',  // Game 2
      'easy',    // Game 3
      'medium',  // Game 4
      'hard',    // Game 5
      'easy',    // Game 6
      'medium',  // Game 7
      'easy',    // Game 8
      'easy',    // Game 9
      'hard'     // Game 10
    ];

    assert.deepEqual(LEAGUE_DIFFICULTY_SCHEDULE, expectedSchedule);

    const easyCount = expectedSchedule.filter((d) => d === 'easy').length;
    const mediumCount = expectedSchedule.filter((d) => d === 'medium').length;
    const hardCount = expectedSchedule.filter((d) => d === 'hard').length;

    assert.equal(easyCount, 5, 'Should have exactly 5 Easy games');
    assert.equal(mediumCount, 3, 'Should have exactly 3 Medium games');
    assert.equal(hardCount, 2, 'Should have exactly 2 Hard games');

    for (let game = 1; game <= 10; game++) {
      assert.equal(getTargetDifficulty(game), expectedSchedule[game - 1]);
    }
  });

  it('selects word pairs matching the scheduled difficulty in a 10-game league', () => {
    const session = {
      usedPairs: [],
      players: [player('a'), player('b'), player('c'), player('d'), player('e')]
    };

    const scheduledDifficulties = [];
    for (let game = 1; game <= 10; game++) {
      session.leagueGameNumber = game;
      const { pair } = assignWordsAndImposter(session, wordBank);
      assert.ok(pair, `Game ${game} must return a valid pair`);
      scheduledDifficulties.push(pair.difficulty);
    }

    assert.deepEqual(scheduledDifficulties, LEAGUE_DIFFICULTY_SCHEDULE);
    assert.equal(session.usedPairs.length, 10, 'All 10 rounds must record used pairs');

    // Ensure all 10 pairs were unique
    for (let i = 0; i < session.usedPairs.length; i++) {
      for (let j = i + 1; j < session.usedPairs.length; j++) {
        assert.equal(
          isSamePair(session.usedPairs[i], session.usedPairs[j]),
          false,
          `Pair at game ${i + 1} and ${j + 1} must not be duplicates`
        );
      }
    }
  });

  it('verifies wordBank contains exactly 2000 unique pairs with 5:3:2 ratio', () => {
    assert.equal(wordBank.length, 2000, 'Word bank must contain exactly 2000 pairs');

    const counts = { easy: 0, medium: 0, hard: 0 };
    const seenPairs = new Set();

    wordBank.forEach((p, idx) => {
      assert.ok(p.agent && p.agent.trim().length > 0, `Agent word missing at index ${idx}`);
      assert.ok(p.imposter && p.imposter.trim().length > 0, `Imposter word missing at index ${idx}`);
      assert.notEqual(
        p.agent.trim().toLowerCase(),
        p.imposter.trim().toLowerCase(),
        `Agent and Imposter cannot be identical at index ${idx}`
      );

      const diff = (p.difficulty || '').toLowerCase();
      assert.ok(['easy', 'medium', 'hard'].includes(diff), `Invalid difficulty '${diff}' at index ${idx}`);
      counts[diff] = (counts[diff] || 0) + 1;

      const a = p.agent.trim().toLowerCase();
      const b = p.imposter.trim().toLowerCase();
      const key = a < b ? `${a}|||${b}` : `${b}|||${a}`;
      assert.equal(seenPairs.has(key), false, `Duplicate pair found at index ${idx}: ${p.agent} <-> ${p.imposter}`);
      seenPairs.add(key);
    });

    assert.equal(counts.easy, 1000, 'Must have exactly 1000 Easy pairs');
    assert.equal(counts.medium, 600, 'Must have exactly 600 Medium pairs');
    assert.equal(counts.hard, 400, 'Must have exactly 400 Hard pairs');
    assert.equal(seenPairs.size, 2000, 'All 2000 pairs must be unique forward and backward');
  });
});


