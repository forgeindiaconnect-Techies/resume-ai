import React from 'react';
import { Download, Sparkles } from 'lucide-react';

const ResumeToolbar = ({
  selectedColor,
  onChangeColor,
  templateId,
  onChangeTemplate,
  selectedFont,
  onChangeFont,
  zoomLevel,
  onChangeZoom,
  isPremiumUser,
  onDownloadAction
}) => {
  const colors = ['#7c3aed', '#10b981', '#2563eb', '#f59e0b', '#dc2626', '#000000'];
  const zoomLevels = [0.5, 0.6, 0.8, 1.0];

  return (
    <div className="no-print" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.6rem 1.25rem', 
      background: 'white', 
      borderBottom: '1px solid #e2e8f0',
      flexShrink: 0,
      gap: '0.75rem'
    }}>
      {/* Color Picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {colors.map(c => (
          <button
            key={c}
            onClick={() => onChangeColor(c)}
            style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              background: c, 
              border: selectedColor === c ? '2px solid white' : '1px solid #cbd5e1', 
              boxShadow: selectedColor === c ? '0 0 0 2px #7c3aed' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Template Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Template</span>
          <select 
            value={templateId} 
            onChange={(e) => onChangeTemplate(e.target.value)}
            style={{ border: '1px solid #cbd5e1', background: 'white', padding: '0.25rem 0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
          >
            <option value="professional">Professional</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
            <option value="executive">Executive</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        {/* Font Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Font</span>
          <select 
            value={selectedFont} 
            onChange={(e) => onChangeFont(e.target.value)}
            style={{ border: '1px solid #cbd5e1', background: 'white', padding: '0.25rem 0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
          >
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Playfair Display', serif">Playfair</option>
            <option value="'Roboto', sans-serif">Roboto</option>
          </select>
        </div>

        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          {zoomLevels.map(val => (
            <button 
              key={val}
              onClick={() => onChangeZoom(val)}
              style={{ 
                border: '1px solid #cbd5e1', 
                background: zoomLevel === val ? '#f1f5f9' : 'white', 
                color: zoomLevel === val ? '#0f172a' : '#64748b',
                padding: '0.25rem 0.45rem', 
                fontSize: '0.7rem', 
                borderRadius: '6px', 
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {val * 100}%
            </button>
          ))}
        </div>

        {/* Download / Unlock CTA */}
        <button 
          onClick={onDownloadAction}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            padding: '0.4rem 0.85rem', 
            background: isPremiumUser ? '#10b981' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', 
            color: 'white',
            border: 'none',
            borderRadius: '8px', 
            fontSize: '0.75rem', 
            fontWeight: 900, 
            cursor: 'pointer',
            boxShadow: isPremiumUser ? '0 4px 10px rgba(16, 185, 129, 0.2)' : '0 4px 10px rgba(124, 58, 237, 0.25)',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          {isPremiumUser ? <Download size={14} /> : <Sparkles size={14} />} 
          {isPremiumUser ? 'Download PDF' : 'Unlock Premium'}
        </button>
      </div>
    </div>
  );
};

export default ResumeToolbar;
