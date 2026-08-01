import React from 'react';
import { Trash2 } from 'lucide-react';

const CertificatesForm = ({ certificates = [], onAdd, onUpdate, onDelete }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Certifications</h3>
        <button 
          onClick={onAdd} 
          style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
        >
          + Add Certificate
        </button>
      </div>
      {certificates.map((cert, idx) => (
        <div key={cert.id || idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
          <button 
            onClick={() => onDelete(cert.id)} 
            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
          >
            <Trash2 size={16} />
          </button>
          
          <div className="input-group" style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Certificate Name</label>
            <input 
              placeholder="Certificate Name" 
              value={cert.name || ''} 
              onChange={(e) => onUpdate(cert.id, 'name', e.target.value)} 
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Organization</label>
              <input 
                placeholder="Organization" 
                value={cert.organization || ''} 
                onChange={(e) => onUpdate(cert.id, 'organization', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Year</label>
              <input 
                placeholder="Year" 
                value={cert.year || ''} 
                onChange={(e) => onUpdate(cert.id, 'year', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CertificatesForm;
