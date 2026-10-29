import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Package,
  X,
  Star,
  Monitor,
  Smartphone,
  Download,
  Cpu,
  Clock,
  Link as LinkIcon,
  Image as ImageIcon,
  Tag,
  ExternalLink
} from 'lucide-react';

export default function ProductsTab({ products = [], onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Desktop Billing',
    platform: 'Windows 10 / 11',
    version: 'v1.0.0',
    size: '25.0 MB',
    downloadFile: 'App-Setup.exe',
    downloadUrl: '',
    isComingSoon: true,
    logo: '/finance-flow-logo.png',
    image: '/card-finance-flow.png',
    tagline: '',
    description: '',
    badge: 'Desktop App',
    isFeatured: false,
    chipsText: '⚡ 0.2s Keystrokes, 🔒 Encrypted SQLite DB, 🖨️ Thermal 2"/3" & A4',
    specsText: ''
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: 'Desktop Billing',
      platform: 'Windows 10 / 11',
      version: 'v1.0.0',
      size: '25.0 MB',
      downloadFile: 'Setup.exe',
      downloadUrl: '',
      isComingSoon: true,
      logo: '/finance-flow-logo.png',
      image: '/card-finance-flow.png',
      tagline: 'High-performance software built for reliability.',
      description: 'Engineered for seamless offline business productivity.',
      badge: 'Desktop App',
      isFeatured: false,
      chipsText: '⚡ 100% Offline, 🔒 Local Database, 🖨️ Hardware Ready',
      specsText: 'Works 100% offline with zero cloud dependency\nEncrypted local SQLite database\nInstant thermal printer & barcode integration'
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name || '',
      category: prod.category || '',
      platform: prod.platform || '',
      version: prod.version || '',
      size: prod.size || '',
      downloadFile: prod.downloadFile || '',
      downloadUrl: prod.downloadUrl || '',
      isComingSoon: prod.isComingSoon !== false,
      logo: prod.logo || '/finance-flow-logo.png',
      image: prod.image || '',
      tagline: prod.tagline || '',
      description: prod.description || '',
      badge: prod.badge || '',
      isFeatured: !!prod.isFeatured,
      chipsText: Array.isArray(prod.chips) ? prod.chips.join(', ') : (prod.chips || ''),
      specsText: (prod.highlights || []).join('\n')
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const chips = form.chipsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productData = {
      name: form.name,
      category: form.category,
      platform: form.platform,
      version: form.version,
      size: form.size,
      downloadFile: form.downloadFile,
      downloadUrl: form.downloadUrl.trim(),
      isComingSoon: Boolean(form.isComingSoon),
      logo: form.logo.trim(),
      image: form.image.trim(),
      tagline: form.tagline,
      description: form.description,
      badge: form.badge,
      isFeatured: form.isFeatured,
      chips,
      highlights: form.specsText.split('\n').map((s) => s.trim()).filter(Boolean)
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
    } else {
      onAddProduct(productData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold">
            Applications & Software Suite ({products.length})
          </span>
          <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight mt-0.5">
            Software Products, Releases & Links
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Configure download URLs, "Coming Soon" vs active link toggles, logos, specs, and offline capabilities.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-[var(--c1)] hover:bg-[#d65a2f] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Application</span>
        </button>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((prod) => {
          const isAndroid = (prod.platform || '').toLowerCase().includes('android');
          const isComingSoon = prod.isComingSoon !== false;
          const hasDownloadUrl = Boolean(prod.downloadUrl);

          return (
            <div
              key={prod.id}
              className={`p-6 rounded-2xl bg-white border shadow-xs flex flex-col justify-between space-y-5 transition-all ${
                prod.isFeatured ? 'border-[var(--c1)] ring-1 ring-[var(--c1)]/30' : 'border-[var(--line)]'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Platform, Version, Featured Badge & Actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--soft)] text-[var(--ink)] border border-[var(--line)] flex items-center gap-1">
                      {isAndroid ? <Smartphone className="w-3 h-3 text-[var(--c1)]" /> : <Monitor className="w-3 h-3 text-[var(--c1)]" />}
                      <span>{prod.platform}</span>
                    </span>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--soft)] text-[var(--c1)] border border-[var(--line)]">
                      {prod.version}
                    </span>

                    {prod.isFeatured && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Flagship
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-[var(--ink)] hover:bg-[var(--soft)] transition-colors cursor-pointer"
                      title="Edit Product, Links & Specs"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete product "${prod.name}"?`)) {
                          onDeleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Logo & Product Identity Banner */}
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-[var(--soft)] border border-[var(--line)] p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                    <img
                      src={prod.logo || '/finance-flow-logo.png'}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/finance-flow-logo.png';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-[var(--ink)] truncate">
                        {prod.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-[var(--c1)] uppercase font-mono tracking-wider shrink-0">
                        {prod.category}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--muted)] leading-relaxed mt-1 line-clamp-2">
                      {prod.tagline || prod.description}
                    </p>
                  </div>
                </div>

                {/* Release Mode & Download Link Pill */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    !isComingSoon && hasDownloadUrl
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {!isComingSoon && hasDownloadUrl ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <div className="truncate">
                          <span className="font-bold block truncate">Direct Download Active</span>
                          <span className="text-[10px] text-stone-600 font-mono block truncate" title={prod.downloadUrl}>
                            {prod.downloadUrl}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold block">Coming Soon Status Active</span>
                          <span className="text-[10px] text-stone-500 block">
                            Visitor sees illuminated "Coming Soon" badge
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {!isComingSoon && hasDownloadUrl && (
                    <a
                      href={prod.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-lg bg-white border border-emerald-500/20 text-emerald-700 hover:text-emerald-900 shrink-0 shadow-xs"
                      title="Open Download Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Technical Chips Tags */}
                {Array.isArray(prod.chips) && prod.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prod.chips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--soft)] border border-[var(--line)] text-[var(--ink)]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}

                {/* Specs Box */}
                <div className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> System Specs & Features ({prod.highlights?.length || 0})
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">100% Offline Autonomy</span>
                  </div>

                  <div className="space-y-1">
                    {(prod.highlights || []).slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[var(--ink)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--c1)] shrink-0 mt-0.5" />
                        <span className="leading-snug truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Package & Installer Footer */}
              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[var(--muted)] truncate max-w-[200px]" title={prod.downloadFile}>
                  <Download className="w-3.5 h-3.5 shrink-0 text-[var(--c1)]" />
                  <span className="truncate">{prod.downloadFile || 'Installer Package'}</span>
                </div>
                <div className="font-bold text-[var(--ink)] bg-[var(--soft)] px-2.5 py-1 rounded-md border border-[var(--line)]">
                  {prod.size}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[var(--line)] overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">
                  {editingProduct ? `Edit Application: ${editingProduct.name}` : 'Add New Application Package'}
                </h3>
                <p className="text-[11px] text-[var(--muted)] font-mono">
                  Modify application details, release links, Coming Soon mode, and technical specs
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-[var(--ink)] hover:bg-[var(--soft)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              
              {/* Release Link vs Coming Soon Controller */}
              <div className="p-4 rounded-2xl bg-white border border-[var(--line)] space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--c1)] font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Release Status & Download URL Controller
                </span>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="isComingSoon"
                      checked={form.isComingSoon === true}
                      onChange={() => setForm({ ...form, isComingSoon: true })}
                      className="text-[var(--c1)] focus:ring-0"
                    />
                    <span>Coming Soon (In Preparation)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-800">
                    <input
                      type="radio"
                      name="isComingSoon"
                      checked={form.isComingSoon === false}
                      onChange={() => setForm({ ...form, isComingSoon: false })}
                      className="text-emerald-600 focus:ring-0"
                    />
                    <span>Live Download Link Active</span>
                  </label>
                </div>

                {!form.isComingSoon && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-emerald-800 mb-1">
                      Direct Download Link URL *
                    </label>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                      <input
                        type="url"
                        required={!form.isComingSoon}
                        placeholder="https://downloads.esyustechnologies.com/FinanceFlow-Setup.exe"
                        value={form.downloadUrl}
                        onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-500/40 bg-emerald-50/30 text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Application Name */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Application Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Finance Flow"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Desktop Billing, Travel Companion"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Platform */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Platform
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Windows 10 / 11 or Android 8.0+"
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>

                {/* Version */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. v2.4.0"
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>

                {/* Package Size */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    File Package Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 48.2 MB"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>
              </div>

              {/* Logo URL & Card Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Logo Image URL / Path
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="/finance-flow-logo.png"
                      value={form.logo}
                      onChange={(e) => setForm({ ...form, logo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                    {form.logo && (
                      <div className="w-8 h-8 rounded-lg bg-stone-100 border border-[var(--line)] p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={form.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Card Preview Image URL / Path
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="/card-finance-flow.png"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                    />
                    {form.image && (
                      <div className="w-8 h-8 rounded-lg bg-stone-100 border border-[var(--line)] p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Download Filename */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Installer Filename
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FinanceFlow-Setup.exe"
                    value={form.downloadFile}
                    onChange={(e) => setForm({ ...form, downloadFile: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flagship Desktop, Low Footprint"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>
              </div>

              {/* Technical Chips Tags */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Technical Highlight Chips (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="⚡ 0.2s Keystrokes, 🔒 Encrypted SQLite DB, 🖨️ Thermal 2&quot;/3&quot; &amp; A4"
                  value={form.chipsText}
                  onChange={(e) => setForm({ ...form, chipsText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Tagline (Short Summary)
                </label>
                <input
                  type="text"
                  placeholder="One sentence tagline describing the app"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Blueprint / Description Overview
                </label>
                <textarea
                  rows={2}
                  placeholder="Comprehensive description of product use cases and design philosophy"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              {/* Specifications & Highlights */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[var(--c1)] uppercase tracking-wider font-mono">
                    Specifications & Capabilities (One per line)
                  </label>
                  <span className="text-[10px] text-[var(--muted)]">Shown in modal & specs box</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Works 100% offline with zero cloud dependency&#10;Compliant with current GST tax slabs&#10;Thermal (2&quot;/3&quot;) and Laser A4/A5 printing&#10;Instant barcode scanning & stock tracking"
                  value={form.specsText}
                  onChange={(e) => setForm({ ...form, specsText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] font-mono leading-relaxed focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              {/* Featured Flag */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-[var(--c1)] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-[var(--ink)] cursor-pointer">
                  Mark as Featured Flagship Application (Highlighted in Section 06)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--c1)] hover:bg-[#d65a2f] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  {editingProduct ? 'Update Application & Specs' : 'Save New Application'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
