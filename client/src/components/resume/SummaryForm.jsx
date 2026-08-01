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
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          type="button" 
          onClick={() => onRunAi('AI Generate Summary')} 
          style={{ border: 'none', background: '#eff6ff', color: '#2563eb', padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}
        >
          ✨ AI Generate Summary
        </button>
        <button 
          type="button" 
          onClick={() => onRunAi('AI Improve Summary')} 
          style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}
        >
          ✨ AI Improve Summary
        </button>
      </div>
    </div>
  );
};

export default SummaryForm;
