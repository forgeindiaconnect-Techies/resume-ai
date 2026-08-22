import React from 'react';

const ForgeLogo = ({ size = 40, showText = true, variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = '#0056b8';
  const yellow = '#f59e0b';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
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
        style={{ flexShrink: 0 }}
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
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          {/* Main Brand Title: FORGE INDIA */}
          <div style={{
            fontWeight: 900,
            fontSize: `${Math.max(14, Math.round(17 * (size / 40)))}px`,
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
            fontSize: `${Math.max(10, Math.round(11.5 * (size / 40)))}px`,
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: blue,
            textTransform: 'uppercase',
            marginTop: '2px',
            whiteSpace: 'nowrap'
          }}>
            CONNECT PVT.LTD
          </div>

          {/* Subtitle Line 2: SHAPING FUTURE */}
          <div style={{
            fontSize: `${Math.max(8.5, Math.round(9.5 * (size / 40)))}px`,
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: subtextColor,
            textTransform: 'uppercase',
            marginTop: '2px',
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
