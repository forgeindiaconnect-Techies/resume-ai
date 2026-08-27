import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ForgeLogo from './ForgeLogo';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
    }}>
      <div className="landing-nav-container">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <ForgeLogo size={46} showText={true} />
        </Link>

        {/* Desktop Nav Links */}
        <div className="landing-desktop-nav">
          {[
            { label: 'Home', to: '/', isAnchor: false },
            { label: 'Features', to: '/#features', isAnchor: true },
            { label: 'Examples', to: '/industry-examples' }
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

        {/* Mobile Hamburger Toggle */}
        <button
          className="landing-mobile-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle Menu"
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'white',
              borderTop: '1px solid #e2e8f0',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
            }}
          >
            <Link
              to="/"
              onClick={() => setShowMobileMenu(false)}
              style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', padding: '0.4rem 0' }}
            >
              Home
            </Link>
            <a
              href="/#features"
              onClick={() => setShowMobileMenu(false)}
              style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', padding: '0.4rem 0' }}
            >
              Features
            </a>
            <Link
              to="/industry-examples"
              onClick={() => setShowMobileMenu(false)}
              style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', padding: '0.4rem 0' }}
            >
              Examples
            </Link>

            <Link
              to="/builder"
              onClick={() => setShowMobileMenu(false)}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                marginTop: '0.5rem'
              }}
            >
              Create Resume
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
