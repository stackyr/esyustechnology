import React, { useState } from 'react';
import { COMPANY_INFO, SERVICES, PRODUCTS } from '../data/companyData';
import api from '../utils/api';

export default function Footer({ onOpenPrivacy, onOpenTerms, onSelectService, onSelectProduct, onOpenAdmin }) {
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      const email = emailInput.trim();
      setSubscribed(true);
      setEmailInput('');
      api.submitInquiry({
        name: 'Release Subscriber',
        email: email,
        subject: 'Product Release Subscription',
        message: 'Visitor subscribed to offline billing updates, GST tariffs, and release notifications.',
        type: 'subscription'
      }).catch(err => console.warn('Newsletter sync error:', err));
    }
  };

  return (
    <footer className="foot" role="contentinfo">
      <div className="wrap">
        
        {/* Top Floating Orb Banner (FCTA) */}
        <div className="fcta">
          <svg className="fcta__orb shrink-0" aria-hidden="true">
            <use href="#s-orb" />
          </svg>

          <div>
            <span className="fcta__eyebrow">Enterprise Precision • Zero Cloud Latency</span>
            <h3 className="fcta__title">
              Bring calm, offline precision to your billing counter.
            </h3>
          </div>

          <div className="stores">
            <a href="#download" className="store">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <div>
                <small>Install Today</small>
                <b>Download .EXE</b>
              </div>
            </a>

            <a href={`tel:${COMPANY_INFO.phone}`} className="store store--ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <small>Call Founder</small>
                <b>{COMPANY_INFO.phone}</b>
              </div>
            </a>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="foot__grid">
          
          {/* Brand & Editorial Mission */}
          <div className="foot__brand space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-horizontal-white.png"
                alt={COMPANY_INFO.name}
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </div>

            <p className="text-xs text-[var(--fm)] leading-relaxed max-w-sm">
              {COMPANY_INFO.name} builds robust, offline-capable desktop billing suites and tailored Android applications designed to operate without internet dependency or recurring lock-ins.
            </p>

            <div className="text-[11px] text-[var(--fm)] space-y-1 font-mono">
              <div>Leadership: {COMPANY_INFO.founder} (Founder) & {COMPANY_INFO.coFounder} (Co-Founder)</div>
              <div>Domain: <span className="text-[var(--c3)]">{COMPANY_INFO.domain}</span></div>
              <div>Incorporation Roadmap: {COMPANY_INFO.establishmentDate}</div>
            </div>
          </div>

          {/* Applications Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Applications
            </h4>
            <ul className="space-y-2 text-xs">
              {PRODUCTS.map((prod) => (
                <li key={prod.id}>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(prod)}
                    className="text-[var(--fm)] hover:text-white transition-colors text-left flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--c1)]" />
                    <span>{prod.name}</span>
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <a href="#download" className="text-[var(--c3)] hover:underline font-semibold block">
                  Download All Packages →
                </a>
              </li>
            </ul>
          </div>

          {/* Core Services Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              {SERVICES.map((srv) => (
                <li key={srv.id}>
                  <button
                    type="button"
                    onClick={() => onSelectService(srv)}
                    className="text-[var(--fm)] hover:text-white transition-colors text-left flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--fl)]" />
                    <span>{srv.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Office & Contact Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Headquarters
            </h4>
            <ul className="space-y-2 text-xs text-[var(--fm)]">
              <li>
                <span className="block text-white font-semibold">Address:</span>
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li>
                <span className="block text-white font-semibold">Direct Desk:</span>
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-white underline">
                  {COMPANY_INFO.phone}
                </a>
              </li>
              <li>
                <span className="block text-white font-semibold">Inquiries:</span>
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white">
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Software Updates Subscription */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Product Releases
            </h4>
            <p className="text-xs text-[var(--fm)] leading-relaxed">
              Get notified of new offline billing builds, GST tariff updates, and hardware drivers.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-white/10 text-[var(--c3)] text-xs font-semibold">
                ✓ Thank you for subscribing to {COMPANY_INFO.shortName || 'Esyus'} releases!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="billing@yourstore.in"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-[var(--fl)] text-xs text-white placeholder-[var(--fm)] focus:outline-none focus:border-[var(--c3)]"
                />
                <button
                  type="submit"
                  className="btn btn--sm w-full justify-center"
                  style={{ width: '100%', height: '38px', fontSize: '13px' }}
                >
                  <span>Subscribe to Releases</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Base Bar */}
        <div className="foot__base pt-8 border-t border-[var(--fl)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--fm)]">
          <div className="text-center md:text-left">
            © 2026–2027 <strong className="text-white">{COMPANY_INFO.name}</strong>. All rights reserved. Registered under domain <span className="text-[var(--c3)] font-mono">{COMPANY_INFO.domain}</span>.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={onOpenTerms}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <button
              type="button"
              onClick={onOpenAdmin || (() => { window.location.hash = '#admin'; })}
              className="opacity-40 hover:opacity-100 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[11px]"
              title="Internal Portal"
            >
              <span>Admin Access</span>
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              title="Return to top"
            >
              <span>↑ Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
