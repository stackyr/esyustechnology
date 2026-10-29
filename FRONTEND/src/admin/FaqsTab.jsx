import React, { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, X, Check } from 'lucide-react';

export default function FaqsTab({ faqs = [], onAddFaq, onUpdateFaq, onDeleteFaq }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const [form, setForm] = useState({
    q: '',
    a: ''
  });

  const openAddModal = () => {
    setEditingFaq(null);
    setForm({ q: '', a: '' });
    setModalOpen(true);
  };

  const openEditModal = (faq, idx) => {
    setEditingFaq({ ...faq, _index: idx });
    setForm({
      q: faq.q || '',
      a: faq.a || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.q.trim() || !form.a.trim()) return;

    if (editingFaq) {
      onUpdateFaq(editingFaq.id || editingFaq._index, { q: form.q, a: form.a });
    } else {
      onAddFaq({ q: form.q, a: form.a });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-white border border-[var(--line)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold">
            Frequently Asked Questions ({faqs.length})
          </span>
          <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight mt-0.5">
            Knowledge Base & Clarifications
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Add, update, or remove question & answer pairs displayed in Section 12 on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-[var(--c1)] hover:bg-[#d65a2f] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* FAQ Items List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={faq.id || idx}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-[var(--line)] shadow-xs space-y-3 hover:border-[var(--c1)]/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-[var(--soft)] text-[var(--c1)] flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border border-[var(--line)]">
                  Q{idx + 1}
                </span>
                <h3 className="text-base font-bold text-[var(--ink)] leading-snug">
                  {faq.q}
                </h3>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(faq, idx)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-[var(--ink)] hover:bg-[var(--soft)] transition-colors cursor-pointer"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete question Q${idx + 1}?`)) {
                      onDeleteFaq(faq.id || idx);
                    }
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pl-10 text-xs sm:text-sm text-[var(--ink)]/85 leading-relaxed bg-[var(--soft)]/70 p-3.5 rounded-xl border border-[var(--line)]">
              {faq.a}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit FAQ Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg)] text-[var(--ink)] rounded-3xl max-w-xl w-full flex flex-col shadow-2xl border border-[var(--line)] overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--ink)]">
                {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Question'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-[var(--ink)] hover:bg-[var(--soft)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Does Finance Flow work with USB barcode scanners?"
                  value={form.q}
                  onChange={(e) => setForm({ ...form, q: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Comprehensive technical or operational answer..."
                  value={form.a}
                  onChange={(e) => setForm({ ...form, a: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] leading-relaxed focus:outline-none focus:border-[var(--c1)]"
                />
              </div>

              {/* Actions */}
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
                  {editingFaq ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
