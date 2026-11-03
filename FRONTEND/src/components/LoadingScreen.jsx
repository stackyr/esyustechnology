import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Clock } from 'lucide-react';

export default function LoadingScreen({
  isLoading,
  isDatabaseConnected,
  connectionError,
  loadingStage = 'connecting',
  loadingStatusText = 'Loading experience...',
  brand,
  onRetry,
  onOpenAdmin,
  onComplete
}) {
  const [progress, setProgress] = useState(20);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  // Progressive progress bar simulation matching real network lifecycle
  useEffect(() => {
    if (isLoading || !isDatabaseConnected) {
      if (loadingStage === 'connecting') {
        setProgress((prev) => Math.max(prev, 35));
      } else if (loadingStage === 'fetching') {
        setProgress((prev) => Math.max(prev, 75));
      } else {
        const interval = setInterval(() => {
          setProgress((prev) => (prev < 90 ? prev + 2 : prev));
        }, 140);
        return () => clearInterval(interval);
      }
    } else {
      // Data verified and loaded — smooth accelerate to 100%
      setProgress(100);

      // Brief moment so user perceives verified connection, then trigger curtain slide exit
      const exitTimer = setTimeout(() => {
        setIsExiting(true);

        // After curtain transition duration (750ms), unmount overlay completely
        const unmountTimer = setTimeout(() => {
          setIsMounted(false);
          if (onComplete) onComplete();
          if (typeof window !== 'undefined' && window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 750);

        return () => clearTimeout(unmountTimer);
      }, 350);

      return () => clearTimeout(exitTimer);
    }
  }, [isLoading, isDatabaseConnected, loadingStage, onComplete]);

  const handleRetryClick = async () => {
    if (isRetrying || !onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setTimeout(() => setIsRetrying(false), 900);
    }
  };

  if (!isMounted) return null;

  const isFailed = connectionError && !isDatabaseConnected;

  const supportEmail = brand?.supportEmail || brand?.email || 'support@esyustechnology.com';

  const getDisplayStatus = () => {
    if (isFailed) return 'Temporarily unavailable';
    if (progress >= 100) return 'Ready';
    if (loadingStage === 'fetching') return 'Preparing business solutions...';
    return loadingStatusText || 'Loading experience...';
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] select-none ${
        isExiting ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      aria-label="Loading Website"
    >
      {/* =========================================================================
          CURTAIN REVEAL SHUTTERS (Smooth slide transition, no popup, no bounce)
          Top Shutter slides UP (-translate-y-full)
          Bottom Shutter slides DOWN (+translate-y-full)
          ========================================================================= */}

      {/* Top Shutter Panel */}
      <div
        className={`fixed top-0 left-0 right-0 h-1/2 bg-[var(--bg)] border-b border-stone-300/40 will-change-transform transition-transform duration-750 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isExiting ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[var(--grain)]" />
      </div>

      {/* Bottom Shutter Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-1/2 bg-[var(--bg)] border-t border-stone-300/40 will-change-transform transition-transform duration-750 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isExiting ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[var(--grain)]" />
      </div>

      {/* Center Hairline Accent Runner (fades gracefully when curtains split) */}
      <div
        className={`fixed top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--c1)]/50 to-transparent z-[99998] transition-opacity duration-300 ease-out ${
          isExiting ? 'opacity-0 scale-x-125' : 'opacity-100 scale-x-100'
        }`}
      />

      {/* Center Stage: Minimal Animated Navbar Logo + Hairline Progress */}
      <div
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 text-center transition-all duration-350 ease-out will-change-transform ${
          isExiting
            ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay bg-[var(--grain)]" />

        {!isFailed ? (
          /* =========================================================================
             PREMIUM MINIMAL LOADING STAGE (Clean, customer-facing, zero technical clutter)
             ========================================================================= */
          <div className="relative flex flex-col items-center space-y-6 max-w-sm w-full mx-auto animate-in fade-in duration-250">
            {/* Animated Brand Logo Container (Exact Navbar Logo) */}
            <div className="relative group flex items-center justify-center">
              {/* Soft Ambient Glow */}
              <div className="absolute -inset-8 bg-gradient-to-r from-[var(--c1)]/15 via-[var(--c3)]/20 to-[var(--c1)]/15 rounded-3xl blur-2xl pointer-events-none animate-pulse" />

              {/* Logo Card with Glossy Light Sheen */}
              <div className="relative overflow-hidden px-6 py-3.5 rounded-2xl bg-white/75 backdrop-blur-md border border-stone-200/90 shadow-lg shadow-black/5">
                <img
                  src="/logo-horizontal.png"
                  alt={brand?.name || 'Esyus Technology'}
                  className="h-10 sm:h-12 w-auto object-contain shrink-0 relative z-10"
                />
              </div>
            </div>

            {/* Hairline Progress Bar & Real Percentage */}
            <div className="w-56 sm:w-64 space-y-2 pt-1">
              <div className="h-[2.5px] w-full bg-stone-200/90 rounded-full overflow-hidden relative shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[var(--c1)] via-[#ff8257] to-[var(--c1)] rounded-full transition-all duration-300 ease-out relative"
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
          </div>
        ) : (
          /* =========================================================================
             CUSTOMER-FRIENDLY MAINTENANCE VIEW (Zero technical jargon or database terms)
             ========================================================================= */
          <div className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-2xl space-y-5 text-center pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Friendly Maintenance Clock Icon */}
            <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-700 shadow-xs">
              <Clock className="w-6 h-6 text-[var(--c1)]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                Temporary Notice
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]">
                Website is Temporarily Down
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                We are currently performing brief scheduled updates. Please check back in a few moments, or reach out to our team directly.
              </p>
            </div>

            {/* Direct Contact Admin / Support Details */}
            <div className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 text-[var(--c1)]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase text-[var(--muted)] block">Contact Support Team</span>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-xs font-semibold text-[var(--ink)] hover:text-[var(--c1)] truncate block underline decoration-dotted"
                  >
                    {supportEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2.5 justify-center">
              {onRetry && (
                <button
                  type="button"
                  onClick={handleRetryClick}
                  disabled={isRetrying}
                  className="px-5 py-2.5 rounded-xl bg-[var(--c1)] hover:bg-[#d64b22] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>{isRetrying ? 'Connecting...' : 'Try Again'}</span>
                </button>
              )}
              <a
                href={`mailto:${supportEmail}?subject=Website%20Inquiry%20-%20Temporary%20Downtime`}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
