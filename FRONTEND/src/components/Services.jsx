import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Clock } from 'lucide-react';

const FALLBACK_PRESETS = [
  {
    id: "desktop-dev",
    tone: "tone-1",
    image: "/finance-flow-logo.png",
    isLogo: true,
    meta: "Windows 10 / 11 · 100% Offline Autonomy",
    uiTop: "Runtime: Bare-Metal Win32 / Electron",
    uiTitle: "Finance Flow Desktop Suite",
    row1: ["Startup Latency", "<0.2 seconds instant"],
    row2: ["Local Storage", "Encrypted SQLite DB"],
    row3: ["Hardware Support", "Thermal 2\"/3\" & Laser A4"]
  },
  {
    id: "website-dev",
    tone: "tone-2",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900",
    meta: "Next.js / Vite / Tailwind · 100 Lighthouse",
    uiTop: "Frontend Architecture",
    uiTitle: "Modern Responsive Corporate Web",
    row1: ["Core Web Vitals", "Sub-second LCP & 100 Speed"],
    row2: ["Search Engine SEO", "Pre-indexed schema & meta"],
    row3: ["Security", "SSL & static edge protection"]
  },
  {
    id: "web-app-dev",
    tone: "tone-3",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900",
    meta: "Role-Based Portals · Real-time Dashboards",
    uiTop: "Fullstack Architecture",
    uiTitle: "Enterprise Management Dashboard",
    row1: ["Security", "Role-Based Access (RBAC)"],
    row2: ["Data Sync", "RESTful & GraphQL APIs"],
    row3: ["Reliability", "99.99% Cloud Uptime"]
  },
  {
    id: "android-dev",
    tone: "tone-4",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=900",
    meta: "Kotlin / Java · Bluetooth Thermal Printers",
    uiTop: "Mobile Android Jetpack",
    uiTitle: "Handheld Billing & Field Apps",
    row1: ["Hardware Connectivity", "Bluetooth Thermal Receipt"],
    row2: ["Offline Database", "Room SQLite Storage"],
    row3: ["OS Compatibility", "Android 8.0 through 14+"]
  },
  {
    id: "custom-dev",
    tone: "tone-5",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=900",
    meta: "Bespoke Database & Workflow Automation",
    uiTop: "Custom Architecture",
    uiTitle: "Tailor-Made Operations Suite",
    row1: ["Integration", "Custom Hardware & Legacy DBs"],
    row2: ["Codebase", "100% Tailored to Your Business"],
    row3: ["Support", "Dedicated Engineering Desk"]
  }
];

export default function Services({ onSelectService, onEnquireService, dataVersion = 0 }) {
  const { services: liveServices, landingPage } = useData();
  const srvSec = landingPage?.servicesSection || {};
  const currentServices = Array.isArray(liveServices) ? liveServices : [];

  // Build live service cards dynamically from liveServices array
  const activeServices = useMemo(() => {
    return currentServices.map((srv, idx) => {
      // Find matching preset by ID or index
      const matchedPreset = FALLBACK_PRESETS.find(p => p.id === srv.id) ||
                            FALLBACK_PRESETS[idx % FALLBACK_PRESETS.length];

      const tone = matchedPreset.tone || `tone-${(idx % 5) + 1}`;
      const num = String(idx + 1).padStart(2, '0');
      const isLogo = srv.id === 'desktop-dev' || Boolean(matchedPreset.isLogo && !srv.image);
      const image = srv.image || matchedPreset.image;

      // Extract features for live UI diagnostics box
      const f = srv.features || [];
      const row1 = f[0] ? ['Feature 1', f[0].slice(0, 32)] : matchedPreset.row1;
      const row2 = f[1] ? ['Feature 2', f[1].slice(0, 32)] : matchedPreset.row2;
      const row3 = f[2] ? ['Feature 3', f[2].slice(0, 32)] : matchedPreset.row3;

      const meta = srv.badge 
        ? `${srv.badge} · ${(srv.techStack || []).slice(0, 3).join(', ') || matchedPreset.meta}`
        : matchedPreset.meta;

      // Clean, punchy short tab title engineered so all 6 tabs fit seamlessly without overlap
      let shortTab = srv.shortTitle;
      if (!shortTab) {
        if (/website/i.test(srv.title)) shortTab = 'Website Dev';
        else if (/web application|web app/i.test(srv.title)) shortTab = 'Web Apps';
        else if (/mobile/i.test(srv.title)) shortTab = 'Mobile Apps';
        else if (/android/i.test(srv.title)) shortTab = 'Android Dev';
        else if (/desktop/i.test(srv.title)) shortTab = 'Desktop Apps';
        else if (/custom/i.test(srv.title)) shortTab = 'Custom Software';
        else {
          shortTab = srv.title
            .replace(/ Application Development/i, ' Apps')
            .replace(/ Software Development/i, ' Software')
            .replace(/ Development/i, ' Dev');
        }
      }

      const uiTitle = matchedPreset.uiTitle || (srv.badge ? `${srv.badge} Architecture` : 'Core Architecture');

      return {
        service: srv,
        id: srv.id || `service-${idx}`,
        num,
        tab: srv.title,
        shortTab,
        tone,
        image,
        isLogo,
        meta,
        lead: srv.shortDesc || srv.fullDesc || '',
        uiTop: srv.badge || matchedPreset.uiTop,
        uiTitle,
        row1,
        row2,
        row3,
        isComingSoon: Boolean(srv.isComingSoon)
      };
    });
  }, [currentServices, dataVersion]);

  return (
    <section id="services" className="coll" data-kind="collections" data-section="services">
      {/* Section Header */}
      <div className="wrap sec-head">
        <h2 className="h2">
          {srvSec.headline ? srvSec.headline : <>Five ways we engineer <em className="s">business reliability</em></>}
        </h2>
        <div className="sec-head__side">
          <p className="lead">
            {srvSec.lead || "From offline Windows billing software and thermal receipt printing to cloud enterprise applications, we build robust systems with zero downtime."}
          </p>
          <a className="link" href="#applications">
            Explore our ready-to-use software suite →
          </a>
        </div>
      </div>

      {/* Stacked Interactive Folders (100% Database Driven) */}
      <div className="wrap folders" data-folders data-component="service-folders">
        {activeServices.map((item, idx) => {
          const srv = item.service;
          return (
            <article
              key={item.id}
              className={`folder ${item.tone}`}
              data-item={item.id}
              style={{
                '--i': idx,
                '--p': activeServices.length > 1 ? (idx / (activeServices.length - 1)).toFixed(3) : 0
              }}
            >
              <div className="folder__in">
                <div className="folder__tab">
                  <span className="folder__tab-num">{item.num}</span>
                  <span className="folder__tab-title">{item.shortTab}</span>
                  {item.isComingSoon && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 border border-amber-500/30 ml-2">
                      Coming Soon
                    </span>
                  )}
                </div>

                <div className="folder__body">
                  {/* Left Column: Details & Actions */}
                  <div className="folder__copy">
                    <div>
                      <span className="folder__meta">{item.meta}</span>
                      <h3 className="folder__h3">{item.tab}</h3>
                      <p className="folder__lead">{item.lead}</p>
                    </div>

                    <div className="folder__actions">
                      <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => onSelectService(srv)}
                      >
                        <span>View specifications</span>
                        <svg className="btn__arr" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                          <path d="M3 9 9 3M4 3h5v5" />
                        </svg>
                      </button>

                      {item.isComingSoon ? (
                        <div className="coming-soon-btn btn--sm cursor-default opacity-85 select-none inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Coming Soon</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn--line btn--sm"
                          onClick={() => onEnquireService(item.tab)}
                        >
                          Enquire for project
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: High-Res Real Photography & Floating Live Diagnostics UI */}
                  <figure className={`folder__photo overflow-hidden relative group ${item.isLogo ? 'folder__photo--logo' : ''}`}>
                    {item.isLogo ? (
                      <div className="w-full h-auto sm:h-full flex flex-col justify-between p-3 sm:p-5 bg-white relative">
                        {/* Top: Crisp Finance Flow Brand Logo Card */}
                        <div className="flex-1 flex flex-col items-center justify-center p-2.5 sm:p-4 bg-gradient-to-b from-stone-50/90 to-white rounded-xl border border-stone-200/70 mb-2 sm:mb-3 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                          <div className="w-full flex items-center justify-between mb-1 sm:mb-1.5 px-0.5">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--c1)] animate-pulse" />
                              Official Flagship Software
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
                              v2.4.0
                            </span>
                          </div>
                          <div className="w-full flex items-center justify-center py-1.5 sm:py-3">
                            <img
                              src={item.image}
                              alt="Finance Flow"
                              className="h-11 sm:h-16 md:h-18 w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
                            />
                          </div>
                        </div>

                        {/* Bottom: Live Engine Diagnostics Card */}
                        <div className="ui ui--inline">
                          <div className="ui__top">
                            <span>{item.uiTop}</span>
                            <span className="ui__live">Ready</span>
                          </div>
                          <p className="ui__title">{item.uiTitle}</p>
                          <div className="ui__row">
                            <span>{item.row1[0]}</span>
                            <span>{item.row1[1]}</span>
                          </div>
                          <div className="ui__row">
                            <span>{item.row2[0]}</span>
                            <span>{item.row2[1]}</span>
                          </div>
                          <div className="ui__row">
                            <span>{item.row3[0]}</span>
                            <span>{item.row3[1]}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={item.image}
                          alt={item.tab}
                          className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                        
                        <div className="ui">
                          <div className="ui__top">
                            <span>{item.uiTop}</span>
                            <span className="ui__live">Ready</span>
                          </div>
                          <p className="ui__title">{item.uiTitle}</p>
                          <div className="ui__row">
                            <span>{item.row1[0]}</span>
                            <span>{item.row1[1]}</span>
                          </div>
                          <div className="ui__row">
                            <span>{item.row2[0]}</span>
                            <span>{item.row2[1]}</span>
                          </div>
                          <div className="ui__row">
                            <span>{item.row3[0]}</span>
                            <span>{item.row3[1]}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </figure>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
