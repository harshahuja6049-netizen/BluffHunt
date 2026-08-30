const ScreenShell = ({ children, footer, compact = false }) => (
  <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-bluff-ink text-white flex flex-col">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(131,56,236,0.35),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(255,0,110,0.2),_transparent_40%)]" />
    <div className={`relative flex-1 flex flex-col w-full max-w-md mx-auto px-4 ${compact ? 'py-3' : 'py-4'} min-h-0`}>
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
