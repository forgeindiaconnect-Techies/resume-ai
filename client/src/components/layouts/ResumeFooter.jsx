/**
 * ResumeFooter - Permanent branded watermark for all resume layouts.
 * FIXED, NON-EDITABLE watermark — cannot be removed or modified by users.
 * Logo uses data URI so it renders perfectly in both browser and PDF export.
 */

import React, { useState } from 'react';
import { Trash2, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResumeFooter = () => {
  const navigate = useNavigate();

  const handleRemoveClick = () => {
    // Trigger download workflow modal via custom event instead of navigating to /plans
    const event = new CustomEvent('open-download-workflow');
    window.dispatchEvent(event);
  };

  const appSettingsString = localStorage.getItem('app_settings');
  let appSettings = {};
  if (appSettingsString) {
    try {
      appSettings = JSON.parse(appSettingsString);
    } catch (e) {}
  }

  const adminWatermarkEnabled = appSettings.watermarkEnabled !== false;
  const watermarkText = appSettings.watermarkText || "Powered by FORGE INDIA Connect";

  // Is admin watermark setting ON? -> NO -> HIDE
  if (!adminWatermarkEnabled) {
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
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif"
        }}>
          www.forgeindiaconnect.com
        </span>

        {/* Right: Powered by + Official Logo */}
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
          <img 
            src="/forge-logo-full.png" 
            alt="Forge India Connect" 
            style={{ height: '22px', width: 'auto', objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }} 
          />
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
