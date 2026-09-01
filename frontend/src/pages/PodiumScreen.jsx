// frontend/src/pages/PodiumScreen.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import socket, { emitRejoin, setHasJoinedRoom } from '../socket';
import ScreenShell from '../components/ScreenShell';
import { useToast } from '../components/Toast';

const PodiumScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    players,
    roomCode,
    hostId: stateHostId
  } = location.state || {};

  const [sortedPlayers, setSortedPlayers] = useState([]);
  const currentPlayerId = localStorage.getItem('playerId');
  const hostId = stateHostId || localStorage.getItem('hostId');
  const isHost = currentPlayerId === hostId;

  useEffect(() => {
    if (!players) {
      setHasJoinedRoom(false);
      navigate('/');
      return undefined;
    }
    const sorted = [...players].sort((a, b) => b.leaguePoints - a.leaguePoints);
    setSortedPlayers(sorted);

    emitRejoin();
    const onConnect = () => emitRejoin();
    const onLeagueReset = (data) => {
      localStorage.setItem('hostId', data.hostId);
      setHasJoinedRoom(true);
      navigate('/lobby', {
        state: {
          roomCode: data.roomCode || roomCode,
          players: data.players,
          hostId: data.hostId,
          mode: data.mode
        }
      });
    };
    const onError = (data) => showToast(data.message || 'Error', 'error');

    socket.on('connect', onConnect);
    socket.on('league-reset', onLeagueReset);
    socket.on('error', onError);
    return () => {
      socket.off('connect', onConnect);
      socket.off('league-reset', onLeagueReset);
      socket.off('error', onError);
    };
  }, [players, navigate, roomCode, showToast]);

  const handleNewLeague = () => {
    if (isHost) {
      socket.emit('start-new-league');
    } else {
      setHasJoinedRoom(false);
      navigate('/');
    }
  };

  const champion = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];

  return (
    <ScreenShell compact>
      <Confetti recycle={false} numberOfPieces={500} />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-4">
        {/* Header */}
        <div className="mb-6">
          <span className="px-3 py-1 rounded-full text-[11px] font-display font-black tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase mb-2 inline-block shadow-glow-gold">
            Season Grand Finale
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(251,191,36,0.4)]">
            LEAGUE CHAMPIONS!
          </h1>
          <p className="font-body text-slate-400 text-xs mt-1">Room #{roomCode} • 10 Rounds Complete</p>
        </div>

        {/* Podium Pillars */}
        <div className="w-full max-w-sm flex items-end justify-center gap-2 sm:gap-4 my-2">
          {/* 2nd Place */}
          {second && (
            <div className="flex-1 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 ring-2 ring-slate-200/50 flex flex-col items-center justify-center text-2xl shadow-xl">
                <span>{second.avatar || '🥈'}</span>
                <span className="text-xs font-black text-slate-900">2ND</span>
              </div>
              <p className="font-display font-bold text-white mt-2 text-xs sm:text-sm truncate max-w-[90px]">
                {second.nickname}
              </p>
              <span className="px-2 py-0.5 mt-0.5 rounded-full bg-slate-800 text-[11px] font-display font-black text-slate-300 border border-slate-700">
                {second.leaguePoints} pts
              </span>
            </div>
          )}

          {/* 1st Place - Champion */}
          {champion && (
            <div className="flex-1 flex flex-col items-center -mt-6">
              <div className="text-3xl mb-1 animate-bounce">👑</div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 ring-4 ring-amber-300/80 shadow-glow-gold flex flex-col items-center justify-center text-3xl">
                <span>{champion.avatar || '🥇'}</span>
                <span className="text-xs font-black text-slate-950">1ST</span>
              </div>
              <p className="font-display font-black text-amber-300 mt-2 text-sm sm:text-base truncate max-w-[110px]">
                {champion.nickname}
              </p>
              <span className="px-2.5 py-0.5 mt-0.5 rounded-full bg-amber-400/20 text-xs font-display font-black text-amber-300 border border-amber-400/40">
                {champion.leaguePoints} pts
              </span>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="flex-1 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 ring-2 ring-amber-500/40 flex flex-col items-center justify-center text-2xl shadow-xl">
                <span>{third.avatar || '🥉'}</span>
                <span className="text-xs font-black text-amber-200">3RD</span>
              </div>
              <p className="font-display font-bold text-white mt-2 text-xs sm:text-sm truncate max-w-[90px]">
                {third.nickname}
              </p>
              <span className="px-2 py-0.5 mt-0.5 rounded-full bg-slate-800 text-[11px] font-display font-black text-slate-300 border border-slate-700">
                {third.leaguePoints} pts
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full max-w-sm mt-8">
          <button
            type="button"
            onClick={handleNewLeague}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-base rounded-2xl transition-all duration-150 shadow-glow-purple active:scale-[0.98]"
          >
            {isHost ? '🔄 Start New 10-Game League' : '🏠 Return to Home Screen'}
          </button>

          {!isHost && (
            <p className="font-body text-xs text-slate-400 mt-2">
              Waiting for the Host to start a new league...
            </p>
          )}
        </div>
      </div>
    </ScreenShell>
  );
};

export default PodiumScreen;