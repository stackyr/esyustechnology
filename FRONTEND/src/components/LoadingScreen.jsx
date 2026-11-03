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
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Exit only when all data has been fetched from MongoDB / API
  useEffect(() => {
    if (!isLoading) {
      // Data verified and loaded — trigger smooth curtain slide exit
      const exitTimer = setTimeout(() => {
        setIsExiting(true);

        // After curtain transition completes (700ms), unmount overlay completely
        const unmountTimer = setTimeout(() => {
          setIsMounted(false);
          if (onComplete) onComplete();
          if (typeof window !== 'undefined' && window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 700);

        return () => clearTimeout(unmountTimer);
      }, 250);

      return () => clearTimeout(exitTimer);
    }
  }, [isLoading, onComplete]);

  if (!isMounted) return null;

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

      {/* Center Stage: Simple, Flat, Minimal with Navbar Logo & Spinner */}
      <div
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ease-out will-change-transform ${
          isExiting ? 'opacity-0 -translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="relative flex flex-col items-center max-w-xs w-full mx-auto">
          {/* Brand Logo (Exact Navbar Logo) */}
          <img
            src="/logo-horizontal.png"
            alt={brand?.name || 'Esyus Technology'}
            className="h-10 sm:h-12 w-auto object-contain shrink-0 mb-6 drop-shadow-xs"
          />

          {/* Simple Minimal Spinner */}
          <div className="w-8 h-8 rounded-full border-2 border-stone-300/60 border-t-[var(--c1)] animate-spin mb-4" />

          {/* Clean Loading Text */}
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
            <div className="mt-5 p-3 rounded-xl bg-white border border-red-200 text-xs text-red-700 flex flex-col items-center gap-2 shadow-xs">
              <span>Connection offline. Retrying...</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--c1)] text-white text-[11px] font-bold cursor-pointer transition-colors hover:bg-[#d64b22]"
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
