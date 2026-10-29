import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Wrench, X, Layers, Code } from 'lucide-react';

export default function ServicesTab({ services = [], onAddService, onUpdateService, onDeleteService }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    title: '',
    badge: 'Core Service',
    iconName: 'Globe',
    shortDesc: '',
    fullDesc: '',
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
      <div className="p-5 rounded-2xl bg-white border border-[var(--line)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold">
            Service Catalog ({services.length})
          </span>
          <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight mt-0.5">
            Engineering & Software Services
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Add, edit or remove services offered by Esyus Technologies shown in Section 04 of the website.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-[var(--c1)] hover:bg-[#d65a2f] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-2xl bg-white border border-[var(--line)] shadow-xs flex flex-col justify-between space-y-4 hover:border-[var(--c1)]/50 transition-colors"
          >
            <div className="space-y-3">
              {/* Badge & Actions */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--soft)] text-[var(--c1)] border border-[var(--line)]">
                  {srv.badge}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(srv)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-[var(--ink)] hover:bg-[var(--soft)] transition-colors cursor-pointer"
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

              {/* Title & Short Description */}
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">{srv.title}</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed mt-1">
                  {srv.shortDesc}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold block">
                  Key Deliverables:
                </span>
                {(srv.features || []).slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[var(--ink)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--c1)] shrink-0 mt-0.5" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
                {(srv.features || []).length > 3 && (
                  <span className="text-[10px] text-[var(--muted)] font-mono block">
                    +{(srv.features || []).length - 3} more deliverables
                  </span>
                )}
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div className="pt-3 border-t border-[var(--line)]">
              <div className="flex flex-wrap gap-1">
                {(srv.techStack || []).map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--soft)] text-[var(--ink)] border border-[var(--line)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[var(--line)] overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--ink)]">
                {editingService ? `Edit Service: ${editingService.title}` : 'Add New Engineering Service'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-[var(--ink)] hover:bg-[var(--soft)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud ERP Integration"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Core Service, Flagship"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                    Icon Name (Lucide)
                  </label>
                  <select
                    value={form.iconName}
                    onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                  >
                    <option value="Globe">Globe (Websites)</option>
                    <option value="Layout">Layout (Web Apps)</option>
                    <option value="Smartphone">Smartphone (Mobile)</option>
                    <option value="Cpu">Cpu (Android & Hardware)</option>
                    <option value="Monitor">Monitor (Windows Desktop)</option>
                    <option value="Code2">Code2 (Custom Software)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Short Description (Card lead)
                </label>
                <input
                  type="text"
                  placeholder="One sentence summary of the service"
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Full Detailed Description (Modal view)
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed architectural and business capabilities"
                  value={form.fullDesc}
                  onChange={(e) => setForm({ ...form, fullDesc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Deliverable Bullet Points (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter each feature on a new line"
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Tech Stack Chips (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Next.js, Electron, SQLite"
                  value={form.techStackText}
                  onChange={(e) => setForm({ ...form, techStackText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              {/* Modal Action Buttons */}
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
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

