// frontend/src/pages/PodiumScreen.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import socket, { emitRejoin } from '../socket';
import ScreenShell from '../components/ScreenShell';
import LeaveButton from '../components/LeaveButton';

const PodiumScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      navigate('/');
      return undefined;
    }
    const sorted = [...players].sort((a, b) => b.leaguePoints - a.leaguePoints);
    setSortedPlayers(sorted);

    emitRejoin();
    const onConnect = () => emitRejoin();
    const onLeagueReset = (data) => {
      localStorage.setItem('hostId', data.hostId);
      navigate('/lobby', {
        state: {
          roomCode: data.roomCode || roomCode,
          players: data.players,
          hostId: data.hostId,
          mode: data.mode
        }
      });
    };
    const onError = (data) => alert(data.message);

    socket.on('connect', onConnect);
    socket.on('league-reset', onLeagueReset);
    socket.on('error', onError);
    return () => {
      socket.off('connect', onConnect);
      socket.off('league-reset', onLeagueReset);
      socket.off('error', onError);
    };
  }, [players, navigate, roomCode]);

  const handleNewLeague = () => {
    if (isHost) {
      socket.emit('start-new-league');
    } else {
      navigate('/');
    }
  };

  const champion = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];

  return (
    <ScreenShell compact>
      <Confetti recycle={false} numberOfPieces={400} />
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="font-display font-extrabold text-4xl text-bluff-gold mb-2">
          🏆 LEAGUE CHAMPIONS!
        </h1>
        <p className="font-body text-bluff-muted mb-8">Room #{roomCode}</p>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4">
          {/* 2nd Place */}
          {second && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-gray-400 to-gray-600 flex items-center justify-center text-3xl shadow-lg">
                🥈
              </div>
              <p className="font-display font-bold text-white mt-2 text-sm md:text-base">{second.nickname}</p>
              <p className="font-body text-xs text-bluff-muted">{second.leaguePoints} pts</p>
            </div>
          )}

          {/* 1st Place */}
          {champion && (
            <div className="flex flex-col items-center -mt-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-bluff-gold to-yellow-600 flex items-center justify-center text-4xl shadow-xl">
                🥇
              </div>
              <p className="font-display font-extrabold text-lg md:text-xl text-bluff-gold mt-2">
                {champion.nickname}
              </p>
              <p className="font-body text-xs md:text-sm text-bluff-muted">
                {champion.leaguePoints} pts
              </p>
              <span className="text-xs font-display text-bluff-gold mt-1">👑 Champion</span>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-orange-400 to-orange-700 flex items-center justify-center text-3xl shadow-lg">
                🥉
              </div>
              <p className="font-display font-bold text-white mt-2 text-sm md:text-base">{third.nickname}</p>
              <p className="font-body text-xs text-bluff-muted">{third.leaguePoints} pts</p>
            </div>
          )}
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleNewLeague}
          className="mt-8 py-3 px-8 bg-bluff-purple text-white font-display font-bold rounded-xl hover:bg-bluff-purple-dark transition-all shadow-lg hover:shadow-purple-500/30"
        >
          {isHost ? '🔄 Start New League' : '🏠 Back Home'}
        </button>

        {!isHost && (
          <p className="font-body text-xs text-bluff-muted mt-2">
            Waiting for the Host to start a new league...
          </p>
        )}

        {/* Leave Button */}
        <div className="mt-4">
          <LeaveButton compact />
        </div>
      </div>
    </ScreenShell>
  );
};

export default PodiumScreen;