import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const LanguagesForm = ({ languagesList = [], onAddLanguage, onRemoveLanguage }) => {
  const [newLanguage, setNewLanguage] = useState('');
  
  const presets = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Russian', 'Portuguese'];

  const handleAdd = () => {
    const val = newLanguage.trim();
    if (val && !languagesList.includes(val)) {
      onAddLanguage(val);
    }
    setNewLanguage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Languages</h3>
      
      <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        {/* Active Languages */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {languagesList.map(lang => (
            <span 
              key={lang} 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.25rem', 
                background: '#eff6ff', 
                color: '#2563eb', 
                padding: '0.3rem 0.65rem', 
                borderRadius: '6px', 
                fontSize: '0.8rem', 
                fontWeight: 700 
              }}
            >
              {lang}
              <X 
                size={12} 
                onClick={() => onRemoveLanguage(lang)} 
                style={{ cursor: 'pointer', marginLeft: '0.15rem' }} 
              />
            </span>
          ))}
          {languagesList.length === 0 && (
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>No languages added yet</span>
          )}
        </div>

        {/* Input box */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Add a language..." 
            value={newLanguage} 
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
          />
          <button
            type="button"
            onClick={handleAdd}
            style={{ background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', padding: '0.55rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggestions:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {presets.map(lang => {
              const isChecked = languagesList.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  disabled={isChecked}
                  onClick={() => onAddLanguage(lang)}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: isChecked ? '#f3f4f6' : 'white',
                    color: isChecked ? '#9ca3af' : '#4b5563',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: isChecked ? 'default' : 'pointer'
                  }}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguagesForm;
