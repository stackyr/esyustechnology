import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Wrench, X, Layers, Code, Clock, Link as LinkIcon } from 'lucide-react';

export default function ServicesTab({ services = [], onAddService, onUpdateService, onDeleteService }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    title: '',
    badge: 'Core Service',
    iconName: 'Globe',
    shortDesc: '',
    fullDesc: '',
    isComingSoon: false,
    actionUrl: '',
    featuresText: '',
    techStackText: ''
  });

  const openAddModal = () => {
    setEditingService(null);
    setForm({
      title: '',
      badge: 'Core Service',
      iconName: 'Globe',
      shortDesc: '',
      fullDesc: '',
      isComingSoon: false,
      actionUrl: '',
      featuresText: 'High-speed offline runtime\nOptimized database synchronization\nEnd-to-end technical support',
      techStackText: 'React, Node.js, SQLite'
    });
    setModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setForm({
      title: srv.title || '',
      badge: srv.badge || 'Core Service',
      iconName: srv.iconName || 'Globe',
      shortDesc: srv.shortDesc || '',
      fullDesc: srv.fullDesc || '',
      isComingSoon: !!srv.isComingSoon,
      actionUrl: srv.actionUrl || '',
      featuresText: (srv.features || []).join('\n'),
      techStackText: (srv.techStack || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceData = {
      title: form.title,
      badge: form.badge,
      iconName: form.iconName,
      shortDesc: form.shortDesc,
      fullDesc: form.fullDesc,
      isComingSoon: Boolean(form.isComingSoon),
      actionUrl: form.actionUrl.trim(),
      features: form.featuresText.split('\n').map(s => s.trim()).filter(Boolean),
      techStack: form.techStackText.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingService) {
      onUpdateService(editingService.id, serviceData);
    } else {
      onAddService(serviceData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold">
            Service Catalog ({services.length})
          </span>
          <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight mt-0.5">
            Engineering &amp; Software Services
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Configure capabilities, technology stacks, feature lists, and Coming Soon flags for Section 04.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-[var(--c1)] hover:bg-[#d65a2f] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-2xl bg-white border border-[var(--line)] shadow-xs flex flex-col justify-between space-y-4 hover:border-[var(--c1)]/50 transition-colors"
          >
            <div className="space-y-3">
              {/* Badge & Actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--soft)] text-[var(--c1)] border border-[var(--line)]">
                    {srv.badge}
                  </span>

                  {srv.isComingSoon && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" /> Coming Soon
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(srv)}
                    className="p-1.5 rounded-lg text-stone-600 hover:text-[var(--ink)] hover:bg-[var(--soft)] transition-colors cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete service "${srv.title}"?`)) {
                        onDeleteService(srv.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">{srv.title}</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed mt-1">
                  {srv.shortDesc}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-1.5 pt-2 border-t border-[var(--line)]">
                {(srv.features || []).slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[var(--ink)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--c1)] shrink-0 mt-0.5" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Chips Footer */}
            <div className="pt-3 border-t border-[var(--line)] flex flex-wrap gap-1">
              {(srv.techStack || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--soft)] border border-[var(--line)] text-[var(--ink)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[var(--line)] overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">
                  {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service Capability'}
                </h3>
                <p className="text-[11px] text-[var(--muted)] font-mono">
                  Modify service deliverables, features, and technology stack
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
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Website Development"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Core Service, Flagship, Cross-Platform"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>
              </div>

              {/* Coming Soon Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[var(--line)]">
                <input
                  type="checkbox"
                  id="srvComingSoon"
                  checked={form.isComingSoon}
                  onChange={(e) => setForm({ ...form, isComingSoon: e.target.checked })}
                  className="w-4 h-4 rounded text-[var(--c1)] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="srvComingSoon" className="text-xs font-semibold text-[var(--ink)] cursor-pointer">
                  Mark as "Coming Soon" Service Capability
                </label>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Card Short Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="One sentence summary displayed on the service card"
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Full Service Blueprint
                </label>
                <textarea
                  rows={3}
                  placeholder="In-depth description shown when the visitor expands the service modal"
                  value={form.fullDesc}
                  onChange={(e) => setForm({ ...form, fullDesc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              {/* Features (One per line) */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Key Deliverables &amp; Features (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mobile-First Responsive Layouts&#10;SEO &amp; Core Web Vitals Optimization&#10;Modern UI/UX with Sleek Typography"
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Technology Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Next.js, Tailwind CSS, Vite"
                  value={form.techStackText}
                  onChange={(e) => setForm({ ...form, techStackText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--c1)]"
                />
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
                  {editingService ? 'Update Service' : 'Save New Service'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
