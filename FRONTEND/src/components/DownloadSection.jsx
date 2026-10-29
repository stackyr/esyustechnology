import React, { useState } from 'react';
import { PRODUCTS, LANDING_PAGE_SECTIONS } from '../data/companyData';
import { Clock, Download } from 'lucide-react';

export default function DownloadSection({ _onDownloadApp }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'windows' | 'android'
  const sec = LANDING_PAGE_SECTIONS?.downloadSection || {};

  const filteredApps = PRODUCTS.filter((app) => {
    if (filter === 'windows') return (app.platform || '').toLowerCase().includes('windows');
    if (filter === 'android') return (app.platform || '').toLowerCase().includes('android');
    return true;
  });

  return (
    <section id="download" className="pricing" data-sec="download">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="sec-head">
          <div>
            <span className="eyebrow">{sec.eyebrow || "Section 10 • Application Releases"}</span>
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
                All Packages ({PRODUCTS.length})
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
          </div>
        </div>

        {/* Download Plans Grid */}
        <div className="plans">
          {filteredApps.map((app) => {
            const isFeatured = app.id === 'finance-flow';
            const isAndroid = (app.platform || '').toLowerCase().includes('android');
            const isLiveDownload = app.isComingSoon === false && Boolean(app.downloadUrl);

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

                  <div className="flex items-center gap-3 mb-1">
                    {isFeatured ? (
                      <div className="w-11 h-11 rounded-2xl bg-white border border-white/40 p-1.5 flex items-center justify-center shadow-lg shadow-black/40 shrink-0">
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
                      <h3 className={`plan__name font-bold ${isFeatured ? 'text-white text-xl sm:text-2xl' : ''}`}>
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
                    <span><strong>Hardware Ready:</strong> {isAndroid ? 'Mobile Bluetooth printer sync' : 'Thermal & barcode scanner ready'}</span>
                  </li>
                </ul>

                {/* CTA Button: Dynamic Live Download Link OR Coming Soon */}
                <div className="w-full mt-auto pt-3">
                  {isFeatured ? (
                    isLiveDownload ? (
                      <>
                        <a
                          href={app.downloadUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-12 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--c1)] to-[#e86a48] hover:from-[#e86a48] hover:to-[var(--c1)] text-white shadow-lg shadow-[var(--c1)]/30 border border-white/20 transition-all duration-300 cursor-pointer"
                          title={`Download ${app.name} (${app.downloadFile})`}
                        >
                          <Download className="w-4 h-4 mr-1 text-white shrink-0" />
                          <span className="text-white font-bold tracking-wide">
                            Download {app.downloadFile || 'Installer (.EXE)'}
                          </span>
                        </a>
                        <div className="text-[11px] text-center font-mono mt-2 truncate text-amber-200/80 font-medium">
                          Verified Official Installer • {app.size}
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled
                          className="w-full h-12 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--c1)] to-[#e86a48] text-white shadow-lg shadow-[var(--c1)]/30 border border-white/20 transition-all duration-300 cursor-default"
                          title="Official download link will be available soon"
                        >
                          <Clock className="w-4 h-4 mr-1 text-white shrink-0 animate-pulse" />
                          <span className="text-white font-bold tracking-wide">
                            Coming Soon (Windows .EXE)
                          </span>
                        </button>
                        <div className="text-[11px] text-center font-mono mt-2 truncate text-amber-200/80 font-medium">
                          Official release in preparation • {app.size}
                        </div>
                      </>
                    )
                  ) : (
                    isLiveDownload ? (
                      <>
                        <a
                          href={app.downloadUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-12 rounded-full font-bold text-[13.5px] flex items-center justify-center gap-2 bg-[var(--c1)] hover:bg-[#d64b22] text-white shadow-md cursor-pointer transition-colors"
                          title={`Download ${app.name} (${app.downloadFile})`}
                        >
                          <Download className="w-4 h-4 mr-1 shrink-0 text-white" />
                          <span className="truncate font-bold text-[13.5px] text-white">
                            Download {isAndroid ? 'APK' : 'EXE'} ({app.size})
                          </span>
                        </a>
                        <div className="text-[11px] text-center font-mono mt-2 truncate text-[var(--muted)]">
                          Verified Official Package • {app.size}
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled
                          className="w-full h-12 rounded-full font-bold text-[13.5px] flex items-center justify-center gap-2 bg-white text-[var(--c1)] border border-[var(--c1)]/30 shadow-xs cursor-default hover:bg-stone-50 transition-colors"
                          title="Official download link will be available soon"
                        >
                          <Clock className="w-4 h-4 mr-1 shrink-0 text-[var(--c1)]" />
                          <span className="truncate font-bold text-[13.5px] text-[var(--c1)]">
                            Coming Soon ({isAndroid ? 'Android .APK' : 'Windows .EXE'})
                          </span>
                        </button>
                        <div className="text-[11px] text-center font-mono mt-2 truncate text-[var(--muted)]">
                          Official release in preparation • {app.size}
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

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
