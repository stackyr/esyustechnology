import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, ShieldAlert, ArrowRight } from 'lucide-react';

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
  const [isRetrying, setIsRetrying] = useState(false);

  // Exit ONLY when data has been verified and fetched from MongoDB / API
  // No arbitrary timeout to prevent exposing empty or broken content!
  useEffect(() => {
    if (!isLoading && isDatabaseConnected) {
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
  }, [isLoading, isDatabaseConnected, onComplete]);

  const handleRetryClick = async () => {
    if (isRetrying || !onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setTimeout(() => setIsRetrying(false), 800);
    }
  };

  if (!isMounted) return null;

  const isFailed = connectionError && !isDatabaseConnected;

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

      {/* Center Stage: Unique Quantum Orbit Symbol or Protected Error View */}
      <div
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ease-out will-change-transform ${
          isExiting ? 'opacity-0 -translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="relative flex flex-col items-center max-w-sm w-full mx-auto">
          {/* Brand Logo (Exact Navbar Logo) */}
          <img
            src="/logo-horizontal.png"
            alt={brand?.name || 'Esyus Technology'}
            className="h-10 sm:h-12 w-auto object-contain shrink-0 mb-7 drop-shadow-xs"
          />

          {!isFailed ? (
            /* =========================================================================
               UNIQUE ESYUS QUANTUM ORBIT CORE (Brand-aligned, no standard spinner!)
               ========================================================================= */
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-300">
              {/* 3D Orbit & Core Sphere System */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Outer Breathing Radial Glow */}
                <div className="absolute inset-0 rounded-full bg-[var(--c1)] opacity-20 blur-xl animate-pulse" />

                {/* 3D Elliptical Orbit Track 1 */}
                <div
                  className="absolute inset-0 rounded-full border border-[var(--c1)]/35 pointer-events-none"
                  style={{
                    transform: 'rotateX(68deg) rotateY(-18deg) rotateZ(0deg)',
                    animation: 'esyus-spin 3.2s linear infinite'
                  }}
                >
                  {/* Orbiting Satellite Particle 1 */}
                  <span
                    className="absolute top-0 left-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[var(--c1)] shadow-[0_0_8px_var(--c1)]"
                  />
                </div>

                {/* 3D Elliptical Orbit Track 2 (Counter-Rotating) */}
                <div
                  className="absolute inset-1.5 rounded-full border border-stone-400/35 pointer-events-none"
                  style={{
                    transform: 'rotateX(68deg) rotateY(32deg) rotateZ(45deg)',
                    animation: 'esyus-spin-reverse 4s linear infinite'
                  }}
                >
                  {/* Orbiting Satellite Particle 2 */}
                  <span
                    className="absolute bottom-0 right-1/2 -mr-1 -mb-1 w-1.5 h-1.5 rounded-full bg-stone-700 shadow-[0_0_6px_rgba(0,0,0,0.3)]"
                  />
                </div>

                {/* Central Radiant Terracotta Orb (Echoing Hero Orb Core) */}
                <div
                  className="w-8 h-8 rounded-full shadow-[0_4px_16px_rgba(232,105,60,0.4)] relative flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle at 35% 32%, #ff956e 0%, #e8693c 55%, #ad3414 100%)'
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-white/70 blur-[0.5px]" />
                </div>
              </div>

              {/* Rhythmic 5-Bar Quantum Frequency Equalizer */}
              <div className="flex items-center gap-1 h-3.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-1 bg-[var(--c1)]/80 rounded-full"
                    style={{
                      height: '100%',
                      transformOrigin: 'bottom',
                      animation: `esyus-equalizer 1.2s ease-in-out infinite alternate ${i * 0.18}s`
                    }}
                  />
                ))}
              </div>

              {/* Live Status Readout */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-[var(--ink)] tracking-wider">
                  <span>{loadingStatusText || 'Synchronizing with MongoDB Atlas'}</span>
                  <span className="inline-flex gap-0.5 text-[var(--c1)]">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-150">.</span>
                    <span className="animate-pulse delay-300">.</span>
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[var(--muted)]">
                  Verifying live database records &amp; business engines
                </p>
              </div>
            </div>
          ) : (
            /* =========================================================================
               STRICT FAILURE GUARD: Website remains safely closed if records cannot load
               ========================================================================= */
            <div className="w-full bg-white rounded-2xl border border-red-200/90 p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Website Protected</h3>
                  <p className="text-[11px] text-stone-500 font-mono">Unable to load database records</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                The website cannot be opened because live data could not be retrieved from MongoDB Atlas cloud database. The loading curtain stays closed to prevent displaying missing or incomplete records.
              </p>

              {connectionError && (
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 font-mono text-[10.5px] text-red-700 break-words leading-tight">
                  {connectionError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                {onRetry && (
                  <button
                    type="button"
                    onClick={handleRetryClick}
                    disabled={isRetrying}
                    className="w-full sm:flex-1 py-2.5 px-3.5 rounded-xl bg-[var(--c1)] hover:bg-[#d65a2f] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                    <span>{isRetrying ? 'Reconnecting...' : 'Retry Connection'}</span>
                  </button>
                )}

                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Admin Panel</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orbit & Equalizer Keyframe Styles */}
      <style>{`
        @keyframes esyus-spin {
          from { transform: rotateX(68deg) rotateY(-18deg) rotateZ(0deg); }
          to { transform: rotateX(68deg) rotateY(-18deg) rotateZ(360deg); }
        }
        @keyframes esyus-spin-reverse {
          from { transform: rotateX(68deg) rotateY(32deg) rotateZ(360deg); }
          to { transform: rotateX(68deg) rotateY(32deg) rotateZ(0deg); }
        }
        @keyframes esyus-equalizer {
          0% { transform: scaleY(0.25); opacity: 0.45; }
          100% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
