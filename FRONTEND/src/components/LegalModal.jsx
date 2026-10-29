import React from 'react';
import { X, Shield, FileText } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

export default function LegalModal({ type, onClose }) {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-scaleUp">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-brand-600 flex items-center justify-center">
              {isPrivacy ? <Shield className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isPrivacy ? 'Privacy Policy & Data Security' : 'Terms of Software License & Service'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-xs text-slate-600 space-y-4 leading-relaxed">
          {isPrivacy ? (
            <>
              <p>
                This Privacy Policy outlines how <strong>{COMPANY_INFO.name}</strong> (domain: <em>{COMPANY_INFO.domain}</em>) treats and protects customer data, website interactions, and offline application databases.
              </p>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. 100% Offline Database Privacy</h4>
                <p>
                  Our flagship desktop applications, including <strong>Finance Flow</strong>, <strong>Finance Flow Lite</strong>, and <strong>Finance Flow Flash</strong>, do not transmit your financial transactions, inventory, or GST invoices to external cloud servers. All sensitive business records remain exclusively on your local computer disk.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Contact Form & Communications</h4>
                <p>
                  Information submitted via our contact and enquiry form (name, email, mobile number, and project requirements) is utilized solely by our direct development and sales team to address your request. We never sell, rent, or trade your contact information to third-party telemarketers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Security Standards</h4>
                <p>
                  We employ industry-standard encryption practices for custom enterprise applications. Local backups can be encrypted using AES-256 standard encryption keys.
                </p>
              </div>

              <div className="pt-2 text-slate-400 text-[11px]">
                Last updated: October 2026 • Esyus Technologies Legal Desk.
              </div>
            </>
          ) : (
            <>
              <p>
                By downloading, installing, or evaluating software developed by <strong>{COMPANY_INFO.name}</strong>, you agree to these Terms of Service.
              </p>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Software License Grant</h4>
                <p>
                  Esyus Technologies grants you a non-exclusive license to operate Finance Flow, Finance Flow Lite, Finance Flow Flash, and Bharat Yatra Sathi for lawful business and personal operations on authorized hardware systems.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Offline Autonomy & Local Data Responsibility</h4>
                <p>
                  Because Finance Flow operates 100% offline without remote cloud synchronization, users are encouraged to maintain periodic external drive backups of their database files using the software's built-in backup utility.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Custom Development Engagements</h4>
                <p>
                  Custom software projects are governed by bespoke Statements of Work (SOW) outlining project scope, acceptance criteria, milestone schedules, and post-delivery warranty support.
                </p>
              </div>

              <div className="pt-2 text-slate-400 text-[11px]">
                Governing Law: Jurisdiction of Kolkata, West Bengal, India.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
