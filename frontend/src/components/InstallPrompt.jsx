import { useEffect, useState } from 'react';

export const isIos = () => {
  if (typeof window === 'undefined' || !window.navigator) return false;
  const ua = window.navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isStandalone = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
    || (typeof document !== 'undefined' && document.referrer.includes('android-app://'))
  );
};

const isDismissed = () => {
  try {
    const hideUntil = localStorage.getItem('hideInstallUntil');
    if (hideUntil && Date.now() < Number(hideUntil)) return true;
    return false;
  } catch {
    return false;
  }
};

const InstallPrompt = () => {
  const [deferred, setDeferred] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Clear legacy permanent lockout if present
    try {
      if (localStorage.getItem('hideInstall') === '1') {
        localStorage.removeItem('hideInstall');
      }
    } catch {
      // ignore storage errors
    }

    if (isStandalone()) return undefined;

    const onPrompt = (event) => {
      event.preventDefault();
      setDeferred(event);
      if (!isDismissed()) setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);

    // On iOS, beforeinstallprompt never fires; show banner unless recently dismissed
    if (isIos() && !isDismissed()) {
      setShowBanner(true);
    }

    const onOpenPrompt = () => {
      setShowBanner(true);
      if (isIos() || !deferred) {
        setShowIosGuide(true);
      }
    };

    window.addEventListener('open-install-prompt', onOpenPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('open-install-prompt', onOpenPrompt);
    };
  }, [deferred]);

  const dismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem('hideInstallUntil', String(Date.now() + 24 * 60 * 60 * 1000));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const handleInstallClick = async () => {
    if (deferred) {
      try {
        deferred.prompt();
        const choice = await deferred.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setShowBanner(false);
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
      setDeferred(null);
      return;
    }

    // iOS flow: show guide and invoke native share sheet if available
    setShowIosGuide(true);
    if (isIos() && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Bluff Hunt',
          text: 'Play Bluff Hunt – the social deduction party game!',
          url: window.location.href
        });
      } catch (err) {
        // User cancelled native share sheet or not permitted; modal guide is visible
        console.log('Share prompt dismissed or unsupported:', err);
      }
    }
  };

  if (isStandalone()) return null;

  return (
    <>
      {/* Bottom Floating Install Banner */}
      {showBanner && !showIosGuide && (
        <div className="fixed left-3 right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 max-w-md mx-auto animate-fade-in">
          <div className="rounded-2xl bg-slate-900/95 text-white shadow-2xl p-4 border border-purple-500/30 backdrop-blur-xl ring-1 ring-purple-500/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/icon-192.png"
                  alt="Bluff Hunt"
                  className="w-11 h-11 rounded-xl shadow-lg border border-purple-500/40 p-0.5 bg-slate-950 shrink-0"
                />
                <div>
                  <p className="font-display font-black text-white text-sm sm:text-base flex items-center gap-1.5">
                    <span>Install Bluff Hunt</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-bold">PWA</span>
                  </p>
                  <p className="font-body text-xs text-slate-400 mt-0.5">
                    Fast loading & full-screen party game
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismiss}
                className="text-slate-400 hover:text-white text-lg p-1 leading-none transition-colors"
                title="Dismiss"
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              onClick={handleInstallClick}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-sm transition-all active:scale-[0.98] shadow-glow-purple flex items-center justify-center gap-2"
            >
              <span>📲</span>
              <span>Install Now</span>
            </button>
          </div>
        </div>
      )}

      {/* iOS Step-by-Step Installation Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-600/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <img src="/icons/icon-192.png" alt="Bluff Hunt" className="w-8 h-8 rounded-lg shadow" />
                <h3 className="font-display font-black text-lg text-white">Install on iOS</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="font-body text-xs text-slate-300 text-left mb-4">
              Add BluffHunt to your Home Screen for the best full-screen experience:
            </p>

            <div className="space-y-2.5 text-left font-body text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800/60 flex items-center justify-center text-sm shrink-0 font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-white">Tap the Share button</p>
                  <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                    <span>Tap</span>
                    <svg className="w-4 h-4 text-cyan-400 inline shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>in your Safari toolbar (at the bottom)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-amber-950 text-amber-300 border border-amber-800/60 flex items-center justify-center text-sm shrink-0 font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-white">Select &apos;Add to Home Screen&apos;</p>
                  <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                    <span>Scroll down and tap</span>
                    <span className="text-amber-300 font-bold">➕ Add to Home Screen</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center justify-center text-sm shrink-0 font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-white">Tap &apos;Add&apos; in top-right</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">The BluffHunt app icon will appear on your phone!</p>
                </div>
              </div>
            </div>

            {/* Downward indicator pointing to Safari bottom bar on iPhones */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-display font-bold text-cyan-300 flex items-center gap-1 animate-bounce">
                <span>👇</span>
                <span>Share button is at the bottom</span>
              </span>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-bold text-xs rounded-xl shadow-glow-purple transition-all active:scale-95"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPrompt;
