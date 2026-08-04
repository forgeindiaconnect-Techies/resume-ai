/**
 * ResumeFooter - Permanent branded watermark for all resume layouts.
 * FIXED, NON-EDITABLE watermark — cannot be removed or modified by users.
 * Logo uses data URI so it renders perfectly in both browser and PDF export.
 */

// Forge India Connect logo as a URL-encoded SVG data URI
// (Same exact paths as ForgeLogo.jsx — blue F-bracket + yellow bar + yellow pyramid)
const FORGE_LOGO_DATA_URI =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 100 100">
      <path d="M12 12 H88 V30 H32 V88 H12 Z" fill="#0056b8"/>
      <rect x="42" y="40" width="30" height="15" fill="#f59e0b" rx="2"/>
      <path d="M52 47 Q57 43 62 47 V51 H52 Z" fill="#0056b8"/>
      <polygon points="22,88 56,56 90,88" fill="#f59e0b"/>
    </svg>`
  );

const ResumeFooter = () => {
  return (
    <div
      contentEditable={false}
      style={{
        marginTop: '1.5rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        pointerEvents: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        cursor: 'default'
      }}
    >
      {/* Left: Website URL — constant, always visible */}
      <span style={{
        fontSize: '0.68rem',
        color: '#94a3b8',
        fontWeight: 500,
        letterSpacing: '0.02em',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif"
      }}>
        www.forgeindiaconnect.com
      </span>

      {/* Right: Powered by + Real Logo + Brand Name */}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        fontSize: '0.68rem',
        color: '#94a3b8',
        fontWeight: 500,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif"
      }}>
        Powered by

        {/* Real Forge India Connect logo — data URI renders in both browser and PDF */}
        <img
          src={FORGE_LOGO_DATA_URI}
          alt="Forge India Connect"
          width="18"
          height="18"
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            flexShrink: 0
          }}
        />

        {/* Brand text: FORGE INDIA Connect */}
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.15rem', fontWeight: 800, letterSpacing: '0.01em' }}>
          <span style={{ color: '#0056b8', fontFamily: "'Arial Black', 'Inter', sans-serif", fontSize: '0.68rem' }}>FORGE</span>
          <span style={{ color: '#f59e0b', fontFamily: "'Arial Black', 'Inter', sans-serif", fontSize: '0.68rem' }}>INDIA</span>
          <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.68rem' }}>Connect</span>
        </span>
      </span>
    </div>
  );
};

export default ResumeFooter;
