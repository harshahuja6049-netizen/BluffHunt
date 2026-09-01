import socket from '../socket';

const JoinRequestModal = ({ requests, isHost }) => {
  if (!isHost || !requests?.length) return null;
  const request = requests[0];

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-2xl p-5 w-full max-w-sm backdrop-blur-xl">
        <p className="font-display font-bold text-lg text-white mb-1">🤔 Join Request</p>
        <p className="font-body text-sm text-slate-300 mb-4">
          <span className="font-semibold text-amber-300">{request.nickname}</span> wants to join this league. If you admit them, they sit out this game and join the next one.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 font-display font-bold text-sm transition-all active:scale-95"
            onClick={() => socket.emit('respond-join', { requestId: request.requestId, admit: false })}
          >
            Deny
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-bluff-purple to-bluff-purple-dark hover:from-purple-500 hover:to-indigo-500 text-white font-display font-bold text-sm transition-all active:scale-95 shadow-glow-purple"
            onClick={() => socket.emit('respond-join', { requestId: request.requestId, admit: true })}
          >
            Admit
          </button>
        </div>
        {requests.length > 1 && (
          <p className="mt-3 text-center text-xs text-slate-400 font-body">
            {requests.length - 1} more waiting...
          </p>
        )}
      </div>
    </div>
  );
};

export default JoinRequestModal;
