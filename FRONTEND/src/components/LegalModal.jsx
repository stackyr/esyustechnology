import React from 'react';
import { X, Shield, FileText } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

export default function LegalModal({ type, onClose }) {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-[var(--line)] relative overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="bg-[var(--bg)]/95 backdrop-blur-md px-6 py-4.5 border-b border-[var(--line)] flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--soft)] border border-[var(--line)] text-[var(--c1)] flex items-center justify-center shadow-xs">
              {isPrivacy ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <h3 className="text-lg font-bold text-[var(--ink)] tracking-tight">
              {isPrivacy ? 'Privacy Policy & Data Security' : 'Terms of Software License & Service'}
            </h3>
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
        <div className="p-6 text-xs text-[var(--ink)]/80 space-y-4 leading-relaxed overflow-y-auto">
          {isPrivacy ? (
            <>
              <p>
                This Privacy Policy outlines how <strong>{COMPANY_INFO.name}</strong> (domain: <em>{COMPANY_INFO.domain}</em>) treats and protects customer data, website interactions, and offline application databases.
              </p>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-1">
                <h4 className="font-bold text-[var(--ink)] text-sm mb-1 font-mono uppercase tracking-wide">1. 100% Offline Database Privacy</h4>
                <p>
                  Our flagship desktop applications, including <strong>Finance Flow</strong>, <strong>Finance Flow Lite</strong>, and <strong>Finance Flow Flash</strong>, do not transmit your financial transactions, inventory, or GST invoices to external cloud servers. All sensitive business records remain exclusively on your local computer disk.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-1">
                <h4 className="font-bold text-[var(--ink)] text-sm mb-1 font-mono uppercase tracking-wide">2. Contact Form & Communications</h4>
                <p>
                  Information submitted via our contact and enquiry form (name, email, mobile number, and project requirements) is utilized solely by our direct development and sales team to address your request. We never sell, rent, or trade your contact information to third-party telemarketers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-1">
                <h4 className="font-bold text-[var(--ink)] text-sm mb-1 font-mono uppercase tracking-wide">3. Security Standards</h4>
                <p>
                  We employ industry-standard encryption practices for custom enterprise applications. Local backups can be encrypted using AES-256 standard encryption keys.
                </p>
              </div>

              <div className="pt-2 text-[var(--muted)] text-[11px] font-mono">
                Last updated: October 2026 • {COMPANY_INFO.name} Legal Desk.
              </div>
            </>
          ) : (
            <>
              <p>
                By downloading, installing, or evaluating software developed by <strong>{COMPANY_INFO.name}</strong>, you agree to these Terms of Service.
              </p>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-1">
                <h4 className="font-bold text-[var(--ink)] text-sm mb-1 font-mono uppercase tracking-wide">1. Software License Grant</h4>
                <p>
                  {COMPANY_INFO.name} grants you a non-exclusive license to operate Finance Flow, Finance Flow Lite, Finance Flow Flash, and Bharat Yatra Sathi for lawful business and personal operations on authorized hardware systems.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-1">
                <h4 className="font-bold text-[var(--ink)] text-sm mb-1 font-mono uppercase tracking-wide">2. Offline Autonomy & Local Data Responsibility</h4>
                <p>
                  Because Finance Flow operates 100% offline without remote cloud synchronization, users are encouraged to maintain periodic external drive backups of their database files using the software's built-in backup utility.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-1">
                <h4 className="font-bold text-[var(--ink)] text-sm mb-1 font-mono uppercase tracking-wide">3. Custom Development Engagements</h4>
                <p>
                  Custom software projects are governed by bespoke Statements of Work (SOW) outlining project scope, acceptance criteria, milestone schedules, and post-delivery warranty support.
                </p>
              </div>

              <div className="pt-2 text-[var(--muted)] text-[11px] font-mono">
                Governing Law: Jurisdiction of Kolkata, West Bengal, India.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--bg)]/95 border-t border-[var(--line)] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[var(--ink)] hover:text-[var(--ink)] bg-[var(--soft)] hover:bg-[var(--line)]/50 border border-[var(--line)] rounded-full transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
