import React from 'react';

const ForgeLogo = ({
  size = 46,
  height,
  iconOnly = false,
  showText = true,
  layout = 'horizontal', // 'horizontal' | 'vertical'
  style = {},
  className = '',
  alt = 'Forge India Connect'
}) => {
  const logoHeight = height || size;
  const blue = '#0056b8';
  const yellow = '#f59e0b';

  // If explicitly requested vertical full image layout
  if (layout === 'vertical' && !iconOnly) {
    return (
      <img
        src="/forge-logo-full.png"
        alt={alt}
        className={`forge-logo-img ${className}`.trim()}
        style={{
          height: typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'inline-block',
          verticalAlign: 'middle',
          userSelect: 'none',
          ...style
        }}
      />
    );
  }

  // Icon only
  if (iconOnly || !showText) {
    return (
      <img
        src="/fav-icon-logo.png"
        alt={alt}
        className={`forge-logo-img ${className}`.trim()}
        style={{
          height: typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'inline-block',
          verticalAlign: 'middle',
          userSelect: 'none',
          ...style
        }}
      />
    );
  }

  // Default: Crystal-clear horizontal brand layout for headers & navbars
  const iconSize = typeof logoHeight === 'number' ? logoHeight : 46;
  const titleSize = Math.max(14, Math.round(iconSize * 0.40));
  const sub1Size = Math.max(9.5, Math.round(iconSize * 0.23));
  const sub2Size = Math.max(8, Math.round(iconSize * 0.18));

  return (
    <div
      className={`forge-logo-horizontal ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${Math.max(8, Math.round(iconSize * 0.22))}px`,
        textDecoration: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      <img
        src="/fav-icon-logo.png"
        alt={alt}
        style={{
          height: `${iconSize}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          flexShrink: 0
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.12 }}>
        {/* Main: FORGE INDIA */}
        <div
          style={{
            fontWeight: 900,
            fontSize: `${titleSize}px`,
            letterSpacing: '0.04em',
            fontFamily: "'Inter', 'Outfit', system-ui, -apple-system, sans-serif",
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ color: blue }}>FORGE </span>
          <span style={{ color: yellow }}>INDIA</span>
        </div>

        {/* Subline 1: CONNECT PVT.LTD */}
        <div
          style={{
            fontSize: `${sub1Size}px`,
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: blue,
            fontFamily: "'Inter', 'Outfit', system-ui, -apple-system, sans-serif",
            textTransform: 'uppercase',
            marginTop: '1.5px',
            whiteSpace: 'nowrap'
          }}
        >
          CONNECT PVT.LTD
        </div>

        {/* Subline 2: SHAPING FUTURE */}
        <div
          style={{
            fontSize: `${sub2Size}px`,
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: '#64748b',
            fontFamily: "'Inter', 'Outfit', system-ui, -apple-system, sans-serif",
            textTransform: 'uppercase',
            marginTop: '1.5px',
            whiteSpace: 'nowrap'
          }}
        >
          SHAPING FUTURE
        </div>
      </div>
    </div>
  );
};

export default ForgeLogo;


