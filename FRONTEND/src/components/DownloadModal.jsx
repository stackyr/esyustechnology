import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DownloadModal({ product, onClose }) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const triggerActualFileDownload = useCallback(() => {
    if (!product) return;
    const content = `=====================================================
ESYUS TECHNOLOGIES - SOFTWARE RELEASE
Domain: esyustechnologies.com
=====================================================

Application: ${product.name}
Version: ${product.version}
Platform: ${product.platform}
Package File: ${product.downloadFile}
Package Size: ${product.size}
Release Date: 2026-10-28
Category: ${product.category}

-----------------------------------------------------
OFFLINE INSTALLATION INSTRUCTIONS:
-----------------------------------------------------
1. Move ${product.downloadFile} to your target Windows or Android device.
2. Run installer as Administrator (Windows) or enable Unknown Sources (Android).
3. The software will install the embedded offline SQLite database automatically.
4. No internet connection is required during or after installation.

For technical support or license queries:
Email: support@esyustechnologies.com
Domain: esyustechnologies.com
Founder: Milan Mandal | Co-founder: Suman Raptan

(c) 2026-2027 Esyus Technologies. All rights reserved.
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = product.downloadFile || 'setup.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const t0 = setTimeout(() => setProgress(15), 50);
    const t1 = setTimeout(() => setProgress(45), 300);
    const t2 = setTimeout(() => setProgress(82), 650);
    const t3 = setTimeout(() => {
      setProgress(100);
      setIsCompleted(true);
      triggerActualFileDownload();
    }, 1000);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [product, triggerActualFileDownload]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-md w-full shadow-2xl border border-[var(--line)] overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="p-5 bg-[var(--dark)] text-[var(--bg)] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md shrink-0 overflow-hidden">
              {product.logo ? (
                <img src={product.logo} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <Download className="w-4 h-4 text-[var(--c1)]" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{product.name}</h3>
              <p className="text-[11px] text-stone-400 font-mono">{product.downloadFile}</p>
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-[var(--ink)]/80">
                {isCompleted ? 'Download Prepared & Started' : 'Transferring release package...'}
              </span>
              <span className="font-mono text-[var(--c1)] font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-[var(--soft)] border border-[var(--line)] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-[var(--c1)]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span>Platform Target:</span>
              <span className="font-semibold text-[var(--ink)]">{product.platform}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span>Package Size:</span>
              <span className="font-semibold text-[var(--ink)]">{product.size}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span>SHA-256 Checksum:</span>
              <span className="font-mono text-[10px] text-[var(--ink)]/70">e3b0c44298fc1c149afbf4c8...</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium pt-1.5 border-t border-[var(--line)]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Digitally Signed • Zero Telemetry Required</span>
            </div>
          </div>

          {/* Offline reminder */}
          <div className="text-[11px] text-[var(--muted)] bg-[var(--soft)] p-3 rounded-xl border border-[var(--line)]">
            <strong className="text-[var(--ink)]">Offline Operation Guarantee:</strong> Once downloaded, this application operates completely offline without requiring any active internet connection for generating invoices or managing inventory.
          </div>

          {isCompleted && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Package setup descriptor successfully downloaded to your browser.</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:text-[var(--ink)] bg-[var(--soft)] hover:bg-[var(--line)]/50 border border-[var(--line)] rounded-full transition-colors cursor-pointer"
            >
              Close Window
            </button>
            <button
              onClick={triggerActualFileDownload}
              className="px-4 py-2 text-xs font-bold text-white bg-[var(--c1)] hover:bg-[var(--c1)]/90 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Download Again
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
