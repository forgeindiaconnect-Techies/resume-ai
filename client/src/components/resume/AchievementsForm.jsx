import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

const AchievementsForm = ({ achievements = [], onAddAchievement, onDeleteAchievement, references = '', onChangeReferences }) => {
  const [newAchievement, setNewAchievement] = useState('');

  const handleAdd = () => {
    const val = newAchievement.trim();
    if (val && !achievements.includes(val)) {
      onAddAchievement(val);
    }
    setNewAchievement('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Achievements</h3>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem 0' }}>Add notable awards, honors, or professional milestones.</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="E.g., Secured 1st place in National Hackathon 2025" 
            value={newAchievement} 
            onChange={(e) => setNewAchievement(e.target.value)}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {achievements.map((ach, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{ach}</span>
              <button 
                onClick={() => onDeleteAchievement(idx)} 
                style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {achievements.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1rem', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#9ca3af', fontSize: '0.8rem', fontStyle: 'italic' }}>
              No achievements added yet.
            </div>
          )}
        </div>
      </div>

      <div style={{ height: '1px', background: '#cbd5e1' }} />

      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>References</h3>
        <textarea 
          placeholder="E.g., Available upon request or names and contact details of references" 
          value={references} 
          onChange={(e) => onChangeReferences(e.target.value)}
          rows={3} 
          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', outline: 'none', fontSize: '0.85rem' }} 
        />
      </div>
    </div>
  );
};

export default AchievementsForm;
