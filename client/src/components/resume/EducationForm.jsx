import React from 'react';
import { Trash2 } from 'lucide-react';

const EducationForm = ({ education = [], onAdd, onUpdate, onDelete }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Education</h3>
        <button 
          onClick={onAdd} 
          style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
        >
          + Add Education
        </button>
      </div>
      {education.map((edu, idx) => (
        <div key={edu.id || idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
          <button 
            onClick={() => onDelete(edu.id)} 
            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
          >
            <Trash2 size={16} />
          </button>
          
          <div className="input-group" style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>School/University</label>
            <input 
              placeholder="e.g. Indian Institute of Technology (IIT) Bombay" 
              value={edu.school || ''} 
              onChange={(e) => onUpdate(edu.id, 'school', e.target.value)} 
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Degree</label>
              <input 
                placeholder="e.g. B.Tech in Computer Science" 
                value={edu.degree || ''} 
                onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Department</label>
              <input 
                placeholder="e.g. Computer Science & Engineering" 
                value={edu.department || ''} 
                onChange={(e) => onUpdate(edu.id, 'department', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>CGPA / Percentage</label>
              <input 
                placeholder="e.g. 8.9 / 10 or 88%" 
                value={edu.cgpa || ''} 
                onChange={(e) => onUpdate(edu.id, 'cgpa', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Year</label>
              <input 
                placeholder="e.g. 2018 - 2022" 
                value={edu.year || ''} 
                onChange={(e) => onUpdate(edu.id, 'year', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationForm;
