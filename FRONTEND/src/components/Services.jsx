import React from 'react';
import { SERVICES, LANDING_PAGE_SECTIONS } from '../data/companyData';
import { Clock } from 'lucide-react';

export default function Services({ onSelectService, onEnquireService }) {
  const serviceFolders = [
    {
      id: "desktop-dev",
      serviceIndex: 4, // Desktop Dev in SERVICES
      tab: "Application Development Systems",
      tone: "tone-1",
      image: "/finance-flow-logo.png",
      isLogo: true,
      num: "01",
      meta: "Windows 10 / 11 · 100% Offline Autonomy",
      lead: "High-performance Windows desktop applications, inventory suites, and management systems that work 100% offline with zero cloud lag.",
      uiTop: "Runtime: Bare-Metal Win32 / Electron",
      uiTitle: "Finance Flow Desktop Suite",
      row1: ["Startup Latency", "<0.2 seconds instant"],
      row2: ["Local Storage", "Encrypted SQLite DB"],
      row3: ["Hardware Support", "Thermal 2\"/3\" & Laser A4"]
    },
    {
      id: "website-dev",
      serviceIndex: 0, // Website Dev in SERVICES
      tab: "Website Development",
      tone: "tone-2",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900",
      num: "02",
      meta: "Next.js / Vite / Tailwind · 100 Lighthouse",
      lead: "High-speed, modern, SEO-optimized business websites that establish brand credibility and load instantaneously on all devices.",
      uiTop: "Frontend Architecture",
      uiTitle: "Modern Responsive Corporate Web",
      row1: ["Core Web Vitals", "Sub-second LCP & 100 Speed"],
      row2: ["Search Engine SEO", "Pre-indexed schema & meta"],
      row3: ["Security", "SSL & static edge protection"]
    },
    {
      id: "web-app-dev",
      serviceIndex: 1, // Web App Dev in SERVICES
      tab: "Web Apps & Cloud Portals",
      tone: "tone-3",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900",
      num: "03",
      meta: "Role-Based Portals · Real-time Dashboards",
      lead: "Scalable, dynamic cloud web apps and enterprise portals tailored to customer management and business workflows.",
      uiTop: "Fullstack Architecture",
      uiTitle: "Enterprise Management Dashboard",
      row1: ["Security", "Role-Based Access (RBAC)"],
      row2: ["Data Sync", "RESTful & GraphQL APIs"],
      row3: ["Reliability", "99.99% Cloud Uptime"]
    },
    {
      id: "android-dev",
      serviceIndex: 3, // Android Dev in SERVICES
      tab: "Android Mobile POS",
      tone: "tone-4",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=900",
      num: "04",
      meta: "Kotlin / Java · Bluetooth Thermal Printers",
      lead: "Specialized native Android applications optimized for hardware, sensors, Bluetooth thermal receipt printers, and offline caching.",
      uiTop: "Mobile Android Jetpack",
      uiTitle: "Handheld Billing & Field Apps",
      row1: ["Hardware Connectivity", "Bluetooth ESC/POS Thermal"],
      row2: ["Offline Database", "Room SQLite Storage"],
      row3: ["OS Compatibility", "Android 8.0 through 14+"]
    },
    {
      id: "custom-dev",
      serviceIndex: 5, // Custom Dev in SERVICES
      tab: "Custom Enterprise Software",
      tone: "tone-5",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=900",
      num: "05",
      meta: "Bespoke Database & Workflow Automation",
      lead: "Bespoke software engineered around your exact operational workflows, legacy data migrations, and custom billing rules.",
      uiTop: "Custom Architecture",
      uiTitle: "Tailor-Made Operations Suite",
      row1: ["Integration", "Custom Hardware & Legacy DBs"],
      row2: ["Codebase", "100% Tailored to Your Business"],
      row3: ["Support", "Dedicated Engineering Desk"]
    }
  ];

  return (
    <section id="services" className="coll" data-kind="collections" data-section="services">
      {/* Section Header */}
      {(() => {
        const srvSec = LANDING_PAGE_SECTIONS?.servicesSection || {};
        return (
          <div className="wrap sec-head">
            <h2 className="h2">
              {srvSec.headline ? srvSec.headline : <>Five ways we engineer <em className="s">business reliability</em></>}
            </h2>
            <div className="sec-head__side">
              <p className="lead">
                {srvSec.lead || "From offline Windows billing software and thermal printer POS to cloud enterprise applications, we build robust systems with zero downtime."}
              </p>
              <a className="link" href="#applications">
                Explore our ready-to-use software suite →
              </a>
            </div>
          </div>
        );
      })()}

      {/* Stacked Interactive Folders */}
      <div className="wrap folders" data-folders data-component="service-folders">
        {serviceFolders.map((item) => {
          const serviceObj = SERVICES[item.serviceIndex] || SERVICES[0];
          return (
            <article
              key={item.id}
              className={`folder ${item.tone}`}
              data-item={item.id}
            >
              <div className="folder__in">
                <div className="folder__tab">
                  <span className="folder__tab-num">{item.num}</span>
                  <span className="folder__tab-title">{item.tab}</span>
                </div>

                <div className="folder__body">
                  {/* Left Column: Details & Actions */}
                  <div className="folder__copy">
                    <div>
                      <span className="folder__meta">{item.meta}</span>
                      <h3 className="folder__h3">{serviceObj.title}</h3>
                      <p className="folder__lead">{item.lead}</p>
                    </div>

                    <div className="folder__actions">
                      <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => onSelectService(serviceObj)}
                      >
                        <span>View specifications</span>
                        <svg className="btn__arr" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                          <path d="M3 9 9 3M4 3h5v5" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="btn btn--line btn--sm"
                        onClick={() => onEnquireService(serviceObj.title)}
                      >
                        Enquire for project
                      </button>
                    </div>
                  </div>

                  {/* Right Column: High-Res Real Photography & Floating Live Diagnostics UI */}
                  <figure className={`folder__photo overflow-hidden relative group ${item.isLogo ? 'folder__photo--logo' : ''}`}>
                    {item.isLogo ? (
                      <div className="w-full h-full flex flex-col justify-between p-3.5 sm:p-5 bg-white relative">
                        {/* Top: Crisp Finance Flow Brand Logo Card */}
                        <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-stone-50/90 to-white rounded-xl border border-stone-200/70 mb-3 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                          <div className="w-full flex items-center justify-between mb-1.5 px-0.5">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--c1)] animate-pulse" />
                              Official Flagship Software
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
                              v2.4.0
                            </span>
                          </div>
                          <div className="w-full flex items-center justify-center py-2 sm:py-3">
                            <img
                              src={item.image}
                              alt="Finance Flow"
                              className="h-14 sm:h-16 md:h-18 w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
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
