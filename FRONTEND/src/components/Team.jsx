import React from 'react';
import { TEAM_MEMBERS } from '../data/companyData';
import { useData } from '../context/DataContext';

export default function Team({ onContactClick, dataVersion = 0 }) {
  const { brand, landingPage } = useData();
  const COMPANY_INFO = brand || {};
  const teamSec = landingPage?.team || {};
  const tones = ['tone-3', 'tone-2', 'tone-4', 'tone-1'];
  const arts = ['g-sage', 'g-sky', 'g-amber', 'g-ember'];

  const membersList = (Array.isArray(teamSec.members) && teamSec.members.length > 0)
    ? teamSec.members
    : TEAM_MEMBERS;

  return (
    <section id="team" className="team" data-kind="team" data-section="team">
      {/* Head */}
      <div className="wrap sec-head">
        <h2 className="h2">
          {teamSec.headline ? (
            teamSec.headline
          ) : (
            <>The minds behind the <em className="s">software architecture</em></>
          )}
        </h2>
        <div className="sec-head__side">
          <p className="lead">
            {teamSec.lead || `Led by founder ${COMPANY_INFO.founder || 'Sayantan Ghosh'} and co-founder ${COMPANY_INFO.coFounder || 'Soham Dutta'}, our engineers build robust offline and cloud-connected software solutions with high performance.`}
          </p>
          <button className="link" onClick={onContactClick}>
            Connect with our team →
          </button>
        </div>
      </div>

      {/* Team Cards List */}
      <ul className="wrap people" data-people>
        {membersList.map((member, idx) => {
          const tone = tones[idx % tones.length];
          const art = arts[idx % arts.length];
          const displayName = member.name || (idx === 0 ? COMPANY_INFO.founder : idx === 1 ? COMPANY_INFO.coFounder : 'Engineer');
          const avatarSrc = member.avatar || (
            idx === 0
              ? (landingPage?.hero?.founderPhoto || landingPage?.about?.founderPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80")
              : idx === 1
              ? (landingPage?.hero?.coFounderPhoto || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80")
              : "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
          );

          return (
            <li key={idx} className={`person ${tone}`}>
              <figure className="person__photo tab-l">
                <div className={`art ${art}`} role="img" aria-label={`Portrait of ${displayName}`}>
                  <img
                    src={avatarSrc}
                    alt={displayName}
                    className="full object-cover"
                    onError={(e) => {
                      e.target.style.opacity = '0.7';
                    }}
                  />
                </div>
              </figure>
              <h3 className="person__name">{displayName}</h3>
              <p className="person__role">{member.role}</p>
              {member.bio && (
                <p className="text-[11px] text-[var(--muted)] mt-1 line-clamp-2 px-1" title={member.bio}>
                  {member.bio}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
