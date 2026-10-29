import React, { useState } from 'react';
import { PRODUCTS, LANDING_PAGE_SECTIONS } from '../data/companyData';
import { Clock, Download } from 'lucide-react';

export default function Products({ onSelectProduct, _onDownloadProduct }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'desktop' | 'mobile'
  const sec = LANDING_PAGE_SECTIONS?.productsSection || {};

  // Build software items dynamically from PRODUCTS state
  const softwareItems = PRODUCTS.map((p, idx) => {
    const isWindows = (p.platform || '').toLowerCase().includes('windows');
    const isAndroid = (p.platform || '').toLowerCase().includes('android');

    return {
      id: p.id,
      product: p,
      num: String(idx + 1).padStart(2, '0'),
      name: p.name,
      category: p.category,
      platformTag: p.platform,
      isWindows,
      isAndroid,
      version: p.version || 'v1.0.0 Stable',
      size: p.size || '25.0 MB',
      downloadLabel: isWindows && isAndroid ? 'Download EXE / APK' : isAndroid ? 'Download APK' : 'Download EXE',
      logo: p.logo || '/finance-flow-logo.png',
      tagline: p.tagline || p.description,
      chips: Array.isArray(p.chips) && p.chips.length > 0 ? p.chips : [
        '⚡ 100% Offline',
        isAndroid ? '📱 Mobile Ready' : '🖥️ Desktop Native',
        '🔒 Encrypted Storage'
      ],
      isComingSoon: p.isComingSoon !== false,
      downloadUrl: p.downloadUrl || ''
    };
  });

  // Additional 6th suite package: Hardware Drivers
  const allItems = [
    ...softwareItems,
    {
      id: "hardware-drivers",
      product: null,
      num: "06",
      name: "Hardware Drivers & Interop",
      category: "Hardware Suite",
      platformTag: "Universal Drivers",
      isWindows: true,
      isAndroid: true,
      version: "v3.0.0 ESC/POS",
      size: "Universal Package",
      downloadLabel: "Download Drivers",
      logo: "/card-hardware-printer.png",
      tagline: "Plug-and-play drivers and direct communication protocols for standard 58mm/80mm thermal receipt printers, USB cash drawers, and barcode scanners.",
      chips: ["🔌 Plug-and-Play USB", "📶 Bluetooth 5.0 ESC/POS", "⚡ Zero Driver Lag"],
      isComingSoon: true,
      downloadUrl: ""
    }
  ];

  const filteredItems = allItems.filter((item) => {
    if (filter === 'desktop') return item.isWindows;
    if (filter === 'mobile') return item.isAndroid;
    return true;
  });

  return (
    <section id="applications" className="py-20 border-b border-[var(--line)]" data-kind="gallery" data-section="gallery">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="sec-head">
          <div>
            <span className="eyebrow">{sec.eyebrow || "Production Software Blueprint"}</span>
            <h2 className="h2" style={{ marginTop: '16px' }}>
              {sec.headline ? (
                sec.headline
              ) : (
                <>Inside our software <em className="s">ecosystem</em></>
              )}
            </h2>
          </div>
          <div className="sec-head__side">
            <p className="lead">
              {sec.lead || "Five proprietary systems engineered for retail counters, distributors, travel consultancies, and enterprises requiring 100% offline resilience."}
            </p>

            {/* Filter Toggle Pills */}
            <div className="toggle" role="group" aria-label="Filter software">
              <button
                className="toggle__btn"
                type="button"
                aria-pressed={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All Software ({allItems.length})
              </button>
              <button
                className="toggle__btn"
                type="button"
                aria-pressed={filter === 'desktop'}
                onClick={() => setFilter('desktop')}
              >
                Windows Desktop ({allItems.filter(i => i.isWindows).length})
              </button>
              <button
                className="toggle__btn"
                type="button"
                aria-pressed={filter === 'mobile'}
                onClick={() => setFilter('mobile')}
              >
                Android Mobile ({allItems.filter(i => i.isAndroid).length})
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Helper Subtitle */}
        <div className="mt-6 mb-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] font-medium">
          <span className="w-2 h-2 rounded-full bg-[var(--c1)] animate-pulse" />
          <span>
            {filter === 'all' && 'Showing all production software systems & hardware driver suite'}
            {filter === 'desktop' && 'Showing Windows Desktop billing suites, POS engines & printer drivers'}
            {filter === 'mobile' && 'Showing Android Mobile applications, partner portals & mobile POS solutions'}
          </span>
        </div>

        {/* Software Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredItems.map((item) => {
            const hasProduct = Boolean(item.product);
            const isLiveDownload = !item.isComingSoon && Boolean(item.downloadUrl);

            return (
              <article
                key={item.id}
                className="p-6 sm:p-7 rounded-[var(--r)] bg-[var(--soft)] border border-[var(--line)] hover:border-[var(--c1)]/70 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
              >
                {/* Top Bar: Domain / ID & 100% Offline Status */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">
                    {item.num} · {item.platformTag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    100% Offline
                  </span>
                </div>

                {/* Hero Visual Logo Stage */}
                <div className="w-full h-44 sm:h-48 rounded-2xl bg-white border border-[var(--line)] flex flex-col items-center justify-center p-5 relative mb-6 shadow-xs group-hover:shadow-md transition-shadow overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="max-h-24 sm:max-h-28 w-auto max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-xs"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/finance-flow-logo.png';
                      }}
                    />
                  </div>
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono font-bold text-[var(--muted)]">
                    {item.version}
                  </span>
                </div>

                {/* Card Information */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight">
                        {item.name}
                      </h3>
                      <span className="text-[11px] font-mono font-bold text-[var(--c1)] uppercase tracking-wider shrink-0">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--ink)]/80 leading-relaxed mt-2.5">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Technical Capability Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--line)]/60 my-5">
                    {item.chips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]/85"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => hasProduct && onSelectProduct(item.product)}
                      className="flex-1 px-3 py-2.5 rounded-full border border-[var(--ink)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors text-center cursor-pointer"
                    >
                      <span>Specs & Features</span>
                      <span className="ml-1" aria-hidden="true">→</span>
                    </button>

                    {isLiveDownload ? (
                      <a
                        href={item.downloadUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2.5 rounded-full bg-[var(--c1)] hover:bg-[#d64b22] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        title={`Download official ${item.name} installer`}
                      >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.downloadLabel || 'Download'}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="flex-1 px-3 py-2.5 rounded-full bg-[var(--bg)] border border-[var(--c1)]/30 text-[var(--c1)] text-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-default shadow-xs"
                        title="Official download link will be available soon"
                      >
                        <Clock className="w-3.5 h-3.5 text-[var(--c1)] shrink-0" />
                        <span>Coming Soon</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA to Software Releases Center */}
        <div className="text-center mt-16">
          <a className="btn" href="#download">
            <span>View All Packages in Release Center</span>
            <svg className="btn__arr" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 9 9 3M4 3h5v5" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
