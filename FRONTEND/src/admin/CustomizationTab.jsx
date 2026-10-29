import React, { useState, useEffect } from 'react';
import {
  Save,
  Building,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Link as LinkIcon,
  Sliders,
  Layers,
  FileText,
  MessageSquare,
  Check,
  Undo2
} from 'lucide-react';
import { COMPANY_INFO, LANDING_PAGE_SECTIONS } from '../data/companyData';

export default function CustomizationTab({
  brand,
  landingPage,
  onSaveBrand,
  onSaveLandingPage,
  onResetDefaults,
  isSaving
}) {
  const [activeSubTab, setActiveSubTab] = useState('brand');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Brand state
  const [brandData, setBrandData] = useState(() => ({
    name: brand?.name || COMPANY_INFO.name,
    shortName: brand?.shortName || COMPANY_INFO.shortName,
    domain: brand?.domain || COMPANY_INFO.domain,
    tagline: brand?.tagline || COMPANY_INFO.tagline,
    slogan: brand?.slogan || COMPANY_INFO.slogan,
    founder: brand?.founder || COMPANY_INFO.founder,
    coFounder: brand?.coFounder || COMPANY_INFO.coFounder,
    establishmentDate: brand?.establishmentDate || COMPANY_INFO.establishmentDate,
    email: brand?.email || COMPANY_INFO.email,
    supportEmail: brand?.supportEmail || COMPANY_INFO.supportEmail,
    phone: brand?.phone || COMPANY_INFO.phone,
    address: brand?.address || COMPANY_INFO.address,
    stats: brand?.stats || [...COMPANY_INFO.stats]
  }));

  // Landing page state
  const [pageData, setPageData] = useState(() => ({
    hero: { ...(LANDING_PAGE_SECTIONS?.hero || {}), ...(landingPage?.hero || {}) },
    about: { ...(LANDING_PAGE_SECTIONS?.about || {}), ...(landingPage?.about || {}) },
    featuredProduct: { ...(LANDING_PAGE_SECTIONS?.featuredProduct || {}), ...(landingPage?.featuredProduct || {}) },
    whyChooseUs: {
      headline: landingPage?.whyChooseUs?.headline || LANDING_PAGE_SECTIONS?.whyChooseUs?.headline || '',
      lead: landingPage?.whyChooseUs?.lead || LANDING_PAGE_SECTIONS?.whyChooseUs?.lead || '',
      pillarImages: Array.isArray(landingPage?.whyChooseUs?.pillarImages) && landingPage.whyChooseUs.pillarImages.length === 5
        ? landingPage.whyChooseUs.pillarImages
        : [...(LANDING_PAGE_SECTIONS?.whyChooseUs?.pillarImages || [])]
    },
    contact: { ...(LANDING_PAGE_SECTIONS?.contact || {}), ...(landingPage?.contact || {}) }
  }));

  // Sync when props update
  useEffect(() => {
    if (brand) {
      setBrandData({
        name: brand.name || COMPANY_INFO.name,
        shortName: brand.shortName || COMPANY_INFO.shortName,
        domain: brand.domain || COMPANY_INFO.domain,
        tagline: brand.tagline || COMPANY_INFO.tagline,
        slogan: brand.slogan || COMPANY_INFO.slogan,
        founder: brand.founder || COMPANY_INFO.founder,
        coFounder: brand.coFounder || COMPANY_INFO.coFounder,
        establishmentDate: brand.establishmentDate || COMPANY_INFO.establishmentDate,
        email: brand.email || COMPANY_INFO.email,
        supportEmail: brand.supportEmail || COMPANY_INFO.supportEmail,
        phone: brand.phone || COMPANY_INFO.phone,
        address: brand.address || COMPANY_INFO.address,
        stats: brand.stats || [...COMPANY_INFO.stats]
      });
    }
  }, [brand]);

  useEffect(() => {
    if (landingPage) {
      setPageData({
        hero: { ...(LANDING_PAGE_SECTIONS?.hero || {}), ...(landingPage?.hero || {}) },
        about: { ...(LANDING_PAGE_SECTIONS?.about || {}), ...(landingPage?.about || {}) },
        featuredProduct: { ...(LANDING_PAGE_SECTIONS?.featuredProduct || {}), ...(landingPage?.featuredProduct || {}) },
        whyChooseUs: {
          headline: landingPage?.whyChooseUs?.headline || LANDING_PAGE_SECTIONS?.whyChooseUs?.headline || '',
          lead: landingPage?.whyChooseUs?.lead || LANDING_PAGE_SECTIONS?.whyChooseUs?.lead || '',
          pillarImages: Array.isArray(landingPage?.whyChooseUs?.pillarImages) && landingPage.whyChooseUs.pillarImages.length === 5
            ? landingPage.whyChooseUs.pillarImages
            : [...(LANDING_PAGE_SECTIONS?.whyChooseUs?.pillarImages || [])]
        },
        contact: { ...(LANDING_PAGE_SECTIONS?.contact || {}), ...(landingPage?.contact || {}) }
      });
    }
  }, [landingPage]);

  // Brand updaters
  const handleBrandChange = (field, val) => {
    setBrandData((prev) => ({ ...prev, [field]: val }));
    setSaveSuccess(false);
  };

  const handleStatChange = (idx, field, val) => {
    setBrandData((prev) => {
      const stats = [...(prev.stats || [])];
      if (stats[idx]) {
        stats[idx] = { ...stats[idx], [field]: val };
      }
      return { ...prev, stats };
    });
    setSaveSuccess(false);
  };

  // Landing page updaters
  const handlePageChange = (section, field, val) => {
    setPageData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: val
      }
    }));
    setSaveSuccess(false);
  };

  const handlePillarImageChange = (index, val) => {
    setPageData((prev) => {
      const pillars = [...(prev.whyChooseUs?.pillarImages || [])];
      pillars[index] = val;
      return {
        ...prev,
        whyChooseUs: {
          ...prev.whyChooseUs,
          pillarImages: pillars
        }
      };
    });
    setSaveSuccess(false);
  };

  // Master Save handler
  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    try {
      const promises = [];
      if (onSaveBrand) promises.push(onSaveBrand(brandData));
      if (onSaveLandingPage) promises.push(onSaveLandingPage(pageData));
      await Promise.all(promises);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save customization:', err);
    }
  };

  // Reusable Image URL Input Row with Responsive Preview
  const ImageInputRow = ({ label, hint, value, onChange, placeholder }) => (
    <div className="p-3 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5 truncate">
          <ImageIcon className="w-3.5 h-3.5 text-[var(--c1)] shrink-0" />
          <span className="truncate">{label}</span>
        </label>
        {hint && <span className="text-[10px] text-stone-500 font-mono shrink-0">{hint}</span>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 relative flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex flex-col items-center justify-center text-[9px] text-stone-400 p-1 text-center ${value ? 'hidden' : 'flex'}`}>
            <ImageIcon className="w-4 h-4 opacity-40 mb-0.5" />
            <span>No Image</span>
          </div>
        </div>

        <div className="flex-1 w-full min-w-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus-within:border-[var(--c1)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--c1)]/15 transition-all">
            <LinkIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'https://images.unsplash.com/...'}
              className="w-full min-w-0 bg-transparent text-xs text-stone-900 focus:outline-none font-mono"
            />
          </div>
          <span className="text-[10px] text-stone-500 mt-1 block truncate">
            Paste direct HTTPS image link or local path.
          </span>
        </div>
      </div>
    </div>
  );

  const subTabs = [
    { id: 'brand', label: 'Brand & Identity', icon: Building },
    { id: 'hero', label: 'Hero & Collage', icon: Layers },
    { id: 'about', label: 'About Section', icon: FileText },
    { id: 'featuredProduct', label: 'Featured Product', icon: Sliders },
    { id: 'whyChooseUs', label: 'Why Choose Us', icon: Sparkles },
    { id: 'contactFooter', label: 'Contact & Footer', icon: MessageSquare }
  ];

  return (
    <div className="space-y-5 w-full min-w-0 overflow-x-hidden">
      
      {/* Top Header Card - Clean, Well-Proportioned, 100% Responsive */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--c1)] bg-[var(--c1)]/10 px-2.5 py-0.5 rounded-full">
              Master Website Customizer
            </span>
            <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
              • Live MERN Sync
            </span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-stone-900 truncate">
            Website & Brand Customization
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 max-w-2xl leading-relaxed">
            Customize all brand details, landing page copy, headlines, contact numbers, and image links from one place.
          </p>
        </div>

        {/* Action Buttons: Responsive & Never Overflowing */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto w-full md:w-auto">
          {onResetDefaults && (
            <button
              type="button"
              onClick={onResetDefaults}
              className="flex-1 md:flex-none px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              title="Reset all fields to template defaults"
            >
              <Undo2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-[var(--c1)] hover:bg-[#d65a2f] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 text-xs flex items-center gap-2 animate-fadeIn font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All brand details and landing page sections updated successfully in database!</span>
        </div>
      )}

      {/* Clean Horizontal Sub-Tab Navigation Pills (Scrollable on Mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none border-b border-stone-200 -mx-1 px-1">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--c3)]' : 'text-[var(--c1)]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Panels */}
      <div className="space-y-5 w-full min-w-0">

        {/* ==================================================== */}
        {/* 1. BRAND & IDENTITY */}
        {/* ==================================================== */}
        {activeSubTab === 'brand' && (
          <div className="space-y-5 animate-fadeIn min-w-0">
            
            {/* Identity Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Core Brand Identity</h3>
                  <p className="text-xs text-stone-500">Updates header, footer, modals and metadata site-wide</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">Brand Settings</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-w-0">
                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Company Full Name *
                  </label>
                  <input
                    type="text"
                    value={brandData.name}
                    onChange={(e) => handleBrandChange('name', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-semibold focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Short Name (Navbar/Chips) *
                  </label>
                  <input
                    type="text"
                    value={brandData.shortName}
                    onChange={(e) => handleBrandChange('shortName', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-semibold focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Registered Domain *
                  </label>
                  <input
                    type="text"
                    value={brandData.domain}
                    onChange={(e) => handleBrandChange('domain', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-mono focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Official Tagline
                  </label>
                  <input
                    type="text"
                    value={brandData.tagline}
                    onChange={(e) => handleBrandChange('tagline', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Establishment Date
                  </label>
                  <input
                    type="text"
                    value={brandData.establishmentDate}
                    onChange={(e) => handleBrandChange('establishmentDate', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-mono focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Leadership & Contacts Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Executive Leadership & Contact Desk</h3>
                  <p className="text-xs text-stone-500">Founder details, direct phone line and corporate addresses</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">Desk Contacts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-w-0">
                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Founder & CEO
                  </label>
                  <input
                    type="text"
                    value={brandData.founder}
                    onChange={(e) => handleBrandChange('founder', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-semibold focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Co-Founder & CTO
                  </label>
                  <input
                    type="text"
                    value={brandData.coFounder}
                    onChange={(e) => handleBrandChange('coFounder', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-semibold focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Direct Phone Line
                  </label>
                  <input
                    type="text"
                    value={brandData.phone}
                    onChange={(e) => handleBrandChange('phone', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-mono focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    value={brandData.email}
                    onChange={(e) => handleBrandChange('email', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-mono focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Technical Helpdesk Email
                  </label>
                  <input
                    type="email"
                    value={brandData.supportEmail}
                    onChange={(e) => handleBrandChange('supportEmail', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-mono focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0 sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Headquarters Physical Address
                  </label>
                  <input
                    type="text"
                    value={brandData.address}
                    onChange={(e) => handleBrandChange('address', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Track Record & Metric Proofs</h3>
                  <p className="text-xs text-stone-500">4 key metrics displayed across website cards</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">Proof Stats</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
                {(brandData.stats || []).map((st, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2 min-w-0">
                    <span className="text-[10px] font-mono text-[var(--c1)] font-bold block uppercase">
                      Metric 0{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                      placeholder="e.g. 100%"
                      className="w-full min-w-0 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:border-[var(--c1)]"
                    />
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                      placeholder="Metric label"
                      className="w-full min-w-0 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs text-stone-700 focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 2. HERO & COLLAGE */}
        {/* ==================================================== */}
        {activeSubTab === 'hero' && (
          <div className="space-y-5 animate-fadeIn min-w-0">
            
            {/* Hero Copy */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Hero Banner Headlines</h3>
                  <p className="text-xs text-stone-500">Main opening headline and rotating play ring message</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">Section 01</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 min-w-0">
                <div className="space-y-1 min-w-0 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Hero Main Headline (H1)
                  </label>
                  <input
                    type="text"
                    value={pageData.hero.title || ''}
                    onChange={(e) => handlePageChange('hero', 'title', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-medium focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Rotating Circular Ring Text
                  </label>
                  <input
                    type="text"
                    value={pageData.hero.ringText || ''}
                    onChange={(e) => handlePageChange('hero', 'ringText', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-medium focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Demo Video URL
                  </label>
                  <input
                    type="text"
                    value={pageData.hero.videoUrl || ''}
                    onChange={(e) => handlePageChange('hero', 'videoUrl', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-mono focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Pin Flood Scene Title
                  </label>
                  <input
                    type="text"
                    value={pageData.hero.floodTitle || ''}
                    onChange={(e) => handlePageChange('hero', 'floodTitle', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-medium focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Pin Flood Scene Lead Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={pageData.hero.floodLead || ''}
                    onChange={(e) => handlePageChange('hero', 'floodLead', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Collage 6 Image Links */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Hero 5-Column Collage (6 Image Links)</h3>
                  <p className="text-xs text-stone-500">Floating mosaic image URLs with live previews</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">6 Visuals</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 min-w-0">
                <ImageInputRow
                  label="Col A Top: Retail POS Counter (collageA1)"
                  value={pageData.hero.collageA1}
                  onChange={(v) => handlePageChange('hero', 'collageA1', v)}
                  hint="Left Top Large Plate"
                />

                <ImageInputRow
                  label="Col A Bottom: Thermal Print Receipt (collageA2)"
                  value={pageData.hero.collageA2}
                  onChange={(v) => handlePageChange('hero', 'collageA2', v)}
                  hint="Left Bottom Small Plate"
                />

                <ImageInputRow
                  label="Col B: Supermarket Checkout (collageB)"
                  value={pageData.hero.collageB}
                  onChange={(v) => handlePageChange('hero', 'collageB', v)}
                  hint="Left Middle Tall Plate"
                />

                <ImageInputRow
                  label="Col D: Desktop Billing System (collageD)"
                  value={pageData.hero.collageD}
                  onChange={(v) => handlePageChange('hero', 'collageD', v)}
                  hint="Right Middle Tall Plate"
                />

                <ImageInputRow
                  label="Col E Top: Mobile Android POS (collageE1)"
                  value={pageData.hero.collageE1}
                  onChange={(v) => handlePageChange('hero', 'collageE1', v)}
                  hint="Right Top Large Plate"
                />

                <ImageInputRow
                  label="Col E Bottom: Barcode Scanner Terminal (collageE2)"
                  value={pageData.hero.collageE2}
                  onChange={(v) => handlePageChange('hero', 'collageE2', v)}
                  hint="Right Bottom Small Plate"
                />
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 3. ABOUT SECTION */}
        {/* ==================================================== */}
        {activeSubTab === 'about' && (
          <div className="space-y-5 animate-fadeIn min-w-0">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">About Us Section Copy & Motives</h3>
                  <p className="text-xs text-stone-500">Company story, core mission, and executive quote</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">Section 02</span>
              </div>

              <div className="space-y-3.5 min-w-0">
                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={pageData.about.headline || ''}
                    onChange={(e) => handlePageChange('about', 'headline', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-medium focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Lead Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={pageData.about.lead || ''}
                    onChange={(e) => handlePageChange('about', 'lead', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Core Engineering Motive
                  </label>
                  <textarea
                    rows={2}
                    value={pageData.about.motive || ''}
                    onChange={(e) => handlePageChange('about', 'motive', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Featured Founder Quote
                  </label>
                  <textarea
                    rows={2}
                    value={pageData.about.founderQuote || ''}
                    onChange={(e) => handlePageChange('about', 'founderQuote', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">About Us Visual Assets</h3>
                  <p className="text-xs text-stone-500">Founder avatar & corporate office backdrop link</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">2 Visuals</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 min-w-0">
                <ImageInputRow
                  label="Founder Portrait Photo Link"
                  value={pageData.about.founderPhoto}
                  onChange={(v) => handlePageChange('about', 'founderPhoto', v)}
                  hint="Used in Quote & Top Badge"
                />

                <ImageInputRow
                  label="Office & Team Background Photo Link"
                  value={pageData.about.officePhoto}
                  onChange={(v) => handlePageChange('about', 'officePhoto', v)}
                  hint="Card Background Backdrop"
                />
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 4. FEATURED PRODUCT */}
        {/* ==================================================== */}
        {activeSubTab === 'featuredProduct' && (
          <div className="space-y-5 animate-fadeIn min-w-0">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Featured Product (Finance Flow) Details</h3>
                  <p className="text-xs text-stone-500">Section copy and live bill simulator station backdrop</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">Section 06</span>
              </div>

              <div className="space-y-3.5 min-w-0">
                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={pageData.featuredProduct.headline || ''}
                    onChange={(e) => handlePageChange('featuredProduct', 'headline', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-medium focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Lead Description
                  </label>
                  <textarea
                    rows={2}
                    value={pageData.featuredProduct.lead || ''}
                    onChange={(e) => handlePageChange('featuredProduct', 'lead', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <ImageInputRow
                  label="POS Invoicing Station Background Image Link"
                  value={pageData.featuredProduct.stationImage}
                  onChange={(v) => handlePageChange('featuredProduct', 'stationImage', v)}
                  hint="Right Live Simulator Backdrop"
                />
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 5. WHY CHOOSE US */}
        {/* ==================================================== */}
        {activeSubTab === 'whyChooseUs' && (
          <div className="space-y-5 animate-fadeIn min-w-0">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Why Choose Us Headings</h3>
                  <p className="text-xs text-stone-500">Section headline and lead paragraph</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">Section 07</span>
              </div>

              <div className="space-y-3.5 min-w-0">
                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={pageData.whyChooseUs.headline || ''}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      whyChooseUs: { ...prev.whyChooseUs, headline: e.target.value }
                    }))}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-medium focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Lead Description
                  </label>
                  <textarea
                    rows={2}
                    value={pageData.whyChooseUs.lead || ''}
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      whyChooseUs: { ...prev.whyChooseUs, lead: e.target.value }
                    }))}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* 5 Pillar Image Links */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">5 Core Pillar Images</h3>
                  <p className="text-xs text-stone-500">Background visual links for all 5 arched plates</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">5 Pillar Visuals</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 min-w-0">
                <ImageInputRow
                  label="Pillar 1: Offline Autonomy (100% Uptime)"
                  value={pageData.whyChooseUs?.pillarImages?.[0]}
                  onChange={(v) => handlePillarImageChange(0, v)}
                  hint="Plate 01"
                />

                <ImageInputRow
                  label="Pillar 2: Zero Lag (<0.2s Keystroke)"
                  value={pageData.whyChooseUs?.pillarImages?.[1]}
                  onChange={(v) => handlePillarImageChange(1, v)}
                  hint="Plate 02"
                />

                <ImageInputRow
                  label="Pillar 3: GST Invoicing (Tax Compliant)"
                  value={pageData.whyChooseUs?.pillarImages?.[2]}
                  onChange={(v) => handlePillarImageChange(2, v)}
                  hint="Plate 03"
                />

                <ImageInputRow
                  label="Pillar 4: Hardware Ready (Thermal & Laser)"
                  value={pageData.whyChooseUs?.pillarImages?.[3]}
                  onChange={(v) => handlePillarImageChange(3, v)}
                  hint="Plate 04"
                />

                <ImageInputRow
                  label="Pillar 5: Dedicated Support (Founder Line)"
                  value={pageData.whyChooseUs?.pillarImages?.[4]}
                  onChange={(v) => handlePillarImageChange(4, v)}
                  hint="Plate 05"
                />
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 6. CONTACT & FOOTER */}
        {/* ==================================================== */}
        {activeSubTab === 'contactFooter' && (
          <div className="space-y-5 animate-fadeIn min-w-0">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 min-w-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Contact Us Section Copy & Phone Mockup</h3>
                  <p className="text-xs text-stone-500">Section title, lead, and phone terminal mockup image link</p>
                </div>
                <span className="text-[11px] font-mono text-[var(--c1)] font-bold">Section 11</span>
              </div>

              <div className="space-y-3.5 min-w-0">
                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={pageData.contact.headline || ''}
                    onChange={(e) => handlePageChange('contact', 'headline', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 font-medium focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-xs font-bold text-stone-900 block truncate">
                    Lead Description
                  </label>
                  <textarea
                    rows={2}
                    value={pageData.contact.lead || ''}
                    onChange={(e) => handlePageChange('contact', 'lead', e.target.value)}
                    className="w-full min-w-0 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[var(--c1)] focus:ring-2 focus:ring-[var(--c1)]/15 shadow-xs"
                  />
                </div>

                <ImageInputRow
                  label="POS Counter Mockup Image Link"
                  value={pageData.contact.counterImage}
                  onChange={(v) => handlePageChange('contact', 'counterImage', v)}
                  hint="Phone Screen Backdrop"
                />
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Sticky Save Bar - 100% Responsive, Clean & Never Overflows */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <span className="text-xs text-stone-500 truncate">
          All modifications save directly to MongoDB and reflect live across the site.
        </span>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--c1)] hover:bg-[#d65a2f] text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shrink-0"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-200" />
              <span>Saved Live!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save All Customizations</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
