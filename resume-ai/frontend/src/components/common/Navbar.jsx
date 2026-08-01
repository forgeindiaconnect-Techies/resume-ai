import React from 'react';
import { Link } from 'react-router-dom';
import ForgeLogo from './ForgeLogo';

const Navbar = () => {
  return (
    <nav style={{
      background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.97), rgba(30, 41, 59, 0.97))',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <ForgeLogo size={36} showText={true} variant="dark" />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {[
          { label: 'Features', to: '/#features', isAnchor: true },
          { label: 'Templates', to: '/templates' },
          { label: 'Examples', to: '/industry-examples' },
          { label: 'Pricing', to: '/#pricing', isAnchor: true }
        ].map((item) => (
          item.isAnchor ? (
            <a
              key={item.label}
              href={item.to}
              style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#cbd5e1', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              to={item.to}
              style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#cbd5e1', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
            >
              {item.label}
            </Link>
          )
        ))}
        <Link
          to="/onboarding/start"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #0056b8)',
            color: 'white',
            padding: '0.5rem 1.4rem',
            borderRadius: '24px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            boxShadow: '0 4px 14px rgba(6,182,212,0.3)'
          }}
        >
          Create Resume
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
