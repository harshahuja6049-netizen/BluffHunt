const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

process.env.PORT = '0';
process.env.ROUND_ADVANCE_MS = '80';
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { boot, stop } = require('../server');
const { runLeagueTest } = require('../test-game');
const { LEAGUE_GAMES } = require('../gameLogic');

describe('full 10-game league over sockets', () => {
  let url;

  before(async () => {
    const started = await boot();
    url = `http://127.0.0.1:${started.port}`;
  });

  after(async () => {
    await stop();
  });

  it('plays 10 games with 3 players and reaches the podium', async () => {
    const result = await runLeagueTest(url);
    assert.equal(result.rounds, LEAGUE_GAMES);
    assert.equal(result.players.length, 3);
    result.players.forEach((p) => {
      assert.ok(typeof p.leaguePoints === 'number');
    });
  });
});
