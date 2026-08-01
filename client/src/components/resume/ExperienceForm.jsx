import React from 'react';
import { Trash2 } from 'lucide-react';

const ExperienceForm = ({ experience = [], onAdd, onUpdate, onDelete, onRunAi }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Experience</h3>
        <button 
          onClick={onAdd} 
          style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
        >
          + Add Experience
        </button>
      </div>
      {experience.map((exp, idx) => (
        <div key={exp.id || idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
          <button 
            onClick={() => onDelete(exp.id)} 
            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
          >
            <Trash2 size={16} />
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Company</label>
              <input 
                placeholder="Company" 
                value={exp.company || ''} 
                onChange={(e) => onUpdate(exp.id, 'company', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Role</label>
              <input 
                placeholder="Role" 
                value={exp.role || ''} 
                onChange={(e) => onUpdate(exp.id, 'role', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
          </div>
          
          <div className="input-group" style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Duration</label>
            <input 
              placeholder="Duration (e.g. 2023 - Present)" 
              value={exp.duration || ''} 
              onChange={(e) => onUpdate(exp.id, 'duration', e.target.value)} 
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Description</label>
            <button 
              type="button" 
              onClick={() => onRunAi('AI Generate Description', exp.id)} 
              style={{ border: 'none', background: '#eff6ff', color: '#2563eb', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}
            >
              ✨ AI Generate Description
            </button>
          </div>
          <textarea 
            placeholder="List key contributions..." 
            value={exp.desc || ''} 
            onChange={(e) => onUpdate(exp.id, 'desc', e.target.value)} 
            rows={3} 
            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', outline: 'none', fontSize: '0.85rem' }} 
          />
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;
