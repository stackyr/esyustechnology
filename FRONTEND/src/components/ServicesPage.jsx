import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  ArrowLeft,
  Wrench,
  Sparkles,
  Layers,
  Code,
  Clock,
  CheckCircle2,
  Cpu,
  Monitor,
  Smartphone,
  Globe,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function ServicesPage({
  onBackToHome,
  onSelectService,
  onEnquireService,
  dataVersion = 0,
  onRefresh,
  isRefreshing = false
}) {
  const { services: liveServices, landingPage, reloadAll } = useData();
  const srvSec = landingPage?.servicesSection || {};
  const currentServices = Array.isArray(liveServices) ? liveServices : [];

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'desktop' | 'web' | 'android' | 'custom'

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter services based on live search and category tabs
  const filteredServices = useMemo(() => {
    return currentServices.filter((srv) => {
      // Category filter matching
      const titleLower = (srv.title || '').toLowerCase();
      const badgeLower = (srv.badge || '').toLowerCase();
      const idLower = (srv.id || '').toLowerCase();
      const descLower = (srv.shortDesc || srv.fullDesc || '').toLowerCase();
      const techLower = (srv.techStack || []).join(' ').toLowerCase();

      if (categoryFilter === 'desktop') {
        const isDesktop = titleLower.includes('desktop') || badgeLower.includes('desktop') || idLower.includes('desktop') || techLower.includes('electron') || techLower.includes('sqlite');
        if (!isDesktop) return false;
      } else if (categoryFilter === 'web') {
        const isWeb = titleLower.includes('web') || titleLower.includes('website') || badgeLower.includes('web') || techLower.includes('react') || techLower.includes('node');
        if (!isWeb) return false;
      } else if (categoryFilter === 'android') {
        const isAndroid = titleLower.includes('android') || titleLower.includes('mobile') || badgeLower.includes('android') || techLower.includes('kotlin');
        if (!isAndroid) return false;
      } else if (categoryFilter === 'custom') {
        const isCustom = titleLower.includes('custom') || badgeLower.includes('custom') || idLower.includes('custom') || descLower.includes('bespoke') || descLower.includes('tailor');
        if (!isCustom) return false;
      }

      // Search query matching
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const features = (srv.features || []).join(' ').toLowerCase();

      return (
        titleLower.includes(q) ||
        badgeLower.includes(q) ||
        descLower.includes(q) ||
        techLower.includes(q) ||
        features.includes(q)
      );
    });
  }, [searchQuery, categoryFilter, currentServices, dataVersion]);

  // Counts for filter pills
  const totalCount = useMemo(() => currentServices.length, [currentServices, dataVersion]);
  const desktopCount = useMemo(() => {
    return currentServices.filter(s => {
      const text = `${s.title} ${s.badge} ${s.id} ${(s.techStack || []).join(' ')}`.toLowerCase();
      return text.includes('desktop') || text.includes('electron') || text.includes('sqlite');
    }).length;
  }, [currentServices, dataVersion]);

  const webCount = useMemo(() => {
    return currentServices.filter(s => {
      const text = `${s.title} ${s.badge} ${(s.techStack || []).join(' ')}`.toLowerCase();
      return text.includes('web') || text.includes('website') || text.includes('react') || text.includes('cloud');
    }).length;
  }, [currentServices, dataVersion]);

  const androidCount = useMemo(() => {
    return currentServices.filter(s => {
      const text = `${s.title} ${s.badge} ${(s.techStack || []).join(' ')}`.toLowerCase();
      return text.includes('android') || text.includes('mobile') || text.includes('kotlin');
    }).length;
  }, [currentServices, dataVersion]);

  const customCount = useMemo(() => {
    return currentServices.filter(s => {
      const text = `${s.title} ${s.badge} ${s.id} ${s.shortDesc || ''}`.toLowerCase();
      return text.includes('custom') || text.includes('bespoke') || text.includes('tailor');
    }).length;
  }, [currentServices, dataVersion]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-24 pb-20">
      <div className="wrap">
        
        {/* Top Breadcrumb & Return to Landing Page */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-[var(--c1)]" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                title="Refresh latest services catalog from database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--c1)]' : 'text-[var(--muted)]'}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh Services'}</span>
              </button>
            )}

            <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
              <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              <span>{isRefreshing ? 'Syncing Live Database...' : 'Engineering Catalog Live'}</span>
            </div>
          </div>
        </div>

        {/* Page Hero Header */}
        <header className="mb-12">
          <span className="eyebrow">
            Engineering Capabilities &amp; Bespoke Architecture
          </span>
          <h1 className="h2" style={{ marginTop: '14px' }}>
            {srvSec.headline ? (
              srvSec.headline
            ) : (
              <>Software Engineering &amp; <em className="s">Bespoke Architecture</em></>
            )}
          </h1>
          <p className="lead" style={{ maxWidth: '48em', marginTop: '12px' }}>
            {srvSec.lead || "From 100% offline Windows desktop billing systems and thermal printer drivers to scalable responsive web portals and mobile field applications. Explore our complete spectrum of engineering capabilities."}
          </p>
        </header>

        {/* Search & Category Filter Toolbar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[var(--soft)] border border-[var(--line)] mb-10 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Live Search Input Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. Desktop, SQLite, Thermal, Web, React, Android, Custom, Offline)..."
                className="w-full pl-10 pr-10 py-3 rounded-full border border-[var(--line)] bg-[var(--bg)] text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--c1)] shadow-inner transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Toggle Pills */}
            <div className="toggle shrink-0 flex-wrap" role="group" aria-label="Filter services by category">
              <button
                type="button"
                className="toggle__btn"
                aria-pressed={categoryFilter === 'all'}
                onClick={() => setCategoryFilter('all')}
              >
                All Services ({totalCount})
              </button>
              <button
                type="button"
                className="toggle__btn flex items-center gap-1.5"
                aria-pressed={categoryFilter === 'desktop'}
                onClick={() => setCategoryFilter('desktop')}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop ({desktopCount})</span>
              </button>
              <button
                type="button"
                className="toggle__btn flex items-center gap-1.5"
                aria-pressed={categoryFilter === 'web'}
                onClick={() => setCategoryFilter('web')}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Web ({webCount})</span>
              </button>
              <button
                type="button"
                className="toggle__btn flex items-center gap-1.5"
                aria-pressed={categoryFilter === 'android'}
                onClick={() => setCategoryFilter('android')}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android ({androidCount})</span>
              </button>
              <button
                type="button"
                className="toggle__btn flex items-center gap-1.5"
                aria-pressed={categoryFilter === 'custom'}
                onClick={() => setCategoryFilter('custom')}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Custom ({customCount})</span>
              </button>
            </div>

          </div>

          {/* Results Counter & Capabilities Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--line)] text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--c1)]" />
              <span>
                Showing <strong>{filteredServices.length}</strong> of {totalCount} engineering services
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Offline Resilience
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-blue-600">
                <Code className="w-3.5 h-3.5" /> Custom Hardware Integration
              </span>
            </div>
          </div>
        </div>

        {/* Services Cards Grid */}
        {currentServices.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white border border-[var(--line)] p-8 my-6 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-full border-2 border-[var(--c1)] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[var(--muted)] font-mono">Loading engineering capabilities live from database...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredServices.map((srv, idx) => {
              const num = String(idx + 1).padStart(2, '0');
              const isComingSoon = Boolean(srv.isComingSoon);
              const features = Array.isArray(srv.features) ? srv.features : [];
              const techStack = Array.isArray(srv.techStack) ? srv.techStack : [];

              return (
                <article
                  key={srv.id || idx}
                  className="rounded-3xl border border-[var(--line)] bg-white transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:border-[var(--c1)]/50 group"
                >
                  {/* Card Content Top */}
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Header meta badge & service number */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-[var(--soft)] text-[var(--c1)] border border-[var(--line)]">
                          {srv.badge || 'Engineering'}
                        </span>
                        {isComingSoon && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Coming Soon</span>
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-mono font-bold text-[var(--muted)] group-hover:text-[var(--c1)] transition-colors">
                        #{num}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight group-hover:text-[var(--c1)] transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--muted)] mt-2 leading-relaxed">
                        {srv.shortDesc || srv.fullDesc}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    {techStack.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-mono uppercase text-[var(--muted)] font-semibold block mb-1.5">
                          Technology Stack
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[var(--soft)] text-[var(--ink)]/80 border border-[var(--line)]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features Checklist */}
                    {features.length > 0 && (
                      <div className="pt-3 border-t border-[var(--line)] space-y-2">
                        <span className="text-[10px] font-mono uppercase text-[var(--muted)] font-semibold block">
                          Key Capabilities &amp; Architecture
                        </span>
                        <ul className="space-y-1.5 text-xs text-[var(--ink)]/90">
                          {features.slice(0, 4).map((f, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-5 sm:p-6 bg-[var(--soft)] border-t border-[var(--line)] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectService(srv)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)] hover:text-[var(--c1)] transition-colors cursor-pointer group/btn"
                    >
                      <span>Full Specifications</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>

                    {isComingSoon ? (
                      <span className="text-[11px] font-mono text-amber-800 font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
                        In Pipeline
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onEnquireService(srv.title)}
                        className="px-3.5 py-1.5 rounded-xl bg-[var(--c1)] hover:bg-[#d64b22] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Enquire</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-[var(--line)] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--soft)] text-[var(--muted)] flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--ink)]">No services match your search</h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Try searching with different terms like "desktop", "billing", "thermal", or select "All Services".
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-[var(--ink)] text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Bespoke Architecture Consultation Banner */}
        <div className="mt-16 p-6 sm:p-10 rounded-3xl bg-[var(--dark)] text-[var(--bg)] border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold px-2 py-0.5 rounded-full bg-white/10">
              Custom Engineering Desk
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Have specific hardware or an offline workflow requirement?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              We design tailor-made billing station setups, thermal printer firmware links, and localized databases. Consult directly with our engineering team.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onEnquireService('Custom Software & Hardware Architecture')}
              className="px-5 py-3 rounded-full bg-[var(--c1)] hover:bg-[#d64b22] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contact Engineering Desk</span>
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="px-4 py-3 rounded-full border border-white/20 text-stone-200 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Back to Home</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
