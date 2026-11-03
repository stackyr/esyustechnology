import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  AlertCircle,
  KeyRound,
  EyeOff,
  Eye,
  User,
  Lock,
  Users
} from 'lucide-react';
import {
  COMPANY_INFO,
  LANDING_PAGE_SECTIONS,
  DEFAULT_WORKFLOW_STEPS,
  TEAM_MEMBERS
} from '../data/companyData';
import api from '../utils/api';

export default function CustomizationTab({
  brand,
  landingPage,
  onSaveBrand,
  onSaveLandingPage,
  onResetDefaults,
  isSaving,
  onRefresh,
  isRefreshing,
  isInitialLoading = false
}) {
  const isLoading = isInitialLoading || isRefreshing;
  const [activeSubTab, setActiveSubTab] = useState('brand');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLocalSaving, setIsLocalSaving] = useState(false);
  const brandInitializedRef = useRef(false);
  const pageInitializedRef = useRef(false);
  const isDirtyRef = useRef(false);

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
    navBadge: brand?.navBadge || COMPANY_INFO.navBadge || 'Software',
    navSubtitle: brand?.navSubtitle || COMPANY_INFO.navSubtitle || 'Enterprise Suite',
    footerAbout: brand?.footerAbout || COMPANY_INFO.footerAbout || '',
    stats: brand?.stats || [...COMPANY_INFO.stats]
  }));

  // Landing page state
  const [pageData, setPageData] = useState(() => ({
    hero: { ...(LANDING_PAGE_SECTIONS?.hero || {}), ...(landingPage?.hero || {}) },
    about: { ...(LANDING_PAGE_SECTIONS?.about || {}), ...(landingPage?.about || {}) },
    team: {
      headline: landingPage?.team?.headline || LANDING_PAGE_SECTIONS?.team?.headline || 'The minds behind the software architecture',
      lead: landingPage?.team?.lead || LANDING_PAGE_SECTIONS?.team?.lead || '',
      members: Array.isArray(landingPage?.team?.members) && landingPage.team.members.length > 0
        ? landingPage.team.members
        : (LANDING_PAGE_SECTIONS?.team?.members || TEAM_MEMBERS).map(m => ({
            name: m.name,
            role: m.role,
            avatar: m.avatar,
            bio: m.bio || ''
          }))
    },
    servicesSection: { ...(LANDING_PAGE_SECTIONS?.servicesSection || {}), ...(landingPage?.servicesSection || {}) },
    productsSection: { ...(LANDING_PAGE_SECTIONS?.productsSection || {}), ...(landingPage?.productsSection || {}) },
    featuredProduct: {
      ...(LANDING_PAGE_SECTIONS?.featuredProduct || {}),
      ...(landingPage?.featuredProduct || {}),
      steps: Array.isArray(landingPage?.featuredProduct?.steps) && landingPage.featuredProduct.steps.length === 4
        ? landingPage.featuredProduct.steps
        : (LANDING_PAGE_SECTIONS?.featuredProduct?.steps || DEFAULT_WORKFLOW_STEPS).map(s => ({ ...s }))
    },
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

  // Admin credentials state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const [credsSuccess, setCredsSuccess] = useState('');
  const [credsError, setCredsError] = useState('');

  // Synchronize on initial load, or when fresh data arrives via refresh if user has no unsaved edits
  useEffect(() => {
    if (brand && typeof brand === 'object' && Object.keys(brand).length > 0) {
      if (!brandInitializedRef.current || !isDirtyRef.current) {
        brandInitializedRef.current = true;
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
          navBadge: brand.navBadge || COMPANY_INFO.navBadge || 'Software',
          navSubtitle: brand.navSubtitle || COMPANY_INFO.navSubtitle || 'Enterprise Suite',
          footerAbout: brand.footerAbout || COMPANY_INFO.footerAbout || '',
          stats: Array.isArray(brand.stats) ? brand.stats : [...COMPANY_INFO.stats]
        });
      }
    }
  }, [brand]);

  useEffect(() => {
    if (landingPage && typeof landingPage === 'object' && Object.keys(landingPage).length > 0) {
      if (!pageInitializedRef.current || !isDirtyRef.current) {
        pageInitializedRef.current = true;
        setPageData({
          hero: { ...(LANDING_PAGE_SECTIONS?.hero || {}), ...(landingPage.hero || {}) },
          about: { ...(LANDING_PAGE_SECTIONS?.about || {}), ...(landingPage.about || {}) },
          team: {
            headline: landingPage.team?.headline || LANDING_PAGE_SECTIONS?.team?.headline || 'The minds behind the software architecture',
            lead: landingPage.team?.lead || LANDING_PAGE_SECTIONS?.team?.lead || '',
            members: Array.isArray(landingPage.team?.members) && landingPage.team.members.length > 0
              ? landingPage.team.members
              : (LANDING_PAGE_SECTIONS?.team?.members || TEAM_MEMBERS).map(m => ({
                  name: m.name,
                  role: m.role,
                  avatar: m.avatar,
                  bio: m.bio || ''
                }))
          },
          servicesSection: { ...(LANDING_PAGE_SECTIONS?.servicesSection || {}), ...(landingPage.servicesSection || {}) },
          productsSection: { ...(LANDING_PAGE_SECTIONS?.productsSection || {}), ...(landingPage.productsSection || {}) },
          featuredProduct: {
            ...(LANDING_PAGE_SECTIONS?.featuredProduct || {}),
            ...(landingPage.featuredProduct || {}),
            steps: Array.isArray(landingPage.featuredProduct?.steps) && landingPage.featuredProduct.steps.length === 4
              ? landingPage.featuredProduct.steps
              : (LANDING_PAGE_SECTIONS?.featuredProduct?.steps || DEFAULT_WORKFLOW_STEPS).map(s => ({ ...s }))
          },
          whyChooseUs: {
            headline: landingPage.whyChooseUs?.headline || LANDING_PAGE_SECTIONS?.whyChooseUs?.headline || '',
            lead: landingPage.whyChooseUs?.lead || LANDING_PAGE_SECTIONS?.whyChooseUs?.lead || '',
            pillarImages: Array.isArray(landingPage.whyChooseUs?.pillarImages) && landingPage.whyChooseUs.pillarImages.length === 5
              ? landingPage.whyChooseUs.pillarImages
              : [...(LANDING_PAGE_SECTIONS?.whyChooseUs?.pillarImages || [])]
          },
          reviewsSection: { ...(LANDING_PAGE_SECTIONS?.reviewsSection || {}), ...(landingPage.reviewsSection || {}) },
          downloadSection: { ...(LANDING_PAGE_SECTIONS?.downloadSection || {}), ...(landingPage.downloadSection || {}) },
          contact: { ...(LANDING_PAGE_SECTIONS?.contact || {}), ...(landingPage.contact || {}) }
        });
      }
    }
  }, [landingPage]);

  useEffect(() => {
    api.getAdminCredentials()
      .then((res) => {
        if (res?.data?.username) {
          setAdminUsername(res.data.username);
          setNewAdminUsername(res.data.username);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setCredsError('');
    setCredsSuccess('');

    if (!currentAdminPassword) {
      setCredsError('Please enter your current admin password to verify your authorization.');
      return;
    }

    if (!newAdminUsername.trim()) {
      setCredsError('Username cannot be empty.');
      return;
    }

    if (newAdminPassword && newAdminPassword.length < 4) {
      setCredsError('New password must be at least 4 characters long.');
      return;
    }

    if (newAdminPassword && newAdminPassword !== confirmAdminPassword) {
      setCredsError('New password and confirmation do not match.');
      return;
    }

    setIsUpdatingCreds(true);
    try {
      const res = await api.updateAdminCredentials({
        currentPassword: currentAdminPassword.trim(),
        newUsername: newAdminUsername.trim(),
        newPassword: newAdminPassword ? newAdminPassword.trim() : undefined
      });

      if (res.success) {
        setCredsSuccess('Admin credentials updated successfully in MERN backend!');
        setAdminUsername(res.data?.username || newAdminUsername.trim());
        setCurrentAdminPassword('');
        setNewAdminPassword('');
        setConfirmAdminPassword('');
        try {
          const userObj = JSON.parse(localStorage.getItem('esyus_admin_user') || '{}');
          userObj.username = res.data?.username || newAdminUsername.trim();
          localStorage.setItem('esyus_admin_user', JSON.stringify(userObj));
        } catch (e) {}
        setTimeout(() => setCredsSuccess(''), 4000);
      } else {
        setCredsError(res.error || 'Failed to update credentials. Please check current password.');
      }
    } catch (err) {
      setCredsError(err.message || 'Error updating administrator credentials.');
    } finally {
      setIsUpdatingCreds(false);
    }
  };

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

  const handleDomainChange = (index, field, val) => {
    setPageData((prev) => {
      const currentDomains = Array.isArray(prev.about?.domains) && prev.about.domains.length === 4
        ? prev.about.domains.map((d) => ({ ...d }))
        : (LANDING_PAGE_SECTIONS?.about?.domains || []).map((d) => ({ ...d }));

      if (currentDomains[index]) {
        currentDomains[index] = { ...currentDomains[index], [field]: val };
      }
      return {
        ...prev,
        about: {
          ...prev.about,
          domains: currentDomains
        }
      };
    });
    setSaveSuccess(false);
  };

  const handleStepChange = (index, field, val) => {
    setPageData((prev) => {
      const steps = Array.isArray(prev.featuredProduct?.steps) && prev.featuredProduct.steps.length === 4
        ? prev.featuredProduct.steps.map(s => ({ ...s }))
        : (LANDING_PAGE_SECTIONS?.featuredProduct?.steps || DEFAULT_WORKFLOW_STEPS).map(s => ({ ...s }));
      if (steps[index]) {
        steps[index] = { ...steps[index], [field]: val };
      }
      return {
        ...prev,
        featuredProduct: {
          ...prev.featuredProduct,
          steps
        }
      };
    });
    setSaveSuccess(false);
  };

  const handleTeamMemberChange = (index, field, val) => {
    setPageData((prev) => {
      const members = Array.isArray(prev.team?.members) && prev.team.members.length > 0
        ? prev.team.members.map(m => ({ ...m }))
        : (LANDING_PAGE_SECTIONS?.team?.members || TEAM_MEMBERS).map(m => ({ name: m.name, role: m.role, avatar: m.avatar, bio: m.bio || '' }));
      if (members[index]) {
        members[index] = { ...members[index], [field]: val };
      }
      return {
        ...prev,
        team: {
          ...prev.team,
          members
        }
      };
    });
    setSaveSuccess(false);
  };

  // Reset form inputs back to latest saved database version
  const handleResetFormToLatest = () => {
    isDirtyRef.current = false;
    if (brand && typeof brand === 'object') {
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
        navBadge: brand.navBadge || COMPANY_INFO.navBadge || 'Software',
        navSubtitle: brand.navSubtitle || COMPANY_INFO.navSubtitle || 'Enterprise Suite',
        footerAbout: brand.footerAbout || COMPANY_INFO.footerAbout || '',
        stats: Array.isArray(brand.stats) ? [...brand.stats] : [...COMPANY_INFO.stats]
      });
    }

    if (landingPage && typeof landingPage === 'object') {
      setPageData({
        hero: { ...(LANDING_PAGE_SECTIONS?.hero || {}), ...(landingPage.hero || {}) },
        about: { ...(LANDING_PAGE_SECTIONS?.about || {}), ...(landingPage.about || {}) },
        team: {
          headline: landingPage.team?.headline || LANDING_PAGE_SECTIONS?.team?.headline || 'The minds behind the software architecture',
          lead: landingPage.team?.lead || LANDING_PAGE_SECTIONS?.team?.lead || '',
          members: Array.isArray(landingPage.team?.members) && landingPage.team.members.length > 0
            ? [...landingPage.team.members]
            : (LANDING_PAGE_SECTIONS?.team?.members || TEAM_MEMBERS).map(m => ({ ...m }))
        },
        servicesSection: { ...(LANDING_PAGE_SECTIONS?.servicesSection || {}), ...(landingPage.servicesSection || {}) },
        productsSection: { ...(LANDING_PAGE_SECTIONS?.productsSection || {}), ...(landingPage.productsSection || {}) },
        featuredProduct: {
          ...(LANDING_PAGE_SECTIONS?.featuredProduct || {}),
          ...(landingPage.featuredProduct || {}),
          steps: Array.isArray(landingPage.featuredProduct?.steps) && landingPage.featuredProduct.steps.length === 4
            ? [...landingPage.featuredProduct.steps]
            : (LANDING_PAGE_SECTIONS?.featuredProduct?.steps || DEFAULT_WORKFLOW_STEPS).map(s => ({ ...s }))
        },
        whyChooseUs: {
          headline: landingPage.whyChooseUs?.headline || LANDING_PAGE_SECTIONS?.whyChooseUs?.headline || '',
          lead: landingPage.whyChooseUs?.lead || LANDING_PAGE_SECTIONS?.whyChooseUs?.lead || '',
          pillarImages: Array.isArray(landingPage.whyChooseUs?.pillarImages) && landingPage.whyChooseUs.pillarImages.length === 5
            ? [...landingPage.whyChooseUs.pillarImages]
            : [...(LANDING_PAGE_SECTIONS?.whyChooseUs?.pillarImages || [])]
        },
        reviewsSection: { ...(LANDING_PAGE_SECTIONS?.reviewsSection || {}), ...(landingPage.reviewsSection || {}) },
        downloadSection: { ...(LANDING_PAGE_SECTIONS?.downloadSection || {}), ...(landingPage.downloadSection || {}) },
        contact: { ...(LANDING_PAGE_SECTIONS?.contact || {}), ...(landingPage.contact || {}) }
      });
    }

    if (onResetDefaults) onResetDefaults();
    else if (onRefresh) onRefresh();
  };

  // Master Save handler
  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setIsLocalSaving(true);
    try {
      if (onSaveBrand) await onSaveBrand(brandData);
      if (onSaveLandingPage) await onSaveLandingPage(pageData);
      isDirtyRef.current = false;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save master customization:', err);
    } finally {
      setIsLocalSaving(false);
    }
  };

  const subTabs = [
    { id: 'brand', label: '1. Brand & Navbar', icon: Building, desc: 'Name, contacts, nav pill & stats' },
    { id: 'hero', label: '2. Hero & Visuals', icon: Sparkles, desc: 'Headline, 6 cards & video flood' },
    { id: 'about', label: '3. About Section', icon: FileText, desc: 'Story, quote & founder images' },
    { id: 'team', label: '4. Team & Architects', icon: Users, desc: 'Headline, lead & 4 engineers' },
    { id: 'services', label: '5. App Services', icon: Layers, desc: 'Capabilities copy & lead' },
    { id: 'products', label: '6. Applications Ecosystem', icon: Layers, desc: 'Software ecosystem blueprint' },
    { id: 'featuredProduct', label: '7. Featured Product', icon: Sliders, desc: 'Finance Flow & 4-step pipeline' },
    { id: 'whyChooseUs', label: '8. Why Choose Us', icon: Sparkles, desc: '5 pillar cards & photo links' },
    { id: 'reviews', label: '9. Reviews & Proof', icon: MessageSquare, desc: 'Testimonial quote & verified author' },
    { id: 'download', label: '10. Download Releases', icon: FileText, desc: 'Installers lead & security notice' },
    { id: 'contactFooter', label: '11. Contact & Footer', icon: MessageSquare, desc: 'Hardware mockup & footer CTA' },
  ];

  return (
    <div className="space-y-6 pb-28 sm:pb-32 relative">
      
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

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 rounded-xl border border-white/20 text-stone-200 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              title="Reload brand & customization live from MongoDB Atlas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--c1)]' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>
          )}
          <button
              type="button"
              onClick={handleResetFormToLatest}
              className="px-4 py-2.5 rounded-xl border border-white/20 text-stone-200 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Discard unsaved edits and reload latest saved version from database"
            >
              <Undo2 className="w-4 h-4" />
              <span>Reset to Saved</span>
            </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving || isLocalSaving}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[var(--c1)] hover:bg-[#d64b22] text-white'
            }`}
          >
            {(isSaving || isLocalSaving) ? (
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

      {/* Loading state during initial fetch or when clicking Refresh */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3.5 bg-white rounded-3xl border border-[var(--line)] shadow-xs my-4 animate-in fade-in duration-200">
          <div className="w-9 h-9 rounded-full border-2 border-stone-300 border-t-[var(--c1)] animate-spin" />
          <div className="text-center space-y-1">
            <span className="text-sm font-bold text-[var(--ink)] block">Loading Website Customization...</span>
            <span className="text-xs font-mono text-[var(--muted)] block">Fetching latest brand settings &amp; copy live from MongoDB Atlas</span>
          </div>
        </div>
      ) : (
        <>
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
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Brand Info</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Company Full Name</label>
                <input
                  type="text"
                  value={brandData.name}
                  onChange={(e) => handleBrandChange('name', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Short Brand Name</label>
                <input
                  type="text"
                  value={brandData.shortName}
                  onChange={(e) => handleBrandChange('shortName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Primary Domain Name</label>
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

          {/* Header Navbar & Footer Branding */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Navbar &amp; Footer Branding</h3>
                <p className="text-xs text-[var(--muted)]">Customize the logo status pill badge, header subtitle and footer mission statement</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Nav &amp; Footer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Navbar Status Pill (Mobile &amp; Desktop)</label>
                <input
                  type="text"
                  value={brandData.navBadge || 'Software'}
                  onChange={(e) => handleBrandChange('navBadge', e.target.value)}
                  placeholder="e.g. Software, Live, or Enterprise"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Navbar Header Subtitle (Large Screen)</label>
                <input
                  type="text"
                  value={brandData.navSubtitle || 'Enterprise Suite'}
                  onChange={(e) => handleBrandChange('navSubtitle', e.target.value)}
                  placeholder="e.g. Enterprise Suite or Software Center"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Footer About Mission Statement</label>
              <textarea
                rows={2}
                value={brandData.footerAbout || ''}
                onChange={(e) => handleBrandChange('footerAbout', e.target.value)}
                placeholder="Esyus Technology builds robust, high-performance desktop suites, enterprise web platforms, and tailored Android applications designed to operate with absolute reliability and speed."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
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
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Technical Helpdesk Email (24*6 Support)</label>
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

          {/* Key Performance Indicators (Stats) */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Key Operational Metrics (Stats)</h3>
                <p className="text-xs text-[var(--muted)]">4 highlighted numbers displayed in corporate credentials and proof</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Metrics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {brandData.stats?.map((stat, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--c1)]">Metric 0{idx + 1}</span>
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

          {/* Administrator Access & Backend Security Credentials */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[var(--c1)]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--ink)]">
                    Admin Security &amp; Access Credentials
                  </h3>
                  <p className="text-xs text-[var(--muted)]">
                    Change admin username and login password. Verified with current password and saved directly to the backend database.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                  Active User: <strong className="text-[var(--c1)]">{adminUsername}</strong>
                </span>
                <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Security</span>
              </div>
            </div>

            {credsError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span className="font-medium">{credsError}</span>
              </div>
            )}

            {credsSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-medium">{credsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateCredentials} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Current Password */}
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70">
                  <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>Current Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentAdminPassword}
                      onChange={(e) => setCurrentAdminPassword(e.target.value)}
                      placeholder="Enter current password..."
                      required
                      className="w-full px-3 py-1.5 pr-8 rounded-lg border border-amber-300 bg-white text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-amber-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* New Username */}
                <div className="p-3 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>New Username</span>
                  </label>
                  <input
                    type="text"
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    placeholder="e.g. admin or sayantan"
                    required
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>

                {/* New Password */}
                <div className="p-3 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-stone-500" />
                    <span>New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full px-3 py-1.5 pr-8 rounded-lg border border-[var(--line)] bg-white text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Password if new password provided */}
              {newAdminPassword && (
                <div className="max-w-xs">
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Confirm New Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      placeholder="Re-enter new password..."
                      required={Boolean(newAdminPassword)}
                      className="w-full px-3 py-1.5 pr-8 rounded-lg border border-[var(--line)] bg-white text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingCreds}
                  className="px-5 py-2 rounded-xl bg-[var(--dark)] hover:bg-black text-[var(--bg)] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isUpdatingCreds ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--c1)]" />
                      <span>Saving Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--c1)]" />
                      <span>Update Admin Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO & VISUALS TAB                                         */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6">
          {/* Main Hero Stage */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Hero Stage Headlines &amp; Motion</h3>
                <p className="text-xs text-[var(--muted)]">Main opening banner headline, rotating ring, and leadership avatars</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Hero Banner</span>
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
          </div>

          {/* Video Flood Banner Section */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Full-Screen Video Flood Banner</h3>
                <p className="text-xs text-[var(--muted)]">Customize video eyebrow, headline, lead text, and video asset link</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Video Section</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Video Flood Eyebrow</label>
                <input
                  type="text"
                  value={pageData.hero.floodEyebrow || ''}
                  onChange={(e) => handlePageChange('hero', 'floodEyebrow', e.target.value)}
                  placeholder="Architecture • High Performance & Zero Latency"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Video Flood Headline</label>
                <input
                  type="text"
                  value={pageData.hero.floodTitle || ''}
                  onChange={(e) => handlePageChange('hero', 'floodTitle', e.target.value)}
                  placeholder="Built for Indian business counters."
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Video Flood Lead Paragraph</label>
              <textarea
                rows={2}
                value={pageData.hero.floodLead || ''}
                onChange={(e) => handlePageChange('hero', 'floodLead', e.target.value)}
                placeholder="Local SQLite databases, instant 0.2s keystrokes, and plug-and-play thermal printer drivers..."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Demo Video Link / Path</label>
              <input
                type="text"
                value={pageData.hero.videoUrl || ''}
                onChange={(e) => handlePageChange('hero', 'videoUrl', e.target.value)}
                placeholder="/demo-video.mp4?v=2"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] font-mono focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>
          </div>

          {/* 6 Collage Cards & Overlay Chips */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Hero 6 Collage Cards (Images &amp; Overlay Chips)</h3>
                <p className="text-xs text-[var(--muted)]">Customize the photo and the overlay chip text (Title &amp; Subtitle) for each of the 6 cards</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">6 Collage Cards</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { imgKey: 'collageA1', titleKey: 'cardA1Title', subKey: 'cardA1Sub', defaultTitle: '100% Offline Billing', defaultSub: '0.2s Keystroke · Local SQLite', label: 'Card A1 (Top Left)' },
                { imgKey: 'collageA2', titleKey: 'cardA2Title', subKey: 'cardA2Sub', defaultTitle: 'GST Tax Invoice', defaultSub: 'Thermal 2" & 3" Ready', label: 'Card A2 (Bottom Left)' },
                { imgKey: 'collageB', titleKey: 'cardBTitle', subKey: 'cardBSub', defaultTitle: 'Offline Systems Ready', defaultSub: 'Zero cloud dependency', label: 'Card B (Center-Left Lane)' },
                { imgKey: 'collageD', titleKey: 'cardDTitle', subKey: 'cardDSub', defaultTitle: 'Finance Flow Desktop', defaultSub: 'Windows 10 / 11 · v2.4.0', label: 'Card D (Center-Right Counter)' },
                { imgKey: 'collageE1', titleKey: 'cardE1Title', subKey: 'cardE1Sub', defaultTitle: 'Esyus Mobile Billing', defaultSub: 'Android APK · Handheld Sync', label: 'Card E1 (Top Right)' },
                { imgKey: 'collageE2', titleKey: 'cardE2Title', subKey: 'cardE2Sub', defaultTitle: 'Hardware Interop', defaultSub: 'Direct USB / Serial print', label: 'Card E2 (Bottom Right)' }
              ].map(({ imgKey, titleKey, subKey, defaultTitle, defaultSub, label }) => (
                <div key={imgKey} className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--ink)]">{label}</span>
                    <span className="text-[10px] font-mono text-[var(--c1)] font-bold">{titleKey}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Chip Title</label>
                    <input
                      type="text"
                      value={pageData.hero[titleKey] || defaultTitle}
                      onChange={(e) => handlePageChange('hero', titleKey, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Chip Subtitle</label>
                    <input
                      type="text"
                      value={pageData.hero[subKey] || defaultSub}
                      onChange={(e) => handlePageChange('hero', subKey, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Photo Link</label>
                    <input
                      type="text"
                      value={pageData.hero[imgKey] || ''}
                      onChange={(e) => handlePageChange('hero', imgKey, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  {pageData.hero[imgKey] && (
                    <div className="w-full h-24 rounded-lg bg-stone-100 overflow-hidden border border-[var(--line)]">
                      <img
                        src={pageData.hero[imgKey]}
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
          
          {/* Card 1: Section Header & Core Engineering Motive */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">About Us Story &amp; Philosophy</h3>
                <p className="text-xs text-[var(--muted)]">Section headline, lead introduction, and core engineering motive</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase px-2 py-0.5 rounded-full bg-[var(--soft)] border border-[var(--line)]">
                About Section
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Section Headline</label>
              <input
                type="text"
                value={pageData.about?.headline || ''}
                onChange={(e) => handlePageChange('about', 'headline', e.target.value)}
                placeholder="Building dependable software for real-world businesses"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Lead Paragraph</label>
              <textarea
                rows={2}
                value={pageData.about?.lead || ''}
                onChange={(e) => handlePageChange('about', 'lead', e.target.value)}
                placeholder="Established to solve one critical problem: businesses losing hours of productivity..."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
              <label className="block text-xs font-bold text-amber-950 uppercase tracking-wide">
                Core Engineering Motive Quote
              </label>
              <p className="text-[11px] text-amber-900/80 mb-1">
                Appears inside the orange bordered quote box on the right of the headline on the public website.
              </p>
              <textarea
                rows={2}
                value={pageData.about?.motive || ''}
                onChange={(e) => handlePageChange('about', 'motive', e.target.value)}
                placeholder="Transforming complex enterprise technology into simple, intuitive, and easy-to-use software that empowers everyday business."
                className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)] font-medium"
              />
            </div>
          </div>

          {/* Card 2: Corporate Profile Highlight Card */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Corporate Profile Highlight Card</h3>
                <p className="text-xs text-[var(--muted)]">The large dark feature card displaying corporate bio, office photo &amp; organization details</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c3)] uppercase px-2 py-0.5 rounded-full bg-[var(--dark)] text-white">
                Left Card
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                Corporate Bio &amp; Operations Description
              </label>
              <p className="text-[11px] text-[var(--muted)] mb-1.5">
                The main paragraph text inside the Corporate Profile card (under company name and domain).
              </p>
              <textarea
                rows={3}
                value={pageData.about?.corporateBio || ''}
                onChange={(e) => handlePageChange('about', 'corporateBio', e.target.value)}
                placeholder="Headquartered in Sector V, Kolkata, we engineer reliable Windows desktop software, native Android applications, and enterprise web solutions engineered with 100% operational autonomy."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)] leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[var(--ink)]">
                  Founder Avatar Link (Square Portrait)
                </label>
                <input
                  type="text"
                  value={pageData.about?.founderPhoto || ''}
                  onChange={(e) => handlePageChange('about', 'founderPhoto', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                />
                {pageData.about?.founderPhoto && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--line)]">
                    <img src={pageData.about.founderPhoto} alt="Founder Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[var(--ink)]">
                  Office / Engineering Background Image
                </label>
                <input
                  type="text"
                  value={pageData.about?.officePhoto || ''}
                  onChange={(e) => handlePageChange('about', 'officePhoto', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                />
                {pageData.about?.officePhoto && (
                  <div className="w-full h-16 rounded-lg overflow-hidden border border-[var(--line)]">
                    <img src={pageData.about.officePhoto} alt="Office Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: 4 Engineering Domains */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Four Engineering Domains (Domain 01 - 04)</h3>
                <p className="text-xs text-[var(--muted)]">Editable cards displayed on the right grid of the About Us section</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase px-2 py-0.5 rounded-full bg-[var(--soft)] border border-[var(--line)]">
                4 Domains
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(pageData.about?.domains || LANDING_PAGE_SECTIONS?.about?.domains || []).map((dom, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-[var(--c1)]">
                      {dom.tag || `Domain 0${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">Slot 0{idx + 1}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Domain Title</label>
                    <input
                      type="text"
                      value={dom.title || ''}
                      onChange={(e) => handleDomainChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={dom.desc || ''}
                      onChange={(e) => handleDomainChange(idx, 'desc', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">Badge 1</label>
                      <input
                        type="text"
                        value={dom.badge1 || ''}
                        onChange={(e) => handleDomainChange(idx, 'badge1', e.target.value)}
                        className="w-full px-2 py-1 rounded-md border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">Badge 2</label>
                      <input
                        type="text"
                        value={dom.badge2 || ''}
                        onChange={(e) => handleDomainChange(idx, 'badge2', e.target.value)}
                        className="w-full px-2 py-1 rounded-md border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. TEAM & ARCHITECTS TAB                                      */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'team' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Team Section Headlines</h3>
                <p className="text-xs text-[var(--muted)]">Main headline and introductory lead introducing the software architects</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Team Intro</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Team Section Headline</label>
              <input
                type="text"
                value={pageData.team?.headline || ''}
                onChange={(e) => handlePageChange('team', 'headline', e.target.value)}
                placeholder="The minds behind the software architecture"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Team Section Lead Paragraph</label>
              <textarea
                rows={2}
                value={pageData.team?.lead || ''}
                onChange={(e) => handlePageChange('team', 'lead', e.target.value)}
                placeholder="Led by founder Sayantan Ghosh and co-founder Soham Dutta, our engineers build robust offline and cloud-connected software solutions with high performance."
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>
          </div>

          {/* 4 Team Members */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Core Engineering Team &amp; Architects (4 Members)</h3>
                <p className="text-xs text-[var(--muted)]">Customize name, role, photo portrait link, and background bio for each architect</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">4 Architects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(pageData.team?.members || TEAM_MEMBERS).map((member, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-[var(--c1)]">
                      Architect 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">
                      {idx === 0 ? 'Founder' : idx === 1 ? 'Co-Founder' : 'Core Engineer'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Full Name</label>
                    <input
                      type="text"
                      value={member.name || ''}
                      onChange={(e) => handleTeamMemberChange(idx, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Role / Position Title</label>
                    <input
                      type="text"
                      value={member.role || ''}
                      onChange={(e) => handleTeamMemberChange(idx, 'role', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Photo Avatar Link</label>
                    <input
                      type="text"
                      value={member.avatar || ''}
                      onChange={(e) => handleTeamMemberChange(idx, 'avatar', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  {member.avatar && (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[var(--line)] bg-stone-100">
                      <img
                        src={member.avatar}
                        alt={member.name || 'Architect'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Bio / Responsibilities</label>
                    <textarea
                      rows={2}
                      value={member.bio || ''}
                      onChange={(e) => handleTeamMemberChange(idx, 'bio', e.target.value)}
                      placeholder="Engineering focus, architecture standards, or product leadership..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. APP SERVICES SECTION TAB                                   */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'services' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">App Services Copy</h3>
                <p className="text-xs text-[var(--muted)]">Headline and lead paragraph introducing engineering capabilities</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Services</span>
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
                placeholder="From offline Windows billing software and thermal receipt printing to cloud enterprise applications, we build robust systems with zero downtime."
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
      {/* 6. APPLICATIONS ECOSYSTEM TAB                                 */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Software Ecosystem Blueprint</h3>
                <p className="text-xs text-[var(--muted)]">Section eyebrow, title and introduction copy for 5 proprietary systems</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Applications</span>
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
      {/* 7. FEATURED PRODUCT TAB                                       */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'featuredProduct' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Featured Product (Finance Flow)</h3>
                <p className="text-xs text-[var(--muted)]">Interactive terminal calculator headline, lead, and station background image</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Featured Product</span>
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

          {/* 4-Step Invoicing Workflow Pipeline */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">4-Step Invoicing Workflow Pipeline</h3>
                <p className="text-xs text-[var(--muted)]">Customize the 4 horizontal step badges (Time, Title, and Description) below the simulator</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">4 Pipeline Steps</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(pageData.featuredProduct.steps || DEFAULT_WORKFLOW_STEPS).map((st, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-[var(--c1)]">
                      Pipeline Step 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">Rail Item</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Step Time Badge</label>
                    <input
                      type="text"
                      value={st.time || ''}
                      onChange={(e) => handleStepChange(idx, 'time', e.target.value)}
                      placeholder={`Step 0${idx + 1} · 0.0s`}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs font-mono font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Step Title</label>
                    <input
                      type="text"
                      value={st.title || ''}
                      onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Instant Item Entry"
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Step Description</label>
                    <textarea
                      rows={2}
                      value={st.text || ''}
                      onChange={(e) => handleStepChange(idx, 'text', e.target.value)}
                      placeholder="Keyboard-first rapid shortcut lookup..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. WHY CHOOSE US TAB                                          */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'whyChooseUs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Why Choose Us Pillars Copy</h3>
                <p className="text-xs text-[var(--muted)]">Section headline and lead copy</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Pillars</span>
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
                rows={3}
                value={pageData.whyChooseUs.lead || ''}
                onChange={(e) => handlePageChange('whyChooseUs', 'lead', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>
          </div>

          {/* 5 Pillar Card Images */}
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">5 Pillar Card Background Images</h3>
                <p className="text-xs text-[var(--muted)]">Real photography links for each of the 5 core capability cards</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Photos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Pillar 1: Experienced Team',
                'Pillar 2: Quality & Security',
                'Pillar 3: Custom Solutions',
                'Pillar 4: On-Time Delivery',
                'Pillar 5: Operational Autonomy'
              ].map((label, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                  <span className="text-[11px] font-bold text-[var(--ink)] block truncate">{label}</span>
                  <input
                    type="text"
                    value={pageData.whyChooseUs.pillarImages[idx] || ''}
                    onChange={(e) => handlePillarImageChange(idx, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[11px] text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                  />
                  {pageData.whyChooseUs.pillarImages[idx] && (
                    <div className="w-full h-24 rounded-lg bg-stone-100 overflow-hidden border border-[var(--line)]">
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
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. REVIEWS & SOCIAL PROOF TAB                                 */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Verified Social Proof &amp; Testimonial</h3>
                <p className="text-xs text-[var(--muted)]">Hero pull-quote and verified business client credentials</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Reviews</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Featured Testimonial Quote</label>
              <textarea
                rows={3}
                value={pageData.reviewsSection.headlineQuote || ''}
                onChange={(e) => handlePageChange('reviewsSection', 'headlineQuote', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Author Name</label>
                <input
                  type="text"
                  value={pageData.reviewsSection.quoteAuthor || ''}
                  onChange={(e) => handlePageChange('reviewsSection', 'quoteAuthor', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Author Business &amp; Location</label>
                <input
                  type="text"
                  value={pageData.reviewsSection.authorMeta || ''}
                  onChange={(e) => handlePageChange('reviewsSection', 'authorMeta', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 10. DOWNLOAD RELEASES TAB                                     */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'download' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Download Center Copy</h3>
                <p className="text-xs text-[var(--muted)]">Header, description and digital safety guarantee notice</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Downloads</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Section Eyebrow</label>
              <input
                type="text"
                value={pageData.downloadSection?.eyebrow || ''}
                onChange={(e) => handlePageChange('downloadSection', 'eyebrow', e.target.value)}
                placeholder="Application Releases"
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
      {/* 11. CONTACT & FOOTER TAB                                      */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'contactFooter' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Contact Desk &amp; Hardware Mockup</h3>
                <p className="text-xs text-[var(--muted)]">Lead text, hardware counter photo, and footer floating orb call-to-action</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[var(--c1)] uppercase">Contact &amp; Footer</span>
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
                    value={pageData.contact.footerCtaEyebrow || 'Enterprise Precision • Zero Latency'}
                    onChange={(e) => handlePageChange('contact', 'footerCtaEyebrow', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={pageData.contact.footerCtaTitle || 'Bring calm, high-performance precision to your billing counter.'}
                    onChange={(e) => handlePageChange('contact', 'footerCtaTitle', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:bg-white focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Save Bar */}
      <div className="fixed bottom-4 sm:bottom-6 left-0 lg:left-72 right-0 z-30 pointer-events-none px-4 sm:px-6">
        <div className="max-w-5xl mx-auto p-3.5 sm:p-4 bg-white/95 backdrop-blur-md border border-[var(--line)] shadow-2xl rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-medium text-[var(--ink)]">
              All modifications save directly to the MongoDB backend and reflect live across the site.
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
                type="button"
                onClick={handleResetFormToLatest}
                className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-stone-200 text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer flex items-center gap-1.5"
                title="Discard unsaved edits and reload latest saved version from database"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Reset to Saved</span>
              </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving || isLocalSaving}
              className={`px-6 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[var(--c1)] hover:bg-[#d64b22] text-white'
              }`}
            >
              {(isSaving || isLocalSaving) ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
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
      </div>
      </>
    )}

      {/* Updating / Saving Live Loading Modal Overlay */}
      {(isSaving || isLocalSaving) && (
        <div className="fixed inset-0 z-[9999] bg-stone-900/30 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-stone-200/90 flex flex-col items-center gap-3.5 max-w-sm w-full text-center">
            <div className="w-10 h-10 rounded-full border-3 border-stone-200 border-t-[var(--c1)] animate-spin" />
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-[var(--ink)]">Saving Customization Changes</h4>
              <p className="text-xs text-[var(--muted)] font-mono">Writing updates to MongoDB Atlas &amp; broadcasting live...</p>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-1">
              <div className="h-full bg-[var(--c1)] rounded-full animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
