import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const SkillsForm = ({ skills = { programming: [], frameworks: [], databases: [] }, onToggleSkill, onAddSkill, onRemoveSkill }) => {
  const [customSkill, setCustomSkill] = useState({ programming: '', frameworks: '', databases: '' });

  const categories = [
    {
      key: 'programming',
      label: 'Programming Languages',
      presets: ['Java', 'Python', 'C#', 'JavaScript', 'TypeScript', 'Go', 'PHP', 'Ruby', 'Swift', 'Rust'],
      color: '#7c3aed'
    },
    {
      key: 'frameworks',
      label: 'Frameworks & Libraries',
      presets: ['React', 'Angular', 'Node', 'Express', 'Vue', 'NextJS', 'Django', 'Spring Boot', 'Laravel', 'TailwindCSS'],
      color: '#2563eb'
    },
    {
      key: 'databases',
      label: 'Databases & Tools',
      presets: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Firebase', 'Docker', 'Kubernetes', 'AWS', 'Git', 'GraphQL'],
      color: '#10b981'
    }
  ];

  const handleKeyPress = (e, key) => {
    if ((e.key === 'Enter' || e.key === ',') && customSkill[key].trim()) {
      e.preventDefault();
      const val = customSkill[key].replace(/,/g, '').trim();
      if (val && !skills[key].includes(val)) {
        onAddSkill(key, val);
      }
      setCustomSkill({ ...customSkill, [key]: '' });
    }
  };

  const handleAddClick = (key) => {
    const val = customSkill[key].trim();
    if (val && !skills[key].includes(val)) {
      onAddSkill(key, val);
    }
    setCustomSkill({ ...customSkill, [key]: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Skills & Tech Stack</h3>
      
      {categories.map(({ key, label, presets, color }) => {
        const currentList = skills[key] || [];
        return (
          <div key={key} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1f2937', margin: '0 0 0.75rem 0' }}>{label}</h4>
            
            {/* Active Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {currentList.map(skill => (
                <span 
                  key={skill} 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.25rem', 
                    background: `${color}15`, 
                    color: color, 
                    padding: '0.3rem 0.65rem', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700 
                  }}
                >
                  {skill}
                  <X 
                    size={12} 
                    onClick={() => onRemoveSkill(key, skill)} 
                    style={{ cursor: 'pointer', marginLeft: '0.15rem' }} 
                  />
                </span>
              ))}
              {currentList.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>No skills added yet</span>
              )}
            </div>

            {/* Input to Add Custom Tag */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                placeholder={`Type a skill and press Enter...`} 
                value={customSkill[key]} 
                onChange={(e) => setCustomSkill({ ...customSkill, [key]: e.target.value })}
                onKeyDown={(e) => handleKeyPress(e, key)}
                style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => handleAddClick(key)}
                style={{ background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', padding: '0.55rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Presets Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggestions:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {presets.map(preset => {
                  const isChecked = currentList.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onToggleSkill(key, preset)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        border: isChecked ? `1px solid ${color}` : '1px solid #e2e8f0',
                        background: isChecked ? `${color}10` : 'white',
                        color: isChecked ? color : '#4b5563',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {isChecked ? '✓ ' : ''}{preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsForm;
