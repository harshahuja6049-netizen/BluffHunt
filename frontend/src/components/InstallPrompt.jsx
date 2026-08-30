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
      <div className="rounded-2xl bg-white text-bluff-charcoal shadow-2xl p-4 border border-bluff-purple/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display font-bold">Install Bluff Hunt</p>
            <p className="font-body text-xs text-bluff-muted mt-1">
              {deferred
                ? 'Add the app icon to your home screen.'
                : 'Tap Share, then Add to Home Screen.'}
            </p>
          </div>
          <button type="button" onClick={dismiss} className="text-bluff-muted text-lg leading-none">✕</button>
        </div>
        {deferred && (
          <button
            type="button"
            onClick={install}
            className="mt-3 w-full py-2.5 rounded-xl bg-bluff-purple text-white font-display font-bold"
          >
            Install app
          </button>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;
