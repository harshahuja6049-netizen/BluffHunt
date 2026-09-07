// frontend/src/utils/voiceChat.js
// Lightweight WebRTC Mesh Voice Chat with Socket.io signaling & speaking detection

const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

export class VoiceChatManager {
  constructor(socket, localPlayerId, options = {}) {
    this.socket = socket;
    this.localPlayerId = localPlayerId;
    this.localStream = null;
    this.peers = new Map(); // targetPlayerId -> { pc, audioEl, analyser }
    this.isMuted = false;
    this.isEnabled = false;
    this.onSpeakingChange = options.onSpeakingChange || (() => {});
    this.onStatusChange = options.onStatusChange || (() => {});
    this.analyserInterval = null;
    this.audioContext = null;
    this.localAnalyser = null;
    this.error = null;

    this.handleSignal = this.handleSignal.bind(this);
  }

  async init() {
    if (this.isEnabled) return true;
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Microphone not supported on this browser/device.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      this.localStream = stream;
      this.isEnabled = true;
      this.isMuted = false;
      this.error = null;

      // Setup local speaking analyzer
      this.setupSpeakingDetection();

      // Register socket signaling listener
      this.socket.on('webrtc-signal', this.handleSignal);

      this.onStatusChange({ isEnabled: true, isMuted: this.isMuted, error: null });
      return true;
    } catch (err) {
      console.warn('VoiceChat init error:', err);
      this.error = err.message || 'Microphone access denied';
      this.isEnabled = false;
      this.onStatusChange({ isEnabled: false, isMuted: true, error: this.error });
      return false;
    }
  }

  setupSpeakingDetection() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.audioContext = new AudioCtx();

      if (this.localStream) {
        const source = this.audioContext.createMediaStreamSource(this.localStream);
        this.localAnalyser = this.audioContext.createAnalyser();
        this.localAnalyser.fftSize = 256;
        source.connect(this.localAnalyser);
      }

      this.analyserInterval = setInterval(() => {
        // Local speaking
        if (this.localAnalyser && !this.isMuted && this.isEnabled) {
          const data = new Uint8Array(this.localAnalyser.frequencyBinCount);
          this.localAnalyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;
          const isSpeaking = avg > 20;
          this.onSpeakingChange(this.localPlayerId, isSpeaking);
        } else {
          this.onSpeakingChange(this.localPlayerId, false);
        }

        // Remote peers speaking
        this.peers.forEach((peer, peerId) => {
          if (peer.analyser) {
            const data = new Uint8Array(peer.analyser.frequencyBinCount);
            peer.analyser.getByteFrequencyData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) sum += data[i];
            const avg = sum / data.length;
            this.onSpeakingChange(peerId, avg > 20);
          }
        });
      }, 100);
    } catch {
      // Ignore audio analyser setup failures gracefully
    }
  }

  toggleMute() {
    if (!this.localStream) return true;
    this.isMuted = !this.isMuted;
    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = !this.isMuted;
    });
    this.onStatusChange({ isEnabled: this.isEnabled, isMuted: this.isMuted, error: this.error });
    return this.isMuted;
  }

  setMute(muted) {
    if (!this.localStream) return;
    this.isMuted = Boolean(muted);
    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = !this.isMuted;
    });
    this.onStatusChange({ isEnabled: this.isEnabled, isMuted: this.isMuted, error: this.error });
  }

  // Connect with a specific remote player
  async connectPeer(targetPlayerId, isInitiator = false) {
    if (!this.isEnabled || !this.localStream || targetPlayerId === this.localPlayerId) return;
    if (this.peers.has(targetPlayerId)) return;

    try {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      const peerData = { pc, audioEl: null, analyser: null };
      this.peers.set(targetPlayerId, peerData);

      // Add local audio tracks
      this.localStream.getAudioTracks().forEach((track) => {
        pc.addTrack(track, this.localStream);
      });

      // Handle remote audio track
      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (!remoteStream) return;

        let audioEl = peerData.audioEl;
        if (!audioEl) {
          audioEl = document.createElement('audio');
          audioEl.autoplay = true;
          audioEl.playsInline = true;
          audioEl.style.display = 'none';
          document.body.appendChild(audioEl);
          peerData.audioEl = audioEl;
        }
        audioEl.srcObject = remoteStream;
        audioEl.play().catch(() => {});

        // Setup remote analyser for speaking indicator
        if (this.audioContext) {
          try {
            const source = this.audioContext.createMediaStreamSource(remoteStream);
            const analyser = this.audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            peerData.analyser = analyser;
          } catch {
            // ignore
          }
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('webrtc-signal', {
            targetPlayerId,
            signal: { type: 'candidate', candidate: event.candidate }
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          this.removePeer(targetPlayerId);
        }
      };

      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        this.socket.emit('webrtc-signal', {
          targetPlayerId,
          signal: { type: 'offer', sdp: pc.localDescription }
        });
      }
    } catch (err) {
      console.warn(`Error creating peer connection to ${targetPlayerId}:`, err);
    }
  }

  // Handle incoming signaling messages
  async handleSignal(data) {
    const { senderPlayerId, signal } = data || {};
    if (!senderPlayerId || !signal || senderPlayerId === this.localPlayerId) return;

    // Ensure we have an active connection object
    let peer = this.peers.get(senderPlayerId);
    if (!peer && this.isEnabled && this.localStream) {
      await this.connectPeer(senderPlayerId, false);
      peer = this.peers.get(senderPlayerId);
    }
    if (!peer) return;

    const pc = peer.pc;
    try {
      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.socket.emit('webrtc-signal', {
          targetPlayerId: senderPlayerId,
          signal: { type: 'answer', sdp: pc.localDescription }
        });
      } else if (signal.type === 'answer') {
        if (pc.signalingState !== 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        }
      } else if (signal.type === 'candidate') {
        if (signal.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(() => {});
        }
      }
    } catch (err) {
      console.warn(`Signal handling error from ${senderPlayerId}:`, err);
    }
  }

  // Sync peers with the active player list
  syncPeers(playerList = []) {
    if (!this.isEnabled) return;
    const activeIds = new Set(
      playerList
        .filter((p) => p.playerId !== this.localPlayerId && p.isConnected !== false)
        .map((p) => p.playerId)
    );

    // Remove old disconnected peers
    this.peers.forEach((_, peerId) => {
      if (!activeIds.has(peerId)) {
        this.removePeer(peerId);
      }
    });

    // Connect to new peers (using deterministic initiator: lower ID initiates)
    activeIds.forEach((peerId) => {
      if (!this.peers.has(peerId)) {
        const isInitiator = this.localPlayerId < peerId;
        this.connectPeer(peerId, isInitiator);
      }
    });
  }

  removePeer(peerId) {
    const peer = this.peers.get(peerId);
    if (peer) {
      try {
        peer.pc.close();
      } catch {}
      if (peer.audioEl && peer.audioEl.parentNode) {
        peer.audioEl.srcObject = null;
        peer.audioEl.parentNode.removeChild(peer.audioEl);
      }
      this.peers.delete(peerId);
      this.onSpeakingChange(peerId, false);
    }
  }

  destroy() {
    if (this.analyserInterval) {
      clearInterval(this.analyserInterval);
      this.analyserInterval = null;
    }

    this.socket.off('webrtc-signal', this.handleSignal);

    this.peers.forEach((_, peerId) => this.removePeer(peerId));
    this.peers.clear();

    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.isEnabled = false;
    this.isMuted = false;
  }
}
