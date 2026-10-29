import React from 'react';

export default function WhyChooseUs({ onContactClick }) {
  const pillars = [
    {
      tone: "tone-1",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=700",
      name: "Offline Autonomy",
      count: "100% Offline Uptime",
      desc: "Complete operational independence without needing internet or cloud servers."
    },
    {
      tone: "tone-3",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=700",
      name: "Zero Lag",
      count: "<0.2s Keystroke Latency",
      desc: "Instant barcode scan and checkout designed for rapid retail counters."
    },
    {
      tone: "tone-4",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=700",
      name: "GST Invoicing",
      count: "100% Tax Compliant",
      desc: "Built-in CGST, SGST, IGST tax computations and HSN code automation."
    },
    {
      tone: "tone-2",
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=700",
      name: "Hardware Ready",
      count: "Thermal & Laser",
      desc: "Seamless interfacing with 2\"/3\" thermal receipt printers, cash drawers and scanners."
    },
    {
      tone: "tone-5",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=700",
      name: "Dedicated Support",
      count: "Direct Founder Line",
      desc: "Technical troubleshooting and configuration support delivered directly by our core engineering team."
    }
  ];

  const centerIndex = Math.floor(pillars.length / 2);

  return (
    <section id="why-choose-us" className="range" data-kind="systems" data-section="systems">
      {/* Section Header */}
      <div className="wrap sec-head">
        <h2 className="h2">
          Five core pillars. Engineered for <em className="s">uninterrupted operations</em>.
        </h2>
        <div className="sec-head__side">
          <p className="lead">
            Every software package from Esyus Technology is architected around absolute uptime, data privacy, and rapid user workflows.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a className="link" href="#featured-product">
              See Finance Flow in action →
            </a>
            {onContactClick && (
              <button type="button" onClick={onContactClick} className="link cursor-pointer">
                Consult With Engineers →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Arched Plates List with Topic Images */}
      <ul className="wrap plates" data-plates>
        {pillars.map((item, idx) => {
          const arch = (1 - Math.abs(idx - centerIndex) / centerIndex).toFixed(3);
          const tabClass = idx < centerIndex ? 'tab-l' : idx > centerIndex ? 'tab-r' : '';

          return (
            <li
              key={idx}
              className={`plate ${item.tone}`}
              style={{ '--arch': arch }}
            >
              <figure className={`plate__card ${tabClass} overflow-hidden relative group`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
                <span className="plate__wash" aria-hidden="true" />
                <figcaption className="plate__cap">
                  <h3 className="plate__name">{item.name}</h3>
                  <p className="plate__count">{item.count}</p>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
