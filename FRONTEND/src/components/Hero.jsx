import React from 'react';
import { COMPANY_INFO, LANDING_PAGE_SECTIONS } from '../data/companyData';

export default function Hero({ onExploreServices, onViewApplications, onDownloadClick }) {
  const hero = LANDING_PAGE_SECTIONS.hero;

  return (
    <section id="home" className="hero" data-kind="hero" data-section="hero">
      <div className="hero__stage">
        {/* Head area with Ring, Title, Crew */}
        <div className="wrap hero__head">
          <a className="ring" href="#featured-product" aria-label={`Explore Finance Flow GST billing by ${COMPANY_INFO.name}`}>
            <svg className="ring__svg" viewBox="0 0 100 100" aria-hidden="true">
              <path id="ring-path" d="M11 50a39 39 0 1 1 78 0a39 39 0 1 1-78 0" fill="none" />
              <text>
                <textPath href="#ring-path" textLength="240" lengthAdjust="spacingAndGlyphs">
                  {hero.ringText || `Offline Billing Suite · ${COMPANY_INFO.name} · `}
                </textPath>
              </text>
            </svg>
            <svg className="ring__play" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
            </svg>
          </a>

          <h1 className="hero__title">
            {hero.title ? (
              <>
                {hero.title.split('reliability')[0]}
                {hero.title.includes('reliability') && <em className="s">reliability</em>}
                {hero.title.split('reliability')[1]}
              </>
            ) : (
              <>Engineered for speed, built for <em className="s">reliability</em></>
            )}
          </h1>

          <a className="crew" href="#team" title={`Leadership: ${COMPANY_INFO.founder} & ${COMPANY_INFO.coFounder} — Kolkata, WB`}>
            <span className="crew__img">
              <img
                src={hero.founderPhoto || LANDING_PAGE_SECTIONS.about.founderPhoto}
                alt={`${COMPANY_INFO.founder} — Founder`}
              />
            </span>
            <span className="crew__img">
              <img
                src={hero.coFounderPhoto || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"}
                alt={`${COMPANY_INFO.coFounder} — Co-Founder`}
              />
            </span>
            <span className="ibtn" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="sr">Meet our leadership team</span>
          </a>
        </div>

        {/* 5-Column Floating Collage with Real Topic-Related Images */}
        <div className="wrap collage" data-fixed="7">
          {/* Column A */}
          <div className="collage__col col-a">
            <figure className="look look--xl tab-l overflow-hidden relative group" style={{ '--plate': 'var(--c1)' }}>
              <img
                src={hero.collageA1}
                alt="Retail POS Billing Counter"
                className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="chip">
                <span className="chip__ic">
                  <svg viewBox="0 0 24 24"><use href="#s-spark" /></svg>
                </span>
                <span>
                  <b>100% Offline POS</b>
                  <small>0.2s Keystroke · Local SQLite</small>
                </span>
              </div>
            </figure>

            <figure className="look look--sm overflow-hidden relative group" style={{ '--plate': 'var(--c3)' }}>
              <img
                src={hero.collageA2}
                alt="Thermal Receipt Printing"
                className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="chip">
                <span className="chip__ic">
                  <svg viewBox="0 0 24 24"><use href="#s-spark" /></svg>
                </span>
                <span>
                  <b>GST Tax Invoice</b>
                  <small>Thermal 2" & 3" Ready</small>
                </span>
              </div>
            </figure>
          </div>

          {/* Column B */}
          <div className="collage__col col-b">
            <figure className="look look--xxl tab-l overflow-hidden relative group" style={{ '--plate': 'var(--c2)' }}>
              <img
                src={hero.collageB}
                alt="Supermarket Checkout Counter"
                className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
              <div className="chip">
                <span className="chip__ic">
                  <svg viewBox="0 0 24 24"><use href="#s-spark" /></svg>
                </span>
                <span>
                  <b>Offline Systems Ready</b>
                  <small>Zero cloud dependency</small>
                </span>
              </div>
            </figure>
          </div>

          {/* Column C: Center Orb & Main Button */}
          <div className="collage__col col-c">
            <svg className="burst" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="currentColor">
                <circle cx="20" cy="4" r="2.2" />
                <circle cx="31.3" cy="8.7" r="2.2" />
                <circle cx="36" cy="20" r="2.2" />
                <circle cx="31.3" cy="31.3" r="2.2" />
                <circle cx="20" cy="36" r="2.2" />
                <circle cx="8.7" cy="31.3" r="2.2" />
                <circle cx="4" cy="20" r="2.2" />
                <circle cx="8.7" cy="8.7" r="2.2" />
                <circle cx="20" cy="12" r="1.7" />
                <circle cx="27" cy="16" r="1.7" />
                <circle cx="27" cy="24" r="1.7" />
                <circle cx="20" cy="28" r="1.7" />
                <circle cx="13" cy="24" r="1.7" />
                <circle cx="13" cy="16" r="1.7" />
                <circle cx="20" cy="20" r="2.6" />
              </g>
            </svg>

            <figure className="look look--md" style={{ '--plate': 'var(--c3)' }} data-flood-from>
              <div className="art g-cream" role="img" aria-label={`${COMPANY_INFO.name} Offline Core Engine`}>
                <svg className="ico" viewBox="0 0 200 200" style={{ '--s': '86%' }}>
                  <use href="#s-orb" />
                </svg>
              </div>
            </figure>

            <button
              className="btn btn--cta"
              onClick={onDownloadClick || onViewApplications || onExploreServices}
            >
              <span>Explore applications</span>
              <svg className="btn__arr" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 9 9 3M4 3h5v5" />
              </svg>
            </button>
          </div>

          {/* Column D */}
          <div className="collage__col col-d">
            <figure className="look look--xxl tab-r overflow-hidden relative group" style={{ '--plate': 'var(--c4)' }}>
              <img
                src={hero.collageD}
                alt="Finance Flow Desktop Billing Counter"
                className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
              <div className="chip">
                <span className="chip__ic">
                  <svg viewBox="0 0 24 24"><use href="#s-spark" /></svg>
                </span>
                <span>
                  <b>Finance Flow Desktop</b>
                  <small>Windows 10 / 11 · v2.4.0</small>
                </span>
              </div>
            </figure>
          </div>

          {/* Column E */}
          <div className="collage__col col-e">
            <figure className="look look--xl tab-r overflow-hidden relative group" style={{ '--plate': 'var(--c2)' }}>
              <img
                src={hero.collageE1}
                alt="Android Mobile Billing & POS"
                className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
              <div className="chip">
                <span className="chip__ic">
                  <svg viewBox="0 0 24 24"><use href="#s-spark" /></svg>
                </span>
                <span>
                  <b>{COMPANY_INFO.shortName} Mobile POS</b>
                  <small>Android APK · Handheld Sync</small>
                </span>
              </div>
            </figure>

            <figure className="look look--sm overflow-hidden relative group" style={{ '--plate': 'var(--c5)' }}>
              <img
                src={hero.collageE2}
                alt="Barcode Scanner and Hardware Terminal"
                className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="chip">
                <span className="chip__ic">
                  <svg viewBox="0 0 24 24"><use href="#s-spark" /></svg>
                </span>
                <span>
                  <b>Hardware Interop</b>
                  <small>Direct USB / Serial print</small>
                </span>
              </div>
            </figure>
          </div>
        </div>

        {/* Full-Screen Pin Flood Scene */}
        <div className="flood" data-flood>
          <div className="art g-night" role="img" aria-label={`${COMPANY_INFO.name} offline retail billing software video demonstration`}>
            <video
              src={hero.videoUrl || "/demo-video.mp4?v=2"}
              autoPlay
              muted
              loop
              playsInline
              className="full object-cover"
              style={{ filter: 'brightness(0.65)' }}
            />
          </div>
          <div className="wrap flood__text">
            <div>
              <span className="eyebrow" style={{ color: 'var(--c3)' }}>Offline Architecture • Zero Latency</span>
              <h2 className="flood__title" style={{ marginTop: '8px' }}>
                {hero.floodTitle || `${COMPANY_INFO.name}. Built for Indian business counters.`}
              </h2>
            </div>
            <div>
              <p className="flood__lead">
                {hero.floodLead || 'Local SQLite databases, instant 0.2s keystrokes, and plug-and-play thermal printer drivers. Total operational autonomy, no matter what happens to the internet.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
