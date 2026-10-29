import React, { useState, useEffect } from 'react';
import { COMPANY_INFO, PRODUCTS } from '../data/companyData';

export default function Navbar({ onDownloadClick, onContactClick }) {
  const [isSolid, setIsSolid] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsSolid(currentY > 15);

          if (currentY < 80 || mobileMenuOpen) {
            setIsHidden(false);
          } else if (currentY > lastY && currentY > 120) {
            setIsHidden(true);
          } else if (currentY < lastY - 4) {
            setIsHidden(false);
          }

          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Applications', id: 'applications' },
    { label: 'Finance Flow', id: 'featured-product' },
    { label: 'Why Us', id: 'why-choose-us' },
    { label: 'Team', id: 'team' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Downloads', id: 'download' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`hdr ${isSolid ? 'is-solid' : ''} ${isHidden ? 'is-hidden' : ''}`}
        data-hdr
      >
        <div className="hdr__wrap hdr__in">
          {/* Brand Logo */}
          <a
            className="logo group flex items-center gap-2.5 py-1 cursor-pointer transition-opacity hover:opacity-95 shrink-0"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('home');
            }}
            aria-label={`${COMPANY_INFO.name} Home`}
          >
            <img
              src="/logo-horizontal.png"
              alt={COMPANY_INFO.name}
              className="h-9 sm:h-10 w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="hidden xl:inline-flex items-center text-[9.5px] tracking-widest uppercase text-[var(--muted)] font-mono border-l border-[var(--line)] pl-2.5 ml-0.5 whitespace-nowrap">
              Offline First
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="nav desktop-nav" aria-label="Main Navigation">
            <button className="link" onClick={() => scrollTo('about')}>About</button>
            <button className="link" onClick={() => scrollTo('services')}>Services</button>
            <button className="link" onClick={() => scrollTo('applications')}>Applications</button>
            <button className="link font-semibold text-[var(--c1)]" onClick={() => scrollTo('featured-product')}>
              Finance Flow
            </button>
            <button className="link" onClick={() => scrollTo('why-choose-us')}>Why Us</button>
            <button className="link" onClick={() => scrollTo('team')}>Team</button>
            <button className="link" onClick={() => scrollTo('reviews')}>Reviews</button>
            <button className="link" onClick={() => scrollTo('download')}>Downloads</button>
            <button className="link" onClick={() => scrollTo('faq')}>FAQ</button>
            <button className="link" onClick={() => scrollTo('contact')}>Contact</button>
          </nav>

          {/* Header Action Tools */}
          <div className="hdr__tools">
            {/* Quick Call Button */}
            <a
              className="ibtn ibtn--bare hidden sm:inline-grid"
              href={`tel:${COMPANY_INFO.phone}`}
              aria-label={`Call ${COMPANY_INFO.phone}`}
              title={`Call Desk: ${COMPANY_INFO.phone}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>

            {/* Quick FAQ / Help button */}
            <button
              className="ibtn ibtn--bare hidden md:inline-grid"
              onClick={() => scrollTo('faq')}
              aria-label="FAQ & Help"
              title="Help & Questions"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>

            {/* Primary Download CTA Button */}
            <button
              className="btn btn--line btn--sm hidden lg:inline-flex shrink-0 whitespace-nowrap shadow-sm"
              onClick={() => {
                if (onDownloadClick) onDownloadClick();
                else scrollTo('download');
              }}
            >
              <span>Download Apps</span>
              <svg className="btn__arr" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8" />
              </svg>
            </button>

            {/* Mobile / Tablet Menu Button with animated hamburger */}
            <button
              className="ibtn menu-btn"
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line
                  x1="4"
                  y1={mobileMenuOpen ? '12' : '8'}
                  x2="20"
                  y2={mobileMenuOpen ? '12' : '8'}
                  style={{
                    transformOrigin: 'center',
                    transform: mobileMenuOpen ? 'rotate(45deg)' : 'none',
                    transition: 'transform .35s var(--ease), y1 .35s var(--ease), y2 .35s var(--ease)'
                  }}
                />
                <line
                  x1="4"
                  y1={mobileMenuOpen ? '12' : '16'}
                  x2="20"
                  y2={mobileMenuOpen ? '12' : '16'}
                  style={{
                    transformOrigin: 'center',
                    transform: mobileMenuOpen ? 'rotate(-45deg)' : 'none',
                    transition: 'transform .35s var(--ease), y1 .35s var(--ease), y2 .35s var(--ease)'
                  }}
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 bg-[var(--bg)] flex flex-col justify-between p-5 sm:p-10 pt-20 pb-8 overflow-y-auto animate-fadeIn"
          style={{
            backgroundImage: 'radial-gradient(ellipse at top right, rgba(232, 105, 60, 0.08), transparent 70%)'
          }}
        >
          {/* Menu Sections Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">
                {COMPANY_INFO.name} Navigation
              </span>
              <span className="text-xs font-mono text-[var(--c1)] font-semibold">
                10 Core Sections
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {navLinks.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--line)] text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[var(--muted)] group-hover:text-[var(--c1)]">
                      0{idx + 1}
                    </span>
                    <span className="text-base font-semibold text-[var(--ink)] group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--muted)] group-hover:text-[var(--ink)]">→</span>
                </button>
              ))}
            </div>

            {/* Quick App Downloads in Mobile Drawer */}
            <div className="p-4 rounded-2xl bg-white border border-[var(--line)] space-y-3">
              <span className="text-xs uppercase tracking-wider text-[var(--muted)] font-mono block">
                Software Ecosystem (Coming Soon)
              </span>
              <div className="flex flex-wrap gap-2">
                {PRODUCTS.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      scrollTo('download');
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--soft)] hover:bg-[var(--line)] text-[var(--ink)] transition-colors flex items-center gap-1.5"
                  >
                    {prod.logo && (
                      <img src={prod.logo} alt={prod.name} className="w-3.5 h-3.5 object-contain" />
                    )}
                    <span>{prod.name}</span>
                    <span className="text-[10px] font-mono text-[var(--c1)] font-semibold">Coming Soon</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-6 mt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[var(--muted)] text-center sm:text-left">
              Direct Desk: <a href={`tel:${COMPANY_INFO.phone}`} className="font-bold text-[var(--ink)] underline">{COMPANY_INFO.phone}</a>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                className="btn btn--sm flex-1 sm:flex-none justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onDownloadClick) onDownloadClick();
                  else scrollTo('download');
                }}
              >
                <span>Explore Packages</span>
              </button>
              <button
                className="btn btn--line btn--sm flex-1 sm:flex-none justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onContactClick) onContactClick();
                  else scrollTo('contact');
                }}
              >
                <span>Contact Desk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
