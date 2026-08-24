import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Upload, Trash2, Link2, CheckCircle2, Check, ExternalLink } from 'lucide-react';

const QrScanUploadSection = ({
  personalInfo = {},
  onChange,
  accentColor = '#2563eb'
}) => {
  const fileInputRef = useRef(null);

  // Local state for instant, rock-solid UI reactivity
  const [activeMode, setActiveMode] = useState(
    personalInfo.customQrImage ? 'custom' : (personalInfo.qrMode || 'auto')
  );
  const [selectedTarget, setSelectedTarget] = useState(
    personalInfo.qrTarget || 'linkedin'
  );

  const showQr = personalInfo.showQrCode !== false;
  const customQrImage = personalInfo.customQrImage || null;

  useEffect(() => {
    if (personalInfo.customQrImage) {
      setActiveMode('custom');
    }
  }, [personalInfo.customQrImage]);

  useEffect(() => {
    if (personalInfo.qrTarget) {
      setSelectedTarget(personalInfo.qrTarget);
    }
  }, [personalInfo.qrTarget]);

  const handleSelectMode = (mode) => {
    setActiveMode(mode);
    if (onChange) {
      onChange({ target: { name: 'qrMode', value: mode } });
    }
  };

  const handleSelectTarget = (targetId) => {
    setSelectedTarget(targetId);
    if (onChange) {
      onChange({ target: { name: 'qrTarget', value: targetId } });
      onChange({ target: { name: 'qrMode', value: 'auto' } });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (onChange) {
        onChange({ target: { name: 'customQrImage', value: dataUrl } });
        onChange({ target: { name: 'qrMode', value: 'custom' } });
        onChange({ target: { name: 'showQrCode', value: true } });
      }
      setActiveMode('custom');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedQr = () => {
    if (onChange) {
      onChange({ target: { name: 'customQrImage', value: null } });
      onChange({ target: { name: 'qrMode', value: 'auto' } });
    }
    setActiveMode('auto');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to get current URL value for editing
  const getTargetUrl = () => {
    if (selectedTarget === 'linkedin') return personalInfo.linkedin || '';
    if (selectedTarget === 'portfolio') return personalInfo.portfolio || '';
    if (selectedTarget === 'github') return personalInfo.github || '';
    return '';
  };

  const handleUrlChange = (e) => {
    if (onChange) {
      onChange({ target: { name: selectedTarget, value: e.target.value } });
    }
  };

  return (
    <div style={{
      marginTop: '0.75rem',
      padding: '0.9rem 1rem',
      background: '#f8fafc',
      borderRadius: '10px',
      border: '1.5px solid #cbd5e1',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      fontFamily: 'inherit'
    }}>
      {/* Hidden File Input for Native File Dialog */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Top Bar: Title & Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb'
          }}>
            <QrCode size={16} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
              Profile QR Code (Scan to View)
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
              Auto-generate from profile link or upload your own QR scan
            </span>
          </div>
        </div>

        <label style={{ position: 'relative', display: 'inline-block', width: 38, height: 20, cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            name="showQrCode"
            checked={showQr} 
            onChange={(e) => {
              if (onChange) onChange({ target: { name: 'showQrCode', value: e.target.checked } });
            }}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span style={{
            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
            background: showQr ? '#10b981' : '#cbd5e1',
            borderRadius: 20, transition: '0.2s'
          }}>
            <span style={{
              position: 'absolute', content: '""', height: 14, width: 14, left: 3, bottom: 3,
              background: 'white', borderRadius: '50%', transition: '0.2s',
              transform: showQr ? 'translateX(18px)' : 'translateX(0px)'
            }} />
          </span>
        </label>
      </div>

      {showQr && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* Main 2 Tabs: Auto-Generate vs Upload */}
          <div style={{ display: 'flex', gap: '0.4rem', background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => handleSelectMode('auto')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: '6px',
                border: 'none',
                background: activeMode === 'auto' ? '#ffffff' : 'transparent',
                color: activeMode === 'auto' ? '#1e293b' : '#64748b',
                fontSize: '0.75rem',
                fontWeight: activeMode === 'auto' ? 900 : 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: activeMode === 'auto' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Link2 size={13} color={activeMode === 'auto' ? '#2563eb' : '#64748b'} />
              <span>Auto-Generate from Link</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('custom')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: '6px',
                border: 'none',
                background: activeMode === 'custom' ? '#ffffff' : 'transparent',
                color: activeMode === 'custom' ? '#1e293b' : '#64748b',
                fontSize: '0.75rem',
                fontWeight: activeMode === 'custom' ? 900 : 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: activeMode === 'custom' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Upload size={13} color={activeMode === 'custom' ? '#7c3aed' : '#64748b'} />
              <span>Upload Custom QR Image</span>
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 1: AUTO-GENERATE FROM LINK (LinkedIn, Portfolio, GitHub) */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeMode === 'auto' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              
              {/* 3 Link Selection Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { id: 'linkedin', label: 'LinkedIn QR' },
                  { id: 'portfolio', label: 'Portfolio QR' },
                  { id: 'github', label: 'GitHub QR' }
                ].map(target => {
                  const isSelected = selectedTarget === target.id;
                  return (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => handleSelectTarget(target.id)}
                      style={{
                        flex: 1,
                        padding: '0.45rem 0.5rem',
                        borderRadius: '6px',
                        border: isSelected ? '2px solid #059669' : '1.5px solid #cbd5e1',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        color: isSelected ? '#047857' : '#475569',
                        fontSize: '0.74rem',
                        fontWeight: isSelected ? 900 : 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '3px',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 1px 3px rgba(16, 185, 129, 0.2)' : 'none'
                      }}
                    >
                      {isSelected && <Check size={13} color="#059669" />}
                      <span>{target.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Target URL Input Field */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    Target URL for {selectedTarget.toUpperCase()}:
                  </label>
                  <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>
                    Live Auto QR Active ✔
                  </span>
                </div>
                <input
                  type="text"
                  name={selectedTarget}
                  value={getTargetUrl()}
                  onChange={handleUrlChange}
                  placeholder={
                    selectedTarget === 'linkedin' ? 'e.g. linkedin.com/in/your-profile' :
                    selectedTarget === 'portfolio' ? 'e.g. yourname.tech / portfolio.com' :
                    'e.g. github.com/your-username'
                  }
                  style={{
                    width: '100%',
                    padding: '0.45rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.78rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 2: UPLOAD CUSTOM QR IMAGE / SCAN                          */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeMode === 'custom' && (
            <div>
              {customQrImage ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  border: '1.5px solid #10b981',
                  borderRadius: '8px',
                  padding: '0.6rem 0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img 
                      src={customQrImage} 
                      alt="Uploaded QR" 
                      style={{ width: 44, height: 44, borderRadius: '4px', objectFit: 'contain', border: '1px solid #e2e8f0', background: '#fff', padding: '2px' }} 
                    />
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={14} /> Custom QR Code Uploaded
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Displayed on resume preview</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '0.35rem 0.65rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveUploadedQr}
                      style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#ef4444', padding: '0.35rem 0.55rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Remove uploaded QR"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1rem',
                    border: '2px dashed #7c3aed',
                    background: '#faf5ff',
                    borderRadius: '8px',
                    color: '#7c3aed',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f3e8ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#faf5ff'; }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#ede9fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Upload size={18} color="#7c3aed" />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '0.82rem', color: '#6d28d9' }}>
                    Click here to Upload QR Code Image / Scan
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    Supports PNG, JPG, JPEG, SVG or WebP from your computer or mobile
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QrScanUploadSection;
