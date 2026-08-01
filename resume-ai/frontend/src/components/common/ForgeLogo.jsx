import React from 'react';

const ForgeLogo = ({ size = 40, showText = true, variant = 'light' }) => {
  const isDark = variant === 'dark' || variant === 'sidebar';
  const blue = '#0056b8';
  const yellow = '#f59e0b';
  const subtextColor = isDark ? '#cbd5e1' : '#475569';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      userSelect: 'none',
      textDecoration: 'none'
    }}>
      {/* Official Forge India Connect SVG Logo Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Blue Bracket (F mark) */}
        <path d="M12 12 H88 V30 H32 V88 H12 Z" fill={blue} />
        {/* Inner Yellow Bar */}
        <rect x="42" y="40" width="30" height="15" fill={yellow} rx="2" />
        {/* Blue inner symbol */}
        <path d="M52 47 Q57 43 62 47 V51 H52 Z" fill={blue} />
        {/* Bottom Yellow Pyramid */}
        <polygon points="22,88 56,56 90,88" fill={yellow} />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          {/* Main Brand Title: FORGE INDIA */}
          <div style={{
            fontWeight: 950,
            fontSize: `${Math.max(0.85, 1.25 * (size / 40))}rem`,
            letterSpacing: '0.04em',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ color: blue }}>FORGE </span>
            <span style={{ color: yellow }}>INDIA</span>
          </div>

          {/* Subtitle Line 1: CONNECT PVT.LTD */}
          <div style={{
            fontSize: `${Math.max(0.48, 0.56 * (size / 40))}rem`,
            fontWeight: 900,
            letterSpacing: '0.08em',
            color: blue,
            textTransform: 'uppercase',
            marginTop: '1px',
            whiteSpace: 'nowrap'
          }}>
            CONNECT PVT.LTD
          </div>

          {/* Subtitle Line 2: SHAPING FUTURE */}
          <div style={{
            fontSize: `${Math.max(0.4, 0.46 * (size / 40))}rem`,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: subtextColor,
            textTransform: 'uppercase',
            marginTop: '1px',
            whiteSpace: 'nowrap'
          }}>
            SHAPING FUTURE
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgeLogo;
