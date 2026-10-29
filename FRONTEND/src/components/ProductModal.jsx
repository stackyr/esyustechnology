import React from 'react';
import { X, CheckCircle2, Download, Monitor, Smartphone, Cpu } from 'lucide-react';

export default function ProductModal({ product, onClose, onDownload }) {
  if (!product) return null;

  const isAndroid = product.platform.toLowerCase().includes('android');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-scaleUp">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              {isAndroid ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 uppercase">
                  {product.version}
                </span>
              </div>
              <p className="text-xs text-slate-500">{product.category} • {product.platform}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Tagline */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-bold text-slate-800 block mb-1">Product Blueprint Overview:</span>
            <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Key Confirmed Features (from SRS) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Confirmed Capabilities & Architecture
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.highlights.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-brand-400 font-mono font-semibold">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> System Requirements
              </span>
              <span>100% Offline Database</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Package File</span>
                <span className="font-semibold text-slate-200 truncate block">{product.downloadFile}</span>
              </div>
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">File Size</span>
                <span className="font-semibold text-white">{product.size}</span>
              </div>
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Network Need</span>
                <span className="font-semibold text-emerald-400">Zero (Offline)</span>
              </div>
            </div>
          </div>

          {/* Deployment Support info */}
          <div className="text-xs text-slate-500 leading-relaxed bg-brand-50/50 p-3.5 rounded-xl border border-brand-100">
            <strong className="text-brand-900 block font-semibold mb-0.5">Deployment & Support from Esyus Technologies:</strong>
            Full technical support is provided for installing and calibrating POS hardware, printer drivers, and database backups.
          </div>

        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Details
          </button>

          <button
            onClick={() => {
              onClose();
              onDownload(product);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Software ({product.size})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
