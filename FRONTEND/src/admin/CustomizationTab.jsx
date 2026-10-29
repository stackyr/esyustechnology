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
  Undo2,
  ExternalLink,
  ShieldCheck,
  Download,
  Clock
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
    servicesSection: { ...(LANDING_PAGE_SECTIONS?.servicesSection || {}), ...(landingPage?.servicesSection || {}) },
    productsSection: { ...(LANDING_PAGE_SECTIONS?.productsSection || {}), ...(landingPage?.productsSection || {}) },
    featuredProduct: { ...(LANDING_PAGE_SECTIONS?.featuredProduct || {}), ...(landingPage?.featuredProduct || {}) },
    whyChooseUs: {
      headline: landingPage?.whyChooseUs?.headline || LANDING_PAGE_SECTIONS?.whyChooseUs?.headline || '',
      lead: landingPage?.whyChooseUs?.lead || LANDING_PAGE_SECTIONS?.whyChooseUs?.lead || '',
      pillarImages: Array.isArray(landingPage?.whyChooseUs?.pillarImages) && landingPage.whyChooseUs.pillarImages.length === 5
        ? landingPage.whyChooseUs.pillarImages
        : [...(LANDING_PAGE_SECTIONS?.whyChooseUs?.pillarImages || [])]
    },
    reviewsSection: { ...(LANDING_PAGE_SECTIONS?.reviewsSection || {}), ...(landingPage?.reviewsSection || {}) },
    downloadSection: { ...(LANDING_PAGE_SECTIONS?.downloadSection || {}), ...(landingPage?.downloadSection || {}) },
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
        servicesSection: { ...(LANDING_PAGE_SECTIONS?.servicesSection || {}), ...(landingPage?.servicesSection || {}) },
        productsSection: { ...(LANDING_PAGE_SECTIONS?.productsSection || {}), ...(landingPage?.productsSection || {}) },
        featuredProduct: { ...(LANDING_PAGE_SECTIONS?.featuredProduct || {}), ...(landingPage?.featuredProduct || {}) },
        whyChooseUs: {
          headline: landingPage?.whyChooseUs?.headline || LANDING_PAGE_SECTIONS?.whyChooseUs?.headline || '',
          lead: landingPage?.whyChooseUs?.lead || LANDING_PAGE_SECTIONS?.whyChooseUs?.lead || '',
          pillarImages: Array.isArray(landingPage?.whyChooseUs?.pillarImages) && landingPage.whyChooseUs.pillarImages.length === 5
            ? landingPage.whyChooseUs.pillarImages
            : [...(LANDING_PAGE_SECTIONS?.whyChooseUs?.pillarImages || [])]
        },
        reviewsSection: { ...(LANDING_PAGE_SECTIONS?.reviewsSection || {}), ...(landingPage?.reviewsSection || {}) },
        downloadSection: { ...(LANDING_PAGE_SECTIONS?.downloadSection || {}), ...(landingPage?.downloadSection || {}) },
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
      console.error('Failed to save master customization:', err);
    }
  };

  const subTabs = [
    { id: 'brand', label: '1. Brand & Identity', icon: Building, desc: 'Name, contacts & stats' },
    { id: 'hero', label: '2. Hero & Visuals', icon: Sparkles, desc: 'Headline, ring & collage images' },
    { id: 'about', label: '3. About Section', icon: FileText, desc: 'Story, quote & founder images' },
    { id: 'services', label: '4. App Services', icon: Layers, desc: 'Capabilities copy & lead' },
    { id: 'products', label: '5. Applications Ecosystem', icon: Layers, desc: 'Software ecosystem blueprint' },
    { id: 'featuredProduct', label: '6. Featured Product', icon: Sliders, desc: 'Finance Flow station mockup' },
    { id: 'whyChooseUs', label: '7. Why Choose Us', icon: Sparkles, desc: '5 pillar cards & photo links' },
    { id: 'reviews', label: '8. Reviews & Proof', icon: MessageSquare, desc: 'Testimonial quote & verified author' },
    { id: 'download', label: '9. Download Releases', icon: FileText, desc: 'Installers lead & security notice' },
    { id: 'contactFooter', label: '10. Contact & Footer', icon: MessageSquare, desc: 'Hardware mockup & footer CTA' },
  ];

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[var(--dark)] text-[var(--bg)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-stone-800">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold px-2 py-0.5 rounded-full bg-white/10">
              Master Website Customizer
            </span>
            <span className="text-[10px] font-mono text-stone-300">
              Live MERN Sync
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Website &amp; Brand Customization
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Customize all brand details, landing page copy, headlines, contact numbers, and image links section-by-section. Updates reflect live across the entire website.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {onResetDefaults && (
            <button
              type="button"
              onClick={onResetDefaults}
              className="px-4 py-2.5 rounded-xl border border-white/20 text-stone-200 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Undo2 className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[var(--c1)] hover:bg-[#d64b22] text-white'
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving to MongoDB...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>All Sections Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subtabs Navigation Bar */}
      <div className="p-2 rounded-2xl bg-white border border-[var(--line)] shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--dark)] text-white shadow-xs'
                    : 'text-[var(--ink)]/80 hover:bg-[var(--soft)] hover:text-[var(--ink)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--c1)]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. BRAND & IDENTITY TAB                                      */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'brand' && (
        <div className="space-y-6">
          {/* Core Brand Identity */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Core Brand Identity</h3>
                <p className="text-xs text-[var(--muted)]">Updates header, footer, modals and metadata site-wide</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Brand Settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Company Full Name *</label>
                <input
                  type="text"
                  value={brandData.name}
                  onChange={(e) => handleBrandChange('name', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Short Name (Navbar/Chips) *</label>
                <input
                  type="text"
                  value={brandData.shortName}
                  onChange={(e) => handleBrandChange('shortName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Registered Domain *</label>
                <input
                  type="text"
                  value={brandData.domain}
                  onChange={(e) => handleBrandChange('domain', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Official Tagline</label>
                <input
                  type="text"
                  value={brandData.tagline}
                  onChange={(e) => handleBrandChange('tagline', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Establishment Date</label>
                <input
                  type="text"
                  value={brandData.establishmentDate}
                  onChange={(e) => handleBrandChange('establishmentDate', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>
            </div>
          </div>

          {/* Executive Leadership & Contact Desk */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Executive Leadership &amp; Contact Desk</h3>
                <p className="text-xs text-[var(--muted)]">Founder details, direct phone line and corporate addresses</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Desk Contacts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Founder &amp; CEO</label>
                <input
                  type="text"
                  value={brandData.founder}
                  onChange={(e) => handleBrandChange('founder', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Co-Founder &amp; CTO</label>
                <input
                  type="text"
                  value={brandData.coFounder}
                  onChange={(e) => handleBrandChange('coFounder', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Direct Phone Line</label>
                <input
                  type="text"
                  value={brandData.phone}
                  onChange={(e) => handleBrandChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={brandData.email}
                  onChange={(e) => handleBrandChange('email', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Technical Helpdesk Email</label>
                <input
                  type="email"
                  value={brandData.supportEmail}
                  onChange={(e) => handleBrandChange('supportEmail', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Headquarters Physical Address</label>
              <input
                type="text"
                value={brandData.address}
                onChange={(e) => handleBrandChange('address', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>
          </div>

          {/* 4 Proof Metric Stats */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Track Record &amp; Metric Proofs</h3>
                <p className="text-xs text-[var(--muted)]">4 key metrics displayed across website stats ribbon</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Proof Stats</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(brandData.stats || []).map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                  <span className="text-[10px] font-mono font-bold text-[var(--c1)]">METRIC 0{idx + 1}</span>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    placeholder="e.g. 5+"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    className="w-full px-3 py-1 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    placeholder="e.g. Software Products"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO & VISUALS TAB                                         */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Hero Stage Headlines &amp; Motion</h3>
                <p className="text-xs text-[var(--muted)]">Main opening banner headline, rotating ring, and background demo video</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Section 01</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Hero Main Title</label>
                <input
                  type="text"
                  value={pageData.hero.title || ''}
                  onChange={(e) => handlePageChange('hero', 'title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Rotating Ring Text</label>
                <input
                  type="text"
                  value={pageData.hero.ringText || ''}
                  onChange={(e) => handlePageChange('hero', 'ringText', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Demo Video Link / Path</label>
              <input
                type="text"
                value={pageData.hero.videoUrl || ''}
                onChange={(e) => handlePageChange('hero', 'videoUrl', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>
          </div>

          {/* 6 Collage Photo Links */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Hero 6-Card Collage Visual Images</h3>
                <p className="text-xs text-[var(--muted)]">Real photography links for POS counters, thermal printers and screens</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Collage Visuals</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'collageA1', label: 'Collage A1 (POS Billing Counter)' },
                { key: 'collageA2', label: 'Collage A2 (Thermal Receipt Print)' },
                { key: 'collageB', label: 'Collage B (Barcode Scanner)' },
                { key: 'collageD', label: 'Collage D (Store Checkout Lane)' },
                { key: 'collageE1', label: 'Collage E1 (GST Invoice Ledger)' },
                { key: 'collageE2', label: 'Collage E2 (Enterprise Terminal)' }
              ].map(({ key, label }) => (
                <div key={key} className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                  <span className="text-[11px] font-bold text-[var(--ink)] block truncate">{label}</span>
                  <input
                    type="text"
                    value={pageData.hero[key] || ''}
                    onChange={(e) => handlePageChange('hero', key, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                  />
                  {pageData.hero[key] && (
                    <div className="w-full h-24 rounded-lg bg-stone-100 overflow-hidden border border-[var(--line)]">
                      <img
                        src={pageData.hero[key]}
                        alt={label}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ABOUT SECTION TAB                                          */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'about' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">About Us Story &amp; Motive</h3>
                <p className="text-xs text-[var(--muted)]">Section 03 company introduction, mission statement, and quote</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Section 03</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Headline</label>
              <input
                type="text"
                value={pageData.about.headline || ''}
                onChange={(e) => handlePageChange('about', 'headline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Lead Paragraph</label>
              <textarea
                rows={2}
                value={pageData.about.lead || ''}
                onChange={(e) => handlePageChange('about', 'lead', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Founder's Quote</label>
              <textarea
                rows={3}
                value={pageData.about.founderQuote || ''}
                onChange={(e) => handlePageChange('about', 'founderQuote', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                <span className="text-xs font-bold text-[var(--ink)]">Founder Photo Link</span>
                <input
                  type="text"
                  value={pageData.about.founderPhoto || ''}
                  onChange={(e) => handlePageChange('about', 'founderPhoto', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                />
                {pageData.about.founderPhoto && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--line)]">
                    <img src={pageData.about.founderPhoto} alt="Founder" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                <span className="text-xs font-bold text-[var(--ink)]">Office / Workspace Photo Link</span>
                <input
                  type="text"
                  value={pageData.about.officePhoto || ''}
                  onChange={(e) => handlePageChange('about', 'officePhoto', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                />
                {pageData.about.officePhoto && (
                  <div className="w-full h-16 rounded-lg overflow-hidden border border-[var(--line)]">
                    <img src={pageData.about.officePhoto} alt="Office" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. APP SERVICES SECTION TAB                                   */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'services' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Section 04 • App Services Copy</h3>
                <p className="text-xs text-[var(--muted)]">Headline and lead paragraph introducing engineering capabilities</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Section 04</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Section Headline</label>
              <input
                type="text"
                value={pageData.servicesSection?.headline || ''}
                onChange={(e) => handlePageChange('servicesSection', 'headline', e.target.value)}
                placeholder="Five ways we engineer business reliability"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Section Lead Paragraph</label>
              <textarea
                rows={3}
                value={pageData.servicesSection?.lead || ''}
                onChange={(e) => handlePageChange('servicesSection', 'lead', e.target.value)}
                placeholder="From offline Windows billing software and thermal printer POS to cloud enterprise applications, we build robust systems with zero downtime."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-center justify-between">
              <span>To add, edit or delete individual services, use the dedicated <strong>App Services</strong> tab in the sidebar.</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. APPLICATIONS ECOSYSTEM TAB                                 */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Section 05 • Software Ecosystem Blueprint</h3>
                <p className="text-xs text-[var(--muted)]">Section eyebrow, title and introduction copy for 5 proprietary systems</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Section 05</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Eyebrow Tag</label>
              <input
                type="text"
                value={pageData.productsSection?.eyebrow || ''}
                onChange={(e) => handlePageChange('productsSection', 'eyebrow', e.target.value)}
                placeholder="Production Software Blueprint"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Section Headline</label>
              <input
                type="text"
                value={pageData.productsSection?.headline || ''}
                onChange={(e) => handlePageChange('productsSection', 'headline', e.target.value)}
                placeholder="Inside our software ecosystem"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Section Lead Paragraph</label>
              <textarea
                rows={3}
                value={pageData.productsSection?.lead || ''}
                onChange={(e) => handlePageChange('productsSection', 'lead', e.target.value)}
                placeholder="Five proprietary systems engineered for retail counters, distributors, travel consultancies, and enterprises requiring 100% offline resilience."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-950 flex items-center justify-between">
              <span>To toggle Coming Soon vs Live Download URLs, edit logos, or configure chips for each product, open the <strong>Applications &amp; Specs</strong> tab.</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. FEATURED PRODUCT TAB                                       */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'featuredProduct' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Section 06 • Featured Product (Finance Flow)</h3>
                <p className="text-xs text-[var(--muted)]">Interactive terminal calculator headline, lead, and station background image</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Section 06</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Headline</label>
              <input
                type="text"
                value={pageData.featuredProduct.headline || ''}
                onChange={(e) => handlePageChange('featuredProduct', 'headline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Lead Paragraph</label>
              <textarea
                rows={3}
                value={pageData.featuredProduct.lead || ''}
                onChange={(e) => handlePageChange('featuredProduct', 'lead', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
              <span className="text-xs font-bold text-[var(--ink)]">Finance Flow Station Mockup Image Link</span>
              <input
                type="text"
                value={pageData.featuredProduct.stationImage || ''}
                onChange={(e) => handlePageChange('featuredProduct', 'stationImage', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
              />
              {pageData.featuredProduct.stationImage && (
                <div className="w-full h-32 rounded-xl overflow-hidden border border-[var(--line)]">
                  <img src={pageData.featuredProduct.stationImage} alt="Station" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. WHY CHOOSE US TAB                                          */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'whyChooseUs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Section 07 • Why Choose Us (5 Pillars)</h3>
                <p className="text-xs text-[var(--muted)]">Five core engineering pillars and high-resolution card photo links</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Section 07</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Headline</label>
              <input
                type="text"
                value={pageData.whyChooseUs.headline || ''}
                onChange={(e) => handlePageChange('whyChooseUs', 'headline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Lead Paragraph</label>
              <textarea
                rows={2}
                value={pageData.whyChooseUs.lead || ''}
                onChange={(e) => handlePageChange('whyChooseUs', 'lead', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            {/* 5 Pillar Images */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[var(--c1)] uppercase tracking-wider font-mono">
                5 Feature Pillar Card Images
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Pillar 01: Experienced Team & Local DB',
                  'Pillar 02: AES-256 Encryption & Security',
                  'Pillar 03: 100% Tailored Custom Architecture',
                  'Pillar 04: Plug-and-Play Thermal Hardware',
                  'Pillar 05: 99% Milestone Compliance'
                ].map((label, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                    <span className="text-[11px] font-bold text-[var(--ink)] block truncate">{label}</span>
                    <input
                      type="text"
                      value={pageData.whyChooseUs?.pillarImages?.[idx] || ''}
                      onChange={(e) => handlePillarImageChange(idx, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                    />
                    {pageData.whyChooseUs?.pillarImages?.[idx] && (
                      <div className="w-full h-20 rounded-lg bg-stone-100 overflow-hidden border border-[var(--line)]">
                        <img
                          src={pageData.whyChooseUs.pillarImages[idx]}
                          alt={label}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. REVIEWS & SOCIAL PROOF TAB                                 */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Section 09 • Customer Reviews &amp; Testimonial Quote</h3>
                <p className="text-xs text-[var(--muted)]">Featured pull-quote and verified merchant endorsement</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Section 09</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Featured Voice Headline Quote</label>
              <textarea
                rows={3}
                value={pageData.reviewsSection?.headlineQuote || ''}
                onChange={(e) => handlePageChange('reviewsSection', 'headlineQuote', e.target.value)}
                placeholder="Finance Flow eliminated 100% of our checkout delays..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Quote Author Name</label>
                <input
                  type="text"
                  value={pageData.reviewsSection?.quoteAuthor || ''}
                  onChange={(e) => handlePageChange('reviewsSection', 'quoteAuthor', e.target.value)}
                  placeholder="Sunil Agarwal"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Author Company &amp; Meta</label>
                <input
                  type="text"
                  value={pageData.reviewsSection?.authorMeta || ''}
                  onChange={(e) => handlePageChange('reviewsSection', 'authorMeta', e.target.value)}
                  placeholder="Agarwal Mega Store, Kolkata · Verified User"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. DOWNLOAD RELEASES TAB                                      */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'download' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Section 10 • Application Releases Center</h3>
                <p className="text-xs text-[var(--muted)]">Section title, lead, and digital safety guarantee notice</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Section 10</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Section Eyebrow</label>
              <input
                type="text"
                value={pageData.downloadSection?.eyebrow || ''}
                onChange={(e) => handlePageChange('downloadSection', 'eyebrow', e.target.value)}
                placeholder="Section 10 • Application Releases"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Section Headline</label>
              <input
                type="text"
                value={pageData.downloadSection?.headline || ''}
                onChange={(e) => handlePageChange('downloadSection', 'headline', e.target.value)}
                placeholder="Installers built for offline endurance."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Section Lead Paragraph</label>
              <textarea
                rows={3}
                value={pageData.downloadSection?.lead || ''}
                onChange={(e) => handlePageChange('downloadSection', 'lead', e.target.value)}
                placeholder="Direct access to official installers and production releases..."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Digital Safety &amp; Compatibility Guarantee Notice</label>
              <textarea
                rows={2}
                value={pageData.downloadSection?.notice || ''}
                onChange={(e) => handlePageChange('downloadSection', 'notice', e.target.value)}
                placeholder="Every installer is scanned and clean of malware. Windows packages include all runtime SQLite drivers..."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 10. CONTACT & FOOTER TAB                                      */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'contactFooter' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Section 11 • Contact Desk &amp; Hardware Mockup</h3>
                <p className="text-xs text-[var(--muted)]">Lead text, hardware counter photo, and footer floating orb call-to-action</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Section 11</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Contact Desk Headline</label>
              <input
                type="text"
                value={pageData.contact.headline || ''}
                onChange={(e) => handlePageChange('contact', 'headline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Contact Desk Lead Paragraph</label>
              <textarea
                rows={2}
                value={pageData.contact.lead || ''}
                onChange={(e) => handlePageChange('contact', 'lead', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
              <span className="text-xs font-bold text-[var(--ink)]">Hardware Counter Mockup Image Link</span>
              <input
                type="text"
                value={pageData.contact.counterImage || ''}
                onChange={(e) => handlePageChange('contact', 'counterImage', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
              />
              {pageData.contact.counterImage && (
                <div className="w-full h-32 rounded-xl overflow-hidden border border-[var(--line)]">
                  <img src={pageData.contact.counterImage} alt="Hardware Mockup" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[var(--line)] space-y-3">
              <span className="text-xs font-bold text-[var(--c1)] uppercase font-mono tracking-wider">
                Footer Floating Banner (FCTA) Copy
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Banner Eyebrow</label>
                  <input
                    type="text"
                    value={pageData.contact.footerCtaEyebrow || 'Enterprise Precision • Zero Cloud Latency'}
                    onChange={(e) => handlePageChange('contact', 'footerCtaEyebrow', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={pageData.contact.footerCtaTitle || 'Bring calm, offline precision to your billing counter.'}
                    onChange={(e) => handlePageChange('contact', 'footerCtaTitle', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[var(--line)] shadow-xl flex items-center justify-between z-30 max-w-7xl mx-auto rounded-t-2xl">
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All modifications save directly to the MongoDB backend and reflect live across the site.</span>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
            saveSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-[var(--c1)] hover:bg-[#d64b22] text-white'
          }`}
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>All Changes Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Customizations</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
