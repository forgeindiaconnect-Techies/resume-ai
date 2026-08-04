import React, { useState } from 'react';
import { Plus, Trash2, Download, ArrowLeft, Palette, Type, Check, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/common/PaymentModal';
import DownloadWorkflowModal from '../components/common/DownloadWorkflowModal';
import { exportResumeToPdf, generateProfessionalFilename } from '../utils/pdfExport';

// ─── Preset Color Swatches ────────────────────────────────────────────────
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
  { id: 'outfit', name: 'Outfit (Clean)', value: "'Outfit', sans-serif" },
  { id: 'playfair', name: 'Playfair (Serif)', value: "'Playfair Display', serif" },
  { id: 'poppins', name: 'Poppins (Geometric)', value: "'Poppins', sans-serif" },
  { id: 'roboto', name: 'Roboto (Standard)', value: "'Roboto', sans-serif" }
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
export const SectionHeader = ({ icon, title, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0 0.75rem', paddingBottom: '0.5rem', borderBottom: `2px solid ${accent}20` }}>
    {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
    <h3 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h3>
  </div>
);

// ─── Add Button ───────────────────────────────────────────────────────────
export const AddButton = ({ label, onClick, accent }) => (
  <button onClick={onClick}
    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', padding: '0.6rem', borderRadius: '8px', border: `1.5px dashed ${accent}50`, background: `${accent}06`, color: accent, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', justifyContent: 'center', transition: 'all 0.15s' }}
    onMouseEnter={e => { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.borderColor = accent; }}
    onMouseLeave={e => { e.currentTarget.style.background = `${accent}06`; e.currentTarget.style.borderColor = `${accent}50`; }}>
    <Plus size={13} /> {label}
  </button>
);

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
  templateName = 'Modern', 
  templateEmoji = '💻', 
  onDownload, 
  saveStatus, 
  children, 
  preview 
}) => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDownloadWorkflowModal, setShowDownloadWorkflowModal] = useState(false);

  const handleDownloadAction = () => {
    const isPremium = localStorage.getItem('user_premium') === 'true';
    if (!isPremium) {
      setShowPaymentModal(true);
    } else {
      setShowDownloadWorkflowModal(true);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f0f4f8', overflow: 'hidden' }}>

      {/* ── LEFT FORM PANEL ── */}
      <div className="no-print" style={{ width: 440, minWidth: 400, maxWidth: 440, background: '#ffffff', borderRight: '1px solid #e8ecf0', display: 'flex', flexDirection: 'column', height: '100vh', boxShadow: '2px 0 12px rgba(0,0,0,0.04)' }}>

        {/* Header Bar */}
        <div style={{ padding: '1rem 1.25rem 0.85rem', borderBottom: '1px solid #e2e8f0', background: `linear-gradient(135deg, ${accentColor}0d, #ffffff)`, flexShrink: 0 }}>
          
          {/* Top Row: Back link & Title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <button 
              onClick={() => navigate('/industry-examples')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
            >
              <ArrowLeft size={13} /> Examples
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '8px', background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{templateEmoji}</div>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: accentColor }}>{templateName} Editor</span>
            </div>

            <button onClick={handleDownloadAction}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: accentColor, color: '#fff', border: 'none', padding: '0.45rem 0.85rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.78rem', cursor: 'pointer', boxShadow: `0 4px 12px ${accentColor}40` }}>
              <Download size={13} /> PDF
            </button>
          </div>

          {/* User-Friendly Color Palette & Font Controls Bar */}
          <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0.6rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            
            {/* Color Swatches */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Palette size={12} color={accentColor} /> Color Theme:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {PRESET_COLORS.map(c => {
                  const isSel = accentColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.id}
                      title={c.name}
                      onClick={() => onColorChange && onColorChange(c.hex)}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: c.hex,
                        border: isSel ? '2px solid #0f172a' : '1px solid rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        transform: isSel ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s'
                      }}
                    >
                      {isSel && <Check size={11} color="white" strokeWidth={3} />}
                    </button>
                  );
                })}

                {/* Custom Color Input */}
                <input
                  type="color"
                  value={accentColor}
                  onChange={e => onColorChange && onColorChange(e.target.value)}
                  title="Pick Custom Color"
                  style={{ width: 22, height: 22, padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: '50%' }}
                />
              </div>
            </div>

            {/* Font Family Selector */}
            {onFontChange && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Type size={12} color={accentColor} /> Font Style:
                </span>
                <select
                  value={fontFamily}
                  onChange={e => onFontChange(e.target.value)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    color: '#0f172a'
                  }}
                >
                  {PRESET_FONTS.map(f => (
                    <option key={f.id} value={f.value}>{f.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, marginTop: '0.4rem', textAlign: 'center' }}>
            ✨ {saveStatus} • Real-time live preview on right pane
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.25rem 1.25rem 2rem', scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
          {children}
        </div>
      </div>

      {/* ── RIGHT PREVIEW PANEL ── */}
      <div style={{ flex: 1, background: '#dde3ec', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Preview Header Bar */}
        <div className="no-print" style={{ padding: '0.65rem 1.5rem', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #d1d9e3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview · {templateName} Template</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>A4 · PDF-ready</span>
            <button 
              onClick={handleDownloadAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white',
                border: 'none',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.15s'
              }}
            >
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>

        {/* Preview Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '2rem 1.5rem', scrollbarWidth: 'thin', scrollbarColor: '#c8d0dd transparent' }}>
          {/* A4 Paper Sheet */}
          <div 
            id="resume-preview-sheet"
            className="print-paper-sheet"
            style={{
              width: 794,
            minHeight: 1123,
            background: '#fff',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            borderRadius: '3px',
            transformOrigin: 'top center',
            transform: 'scale(0.82)',
            marginBottom: '-190px',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {preview}
          </div>
        </div>
      </div>

      {/* Download Review Workflow Modal */}
      <DownloadWorkflowModal
        isOpen={showDownloadWorkflowModal}
        onClose={() => setShowDownloadWorkflowModal(false)}
        formData={{ templateId: templateName }}
        atsScore={92}
        onEdit={() => setShowDownloadWorkflowModal(false)}
        onNavigateHome={() => navigate('/')}
      />

      {/* Payment & Upgrade Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccessDownload={() => {
          localStorage.setItem('user_premium', 'true');
          setShowPaymentModal(false);
          setShowDownloadWorkflowModal(true);
        }}
      />
    </div>
  );
};

// ─── Load Session from localStorage ─────────────────────────────────────
export const loadSession = (sessionId) => {
  try {
    const raw = localStorage.getItem(`resume_draft_${sessionId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

// ─── Save Session to localStorage ────────────────────────────────────────
export const saveSession = (sessionId, data) => {
  try {
    if (sessionId) localStorage.setItem(`resume_draft_${sessionId}`, JSON.stringify(data));
    localStorage.setItem('localResumeDraft', JSON.stringify(data));
  } catch (e) {}
};
