import React from 'react';
import QrScanUploadSection from '../common/QrScanUploadSection';

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
          placeholder="e.g. Rohan Sharma"
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
          placeholder="e.g. rohan.sharma@forgeindiaconnect.com"
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
            placeholder="e.g. +91 98765 43210"
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
            placeholder="e.g. Bengaluru, Karnataka"
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
          placeholder="e.g. linkedin.com/in/rohan-sharma"
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
            placeholder="e.g. github.com/rohansharma"
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
            placeholder="e.g. rohansharma.tech"
            value={personalInfo?.portfolio || ''} 
            onChange={onChange} 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
      </div>

      {/* ─── LinkedIn / Portfolio QR Code Settings & Upload ─── */}
      <QrScanUploadSection personalInfo={personalInfo} onChange={onChange} accentColor="#2563eb" />

      {/* ─── Recruiter Quick-Info Badges (Indian HR / Naukri / LinkedIn) ─── */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.85rem 1rem',
        background: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🇮🇳</span>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                Recruiter Quick-Info Badges
              </span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Shows Notice Period, Total Experience & Work Model at top for fast HR screening
              </span>
            </div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 38, height: 20, cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              name="showRecruiterBadges"
              checked={personalInfo?.showRecruiterBadges === true} 
              onChange={(e) => onChange({ target: { name: 'showRecruiterBadges', value: e.target.checked } })}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
              background: personalInfo?.showRecruiterBadges === true ? '#10b981' : '#cbd5e1',
              borderRadius: 20, transition: '0.2s'
            }}>
              <span style={{
                position: 'absolute', content: '""', height: 14, width: 14, left: 3, bottom: 3,
                background: 'white', borderRadius: '50%', transition: '0.2s',
                transform: personalInfo?.showRecruiterBadges === true ? 'translateX(18px)' : 'translateX(0px)'
              }} />
            </span>
          </label>
        </div>

        {personalInfo?.showRecruiterBadges === true && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginTop: '0.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>Notice Period</label>
              <select
                name="noticePeriod"
                value={personalInfo?.noticePeriod || 'Immediate Joiner'}
                onChange={onChange}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 600, outline: 'none' }}
              >
                <option value="Immediate Joiner">Immediate Joiner</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="45 Days">45 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="Serving Notice">Serving Notice</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>Total Experience</label>
              <input
                type="text"
                name="totalExp"
                placeholder="e.g. 5+ Years"
                value={personalInfo?.totalExp || '5+ Years'}
                onChange={onChange}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>Work Model</label>
              <select
                name="workPreference"
                value={personalInfo?.workPreference || 'Hybrid'}
                onChange={onChange}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 600, outline: 'none' }}
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Open to Relocate">Open to Relocate</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalForm;
