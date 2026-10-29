import React from 'react';
import { CUSTOMER_REVIEWS } from '../data/companyData';

export default function Reviews({ onAddFeedbackClick }) {
  // Double reviews for infinite seamless marquee loop
  const marqueeItems = [...CUSTOMER_REVIEWS, ...CUSTOMER_REVIEWS];

  return (
    <section id="reviews" className="voices" data-kind="reviews" data-section="testimonials">
      {/* Featured Headline Voice Quote */}
      <figure className="wrap voices__lead">
        <svg className="voice__mark" viewBox="0 0 28 22" aria-hidden="true">
          <path fill="currentColor" d="M0 22V12.6C0 5.5 3.4 1.3 10.2 0l1.1 2.6C7.6 3.9 5.9 6.4 5.8 10H11v12H0Zm16.6 0V12.6c0-7.1 3.4-11.3 10.2-12.6L28 2.6c-3.7 1.3-5.4 3.8-5.5 7.4h5.2v12H16.6Z" />
        </svg>
        <blockquote>
          <p className="voices__quote">
            "Finance Flow eliminated 100% of our checkout delays. Even when broadband cuts out during peak evening rush hours, our billing counters process GST invoices without a hitch."
          </p>
        </blockquote>
        <figcaption className="voices__who">
          <span className="sign">Sunil Agarwal</span>
          <span>Agarwal Mega Store, Kolkata · Verified User</span>
        </figcaption>
      </figure>

      {/* Marquee Row */}
      <div className="voices__row" data-marquee>
        <ul className="voices__track">
          {marqueeItems.map((rev, idx) => (
            <li key={idx} className="review">
              <div>
                <p className="review__stars" aria-label={`${rev.rating} stars`}>
                  {"★".repeat(Math.round(rev.rating || 5))}
                </p>
                <p>"{rev.review || rev.comment}"</p>
              </div>
              <p className="review__who">
                <span className="sign">{rev.name}</span>
                <span>{rev.company || rev.business} · {rev.product}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap text-center mt-12">
        <button
          className="btn btn--line btn--sm"
          onClick={onAddFeedbackClick}
        >
          Submit your merchant review →
        </button>
      </div>
    </section>
  );
}