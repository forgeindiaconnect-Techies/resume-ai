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
        <path d="M 22 14 L 84 14 L 68 30 L 36 30 L 36 74 L 22 86 Z" fill={blue} />
        {/* Inner Yellow Bar */}
        <rect x="44" y="41" width="28" height="15" fill={yellow} rx="1.5" />
        {/* Blue inner silhouette */}
        <path d="M 48 49 C 48 47.5 49.5 46 51 46 C 52 46 53 46.5 53.5 47.5 C 54.5 47.2 56 47.2 57 47.5 C 58 47.5 59.5 46.5 61 46.5 C 61.5 46.5 62 47 62 47.8 C 62 48.5 61.5 49 60.5 49.2 C 61.2 49.8 61.5 50.8 61 51.8 L 61 53.5 L 59.5 53.5 L 59.5 51 C 58.5 51 57.5 51.5 56.5 51.5 L 56.5 53.5 L 55 53.5 L 55 51 C 54 51 53 50.5 52.5 50 L 52 53.5 L 50.5 53.5 L 50.5 49.8 C 49.5 49.8 48.5 49.5 48 49 Z" fill={blue} />
        {/* Bottom Yellow Pyramid */}
        <polygon points="26,86 58,56 88,86" fill={yellow} />
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

          {/* Subtitle Lines (hide on very narrow mobile headers) */}
          <div className="forge-logo-subtitles">
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
        </div>
      )}
    </div>
  );
};

export default ForgeLogo;
