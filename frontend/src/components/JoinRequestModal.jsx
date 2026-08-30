import socket from '../socket';

const JoinRequestModal = ({ requests, isHost }) => {
  if (!isHost || !requests?.length) return null;
  const request = requests[0];

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white text-bluff-charcoal rounded-2xl shadow-2xl p-5 w-full max-w-sm">
        <p className="font-display font-bold text-lg mb-1">New player</p>
        <p className="font-body text-sm text-bluff-muted mb-4">
          <span className="font-semibold text-bluff-charcoal">{request.nickname}</span> wants to join this league.
          If you admit them, they sit out this game and join the next one.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 py-3 rounded-xl bg-gray-100 font-display font-bold"
            onClick={() => socket.emit('respond-join', { requestId: request.requestId, admit: false })}
          >
            Deny
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-xl bg-bluff-purple text-white font-display font-bold"
            onClick={() => socket.emit('respond-join', { requestId: request.requestId, admit: true })}
          >
            Admit
          </button>
        </div>
        {requests.length > 1 && (
          <p className="mt-3 text-center text-xs text-bluff-muted font-body">
            {requests.length - 1} more waiting
          </p>
        )}
      </div>
    </div>
  );
};

export default JoinRequestModal;
