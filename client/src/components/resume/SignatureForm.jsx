import React, { useState } from 'react';
import { Type } from 'lucide-react';

const SignatureForm = ({ signatureData, onChange }) => {
  const text = signatureData?.text || '';
  const font = signatureData?.font || 'Great Vibes';
  const url = signatureData?.url || '';
  const size = signatureData?.size || 100;
  const position = signatureData?.position || 'right';
  
  const [mode, setMode] = useState(url ? 'image' : 'text');
  const [isDragging, setIsDragging] = useState(false);

  const fonts = ['Great Vibes', 'Caveat', 'Pacifico', 'Dancing Script', 'Satisfy'];

  const handleUpdate = (field, value) => {
    onChange({
      type: mode,
      text: field === 'text' ? value : text,
      font: field === 'font' ? value : font,
      url: field === 'url' ? value : url,
      size: field === 'size' ? value : size,
      position: field === 'position' ? value : position,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          type: 'image',
          text: '',
          font: font,
          url: reader.result,
          size: size,
          position: position,
        });
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
        onChange({
          type: 'image',
          text: '',
          font: font,
          url: reader.result,
          size: size,
          position: position,
        });
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
    onChange({ type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Signature</h3>
        { (text || url) && (
          <button 
            onClick={handleRemove} 
            style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}
          >
            Clear Signature
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={() => setMode('text')} 
          style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: mode === 'text' ? '2px solid #7c3aed' : '1px solid #cbd5e1', background: mode === 'text' ? '#f3e8ff' : '#fff', color: mode === 'text' ? '#7c3aed' : '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.15s' }}
        >
          Type Signature
        </button>
        <button 
          onClick={() => setMode('image')} 
          style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: mode === 'image' ? '2px solid #7c3aed' : '1px solid #cbd5e1', background: mode === 'image' ? '#f3e8ff' : '#fff', color: mode === 'image' ? '#7c3aed' : '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.15s' }}
        >
          Upload Image
        </button>
      </div>

      {mode === 'text' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Type your name</label>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => handleUpdate('text', e.target.value)}
              placeholder="e.g. John Smith"
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Font Style</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {fonts.map(f => (
                <button 
                  key={f}
                  onClick={() => handleUpdate('font', f)}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: font === f ? '2px solid #7c3aed' : '1px solid #cbd5e1', background: font === f ? '#f3e8ff' : '#fff', color: font === f ? '#7c3aed' : '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: `"${f}", cursive` }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Upload Signature Image</label>
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

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Size ({size}%)</label>
          <input 
            type="range" min="50" max="150" value={size} onChange={(e) => handleUpdate('size', Number(e.target.value))} 
            style={{ width: '100%', accentColor: '#7c3aed' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Position</label>
          <select 
            value={position} 
            onChange={(e) => handleUpdate('position', e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
            <option value="left">Bottom Left</option>
            <option value="center">Bottom Center</option>
            <option value="right">Bottom Right</option>
          </select>
        </div>
      </div>

    </div>
  );
};

export default SignatureForm;
