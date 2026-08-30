const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { randomUUID } = require('crypto');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const wordBank = require('./data/wordBank');
const GameSession = require('./models/GameSession');
const {
  LEAGUE_GAMES,
  MIN_PLAYERS,
  MAX_PLAYERS,
  IN_PROGRESS_STATUSES,
  publicPlayers,
  publicPendingJoins,
  connectedPlayers,
  roundPlayers,
  transferHostIfNeeded,
  validateNickname,
  validateClue,
  validateChat,
  shuffle,
  assignWordsAndImposter,
  checkVotingTies,
  applyRoundScoring,
  nextLeagueStatus,
  roomOccupancy
} = require('./gameLogic');

const PORT = process.env.PORT !== undefined && !isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) : 5000;
const getRoundAdvanceMs = () => Number(process.env.ROUND_ADVANCE_MS) || 8000;
const isProd = process.env.NODE_ENV === 'production';
const clientOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOrigin = clientOrigins.length ? clientOrigins : true;
const frontendDist = path.join(__dirname, '../frontend/dist');
const playerSockets = new Map();
const roundAdvanceTimers = new Map();
const socketRateLimits = new Map(); // socket.id -> Map<action, timestamp>

function checkRateLimit(socketId, action, minIntervalMs = 500) {
  if (process.env.NODE_ENV === 'test') return true;
  const now = Date.now();
  let limits = socketRateLimits.get(socketId);
  if (!limits) {
    limits = new Map();
    socketRateLimits.set(socketId, limits);
  }
  const last = limits.get(action) || 0;
  if (now - last < minIntervalMs) {
    return false;
  }
  limits.set(action, now);
  return true;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

app.set('trust proxy', 1);
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? 'OK' : 'DEGRADED',
    message: dbReady ? 'Server is running smoothly.' : 'Database is not connected.',
    db: dbReady ? 'connected' : 'disconnected'
  });
});

app.get('/api/words', (req, res) => {
  res.json({
    totalPairs: wordBank.length,
    samplePairs: wordBank.slice(0, 5)
  });
});

function getPlayerId(socket) {
  return socket.data.playerId;
}

function bindSocket(playerId, socket) {
  socket.data.playerId = playerId;
  playerSockets.set(playerId, socket.id);
}

function emitToPlayer(playerId, event, payload) {
  const socketId = playerSockets.get(playerId);
  if (socketId) io.to(socketId).emit(event, payload);
}

function findSessionByPlayer(playerId) {
  return GameSession.findOne({ 'players.playerId': playerId });
}

async function patchPlayer(playerId, playerFields, extra = {}) {
  const $set = { lastActivity: new Date(), ...(extra.$set || {}) };
  Object.entries(playerFields).forEach(([key, value]) => {
    $set[`players.$[p].${key}`] = value;
  });
  const update = { $set };
  if (extra.$push) update.$push = extra.$push;
  if (extra.$addToSet) update.$addToSet = extra.$addToSet;
  if (extra.$pull) update.$pull = extra.$pull;
  await GameSession.updateOne(
    { 'players.playerId': playerId },
    update,
    { arrayFilters: [{ 'p.playerId': playerId }] }
  );
  return GameSession.findOne({ 'players.playerId': playerId });
}

function broadcastPlayers(session) {
  io.to(session.roomCode).emit('players-updated', {
    players: publicPlayers(session),
    pendingJoins: publicPendingJoins(session),
    hostId: session.hostId,
    mode: session.mode
  });
}

function notifyHostPendingJoins(session) {
  if (!session.hostId) return;
  const pending = publicPendingJoins(session);
  if (!pending.length) return;
  emitToPlayer(session.hostId, 'join-requests', { pendingJoins: pending });
}

function emitHostChanged(session, previousHostId) {
  if (!session.hostId || session.hostId === previousHostId) return;
  const host = session.players.find((p) => p.playerId === session.hostId);
  io.to(session.roomCode).emit('host-changed', {
    hostId: session.hostId,
    hostNickname: host ? host.nickname : 'Host'
  });
  notifyHostPendingJoins(session);
}

function emitYourWords(session) {
  session.players.forEach((p) => {
    if (p.isConnected === false || p.isWaitingForNextRound) return;
    emitToPlayer(p.playerId, 'your-word', {
      word: p.word,
      isImposter: p.isImposter,
      leagueGameNumber: session.leagueGameNumber
    });
  });
}

function clearRoundTimer(roomCode) {
  const timer = roundAdvanceTimers.get(roomCode);
  if (timer) {
    clearTimeout(timer);
    roundAdvanceTimers.delete(roomCode);
  }
}

// =============================================
// SOCKET.IO EVENTS
// =============================================

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('create-room', async (data) => {
    try {
      const { nickname, mode, avatar } = data || {};
      const nicknameError = validateNickname(nickname);
      if (nicknameError) {
        socket.emit('error', { message: nicknameError });
        return;
      }

      const trimmedNickname = nickname.trim();
      const playerAvatar = (typeof avatar === 'string' && avatar.trim()) ? avatar.trim() : '🕵️';
      let roomCode;
      let existingRoom = true;
      let attempts = 0;

      while (existingRoom && attempts < 100) {
        roomCode = Math.floor(1000 + Math.random() * 9000).toString();
        existingRoom = await GameSession.findOne({ roomCode });
        attempts += 1;
      }

      if (attempts >= 100) {
        socket.emit('error', { message: 'Unable to create room. Please try again.' });
        return;
      }

      const playerId = randomUUID();
      const gameMode = mode === 'offline' ? 'offline' : 'online';
      const newRoom = new GameSession({
        roomCode,
        hostId: playerId,
        status: 'lobby',
        mode: gameMode,
        players: [{
          playerId,
          nickname: trimmedNickname,
          avatar: playerAvatar,
          isConnected: true,
          joinedAt: new Date()
        }],
        kickedPlayerIds: []
      });

      await newRoom.save();
      bindSocket(playerId, socket);
      socket.data.roomCode = roomCode;
      socket.join(roomCode);

      socket.emit('room-created', {
        roomCode,
        playerId,
        players: publicPlayers(newRoom),
        hostId: playerId,
        mode: gameMode
      });

      console.log(`🏠 Room ${roomCode} created by ${trimmedNickname}`);
    } catch (error) {
      console.error('Create room error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('join-room', async (data) => {
    try {
      const { roomCode, nickname, avatar, playerId: existingPlayerId } = data || {};
      const playerAvatar = (typeof avatar === 'string' && avatar.trim()) ? avatar.trim() : '🕵️';
      const nicknameError = validateNickname(nickname);
      if (nicknameError) {
        socket.emit('error', { message: nicknameError });
        return;
      }
      if (!roomCode || String(roomCode).trim().length !== 4) {
        socket.emit('error', { message: 'Invalid room code.' });
        return;
      }

      const trimmedNickname = nickname.trim();
      const code = String(roomCode).trim();
      let session = await GameSession.findOne({ roomCode: code });
      if (!session) {
        socket.emit('error', { message: 'Room not found.' });
        return;
      }

      if (session.kickedPlayerIds && existingPlayerId && session.kickedPlayerIds.includes(existingPlayerId)) {
        socket.emit('error', { message: 'You were removed from this room.' });
        return;
      }

      const existingById = existingPlayerId
        ? session.players.find((p) => p.playerId === existingPlayerId)
        : null;
      const existingByName = session.players.find(
        (p) => p.nickname.toLowerCase() === trimmedNickname.toLowerCase()
      );

      // Check if nickname is taken by another actively connected player
      if (existingByName && existingByName.isConnected !== false && (!existingById || existingById.playerId !== existingByName.playerId)) {
        socket.emit('error', { message: 'Nickname already taken in this room.' });
        return;
      }

      const returning = existingById || (existingByName && existingByName.isConnected === false ? existingByName : null);
      const pendingReturn = existingPlayerId
        ? (session.pendingJoins || []).find((req) => req.playerId === existingPlayerId)
        : (session.pendingJoins || []).find(
          (req) => req.nickname.toLowerCase() === trimmedNickname.toLowerCase()
        );

      if (pendingReturn && !returning) {
        bindSocket(pendingReturn.playerId, socket);
        socket.data.roomCode = session.roomCode;
        socket.data.pendingRequestId = pendingReturn.requestId;
        socket.emit('join-pending', {
          roomCode: session.roomCode,
          playerId: pendingReturn.playerId,
          requestId: pendingReturn.requestId,
          message: 'Waiting for the host to admit you. If accepted, you join the next game.'
        });
        notifyHostPendingJoins(session);
        return;
      }

      if (returning) {
        returning.isConnected = true;
        returning.disconnectedAt = null;
        returning.nickname = trimmedNickname;
        bindSocket(returning.playerId, socket);
        socket.data.roomCode = session.roomCode;
        socket.join(session.roomCode);

        const updated = await GameSession.findOneAndUpdate(
          { _id: session._id },
          {
            $set: {
              'players.$[p].isConnected': true,
              'players.$[p].disconnectedAt': null,
              'players.$[p].nickname': trimmedNickname,
              lastActivity: new Date()
            }
          },
          {
            arrayFilters: [{ 'p.playerId': returning.playerId }],
            returnDocument: 'after'
          }
        );

        if (!updated) return;
        session = updated;

        socket.emit('room-joined', {
          roomCode: session.roomCode,
          playerId: returning.playerId,
          players: publicPlayers(session),
          pendingJoins: publicPendingJoins(session),
          hostId: session.hostId,
          mode: session.mode,
          status: session.status,
          leagueGameNumber: session.leagueGameNumber,
          waiting: returning.isWaitingForNextRound === true
        });
        broadcastPlayers(session);
        emitGameState(socket, session, returning);
        if (session.hostId === returning.playerId) notifyHostPendingJoins(session);
        console.log(`🔁 ${trimmedNickname} reconnected to ${session.roomCode}`);
        return;
      }

      if (session.status === 'podium' || session.status === 'lobby') {
        session = await GameSession.findOneAndUpdate(
          { _id: session._id },
          {
            $set: {
              players: session.players.filter((p) => p.isConnected !== false),
              lastActivity: new Date()
            }
          },
          { returnDocument: 'after' }
        );
        if (!session) return;
      }

      if (roomOccupancy(session) >= MAX_PLAYERS) {
        socket.emit('error', { message: 'Room is full. Maximum 10 players allowed.' });
        return;
      }

      if (IN_PROGRESS_STATUSES.includes(session.status)) {
        const playerId = randomUUID();
        const requestId = randomUUID();
        session.pendingJoins = session.pendingJoins || [];
        session.pendingJoins.push({
          requestId,
          playerId,
          nickname: trimmedNickname,
          avatar: playerAvatar,
          createdAt: new Date()
        });

        const updated = await GameSession.findOneAndUpdate(
          { _id: session._id },
          {
            $set: {
              pendingJoins: session.pendingJoins,
              lastActivity: new Date()
            }
          },
          { returnDocument: 'after' }
        );
        if (!updated) return;
        session = updated;

        bindSocket(playerId, socket);
        socket.data.roomCode = session.roomCode;
        socket.data.pendingRequestId = requestId;

        socket.emit('join-pending', {
          roomCode: session.roomCode,
          playerId,
          requestId,
          message: 'Waiting for the host to admit you. If accepted, you join the next game.'
        });
        notifyHostPendingJoins(session);
        broadcastPlayers(session);
        console.log(`⏳ ${trimmedNickname} requested to join ${session.roomCode}`);
        return;
      }

      const playerId = randomUUID();
      session.players.push({
        playerId,
        nickname: trimmedNickname,
        avatar: playerAvatar,
        isConnected: true,
        joinedAt: new Date()
      });

      const updated = await GameSession.findOneAndUpdate(
        { _id: session._id },
        {
          $set: {
            players: session.players,
            lastActivity: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      if (!updated) return;
      session = updated;

      bindSocket(playerId, socket);
      socket.data.roomCode = session.roomCode;
      socket.join(session.roomCode);

      socket.emit('room-joined', {
        roomCode: session.roomCode,
        playerId,
        players: publicPlayers(session),
        pendingJoins: publicPendingJoins(session),
        hostId: session.hostId,
        mode: session.mode,
        status: session.status,
        leagueGameNumber: session.leagueGameNumber
      });
      broadcastPlayers(session);
      console.log(`👤 ${trimmedNickname} joined room ${session.roomCode}`);
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('leave-room', async () => {
    try {
      const playerId = getPlayerId(socket);
      if (!playerId) return;

      let session = await findSessionByPlayer(playerId);
      if (!session) {
        session = await GameSession.findOne({ 'pendingJoins.playerId': playerId });
        if (!session) return socket.emit('error', { message: 'You are not in a room.' });
        session.pendingJoins = (session.pendingJoins || []).filter((req) => req.playerId !== playerId);
        await GameSession.findOneAndUpdate(
          { _id: session._id },
          { $set: { pendingJoins: session.pendingJoins, lastActivity: new Date() } }
        );
        playerSockets.delete(playerId);
        socket.data.playerId = null;
        socket.data.roomCode = null;
        socket.data.pendingRequestId = null;
        socket.emit('left-room', { message: 'You have left the room.' });
        notifyHostPendingJoins(session);
        broadcastPlayers(session);
        return;
      }

      const previousHostId = session.hostId;
      const roomCode = session.roomCode;
      session.players = session.players.filter((p) => p.playerId !== playerId);
      session.pendingJoins = (session.pendingJoins || []).filter((req) => req.playerId !== playerId);
      const hostMoved = transferHostIfNeeded(session, playerId);
      session.lastActivity = new Date();

      socket.leave(roomCode);
      playerSockets.delete(playerId);
      socket.data.playerId = null;
      socket.data.roomCode = null;
      socket.data.pendingRequestId = null;
      socket.emit('left-room', { message: 'You have left the room.' });

      if (session.players.length === 0) {
        clearRoundTimer(roomCode);
        await GameSession.deleteOne({ _id: session._id });
      } else {
        if (hostMoved) emitHostChanged(session, previousHostId);
        const updated = await GameSession.findOneAndUpdate(
          { _id: session._id },
          {
            $set: {
              players: session.players,
              pendingJoins: session.pendingJoins,
              hostId: session.hostId,
              lastActivity: new Date()
            }
          },
          { returnDocument: 'after' }
        );
        if (updated) {
          session = updated;
          broadcastPlayers(session);
          await resumeAfterDeparture(session);
        }
      }
      console.log(`🚪 Player left room ${roomCode}. Remaining: ${session.players.length}`);
    } catch (error) {
      console.error('Leave room error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('respond-join', async ({ requestId, admit } = {}) => {
    try {
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.hostId !== playerId) {
        return socket.emit('error', { message: 'Only the Host can admit players.' });
      }

      const pending = (session.pendingJoins || []).find((req) => req.requestId === requestId);
      if (!pending) return socket.emit('error', { message: 'Join request not found.' });

      session.pendingJoins = session.pendingJoins.filter((req) => req.requestId !== requestId);

      if (!admit) {
        await GameSession.findOneAndUpdate(
          { _id: session._id },
          { $set: { pendingJoins: session.pendingJoins, lastActivity: new Date() } }
        );
        emitToPlayer(pending.playerId, 'join-denied', {
          message: 'The host did not admit you to this league.'
        });
        const deniedSocketId = playerSockets.get(pending.playerId);
        const deniedSocket = deniedSocketId ? io.sockets.sockets.get(deniedSocketId) : null;
        if (deniedSocket) {
          deniedSocket.data.playerId = null;
          deniedSocket.data.roomCode = null;
          deniedSocket.data.pendingRequestId = null;
        }
        playerSockets.delete(pending.playerId);
        notifyHostPendingJoins(session);
        broadcastPlayers(session);
        return;
      }

      if (connectedPlayers(session).length >= MAX_PLAYERS) {
        await GameSession.findOneAndUpdate(
          { _id: session._id },
          { $set: { pendingJoins: session.pendingJoins, lastActivity: new Date() } }
        );
        emitToPlayer(pending.playerId, 'join-denied', { message: 'Room is full. Maximum 10 players allowed.' });
        playerSockets.delete(pending.playerId);
        notifyHostPendingJoins(session);
        broadcastPlayers(session);
        return;
      }

      const waiting = IN_PROGRESS_STATUSES.includes(session.status);
      session.players.push({
        playerId: pending.playerId,
        nickname: pending.nickname,
        isConnected: true,
        joinedAt: new Date(),
        isWaitingForNextRound: waiting
      });

      const updated = await GameSession.findOneAndUpdate(
        { _id: session._id },
        {
          $set: {
            players: session.players,
            pendingJoins: session.pendingJoins,
            lastActivity: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      if (!updated) return;
      session = updated;

      const joinerSocketId = playerSockets.get(pending.playerId);
      const joinerSocket = joinerSocketId ? io.sockets.sockets.get(joinerSocketId) : null;
      if (joinerSocket) {
        joinerSocket.data.pendingRequestId = null;
        joinerSocket.join(session.roomCode);
      }

      const payload = {
        roomCode: session.roomCode,
        playerId: pending.playerId,
        players: publicPlayers(session),
        pendingJoins: publicPendingJoins(session),
        hostId: session.hostId,
        mode: session.mode,
        status: session.status,
        leagueGameNumber: session.leagueGameNumber,
        waiting
      };
      emitToPlayer(pending.playerId, 'join-admitted', payload);
      emitToPlayer(pending.playerId, 'room-joined', payload);
      notifyHostPendingJoins(session);
      broadcastPlayers(session);
      console.log(`✅ ${pending.nickname} admitted to ${session.roomCode}${waiting ? ' (next game)' : ''}`);
    } catch (error) {
      console.error('Respond join error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('kick-player', async ({ targetPlayerId } = {}) => {
    try {
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.hostId !== playerId) {
        return socket.emit('error', { message: 'Only the Host can kick players.' });
      }
      if (targetPlayerId === playerId) {
        return socket.emit('error', { message: 'You cannot kick yourself. Use the Leave button.' });
      }

      const targetIndex = session.players.findIndex((p) => p.playerId === targetPlayerId);
      if (targetIndex === -1) return socket.emit('error', { message: 'Player not found.' });

      const targetPlayer = session.players[targetIndex];
      session.players.splice(targetIndex, 1);
      session.kickedPlayerIds = session.kickedPlayerIds || [];
      if (!session.kickedPlayerIds.includes(targetPlayerId)) {
        session.kickedPlayerIds.push(targetPlayerId);
      }

      // If kicked during voting: remove their vote and readyToVote
      session.votes = (session.votes || []).filter((v) => v.voterId !== targetPlayerId);
      session.readyToVote = (session.readyToVote || []).filter((id) => id !== targetPlayerId);
      if (session.speakerQueue) {
        session.speakerQueue = session.speakerQueue.filter((id) => id !== targetPlayerId);
      }

      const updated = await GameSession.findOneAndUpdate(
        { _id: session._id },
        {
          $set: {
            players: session.players,
            kickedPlayerIds: session.kickedPlayerIds,
            votes: session.votes,
            readyToVote: session.readyToVote,
            speakerQueue: session.speakerQueue,
            lastActivity: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      if (!updated) return;
      session = updated;

      emitToPlayer(targetPlayerId, 'kicked', { message: 'You were removed by the Host.' });
      const targetSocketId = playerSockets.get(targetPlayerId);
      const targetSocket = targetSocketId ? io.sockets.sockets.get(targetSocketId) : null;
      if (targetSocket) {
        targetSocket.leave(session.roomCode);
        targetSocket.data.playerId = null;
        targetSocket.data.roomCode = null;
      }
      playerSockets.delete(targetPlayerId);

      broadcastPlayers(session);
      await resumeAfterDeparture(session);
      console.log(`👢 ${targetPlayer.nickname} was kicked from room ${session.roomCode}`);
    } catch (error) {
      console.error('Kick player error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('change-mode', async ({ mode } = {}) => {
    try {
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.hostId !== playerId) {
        return socket.emit('error', { message: 'Only the Host can change the mode.' });
      }
      if (session.status !== 'lobby') {
        return socket.emit('error', { message: 'Mode can only be changed in the lobby.' });
      }
      if (mode !== 'online' && mode !== 'offline') {
        return socket.emit('error', { message: 'Invalid mode.' });
      }

      const updated = await GameSession.findOneAndUpdate(
        { _id: session._id },
        {
          $set: {
            mode: mode,
            lastActivity: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      if (!updated) return;
      session = updated;

      io.to(session.roomCode).emit('mode-changed', { mode });
      broadcastPlayers(session);
    } catch (error) {
      console.error('Change mode error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('start-game', async () => {
    try {
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.hostId !== playerId) {
        return socket.emit('error', { message: 'Only the Host can start the game.' });
      }
      if (session.status !== 'lobby' && session.status !== 'podium') {
        return socket.emit('error', { message: 'Game already in progress.' });
      }
      if (connectedPlayers(session).length < MIN_PLAYERS) {
        return socket.emit('error', { message: 'Need at least 3 players to start.' });
      }

      dealRound(session);
      session.status = 'reveal';
      session.leagueGameNumber = session.leagueGameNumber || 1;

      const updated = await GameSession.findOneAndUpdate(
        { _id: session._id },
        {
          $set: {
            status: session.status,
            leagueGameNumber: session.leagueGameNumber,
            players: session.players,
            usedPairs: session.usedPairs,
            speakerQueue: session.speakerQueue,
            currentSpeakerIndex: session.currentSpeakerIndex,
            votes: session.votes,
            readyToVote: session.readyToVote,
            isRevote: session.isRevote,
            tiedPlayerIds: session.tiedPlayerIds,
            lastActivity: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      if (!updated) return;
      session = updated;

      io.to(session.roomCode).emit('game-started', {
        status: session.status,
        players: publicPlayers(session),
        hostId: session.hostId,
        mode: session.mode,
        leagueGameNumber: session.leagueGameNumber
      });
      emitYourWords(session);
      console.log(`🎮 Game started in room ${session.roomCode}`);
    } catch (error) {
      console.error('Start game error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('acknowledge-word', async () => {
    try {
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.status !== 'reveal') {
        return socket.emit('error', { message: 'Not in reveal phase.' });
      }

      const player = session.players.find((p) => p.playerId === playerId);
      if (!player) return socket.emit('error', { message: 'Player not found.' });
      if (player.isWaitingForNextRound) return;
      if (player.hasAcknowledgedWord) return;

      const latest = await patchPlayer(playerId, { hasAcknowledgedWord: true });
      const active = roundPlayers(latest);
      const allAcknowledged = active.every((p) => p.hasAcknowledgedWord === true);

      if (allAcknowledged) {
        const speakerQueue = shuffle(active.map((p) => p.playerId));
        const moved = await GameSession.findOneAndUpdate(
          { _id: latest._id, status: 'reveal' },
          {
            $set: {
              status: 'clue',
              speakerQueue,
              currentSpeakerIndex: 0,
              lastActivity: new Date()
            }
          },
          { returnDocument: 'after' }
        );
        if (!moved) return;

        io.to(moved.roomCode).emit('phase-changed', {
          status: moved.status,
          players: publicPlayers(moved),
          speakerQueue: moved.speakerQueue,
          currentSpeakerIndex: moved.currentSpeakerIndex,
          mode: moved.mode,
          leagueGameNumber: moved.leagueGameNumber
        });

        if (moved.speakerQueue.length > 0) {
          const firstSpeakerPrompt = moved.mode === 'offline' ? 'Say your clue out loud.' : 'Enter your clue...';
          emitToPlayer(moved.speakerQueue[0], 'your-turn', {
            message: firstSpeakerPrompt
          });
        }
        console.log(`🔍 Clue phase started in room ${moved.roomCode}`);
      } else {
        const readyCount = active.filter((p) => p.hasAcknowledgedWord).length;
        io.to(latest.roomCode).emit('acknowledge-progress', {
          acknowledgedCount: readyCount,
          totalPlayers: active.length,
          players: publicPlayers(latest)
        });
        broadcastPlayers(latest);
      }
    } catch (error) {
      console.error('Acknowledge word error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('force-advance-reveal', async () => {
    try {
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.hostId !== playerId) {
        return socket.emit('error', { message: 'Only the Host can force advance.' });
      }
      if (session.status !== 'reveal') {
        return socket.emit('error', { message: 'Not in reveal phase.' });
      }

      const active = roundPlayers(session);
      const speakerQueue = shuffle(active.map((p) => p.playerId));
      const moved = await GameSession.findOneAndUpdate(
        { _id: session._id, status: 'reveal' },
        {
          $set: {
            status: 'clue',
            speakerQueue,
            currentSpeakerIndex: 0,
            lastActivity: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      if (!moved) return;

      io.to(moved.roomCode).emit('phase-changed', {
        status: moved.status,
        players: publicPlayers(moved),
        speakerQueue: moved.speakerQueue,
        currentSpeakerIndex: moved.currentSpeakerIndex,
        mode: moved.mode,
        leagueGameNumber: moved.leagueGameNumber
      });

      if (moved.speakerQueue.length > 0) {
        const firstSpeakerPrompt = moved.mode === 'offline' ? 'Say your clue out loud.' : 'Enter your clue...';
        emitToPlayer(moved.speakerQueue[0], 'your-turn', {
          message: firstSpeakerPrompt
        });
      }
      console.log(`⏩ Host force-advanced to clue phase in room ${moved.roomCode}`);
    } catch (error) {
      console.error('Force advance reveal error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('submit-clue', async ({ clue } = {}) => {
    try {
      if (!checkRateLimit(socket.id, 'clue', 400)) return;
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.status !== 'clue') {
        return socket.emit('error', { message: 'Not in clue phase.' });
      }
      if (session.mode === 'online') {
        const currentSpeakerId = session.speakerQueue[session.currentSpeakerIndex];
        if (currentSpeakerId !== playerId) {
          return socket.emit('error', { message: 'It is not your turn yet.' });
        }
      }

      const player = session.players.find((p) => p.playerId === playerId);
      if (player && player.isWaitingForNextRound) {
        return socket.emit('error', { message: 'You join the next game.' });
      }
      const clueError = validateClue(session, playerId, clue);
      if (clueError) return socket.emit('error', { message: clueError });

      const trimmedClue = String(clue || '').trim();
      player.clueSubmitted = trimmedClue;
      session.currentSpeakerIndex += 1;

      const updated = await GameSession.findOneAndUpdate(
        { _id: session._id },
        {
          $set: {
            'players.$[p].clueSubmitted': trimmedClue,
            currentSpeakerIndex: session.currentSpeakerIndex,
            lastActivity: new Date()
          }
        },
        {
          arrayFilters: [{ 'p.playerId': playerId }],
          returnDocument: 'after'
        }
      );
      if (!updated) return;
      session = updated;

      io.to(session.roomCode).emit('clue-submitted', {
        playerId,
        nickname: player.nickname,
        avatar: player.avatar || '🕵️',
        clue: trimmedClue
      });

      if (session.currentSpeakerIndex < session.speakerQueue.length) {
        emitToPlayer(session.speakerQueue[session.currentSpeakerIndex], 'your-turn', {
          message: 'Enter your clue...'
        });
      } else {
        await startDiscussion(session);
      }
    } catch (error) {
      console.error('Submit clue error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('verbal-ready', async () => {
    try {
      if (!checkRateLimit(socket.id, 'verbal', 400)) return;
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.status !== 'clue') return socket.emit('error', { message: 'Not in clue phase.' });
      if (session.mode !== 'offline') return socket.emit('error', { message: 'Not in offline mode.' });

      const currentSpeakerId = session.speakerQueue[session.currentSpeakerIndex];
      if (currentSpeakerId !== playerId) {
        return socket.emit('error', { message: 'It is not your turn yet.' });
      }

      const player = session.players.find((p) => p.playerId === playerId);
      if (!player) return socket.emit('error', { message: 'Player not found.' });
      if (player.isWaitingForNextRound) return;
      if (player.hasVerballyPrepared) return;

      session.currentSpeakerIndex += 1;
      const latest = await patchPlayer(playerId, { hasVerballyPrepared: true }, {
        $set: { currentSpeakerIndex: session.currentSpeakerIndex }
      });

      io.to(latest.roomCode).emit('verbal-progress', {
        playerId,
        nickname: player.nickname,
        avatar: player.avatar || '🕵️',
        preparedCount: session.currentSpeakerIndex,
        totalPlayers: latest.speakerQueue.length
      });

      if (session.currentSpeakerIndex < latest.speakerQueue.length) {
        emitToPlayer(latest.speakerQueue[session.currentSpeakerIndex], 'your-turn', {
          message: 'Say your clue out loud.'
        });
      } else {
        await startDiscussion(latest);
      }
    } catch (error) {
      console.error('Verbal ready error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('send-chat', async ({ message } = {}) => {
    try {
      if (!checkRateLimit(socket.id, 'chat', 350)) {
        return socket.emit('error', { message: 'Typing too fast. Please slow down.' });
      }
      const playerId = getPlayerId(socket);
      const session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.status !== 'discussion') {
        return socket.emit('error', { message: 'Chat is not open.' });
      }

      const player = session.players.find((p) => p.playerId === playerId);
      if (!player) return socket.emit('error', { message: 'Player not found.' });
      if (player.isWaitingForNextRound) {
        return socket.emit('error', { message: 'You join the next game.' });
      }
      const chatError = validateChat(session, playerId, message);
      if (chatError) return socket.emit('error', { message: chatError });

      const trimmedMessage = String(message || '').trim();

      io.to(session.roomCode).emit('chat-message', {
        playerId,
        nickname: player.nickname,
        avatar: player.avatar || '🕵️',
        message: trimmedMessage,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Chat error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('ready-to-vote', async () => {
    try {
      if (!checkRateLimit(socket.id, 'ready', 400)) return;
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.status !== 'discussion') {
        return socket.emit('error', { message: 'Not in discussion phase.' });
      }

      const player = session.players.find((p) => p.playerId === playerId);
      if (!player) return socket.emit('error', { message: 'Player not found.' });
      if (player.isWaitingForNextRound) return;

      const latest = await patchPlayer(playerId, {}, {
        $addToSet: { readyToVote: playerId }
      });

      const active = roundPlayers(latest);
      io.to(latest.roomCode).emit('ready-progress', {
        readyCount: latest.readyToVote.length,
        totalPlayers: active.length
      });

      if (active.every((p) => latest.readyToVote.includes(p.playerId))) {
        // Clear previous votes and reset hasVoted flags for active players
        const updated = await GameSession.findOneAndUpdate(
          { _id: latest._id },
          {
            $set: {
              status: 'voting',
              votes: [],
              isRevote: false,
              tiedPlayerIds: [],
              'players.$[].hasVoted': false,
              lastActivity: new Date()
            }
          },
          { returnDocument: 'after' }
        );
        if (!updated) return;
        io.to(updated.roomCode).emit('phase-changed', {
          status: 'voting',
          players: publicPlayers(updated),
          message: 'All players are ready! Time to vote.',
          leagueGameNumber: updated.leagueGameNumber,
          isRevote: false,
          tiedPlayerIds: []
        });
      }
    } catch (error) {
      console.error('Ready to vote error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('cast-vote', async ({ accusedId } = {}) => {
    try {
      if (!checkRateLimit(socket.id, 'vote', 400)) return;
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.status !== 'voting') {
        return socket.emit('error', { message: 'Not in voting phase.' });
      }

      const voter = session.players.find((p) => p.playerId === playerId);
      if (!voter) return socket.emit('error', { message: 'Player not found.' });
      if (voter.isWaitingForNextRound) {
        return socket.emit('error', { message: 'You join the next game.' });
      }
      if (voter.hasVoted) return socket.emit('error', { message: 'You have already voted.' });

      const accused = session.players.find((p) => p.playerId === accusedId);
      if (!accused || accused.isConnected === false) return socket.emit('error', { message: 'Invalid player selected.' });
      if (voter.playerId === accusedId) {
        return socket.emit('error', { message: 'You cannot vote for yourself.' });
      }

      if (session.isRevote && session.tiedPlayerIds && session.tiedPlayerIds.length) {
        if (!session.tiedPlayerIds.includes(accusedId)) {
          return socket.emit('error', { message: 'You must vote for one of the tied players.' });
        }
      }

      const latest = await patchPlayer(playerId, { hasVoted: true }, {
        $push: { votes: { voterId: playerId, accusedId } }
      });

      socket.emit('vote-submitted', { message: 'Your vote has been recorded.' });

      const active = roundPlayers(latest);
      const votedCount = active.filter((p) => p.hasVoted).length;
      io.to(latest.roomCode).emit('vote-progress', {
        votedCount,
        totalPlayers: active.length
      });

      if (active.every((p) => p.hasVoted === true)) {
        await processVotingComplete(latest);
      }
    } catch (error) {
      console.error('Cast vote error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('start-new-league', async () => {
    try {
      const playerId = getPlayerId(socket);
      let session = await findSessionByPlayer(playerId);
      if (!session) return socket.emit('error', { message: 'You are not in a room.' });
      if (session.hostId !== playerId) {
        return socket.emit('error', { message: 'Only the Host can start a new league.' });
      }

      session.players.forEach((p) => {
        p.leaguePoints = 0;
        p.isImposter = false;
        p.word = '';
        p.clueSubmitted = '';
        p.hasVerballyPrepared = false;
        p.hasAcknowledgedWord = false;
        p.hasVoted = false;
        p.votesReceived = 0;
        p.isWaitingForNextRound = false;
      });
      session.pendingJoins = [];
      session.usedPairs = [];
      session.votes = [];
      session.readyToVote = [];
      session.speakerQueue = [];
      session.currentSpeakerIndex = 0;
      session.isRevote = false;
      session.tiedPlayerIds = [];
      session.leagueGameNumber = 1;
      session.isLeagueComplete = false;
      session.status = 'lobby';

      const updated = await GameSession.findOneAndUpdate(
        { _id: session._id },
        {
          $set: {
            players: session.players,
            pendingJoins: session.pendingJoins,
            usedPairs: session.usedPairs,
            votes: session.votes,
            readyToVote: session.readyToVote,
            speakerQueue: session.speakerQueue,
            currentSpeakerIndex: session.currentSpeakerIndex,
            isRevote: session.isRevote,
            tiedPlayerIds: session.tiedPlayerIds,
            leagueGameNumber: session.leagueGameNumber,
            isLeagueComplete: session.isLeagueComplete,
            status: session.status,
            lastActivity: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      if (!updated) return;
      session = updated;

      io.to(session.roomCode).emit('league-reset', {
        players: publicPlayers(session),
        hostId: session.hostId,
        roomCode: session.roomCode,
        mode: session.mode
      });
    } catch (error) {
      console.error('Start new league error:', error);
      socket.emit('error', { message: 'Server error. Please try again.' });
    }
  });

  socket.on('disconnect', async () => {
    console.log('🔴 Client disconnected:', socket.id);
    try {
      if (mongoose.connection.readyState !== 1) return;
      const playerId = getPlayerId(socket);
      if (!playerId) return;
      if (playerSockets.get(playerId) !== socket.id) return;

      let session = await findSessionByPlayer(playerId);
      if (!session) {
        session = await GameSession.findOne({ 'pendingJoins.playerId': playerId });
        if (!session) return;
        session.pendingJoins = (session.pendingJoins || []).filter((req) => req.playerId !== playerId);
        await GameSession.findOneAndUpdate(
          { _id: session._id },
          {
            $set: {
              pendingJoins: session.pendingJoins,
              lastActivity: new Date()
            }
          }
        );
        playerSockets.delete(playerId);
        notifyHostPendingJoins(session);
        broadcastPlayers(session);
        return;
      }

      const player = session.players.find((p) => p.playerId === playerId);
      if (!player) return;
      const previousHostId = session.hostId;

      if (session.status === 'lobby' || session.status === 'podium') {
        session.players = session.players.filter((p) => p.playerId !== playerId);
        transferHostIfNeeded(session, playerId);
      } else {
        player.isConnected = false;
        player.disconnectedAt = new Date();
      }

      session.lastActivity = new Date();
      playerSockets.delete(playerId);
      socketRateLimits.delete(socket.id);

      if (session.players.length === 0) {
        clearRoundTimer(session.roomCode);
        await GameSession.deleteOne({ _id: session._id });
      } else {
        if (!session.hostId) session.hostId = connectedPlayers(session)[0]?.playerId || session.players[0].playerId;
        emitHostChanged(session, previousHostId);
        const updated = await GameSession.findOneAndUpdate(
          { _id: session._id },
          {
            $set: {
              players: session.players,
              hostId: session.hostId,
              'players.$[p].isConnected': player.isConnected,
              'players.$[p].disconnectedAt': player.disconnectedAt,
              lastActivity: new Date()
            }
          },
          {
            arrayFilters: [{ 'p.playerId': playerId }],
            returnDocument: 'after'
          }
        );
        if (updated) {
          session = updated;
          broadcastPlayers(session);
          await resumeAfterDeparture(session);
        }
      }
      console.log(`👋 ${player.nickname} disconnected from ${session.roomCode}`);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
});

// =============================================
// RESUME AFTER DEPARTURE
// =============================================

async function resumeAfterDeparture(session) {
  const active = roundPlayers(session);
  if (IN_PROGRESS_STATUSES.includes(session.status) && session.status !== 'results' && active.length < MIN_PLAYERS) {
    clearRoundTimer(session.roomCode);
    session.status = 'lobby';
    session.speakerQueue = [];
    session.currentSpeakerIndex = 0;
    session.votes = [];
    session.readyToVote = [];
    session.isRevote = false;
    session.tiedPlayerIds = [];
    session.players.forEach((p) => {
      p.isWaitingForNextRound = false;
      p.hasAcknowledgedWord = false;
      p.hasVoted = false;
      p.clueSubmitted = '';
      p.hasVerballyPrepared = false;
    });
    const updated = await GameSession.findOneAndUpdate(
      { _id: session._id },
      {
        $set: {
          status: session.status,
          speakerQueue: session.speakerQueue,
          currentSpeakerIndex: session.currentSpeakerIndex,
          votes: session.votes,
          readyToVote: session.readyToVote,
          isRevote: session.isRevote,
          tiedPlayerIds: session.tiedPlayerIds,
          players: session.players,
          lastActivity: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    if (!updated) return;
    session = updated;
    io.to(session.roomCode).emit('returned-to-lobby', {
      players: publicPlayers(session),
      hostId: session.hostId,
      mode: session.mode,
      roomCode: session.roomCode,
      message: 'Not enough players left. Back to the lobby.'
    });
    return;
  }

  if (session.status === 'reveal' && active.length && active.every((p) => p.hasAcknowledgedWord === true)) {
    const speakerQueue = shuffle(active.map((p) => p.playerId));
    session.status = 'clue';
    session.speakerQueue = speakerQueue;
    session.currentSpeakerIndex = 0;
    const updated = await GameSession.findOneAndUpdate(
      { _id: session._id },
      {
        $set: {
          status: session.status,
          speakerQueue: session.speakerQueue,
          currentSpeakerIndex: session.currentSpeakerIndex,
          lastActivity: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    if (!updated) return;
    session = updated;
    io.to(session.roomCode).emit('phase-changed', {
      status: session.status,
      players: publicPlayers(session),
      speakerQueue: session.speakerQueue,
      currentSpeakerIndex: session.currentSpeakerIndex,
      mode: session.mode,
      leagueGameNumber: session.leagueGameNumber
    });
    if (speakerQueue.length > 0) {
      const prompt = session.mode === 'offline' ? 'Say your clue out loud.' : 'Enter your clue...';
      emitToPlayer(speakerQueue[0], 'your-turn', { message: prompt });
    }
    return;
  }

  if (session.status === 'clue') {
    const remainingQueue = (session.speakerQueue || []).filter((id) =>
      active.some((p) => p.playerId === id)
    );
    session.speakerQueue = remainingQueue;
    while (
      session.currentSpeakerIndex < remainingQueue.length &&
      active.find((p) => p.playerId === remainingQueue[session.currentSpeakerIndex])?.(
        session.mode === 'offline' ? 'hasVerballyPrepared' : 'clueSubmitted'
      )
    ) {
      session.currentSpeakerIndex += 1;
    }
    const updated = await GameSession.findOneAndUpdate(
      { _id: session._id },
      {
        $set: {
          speakerQueue: session.speakerQueue,
          currentSpeakerIndex: session.currentSpeakerIndex,
          lastActivity: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    if (!updated) return;
    session = updated;
    if (session.currentSpeakerIndex >= remainingQueue.length) {
      await startDiscussion(session);
    } else {
      const prompt = session.mode === 'offline' ? 'Say your clue out loud.' : 'Enter your clue...';
      emitToPlayer(remainingQueue[session.currentSpeakerIndex], 'your-turn', {
        message: prompt
      });
    }
    return;
  }

  if (session.status === 'discussion' && active.every((p) => session.readyToVote.includes(p.playerId))) {
    const updated = await GameSession.findOneAndUpdate(
      { _id: session._id },
      {
        $set: {
          status: 'voting',
          votes: [],
          isRevote: false,
          tiedPlayerIds: [],
          'players.$[].hasVoted': false,
          lastActivity: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    if (!updated) return;
    session = updated;
    io.to(session.roomCode).emit('phase-changed', {
      status: 'voting',
      players: publicPlayers(session),
      message: 'All players are ready! Time to vote.',
      leagueGameNumber: session.leagueGameNumber,
      isRevote: false,
      tiedPlayerIds: []
    });
    return;
  }

  if (session.status === 'voting' && active.every((p) => p.hasVoted === true)) {
    await processVotingComplete(session);
  }
}

async function startDiscussion(session) {
  session.status = 'discussion';
  const updated = await GameSession.findOneAndUpdate(
    { _id: session._id },
    {
      $set: {
        status: session.status,
        lastActivity: new Date()
      }
    },
    { returnDocument: 'after' }
  );
  if (!updated) return;
  session = updated;
  io.to(session.roomCode).emit('phase-changed', {
    status: 'discussion',
    players: publicPlayers(session),
    message: 'All clues submitted! Discuss now.',
    leagueGameNumber: session.leagueGameNumber
  });
}

function dealRound(session) {
  const dealt = assignWordsAndImposter(session, wordBank);
  session.lastActivity = new Date();
  if (dealt && dealt.imposter) {
    console.log(`📝 Words assigned. Imposter: ${dealt.imposter.nickname} (${dealt.imposter.word})`);
  }
  return dealt;
}

async function processVotingComplete(session) {
  const tieCheck = checkVotingTies(session);
  if (tieCheck.isTie && !session.isRevote) {
    // First tie! Trigger revote!
    session.isRevote = true;
    session.tiedPlayerIds = tieCheck.tiedPlayerIds;
    session.votes = [];
    session.players.forEach((p) => {
      p.hasVoted = false;
    });

    const updated = await GameSession.findOneAndUpdate(
      { _id: session._id },
      {
        $set: {
          isRevote: session.isRevote,
          tiedPlayerIds: session.tiedPlayerIds,
          votes: session.votes,
          players: session.players,
          lastActivity: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    if (!updated) return;
    session = updated;

    const tiedNames = session.tiedPlayerIds.map((id) => session.players.find((p) => p.playerId === id)?.nickname || id);
    io.to(session.roomCode).emit('revote-started', {
      tiedPlayerIds: session.tiedPlayerIds,
      tiedNicknames: tiedNames,
      message: `IT'S A TIE! Revote between: ${tiedNames.join(', ')}`
    });
    io.to(session.roomCode).emit('phase-changed', {
      status: 'voting',
      players: publicPlayers(session),
      isRevote: true,
      tiedPlayerIds: session.tiedPlayerIds,
      message: `IT'S A TIE! Revote between: ${tiedNames.join(', ')}`,
      leagueGameNumber: session.leagueGameNumber
    });
    return;
  }

  // Single winner or second tie (where imposter escapes)
  const caughtAccusedId = tieCheck.isTie ? null : tieCheck.accusedWinnerId;
  await calculateRoundResults(session, caughtAccusedId);
}

async function calculateRoundResults(session, explicitCaughtAccusedId = null) {
  try {
    const claimed = await GameSession.findOneAndUpdate(
      { _id: session._id, status: { $in: ['discussion', 'voting'] } },
      { $set: { status: 'results', lastActivity: new Date() } },
      { returnDocument: 'after' }
    );
    if (!claimed) return;
    session = claimed;

    const scored = applyRoundScoring(session, explicitCaughtAccusedId);
    if (scored.error) {
      session.status = 'results';
      await GameSession.findOneAndUpdate(
        { _id: session._id },
        { $set: { status: session.status, lastActivity: new Date() } }
      );
      io.to(session.roomCode).emit('error', { message: 'Game error. Please restart.' });
      return;
    }

    const { imposter, isImposterCaught, oldPoints } = scored;
    session.status = 'results';
    const updated = await GameSession.findOneAndUpdate(
      { _id: session._id },
      {
        $set: {
          status: session.status,
          players: session.players,
          lastActivity: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    if (!updated) return;
    session = updated;

    const results = {
      imposter: {
        playerId: imposter.playerId,
        nickname: imposter.nickname,
        word: imposter.word
      },
      isImposterCaught,
      players: session.players.map((p) => ({
        playerId: p.playerId,
        nickname: p.nickname,
        isImposter: p.isImposter,
        votesReceived: p.votesReceived,
        oldPoints: oldPoints[p.playerId] || 0,
        roundPoints: p.leaguePoints - (oldPoints[p.playerId] || 0),
        leaguePoints: p.leaguePoints
      })),
      voteHistory: session.votes,
      leagueGameNumber: session.leagueGameNumber
    };

    io.to(session.roomCode).emit('round-results', results);
    io.to(session.roomCode).emit('phase-changed', {
      status: 'results',
      leagueGameNumber: session.leagueGameNumber
    });

    clearRoundTimer(session.roomCode);
    const roomCode = session.roomCode;
    const timer = setTimeout(async () => {
      roundAdvanceTimers.delete(roomCode);
      try {
        const latest = await GameSession.findOne({ roomCode });
        if (!latest || latest.status !== 'results') return;

        const next = nextLeagueStatus(latest.leagueGameNumber);
        latest.leagueGameNumber = next.leagueGameNumber;
        if (next.isLeagueComplete) {
          latest.isLeagueComplete = true;
          latest.status = 'podium';
          await GameSession.findOneAndUpdate(
            { _id: latest._id },
            {
              $set: {
                leagueGameNumber: latest.leagueGameNumber,
                isLeagueComplete: latest.isLeagueComplete,
                status: latest.status,
                lastActivity: new Date()
              }
            }
          );
          io.to(roomCode).emit('league-complete', {
            players: publicPlayers(latest),
            hostId: latest.hostId,
            roomCode
          });
          return;
        }

        dealRound(latest);
        latest.status = 'reveal';
        await GameSession.findOneAndUpdate(
          { _id: latest._id },
          {
            $set: {
              status: latest.status,
              leagueGameNumber: latest.leagueGameNumber,
              players: latest.players,
              usedPairs: latest.usedPairs,
              speakerQueue: latest.speakerQueue,
              currentSpeakerIndex: latest.currentSpeakerIndex,
              votes: latest.votes,
              readyToVote: latest.readyToVote,
              isRevote: latest.isRevote,
              tiedPlayerIds: latest.tiedPlayerIds,
              lastActivity: new Date()
            }
          }
        );

        io.to(roomCode).emit('next-round', {
          leagueGameNumber: latest.leagueGameNumber,
          players: publicPlayers(latest),
          hostId: latest.hostId
        });
        io.to(roomCode).emit('phase-changed', {
          status: 'reveal',
          players: publicPlayers(latest),
          message: `Game ${latest.leagueGameNumber} of ${LEAGUE_GAMES}`,
          leagueGameNumber: latest.leagueGameNumber
        });
        emitYourWords(latest);
      } catch (error) {
        console.error('Advance round error:', error);
      }
    }, getRoundAdvanceMs());
    roundAdvanceTimers.set(roomCode, timer);
  } catch (error) {
    console.error('Calculate results error:', error);
  }
}

function emitGameState(socket, session, player) {
  if (!player) return;
  if (session.status === 'reveal' || session.status === 'clue') {
    emitToPlayer(player.playerId, 'your-word', {
      word: player.word,
      isImposter: player.isImposter,
      leagueGameNumber: session.leagueGameNumber
    });
  }
  socket.emit('game-state', {
    status: session.status,
    players: publicPlayers(session),
    pendingJoins: publicPendingJoins(session),
    hostId: session.hostId,
    mode: session.mode,
    leagueGameNumber: session.leagueGameNumber,
    speakerQueue: session.speakerQueue,
    currentSpeakerIndex: session.currentSpeakerIndex,
    isRevote: session.isRevote === true,
    tiedPlayerIds: session.tiedPlayerIds || [],
    word: player.isWaitingForNextRound ? '' : player.word,
    isImposter: player.isWaitingForNextRound ? false : player.isImposter,
    waiting: player.isWaitingForNextRound === true,
    clues: session.players
      .filter((p) => p.clueSubmitted)
      .map((p) => ({ nickname: p.nickname, clue: p.clueSubmitted })),
    hasAcknowledgedWord: player.hasAcknowledgedWord,
    hasVoted: player.hasVoted,
    hasVerballyPrepared: player.hasVerballyPrepared,
    readyCount: (session.readyToVote || []).length
  });
}

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('BluffHunt API is running. Build the frontend to serve the game from this origin.');
  });
}

function startHttpServer() {
  return new Promise((resolve, reject) => {
    const onError = (err) => {
      server.off('listening', onListening);
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Stop the other process or set a different PORT.`);
      }
      reject(err);
    };
    const onListening = () => {
      server.off('error', onError);
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : PORT;
      console.log(`🚀 BluffHunt server is running on http://localhost:${port}`);
      if (isProd && !fs.existsSync(frontendDist)) {
        console.warn('⚠️ frontend/dist not found. Run `npm run build` before deploying.');
      }
      resolve({ server, io, port });
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(PORT, '0.0.0.0');
  });
}

function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  stop().then(() => process.exit(0)).catch(() => process.exit(1));
  setTimeout(() => process.exit(1), 10000).unref();
}

async function stop() {
  roundAdvanceTimers.forEach((timer) => clearTimeout(timer));
  roundAdvanceTimers.clear();
  await new Promise((resolve) => {
    if (!server.listening) return resolve();
    server.close(() => resolve());
  });
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
}

async function boot() {
  await connectDB();
  return startHttpServer();
}

if (require.main === module) {
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  boot().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { app, server, io, boot, startHttpServer, stop, shutdown };