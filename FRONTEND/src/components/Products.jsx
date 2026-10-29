import React, { useState } from 'react';
import { PRODUCTS } from '../data/companyData';
import { Clock } from 'lucide-react';

export default function Products({ onSelectProduct, _onDownloadProduct }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'desktop' | 'mobile'

  // Items configuration combining software products and hardware integration
  const allItems = [
    {
      id: "finance-flow",
      product: PRODUCTS.find((p) => p.id === 'finance-flow') || PRODUCTS[0],
      num: "01",
      name: "Finance Flow",
      category: "Desktop Billing",
      platformTag: "Windows 10 / 11",
      isWindows: true,
      isAndroid: false,
      version: "v2.4.0 Stable",
      size: "48.2 MB",
      downloadLabel: "Download EXE",
      logo: "/finance-flow-logo.png",
      tagline: "Premier offline-first desktop billing software with instant GST invoices, barcode lookup, and zero cloud dependency.",
      chips: ["⚡ 0.2s Keystrokes", "🔒 Encrypted SQLite DB", "🖨️ Thermal 2\"/3\" & A4"]
    },
    {
      id: "finance-flow-lite",
      product: PRODUCTS.find((p) => p.id === 'finance-flow-lite') || PRODUCTS[1],
      num: "02",
      name: "Finance Flow Lite",
      category: "Lightweight POS",
      platformTag: "Windows & Android",
      isWindows: true,
      isAndroid: true,
      version: "v1.2.1 Stable",
      size: "18.5 MB",
      downloadLabel: "Download EXE / APK",
      logo: "/finance-flow-lite-logo-transparent.png",
      tagline: "Ultra-compact, low-resource billing app designed for small counters, pop-up stalls, and Android tablets.",
      chips: ["⚡ <100MB Memory", "📱 Android Tablet POS", "🧾 Offline Quick Touch"]
    },
    {
      id: "finance-flow-flash",
      product: PRODUCTS.find((p) => p.id === 'finance-flow-flash') || PRODUCTS[2],
      num: "03",
      name: "Finance Flow Flash",
      category: "High-Speed POS",
      platformTag: "Windows Touch POS",
      isWindows: true,
      isAndroid: false,
      version: "v1.0.4 Rapid",
      size: "22.0 MB",
      downloadLabel: "Download EXE",
      logo: "/finance-flow-flash-logo.png",
      tagline: "Split-second point-of-sale software engineered for high-footfall checkout lanes, supermarkets, and queue busting.",
      chips: ["⚡ 0.1s Barcode Scan", "🛒 Supermarket Lanes", "💳 Multi-Split Payment"]
    },
    {
      id: "bharat-yatra-sathi",
      product: PRODUCTS.find((p) => p.id === 'bharat-yatra-sathi') || PRODUCTS[3],
      num: "04",
      name: "Bharat Yatra Sathi",
      category: "Android Application",
      platformTag: "Android 8.0+",
      isWindows: false,
      isAndroid: true,
      version: "v1.1.0 Mobile",
      size: "24.8 MB",
      downloadLabel: "Download APK",
      logo: "/bharat-yatra-sathi-logo.png",
      tagline: "Smart travel, highway mobility, and pilgrimage companion app designed for explorers and drivers in India with 100% offline maps.",
      chips: ["🧭 100% Offline Maps", "🚗 Driver & Route Assist", "🛕 Temple Timings"]
    },
    {
      id: "bharat-yatra-sathi-partner",
      product: PRODUCTS.find((p) => p.id === 'bharat-yatra-sathi-partner') || PRODUCTS[4],
      num: "05",
      name: "Bharat Yatra Sathi Partner",
      category: "Partner & Vendor Suite",
      platformTag: "Android 8.0+ & Web",
      isWindows: false,
      isAndroid: true,
      version: "v1.0.2 Partner",
      size: "21.4 MB",
      downloadLabel: "Download APK",
      logo: "/bharat-yatra-sathi-partner-logo.png",
      tagline: "Dedicated business portal & mobile POS for verified tour guides, hotel vendors, pilgrimage homestays, and transport operators.",
      chips: ["🤝 Vendor Bookings", "🎫 Offline QR Passes", "💰 Direct Payout Ledger"]
    },
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
      chips: ["🔌 Plug-and-Play USB", "📶 Bluetooth 5.0 ESC/POS", "⚡ Zero Driver Lag"]
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
            <span className="eyebrow">Production Software Blueprint</span>
            <h2 className="h2" style={{ marginTop: '16px' }}>
              Inside our software <em className="s">ecosystem</em>
            </h2>
          </div>
          <div className="sec-head__side">
            <p className="lead">
              Five proprietary systems engineered for retail counters, distributors, travel consultancies, and enterprises requiring 100% offline resilience.
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
                Windows Desktop (4)
              </button>
              <button
                className="toggle__btn"
                type="button"
                aria-pressed={filter === 'mobile'}
                onClick={() => setFilter('mobile')}
              >
                Android Mobile (4)
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Helper Subtitle */}
        <div className="mt-6 mb-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] font-medium">
          <span className="w-2 h-2 rounded-full bg-[var(--c1)] animate-pulse" />
          <span>
            {filter === 'all' && 'Showing all 5 production software systems & hardware driver suite'}
            {filter === 'desktop' && 'Showing Windows Desktop billing suites, POS engines & printer drivers'}
            {filter === 'mobile' && 'Showing Android Mobile applications, partner portals & mobile POS solutions'}
          </span>
        </div>

        {/* Software Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredItems.map((item) => {
            const hasProduct = Boolean(item.product);

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

                    <button
                      type="button"
                      className="flex-1 px-3 py-2.5 rounded-full bg-[var(--bg)] border border-[var(--c1)]/30 text-[var(--c1)] text-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-default shadow-xs"
                      title="Official download link will be available soon"
                    >
                      <Clock className="w-3.5 h-3.5 text-[var(--c1)] shrink-0" />
                      <span>Coming Soon</span>
                    </button>
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
