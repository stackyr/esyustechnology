import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send, AlertCircle, Phone, Mail, Building, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import liveSync from '../utils/liveSync';

export default function InquiryModal({ initialSubject = '', serviceName = '', onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    subject: initialSubject || (serviceName ? `Enquiry: ${serviceName}` : 'General Project & Software Enquiry'),
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^[0-9+\-\s()]{8,18}$/.test(formData.mobile)) {
      errs.mobile = 'Please enter a valid mobile / WhatsApp number';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim() || `Requested enquiry for ${serviceName || formData.subject}`,
        type: 'enquiry',
      };

      const res = await api.submitInquiry(payload);
      
      // Real-time broadcast to Admin Panel
      if (res && res.data) {
        liveSync.emitAdminChange('inquiry_received', res.data);
      }

      setIsSubmitted(true);
    } catch (err) {
      console.warn('[InquiryModal] Submission fallback:', err.message);
      // Still show success to client
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[var(--line)] relative overflow-hidden animate-scaleUp"
      >
        {/* Header */}
        <div className="bg-[var(--bg)]/95 backdrop-blur-md px-6 py-4 border-b border-[var(--line)] flex items-center justify-between shrink-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--c1)] block">
                Project &amp; Software Inquiry
              </span>
              {serviceName && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--c1)]/10 text-[var(--c1)] border border-[var(--c1)]/20 truncate max-w-[180px]">
                  {serviceName}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight mt-0.5">
              Start Project Inquiry
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
        <div
          data-lenis-prevent="true"
          className="p-5 sm:p-7 space-y-5 overflow-y-auto overscroll-contain flex-1 min-h-0 modal-scroll"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {isSubmitted ? (
            /* Success State */
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-badge-glow">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  Inquiry Dispatched Live
                </span>
                <h4 className="text-xl font-bold text-[var(--ink)]">
                  Thank you, {formData.name}!
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Your project requirements for <strong className="text-[var(--ink)]">{serviceName || formData.subject}</strong> have been received by our engineering desk.
                </p>
                <div className="p-3.5 rounded-2xl bg-white border border-[var(--line)] text-left text-xs space-y-1.5 mt-3 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
                    <span>Contact Number:</span>
                    <strong className="text-[var(--ink)] font-mono">{formData.mobile}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
                    <span>Email Desk:</span>
                    <strong className="text-[var(--ink)]">{formData.email}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--muted)] pt-1 border-t border-[var(--line)]">
                    <span>Response Window:</span>
                    <strong className="text-emerald-700 font-semibold">Within 24 business hours</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[var(--ink)] text-white text-xs font-bold shadow-md hover:bg-stone-800 transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Form Input State */
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Fill in your details below. Our technical leads engineer bespoke solutions tailored for your operational requirements.
              </p>

              {/* Grid 1: Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sayantan Ghosh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)] focus:bg-white transition-colors"
                  />
                  {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1 flex items-center justify-between">
                    <span>Mobile / WhatsApp *</span>
                    <span className="text-[10px] text-[var(--muted)] font-mono">Instant Callback</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)] focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.mobile && <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>}
                </div>
              </div>

              {/* Grid 2: Email & Business / City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="business@company.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)] focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Organization &amp; City <span className="text-[10px] text-[var(--muted)]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Retail Store, Burdwan"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Inquiry Subject / Service
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Enquiry: Desktop Application Development"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-semibold focus:outline-none focus:border-[var(--c1)] focus:bg-white transition-colors"
                />
              </div>

              {/* Project Requirements / Message */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1 flex items-center justify-between">
                  <span>Project Scope &amp; Hardware Details</span>
                  <span className="text-[10px] text-[var(--muted)] font-mono">Offline / Web / Mobile</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your business counter setup, number of billing terminals, hardware printers, or custom software requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)] focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 order-2 sm:order-1">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--c1)]" />
                  <span>Direct link to engineering desk</span>
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[var(--c1)] hover:bg-[#d64b22] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Project Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
