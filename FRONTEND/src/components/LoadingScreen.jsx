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

  // Smooth, simple loading fade out when data arrives (Local & Vercel)
  useEffect(() => {
    if (!isLoading) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);

        const unmountTimer = setTimeout(() => {
          setIsMounted(false);
          if (onComplete) onComplete();
          if (typeof window !== 'undefined' && window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 400);

        return () => clearTimeout(unmountTimer);
      }, 250);

      return () => clearTimeout(exitTimer);
    } else {
      // Safety fallback: prevents infinite loading stall on Vercel cold starts
      const safetyFallback = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsMounted(false);
          if (onComplete) onComplete();
          if (typeof window !== 'undefined' && window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 400);
      }, 1800);

      return () => clearTimeout(safetyFallback);
    }
  }, [isLoading, onComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] select-none bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center transition-opacity duration-400 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      aria-label="Loading Website"
    >
      <div className="flex flex-col items-center max-w-xs w-full mx-auto">
        {/* Clean, Flat Brand Logo */}
        <img
          src="/logo-horizontal.png"
          alt={brand?.name || 'Esyus Technology'}
          className="h-10 sm:h-12 w-auto object-contain shrink-0 mb-6"
        />

        {/* Simple Minimal Spinner (No bounce, no popup) */}
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-[var(--c1)] animate-spin mb-3" />

        {/* Clean Loading Text */}
        <div className="text-xs font-mono text-[var(--muted)] tracking-wider">
          Loading...
        </div>

        {/* Retry button if network failure persists */}
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
  );
}
