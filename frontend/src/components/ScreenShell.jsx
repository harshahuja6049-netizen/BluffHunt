const ScreenShell = ({ children, footer, compact = false }) => (
  <div className="relative h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#070A13] text-slate-100 flex flex-col select-none">
    {/* Ambient Glowing Neon Orbs */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/25 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-[90px]" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-rose-500/15 rounded-full blur-[90px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),transparent_60%)]" />
    </div>

    {/* Main Container */}
    <div className={`relative flex-1 flex flex-col w-full max-w-md mx-auto px-4 ${compact ? 'py-3' : 'py-4'} min-h-0 z-10`}>
      <div className="flex-1 min-h-0 flex flex-col">
        {children}
      </div>
      {footer && (
        <div className="shrink-0 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {footer}
        </div>
      )}
    </div>
  </div>
);

export default ScreenShell;
