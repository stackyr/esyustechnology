import React from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ServiceModal({ service, onClose, onEnquire }) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[var(--line)] relative overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="bg-[var(--bg)]/95 backdrop-blur-md px-6 py-4.5 border-b border-[var(--line)] flex items-center justify-between shrink-0 z-10">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--c1)] block">
              {service.badge}
            </span>
            <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight mt-0.5">{service.title}</h3>
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
          <p className="text-xs sm:text-sm text-[var(--ink)]/85 leading-relaxed">
            {service.fullDesc}
          </p>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--ink)] font-bold mb-3">
              Included Engineering Deliverables
            </h4>
            <div className="space-y-2">
              {service.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[var(--ink)] bg-[var(--soft)] p-3 rounded-xl border border-[var(--line)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--c1)] shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--ink)] font-bold mb-2.5">
              Primary Technologies & Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[var(--soft)] border border-[var(--line)] text-[var(--ink)] text-xs font-mono font-medium rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Service Commitment Note */}
          <div className="p-4 rounded-xl bg-[var(--dark)] text-[var(--bg)] space-y-1 shadow-md border border-white/10">
            <span className="font-bold text-[var(--c3)] block text-xs font-mono uppercase tracking-wider">
              Esyus Technologies Assurance
            </span>
            <p className="text-xs leading-relaxed text-stone-300">
              Each software delivery includes structured source code, staging tests, deployment walk-throughs, and warranty technical support.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[var(--bg)]/95 backdrop-blur-md px-6 py-4 border-t border-[var(--line)] flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:text-[var(--ink)] bg-[var(--soft)] border border-[var(--line)] rounded-full hover:bg-[var(--line)]/50 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onEnquire(service.title);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--c1)] hover:bg-[var(--c1)]/90 text-white text-xs font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Request Quotation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
