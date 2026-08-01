import React from 'react';

const ForgeLogo = ({ size = 40, showText = true, variant = 'light' }) => {
  const isDark = variant === 'dark' || variant === 'sidebar';
  const blue = '#0056b8';
  const yellow = '#eab308';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      userSelect: 'none',
      textDecoration: 'none'
    }}>
      {/* Logo Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue "F" bracket shape - top horizontal bar */}
        <rect x="10" y="10" width="60" height="14" rx="3" fill={blue} />
        {/* Blue vertical bar (left leg of F) */}
        <rect x="10" y="10" width="14" height="80" rx="3" fill={blue} />
        {/* Blue middle horizontal bar */}
        <rect x="10" y="44" width="45" height="12" rx="3" fill={blue} />

        {/* Yellow triangle / mountain */}
        <polygon points="30,95 62,58 94,95" fill={yellow} />

        {/* Yellow small box on mountain peak */}
        <rect x="54" y="50" width="16" height="10" rx="2" fill={yellow} />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          {/* Main company name */}
          <div style={{
            fontWeight: 900,
            fontSize: `${Math.max(0.75, 1.1 * (size / 40))}rem`,
            letterSpacing: '0.05em',
            fontFamily: "'Inter', 'Arial', sans-serif",
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ color: blue }}>FORGE </span>
            <span style={{ color: yellow }}>INDIA</span>
            <span style={{ color: textColor }}> CONNECT</span>
          </div>
          {/* Tagline */}
          <div style={{
            fontSize: `${Math.max(0.5, 0.6 * (size / 40))}rem`,
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: subColor,
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
