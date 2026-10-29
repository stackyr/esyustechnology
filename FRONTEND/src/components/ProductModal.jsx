import React from 'react';
import { X, CheckCircle2, Download, Monitor, Smartphone, Cpu } from 'lucide-react';

export default function ProductModal({ product, onClose, onDownload }) {
  if (!product) return null;

  const isAndroid = product.platform.toLowerCase().includes('android');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[var(--line)] relative overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="bg-[var(--bg)]/95 backdrop-blur-md px-6 py-4.5 border-b border-[var(--line)] flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center font-bold shadow-md shrink-0">
              {isAndroid ? <Smartphone className="w-5 h-5 text-[var(--c3)]" /> : <Monitor className="w-5 h-5 text-[var(--c3)]" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight">{product.name}</h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--soft)] text-[var(--c1)] border border-[var(--line)] uppercase tracking-wider">
                  {product.version}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] font-medium mt-0.5">{product.category} · {product.platform}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--soft)] border border-[var(--line)] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Blueprint Overview Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--c1)]" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold">
                Product Blueprint Overview
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ink)]/85 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Key Confirmed Features (from SRS) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--ink)] font-bold">
                Confirmed Capabilities & Architecture
              </h4>
              <span className="text-[10px] font-mono text-[var(--muted)]">Verified Specifications</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.highlights.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[var(--ink)] bg-[var(--soft)]/80 p-3 rounded-xl border border-[var(--line)] transition-colors hover:border-[var(--c1)]/50"
                >
                  <CheckCircle2 className="w-4 h-4 text-[var(--c1)] shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Dark Card */}
          <div className="p-5 rounded-2xl bg-[var(--dark)] text-[var(--bg)] space-y-4 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 text-[var(--c3)] font-semibold uppercase tracking-wider">
                <Cpu className="w-4 h-4" /> System Specifications
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                100% Offline Database
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono">Package File</span>
                <span className="font-mono text-xs font-semibold text-[var(--bg)] truncate block" title={product.downloadFile}>
                  {product.downloadFile}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono">File Size</span>
                <span className="font-mono text-xs font-bold text-[var(--c3)] block">{product.size}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono">Network Dependency</span>
                <span className="font-mono text-xs font-bold text-emerald-400 block">Zero (100% Offline)</span>
              </div>
            </div>
          </div>

          {/* Deployment Support info */}
          <div className="p-4 rounded-xl bg-[var(--soft)] border-l-4 border-l-[var(--c1)] border border-[var(--line)] space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--c1)] font-bold block">
              Deployment & Support from Esyus Technologies
            </span>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
              Full technical support is provided for installing and calibrating POS hardware, thermal printer drivers, and encrypted database backups.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[var(--bg)]/95 backdrop-blur-md px-6 py-4 border-t border-[var(--line)] flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:text-[var(--ink)] bg-[var(--soft)] border border-[var(--line)] rounded-full hover:bg-[var(--line)]/50 transition-colors cursor-pointer"
          >
            Close Details
          </button>

          <button
            onClick={() => {
              onClose();
              onDownload(product);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--c1)] hover:bg-[var(--c1)]/90 text-white text-xs font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Software ({product.size})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
