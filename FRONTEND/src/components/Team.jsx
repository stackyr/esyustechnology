import React from 'react';
import { TEAM_MEMBERS, COMPANY_INFO } from '../data/companyData';

export default function Team({ onContactClick }) {
  const tones = ['tone-3', 'tone-2', 'tone-4', 'tone-1'];
  const arts = ['g-sage', 'g-sky', 'g-amber', 'g-ember'];

  return (
    <section id="team" className="team" data-kind="team" data-section="team">
      {/* Head */}
      <div className="wrap sec-head">
        <h2 className="h2">
          The minds behind the <em className="s">software architecture</em>
        </h2>
        <div className="sec-head__side">
          <p className="lead">
            Led by founder <strong>{COMPANY_INFO.founder}</strong> and co-founder <strong>{COMPANY_INFO.coFounder}</strong>, our engineers build robust offline and cloud-connected software solutions with high performance.
          </p>
          <button className="link" onClick={onContactClick}>
            Connect with our team →
          </button>
        </div>
      </div>

      {/* Team Cards List */}
      <ul className="wrap people" data-people>
        {TEAM_MEMBERS.map((member, idx) => {
          const tone = tones[idx % tones.length];
          const art = arts[idx % arts.length];

          return (
            <li key={idx} className={`person ${tone}`}>
              <figure className="person__photo tab-l">
                <div className={`art ${art}`} role="img" aria-label={`Portrait of ${member.name}`}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="full object-cover"
                    onError={(e) => {
                      e.target.style.opacity = '0.7';
                    }}
                  />
                </div>
              </figure>
              <h3 className="person__name">{member.name}</h3>
              <p className="person__role">{member.role}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}