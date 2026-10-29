import React, { useState } from 'react';
import { COMPANY_INFO, SERVICES, PRODUCTS } from '../data/companyData';

export default function ContactUs({ preselectedSubject }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    subject: preselectedSubject || 'Finance Flow Desktop Billing',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prevSubject, setPrevSubject] = useState(preselectedSubject);
  if (preselectedSubject && preselectedSubject !== prevSubject) {
    setPrevSubject(preselectedSubject);
    setFormData((prev) => ({ ...prev, subject: preselectedSubject }));
  }

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.mobile)) {
      errs.mobile = 'Please enter a valid mobile number';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide details about your software or enquiry requirement';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      mobile: '',
      email: '',
      address: '',
      subject: 'Finance Flow Desktop Billing',
      message: '',
    });
    setIsSubmitted(false);
    setErrors({});
  };

  return (
    <section id="contact" className="contact" data-sec="contact">
      <div className="wrap contact__in">
        
        {/* Left Column: Contact Copy & Form */}
        <div className="contact__copy">
          <div>
            <span className="eyebrow">Section 11 • Get In Touch</span>
            <h2 className="contact__title" style={{ marginTop: '16px' }}>
              Start a <em className="s">conversation.</em>
            </h2>
            <p className="lead" style={{ marginTop: '14px' }}>
              Have questions regarding Finance Flow, customized desktop billing counters, or custom Android app development? Reach out to our technical leadership directly.
            </p>
          </div>

          {/* Primary Email */}
          <a className="contact__mail" href={`mailto:${COMPANY_INFO.email}`}>
            {COMPANY_INFO.email}
          </a>

          {/* Contact Details List */}
          <dl className="contact__list">
            <div>
              <dt>Direct Phone Line</dt>
              <dd>
                <a href={`tel:${COMPANY_INFO.phone}`} className="font-bold underline">
                  {COMPANY_INFO.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>Corporate Location</dt>
              <dd>{COMPANY_INFO.address}</dd>
            </div>
            <div>
              <dt>Technical Helpdesk</dt>
              <dd>{COMPANY_INFO.supportEmail}</dd>
            </div>
            <div>
              <dt>Registered Web Domain</dt>
              <dd className="font-mono text-sm">{COMPANY_INFO.domain}</dd>
            </div>
          </dl>

          {/* Interactive Enquiry Form */}
          <div className="w-full p-6 sm:p-8 rounded-2xl bg-white border border-[var(--line)] shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[var(--c2)] text-[var(--c5)] flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-[var(--ink)]">
                  Enquiry Received Successfully!
                </h3>
                <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[var(--ink)]">{formData.name}</strong>. Our engineering desk has received your proposal regarding <strong className="text-[var(--c1)]">{formData.subject}</strong>. We will reach you at <strong className="text-[var(--ink)]">{formData.mobile}</strong> or via email within 2 to 4 business hours.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn--line btn--sm"
                  >
                    Send Another Proposal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-[var(--ink)]">
                    Send an Enquiry or Project Proposal
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Fields marked with * are required for quotation generation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Milan Mandal"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                    {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                    {errors.mobile && <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="name@business.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                    {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                      Business City / Address <span className="text-[var(--muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kolkata, West Bengal"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Application or Service of Interest *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  >
                    <optgroup label="Applications (from SRS)">
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.name}>{p.name} ({p.category})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Core Services (from SRS)">
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </optgroup>
                    <option value="General Enterprise Software Enquiry">General Enterprise Software Enquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Software Specifications or Requirements *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your requirements (e.g. 2 counter POS setup, thermal printer model, local SQLite offline backup, or custom Android features)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  />
                  {errors.message && <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>}
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn--sm"
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? (
                      <span>Submitting Proposal...</span>
                    ) : (
                      <>
                        <span>Submit Project Enquiry to Esyus</span>
                        <svg className="btn__arr" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Code Art & Phone Screen Mockup */}
        <figure className="contact__photo tab-r overflow-hidden relative">
          <div className="art g-pine relative">
            <img
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=900"
              alt="Esyus Store Counter Billing Setup"
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />
            <div className="phone">
              <div className="phone__screen">
                {/* Phone Top Status */}
                <div className="flex items-center justify-between text-[10px] text-[var(--muted)] font-mono border-b border-[var(--line)] pb-1.5">
                  <span>ESYUS TERMINAL</span>
                  <span className="text-[var(--c5)] font-bold">100% OFFLINE</span>
                </div>

                {/* Mini POS Bill Preview */}
                <div className="p-2.5 rounded-xl bg-white border border-[var(--line)] space-y-1.5 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[var(--ink)]">Finance Flow v2.4</span>
                    <span className="text-[9px] font-mono text-[var(--c1)]">Active POS</span>
                  </div>
                  <div className="text-[10px] text-[var(--muted)]">Counter #01 • GST Compliant</div>
                  <div className="pt-1.5 border-t border-[var(--line)] flex justify-between font-mono text-xs font-bold text-[var(--ink)]">
                    <span>Today's Invoices</span>
                    <span>142 Bills</span>
                  </div>
                </div>

                {/* Live Diagnostic */}
                <div className="p-2.5 rounded-xl bg-white border border-[var(--line)] space-y-1 text-[10px]">
                  <div className="text-[var(--muted)] font-mono">SQLite Local Database</div>
                  <div className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span>●</span> Encrypted & Verified
                  </div>
                </div>

                {/* Direct Phone Support Widget */}
                <div className="mt-auto p-2.5 rounded-xl bg-[var(--dark)] text-[var(--bg)] space-y-1">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--c3)] font-mono">
                    Direct Founder Line
                  </div>
                  <div className="text-xs font-bold">{COMPANY_INFO.phone}</div>
                  <div className="text-[9px] text-[var(--muted)]">Milan Mandal • Kolkata, WB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Micro Chip Badge */}
          <div className="chip">
            <span className="chip__ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <div>
              <b>Fast Technical Response</b>
              <small>Average reply within 2 to 4 business hours</small>
            </div>
          </div>
        </figure>

      </div>
    </section>
  );
}
