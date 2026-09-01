import { useNavigate } from 'react-router-dom';
import socket, { clearRoomSession, setHasJoinedRoom } from '../socket';

const LeaveButton = ({ compact = false }) => {
  const navigate = useNavigate();

  const handleLeave = () => {
    if (!window.confirm('Leave this room?')) return;
    socket.emit('leave-room');
    clearRoomSession();
    setHasJoinedRoom(false);
    navigate('/');
  };

  return (
    <button
      type="button"
      onClick={handleLeave}
      className={compact
        ? 'text-xs font-display font-semibold text-bluff-pink'
        : 'w-full py-2 text-bluff-pink font-display font-semibold text-sm'}
    >
      Leave
    </button>
  );
};

export default LeaveButton;
