import React from 'react';

export default function SvgSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="f-b2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
        <filter id="f-b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="f-b8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="f-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="f-brush" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.2 .015" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 .9 0 0 0 -.35"/><feComposite in2="SourceGraphic" operator="in"/></filter>
        <pattern id="p-grille" width="3.4" height="3.4" patternUnits="userSpaceOnUse"><circle cx="1.7" cy="1.7" r=".75" fill="#000" opacity=".75"/></pattern>
        <pattern id="p-mesh" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".55" fill="#000" opacity=".2"/></pattern>
        <linearGradient id="g-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fdfdfc"/><stop offset=".22" stopColor="#c4c6c5"/><stop offset=".42" stopColor="#f6f6f4"/><stop offset=".58" stopColor="#8c8e8d"/><stop offset=".78" stopColor="#e3e4e2"/><stop offset="1" stopColor="#a2a4a3"/></linearGradient>
        <radialGradient id="g-glass" cx=".42" cy=".32" r=".8"><stop offset="0" stopColor="#2c3034"/><stop offset=".6" stopColor="#0e1012"/><stop offset="1" stopColor="#040405"/></radialGradient>
        <linearGradient id="g-arc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffc56b"/><stop offset="1" stopColor="#ff5a1f"/></linearGradient>
        <linearGradient id="g-refl" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".22"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
        <mask id="m-arc"><circle cx="100" cy="100" r="54" fill="none" stroke="#fff" strokeWidth="12" strokeDasharray="130 400" transform="rotate(135 100 100)"/></mask>
        <radialGradient id="g-water" cx=".56" cy=".72" r=".75"><stop offset="0" stopColor="#f5fcff"/><stop offset=".22" stopColor="#a7dbf5"/><stop offset=".55" stopColor="#3f96cc"/><stop offset=".85" stopColor="#14507f"/><stop offset="1" stopColor="#0a2c4b"/></radialGradient>
        <clipPath id="cp-drop"><path d="M100 24C118 56 144 86 144 120a44 44 0 0 1-88 0C56 86 82 56 100 24z"/></clipPath>
        <linearGradient id="g-wall-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf7ef"/><stop offset="1" stopColor="#d8cfbf"/></linearGradient>
        <linearGradient id="g-wall-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a7a094"/><stop offset="1" stopColor="#77716a"/></linearGradient>
        <linearGradient id="g-roof" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4a4d50"/><stop offset="1" stopColor="#1f2022"/></linearGradient>
        <linearGradient id="g-warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff1c9"/><stop offset=".55" stopColor="#ffc56b"/><stop offset="1" stopColor="#e98a2c"/></linearGradient>
        <linearGradient id="g-glassw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3d5f7a"/><stop offset=".6" stopColor="#132535"/><stop offset="1" stopColor="#2a3d4c"/></linearGradient>
        <linearGradient id="g-grass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a9cf86"/><stop offset="1" stopColor="#4f7d3f"/></linearGradient>
        <radialGradient id="g-tree" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#b3d98a"/><stop offset=".55" stopColor="#4f7e3a"/><stop offset="1" stopColor="#253f1c"/></radialGradient>
        <linearGradient id="g-solar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2d4f72"/><stop offset="1" stopColor="#0b1726"/></linearGradient>
        <linearGradient id="g-plastic" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff"/><stop offset=".5" stopColor="#f1eee8"/><stop offset="1" stopColor="#cdc7bd"/></linearGradient>
        <linearGradient id="g-panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#22262a"/><stop offset="1" stopColor="#060708"/></linearGradient>
        <linearGradient id="g-darkalu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6b7076"/><stop offset=".18" stopColor="#3a3e43"/><stop offset=".6" stopColor="#24272b"/><stop offset="1" stopColor="#141618"/></linearGradient>
        <radialGradient id="g-lens" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#3b5d8c"/><stop offset=".45" stopColor="#101b2e"/><stop offset="1" stopColor="#000"/></radialGradient>
        <linearGradient id="g-chrome" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset=".18" stopColor="#b3b9bf"/><stop offset=".34" stopColor="#f4f6f8"/><stop offset=".48" stopColor="#555c66"/><stop offset=".6" stopColor="#dfe3e7"/><stop offset=".8" stopColor="#868d96"/><stop offset="1" stopColor="#eef1f4"/></linearGradient>
        <linearGradient id="g-leaf" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#244d22"/><stop offset=".45" stopColor="#4f8c3a"/><stop offset="1" stopColor="#a6d46e"/></linearGradient>
        <radialGradient id="g-dew" cx=".4" cy=".65" r=".7"><stop offset="0" stopColor="#efffe0"/><stop offset=".6" stopColor="#8cc466"/><stop offset="1" stopColor="#1d4a1a"/></radialGradient>
        <linearGradient id="g-cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#bdb7ad"/><stop offset=".3" stopColor="#f3f0ea"/><stop offset=".48" stopColor="#ffffff"/><stop offset=".82" stopColor="#d6d0c6"/><stop offset="1" stopColor="#a39d93"/></linearGradient>
        <radialGradient id="g-cap" cx=".4" cy=".3" r=".8"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#dcd7cf"/></radialGradient>
        <radialGradient id="g-orb" cx=".5" cy=".5" fx=".36" fy=".3" r=".55"><stop offset="0" stopColor="#fffaf0"/><stop offset=".16" stopColor="#ffe2a6"/><stop offset=".4" stopColor="#ffb25c"/><stop offset=".68" stopColor="#ee6630"/><stop offset=".9" stopColor="#8a2412"/><stop offset="1" stopColor="#3a0d06"/></radialGradient>
        <linearGradient id="g-irid" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8fdcff"/><stop offset=".5" stopColor="#d39bff"/><stop offset="1" stopColor="#ffb25c"/></linearGradient>
        <radialGradient id="g-spec" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>

        <symbol id="s-thermo" viewBox="0 0 200 200">
          <circle cx="106" cy="114" r="78" fill="#000" opacity=".38" filter="url(#f-b8)"/>
          <circle cx="100" cy="100" r="80" fill="url(#g-metal)"/>
          <circle cx="100" cy="100" r="80" fill="#fff" filter="url(#f-brush)" opacity=".45"/>
          <circle cx="100" cy="100" r="79.3" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="1.2"/>
          <circle cx="100" cy="100" r="67.5" fill="#5f6261"/>
          <circle cx="100" cy="100" r="66" fill="url(#g-glass)"/>
          <circle cx="100" cy="100" r="54" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="6" strokeDasharray=".8 2.97"/>
          <circle cx="100" cy="100" r="54" fill="none" stroke="#ff7a2e" strokeWidth="9" strokeDasharray="130 400" transform="rotate(135 100 100)" opacity=".5" filter="url(#f-b4)"/>
          <circle cx="100" cy="100" r="54" fill="none" stroke="url(#g-arc)" strokeWidth="6" strokeDasharray=".8 2.97" mask="url(#m-arc)"/>
          <circle cx="102.8" cy="46.1" r="3.4" fill="#fff" filter="url(#f-glow)"/>
          <text x="100" y="112" textAnchor="middle" fill="#fff" style={{ font: "300 36px 'Instrument Sans',sans-serif", letterSpacing: "-1px" }}>100%</text>
          <text x="100" y="130" textAnchor="middle" fill="#ff9a4a" style={{ font: "600 7px 'Instrument Sans',sans-serif", letterSpacing: "2px" }}>OFFLINE POS</text>
          <path d="M40 90A62 62 0 0 1 152 66C120 52 70 58 40 90z" fill="url(#g-refl)"/>
          <ellipse cx="66" cy="36" rx="28" ry="5" transform="rotate(-30 66 36)" fill="#fff" opacity=".9" filter="url(#f-b2)"/>
        </symbol>

        <symbol id="s-house" viewBox="0 0 200 200">
          <ellipse cx="100" cy="188" rx="80" ry="10" fill="#000" opacity=".35" filter="url(#f-b8)"/>
          <path d="M30 145 100 180v12L30 157z" fill="#d3ccc0"/>
          <path d="M100 180 170 145v12l-70 35z" fill="#958e83"/>
          <path d="M100 110 170 145 100 180 30 145z" fill="url(#g-grass)"/>
          <path d="M30 145 100 180 170 145" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth=".8"/>
          <path d="M120 141 128 137 160 153 152 157z" fill="#ece6da"/>
          <ellipse cx="76" cy="146" rx="28" ry="9" fill="#ffc46b" opacity=".6" filter="url(#f-b4)"/>
          <path d="M56 128 100 150V100L56 78z" fill="url(#g-wall-l)"/>
          <path d="M100 150 144 128V78l-44 22z" fill="url(#g-wall-r)"/>
          <path d="M56 84 100 106V100L56 78z" fill="#000" opacity=".12"/>
          <path d="M100 106 144 84v-6l-44 22z" fill="#000" opacity=".2"/>
          <path d="M64 126 92 140V110L64 96z" fill="#ffb347" opacity=".7" filter="url(#f-b4)"/>
          <path d="M64 126 92 140V110L64 96z" fill="url(#g-warm)"/>
          <path d="M68 128 75 131.5V122L68 118.5z" fill="#5b3a22" opacity=".5"/>
          <circle cx="71" cy="104" r="1.8" fill="#fff"/><circle cx="85" cy="111" r="1.8" fill="#fff"/>
          <path d="M78 133V103M64 111l28 14" stroke="#3a3328" strokeWidth="1.1"/>
          <path d="M64 96 92 110M64 126 92 140" stroke="#2c2620" strokeWidth="1.8"/>
          <path d="M108 136 138 121V105L108 120z" fill="url(#g-glassw)"/>
          <path d="M112 134 119 130.5V112.5L112 116z" fill="#fff" opacity=".18"/>
          <path d="M123 128.5V112.5" stroke="#0c1620" strokeWidth="1.2"/>
          <path d="M100 56 144 78 100 100 56 78z" fill="url(#g-roof)"/>
          <path d="M56 78 100 100 144 78" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth=".9"/>
          <path d="M61 78 100 58.5 139 78 100 97.5z" fill="none" stroke="#000" strokeOpacity=".3" strokeWidth="1"/>
          <path d="M104 66 126 77 114 83 92 72z" fill="url(#g-solar)"/>
          <path d="M98 69 120 80M110 71.5 98 77.5" stroke="#9fc4e8" strokeOpacity=".4" strokeWidth=".6"/>
          <path d="M104 66 126 77" stroke="#fff" strokeOpacity=".55" strokeWidth=".6"/>
          <circle cx="78" cy="78" r="2.4" fill="#ffc56b" filter="url(#f-glow)"/>
          <circle className="pulse" cx="78" cy="78" r="3" fill="none" stroke="#ffc56b" strokeWidth="1"/>
          <ellipse cx="48" cy="150" rx="12" ry="4" fill="#000" opacity=".3" filter="url(#f-b2)"/>
          <rect x="44.5" y="132" width="3" height="18" rx="1" fill="#5a4030"/>
          <circle cx="46" cy="124" r="14" fill="url(#g-tree)"/>
          <circle cx="55" cy="131" r="8" fill="url(#g-tree)"/>
          <circle cx="41" cy="118" r="5" fill="#fff" opacity=".22" filter="url(#f-b2)"/>
          <circle cx="152" cy="150" r="6" fill="url(#g-tree)"/>
        </symbol>

        <symbol id="s-drop" viewBox="0 0 200 200">
          <ellipse cx="100" cy="174" rx="86" ry="13" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1"/>
          <ellipse cx="100" cy="174" rx="62" ry="9" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.3"/>
          <ellipse cx="100" cy="176" rx="46" ry="7" fill="#0a2e4d" opacity=".45" filter="url(#f-b4)"/>
          <ellipse cx="108" cy="172" rx="22" ry="4" fill="#fff" opacity=".6" filter="url(#f-b2)"/>
          <path d="M100 24C118 56 144 86 144 120a44 44 0 0 1-88 0C56 86 82 56 100 24z" fill="url(#g-water)"/>
          <g clipPath="url(#cp-drop)">
            <path d="M100 24C118 56 144 86 144 120a44 44 0 0 1-88 0C56 86 82 56 100 24z" fill="none" stroke="#04192c" strokeOpacity=".55" strokeWidth="8" filter="url(#f-b4)"/>
            <path d="M54 112c24-10 64-10 92 4" stroke="#072640" strokeOpacity=".4" strokeWidth="4" fill="none" filter="url(#f-b2)"/>
            <ellipse cx="112" cy="144" rx="26" ry="15" fill="#fff" opacity=".75" filter="url(#f-b4)"/>
          </g>
          <path d="M88 58c-10 16-20 34-21 52 3-16 12-34 24-50z" fill="#fff" opacity=".85"/>
          <circle cx="74" cy="124" r="3.2" fill="#fff" opacity=".9"/>
        </symbol>

        <symbol id="s-bolt" viewBox="0 0 200 200">
          <rect x="64" y="36" width="90" height="140" rx="24" fill="#000" opacity=".35" filter="url(#f-b8)"/>
          <path d="M100 160c0 18-14 26-44 30" stroke="#0d0e10" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M98 160c0 17-13 24-42 28" stroke="#5a5e63" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7"/>
          <rect x="55" y="22" width="90" height="142" rx="24" fill="url(#g-plastic)"/>
          <rect x="55.5" y="22.5" width="89" height="141" rx="23.5" fill="none" stroke="#fff" strokeWidth="1"/>
          <rect x="64" y="25" width="72" height="3" rx="1.5" fill="#fff" filter="url(#f-b2)"/>
          <rect x="66" y="34" width="68" height="94" rx="14" fill="url(#g-panel)"/>
          <circle cx="100" cy="78" r="28" fill="none" stroke="#2a2d31" strokeWidth="3"/>
          <circle cx="100" cy="78" r="28" fill="none" stroke="#ffb347" strokeWidth="3" strokeDasharray="120 200" strokeLinecap="round" transform="rotate(-90 100 78)" filter="url(#f-glow)"/>
          <path d="M104 60 88 82h11l-4 17 16-23h-11z" fill="#ffc56b" filter="url(#f-glow)"/>
          <text x="100" y="120" textAnchor="middle" fill="#fff" opacity=".85" style={{ font: "500 8px 'Instrument Sans',sans-serif", letterSpacing: ".5px" }}>Finance Flow · v2.4</text>
          <path d="M72 34h40L80 128h-8a6 6 0 0 1-6-6V40a6 6 0 0 1 6-6z" fill="#fff" opacity=".06"/>
          <circle cx="100" cy="146" r="3" fill="#bdb6aa"/>
        </symbol>

        <symbol id="s-leaf" viewBox="0 0 200 200">
          <path d="M58 168C58 96 106 52 172 48c0 74-44 120-114 120z" fill="#000" opacity=".3" filter="url(#f-b8)"/>
          <path d="M48 154 30 174" stroke="#3c6a2c" strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M46 156C46 84 96 40 162 38c0 74-42 118-116 118z" fill="url(#g-leaf)"/>
          <path d="M46 156C46 84 96 40 162 38" fill="none" stroke="#d8f2a8" strokeOpacity=".4" strokeWidth="1.4"/>
          <path d="M48 154C80 118 116 84 156 44" fill="none" stroke="#d6f0a0" strokeWidth="2.4" opacity=".7"/>
          <ellipse cx="110" cy="78" rx="34" ry="12" transform="rotate(-40 110 78)" fill="#fff" opacity=".14" filter="url(#f-b4)"/>
          <circle cx="118" cy="96" r="8.5" fill="url(#g-dew)" opacity=".92"/>
          <circle cx="115" cy="92.5" r="2.2" fill="#fff"/>
        </symbol>

        <symbol id="s-shield" viewBox="0 0 200 200">
          <rect x="78" y="26" width="60" height="164" rx="30" fill="#000" opacity=".38" filter="url(#f-b8)"/>
          <rect x="70" y="16" width="60" height="166" rx="30" fill="url(#g-darkalu)"/>
          <rect x="70" y="16" width="60" height="166" rx="30" fill="#fff" filter="url(#f-brush)" opacity=".14"/>
          <rect x="70.6" y="16.6" width="58.8" height="164.8" rx="29.4" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1.2"/>
          <circle cx="100" cy="52" r="20" fill="#050608"/>
          <circle cx="100" cy="52" r="14" fill="url(#g-lens)"/>
          <circle cx="100" cy="52" r="6" fill="#06101f"/>
          <ellipse cx="94" cy="46" rx="4" ry="2.4" fill="#fff" opacity=".75" transform="rotate(-30 94 46)"/>
          <rect x="84" y="90" width="32" height="24" rx="4" fill="url(#p-grille)"/>
          <circle cx="100" cy="148" r="19" fill="#0a0b0d"/>
          <circle cx="100" cy="148" r="15.5" fill="none" stroke="#9fe0ff" strokeWidth="2.5" filter="url(#f-glow)"/>
          <circle cx="100" cy="148" r="12" fill="url(#g-glass)"/>
          <ellipse cx="96" cy="143" rx="5" ry="2.5" fill="#fff" opacity=".25"/>
          <path d="M74 40v100" stroke="#fff" strokeOpacity=".18" strokeWidth="2" strokeLinecap="round"/>
        </symbol>

        <symbol id="s-wrench" viewBox="0 0 200 200">
          <path transform="translate(8 12)" d="M140 32a36 36 0 0 0-42 46L40 136a15 15 0 0 0 22 22l58-58a36 36 0 0 0 46-42l-21 21-19-6-6-19z" fill="#000" opacity=".35" filter="url(#f-b4)"/>
          <path d="M140 32a36 36 0 0 0-42 46L40 136a15 15 0 0 0 22 22l58-58a36 36 0 0 0 46-42l-21 21-19-6-6-19z" fill="url(#g-chrome)"/>
          <path d="M140 32a36 36 0 0 0-42 46L40 136a15 15 0 0 0 22 22l58-58a36 36 0 0 0 46-42l-21 21-19-6-6-19z" fill="none" stroke="#1f2328" strokeOpacity=".55" strokeWidth="1"/>
          <path d="M47 141 101 87" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".85"/>
          <path d="M58 152 112 98" stroke="#2c3138" strokeWidth="1.4" strokeLinecap="round" opacity=".45"/>
          <circle cx="51" cy="147" r="5.5" fill="#1a1d21"/>
          <text transform="rotate(-45 82 116)" x="82" y="118.5" textAnchor="middle" fill="#3c434c" opacity=".55" style={{ font: "600 6px 'Instrument Sans',sans-serif", letterSpacing: "2px" }}>ESYUS TECH</text>
        </symbol>

        <symbol id="s-wind" viewBox="0 0 200 200">
          <ellipse cx="100" cy="170" rx="52" ry="10" fill="#000" opacity=".35" filter="url(#f-b4)"/>
          <path d="M62 52v110a38 10 0 0 0 76 0V52z" fill="url(#g-cyl)"/>
          <path d="M62 52v110a38 10 0 0 0 76 0V52z" fill="url(#p-mesh)"/>
          <path d="M62 64a38 10 0 0 0 76 0" fill="none" stroke="#000" strokeOpacity=".1" strokeWidth="2"/>
          <rect x="84" y="62" width="7" height="96" rx="3.5" fill="#fff" opacity=".45" filter="url(#f-b2)"/>
          <ellipse cx="100" cy="52" rx="38" ry="10" fill="url(#g-cap)"/>
          <ellipse cx="100" cy="52" rx="29" ry="7.3" fill="#121416"/>
          <ellipse cx="100" cy="52" rx="24" ry="5.8" fill="none" stroke="#7be0a6" strokeWidth="2" filter="url(#f-glow)"/>
          <circle cx="100" cy="150" r="2" fill="#7be0a6" filter="url(#f-glow)"/>
        </symbol>

        <symbol id="s-orb" viewBox="0 0 200 200">
          <ellipse cx="100" cy="178" rx="52" ry="8" fill="#3a1206" opacity=".4" filter="url(#f-b4)"/>
          <ellipse cx="100" cy="176" rx="40" ry="6" fill="#ffb25c" opacity=".55" filter="url(#f-b4)"/>
          <ellipse cx="100" cy="96" rx="90" ry="22" transform="rotate(-16 100 96)" fill="none" stroke="url(#g-irid)" strokeWidth="1.2" opacity=".5"/>
          <circle cx="100" cy="96" r="60" fill="url(#g-orb)"/>
          <circle cx="112" cy="110" r="28" fill="#fff4dc" opacity=".45" filter="url(#f-b8)"/>
          <circle cx="100" cy="96" r="59" fill="none" stroke="url(#g-irid)" strokeWidth="2.5" opacity=".55" filter="url(#f-b2)"/>
          <ellipse cx="80" cy="70" rx="22" ry="12" transform="rotate(-32 80 70)" fill="url(#g-spec)" opacity=".9"/>
          <circle cx="74" cy="66" r="4" fill="#fff"/>
          <g transform="rotate(-16 100 96)">
            <path d="M10 96A90 22 0 0 0 190 96" fill="none" stroke="url(#g-irid)" strokeWidth="1.6"/>
            <circle cx="100" cy="118" r="3.6" fill="#fff" filter="url(#f-glow)"/>
          </g>
        </symbol>

        <symbol id="s-spark" viewBox="0 0 24 24"><path d="M12 2c.6 4.8 2.7 7.2 8 8-5.3.8-7.4 3.2-8 8-.6-4.8-2.7-7.2-8-8 5.3-.8 7.4-3.2 8-8z" fill="currentColor"/></symbol>
        <symbol id="s-logo" viewBox="0 0 28 28">
          <rect width="28" height="28" rx="8" fill="#14130f"/>
          <path d="M7 7h14v3H11v3h8v3h-8v3h10v3H7V7z" fill="#f6f2ea"/>
          <circle cx="21" cy="7" r="2.6" fill="#e8693c"/>
        </symbol>
      </defs>
    </svg>
  );
}
