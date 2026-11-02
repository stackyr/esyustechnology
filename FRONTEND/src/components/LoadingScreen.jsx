import React, { useState, useEffect } from 'react';

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
  const [progress, setProgress] = useState(20);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Progressive progress bar simulation matching real network lifecycle
  useEffect(() => {
    let timer;
    if (isLoading || !isDatabaseConnected) {
      if (loadingStage === 'connecting') {
        setProgress((prev) => Math.max(prev, 40));
      } else if (loadingStage === 'fetching') {
        setProgress((prev) => Math.max(prev, 80));
      } else {
        setProgress((prev) => Math.min(prev + 5, 90));
      }
    } else {
      // Data verified and loaded! Fast-forward to 100%
      setProgress(100);

      // Brief moment to show 100%, then trigger smooth curtain slide exit
      const exitTimer = setTimeout(() => {
        setIsExiting(true);

        // After curtain transition duration (750ms), unmount overlay completely
        const unmountTimer = setTimeout(() => {
          setIsMounted(false);
          if (onComplete) onComplete();
          // Refresh ScrollTrigger now that page is visible
          if (typeof window !== 'undefined' && window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 750);

        return () => clearTimeout(unmountTimer);
      }, 350);

      return () => clearTimeout(exitTimer);
    }
  }, [isLoading, isDatabaseConnected, loadingStage, onComplete]);

  // If already unmounted, do not render anything
  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] select-none transition-opacity duration-300 ${
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
        className={`fixed top-0 left-0 right-0 h-1/2 bg-[var(--bg)] border-b border-stone-300/30 will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isExiting ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[var(--grain)]" />
      </div>

      {/* Bottom Shutter Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-1/2 bg-[var(--bg)] border-t border-stone-300/30 will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isExiting ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[var(--grain)]" />
      </div>

      {/* Center Stage: Simple, Flat, Minimal (NO POPUP, NO BOUNCE) */}
      <div
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ease-out will-change-transform ${
          isExiting
            ? 'opacity-0 -translate-y-3 pointer-events-none'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="relative flex flex-col items-center max-w-xs w-full mx-auto">
          {/* Flat Brand Logo (Exact Navbar Logo, no card, no popup box, no bounce) */}
          <div className="mb-5 flex items-center justify-center">
            <img
              src="/logo-horizontal.png"
              alt={brand?.name || 'Esyus Technology'}
              className="h-9 sm:h-11 w-auto object-contain shrink-0"
            />
          </div>

          {/* Simple Hairline Progress Bar */}
          <div className="w-48 sm:w-56 h-[2px] bg-stone-300/70 rounded-full overflow-hidden relative mb-3">
            <div
              className="h-full bg-[var(--c1)] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Simple "Loading..." Text (No popup, clean minimal typography) */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[var(--muted)] tracking-wider">
            <span>Loading</span>
            <span className="inline-flex gap-0.5">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse delay-150">.</span>
              <span className="animate-pulse delay-300">.</span>
            </span>
          </div>

          {/* Offline/Error notice if network fails */}
          {connectionError && !isDatabaseConnected && (
            <div className="mt-4 p-3 rounded-xl bg-white border border-red-200 text-xs text-red-700 flex flex-col items-center gap-2 shadow-xs">
              <span>Connection failed. Retrying...</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-3 py-1 rounded-lg bg-[var(--c1)] text-white text-[11px] font-bold cursor-pointer"
                >
                  Retry Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
