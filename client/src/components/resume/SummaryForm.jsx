import React from 'react';

const SummaryForm = ({ summary, onChange, onRunAi }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Professional Summary</h3>
      
      <textarea 
        name="summary" 
        value={summary || ''} 
        onChange={onChange} 
        rows={8} 
        placeholder="State your key professional achievements and target goals..."
        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', fontSize: '0.9rem' }}
      />
      
      <div>
        <button 
          type="button" 
          onClick={() => onRunAi(summary ? 'AI Improve Summary' : 'AI Generate Summary')} 
          style={{ 
            width: '100%',
            border: 'none', 
            background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', 
            color: '#7c3aed', 
            padding: '0.65rem 1rem', 
            borderRadius: '8px', 
            fontWeight: 800, 
            fontSize: '0.85rem', 
            cursor: 'pointer',
            border: '1px solid #ddd6fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            transition: 'all 0.15s'
          }}
        >
          ✨ {summary ? 'AI Enhance Summary' : 'AI Generate Summary'}
        </button>
      </div>
    </div>
  );
};

export default SummaryForm;
