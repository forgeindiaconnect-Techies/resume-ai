import React from 'react';

const ResumeToolbar = ({
  selectedColor,
  onChangeColor,
  templateId,
  onChangeTemplate,
  selectedFont,
  onChangeFont,
  fontSize = 13,
  onChangeFontSize,
  zoomLevel,
  onChangeZoom,
  isPremiumUser,
  onDownloadAction,
  onFitToOnePage,
  isOnePageActive
}) => {
  const colors = ['#7c3aed', '#10b981', '#2563eb', '#f59e0b', '#dc2626', '#000000'];
  const zoomLevels = [0.5, 0.6, 0.8, 1.0];
  const fontSizes = [
    { label: 'Small (11px)', value: 11 },
    { label: 'Normal (13px)', value: 13 },
    { label: 'Medium (15px)', value: 15 },
    { label: 'Large (17px)', value: 17 }
  ];

  return (
    <div className="no-print" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.6rem 1.25rem', 
      background: 'white', 
      borderBottom: '1px solid #e2e8f0',
      flexShrink: 0,
      minHeight: '60px',
      gap: '0.75rem',
      boxSizing: 'border-box',
      flexWrap: 'wrap'
    }}>
      {/* Color Picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
        {colors.map(c => (
          <button
            key={c}
            onClick={() => onChangeColor(c)}
            style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              background: c, 
              border: selectedColor === c ? '2px solid white' : '1px solid #cbd5e1', 
              boxShadow: selectedColor === c ? '0 0 0 2px #7c3aed' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          />
        ))}
        {/* Custom Color Picker */}
        <div style={{ position: 'relative', display: 'inline-block', width: '20px', height: '20px', marginLeft: '2px' }} title="Custom Color">
          <input
            type="color"
            value={colors.includes(selectedColor) ? '#0284c7' : selectedColor}
            onChange={(e) => onChangeColor(e.target.value)}
            style={{
              opacity: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              zIndex: 2
            }}
          />
          <div style={{
            position: 'absolute',
            top: '1px',
            left: '1px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: !colors.includes(selectedColor) ? selectedColor : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
            border: !colors.includes(selectedColor) ? '2px solid #ffffff' : '1px solid #cbd5e1',
            boxShadow: !colors.includes(selectedColor) ? '0 0 0 2px #7c3aed' : 'none',
            zIndex: 1,
            pointerEvents: 'none',
            transition: 'all 0.15s'
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Template Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Template</span>
          <select 
            value={templateId} 
            onChange={(e) => onChangeTemplate(e.target.value)}
            style={{ border: '1px solid #cbd5e1', background: 'white', padding: '0.25rem 0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
          >
            <option value="professional">Professional</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
            <option value="executive">Executive</option>
            <option value="creative">Creative</option>
            <option value="enhancv">Enhancv</option>
          </select>
        </div>

        {/* Font Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Font</span>
          <select 
            value={selectedFont} 
            onChange={(e) => onChangeFont(e.target.value)}
            style={{ border: '1px solid #cbd5e1', background: 'white', padding: '0.25rem 0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
          >
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Poppins', sans-serif">Poppins</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Lato', sans-serif">Lato</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Playfair Display', serif">Playfair</option>
            <option value="'Merriweather', serif">Merriweather</option>
            <option value="'Lora', serif">Lora</option>
            <option value="'Montserrat', sans-serif">Montserrat</option>
            <option value="'Nunito', sans-serif">Nunito</option>
            <option value="'Raleway', sans-serif">Raleway</option>
            <option value="'Ubuntu', sans-serif">Ubuntu</option>
          </select>
        </div>

        {/* Font Size Selector */}
        {onChangeFontSize && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Size</span>
            <select 
              value={fontSize} 
              onChange={(e) => onChangeFontSize(Number(e.target.value))}
              style={{ border: '1px solid #cbd5e1', background: 'white', padding: '0.25rem 0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
            >
              {fontSizes.map(fs => (
                <option key={fs.value} value={fs.value}>{fs.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Fit to 1 Page Button */}
        {onFitToOnePage && (
          <button
            onClick={onFitToOnePage}
            title="Automatically adjust font size, line spacing and margins to fit on 1 Page"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: isOnePageActive ? '#ecfdf5' : '#f8fafc',
              border: isOnePageActive ? '1.5px solid #10b981' : '1px solid #cbd5e1',
              color: isOnePageActive ? '#059669' : '#334155',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            <span>📄</span>
            <span>{isOnePageActive ? 'Fit to 1 Page ✔' : 'Fit to 1 Page'}</span>
          </button>
        )}

        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          {zoomLevels.map(val => (
            <button 
              key={val}
              onClick={() => onChangeZoom(val)}
              style={{ 
                border: '1px solid #cbd5e1', 
                background: zoomLevel === val ? '#f1f5f9' : 'white', 
                color: zoomLevel === val ? '#0f172a' : '#64748b',
                padding: '0.25rem 0.45rem', 
                fontSize: '0.7rem', 
                borderRadius: '6px', 
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {val * 100}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeToolbar;
