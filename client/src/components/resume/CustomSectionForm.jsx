import React, { useState } from 'react';
import { Trash2, Plus, Sparkles } from 'lucide-react';

const CustomSectionForm = ({ 
  sectionId, 
  sectionData = {}, 
  onChange, 
  onDelete, 
  onRunAi 
}) => {
  const title = sectionData.title || sectionId || 'Custom Section';
  const content = sectionData.content || '';
  const items = sectionData.items || [];
  const column = sectionData.column || 'main';

  const [mode, setMode] = useState(items.length > 0 ? 'items' : 'text');

  const handleUpdate = (field, value) => {
    if (onChange) {
      onChange(sectionId, {
        ...sectionData,
        id: sectionId,
        title: field === 'title' ? value : title,
        [field]: value
      });
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      title: '',
      subtitle: '',
      date: '',
      description: ''
    };
    handleUpdate('items', [...items, newItem]);
  };

  const handleUpdateItem = (itemId, itemField, val) => {
    const updatedItems = items.map(it => 
      it.id === itemId ? { ...it, [itemField]: val } : it
    );
    handleUpdate('items', updatedItems);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter(it => it.id !== itemId);
    handleUpdate('items', updatedItems);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            {title}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            Custom Section Editor
          </span>
        </div>
        {onDelete && (
          <button 
            type="button"
            onClick={() => onDelete(sectionId)} 
            style={{ 
              border: 'none', 
              background: '#fef2f2', 
              color: '#ef4444', 
              padding: '0.4rem 0.85rem', 
              borderRadius: '8px', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Trash2 size={14} /> Remove Section
          </button>
        )}
      </div>

      {/* Main Settings Card */}
      <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div className="form-grid-2col" style={{ marginBottom: '1rem' }}>
          <div className="input-group">
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>
              Section Title
            </label>
            <input 
              placeholder="e.g. Volunteer Work, Awards, Publications..." 
              value={title} 
              onChange={(e) => handleUpdate('title', e.target.value)} 
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 700 }} 
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>
              Layout Column Placement
            </label>
            <select
              value={column}
              onChange={(e) => handleUpdate('column', e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }}
            >
              <option value="main">Main Content Area (Wide)</option>
              <option value="sidebar">Sidebar Column (Compact)</option>
            </select>
          </div>
        </div>

        {/* Content Mode Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setMode('text')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'text' ? '#7c3aed' : '#e2e8f0',
              color: mode === 'text' ? 'white' : '#475569',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Paragraph / Bullet Points
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('items');
              if (items.length === 0) handleAddItem();
            }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'items' ? '#7c3aed' : '#e2e8f0',
              color: mode === 'items' ? 'white' : '#475569',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Structured Items (+ Add Items)
          </button>
        </div>

        {mode === 'text' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>
                Section Content (Paragraph or Line-by-Line Bullets)
              </label>
              {onRunAi && (
                <button 
                  type="button" 
                  onClick={() => onRunAi(`Improve ${title}`, null)} 
                  style={{ border: 'none', background: '#faf5ff', color: '#7c3aed', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Sparkles size={13} /> Polish with AI
                </button>
              )}
            </div>
            <textarea 
              placeholder={`Write description or bullet points for ${title}...\n• Key contribution or award detail\n• Second achievement or activity detail`}
              value={content} 
              onChange={(e) => handleUpdate('content', e.target.value)} 
              rows={6} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', outline: 'none', fontSize: '0.85rem', lineHeight: 1.5 }} 
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item, idx) => (
              <div key={item.id || idx} style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={15} />
                </button>

                <div className="form-grid-2col" style={{ marginBottom: '0.65rem' }}>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Item Title / Role</label>
                    <input
                      placeholder="e.g. Lead Volunteer, Hackathon Winner"
                      value={item.title || ''}
                      onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Organization / Subtitle</label>
                    <input
                      placeholder="e.g. Red Cross India, IEEE"
                      value={item.subtitle || ''}
                      onChange={(e) => handleUpdateItem(item.id, 'subtitle', e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '0.65rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Date / Period</label>
                  <input
                    placeholder="e.g. 2023 - Present or Dec 2022"
                    value={item.date || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'date', e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.82rem' }}
                  />
                </div>

                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Description / Highlights</label>
                  <textarea
                    placeholder="Describe contributions or achievements..."
                    value={item.description || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    rows={2}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.82rem' }}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddItem}
              style={{
                padding: '0.6rem',
                border: '1.5px dashed #7c3aed',
                background: '#f5f3ff',
                color: '#7c3aed',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <Plus size={15} /> + Add Item to {title}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSectionForm;
