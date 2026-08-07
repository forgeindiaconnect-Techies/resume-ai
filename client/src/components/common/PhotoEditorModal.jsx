import React, { useState, useEffect } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

const PhotoEditorModal = ({ isOpen, onClose, photoData, onSave, themeColor = '#7c3aed' }) => {
  const [data, setData] = useState({
    url: '',
    shape: 'circle',
    size: 80,
    position: 'left',
    border: 'none',
    shadow: false
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setData({
        url: photoData?.url || '',
        shape: photoData?.shape || 'circle',
        size: photoData?.size || 80,
        position: photoData?.position || 'left',
        border: photoData?.border || 'none',
        shadow: photoData?.shadow || false
      });
      setError('');
    }
  }, [isOpen, photoData]);

  if (!isOpen) return null;

  const handleUpdate = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File is too large. Maximum size is 5MB.');
        return;
      }
      
      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Unsupported format. Please upload PNG, JPG, or WEBP.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => handleUpdate('url', event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setData(prev => ({ ...prev, url: '' }));
  };

  const getBorderRadius = () => {
    if (data.shape === 'circle') return '50%';
    if (data.shape === 'rounded') return '16px';
    return '0px';
  };

  const getBorderValue = () => {
    if (data.border === 'white') return '3px solid #ffffff';
    if (data.border === 'black') return '3px solid #0f172a';
    if (data.border === 'theme') return `3px solid ${themeColor}`;
    return 'none';
  };

  const getShadowValue = () => {
    return data.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none';
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: '850px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} color={themeColor} />
            Professional Photo Editor
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
          
          {/* Left Column: Settings */}
          <div style={{ width: window.innerWidth < 768 ? '100%' : '350px', padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Upload Area */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Profile Photo</label>
              {data.url ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Check size={16} /> Photo Uploaded Successfully
                  </div>
                  <button onClick={handleRemove} style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', padding: '0.6rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', width: '100%' }}>
                    Remove Photo
                  </button>
                </div>
              ) : (
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', background: 'white' }}>
                  <input type="file" id="photo-upload" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
                  <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={24} color={themeColor} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: themeColor }}>Upload Photo</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PNG, JPG, WEBP (Max 5MB)</span>
                  </label>
                </div>
              )}
              {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>{error}</div>}
            </div>

            {/* Shape Settings */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Crop Photo</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {['circle', 'square', 'rounded'].map(shape => (
                  <button 
                    key={shape}
                    onClick={() => handleUpdate('shape', shape)}
                    style={{ 
                      padding: '0.6rem 0', 
                      background: data.shape === shape ? themeColor : 'white', 
                      color: data.shape === shape ? 'white' : '#64748b',
                      border: data.shape === shape ? `1px solid ${themeColor}` : '1px solid #cbd5e1',
                      borderRadius: '8px', 
                      fontWeight: 700, 
                      fontSize: '0.75rem', 
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Slider */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                <span>Resize Photo</span>
                <span style={{ color: themeColor }}>{data.size}px</span>
              </label>
              <input 
                type="range" 
                min="40" 
                max="120" 
                value={data.size} 
                onChange={(e) => handleUpdate('size', parseInt(e.target.value))} 
                style={{ width: '100%', accentColor: themeColor }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem', fontWeight: 600 }}>
                <span>40px</span>
                <span>120px</span>
              </div>
            </div>

            {/* Position */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Position</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {['left', 'center', 'right'].map(pos => (
                  <button 
                    key={pos}
                    onClick={() => handleUpdate('position', pos)}
                    style={{ 
                      padding: '0.6rem 0', 
                      background: data.position === pos ? themeColor : 'white', 
                      color: data.position === pos ? 'white' : '#64748b',
                      border: data.position === pos ? `1px solid ${themeColor}` : '1px solid #cbd5e1',
                      borderRadius: '8px', 
                      fontWeight: 700, 
                      fontSize: '0.75rem', 
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {pos === 'left' ? 'Top Left' : pos === 'right' ? 'Top Right' : 'Center'}
                  </button>
                ))}
              </div>
            </div>

            {/* Border & Shadow */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Border</label>
                <select 
                  value={data.border}
                  onChange={(e) => handleUpdate('border', e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}
                >
                  <option value="none">None</option>
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="theme">Theme Color</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Shadow</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[{label: 'OFF', val: false}, {label: 'ON', val: true}].map(opt => (
                    <button 
                      key={opt.label}
                      onClick={() => handleUpdate('shadow', opt.val)}
                      style={{ 
                        flex: 1,
                        padding: '0.6rem 0', 
                        background: data.shadow === opt.val ? themeColor : 'white', 
                        color: data.shadow === opt.val ? 'white' : '#64748b',
                        border: data.shadow === opt.val ? `1px solid ${themeColor}` : '1px solid #cbd5e1',
                        borderRadius: '8px', 
                        fontWeight: 700, 
                        fontSize: '0.75rem', 
                        cursor: 'pointer'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview Area */}
          <div style={{ flex: 1, padding: '2rem', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '400px', 
              background: 'white', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
              borderRadius: '8px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Fake Resume Header */}
              <div style={{ 
                display: 'flex', 
                flexDirection: data.position === 'center' ? 'column' : data.position === 'right' ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: data.position === 'center' ? 'center' : 'space-between',
                gap: '1.5rem',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '1.5rem',
                marginBottom: '1.5rem',
                textAlign: data.position === 'center' ? 'center' : data.position === 'right' ? 'right' : 'left'
              }}>
                {/* Simulated Photo */}
                <div style={{
                  width: `${data.size}px`,
                  height: `${data.size}px`,
                  borderRadius: getBorderRadius(),
                  border: getBorderValue(),
                  boxShadow: getShadowValue(),
                  background: data.url ? 'transparent' : '#cbd5e1',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}>
                  {data.url ? (
                    <img src={data.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={data.size * 0.4} color="#94a3b8" />
                  )}
                </div>

                {/* Simulated Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ height: '24px', background: '#334155', borderRadius: '4px', width: data.position === 'center' ? '80%' : '100%', margin: data.position === 'center' ? '0 auto 0.5rem' : '0 0 0.5rem' }} />
                  <div style={{ height: '14px', background: themeColor, borderRadius: '4px', width: data.position === 'center' ? '50%' : '60%', margin: data.position === 'center' ? '0 auto' : 0 }} />
                </div>
              </div>

              {/* Fake Resume Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ height: '12px', background: '#cbd5e1', borderRadius: '4px', width: '30%', marginBottom: '0.5rem' }} />
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', width: '100%', marginBottom: '0.35rem' }} />
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', width: '90%' }} />
                </div>
                <div>
                  <div style={{ height: '12px', background: '#cbd5e1', borderRadius: '4px', width: '40%', marginBottom: '0.5rem' }} />
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', width: '100%', marginBottom: '0.35rem' }} />
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', width: '85%' }} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '1rem 1.5rem', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 800, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={() => onSave(data)} style={{ padding: '0.6rem 2rem', borderRadius: '8px', border: 'none', background: themeColor, color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditorModal;
