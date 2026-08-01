import React from 'react';

const PersonalForm = ({ personalInfo, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Personal Details</h3>
      
      <div className="input-group">
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Full Name</label>
        <input 
          type="text" 
          name="name" 
          value={personalInfo.name || ''} 
          onChange={onChange} 
          style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
        />
      </div>

      <div className="input-group">
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Email Address</label>
        <input 
          type="email" 
          name="email" 
          value={personalInfo.email || ''} 
          onChange={onChange} 
          style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="input-group">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Phone</label>
          <input 
            type="text" 
            name="phone" 
            value={personalInfo.phone || ''} 
            onChange={onChange} 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
        <div className="input-group">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Location</label>
          <input 
            type="text" 
            name="location" 
            value={personalInfo.location || ''} 
            onChange={onChange} 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
      </div>

      <div className="input-group">
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>LinkedIn URL</label>
        <input 
          type="text" 
          name="linkedin" 
          value={personalInfo.linkedin || ''} 
          onChange={onChange} 
          style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="input-group">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>GitHub URL</label>
          <input 
            type="text" 
            name="github" 
            value={personalInfo.github || ''} 
            onChange={onChange} 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
        <div className="input-group">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Portfolio Link</label>
          <input 
            type="text" 
            name="portfolio" 
            value={personalInfo.portfolio || ''} 
            onChange={onChange} 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalForm;
