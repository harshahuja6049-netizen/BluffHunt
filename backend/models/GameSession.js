const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    hostId:{
        type: String,
        required:true
    },
    status: {
        type: String,
        default: 'lobby',
        enum: ['lobby', 'reveal', 'clue', 'discussion', 'voting', 'results', 'podium']
    },
    mode:{
        type: String,
        default: 'online',
        enum: ['online', 'offline']
    },
    players: [{
        playerId: { type: String, required: true },
        nickname: { type: String, required: true },
        avatar: { type: String, default: '🕵️' },
        isImposter: { type: Boolean, default: false },
        word: { type: String, default:''},
        clueSubmitted: { type: String, default: '' }, 
        hasVerballyPrepared: { type: Boolean, default: false },  
        hasAcknowledgedWord: { type: Boolean, default: false },
        hasVoted: { type: Boolean, default: false },        
        votesReceived: { type: Number, default: 0 },
        leaguePoints: { type: Number, default: 0 },
        isConnected: { type: Boolean, default: true },
        disconnectedAt: { type: Date, default: null },
        isWaitingForNextRound: { type: Boolean, default: false },
        joinedAt: { type: Date, default: Date.now }
    }],
    pendingJoins: [{
        requestId: { type: String, required: true },
        playerId: { type: String, required: true },
        nickname: { type: String, required: true },
        avatar: { type: String, default: '🕵️' },
        createdAt: { type: Date, default: Date.now }
    }],
    usedPairs: [{
        agent: String,
        imposter: String
    }],
    leagueGameNumber: {
        type: Number,
        default: 1
    },
    isLeagueComplete: {
        type: Boolean,
        default: false
    },
    votes: [{
        voterId: String,
        accusedId: String
    }],
    readyToVote:[String],
    isRevote: {
        type: Boolean,
        default: false
    },
    tiedPlayerIds: [String],
    kickedPlayerIds: [String],
    speakerQueue:[String],
    currentSpeakerIndex: {
    type: Number,
    default: 0
  },
    lastActivity: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Auto-delete abandoned/deactivated rooms after 2 hours (7200 seconds) of inactivity
gameSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 7200 });
// Fast lookup for finding active sessions by playerId
gameSessionSchema.index({ 'players.playerId': 1 });

module.exports = mongoose.model('GameSession', gameSessionSchema);