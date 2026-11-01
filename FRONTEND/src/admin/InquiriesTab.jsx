import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, CheckCircle2, AlertCircle, Trash2, Download, Search, RefreshCw, MessageSquare } from 'lucide-react';

export default function InquiriesTab({
  inquiries = [],
  onUpdateStatus,
  onDeleteInquiry,
  onRefresh,
  isRefreshing
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Counts
  const totalCount = inquiries.length;
  const newCount = inquiries.filter(i => (i.status || 'new') === 'new').length;
  const inProgressCount = inquiries.filter(i => i.status === 'in_progress').length;
  const resolvedCount = inquiries.filter(i => i.status === 'resolved').length;

  // Filter & Search
  const filteredInquiries = inquiries.filter((inq) => {
    // Status filter
    if (filterStatus !== 'all' && (inq.status || 'new') !== filterStatus) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = inq.name?.toLowerCase().includes(q);
      const matchEmail = inq.email?.toLowerCase().includes(q);
      const matchMobile = inq.mobile?.toLowerCase().includes(q);
      const matchSubject = inq.subject?.toLowerCase().includes(q);
      const matchMessage = inq.message?.toLowerCase().includes(q);
      const matchAddress = inq.address?.toLowerCase().includes(q);
      return matchName || matchEmail || matchMobile || matchSubject || matchMessage || matchAddress;
    }
    return true;
  });

  const exportToCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Mobile', 'Email', 'Address', 'Subject', 'Message', 'Status', 'Notes'];
    const rows = inquiries.map(i => [
      `"${i.id}"`,
      `"${new Date(i.createdAt).toLocaleString()}"`,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.mobile || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.address || '').replace(/"/g, '""')}"`,
      `"${(i.subject || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${i.status || 'new'}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `esyus-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Stat Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Inquiries */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--line)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold">
              Total Inquiries
            </span>
            <Mail className="w-4 h-4 text-[var(--muted)]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--ink)] mt-2">{totalCount}</p>
          <span className="text-[10px] text-[var(--muted)]">Received from all website forms</span>
        </div>

        {/* New / Action Needed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-900 font-bold">
              New (Pending)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-900 mt-2">{newCount}</p>
          <span className="text-[10px] text-amber-800 font-medium">Awaiting merchant callback</span>
        </div>

        {/* In Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-900 font-bold">
              In Progress
            </span>
            <Clock className="w-4 h-4 text-blue-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900 mt-2">{inProgressCount}</p>
          <span className="text-[10px] text-blue-800 font-medium">Under discussion / quotation</span>
        </div>

        {/* Resolved */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-900 font-bold">
              Resolved Leads
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-900 mt-2">{resolvedCount}</p>
          <span className="text-[10px] text-emerald-800 font-medium">Completed deals & installations</span>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Export & Simulation */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--line)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'new', label: `New (${newCount})` },
            { id: 'in_progress', label: `In Progress (${inProgressCount})` },
            { id: 'resolved', label: `Resolved (${resolvedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[var(--ink)] text-white shadow-xs'
                  : 'bg-[var(--soft)] text-[var(--ink)] hover:bg-[var(--line)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Search box */}
          <div className="relative w-full sm:w-auto sm:min-w-[200px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--c1)]"
            />
          </div>

          {/* Export CSV */}
          <button
            type="button"
            onClick={exportToCSV}
            className="p-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-white text-[var(--ink)] transition-colors cursor-pointer"
            title="Export Inquiries to CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Inquiries Cards List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[var(--line)] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--soft)] text-[var(--muted)] flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--ink)]">No inquiries found</h3>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto mt-1">
                {searchQuery || filterStatus !== 'all'
                  ? 'No inquiries match your current search or status filter.'
                  : 'No customer inquiries received yet. Any submissions from website forms will appear here live in real-time.'}
              </p>
            </div>
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const isNew = (inq.status || 'new') === 'new';
            const isInProgress = inq.status === 'in_progress';
            const isResolved = inq.status === 'resolved';

            return (
              <div
                key={inq.id}
                className={`p-5 sm:p-6 rounded-2xl bg-white border transition-all ${
                  isNew
                    ? 'border-l-4 border-l-amber-500 border-amber-500/40 shadow-sm'
                    : isInProgress
                    ? 'border-l-4 border-l-blue-500 border-[var(--line)]'
                    : 'border-l-4 border-l-emerald-500 border-[var(--line)] opacity-85'
                }`}
              >
                {/* Header Row: Submitter Name, Badges & Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[var(--line)]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-bold text-[var(--ink)]">
                      {inq.name}
                    </h3>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isNew
                          ? 'bg-amber-500/10 text-amber-800 border-amber-500/30'
                          : isInProgress
                          ? 'bg-blue-500/10 text-blue-800 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30'
                      }`}
                    >
                      ● {isNew ? 'New Inquiry' : isInProgress ? 'In Progress' : 'Resolved'}
                    </span>

                    {/* Type Badge */}
                    {inq.type === 'subscription' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-800 border border-purple-500/20 font-bold">
                        Release Subscriber
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(inq.createdAt)}</span>
                  </div>
                </div>

                {/* Submitter Contact Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-xs min-w-0">
                  {/* Phone */}
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-[var(--c1)] shrink-0" />
                    <span className="text-[var(--muted)] shrink-0">Mobile:</span>
                    {inq.mobile ? (
                      <a href={`tel:${inq.mobile}`} className="font-bold text-[var(--ink)] hover:underline truncate">
                        {inq.mobile}
                      </a>
                    ) : (
                      <span className="text-stone-400 italic">Not provided</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-[var(--c1)] shrink-0" />
                    <span className="text-[var(--muted)] shrink-0">Email:</span>
                    {inq.email ? (
                      <a href={`mailto:${inq.email}`} className="font-bold text-[var(--ink)] hover:underline truncate">
                        {inq.email}
                      </a>
                    ) : (
                      <span className="text-stone-400 italic">Not provided</span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[var(--c1)] shrink-0" />
                    <span className="text-[var(--muted)] shrink-0">Location:</span>
                    <span className="font-medium text-[var(--ink)] truncate">
                      {inq.address || 'Kolkata, WB'}
                    </span>
                  </div>
                </div>

                {/* Subject & Requirement Details */}
                <div className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-1.5 my-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold">
                      Requested Software or Service:
                    </span>
                    <span className="text-xs font-bold text-[var(--ink)]">
                      {inq.subject}
                    </span>
                  </div>

                  {inq.message && (
                    <p className="text-xs text-[var(--ink)]/90 leading-relaxed font-normal whitespace-pre-wrap pt-1">
                      "{inq.message}"
                    </p>
                  )}
                </div>

                {/* Internal Admin Notes */}
                {inq.notes && (
                  <div className="text-xs p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 flex items-start gap-2 mb-3">
                    <MessageSquare className="w-3.5 h-3.5 text-stone-500 mt-0.5 shrink-0" />
                    <div className="space-y-0.5 flex-1">
                      <span className="font-bold text-[10px] uppercase font-mono text-stone-500 block">Admin Internal Note:</span>
                      <p>{inq.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Bar: Status Change, Add Notes, Delete */}
                <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Status Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-[var(--muted)] font-mono">Set Status:</span>
                    
                    {isNew ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(inq.id, 'in_progress')}
                          className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-800 hover:bg-blue-500/20 text-xs font-bold transition-all cursor-pointer border border-blue-500/30"
                        >
                          Mark as In Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(inq.id, 'resolved')}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer border border-emerald-500/30"
                        >
                          Mark as Resolved
                        </button>
                      </>
                    ) : isInProgress ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(inq.id, 'resolved')}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer border border-emerald-500/30"
                        >
                          Mark as Resolved ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(inq.id, 'new')}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                        >
                          Reset to New
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(inq.id, 'in_progress')}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                        >
                          Reopen Lead
                        </button>
                      </>
                    )}
                  </div>

                  {/* Right Actions: Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete inquiry from ${inq.name}?`)) {
                          onDeleteInquiry(inq.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

