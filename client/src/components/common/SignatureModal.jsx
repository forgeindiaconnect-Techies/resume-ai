import React, { useState } from 'react';
import { X } from 'lucide-react';

const SignatureModal = ({ isOpen, onClose, signature, onSave, accentColor }) => {
  if (!isOpen) return null;
  const [text, setText] = useState(signature?.text || '');
  const [font, setFont] = useState(signature?.font || 'Great Vibes');
  const [url, setUrl] = useState(signature?.url || '');
  const [size, setSize] = useState(signature?.size || 100);
  const [position, setPosition] = useState(signature?.position || 'right');
  const [mode, setMode] = useState(url ? 'image' : 'text');
  const [isDragging, setIsDragging] = useState(false);

  const fonts = ['Great Vibes', 'Caveat', 'Pacifico', 'Dancing Script', 'Satisfy'];

  const handleSave = () => {
    onSave({
      type: mode,
      text,
      font,
      url,
      size,
      position,
    });
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleRemove = () => {
    onSave({ type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
      <div style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>Add Signature</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setMode('text')} 
              style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: mode === 'text' ? `2px solid ${accentColor}` : '1px solid #cbd5e1', background: mode === 'text' ? `${accentColor}11` : '#fff', color: mode === 'text' ? accentColor : '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}
            >
              Type Signature
            </button>
            <button 
              onClick={() => setMode('image')} 
              style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: mode === 'image' ? `2px solid ${accentColor}` : '1px solid #cbd5e1', background: mode === 'image' ? `${accentColor}11` : '#fff', color: mode === 'image' ? accentColor : '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}
            >
              Upload Image
            </button>
          </div>

          {mode === 'text' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Type your name</label>
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="John Smith"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Font Style</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {fonts.map(f => (
                    <button 
                      key={f} 
                      onClick={() => setFont(f)}
                      style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: font === f ? `2px solid ${accentColor}` : '1px solid #e2e8f0', background: font === f ? `${accentColor}11` : '#fff', color: font === f ? accentColor : '#475569', cursor: 'pointer', fontFamily: `"${f}", cursive`, fontSize: '1.2rem' }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Upload Signature Image</label>
              <label 
                onDrop={handleDrop} 
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                style={{ 
                  display: 'block', 
                  border: isDragging ? '2px dashed #7c3aed' : '2px dashed #cbd5e1', 
                  borderRadius: '8px', 
                  padding: '1.5rem', 
                  textAlign: 'center', 
                  background: isDragging ? '#f3e8ff' : '#f8fafc', 
                  cursor: 'pointer', 
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ pointerEvents: 'none' }}>
                  {url ? (
                    <img src={url} alt="Signature" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Drag & drop or click to browse</span>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />

          {/* Settings */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Size ({size}%)</label>
              <input 
                type="range" min="50" max="150" value={size} onChange={(e) => setSize(Number(e.target.value))} 
                style={{ width: '100%', accentColor }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Position</label>
              <select 
                value={position} 
                onChange={(e) => setPosition(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                <option value="left">Bottom Left</option>
                <option value="center">Bottom Center</option>
                <option value="right">Bottom Right</option>
              </select>
            </div>
          </div>

          {/* Preview Box */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '120px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '1rem' }}>PREVIEW</span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: position === 'left' ? 'flex-start' : position === 'center' ? 'center' : 'flex-end', overflow: 'hidden' }}>
              {mode === 'text' && text && (
                <span style={{ fontFamily: `"${font}", cursive`, fontSize: `${(size / 100) * 2.5}rem`, color: '#1e293b', lineHeight: 1 }}>{text}</span>
              )}
              {mode === 'image' && url && (
                <img src={url} alt="Signature" style={{ width: `${(size / 100) * 150}px`, maxHeight: '80px', objectFit: 'contain' }} />
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
          <button 
            onClick={handleRemove}
            style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#ef4444', fontWeight: 700, cursor: 'pointer' }}
          >
            Remove Signature
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={onClose}
              style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '6px', border: 'none', background: accentColor, color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            >
              Apply to Resume
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignatureModal;
