import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Download, 
  Clock, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Monitor, 
  Smartphone, 
  Sparkles,
  Layers,
  FileCode2
} from 'lucide-react';
import { PRODUCTS, COMPANY_INFO } from '../data/companyData';

export default function DownloadsPage({ 
  onBackToHome, 
  onSelectProduct, 
  onDownloadApp 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all'); // 'all' | 'windows' | 'android'

  // Filter software packages based on live search query and platform tab
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Platform filter
      const platformLower = (product.platform || '').toLowerCase();
      const isWindows = platformLower.includes('windows') || platformLower.includes('desktop');
      const isAndroid = platformLower.includes('android') || platformLower.includes('mobile');

      if (platformFilter === 'windows' && !isWindows) return false;
      if (platformFilter === 'android' && !isAndroid) return false;

      // Text search filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const name = (product.name || '').toLowerCase();
      const tagline = (product.tagline || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const version = (product.version || '').toLowerCase();
      const platform = (product.platform || '').toLowerCase();
      const highlights = (product.highlights || []).join(' ').toLowerCase();
      const chips = (product.chips || []).join(' ').toLowerCase();

      return (
        name.includes(q) ||
        tagline.includes(q) ||
        desc.includes(q) ||
        category.includes(q) ||
        version.includes(q) ||
        platform.includes(q) ||
        highlights.includes(q) ||
        chips.includes(q)
      );
    });
  }, [searchQuery, platformFilter]);

  const totalCount = PRODUCTS.length;
  const windowsCount = PRODUCTS.filter(p => (p.platform || '').toLowerCase().includes('windows')).length;
  const androidCount = PRODUCTS.filter(p => (p.platform || '').toLowerCase().includes('android')).length;

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

          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Official Release Center</span>
          </div>
        </div>

        {/* Page Hero Header */}
        <header className="mb-12">
          <span className="eyebrow">Production Software Blueprint</span>
          <h1 className="h2" style={{ marginTop: '14px' }}>
            All Software & <em className="s">Application Packages</em>
          </h1>
          <p className="lead" style={{ maxWidth: '46em', marginTop: '12px' }}>
            Direct access to production installers, desktop GST billing systems, and native Android utility suites. 
            All software is engineered with 100% offline resilience and zero cloud latency.
          </p>
        </header>

        {/* Search & Platform Filter Toolbar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[var(--soft)] border border-[var(--line)] mb-10 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Live Search Input Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search software packages (e.g. Finance Flow, Billing, GST, Android, Yatra, Offline)..."
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

            {/* Platform Toggle Pills */}
            <div className="toggle shrink-0" role="group" aria-label="Filter software by platform">
              <button
                type="button"
                className="toggle__btn"
                aria-pressed={platformFilter === 'all'}
                onClick={() => setPlatformFilter('all')}
              >
                All Packages ({totalCount})
              </button>
              <button
                type="button"
                className="toggle__btn flex items-center gap-1.5"
                aria-pressed={platformFilter === 'windows'}
                onClick={() => setPlatformFilter('windows')}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Windows ({windowsCount})</span>
              </button>
              <button
                type="button"
                className="toggle__btn flex items-center gap-1.5"
                aria-pressed={platformFilter === 'android'}
                onClick={() => setPlatformFilter('android')}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android ({androidCount})</span>
              </button>
            </div>

          </div>

          {/* Results Counter & Active Filter Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--line)] text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--c1)]" />
              <span>
                Showing <strong>{filteredProducts.length}</strong> of {totalCount} verified software packages
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified SHA-256
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-blue-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Offline Ready
              </span>
            </div>
          </div>
        </div>

        {/* Software Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredProducts.map((product) => {
              const isWindows = (product.platform || '').toLowerCase().includes('windows');
              const isAndroid = (product.platform || '').toLowerCase().includes('android');
              const isFeatured = product.id === 'finance-flow';

              return (
                <article
                  key={product.id}
                  className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl group ${
                    isFeatured 
                      ? 'bg-[var(--dark)] text-[var(--bg)] border-amber-400/30' 
                      : 'bg-[var(--soft)] border-[var(--line)] text-[var(--ink)]'
                  }`}
                >
                  {/* Card Top Meta */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                        isFeatured ? 'text-amber-300' : 'text-[var(--c1)]'
                      }`}>
                        {product.platform || 'Cross-Platform'} • {product.version || 'v1.0.0'}
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                        isFeatured 
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                          : 'bg-black/5 text-[var(--ink)] font-bold'
                      }`}>
                        {product.size || 'Release Package'}
                      </span>
                    </div>

                    {/* Logo & Title */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-[var(--line)] p-1.5 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                        <img
                          src={product.logo || '/finance-flow-logo.png'}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/finance-flow-logo.png';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-bold text-lg sm:text-xl truncate ${
                            isFeatured ? 'text-white' : 'text-[var(--ink)]'
                          }`}>
                            {product.name}
                          </h3>
                          {isFeatured && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--c1)] text-white uppercase tracking-wider shadow-xs">
                              Flagship
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 font-medium ${
                          isFeatured ? 'text-stone-300' : 'text-[var(--muted)]'
                        }`}>
                          {product.category || 'Business Suite'}
                        </p>
                      </div>
                    </div>

                    {/* Tagline / Brief Description */}
                    <p className={`text-xs leading-relaxed line-clamp-3 mb-4 ${
                      isFeatured ? 'text-stone-300' : 'text-[var(--muted)]'
                    }`}>
                      {product.tagline || product.description}
                    </p>

                    {/* Feature Highlights List */}
                    {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                      <ul className="space-y-1.5 pt-3 border-t border-[var(--line)] text-xs mb-4">
                        {product.highlights.slice(0, 3).map((hl, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                              isFeatured ? 'bg-amber-400' : 'bg-[var(--c1)]'
                            }`} />
                            <span className={`line-clamp-1 ${isFeatured ? 'text-stone-200' : 'text-[var(--ink)]'}`}>
                              {hl}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(product.chips || ['100% Offline', isAndroid ? 'Android Ready' : 'Windows Native']).map((chip, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            isFeatured
                              ? 'bg-white/10 text-stone-200 border border-white/10'
                              : 'bg-black/5 text-[var(--muted)]'
                          }`}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className={`p-4 sm:p-5 pt-3 border-t mt-auto flex flex-col gap-2 ${
                    isFeatured ? 'border-white/10 bg-black/20' : 'border-[var(--line)] bg-[var(--bg)]/50'
                  }`}>
                    {/* Primary Status: Coming Soon (No live download link) */}
                    <button
                      type="button"
                      disabled
                      className={`coming-soon-btn w-full h-11 justify-center text-xs uppercase tracking-wider cursor-default ${
                        isFeatured ? '!bg-amber-400 !text-stone-950 !border-amber-400 opacity-95' : 'opacity-90'
                      }`}
                      title={`Official ${product.name} release in preparation`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Coming Soon ({isAndroid ? 'Android APK' : 'Windows EXE'})</span>
                    </button>

                    {/* Secondary Specs Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className={`spec-btn w-full justify-center group ${
                        isFeatured ? '!text-stone-200 !border-stone-400/40 hover:!text-white' : ''
                      }`}
                    >
                      <span>View Specifications & Features</span>
                      <span className="spec-btn__arr ml-1 inline-block transition-transform group-hover:translate-x-1 group-active:translate-x-1">→</span>
                    </button>
                  </div>

                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-20 text-center rounded-2xl bg-[var(--soft)] border border-[var(--line)] p-8">
            <FileCode2 className="w-12 h-12 mx-auto text-[var(--muted)] mb-4" />
            <h3 className="text-xl font-bold mb-2">No software packages found</h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md mx-auto mb-6">
              We couldn't find any packages matching "{searchQuery}". Try searching for another keyword like "Billing", "Finance", "Android", or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPlatformFilter('all');
              }}
              className="btn btn--sm"
            >
              <span>Reset Search & Filters</span>
            </button>
          </div>
        )}

        {/* Security & Offline Verification Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-sm sm:text-base flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Looking for Custom Enterprise Software?</span>
            </h4>
            <p className="text-xs text-[var(--muted)] max-w-xl">
              We build tailor-made offline Windows desktop billing systems, thermal receipt printer setups, 
              and native handheld Android apps configured to your exact workflow.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToHome}
            className="btn btn--line btn--sm shrink-0 whitespace-nowrap"
          >
            <span>Speak with Engineering Desk →</span>
          </button>
        </div>

      </div>
    </div>
  );
}

