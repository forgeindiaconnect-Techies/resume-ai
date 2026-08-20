import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, ArrowLeft, Palette, Type, Check, RefreshCw, Sparkles, Lock, Eye, ZoomIn, ZoomOut, Maximize2, ShieldCheck, Award, Edit3, Save, Search, RotateCcw, Image as ImageIcon, Briefcase, GraduationCap, Code, Globe, User, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/common/PaymentModal';
import DownloadWorkflowModal from '../components/common/DownloadWorkflowModal';
import PhotoEditorModal from '../components/common/PhotoEditorModal';
import { exportResumeToPdf, generateProfessionalFilename } from '../utils/pdfExport';

import ModernLayout from '../components/layouts/ModernLayout';
import ExecutiveLayout from '../components/layouts/ExecutiveLayout';
import CreativeLayout from '../components/layouts/CreativeLayout';
import MinimalLayout from '../components/layouts/MinimalLayout';
import ProfessionalLayout from '../components/layouts/ProfessionalLayout';
import EnhancvLayout from '../components/layouts/EnhancvLayout';
import DragDropSections from '../components/DragDropSections';
import ResumeFooter from '../components/layouts/ResumeFooter';

// ─── Reusable Components ────────────────────────────────────────────────
export const PRESET_COLORS = [
  { id: 'sky', name: 'Royal Blue', hex: '#0284c7' },
  { id: 'navy', name: 'Deep Navy', hex: '#1e3a8a' },
  { id: 'emerald', name: 'Emerald', hex: '#059669' },
  { id: 'purple', name: 'Violet', hex: '#7c3aed' },
  { id: 'rose', name: 'Crimson', hex: '#e11d48' },
  { id: 'amber', name: 'Amber', hex: '#d97706' },
  { id: 'slate', name: 'Charcoal', hex: '#334155' }
];

export const PRESET_FONTS = [
  { id: 'inter', name: 'Inter (Modern)', value: "'Inter', sans-serif" },
  { id: 'poppins', name: 'Poppins (Geometric)', value: "'Poppins', sans-serif" },
  { id: 'roboto', name: 'Roboto (Standard)', value: "'Roboto', sans-serif" },
  { id: 'lato', name: 'Lato (Clean)', value: "'Lato', sans-serif" },
  { id: 'open-sans', name: 'Open Sans (Neutral)', value: "'Open Sans', sans-serif" },
  { id: 'playfair', name: 'Playfair (Serif)', value: "'Playfair Display', serif" },
  { id: 'merriweather', name: 'Merriweather (Serif)', value: "'Merriweather', serif" },
  { id: 'lora', name: 'Lora (Elegant Serif)', value: "'Lora', serif" },
  { id: 'montserrat', name: 'Montserrat (Bold)', value: "'Montserrat', sans-serif" },
  { id: 'nunito', name: 'Nunito (Rounded)', value: "'Nunito', sans-serif" },
  { id: 'raleway', name: 'Raleway (Elegant Sans)', value: "'Raleway', sans-serif" },
  { id: 'ubuntu', name: 'Ubuntu (Tech)', value: "'Ubuntu', sans-serif" }
];

// ─── Input Field ──────────────────────────────────────────────────────────
export const Field = ({ label, name, value, onChange, type = 'text', placeholder = '', accent = '#0284c7' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
    {label && <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>}
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fafafa', transition: 'all 0.15s' }}
      onFocus={e => { e.target.style.border = `1.5px solid ${accent}`; e.target.style.background = '#fff'; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
      onBlur={e => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

// ─── Textarea Field ───────────────────────────────────────────────────────
export const TextArea = ({ label, name, value, onChange, placeholder = '', rows = 4, accent = '#0284c7' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
    {label && <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>}
    <textarea
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fafafa', lineHeight: 1.6, transition: 'all 0.15s' }}
      onFocus={e => { e.target.style.border = `1.5px solid ${accent}`; e.target.style.background = '#fff'; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
      onBlur={e => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────
export const SectionHeader = ({ icon, title, accent, isCollapsed = false, onToggle }) => (
  <div 
    onClick={onToggle}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      margin: '1.25rem 0 0.6rem', 
      padding: '0.45rem 0.65rem', 
      borderRadius: '8px',
      background: '#f8fafc',
      border: `1px solid ${accent}25`,
      cursor: onToggle ? 'pointer' : 'default',
      userSelect: 'none'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
      <h3 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h3>
    </div>
    {onToggle && (
      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: accent }}>
        {isCollapsed ? '▶' : '▼'}
      </span>
    )}
  </div>
);

// ─── Form Accordion Section ──────────────────────────────────────────────
export const FormAccordionSection = ({ icon, title, accent = '#0284c7', children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div style={{ marginBottom: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#ffffff' }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0.55rem 0.75rem', 
          background: isExpanded ? `${accent}0d` : '#f8fafc',
          borderBottom: isExpanded ? `1px solid ${accent}20` : 'none',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
          <h3 style={{ margin: 0, fontSize: '0.76rem', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h3>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: accent }}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>
      {isExpanded && (
        <div style={{ padding: '0.75rem 0.85rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Add Button ───────────────────────────────────────────────────────────
export const AddButton = ({ label, onClick, accent }) => {
  const cleanLabel = label.replace(/^\+\s*/, '');
  return (
    <button onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', padding: '0.6rem', borderRadius: '8px', border: `1.5px dashed ${accent}50`, background: `${accent}06`, color: accent, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', justifyContent: 'center', transition: 'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.borderColor = accent; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${accent}06`; e.currentTarget.style.borderColor = `${accent}50`; }}>
      <Plus size={13} /> {cleanLabel}
    </button>
  );
};

// ─── Delete Button ────────────────────────────────────────────────────────
export const DeleteBtn = ({ onClick }) => (
  <button onClick={onClick}
    style={{ background: 'none', border: '1px solid #fecaca', color: '#f87171', width: 26, height: 26, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s', padding: 0 }}
    onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#f87171'; }}>
    <Trash2 size={12} />
  </button>
);

// ─── Skill Tag Input ─────────────────────────────────────────────────────
export const SkillTagInput = ({ label, skills = [], onAdd, onRemove, accent, placeholder = 'Type and press Enter' }) => {
  const [input, setInput] = useState('');
  const handleKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      onAdd(input.trim().replace(/,$/, ''));
      setInput('');
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>}
      <div style={{ minHeight: 36, display: 'flex', flexWrap: 'wrap', gap: '0.35rem', background: '#fafafa', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '0.4rem 0.6rem', alignItems: 'center' }}>
        {skills.map((sk, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: `${accent}15`, color: accent, border: `1px solid ${accent}30`, padding: '0.15rem 0.55rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
            {sk}<span onClick={() => onRemove(i)} style={{ cursor: 'pointer', fontWeight: 900, marginLeft: '0.1rem', opacity: 0.7 }}>×</span>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={skills.length === 0 ? placeholder : '+Add more'}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.82rem', minWidth: 80, flex: 1, fontFamily: 'inherit' }}
        />
      </div>
      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Press Enter or comma to add</span>
    </div>
  );
};

// ─── 2-column grid ───────────────────────────────────────────────────────
export const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>{children}</div>
);

// ─── Card for a repeatable item ───────────────────────────────────────────
export const ItemCard = ({ children, onDelete, accent, index }) => (
  <div style={{ background: '#f8fafc', border: '1px solid #e8ecf0', borderRadius: '10px', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', position: 'relative' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-0.1rem' }}>
      {index !== undefined && <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>#{index + 1}</span>}
      <DeleteBtn onClick={onDelete} />
    </div>
    {children}
  </div>
);

// ─── Full Editor Shell ────────────────────────────────────────────────────
export const EditorShell = ({ 
  accentColor = '#0284c7', 
  onColorChange,
  fontFamily = "'Inter', sans-serif",
  onFontChange,
  settings,
  onSettingsChange,
  templateId,
  onTemplateChange,
  templateName = 'Modern', 
  templateEmoji = '💻', 
  onDownload, 
  saveStatus = 'All changes saved ✔', 
  children, 
  preview 
}) => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDownloadWorkflowModal, setShowDownloadWorkflowModal] = useState(false);
  const [showPrintPreviewModal, setShowPrintPreviewModal] = useState(false);

  // Premium Editor Customization States
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'style' | 'layout' | 'scores'
  
  // Controlled Template Fallback
  const [localTemplate, setLocalTemplate] = useState(templateName.toLowerCase());
  const activeTemplate = templateId || localTemplate;

  const [primaryColor, setPrimaryColor] = useState(accentColor || '#0284c7');
  const [secondaryColor, setSecondaryColor] = useState('#2563eb');
  const [selectedFont, setSelectedFont] = useState(fontFamily || "'Inter', sans-serif");
  
  // Controlled Settings Fallback
  const [localSettings, setLocalSettings] = useState({
    headingSize: 24,
    bodySize: 14,
    layoutMode: 'left-sidebar',
    spacingDensity: 'normal'
  });

  const currentSettings = settings || localSettings;
  const headingSize = currentSettings.headingSize ?? 24;
  const bodySize = currentSettings.bodySize ?? 14;
  const layoutMode = currentSettings.layoutMode || 'left-sidebar';
  const spacingDensity = currentSettings.spacingDensity || 'normal';

  const updateSetting = (key, value) => {
    if (onSettingsChange) {
      onSettingsChange({ ...(settings || localSettings), [key]: value });
    } else {
      setLocalSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const setHeadingSize = (val) => updateSetting('headingSize', val);
  const setBodySize = (val) => updateSetting('bodySize', val);
  const setLayoutMode = (val) => updateSetting('layoutMode', val);
  const setSpacingDensity = (val) => updateSetting('spacingDensity', val);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.82); // 0.50, 0.75, 0.82, 1.00, 1.25, 1.50

  const TEMPLATES = [
    { id: 'modern', name: 'Modern', emoji: '💻', isPremium: false, component: ModernLayout },
    { id: 'executive', name: 'Executive', emoji: '🏛', isPremium: false, component: ExecutiveLayout },
    { id: 'creative', name: 'Creative', emoji: '🎨', isPremium: true, component: CreativeLayout },
    { id: 'minimal', name: 'Minimal', emoji: '🪶', isPremium: false, component: MinimalLayout },
    { id: 'professional', name: 'Professional', emoji: '📋', isPremium: true, component: ProfessionalLayout },
    { id: 'enhancv', name: 'Enhancv', emoji: '⚡', isPremium: true, component: EnhancvLayout },
  ];

  useEffect(() => {
    // INTELLIGENT SYNC: If the current draft hasn't been paid for yet, ensure preview isn't artificially premium
    const sessionId = window.location.pathname.split('/').pop();
    const raw = localStorage.getItem(`resume_draft_${sessionId}`) || localStorage.getItem('localResumeDraft');
    const draft = JSON.parse(raw || '{}');
    if (draft.paymentStatus !== 'paid') {
      localStorage.removeItem('user_premium');
    }

    const handleOpenPayment = (e) => {
      setPaymentReason(e.detail?.reason || 'download');
      setShowPaymentModal(true);
    };
    const handleOpenDownload = () => {
      setShowDownloadWorkflowModal(true);
    };
    
    window.addEventListener('open-payment-modal', handleOpenPayment);
    window.addEventListener('open-download-workflow', handleOpenDownload);
    return () => {
      window.removeEventListener('open-payment-modal', handleOpenPayment);
      window.removeEventListener('open-download-workflow', handleOpenDownload);
    };
  }, []);

  const source = localStorage.getItem('source') || 'create';
  console.log("Resume source:", source);

  const handleDownloadAction = () => {
    setShowDownloadWorkflowModal(true);
  };

  const handleTemplateSwitch = (tpl) => {
    const isUserPremium = localStorage.getItem('user_premium') === 'true';
    if (tpl.isPremium && !isUserPremium) {
      setShowPaymentModal(true);
      return;
    }
    if (onTemplateChange) {
      onTemplateChange(tpl.id);
    } else {
      setLocalTemplate(tpl.id);
    }
  };

  const handlePrimaryColorChange = (hex) => {
    setPrimaryColor(hex);
    if (onColorChange) onColorChange(hex);
  };

  const handleFontChange = (font) => {
    setSelectedFont(font);
    if (onFontChange) onFontChange(font);
  };

  // Determine current active preview layout component
  const currentTplObj = TEMPLATES.find(t => t.id === activeTemplate) || TEMPLATES[0];
  const ActiveLayoutComponent = currentTplObj.component;

  // Build cloned layout preview
  const renderedPreview = preview && preview.props && preview.props.data ? (
    <ActiveLayoutComponent 
      data={{ ...preview.props.data, profilePhoto: profilePhoto }} 
      role={preview.props.role}
      sections={preview.props.sections}
      customColor={primaryColor}
      secondaryColor={secondaryColor}
      customFont={selectedFont}
      headingSize={headingSize}
      fontSize={bodySize}
      spacing={spacingDensity}
      layoutMode={layoutMode}
    />
  ) : preview;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f0f4f8', overflow: 'hidden' }}>

      {/* ── LEFT FORM PANEL ── */}
      <div className="no-print" style={{ width: 440, minWidth: 400, maxWidth: 440, background: '#ffffff', borderRight: '1px solid #e8ecf0', display: 'flex', flexDirection: 'column', height: '100vh', boxShadow: '2px 0 12px rgba(0,0,0,0.04)' }}>

        {/* Header Bar */}
        <div style={{ padding: '0.75rem 1.15rem 0.55rem', borderBottom: '1px solid #e2e8f0', background: `linear-gradient(135deg, ${primaryColor}0d, #ffffff)`, flexShrink: 0 }}>
          
          {/* Top Row: Back link & Title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
            <button 
              onClick={() => navigate('/industry-examples')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
            >
              <ArrowLeft size={13} /> Examples
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 26, height: 26, borderRadius: '8px', background: `${primaryColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{currentTplObj.emoji}</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: primaryColor }}>{currentTplObj.name} Editor</span>
            </div>

            <button onClick={handleDownloadAction}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: primaryColor, color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.78rem', cursor: 'pointer', boxShadow: `0 4px 12px ${primaryColor}40` }}>
              <Download size={13} /> PDF
            </button>
          </div>

          {/* Dynamic Template Switcher Row */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '0.4rem', scrollbarWidth: 'none', marginBottom: '0.4rem' }}>
            <button
              onClick={() => {
                localStorage.removeItem('user_premium');
                alert('Premium status reset! The payment modal will now show again.');
                window.location.reload();
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '3px', padding: '0.25rem 0.5rem', borderRadius: '6px',
                border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              <RefreshCw size={9} /> Reset Payment Test
            </button>
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => handleTemplateSwitch(t)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  border: activeTemplate === t.id ? `1.5px solid ${primaryColor}` : '1px solid #e2e8f0',
                  background: activeTemplate === t.id ? `${primaryColor}12` : '#ffffff',
                  color: activeTemplate === t.id ? primaryColor : '#64748b',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{t.emoji}</span>
                <span>{t.name}</span>
                {t.isPremium && <Lock size={9} color="#eab308" />}
              </button>
            ))}
          </div>

          {/* Customization Tab Switcher */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', gap: '2px', border: '1px solid #cbd5e1' }}>
            {[
              { id: 'content', label: '📝 Content' },
              { id: 'style', label: '🎨 Theme & Font' },
              { id: 'layout', label: '📐 Layout & Photo' },
              { id: 'scores', label: '📊 ATS Score' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '0.3rem 0.2rem',
                  borderRadius: '5px',
                  border: 'none',
                  background: activeTab === tab.id ? '#ffffff' : 'transparent',
                  color: activeTab === tab.id ? primaryColor : '#64748b',
                  fontWeight: 900,
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Auto Save Status Banner */}
          <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, marginTop: '0.35rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            {saveStatus} • Live real-time preview
          </div>
        </div>

        {/* Scrollable Panel Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1.15rem 2rem', scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
          
          {/* TAB 1: FORM CONTENT */}
          {activeTab === 'content' && children}

          {/* TAB 2: STYLE, COLORS & FONTS */}
          {activeTab === 'style' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', padding: '0.4rem 0' }}>
              
              {/* Primary Color Swatches */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>
                  🎨 Primary Theme Color:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.id}
                      title={c.name}
                      onClick={() => handlePrimaryColorChange(c.hex)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: c.hex,
                        border: primaryColor.toLowerCase() === c.hex.toLowerCase() ? '2.5px solid #0f172a' : '1px solid rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        transform: primaryColor.toLowerCase() === c.hex.toLowerCase() ? 'scale(1.15)' : 'scale(1)'
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={e => handlePrimaryColorChange(e.target.value)}
                    title="Pick Custom Primary Color"
                    style={{ width: 26, height: 26, padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: '50%' }}
                  />
                </div>
              </div>

              {/* Accent / Secondary Color */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>
                  🟢 Secondary / Accent Color:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {['#059669', '#2563eb', '#7c3aed', '#dc2626', '#f59e0b', '#0f172a'].map((hex, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSecondaryColor(hex)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: hex,
                        border: secondaryColor.toLowerCase() === hex.toLowerCase() ? '2.5px solid #0f172a' : '1px solid rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        transform: secondaryColor.toLowerCase() === hex.toLowerCase() ? 'scale(1.15)' : 'scale(1)'
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={e => setSecondaryColor(e.target.value)}
                    title="Pick Custom Accent Color"
                    style={{ width: 26, height: 26, padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: '50%' }}
                  />
                </div>
              </div>

              {/* Font Family Selector */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>
                  🔤 Font Family:
                </label>
                <select
                  value={selectedFont}
                  onChange={e => handleFontChange(e.target.value)}
                  style={{
                    width: '100%',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: 'white',
                    color: '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  {PRESET_FONTS.map(f => (
                    <option key={f.id} value={f.value}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Font Size Sliders */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 900, color: '#334155', marginBottom: '0.35rem' }}>
                    <span>Heading Size</span>
                    <span>{headingSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="32"
                    value={headingSize}
                    onChange={e => setHeadingSize(Number(e.target.value))}
                    style={{ width: '100%', accentColor: primaryColor }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8' }}>
                    <span>18px</span>
                    <span>32px</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 900, color: '#334155', marginBottom: '0.35rem' }}>
                    <span>Body Text Size</span>
                    <span>{bodySize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="18"
                    value={bodySize}
                    onChange={e => setBodySize(Number(e.target.value))}
                    style={{ width: '100%', accentColor: primaryColor }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8' }}>
                    <span>12px</span>
                    <span>18px</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: LAYOUT, SPACING & PHOTO */}
          {activeTab === 'layout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', padding: '0.4rem 0' }}>
              
              {/* Layout Switcher */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>
                  📐 Layout Options:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'left-sidebar', label: 'Left Sidebar' },
                    { id: 'right-sidebar', label: 'Right Sidebar' },
                    { id: 'single', label: 'Single Column' },
                    { id: 'two-column', label: 'Two Column' }
                  ].map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLayoutMode(l.id)}
                      style={{
                        padding: '0.45rem 0.5rem',
                        borderRadius: '6px',
                        border: layoutMode === l.id ? `2px solid ${primaryColor}` : '1px solid #cbd5e1',
                        background: layoutMode === l.id ? `${primaryColor}10` : 'white',
                        color: layoutMode === l.id ? primaryColor : '#475569',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacing & Margins */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>
                  📏 Spacing & White Space:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { id: 'compact', label: 'Compact' },
                    { id: 'normal', label: 'Normal' },
                    { id: 'comfortable', label: 'Comfortable' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSpacingDensity(s.id)}
                      style={{
                        flex: 1,
                        padding: '0.45rem 0.4rem',
                        borderRadius: '6px',
                        border: spacingDensity === s.id ? `2px solid ${primaryColor}` : '1px solid #cbd5e1',
                        background: spacingDensity === s.id ? `${primaryColor}10` : 'white',
                        color: spacingDensity === s.id ? primaryColor : '#475569',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Photo Control */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>
                  🖼️ Profile Photo:
                </label>
                
                {profilePhoto?.url ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={profilePhoto.url} 
                      alt="Profile" 
                      style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #cbd5e1' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setShowPhotoEditor(true)}
                        style={{ background: '#e0e7ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '0.4rem 0.75rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.72rem', cursor: 'pointer' }}
                      >
                        Edit Photo
                      </button>
                      <button
                        onClick={() => setProfilePhoto(null)}
                        style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', padding: '0.4rem 0.75rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.72rem', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setShowPhotoEditor(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: '1rem' }}>🖼️</span>
                      Upload Photo
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: ATS & RESUME SCORE WIDGET */}
          {activeTab === 'scores' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.4rem 0' }}>
              
              {/* Scores Card */}
              <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Resume Quality Score</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#34d399' }}>95%</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a7f3d0' }}>Excellent Quality</div>
                  </div>
                  <div style={{ width: 45, height: 45, borderRadius: '50%', border: '3.5px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900 }}>
                    95
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#cbd5e1' }}>ATS Compatibility Score:</span>
                    <span style={{ fontWeight: 900, color: '#38bdf8' }}>92%</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', fontSize: '0.68rem', color: '#94a3b8' }}>
                    <span style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px' }}>Keywords: Good</span>
                    <span style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px' }}>Format: Excellent</span>
                  </div>
                </div>
              </div>

              {/* Suggestions List */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>
                  💡 Actionable Improvement Suggestions:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: '#334155', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669' }}>
                    <Check size={14} /> Add 1 more project / case study
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669' }}>
                    <Check size={14} /> Include metrics in work experience
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669' }}>
                    <Check size={14} /> Add certifications or licenses
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ── RIGHT PREVIEW PANEL ── */}
      <div style={{ flex: 1, background: '#dde3ec', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        
        {/* Preview Header Bar with Zoom Controls & Full Print Preview */}
        <div className="no-print" style={{ padding: '0.55rem 1.25rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #d1d9e3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Preview · {currentTplObj.name} Template
            </span>
          </div>

          {/* Zoom Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '2px 6px' }}>
            <button onClick={() => setZoomLevel(prev => Math.max(0.5, Number((prev - 0.1).toFixed(2))))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#475569' }} title="Zoom Out">
              <ZoomOut size={13} />
            </button>
            
            {[0.5, 0.75, 0.82, 1.0, 1.25, 1.5].map(z => (
              <button
                key={z}
                onClick={() => setZoomLevel(z)}
                style={{
                  background: zoomLevel === z ? '#ffffff' : 'transparent',
                  color: zoomLevel === z ? primaryColor : '#64748b',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  padding: '2px 4px',
                  cursor: 'pointer'
                }}
              >
                {Math.round(z * 100)}%
              </button>
            ))}

            <button onClick={() => setZoomLevel(prev => Math.min(1.5, Number((prev + 0.1).toFixed(2))))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#475569' }} title="Zoom In">
              <ZoomIn size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => setShowPrintPreviewModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '0.4rem 0.75rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
            >
              <Eye size={13} /> Print Preview
            </button>

            <button 
              onClick={handleDownloadAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: `linear-gradient(135deg, ${primaryColor}, #4f46e5)`,
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${primaryColor}35`
              }}
            >
              <Download size={13} /> Download PDF
            </button>
          </div>
        </div>

        {/* Page Count Indicator */}
        <div style={{ background: '#e2e8f0', padding: '0.25rem 1rem', fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
          📄 Page 1 of 1 · A4 Sheet (210mm x 297mm) · Exact PDF Replica
        </div>

        {/* Preview Scroll Area */}
        <div className="resume-preview-container" style={{ flex: 1, padding: '2rem 1.5rem', scrollbarWidth: 'thin', scrollbarColor: '#c8d0dd transparent' }}>
          <div 
            className="resume-scale-wrapper"
            style={{ transform: `scale(${zoomLevel})`, marginBottom: '-190px' }}
          >
            <div id="resume-preview-sheet" className="resume-page" style={{ position: 'relative', overflow: 'hidden' }}>
              {renderedPreview}
              {/* Diagonal watermark removed to allow clean footer watermark */}
              <ResumeFooter />
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Print Preview Read-Only Modal */}
      {showPrintPreviewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ width: '100%', maxWidth: 880, background: '#ffffff', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={18} color={primaryColor} />
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>Print & PDF High-Resolution Preview</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleDownloadAction}
                  style={{ background: primaryColor, color: 'white', border: 'none', padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Download size={14} /> Download PDF Now
                </button>
                
                <button 
                  onClick={() => setShowPrintPreviewModal(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.45rem 0.85rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Close Preview
                </button>
              </div>
            </div>

            {/* Printable Container */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#e2e8f0', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 794, minHeight: 1123, background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                {renderedPreview}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Download Review Workflow Modal */}
      <DownloadWorkflowModal
        isOpen={showDownloadWorkflowModal}
        onClose={() => setShowDownloadWorkflowModal(false)}
        formData={{ templateId: currentTplObj.name }}
        atsScore={92}
        onEdit={() => setShowDownloadWorkflowModal(false)}
        onNavigateHome={() => navigate('/')}
      />

      {/* Payment & Upgrade Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        source={source}
        onSuccessDownload={() => {
          setShowDownloadWorkflowModal(true);
        }}
      />

      <PhotoEditorModal
        isOpen={showPhotoEditor}
        onClose={() => setShowPhotoEditor(false)}
        photoData={profilePhoto}
        onSave={(data) => {
          setProfilePhoto(data);
          setShowPhotoEditor(false);
        }}
        themeColor={primaryColor}
      />
    </div>
  );
};

// ─── Load Session from localStorage ─────────────────────────────────────
export const loadSession = (sessionId) => {
  try {
    let raw = localStorage.getItem(`resume_draft_${sessionId}`);
    if (!raw) raw = localStorage.getItem('localResumeDraft');
    if (raw) {
      raw = raw.replace(/enhancv\.com/gi, 'forgeindiaconnect.com');
      const parsed = JSON.parse(raw);
      
      // Inject pricing configuration
      if (!parsed.source) {
        parsed.source = localStorage.getItem('source') || 'create';
      }
      if (!parsed.paymentStatus) {
        parsed.paymentStatus = 'pending';
      }
      return parsed;
    }
  } catch (e) {}
  return null;
};

// ─── Save Session to localStorage ────────────────────────────────────────
export const saveSession = (sessionId, data) => {
  try {
    // Ensure pricing configuration is saved
    if (!data.source) {
      data.source = localStorage.getItem('source') || 'create';
    }
    if (!data.paymentStatus) {
      data.paymentStatus = 'pending';
    }
    
    if (sessionId) localStorage.setItem(`resume_draft_${sessionId}`, JSON.stringify(data));
    localStorage.setItem('localResumeDraft', JSON.stringify(data));
  } catch (e) {}
};

// ─── Section Reorder & Visibility Control ───────────────────────────────────────
export const SectionReorderControl = ({ sections = [], onReorder, onToggle, accent = '#0284c7' }) => {
  const hiddenSections = sections.filter(s => s.enabled === false).map(s => s.id || s.title || s);

  const handleSetHiddenSections = (updater) => {
    if (!onToggle) return;
    if (typeof updater === 'function') {
      const nextHidden = updater(hiddenSections);
      sections.forEach(s => {
        const id = s.id || s.title || s;
        const isHidden = nextHidden.includes(id);
        if (s.enabled === isHidden) {
          onToggle(id);
        }
      });
    }
  };

  return (
    <div style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0.75rem 0.85rem', margin: '1rem 0' }}>
      <DragDropSections
        sections={sections}
        setSections={onReorder}
        hiddenSections={hiddenSections}
        setHiddenSections={handleSetHiddenSections}
      />
    </div>
  );
};
