import React from 'react';
import { Menu, RefreshCw, ExternalLink, LogOut } from 'lucide-react';

export default function AdminTopBar({
  activeTab,
  onOpenMobileSidebar,
  unreadCount = 0,
  onBackToSite,
  onLogout,
  onRefresh,
  isRefreshing
}) {
  const titles = {
    inquiries: { title: 'Inquiries & Customer Leads', sub: 'Section 11 Management • Real-time visitor proposals' },
    customization: { title: 'Website Customization & Brand Settings', sub: 'Master control for brand identity, copy & visual image links' },
    services: { title: 'Engineering & Software Services', sub: 'Section 04 Management • Core service catalog & tech stack' },
    products: { title: 'Software Applications & System Specs', sub: 'Section 05 & 10 Management • Installers & offline specs' },
    faqs: { title: 'FAQ & Knowledge Base Management', sub: 'Section 12 Management • Customer clarification accordion' },
  };

  const current = titles[activeTab] || titles.inquiries;

  return (
    <header className="sticky top-0 z-20 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--line)] px-3.5 sm:px-5 lg:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 min-w-0">
      
      {/* Left: Mobile Hamburger & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Hamburger Menu on Mobile & Tablet */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-stone-200 bg-white text-stone-800 hover:bg-stone-50 shadow-xs cursor-pointer relative shrink-0"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--c1)] absolute -top-1 -right-1 ring-2 ring-white animate-badge-glow shadow-[0_0_8px_rgba(232,105,60,0.6)]" />
          )}
        </button>

        {/* Title */}
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight truncate">
            {current.title}
          </h2>
          <p className="text-[11px] text-stone-500 font-mono truncate hidden sm:block">
            {current.sub}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer shrink-0"
          title="Refresh database"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[var(--c1)]' : ''}`} />
        </button>

        {/* View Public Website */}
        <button
          type="button"
          onClick={onBackToSite}
          className="px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <span className="hidden sm:inline">View Public Website</span>
          <span className="sm:hidden">Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
        </button>

        {/* Logout */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer shrink-0"
            title="Log out of Admin Panel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

    </header>
  );
}

