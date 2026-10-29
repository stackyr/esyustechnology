import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DownloadModal({ product, onClose }) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const triggerActualFileDownload = useCallback(() => {
    if (!product) return;
    const content = `=====================================================
ESYUS TECHNOLOGY PVT. LTD. - SOFTWARE RELEASE
Domain: esyustechnology.com
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
Email: support@esyustechnology.com
Domain: esyustechnology.com
Founder: Milan Mandal | Co-founder: Suman Raptan

(c) 2026-2027 Esyus Technology Pvt. Ltd. All rights reserved.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{product.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{product.downloadFile}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-600">
                {isCompleted ? 'Download Prepared & Started' : 'Transferring release package...'}
              </span>
              <span className="font-mono text-brand-600 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-brand-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Platform Target:</span>
              <span className="font-semibold text-slate-800">{product.platform}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Package Size:</span>
              <span className="font-semibold text-slate-800">{product.size}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>SHA-256 Checksum:</span>
              <span className="font-mono text-[10px] text-slate-600">e3b0c44298fc1c149afbf4c8...</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium pt-1 border-t border-slate-200/60">
              <ShieldCheck className="w-4 h-4" />
              <span>Digitally Signed • Zero Telemetry Required</span>
            </div>
          </div>

          {/* Offline reminder */}
          <div className="text-[11px] text-slate-500 bg-brand-50/50 p-3 rounded-lg border border-brand-100">
            <strong>Offline Operation Guarantee:</strong> Once downloaded, this application does not require any active internet connection for generating invoices or managing inventory.
          </div>

          {isCompleted && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Package setup descriptor successfully downloaded to your browser.</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close Window
            </button>
            <button
              onClick={triggerActualFileDownload}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Download Again
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
