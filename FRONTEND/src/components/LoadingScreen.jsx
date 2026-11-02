import React, { useState, useEffect } from 'react';
import { Database, Radio, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function LoadingScreen({
  isLoading,
  isDatabaseConnected,
  connectionError,
  loadingStage = 'connecting',
  loadingStatusText = 'Connecting to MongoDB Atlas Cloud Database...',
  brand,
  onRetry,
  onOpenAdmin,
  onComplete
}) {
  const [progress, setProgress] = useState(15);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Progressive progress bar simulation matching real network lifecycle
  useEffect(() => {
    let timer;
    if (isLoading || !isDatabaseConnected) {
      if (loadingStage === 'connecting') {
        setProgress((prev) => Math.max(prev, 35));
      } else if (loadingStage === 'fetching') {
        setProgress((prev) => Math.max(prev, 75));
      } else {
        setProgress((prev) => Math.min(prev + 5, 88));
      }
    } else {
      // Data verified and loaded! Fast-forward smoothly to 100%
      setProgress(100);

      // Brief pause so user can perceive 100% & "Ready", then trigger curtain slide exit
      const exitTimer = setTimeout(() => {
        setIsExiting(true);

        // After curtain transition duration (850ms), unmount overlay completely
        const unmountTimer = setTimeout(() => {
          setIsMounted(false);
          if (onComplete) onComplete();
          // Trigger ScrollTrigger refresh now that page is visible
          if (typeof window !== 'undefined' && window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 850);

        return () => clearTimeout(unmountTimer);
      }, 450);

      return () => clearTimeout(exitTimer);
    }
  }, [isLoading, isDatabaseConnected, loadingStage, onComplete]);

  // If already unmounted, do not render anything
  if (!isMounted) return null;

  // Derive status label
  const getDisplayStatus = () => {
    if (connectionError && !isDatabaseConnected) {
      return 'Connection Offline';
    }
    if (progress >= 100) {
      return 'Enterprise Engine Active • Ready';
    }
    if (loadingStage === 'fetching') {
      return 'Synchronizing Services & Catalog...';
    }
    return loadingStatusText || 'Connecting to MongoDB Atlas...';
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] select-none transition-opacity duration-300 ${
        isExiting ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      aria-label="Loading Website"
    >
      {/* =========================================================================
          CURTAIN REVEAL SHUTTERS:
          Top Shutter slides UP (-translate-y-full)
          Bottom Shutter slides DOWN (+translate-y-full)
          Creates cinematic curtain opening revealing the page sliding up!
          ========================================================================= */}

      {/* Top Shutter Panel */}
      <div
        className={`fixed top-0 left-0 right-0 h-1/2 bg-[var(--bg)] border-b border-stone-300/40 will-change-transform transition-transform duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isExiting ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[var(--grain)]" />
      </div>

      {/* Bottom Shutter Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-1/2 bg-[var(--bg)] border-t border-stone-300/40 will-change-transform transition-transform duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isExiting ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[var(--grain)]" />
      </div>

      {/* Center Hairline Accent Runner (fades gracefully when curtains split) */}
      <div
        className={`fixed top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--c1)]/60 to-transparent z-[99998] transition-opacity duration-400 ease-out ${
          isExiting ? 'opacity-0 scale-x-125' : 'opacity-100 scale-x-100'
        }`}
      />

      {/* Center Stage: Minimal Animated Navbar Logo + Hairline Progress + Live Badges */}
      <div
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 text-center transition-all duration-400 ease-out will-change-transform ${
          isExiting
            ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay bg-[var(--grain)]" />

        {/* Normal Loading State */}
        {!connectionError || isDatabaseConnected ? (
          <div className="relative flex flex-col items-center space-y-6 max-w-sm w-full mx-auto">
            {/* Animated Brand Logo Container (Exact Navbar Logo) */}
            <div className="relative group flex items-center justify-center">
              {/* Soft Ambient Glow */}
              <div className="absolute -inset-6 bg-gradient-to-r from-[var(--c1)]/15 via-[var(--c3)]/20 to-[var(--c1)]/15 rounded-3xl blur-2xl animate-pulse-glow pointer-events-none" />

              {/* Logo Card with Glossy Light Sheen */}
              <div className="relative overflow-hidden px-6 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/80 shadow-lg shadow-black/5 animate-loading-logo">
                <img
                  src="/logo-horizontal.png"
                  alt={brand?.name || 'Esyus Technology'}
                  className="h-10 sm:h-12 w-auto object-contain shrink-0 relative z-10"
                />

                {/* Glossy Beam Scan Effect */}
                <div className="loading-logo-sheen absolute inset-0 -translate-x-full pointer-events-none z-20" />
              </div>
            </div>

            {/* Hairline Progress Bar & Percentage */}
            <div className="w-56 sm:w-64 space-y-2 pt-1">
              <div className="h-[2.5px] w-full bg-stone-200/90 rounded-full overflow-hidden relative shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[var(--c1)] via-[var(--c3)] to-[var(--c1)] rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_var(--c1)]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)] px-0.5">
                <span className="truncate max-w-[200px] text-left">{getDisplayStatus()}</span>
                <span className="font-bold text-[var(--ink)] tabular-nums ml-2">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Minimal Status Indicators */}
            <div className="flex items-center justify-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100/90 border border-stone-200/70 text-[9.5px] font-mono text-stone-600">
                <Database className="w-3 h-3 text-[var(--c1)]" />
                <span>MongoDB Atlas</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[9.5px] font-mono text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Socket Live</span>
              </div>
            </div>
          </div>
        ) : (
          /* Connection Offline Gate (if MongoDB fails) */
          <div className="relative max-w-md w-full p-8 rounded-3xl bg-white border border-red-200 shadow-2xl space-y-5 text-center pointer-events-auto">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider">
                Database Connection Offline
              </span>
              <h2 className="text-xl font-bold text-[var(--ink)]">
                Connecting to MongoDB Atlas...
              </h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                The website requires an active cloud connection to MongoDB Atlas to stream live
                services and customizations.
              </p>
            </div>

            {connectionError && (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-mono text-stone-600 text-left overflow-x-auto">
                <code>{connectionError}</code>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={onRetry}
                className="px-6 py-2.5 rounded-xl bg-[var(--c1)] hover:bg-[#d64b22] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Retry Connection Now</span>
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-stone-100 text-xs font-semibold text-[var(--ink)] cursor-pointer"
              >
                Open Admin Suite
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
