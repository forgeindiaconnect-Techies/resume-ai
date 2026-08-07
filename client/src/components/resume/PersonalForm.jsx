import React from 'react';

const PersonalForm = ({ personalInfo, onChange, onOpenPhotoEditor }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Personal Details</h3>

      {/* Profile Photo Uploader */}
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.6rem' }}>Profile Photo</label>
        {personalInfo?.profilePhoto?.url ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src={personalInfo.profilePhoto.url} 
              alt="Profile" 
              style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #cbd5e1' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={onOpenPhotoEditor}
                style={{ background: '#e0e7ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Edit Photo
              </button>
              <button
                onClick={() => onChange({ target: { name: 'profilePhoto', value: '' } })}
                style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenPhotoEditor}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', width: 'fit-content' }}
          >
            <span style={{ fontSize: '1.2rem' }}>🖼️</span>
            Upload Profile Photo
          </button>
        )}
      </div>
      
      <div className="input-group">
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Full Name</label>
        <input 
          type="text" 
          name="name" 
          value={personalInfo?.name || ''} 
          onChange={onChange} 
          style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
        />
      </div>

      <div className="input-group">
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Email Address</label>
        <input 
          type="email" 
          name="email" 
          value={personalInfo?.email || ''} 
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
            value={personalInfo?.phone || ''} 
            onChange={onChange} 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
        <div className="input-group">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Location</label>
          <input 
            type="text" 
            name="location" 
            value={personalInfo?.location || ''} 
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
          value={personalInfo?.linkedin || ''} 
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
            value={personalInfo?.github || ''} 
            onChange={onChange} 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
        <div className="input-group">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Portfolio Link</label>
          <input 
            type="text" 
            name="portfolio" 
            value={personalInfo?.portfolio || ''} 
            onChange={onChange} 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalForm;
