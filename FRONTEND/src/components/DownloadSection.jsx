import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Clock, Download, Search, X, ExternalLink } from 'lucide-react';

export default function DownloadSection({ onDownloadApp, onOpenDownloadsPage, dataVersion = 0 }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'windows' | 'android'
  const [searchQuery, setSearchQuery] = useState('');
  const { products: liveProducts, landingPage } = useData();
  const sec = landingPage?.downloadSection || {};
  const currentApps = Array.isArray(liveProducts) ? liveProducts : [];

  const filteredApps = useMemo(() => {
    return currentApps.filter((app) => {
      if (filter === 'windows' && !(app.platform || '').toLowerCase().includes('windows')) return false;
      if (filter === 'android' && !(app.platform || '').toLowerCase().includes('android')) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match = (app.name || '').toLowerCase().includes(q) ||
                      (app.tagline || '').toLowerCase().includes(q) ||
                      (app.description || '').toLowerCase().includes(q) ||
                      (app.platform || '').toLowerCase().includes(q) ||
                      (app.highlights || []).join(' ').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [filter, searchQuery, currentApps, dataVersion]);

  return (
    <section id="download" className="pricing" data-sec="download">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="sec-head">
          <div>
            <span className="eyebrow">{(sec.eyebrow ? sec.eyebrow.replace(/^Section\s+\d+\s*•?\s*/i, '') : '') || "Application Releases"}</span>
            <h2 className="h2" style={{ marginTop: '16px' }}>
              {sec.headline ? (
                sec.headline
              ) : (
                <>Installers built for <em className="s">offline endurance.</em></>
              )}
            </h2>
          </div>
          <div className="sec-head__side">
            <p className="lead">
              {sec.lead || "Direct access to official installers and production releases. Public download links are currently in preparation — packages will be enabled for direct download as soon as release links go live."}
            </p>

            {/* Filter Toggle */}
            <div className="toggle" role="tablist" aria-label="Filter packages by operating system">
              <button
                type="button"
                className="toggle__btn"
                role="tab"
                aria-pressed={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All Packages ({currentApps.length})
              </button>
              <button
                type="button"
                className="toggle__btn"
                role="tab"
                aria-pressed={filter === 'windows'}
                onClick={() => setFilter('windows')}
              >
                Windows (.EXE)
              </button>
              <button
                type="button"
                className="toggle__btn"
                role="tab"
                aria-pressed={filter === 'android'}
                onClick={() => setFilter('android')}
              >
                Android (.APK)
              </button>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages by name, GST, platform..."
                className="w-full pl-9 pr-8 py-2 rounded-full border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--c1)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[var(--muted)] hover:text-[var(--ink)]"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Download Plans Grid */}
        {currentApps.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-[var(--soft)] border border-[var(--line)] p-8 my-6 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--c1)] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[var(--muted)] font-mono">Loading installer packages live from database...</p>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="plans">
          {filteredApps.map((app) => {
            const isFeatured = app.id === 'finance-flow';
            const isAndroid = (app.platform || '').toLowerCase().includes('android');

            return (
              <div
                key={app.id}
                className={`plan ${isFeatured ? 'plan--main' : ''}`}
              >
                {/* Main Plan Featured Tab */}
                {isFeatured && (
                  <div className="plan__tab text-amber-300 font-semibold flex items-center gap-2 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    <span>Most Popular Offline Suite</span>
                  </div>
                )}

                {/* Header Meta */}
                <div style={{ width: '100%' }}>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-xs font-mono uppercase tracking-wider ${isFeatured ? 'text-amber-200/90 font-semibold' : 'text-[var(--muted)]'}`}>
                      {app.platform} • Build {app.version}
                    </span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      isFeatured ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-black/5 text-[var(--c1)]'
                    }`}>
                      {app.size}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 mb-1">
                    {isFeatured ? (
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white border border-white/40 p-1 flex items-center justify-center shadow-lg shadow-black/40 shrink-0">
                        <img
                          src="/finance-flow-emblem.png"
                          alt={app.name}
                          className="w-full h-full object-contain filter drop-shadow-xs"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/finance-flow-logo.png';
                          }}
                        />
                      </div>
                    ) : app.logo ? (
                      <div className="w-8 h-8 rounded-xl bg-white border border-[var(--line)] p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                        <img
                          src={app.logo}
                          alt={app.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/finance-flow-logo.png';
                          }}
                        />
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`plan__name font-bold ${isFeatured ? 'text-white text-lg sm:text-2xl' : ''}`}>
                        {app.name}
                      </h3>
                      {isFeatured && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--c1)] text-white uppercase tracking-wider shrink-0 shadow-xs">
                          Flagship
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price / Licensing Badge */}
                <div className="plan__price">
                  <span className="plan__num">Free</span>
                  <span className="plan__per">/ Evaluation & Offline Deployment</span>
                </div>

                {/* Short Description */}
                <p className="plan__text">
                  {app.description}
                </p>

                {/* Feature Bullet Points */}
                <ul className="plan__list">
                  <li>
                    <span><strong>Installer Package:</strong> {app.downloadFile}</span>
                  </li>
                  <li>
                    <span><strong>Architecture:</strong> {isAndroid ? 'ARM64 / Universal APK' : 'x64 (Windows 10 & 11)'}</span>
                  </li>
                  <li>
                    <span><strong>Offline Storage:</strong> Local SQLite encrypted storage</span>
                  </li>
                  <li>
                    <span><strong>Hardware Ready:</strong> {isAndroid ? 'Mobile Bluetooth printer sync' : 'Thermal receipt printer ready'}</span>
                  </li>
                </ul>

                {/* CTA Button: Active Download vs Coming Soon */}
                <div className="w-full mt-auto pt-2 sm:pt-3">
                  {!app.isComingSoon && Boolean(app.downloadUrl) ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (onDownloadApp) onDownloadApp(app);
                        }}
                        className={`w-full h-11 sm:h-12 rounded-full font-bold text-[13px] sm:text-[14px] flex items-center justify-center gap-2 text-white shadow-lg transition-all duration-300 cursor-pointer hover:shadow-xl active:scale-95 ${
                          isFeatured
                            ? 'bg-gradient-to-r from-[var(--c1)] to-[#e86a48] shadow-[var(--c1)]/30'
                            : 'bg-[var(--c1)] hover:bg-[#d65a2f]'
                        }`}
                        title={`Download official ${app.name} package`}
                      >
                        <Download className="w-4 h-4 mr-1 text-white shrink-0" />
                        <span className="text-white font-bold tracking-wide">
                          Download ({isAndroid ? 'Android .APK' : 'Windows .EXE'})
                        </span>
                      </button>
                      <div className="text-[11px] text-center font-mono mt-1.5 truncate text-[var(--muted)]">
                        Official release • {app.size}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`w-full h-11 sm:h-12 rounded-full font-bold text-[13px] sm:text-[13.5px] flex items-center justify-center gap-2 cursor-default select-none ${
                          isFeatured
                            ? 'bg-white/10 text-amber-300 border border-amber-400/30'
                            : 'coming-soon-btn opacity-85'
                        }`}
                        title={`Official ${app.name} release in preparation`}
                      >
                        <Clock className="w-4 h-4 mr-1 shrink-0" />
                        <span className="truncate font-bold text-[13px] sm:text-[13.5px]">
                          Coming Soon ({isAndroid ? 'Android .APK' : 'Windows .EXE'})
                        </span>
                      </div>
                      <div className="text-[11px] text-center font-mono mt-1.5 truncate text-[var(--muted)]">
                        Official release in preparation • {app.size}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="py-12 text-center rounded-2xl bg-[var(--soft)] border border-[var(--line)] p-6 my-6">
            <p className="text-sm font-semibold text-[var(--ink)]">No software packages matched "{searchQuery}"</p>
            <p className="text-xs text-[var(--muted)] mt-1">Try clearing your search query or switching the platform filter.</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setFilter('all'); }}
              className="mt-3 text-xs font-semibold text-[var(--c1)] underline cursor-pointer"
            >
              Reset search & filters
            </button>
          </div>
        )}

        {/* Dedicated Page Link CTA */}
        {onOpenDownloadsPage && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={onOpenDownloadsPage}
              className="btn btn--line btn--sm cursor-pointer inline-flex items-center gap-2"
            >
              <span>Open Dedicated Full Releases & Search Center</span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--c1)]" />
            </button>
          </div>
        )}

        {/* Installation Guidelines & System Compatibility Notice */}
        <div
          className="mt-14 p-6 sm:p-8 rounded-2xl border border-[var(--line)] bg-[var(--soft)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-[var(--line)] flex items-center justify-center shrink-0 text-[var(--c1)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[var(--ink)]">
                System Compatibility & Digital Safety Guarantee
              </h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed max-w-2xl">
                {sec.notice || "Every installer is scanned and clean of malware. Windows packages include all runtime SQLite drivers for isolated offline operation. No internet connection or cloud account setup is ever required."}
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg bg-white border border-[var(--line)] hover:border-[var(--ink)] text-[var(--ink)] transition-colors whitespace-nowrap"
          >
            Need Setup Assistance? Contact Desk →
          </a>
        </div>

      </div>
    </section>
  );
}
