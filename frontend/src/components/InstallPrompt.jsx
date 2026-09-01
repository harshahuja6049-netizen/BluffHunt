import { useEffect, useState } from 'react';

const isIos = () => {
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches
  || window.navigator.standalone === true;

const InstallPrompt = () => {
  const [deferred, setDeferred] = useState(null);
  const [showIos, setShowIos] = useState(false);
  const [hidden, setHidden] = useState(() => localStorage.getItem('hideInstall') === '1');

  useEffect(() => {
    if (isStandalone() || hidden) return undefined;
    const onPrompt = (event) => {
      event.preventDefault();
      setDeferred(event);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    if (isIos()) setShowIos(true);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, [hidden]);

  if (hidden || isStandalone() || (!deferred && !showIos)) return null;

  const dismiss = () => {
    setHidden(true);
    localStorage.setItem('hideInstall', '1');
    setDeferred(null);
    setShowIos(false);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <div className="fixed left-3 right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 max-w-md mx-auto">
      <div className="rounded-2xl bg-slate-900/95 text-white shadow-2xl p-4 border border-slate-700/60 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display font-bold text-white">📱 Install Bluff Hunt</p>
            <p className="font-body text-xs text-slate-400 mt-1">
              {deferred
                ? 'Add the app icon to your home screen.'
                : 'Tap Share, then Add to Home Screen.'}
            </p>
          </div>
          <button type="button" onClick={dismiss} className="text-slate-400 hover:text-white text-lg leading-none transition-colors">✕</button>
        </div>
        {deferred && (
          <button
            type="button"
            onClick={install}
            className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-bluff-purple to-bluff-purple-dark hover:from-purple-500 hover:to-indigo-500 text-white font-display font-bold text-sm transition-all active:scale-95 shadow-glow-purple"
          >
            Install app
          </button>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;
