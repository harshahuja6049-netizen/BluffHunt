const io = require('socket.io-client');
const { LEAGUE_GAMES } = require('./gameLogic');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function connectClient(url, nickname) {
  return new Promise((resolve, reject) => {
    const socket = io(url, {
      transports: ['websocket'],
      reconnection: false,
      timeout: 8000
    });

    const player = {
      nickname,
      socket,
      playerId: null,
      roomCode: null,
      hasAcknowledged: false,
      hasVoted: false,
      clueSubmitted: false
    };

    socket.once('connect', () => resolve(player));
    socket.once('connect_error', (err) => reject(err));
  });
}

function waitFor(socket, event, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(event, onEvent);
      reject(new Error(`Timed out waiting for ${event}`));
    }, timeoutMs);
    const onEvent = (data) => {
      clearTimeout(timer);
      resolve(data);
    };
    socket.once(event, onEvent);
  });
}

async function runLeagueTest(url = process.env.TEST_URL || 'http://localhost:5000') {
  const names = ['Alice', 'Bob', 'Charlie'];
  const players = [];

  for (const name of names) {
    players.push(await connectClient(url, name));
  }

  const host = players[0];
  const created = waitFor(host.socket, 'room-created');
  host.socket.emit('create-room', { nickname: host.nickname, mode: 'online' });
  const room = await created;
  const roomCode = room.roomCode;
  host.playerId = room.playerId;
  host.roomCode = roomCode;

  for (const player of players.slice(1)) {
    const joined = waitFor(player.socket, 'room-joined');
    player.socket.emit('join-room', { roomCode, nickname: player.nickname });
    const data = await joined;
    player.playerId = data.playerId;
    player.roomCode = data.roomCode;
  }

  let roundsDone = 0;
  let leaguePlayers = null;
  let failed = null;

  const resetRoundFlags = () => {
    players.forEach((p) => {
      p.hasAcknowledged = false;
      p.hasVoted = false;
      p.clueSubmitted = false;
    });
  };

  const onError = (data) => {
    const message = data && data.message ? data.message : String(data);
    if (message.includes('not your turn') || message.includes('already')) return;
    failed = new Error(message);
  };

  players.forEach((player) => {
    player.socket.on('error', onError);

    player.socket.on('your-turn', () => {
      if (player.clueSubmitted) return;
      player.clueSubmitted = true;
      const clue = `hint${player.nickname.slice(0, 3)}${roundsDone}`;
      player.socket.emit('submit-clue', { clue });
    });

    player.socket.on('game-started', () => {
      player.socket.emit('acknowledge-word');
    });

    player.socket.on('phase-changed', (data) => {
      if (data.status === 'reveal') {
        player.hasVoted = false;
        player.clueSubmitted = false;
        player.socket.emit('acknowledge-word');
      }
      if (data.status === 'discussion') {
        player.socket.emit('ready-to-vote');
      }
      if (data.status === 'voting' && !player.hasVoted) {
        player.hasVoted = true;
        const target = players.find((p) => p.playerId !== player.playerId);
        player.socket.emit('cast-vote', { accusedId: target.playerId });
      }
    });

    player.socket.on('round-results', () => {
      roundsDone += 1 / players.length;
    });

    player.socket.on('next-round', () => {
      resetRoundFlags();
    });
  });

  const leagueDone = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('League timed out')), 180000);
    host.socket.on('league-complete', (data) => {
      clearTimeout(timer);
      leaguePlayers = data.players;
      resolve(data);
    });
  });

  host.socket.emit('start-game');
  await leagueDone;

  players.forEach((p) => {
    p.socket.removeAllListeners();
    p.socket.close();
  });

  if (failed) throw failed;
  if (Math.round(roundsDone) < LEAGUE_GAMES) {
    throw new Error(`Expected ${LEAGUE_GAMES} rounds, got ${roundsDone}`);
  }
  return { roomCode, players: leaguePlayers, rounds: LEAGUE_GAMES };
}

async function main() {
  console.log('🧪 Starting BluffHunt full league test...');
  try {
    const result = await runLeagueTest();
    console.log('\n🏆 League complete.');
    console.log('📊 Final scores:');
    [...result.players].sort((a, b) => b.leaguePoints - a.leaguePoints).forEach((p, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      console.log(`  ${medal} ${p.nickname}: ${p.leaguePoints} pts`);
    });
    console.log('\n🎉 ALL TESTS PASSED!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runLeagueTest };

// keep delay referenced for manual pacing if needed
void delay;
