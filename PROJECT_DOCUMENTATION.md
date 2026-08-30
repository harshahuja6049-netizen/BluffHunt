# BluffHunt — Full Project Documentation & Technical Architecture

**BluffHunt** is a real-time multiplayer detective and bluffing digital party game built for 3–10 players using the **MERN** stack (MongoDB, Express, React, Node.js) and **Socket.IO**. 

Designed for both remote and in-person family game nights, players give subtle clues about their assigned words to deduce who among them is the **Imposter** pretending to know the secret word.

---

## 1. Game Concept & Rules

### Core Premise
- In each round of a **10-game league**, every player receives a secret word.
- **Agents** (majority of players) receive the **same secret word** (e.g., *"Samosa"*).
- **The Imposter** (1 randomly selected player) receives a **different, unrelated decoy word** (e.g., *"Pizza"*).
- Players take turns giving a single clue about their word.
  - **Agents** must give clues specific enough so fellow agents recognize them, but vague enough that the Imposter cannot easily deduce the true agent word.
  - **The Imposter** must listen closely to other clues, bluff, and give a convincing clue without knowing the agent word.

### Game Phases
1. **Reveal Phase (👁️)**: Players view their assigned secret role and word privately on their device, clicking *"I Know My Secret Word"* to lock it into memory. Once acknowledged, the word is hidden from the UI to protect privacy from onlookers.
2. **Clue Phase (🔍)**: Players submit clues in a strict turn-based queue.
   - **Online Mode**: Clues are typed (up to 80 characters) and broadcasted in real time.
   - **Offline Mode**: Players physically say their clue out loud to the room and press *"I Said My Clue"*.
3. **Discussion Phase (💬)**: Clues are visible to all players. Players debate who the Imposter is in real-time chat or out loud, then click *"🗳️ I'm Ready to Vote"*. When all active players are ready, voting automatically begins.
4. **Voting Phase (🗳️)**: Every player points a finger at their primary suspect. If two or more players tie for highest votes, a **Re-Vote** is triggered restricting candidates strictly to the tied players.
5. **Results Phase (📊)**: The Imposter's identity and decoy word are revealed, round points are awarded, and updated league standings are displayed before advancing to the next round.
6. **Podium Phase (🏆)**: After 10 games, a grand podium celebration displays the Top 3 champions with confetti, with an option for the Host to start a fresh 10-game league.

### Scoring Rules
- **Imposter Caught**: Agents who successfully voted for the Imposter receive **+3 points**.
- **Imposter Escapes / Survives**: The Imposter receives **+5 points**.
- **Zero-Vote Imposter Bonus**: If the Imposter survives and receives **0 votes**, they receive an extra **+2 bonus points** (Total: **+7 points**).

---

## 2. Technology Stack & Directory Structure

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS | High-performance mobile-first responsive PWA UI |
| **Real-time Comms** | Socket.IO (`socket.io-client` 4.x) | Low-latency bi-directional WebSocket event delivery |
| **Sound & Haptics** | Web Audio API + Vibration API | Asset-free synthesized sound effects & mobile vibration |
| **Backend** | Node.js, Express.js | API routing, static asset serving, health endpoints |
| **Real-time Server** | Socket.IO Server (`socket.io` 4.x) | Game state machines, turn queues, room management |
| **Database** | MongoDB Atlas with Mongoose ODM | Session persistence, auto-expiration TTL indexes |
| **Testing** | Node.js Native Test Runner (`node:test`) | Unit tests and automated 10-game multi-client socket tests |

### Project Directory Layout
```
BluffHunt/
├── backend/
│   ├── models/
│   │   └── GameSession.js       # Mongoose Schema & TTL indexes
│   ├── test/
│   │   ├── gameLogic.test.js    # 16 unit tests for core game rules
│   │   └── league.e2e.test.js   # Full 10-game socket simulation test
│   ├── gameLogic.js             # Pure logic: limits, leaks, clues, ties, scoring
│   ├── server.js                # Express & Socket.IO server implementation
│   ├── words.json               # Word bank with themed categories
│   └── test-game.js             # Automated multi-client test harness
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JoinRequestModal.jsx # Host mid-game admission modal
│   │   │   ├── LeaveButton.jsx      # Safe room departure button
│   │   │   ├── ScreenShell.jsx      # Glassmorphism container layout
│   │   │   └── Toast.jsx            # In-app animated toast notification system
│   │   ├── pages/
│   │   │   ├── JoinScreen.jsx       # Landing, nickname & avatar selector
│   │   │   ├── LobbyScreen.jsx      # Room lobby, players list, host controls
│   │   │   ├── GameScreen.jsx       # Master 5-phase game screen
│   │   │   └── PodiumScreen.jsx     # Final 10-game celebration & podium
│   │   ├── utils/
│   │   │   └── soundEffects.js      # Web Audio synthesizer & mobile haptics
│   │   ├── App.jsx                  # Route definitions & ToastProvider wrapper
│   │   ├── main.jsx                 # React root entry point
│   │   └── socket.js                # Configured Socket.IO client instance
│   ├── vercel.json                  # Vercel SPA rewrite rules
│   └── vite.config.js               # Vite build & PWA configuration
└── package.json                     # Monorepo scripts
```

---

## 3. Data Model & Schema (`backend/models/GameSession.js`)

Each active game session is stored in MongoDB under the `GameSession` schema:

```javascript
const gameSessionSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true, trim: true },
  hostId: { type: String, required: true },
  status: {
    type: String,
    default: 'lobby',
    enum: ['lobby', 'reveal', 'clue', 'discussion', 'voting', 'results', 'podium']
  },
  mode: { type: String, default: 'online', enum: ['online', 'offline'] },
  players: [{
    playerId: { type: String, required: true },
    nickname: { type: String, required: true },
    avatar: { type: String, default: '🕵️' },
    isImposter: { type: Boolean, default: false },
    word: { type: String, default: '' },
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
  usedPairs: [{ agent: String, imposter: String }],
  leagueGameNumber: { type: Number, default: 1 },
  isLeagueComplete: { type: Boolean, default: false },
  votes: [{ voterId: String, accusedId: String }],
  readyToVote: [String],
  isRevote: { type: Boolean, default: false },
  tiedPlayerIds: [String],
  kickedPlayerIds: [String],
  speakerQueue: [String],
  currentSpeakerIndex: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now }
}, { timestamps: true });

// Auto-delete abandoned/deactivated rooms after 2 hours (7200s) of inactivity
gameSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 7200 });
// High-speed lookup index for player reconnects
gameSessionSchema.index({ 'players.playerId': 1 });
```

---

## 4. Comprehensive Feature Breakdown & Implementation Details

### Feature 1: Word Bank & Dynamic Unordered Pair Selection
* **Problem**: In a 10-game league, players should never receive duplicate word pairs, even if the words appear in reverse order (e.g. Samosa vs Sandwich vs Sandwich vs Samosa).
* **How it is made**:
  - `isSamePair(p1, p2)` in `backend/gameLogic.js` compares both forward `(a1===a2 && i1===i2)` and reverse `(a1===i2 && i1===a2)` pairs.
  - `assignWordsAndImposter(session, wordBank)` filters out all previously `usedPairs` from the session history, randomly selects an unused pair from `words.json`, picks a random player as the Imposter, and distributes words.

### Feature 2: Secret Word Leak Detection with Word Boundaries
* **Problem**: Naive substring matching (e.g., `text.includes(secretWord)`) rejects innocent clues (e.g., rejecting *"camera"* because the secret word is *"Ram"*).
* **How it is made**:
  - `containsSecretWord(text, secret)` in `backend/gameLogic.js` builds a dynamic regex boundary:
    ```javascript
    const escaped = escapeRegex(cleanSecret);
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    return regex.test(cleanText);
    ```
  - This ensures words are matched as distinct tokens and hyphenated compounds while ignoring innocent substrings.

### Feature 3: Clue Uniqueness & Word Overlap Algorithm
* **Problem**: Players must not reuse meaningful words or phrases that another player has already used in their clue during the current round (e.g., Player 1 says *"crispy snack"*; Player 2 cannot say *"snack"*, *"crispy"*, or *"very crispy snack"*).
* **How it is made**:
  - `extractMeaningfulWords(text)` normalizes the string (lowercase, strips punctuation using `[^\p{L}\p{N}]/gu`, splits by whitespace) and filters out common filler words using `COMMON_FILLER_WORDS` (stop-words like *the, a, is, of, to, in, very, and, etc.*).
  - In `validateClue(session, playerId, clue)`, the meaningful words of the new clue are compared against the set of all meaningful words from clues already submitted in the current round.
  - If an overlap exists, it returns: `"That clue uses a word that's already been used. Try a different clue."` without advancing the turn.

### Feature 4: Secret Word Privacy Protection
* **Problem**: In party environments, having *"Your word: [WORD]"* persistently visible on the header allows physical onlookers to peek.
* **How it is made**:
  - The secret word is displayed **only** during `phase === 'reveal'` on the player's card.
  - The player clicks *"👁️ I Know My Secret Word"* to memorize it.
  - On transition to `clue`, `discussion`, and `voting` phases, the secret word is completely removed from the header and DOM.

### Feature 5: Dynamic 3–10 Player Lobby & Mid-Game Admissions
* **Problem**: Party sizes vary between 3 and 10 players. Late-joining players shouldn't break an ongoing round.
* **How it is made**:
  - `MIN_PLAYERS = 3`, `MAX_PLAYERS = 10` enforced on room creation and joining.
  - If a player joins during an active round (`reveal`, `clue`, `discussion`, `voting`, `results`), they are placed in `pendingJoins`.
  - The Host receives a `join-requests` modal to admit or decline them. Once admitted, their player record is flagged with `isWaitingForNextRound = true`, placing them into spectator mode until the next round starts.

### Feature 6: Dual Game Modes (Online vs Offline)
* **Online Mode**:
  - A randomized `speakerQueue` determines speaker order.
  - The active player receives a `your-turn` socket event, unlocking an 80-character input box while other players see a *"Waiting for [Player]..."* placeholder.
* **Offline Mode**:
  - The active player sees *"🗣️ YOUR TURN! Say your clue out loud to the room"* with an *"✅ I SAID MY CLUE"* button. Clicking it emits `verbal-ready` and advances to the next player in the queue.

### Feature 7: Unified Discussion Phase Transition
* **Problem**: Separate "Ready" and "Vote" buttons cause confusion and out-of-order state transitions.
* **How it is made**:
  - In `phase === 'discussion'`, players have one clear action button: `🗳️ I'm Ready to Vote (X/Y ready)`.
  - Clicking it adds the player's ID to `readyToVote` in MongoDB.
  - When `readyToVote.length === activePlayers.length`, the server automatically clears previous votes and transitions the room to `status: 'voting'`.

### Feature 8: Voting Engine, Tie Detection & Re-Vote State Machine
* **Problem**: Equal highest votes shouldn't result in an arbitrary winner or deadlock.
* **How it is made**:
  - `checkVotingTies(session)` in `backend/gameLogic.js` tallies votes:
    ```javascript
    const maxVotes = Math.max(...counts);
    const tied = active.filter(p => (votesMap[p.playerId] || 0) === maxVotes);
    return { isTie: tied.length > 1, tiedPlayerIds: tied.map(p => p.playerId) };
    ```
  - **First Tie**: Emits `revote-started` with `isRevote: true` and `tiedPlayerIds`. The client filters candidates strictly down to the tied players.
  - **Second Tie**: If the re-vote also ends in a tie, the Imposter successfully escapes!

### Feature 9: Universal Host Kick & Safety Fallbacks
* **Problem**: Trolls or disconnected players can stall the game in any phase.
* **How it is made**:
  - The Host has access to a **"👑 Players"** drawer across all phases (Lobby, Reveal, Clue, Discussion, Voting, Results).
  - When a player is kicked:
    - Their ID is appended to `kickedPlayerIds` to prevent re-joining.
    - If kicked during Voting, their vote is removed and vote completion is recalculated.
    - If kicked during Clues, the speaker queue is updated and turn order is repaired.
    - If active players drop below 3, `resumeAfterDeparture` automatically clears timers and safely returns the room to the Lobby with an informative alert.

### Feature 10: In-App Animated Toast System
* **Problem**: Native browser `alert()` popups freeze the JavaScript thread, break immersion, and look unpolished on mobile.
* **How it is made**:
  - `ToastProvider` and `useToast()` hook in `frontend/src/components/Toast.jsx` render floating, glassmorphism toast banners (`error`, `warning`, `success`, `info`) with auto-dismiss timers and exit animations.

### Feature 11: Web Audio Synthesizer & Mobile Haptics
* **Problem**: External `.mp3` audio files add download overhead and often fail to load on free hosting tiers.
* **How it is made**:
  - `SoundManager` in `frontend/src/utils/soundEffects.js` uses standard browser `AudioContext` and `OscillatorNode` to synthesize tones on-the-fly:
    - **Turn Chime**: Melodic two-tone (D5 → A5) + haptic pulse.
    - **Reveal Chime**: Tension tone (E4 → B4).
    - **Vote Chime**: Confirmation chord (C5 → E5).
    - **Imposter Caught**: Major chord progression (A4 → C#5 → E5 → A5).
    - **Imposter Escaped**: Descending sawtooth sweep.
    - **Mute Toggle**: Persisted in `localStorage` (`bluffhunt_muted`).

### Feature 12: Player Emoji Avatars & Identity
* **Problem**: Plain text nicknames make it difficult to distinguish players during fast-paced games.
* **How it is made**:
  - Players select an avatar (`🕵️`, `🦁`, `🍕`, `🎭`, `🚀`, `🦊`, `👑`, `🎯`, `⚡`, `🥑`) on `JoinScreen.jsx`.
  - The chosen avatar is persisted to `localStorage` and sent with `create-room` / `join-room`.
  - Displayed across Lobby lists, Clue feeds, Chat messages, Voting candidate cards, and the Podium.

### Feature 13: Free-Tier Resilience (Render + MongoDB Atlas + Vercel)
* **MongoDB Storage**: Auto-deletes abandoned rooms after **2 hours** (`expireAfterSeconds: 7200`) using MongoDB background TTL threads.
* **Socket Rate Limiting**: `checkRateLimit(socket.id, action, minIntervalMs)` throttles `send-chat`, `submit-clue`, `ready-to-vote`, and `cast-vote` to protect free-tier CPU limits.
* **Vercel SPA Rewrites**: `frontend/vercel.json` rewrites all paths to `index.html`, eliminating 404s on browser refreshes.
* **Cold Start Indicator**: `JoinScreen.jsx` informs players when Render is waking up (`⏳ Connecting to server (may take ~45s if waking from sleep)...`).

---

## 5. Socket.IO Event Reference

### Client -> Server Events

| Event | Payload | Purpose |
| :--- | :--- | :--- |
| `create-room` | `{ nickname, avatar, mode }` | Creates a new game session with a 4-digit room code |
| `join-room` | `{ nickname, avatar, roomCode, playerId? }` | Joins or reconnects to an existing room |
| `respond-join` | `{ requestId, approve }` | Host accepts or declines a late-joining spectator |
| `change-mode` | `{ mode: 'online' \| 'offline' }` | Host switches between Online and Offline modes |
| `start-game` | `{}` | Host initiates Game 1 of the league |
| `acknowledge-word` | `{}` | Player confirms they know their secret word |
| `submit-clue` | `{ clue }` | Active player submits their text clue (Online mode) |
| `verbal-ready` | `{}` | Active player confirms they spoke their clue (Offline mode) |
| `send-chat` | `{ message }` | Player broadcasts a chat message during Discussion |
| `ready-to-vote` | `{}` | Player votes to advance from Discussion to Voting |
| `cast-vote` | `{ accusedId }` | Player casts a vote for the suspected Imposter |
| `kick-player` | `{ targetPlayerId }` | Host removes a player from the session |
| `start-new-league` | `{}` | Host resets all scores and pairs to start a new 10-game league |
| `leave-room` | `{}` | Player departs the room voluntarily |

### Server -> Client Events

| Event | Payload | Purpose |
| :--- | :--- | :--- |
| `room-created` | `{ roomCode, playerId, players, hostId, mode }` | Emitted to creator upon room generation |
| `room-joined` | `{ roomCode, playerId, players, hostId, mode, status, leagueGameNumber }` | Emitted upon successful join |
| `join-pending` | `{ roomCode, playerId, requestId, message }` | Emitted to late joiners awaiting host approval |
| `players-updated` | `{ players, hostId, pendingJoins }` | Broadcasted when player states/connections change |
| `game-started` | `{ players, hostId, mode, leagueGameNumber }` | Broadcasted when Host starts the league |
| `your-word` | `{ word, isImposter, leagueGameNumber }` | Emitted privately to each player with their word |
| `your-turn` | `{ message }` | Emitted to the active speaker in the clue queue |
| `clue-submitted` | `{ playerId, nickname, avatar, clue }` | Broadcasted when a player submits a clue |
| `verbal-progress` | `{ playerId, nickname, avatar, preparedCount, totalPlayers }` | Broadcasted on offline turn progression |
| `chat-message` | `{ playerId, nickname, avatar, message, timestamp }` | Broadcasted live chat message during Discussion |
| `ready-progress` | `{ readyCount, totalPlayers }` | Broadcasted update on ready-to-vote progress |
| `phase-changed` | `{ status, players, message, leagueGameNumber, isRevote, tiedPlayerIds }` | Broadcasted on every phase transition |
| `vote-submitted` | `{ message }` | Emitted to voter acknowledging receipt of their vote |
| `vote-progress` | `{ votedCount, totalPlayers }` | Broadcasted update on vote submission progress |
| `revote-started` | `{ tiedPlayerIds, message }` | Broadcasted when a tie triggers a restricted re-vote |
| `round-results` | `{ imposter, isImposterCaught, players }` | Broadcasted with score results at round end |
| `next-round` | `{ leagueGameNumber, players, hostId }` | Broadcasted when advancing to the next round |
| `league-complete` | `{ players, roomCode, hostId }` | Broadcasted after round 10 to open the Podium |
| `league-reset` | `{ players, hostId, mode }` | Broadcasted when Host restarts the league |
| `kicked` | `{ message }` | Emitted to a player who was removed by the Host |
| `error` | `{ message }` | Emitted on validation errors or illegal actions |

---

## 6. Testing & Quality Assurance

### 1. Unit Tests (`backend/test/gameLogic.test.js`)
Contains **16 automated test suites** executing with Node's native runner:
- 3–10 player limits and 10-game league boundary enforcement.
- Nickname validation (2–15 characters, alphanumeric).
- Word-boundary leak detection (`\b` matching).
- Clue uniqueness & meaningful word overlap detection (`extractMeaningfulWords`).
- Secret word chat filtering.
- Unordered pair duplicate detection (`isSamePair`).
- Voting tie detection & scoring calculations.
- Host transfer fallbacks.

### 2. End-to-End Socket League Simulation (`backend/test/league.e2e.test.js`)
Spawns an ephemeral server on a dynamic port, connects **3 distinct Socket.IO test clients**, and automates a complete **10-game league** from room creation to podium completion, verifying event lifecycles, database persistence, and tie resolution.

---

## 7. How to Run the Project Locally

```powershell
# 1. Clone & Install Dependencies
npm install
npm run install:all

# 2. Run Backend Unit Tests (16 tests)
npm test

# 3. Run 10-Game E2E Socket League Simulation
npm run test:e2e --prefix backend

# 4. Build Frontend Production Bundle
npm run build --prefix frontend

# 5. Start Backend Server (serving built frontend)
npm start
```
The game will be available at `http://localhost:5000`.
