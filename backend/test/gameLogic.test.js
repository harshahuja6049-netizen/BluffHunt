const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  validateNickname,
  validateClue,
  validateChat,
  assignWordsAndImposter,
  applyRoundScoring,
  nextLeagueStatus,
  transferHostIfNeeded,
  connectedPlayers,
  roundPlayers,
  publicPlayers,
  AGENT_BONUS,
  IMPOSTER_SURVIVAL_BONUS,
  CORRECT_DETECTIVE_BONUS,
  ZERO_VOTES_BONUS,
  LEAGUE_GAMES
} = require('../gameLogic');

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

describe('nickname validation', () => {
  it('rejects short, long, and missing names', () => {
    assert.ok(validateNickname('A'));
    assert.ok(validateNickname(''));
    assert.ok(validateNickname('abcdefghijklmnop'));
    assert.equal(validateNickname('Al'), null);
    assert.equal(validateNickname('Alice'), null);
  });
});

describe('clue validation', () => {
  const session = {
    players: [
      player('a', { word: 'Samosa', isImposter: false, clueSubmitted: 'crispy' }),
      player('b', { word: 'Pizza', isImposter: true })
    ]
  };

  it('requires 1-3 words and blocks secrets and duplicates', () => {
    assert.ok(validateClue(session, 'b', ''));
    assert.ok(validateClue(session, 'b', 'one two three four'));
    assert.ok(validateClue(session, 'b', 'samosa snack'));
    assert.ok(validateClue(session, 'b', 'love pizza'));
    assert.ok(validateClue(session, 'b', 'crispy'));
    assert.ok(validateClue(session, 'missing', 'ok'));
    assert.equal(validateClue(session, 'b', 'golden brown'), null);
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

  it('blocks secret words of length 3+ and voted players', () => {
    assert.ok(validateChat(session, 'a', 'I love tea time'));
    assert.ok(validateChat(session, 'b', 'hello'));
    assert.equal(validateChat(session, 'a', 'hmm maybe them'), null);
  });
});

describe('word assignment', () => {
  it('gives agents one word and the imposter another', () => {
    const bank = [{ agent: 'Samosa', imposter: 'Pizza' }];
    const session = {
      usedPairs: [],
      players: [player('a'), player('b'), player('c')]
    };
    const { pair, imposter } = assignWordsAndImposter(session, bank);
    assert.equal(pair.agent, 'Samosa');
    assert.equal(session.players.filter((p) => p.isImposter).length, 1);
    assert.equal(imposter.word, 'Pizza');
    session.players.filter((p) => !p.isImposter).forEach((p) => {
      assert.equal(p.word, 'Samosa');
    });
    assert.equal(session.usedPairs.length, 1);
  });

  it('recycles the bank when every pair was used', () => {
    const bank = [{ agent: 'Samosa', imposter: 'Pizza' }];
    const session = {
      usedPairs: [{ agent: 'Samosa', imposter: 'Pizza' }],
      players: [player('a'), player('b')]
    };
    assignWordsAndImposter(session, bank);
    assert.equal(session.usedPairs.length, 1);
  });
});

describe('round scoring', () => {
  it('rewards agents and detectives when the imposter is caught', () => {
    const session = {
      players: [
        player('imp', { isImposter: true, leaguePoints: 0 }),
        player('a', { leaguePoints: 0 }),
        player('b', { leaguePoints: 0 })
      ],
      votes: [
        { voterId: 'a', accusedId: 'imp' },
        { voterId: 'b', accusedId: 'imp' },
        { voterId: 'imp', accusedId: 'a' }
      ]
    };
    const { isImposterCaught } = applyRoundScoring(session);
    assert.equal(isImposterCaught, true);
    assert.equal(session.players[1].leaguePoints, AGENT_BONUS + CORRECT_DETECTIVE_BONUS);
    assert.equal(session.players[2].leaguePoints, AGENT_BONUS + CORRECT_DETECTIVE_BONUS);
    assert.equal(session.players[0].leaguePoints, 0);
  });

  it('rewards a surviving imposter, plus zero-vote bonus', () => {
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

  it('treats a tied top vote as the imposter surviving', () => {
    const session = {
      players: [
        player('imp', { isImposter: true }),
        player('a'),
        player('b')
      ],
      votes: [
        { voterId: 'a', accusedId: 'imp' },
        { voterId: 'b', accusedId: 'a' },
        { voterId: 'imp', accusedId: 'a' }
      ]
    };
    const { isImposterCaught } = applyRoundScoring(session);
    assert.equal(isImposterCaught, false);
    assert.equal(session.players[0].leaguePoints, IMPOSTER_SURVIVAL_BONUS);
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
    assert.equal(LEAGUE_GAMES, 10);
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
