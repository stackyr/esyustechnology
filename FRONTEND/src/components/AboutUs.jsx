import React from 'react';
import { useData } from '../context/DataContext';

export default function AboutUs({ onContactClick, dataVersion = 0 }) {
  const { brand, landingPage } = useData();
  const COMPANY_INFO = brand || {};
  const about = landingPage?.about || {};

  const DEFAULT_DOMAINS = [
    {
      num: "01",
      tag: "Domain 01",
      title: "Desktop Application Systems",
      desc: "Robust Windows software built for offline resilience, high-speed point of sale, and instant invoice printing.",
      badge1: "Enterprise Grade",
      badge2: "Production Ready"
    },
    {
      num: "02",
      tag: "Domain 02",
      title: "Website & Web Applications",
      desc: "Modern corporate websites, cloud web apps, customer portals, and internal management platforms.",
      badge1: "Enterprise Grade",
      badge2: "Production Ready"
    },
    {
      num: "03",
      tag: "Domain 03",
      title: "Android Mobile Development",
      desc: "Native Android applications optimized for mobility, offline SQLite caching, and handheld hardware support.",
      badge1: "Enterprise Grade",
      badge2: "Production Ready"
    },
    {
      num: "04",
      tag: "Domain 04",
      title: "Custom Software Solutions",
      desc: "Bespoke database architectures, automated workflows, and tailored enterprise software engineered to your exact requirements.",
      badge1: "Enterprise Grade",
      badge2: "Production Ready"
    }
  ];

  const domains = (Array.isArray(about.domains) && about.domains.length > 0)
    ? about.domains
    : DEFAULT_DOMAINS;

  return (
    <section id="about" className="intro" data-kind="intro" data-section="intro">
      <div className="wrap">
        {/* Top: Iconic Quote and Feature Callout */}
        <div className="intro__in">
          <figure className="voice">
            <svg className="voice__mark" viewBox="0 0 28 22" aria-hidden="true">
              <path fill="currentColor" d="M0 22V12.6C0 5.5 3.4 1.3 10.2 0l1.1 2.6C7.6 3.9 5.9 6.4 5.8 10H11v12H0Zm16.6 0V12.6c0-7.1 3.4-11.3 10.2-12.6L28 2.6c-3.7 1.3-5.4 3.8-5.5 7.4h5.2v12H16.6Z" />
            </svg>
            <blockquote className="voice__text">
              <p>
                "{about.founderQuote || 'We bridge the gap between heavy enterprise needs and practical everyday reliability with offline-first desktop software and modern digital systems that never stop working.'}"
              </p>
            </blockquote>
            <figcaption className="voice__who flex items-center gap-3">
              <img
                src={about.founderPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"}
                alt={COMPANY_INFO.founder}
                className="w-10 h-10 rounded-full object-cover border-2 border-[var(--c1)] shrink-0"
              />
              <div>
                <span className="sign font-bold block">{COMPANY_INFO.founder}</span>
                <span className="text-xs text-stone-500 block">— Founder & CEO, {COMPANY_INFO.name}</span>
              </div>
            </figcaption>
          </figure>

          <a className="feature" href="#applications">
            <span className="feature__row">
              <span className="feature__num">{COMPANY_INFO.stats?.[1]?.value || "5+"}</span>
              <span className="feature__label">Software applications ready for deployment</span>
              <span className="ibtn ibtn--bare">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              </span>
            </span>
            <span className="feature__title">
              Finance Flow Desktop GST Billing & Android App Suite
            </span>
          </a>
        </div>

        {/* Corporate Profile Card & 4 Domains */}
        <div className="mt-20 pt-16 border-t border-[var(--line)]">
          <div className="sec-head">
            <h2 className="h2">
              {about.headline ? (
                about.headline
              ) : (
                <>Building dependable software for <em className="s">real-world businesses</em></>
              )}
            </h2>
            <div className="sec-head__side">
              <p className="lead">
                {about.lead || `${COMPANY_INFO.name} was established to solve one critical problem: businesses losing hours of productivity to cloud server outages and complicated tools.`}
              </p>
              <div className="p-3.5 rounded-xl bg-[var(--soft)] border-l-4 border-l-[var(--c1)] border border-[var(--line)] space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--c1)] font-semibold block">
                  Core Engineering Motive
                </span>
                <p className="text-xs sm:text-sm text-[var(--ink)] font-medium italic leading-relaxed">
                  “{about.motive || 'Transforming complex enterprise technology into simple, intuitive, and easy-to-use software that empowers everyday business.'}”
                </p>
              </div>
              <button className="link" onClick={onContactClick}>
                Speak with our engineering desk →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-10">
            {/* Left Corporate Highlight with Subtle Office Background */}
            <div className="lg:col-span-5 rounded-[var(--r)] p-5 sm:p-8 bg-[var(--dark)] text-[var(--bg)] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <img
                src={about.officePhoto || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900"}
                alt={`${COMPANY_INFO.name} Team Office`}
                className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/90 to-[var(--dark)]/70 pointer-events-none" />

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--c3)]">Corporate Profile</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                    Est. {COMPANY_INFO.establishmentDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[var(--bg)]">{COMPANY_INFO.name}</h3>
                  <p className="text-xs text-stone-400 mt-1">{COMPANY_INFO.domain}</p>
                </div>

                <p className="text-sm leading-relaxed text-stone-300">
                  {about.corporateBio || "Headquartered in Sector V, Kolkata, we engineer reliable Windows desktop software, native Android applications, and enterprise web solutions engineered with 100% offline autonomy."}
                </p>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Founder</span>
                    <strong className="text-sm text-[var(--bg)] block mt-0.5">{COMPANY_INFO.founder}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Co-Founder</span>
                    <strong className="text-sm text-[var(--bg)] block mt-0.5">{COMPANY_INFO.coFounder}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400 relative z-10">
                <span className="text-xs text-stone-400 leading-relaxed max-w-xs">{COMPANY_INFO.address || 'Sector V, Kolkata, WB 700091'}</span>
                <button
                  onClick={onContactClick}
                  className="w-full sm:w-auto h-10 px-5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-[var(--c3)] hover:bg-[#e5a835] text-[var(--ink)] shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <span>Contact Desk</span>
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right: 4 Domains Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {domains.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[var(--r)] bg-[var(--soft)] border border-[var(--line)] flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--c1)]">
                      {item.tag || `Domain ${item.num || String(idx + 1).padStart(2, '0')}`}
                    </span>
                    <h4 className="text-lg font-bold mt-2 text-[var(--ink)]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--c5)]">{item.badge1 || "Enterprise Grade"}</span>
                    <span className="text-stone-400">✓ {item.badge2 || "Production Ready"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
