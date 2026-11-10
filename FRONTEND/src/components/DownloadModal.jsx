import React from 'react';
import { X, Clock, ShieldCheck, Mail, Download, Smartphone, Monitor } from 'lucide-react';
import { resolveProductDownload } from '../utils/productUtils';

export default function DownloadModal({ product, onClose, onEnquire }) {
  if (!product) return null;

  const { filename, isAndroid, isWindows, label, typeLabel } = resolveProductDownload(product);

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        data-lenis-prevent="true"
        className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-md w-full shadow-2xl border border-[var(--line)] overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 bg-[var(--dark)] text-[var(--bg)] flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md shrink-0 overflow-hidden">
              {product.logo ? (
                <img src={product.logo} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <Clock className="w-4 h-4 text-[var(--c1)]" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{product.name}</h3>
              <p className="text-[11px] text-amber-300 font-mono">Release Package • {product.version}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content with smooth native scrolling */}
        <div
          data-lenis-prevent="true"
          className="p-5 sm:p-6 pb-6 space-y-5 overflow-y-auto overscroll-contain flex-1 min-h-0 modal-scroll"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Coming Soon Notice Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="block font-semibold text-amber-950">
                Official Release Distribution Package
              </strong>
              <p className="text-[var(--ink)]/80 leading-relaxed">
                Download the offline evaluation bundle for <strong>{product.name}</strong> or register for priority commercial counter licensing.
              </p>
            </div>
          </div>

          {/* Package Details */}
          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span>Platform Target:</span>
              <span className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
                {isAndroid ? <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Monitor className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                {product.platform}
              </span>
            </div>
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span>Package Size:</span>
              <span className="font-semibold text-[var(--ink)]">{product.size}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span>Package File:</span>
              <span className="font-mono text-xs font-bold text-[var(--ink)] truncate max-w-[200px]" title={filename}>{filename}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span>Status:</span>
              <span className="font-mono text-xs font-bold text-[var(--c1)]">Verified Offline Build</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium pt-1.5 border-t border-[var(--line)]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Offline Architecture • Zero Cloud Latency</span>
            </div>
          </div>

          {/* Release Download CTA */}
          <div className="space-y-2 pt-1">
            {!product.isComingSoon && Boolean(product.downloadUrl) ? (
              <>
                <a
                  href={product.downloadUrl}
                  download={filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-full font-bold text-xs flex items-center justify-center gap-2 bg-[var(--c1)] hover:bg-[#d65a2f] text-white shadow-lg shadow-[var(--c1)]/30 cursor-pointer transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span className="truncate">Download {typeLabel} ({filename})</span>
                </a>
                <div className="text-[11px] text-center font-mono text-[var(--muted)]">
                  {isAndroid ? 'Verified SHA-256 APK package • Offline database runtime' : 'Verified SHA-256 installer • Offline database runtime'}
                </div>
              </>
            ) : (
              <>
                <div className="w-full h-11 rounded-full font-bold text-xs flex items-center justify-center gap-2 bg-[var(--soft)] border border-[var(--c1)]/30 text-[var(--c1)] shadow-xs select-none">
                  <Clock className="w-4 h-4 text-[var(--c1)] animate-pulse shrink-0" />
                  <span>Official Download Coming Soon ({product.version || 'v1.0.0'})</span>
                </div>
                <div className="text-[11px] text-center font-mono text-[var(--muted)]">
                  Official build undergoing final verification • Zero cloud lag
                </div>
              </>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:text-[var(--ink)] bg-[var(--soft)] hover:bg-[var(--line)]/50 border border-[var(--line)] rounded-full transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEnquire) onEnquire(product.name);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[var(--ink)] hover:bg-[var(--ink)]/90 rounded-full shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Enquire for Enterprise Setup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
