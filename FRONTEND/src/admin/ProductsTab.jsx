import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Package, X, Star, Monitor, Smartphone, Download, Cpu, HardDrive } from 'lucide-react';

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
    tagline: '',
    description: '',
    badge: 'Desktop App',
    isFeatured: false,
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
      tagline: 'High-performance software built for reliability.',
      description: 'Engineered for seamless offline business productivity.',
      badge: 'Desktop App',
      isFeatured: false,
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
      tagline: prod.tagline || '',
      description: prod.description || '',
      badge: prod.badge || '',
      isFeatured: !!prod.isFeatured,
      specsText: (prod.highlights || []).join('\n')
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name: form.name,
      category: form.category,
      platform: form.platform,
      version: form.version,
      size: form.size,
      downloadFile: form.downloadFile,
      tagline: form.tagline,
      description: form.description,
      badge: form.badge,
      isFeatured: form.isFeatured,
      highlights: form.specsText.split('\n').map(s => s.trim()).filter(Boolean)
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
      <div className="p-5 rounded-2xl bg-white border border-[var(--line)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold">
            Applications & Software Suite ({products.length})
          </span>
          <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight mt-0.5">
            Software Products & Specifications
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Configure application releases, system specs, offline capabilities, versions, and installer packages.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-[var(--c1)] hover:bg-[#d65a2f] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Application</span>
        </button>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((prod) => {
          const isAndroid = prod.platform.toLowerCase().includes('android');
          return (
            <div
              key={prod.id}
              className={`p-6 rounded-2xl bg-white border shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                prod.isFeatured ? 'border-[var(--c1)] ring-1 ring-[var(--c1)]/30' : 'border-[var(--line)]'
              }`}
            >
              <div className="space-y-3.5">
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
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured Flagship
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-[var(--ink)] hover:bg-[var(--soft)] transition-colors cursor-pointer"
                      title="Edit Product & Specs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
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
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name, Category & Tagline */}
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">{prod.name}</h3>
                  <span className="text-xs font-semibold text-[var(--c1)] uppercase font-mono tracking-wider">
                    {prod.category}
                  </span>
                  <p className="text-xs text-[var(--muted)] leading-relaxed mt-1">
                    {prod.tagline}
                  </p>
                </div>

                {/* Specs & Capabilities Box */}
                <div className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> System Specs & Features ({prod.highlights?.length || 0})
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">100% Offline Autonomy</span>
                  </div>

                  <div className="space-y-1">
                    {(prod.highlights || []).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[var(--ink)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--c1)] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Package & Installer Footer */}
              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[var(--muted)] truncate max-w-[200px]" title={prod.downloadFile}>
                  <Download className="w-3.5 h-3.5 shrink-0 text-[var(--c1)]" />
                  <span className="truncate">{prod.downloadFile}</span>
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
                  Modify application details, release version, and technical specs
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Application Name */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Application Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Finance Flow Pro"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Download Filename */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Download Installer Filename
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

              {/* Specifications & Highlights (MAIN FOCUS FOR SPECS) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[var(--c1)] uppercase tracking-wider font-mono">
                    Specifications & Capabilities (One per line)
                  </label>
                  <span className="text-[10px] text-[var(--muted)]">Shown in modal & cards</span>
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

