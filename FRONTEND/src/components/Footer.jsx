import React, { useState } from 'react';
import { COMPANY_INFO, SERVICES, PRODUCTS, LANDING_PAGE_SECTIONS } from '../data/companyData';
import api from '../utils/api';

export default function Footer({ onOpenPrivacy, onOpenTerms, onSelectService, onSelectProduct, onOpenAdmin, onOpenDownloadsPage }) {
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
    <footer className="foot" id="footer" data-section="footer" role="contentinfo">
      <div className="wrap">
        
        {/* Top Floating Orb Banner (FCTA) */}
        <div className="fcta" data-reveal>
          <svg className="fcta__orb shrink-0" aria-hidden="true">
            <use href="#s-orb" />
          </svg>

          {(() => {
            const contact = LANDING_PAGE_SECTIONS?.contact || {};
            return (
              <div>
                <span className="fcta__eyebrow">{contact.footerCtaEyebrow || 'Enterprise Precision • Zero Cloud Latency'}</span>
                <h3 className="fcta__title">
                  {contact.footerCtaTitle || 'Bring calm, offline precision to your billing counter.'}
                </h3>
              </div>
            );
          })()}

          <div className="stores">
            <a
              href="#downloads"
              onClick={(e) => {
                if (onOpenDownloadsPage) {
                  e.preventDefault();
                  onOpenDownloadsPage();
                }
              }}
              className="store cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <div>
                <small>Release Status</small>
                <b>Coming Soon</b>
              </div>
            </a>

            <a href={`tel:${COMPANY_INFO.phone}`} className="store store--ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
          <div className="foot__brand">
            <a className="logo flex items-center gap-3" href="#home" title="Esyus Technology">
              <img
                src="/logo-horizontal-white.png"
                alt={COMPANY_INFO.name}
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </a>

            <p className="foot__about">
              {COMPANY_INFO.name} builds robust, offline-capable desktop billing suites and tailored Android applications designed to operate without internet dependency or recurring lock-ins.
            </p>

            <span className="status">
              <i></i>All systems monitoring normally
            </span>

            <div className="foot__meta text-[11px] text-[var(--fm)] space-y-1 font-mono pt-1">
              <div className="break-words">Leadership: {COMPANY_INFO.founder} (Founder) &amp; {COMPANY_INFO.coFounder} (Co-Founder)</div>
              <div>Domain: <span className="text-[var(--c3)]">{COMPANY_INFO.domain}</span></div>
              <div>Incorporation Roadmap: {COMPANY_INFO.establishmentDate}</div>
            </div>
          </div>

          {/* Applications Column */}
          <nav className="foot__col" aria-label="Applications">
            <h3>Applications</h3>
            <ul>
              {PRODUCTS.map((prod) => (
                <li key={prod.id}>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(prod)}
                    className="link"
                  >
                    {prod.logo ? (
                      <img src={prod.logo} alt="" className="w-3.5 h-3.5 object-contain shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--c1)] shrink-0" />
                    )}
                    <span>{prod.name}</span>
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#downloads"
                  onClick={(e) => {
                    if (onOpenDownloadsPage) {
                      e.preventDefault();
                      onOpenDownloadsPage();
                    }
                  }}
                  className="link text-[var(--c3)] font-semibold block cursor-pointer"
                >
                  Explore Software Packages →
                </a>
              </li>
            </ul>
          </nav>

          {/* Core Services Column */}
          <nav className="foot__col" aria-label="Services">
            <h3>Services</h3>
            <ul>
              {SERVICES.map((srv) => (
                <li key={srv.id}>
                  <button
                    type="button"
                    onClick={() => onSelectService(srv)}
                    className="link"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--fl)] shrink-0" />
                    <span>{srv.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Direct Office & Contact Desk */}
          <nav className="foot__col foot__col--headquarters" aria-label="Headquarters">
            <h3>Headquarters</h3>
            <ul>
              <li>
                <span className="block text-white font-medium text-xs">Address</span>
                <span className="text-xs text-[var(--fm)] leading-relaxed break-words block">{COMPANY_INFO.address}</span>
              </li>
              <li className="pt-1">
                <span className="block text-white font-medium text-xs">Direct Desk</span>
                <a href={`tel:${COMPANY_INFO.phone}`} className="link text-xs text-[var(--fm)] hover:text-white">
                  {COMPANY_INFO.phone}
                </a>
              </li>
              <li className="pt-1">
                <span className="block text-white font-medium text-xs">Inquiries</span>
                <a href={`mailto:${COMPANY_INFO.email}`} className="link text-xs text-[var(--fm)] hover:text-white break-all">
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>
          </nav>

          {/* Software Updates Subscription Form (Hearthly Pattern) */}
          <form className="news" data-news onSubmit={handleSubscribe} noValidate>
            <h3>Product Releases</h3>
            <p>
              Get notified of new offline billing builds, GST tariff updates, and hardware drivers.
            </p>

            {subscribed ? (
              <p className="news__ok">
                ✓ Thank you for subscribing to {COMPANY_INFO.shortName || 'Esyus'} releases!
              </p>
            ) : (
              <label className="news__field">
                <span className="sr">Email address</span>
                <input
                  type="email"
                  name="email"
                  placeholder="billing@yourstore.in"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  autoComplete="email"
                  required
                />
                <button type="submit" aria-label="Subscribe to releases">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>
              </label>
            )}
          </form>

        </div>

        {/* Bottom Base Bar */}
        <div className="foot__base">
          <div className="foot__legal">
            <span>© 2026–2027 <strong className="text-white">{COMPANY_INFO.name}</strong>. All rights reserved. Registered under domain <span className="text-[var(--c3)] font-mono">{COMPANY_INFO.domain}</span>.</span>
            <button type="button" onClick={onOpenPrivacy} className="link cursor-pointer">
              Privacy Policy
            </button>
            <button type="button" onClick={onOpenTerms} className="link cursor-pointer">
              Terms of Use
            </button>
            <button
              type="button"
              onClick={onOpenAdmin || (() => { window.location.hash = '#admin'; })}
              className="link opacity-50 hover:opacity-100 cursor-pointer text-[11px]"
              title="Internal Portal"
            >
              <span>Admin Access</span>
            </button>
          </div>

          <div className="badges">
            <span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 1.5 13.5 4v4c0 3.2-2.3 5.6-5.5 6.5C4.8 13.6 2.5 11.2 2.5 8V4z" />
                <path d="m5.5 8 1.8 1.8L10.8 6" />
              </svg>
              100% Offline Resilience
            </span>
            <span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 1.5 13.5 4v4c0 3.2-2.3 5.6-5.5 6.5C4.8 13.6 2.5 11.2 2.5 8V4z" />
                <path d="m5.5 8 1.8 1.8L10.8 6" />
              </svg>
              Zero Cloud Latency
            </span>
            <span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 1.5 13.5 4v4c0 3.2-2.3 5.6-5.5 6.5C4.8 13.6 2.5 11.2 2.5 8V4z" />
                <path d="m5.5 8 1.8 1.8L10.8 6" />
              </svg>
              Direct Founder Support
            </span>
          </div>

          <div className="socials">
            <button
              type="button"
              onClick={scrollToTop}
              className="store store--ghost"
              style={{ height: '38px', padding: '0 14px', fontSize: '12px' }}
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
