import React from 'react';
import { FAQS } from '../data/companyData';

export default function FAQSection({ onContactClick }) {
  return (
    <section id="faq" className="faq" data-sec="faq">
      <div className="wrap faq__in">
        
        {/* Left Column: Heading and Support Direct CTA */}
        <div className="faq__head">
          <span className="eyebrow">Section 12 • Frequently Asked Questions</span>
          <h2 className="h2">
            Straightforward <em className="s">answers.</em>
          </h2>
          <p className="lead">
            Everything you need to know about our 100% offline local databases, thermal receipt printers, barcode scanner integration, and custom software architecture.
          </p>

          <div className="pt-4 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-[var(--muted)] font-mono">
              Have a hardware or architecture inquiry?
            </span>
            <button
              type="button"
              onClick={onContactClick}
              className="btn btn--line btn--sm"
            >
              <span>Speak with Our Engineers</span>
              <svg className="btn__arr" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M2.5 9.5 9.5 2.5M9.5 2.5H4M9.5 2.5V8" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Q&A Accordion Items */}
        <div className="space-y-1" data-rules>
          {FAQS.map((faq, idx) => (
            <details className="qa" key={idx} open={idx === 0}>
              <summary>
                <span>{faq.q}</span>
                <span className="ibtn ibtn--bare" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </summary>
              <div className="qa__a">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
}
