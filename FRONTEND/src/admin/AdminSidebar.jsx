import React from 'react';
import { Mail, Building, LayoutTemplate, Sliders, Wrench, Package, HelpCircle, ExternalLink, RefreshCw, X, Shield, ArrowLeft, Database, CheckCircle2, LogOut } from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onBackToSite,
  onLogout,
  inquiriesCount = 0,
  unreadCount = 0,
  servicesCount = 0,
  productsCount = 0,
  faqsCount = 0,
  isBackendConnected = true,
  isMongoConnected = false,
  onRefresh,
  isRefreshing = false,
  isOpenMobile = false,
  onCloseMobile
}) {
  const navItems = [
    {
      id: 'inquiries',
      label: 'Inquiries & Leads',
      desc: 'Form submissions & proposals',
      icon: Mail,
      badge: unreadCount > 0 ? `${unreadCount} New` : null,
      count: inquiriesCount,
      highlight: unreadCount > 0
    },
    {
      id: 'customization',
      label: 'Website Customization',
      desc: 'Brand, landing copy & visual links',
      icon: Sliders
    },
    {
      id: 'services',
      label: 'App Services',
      desc: 'Engineering capabilities',
      icon: Wrench,
      count: servicesCount
    },
    {
      id: 'products',
      label: 'Applications & Specs',
      desc: 'Packages & offline specs',
      icon: Package,
      count: productsCount
    },
    {
      id: 'faqs',
      label: 'FAQ Management',
      desc: 'Accordion questions & answers',
      icon: HelpCircle,
      count: faqsCount
    }
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 bg-[#fbf9f4] border-r border-[var(--line)] text-[var(--ink)]">
      
      {/* Top Brand & Mode Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--dark)] text-[var(--bg)] flex items-center justify-center font-bold shadow-md shrink-0">
              <span className="font-serif italic text-2xl text-[var(--c1)]">E</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-[var(--ink)] tracking-tight">
                  Esyus <em className="s font-normal">Admin</em>
                </h1>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-[var(--soft)] text-[var(--c1)] border border-[var(--line)] uppercase">
                  MERN
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)] font-mono">
                Fullstack Control Suite
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl border border-[var(--line)] text-stone-500 hover:text-[var(--ink)] hover:bg-[var(--soft)] cursor-pointer"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Database Connection Pill */}
        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-mono transition-colors ${
            isMongoConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-900'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isMongoConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <div className="flex-1 truncate">
            <span className="font-bold block truncate">
              {isMongoConnected ? 'MongoDB Connected' : 'MERN Engine Active'}
            </span>
            <span className="text-[10px] text-[var(--muted)] block truncate">
              {isMongoConnected ? 'Mongoose Models Synced' : 'Express :5000 + Local DB'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 pt-2">
          <div className="text-[10px] uppercase font-mono tracking-widest text-[var(--muted)] font-bold px-3 pb-1">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[var(--dark)] text-[var(--bg)] shadow-md font-bold'
                    : 'text-[var(--ink)] hover:bg-[var(--soft)] font-medium border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive ? 'bg-white/10 text-[var(--c3)]' : 'bg-[var(--soft)] text-[var(--ink)] group-hover:bg-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">{item.label}</span>
                    <span className={`text-[10px] block truncate ${isActive ? 'text-stone-300' : 'text-[var(--muted)]'}`}>
                      {item.desc}
                    </span>
                  </div>
                </div>

                {/* Badge / Count */}
                {item.badge ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold animate-badge-glow shadow-[0_0_12px_rgba(232,105,60,0.45)] shrink-0 ${
                    isActive ? 'bg-[var(--c1)] text-white' : 'bg-[var(--c1)] text-white'
                  }`}>
                    {item.badge}
                  </span>
                ) : item.count !== undefined ? (
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-lg shrink-0 ${
                    isActive ? 'bg-white/10 text-stone-300' : 'bg-[var(--soft)] text-[var(--muted)]'
                  }`}>
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions inside Sidebar */}
      <div className="pt-4 border-t border-[var(--line)] space-y-2">
        {/* Refresh Database */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-white text-xs font-bold text-[var(--ink)] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--c1)]' : 'text-[var(--muted)]'}`} />
            <span>Sync Database</span>
          </span>
          <span className="text-[10px] font-mono text-[var(--muted)]">Live</span>
        </button>

        {/* View Public Website */}
        <button
          type="button"
          onClick={onBackToSite}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-white text-xs font-bold text-[var(--ink)] transition-colors cursor-pointer"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)]" />
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out Admin</span>
          </button>
        )}

        {/* Small Copyright */}
        <p className="text-[10px] text-center text-[var(--muted)] font-mono pt-1">
          © 2026–2027 Esyus Technologies
        </p>
      </div>

    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-30 shadow-xs">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Responsive Slide-Over Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isOpenMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />

        {/* Slide-in Sidebar Panel */}
        <div
          className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
            isOpenMobile ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}

