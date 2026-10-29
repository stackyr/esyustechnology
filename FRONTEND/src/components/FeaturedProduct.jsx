import React, { useState } from 'react';
import { PRODUCTS } from '../data/companyData';
import { Clock } from 'lucide-react';

export default function FeaturedProduct({ _onDownloadFinanceFlow }) {
  const financeFlow = PRODUCTS.find((p) => p.id === 'finance-flow') || PRODUCTS[0];

  // Interactive Live Invoice Simulator State
  const [customerName, setCustomerName] = useState('Sharma General Store');
  const [selectedItem, setSelectedItem] = useState('Hardware Kit Set');
  const [itemPrice, setItemPrice] = useState(1200);
  const [quantity, setQuantity] = useState(2);
  const taxRate = 18; // 18% GST (9% CGST + 9% SGST)
  const [isCopied, setIsCopied] = useState(false);

  // Calculations
  const subtotal = itemPrice * quantity;
  const cgst = (subtotal * (taxRate / 2)) / 100;
  const sgst = (subtotal * (taxRate / 2)) / 100;
  const totalAmount = subtotal + cgst + sgst;

  const handleCopyBill = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="featured-product" className="process" data-kind="steps" data-section="process">
      <div className="wrap process__head">
        {/* Left Copy & Live Simulator Controls */}
        <div className="process__copy">
          <span className="eyebrow">Flagship Desktop Software</span>
          <h2 className="h2">
            Finance Flow: From barcode scan to printed GST invoice in <em className="s">0.2 seconds</em>
          </h2>
          <p className="lead">
            The premier offline-first billing solution designed by Esyus Technologies. Create customer GST invoices in milliseconds with zero internet dependency and zero cloud latency.
          </p>

          {/* Interactive Calculator Input Controls */}
          <div className="p-5 rounded-[var(--r)] bg-[var(--soft)] border border-[var(--line)] w-full space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                ⚡ Live Bill Simulator ({financeFlow.name} v{financeFlow.version})
              </span>
              <button
                type="button"
                onClick={handleCopyBill}
                className="text-[11px] font-semibold text-[var(--c1)] hover:underline cursor-pointer"
              >
                {isCopied ? '✓ Copied' : 'Copy Bill Summary'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="text-stone-500 block mb-1">Item Name</label>
                <input
                  type="text"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[var(--ink)] font-medium outline-none"
                />
              </div>

              <div>
                <label className="text-stone-500 block mb-1">Client Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[var(--ink)] font-medium outline-none"
                />
              </div>

              <div>
                <label className="text-stone-500 block mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[var(--ink)] font-medium outline-none"
                />
              </div>

              <div>
                <label className="text-stone-500 block mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--line)] bg-white text-[var(--ink)] font-medium outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
              <span className="text-xs font-bold text-[var(--ink)]">
                Net Bill: ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <button
                type="button"
                className="btn btn--sm w-full sm:w-auto justify-center cursor-default border border-[var(--c1)]/30 text-[var(--c1)] bg-white"
                disabled
                title="Official download link will be available soon"
              >
                <Clock className="w-3.5 h-3.5 mr-1.5 text-[var(--c1)] shrink-0" />
                <span>Coming Soon (v2.4.0)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Convo / Live Interactive Terminal Preview */}
        <figure className="process__photo tab-r overflow-hidden relative">
          <div className="art g-night relative">
            <img
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=900"
              alt="Finance Flow POS Invoicing Station"
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />
            <div className="convo" aria-label="Finance Flow live invoice preview">
              <div className="msg msg--ai">
                <span className="msg__who">Finance Flow POS</span>
                Invoice #INV-2027-0842 generated in 0.18s.
                <div className="msg__card">
                  <span>Customer: {customerName}</span>
                  <b>Offline Mode ✓</b>
                </div>
              </div>

              <div className="msg msg--me">
                {selectedItem} × {quantity} = ₹{subtotal}
              </div>

              <div className="msg msg--ai">
                <span className="msg__who">Tax Engine</span>
                GST ({taxRate}%): CGST ₹{cgst.toFixed(2)} + SGST ₹{sgst.toFixed(2)}
                <div className="msg__card">
                  <span>Grand Total</span>
                  <b>₹{totalAmount.toFixed(2)}</b>
                </div>
              </div>

              <div className="msg msg--me">
                Print ESC/POS Thermal Receipt 🖨️
              </div>

              <div className="typing" aria-hidden="true">
                <i></i><i></i><i></i>
              </div>
            </div>
          </div>
        </figure>
      </div>

      {/* 4-Step Offline Workflow Rail */}
      <ol className="wrap steps" data-steps>
        <li className="step">
          <span className="step__dot" aria-hidden="true" />
          <p className="step__time">Step 01 · 0.0s</p>
          <h3 className="step__title">Instant Item Entry</h3>
          <p className="step__text">
            High-speed USB barcode scanner or keyboard-first shortcut lookup without touching a mouse.
          </p>
        </li>

        <li className="step">
          <span className="step__dot" aria-hidden="true" />
          <p className="step__time">Step 02 · 0.1s</p>
          <h3 className="step__title">Automatic GST Calculation</h3>
          <p className="step__text">
            Compliant with current Indian tax slabs (CGST, SGST, IGST) and automated HSN code reporting.
          </p>
        </li>

        <li className="step">
          <span className="step__dot" aria-hidden="true" />
          <p className="step__time">Step 03 · 0.2s</p>
          <h3 className="step__title">Direct Hardware Printing</h3>
          <p className="step__text">
            One-click output to 2" or 3" thermal receipt roll or laser A4/A5 tax invoices.
          </p>
        </li>

        <li className="step">
          <span className="step__dot" aria-hidden="true" />
          <p className="step__time">Step 04 · Day End</p>
          <h3 className="step__title">Encrypted Local Backup</h3>
          <p className="step__text">
            Automated daily sales tally and encrypted SQLite database snapshot stored safely on your drive.
          </p>
        </li>
      </ol>
    </section>
  );
}