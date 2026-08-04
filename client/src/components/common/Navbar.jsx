import React from 'react';
import { Link } from 'react-router-dom';
import ForgeLogo from './ForgeLogo';

const Navbar = () => {
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <ForgeLogo size={36} showText={true} variant="light" />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {[
          { label: 'Home', to: '/', isAnchor: false },
          { label: 'Features', to: '/#features', isAnchor: true },
          { label: 'Examples', to: '/industry-examples' },
          { label: 'Pricing', to: '/#pricing', isAnchor: true }
        ].map((item) => (
          item.isAnchor ? (
            <a
              key={item.label}
              href={item.to}
              style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#475569', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0284c7'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              to={item.to}
              style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#475569', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0284c7'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              {item.label}
            </Link>
          )
        ))}
        <Link
          to="/builder"
          style={{
            background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
            color: 'white',
            padding: '0.5rem 1.4rem',
            borderRadius: '24px',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
            transition: 'transform 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Create Resume
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
