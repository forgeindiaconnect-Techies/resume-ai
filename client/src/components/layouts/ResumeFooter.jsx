/**
 * ResumeFooter - Permanent branded watermark for all resume layouts.
 * FIXED, NON-EDITABLE watermark — cannot be removed or modified by users.
 * Logo uses data URI so it renders perfectly in both browser and PDF export.
 */

import React, { useState } from 'react';
import { Trash2, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Forge India Connect logo as a URL-encoded SVG data URI
// (Same exact paths as ForgeLogo.jsx — blue F-bracket + yellow bar + yellow pyramid)
const ForgeLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 100 100" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <path d="M12 12 H88 V30 H32 V88 H12 Z" fill="#0056b8"/>
    <rect x="42" y="40" width="30" height="15" fill="#f59e0b" rx="2"/>
    <path d="M52 47 Q57 43 62 47 V51 H52 Z" fill="#0056b8"/>
    <polygon points="22,88 56,56 90,88" fill="#f59e0b"/>
  </svg>
);

const ResumeFooter = () => {
  const navigate = useNavigate();

  const handleRemoveClick = () => {
    const activeSessionId = localStorage.getItem('activeResumeSessionId') || window.location.pathname.split('/').pop();
    navigate(`/plans?resumeId=${activeSessionId}`);
  };

  const appSettingsString = localStorage.getItem('app_settings');
  let appSettings = {};
  if (appSettingsString) {
    try {
      appSettings = JSON.parse(appSettingsString);
    } catch (e) {}
  }

  const isPremium = localStorage.getItem('user_premium') === 'true';
  const adminWatermarkEnabled = appSettings.watermarkEnabled !== false;
  const watermarkText = appSettings.watermarkText || "Powered by FORGE INDIA Connect";

  // Is admin watermark setting ON? -> YES -> Is user premium? NO -> SHOW, YES -> HIDE
  // Is admin watermark setting ON? -> NO -> HIDE
  if (isPremium || !adminWatermarkEnabled) {
    return null;
  }

  return (
    <>
      <style>{`
        .resume-footer-container .remove-branding-btn {
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .resume-footer-container:hover .remove-branding-btn {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      `}</style>
      <div
        className="resume-footer-container"
        onClick={handleRemoveClick}
        contentEditable={false}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          position: 'absolute',
          bottom: '10px',
          left: '0',
          padding: '0.65rem 15mm',
          background: 'transparent',
          zIndex: 50,
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {/* Left: Website URL — constant, always visible */}
        <span style={{
          fontSize: '0.68rem',
          color: '#94a3b8',
          fontWeight: 500,
          letterSpacing: '0.02em',
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          textShadow: '0 0 6px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,0.9)'
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
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          textShadow: '0 0 6px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,0.9)'
        }}>
          Powered by
          <ForgeLogo />
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.15rem', fontWeight: 800, letterSpacing: '0.01em' }}>
            <span style={{ color: '#0056b8', fontFamily: "'Arial Black', 'Inter', sans-serif", fontSize: '0.68rem' }}>FORGE</span>
            <span style={{ color: '#f59e0b', fontFamily: "'Arial Black', 'Inter', sans-serif", fontSize: '0.68rem' }}>INDIA</span>
            <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.68rem' }}>Connect</span>
          </span>
        </span>

        {/* Remove Branding Hover Button (Pure CSS) */}
        <div 
          className="remove-branding-btn"
          style={{ 
            position: 'absolute', 
            right: 0, 
            top: '-32px', // perfectly positioned above text
            zIndex: 100 
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); handleRemoveClick(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '0.4rem 1rem',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              pointerEvents: 'auto',
              boxShadow: '0 8px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.15)'
            }}
          >
            <Trash2 size={14} />
            Remove branding
            <Crown size={14} color="#f59e0b" fill="#f59e0b" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ResumeFooter;
