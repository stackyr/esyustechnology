import React, { useState } from 'react';
import { PRODUCTS } from '../data/companyData';
import { Clock } from 'lucide-react';

export default function DownloadSection({ _onDownloadApp }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'windows' | 'android'

  const filteredApps = PRODUCTS.filter((app) => {
    if (filter === 'windows') return app.platform.toLowerCase().includes('windows');
    if (filter === 'android') return app.platform.toLowerCase().includes('android');
    return true;
  });

  return (
    <section id="download" className="pricing" data-sec="download">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="sec-head">
          <div>
            <span className="eyebrow">Section 10 • Application Releases</span>
            <h2 className="h2" style={{ marginTop: '16px' }}>
              Installers built for <em className="s">offline endurance.</em>
            </h2>
          </div>
          <div className="sec-head__side">
            <p className="lead">
              Direct access to official installers and production releases. Public download links are currently in preparation — packages will be enabled for direct download as soon as release links go live.
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
            const isAndroid = app.platform.toLowerCase().includes('android');

            return (
              <div
                key={app.id}
                className={`plan ${isFeatured ? 'plan--main' : ''}`}
              >
                {/* Main Plan Featured Tab */}
                {isFeatured && (
                  <div className="plan__tab">
                    Most Popular Offline Suite
                  </div>
                )}

                {/* Header Meta */}
                <div style={{ width: '100%' }}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                      {app.platform} • Build {app.version}
                    </span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-black/5 text-[var(--c1)]">
                      {app.size}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {app.logo && (
                      <div className="w-8 h-8 rounded-xl bg-white border border-[var(--line)] p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                        <img src={app.logo} alt={app.name} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <h3 className="plan__name">
                      {app.name}
                    </h3>
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

                {/* Coming Soon CTA Button */}
                <div className="w-full mt-auto pt-2">
                  <button
                    type="button"
                    disabled
                    className="btn btn--line w-full justify-center text-center shadow-xs cursor-default border border-[var(--c1)]/30 text-[var(--c1)] bg-white"
                    style={{ width: '100%', height: '48px', padding: '0 14px' }}
                    title="Official download link will be available soon"
                  >
                    <Clock className="w-4 h-4 mr-2 shrink-0 text-[var(--c1)]" />
                    <span className="truncate font-bold text-[13.5px]">
                      Coming Soon ({isAndroid ? 'Android .APK' : 'Windows .EXE'})
                    </span>
                  </button>
                  <div className="text-[11px] text-center font-mono mt-2 truncate text-[var(--muted)]">
                    Official release in preparation • {app.size}
                  </div>
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
                Every installer is scanned and clean of malware. Windows packages include all runtime SQLite drivers for isolated offline operation. No internet connection or cloud account setup is ever required.
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
