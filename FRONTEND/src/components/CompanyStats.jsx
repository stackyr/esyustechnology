import React from 'react';

export default function CompanyStats() {
  const bars = [
    { label: "Retail Billing & Offline POS", value: 38, tone: "tone-1", fill: "38%" },
    { label: "Wholesale Inventory & GST Reports", value: 27, tone: "tone-4", fill: "27%" },
    { label: "Tour & Travel Management ERP", value: 19, tone: "tone-2", fill: "19%" },
    { label: "Custom Cloud Portals & Corporate Web", value: 16, tone: "tone-5", fill: "16%" }
  ];

  return (
    <section id="stats" className="facts" data-kind="facts" data-section="stats">
      <div className="wrap facts__in">
        {/* Left Copy & Key Figures */}
        <div className="facts__copy">
          <span className="eyebrow">Enterprise Reliability Track Record</span>
          <h2 className="h2">
            What Esyus software handled <em className="s">this year</em>
          </h2>
          <p className="lead">
            Tested across active commercial billing counters and field devices. Designed to never stall during rush hours or internet dropouts.
          </p>

          <div className="figs">
            <p className="fig">
              <span className="fig__num">50k+</span>
              <span className="fig__label">GST invoices generated completely offline</span>
            </p>
            <p className="fig">
              <span className="fig__num">100%</span>
              <span className="fig__label">local offline uptime with zero server downtime</span>
            </p>
          </div>
        </div>

        {/* Right Animated Progress Bars */}
        <ul className="bars" data-chart>
          {bars.map((bar, idx) => (
            <li key={idx} className={`bar ${bar.tone}`}>
              <p className="bar__head">
                <span className="bar__label">{bar.label}</span>
                <span className="bar__value">{bar.value}%</span>
              </p>
              <div className="bar__track" aria-hidden="true">
                <div
                  className="bar__fill"
                  style={{ width: bar.fill }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}