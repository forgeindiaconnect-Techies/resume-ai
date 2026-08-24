import React from 'react';
import { Trash2 } from 'lucide-react';

const ProjectsForm = ({ projects = [], onAdd, onUpdate, onDelete, onRunAi, onOpenPolish }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Projects</h3>
        <button 
          onClick={onAdd} 
          style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
        >
          + Add Project
        </button>
      </div>
      {projects.map((proj, idx) => (
        <div key={proj.id || idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
          <button 
            onClick={() => onDelete(proj.id)} 
            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
          >
            <Trash2 size={16} />
          </button>
          
          <div className="form-grid-2col" style={{ marginBottom: '0.75rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Project Name</label>
              <input 
                placeholder="Project Name" 
                value={proj.name || ''} 
                onChange={(e) => onUpdate(proj.id, 'name', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Technology Stack</label>
              <input 
                placeholder="Technology Stack" 
                value={proj.technology || ''} 
                onChange={(e) => onUpdate(proj.id, 'technology', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Description</label>
            <button 
              type="button" 
              onClick={() => onOpenPolish ? onOpenPolish({ id: proj.id, text: proj.desc, role: proj.name, company: proj.technology, isProject: true }) : onRunAi('AI Improve Project', proj.id)} 
              style={{ border: 'none', background: '#faf5ff', color: '#7c3aed', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <span>✨</span> Polish with AI
            </button>
          </div>
          
          <textarea 
            placeholder="Describe project..." 
            value={proj.desc || ''} 
            onChange={(e) => onUpdate(proj.id, 'desc', e.target.value)} 
            rows={2} 
            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', marginBottom: '0.75rem', outline: 'none', fontSize: '0.85rem' }} 
          />
          
          <div className="form-grid-2col">
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>GitHub URL</label>
              <input 
                placeholder="GitHub URL" 
                value={proj.github || ''} 
                onChange={(e) => onUpdate(proj.id, 'github', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Live Demo Link</label>
              <input 
                placeholder="Live Demo Link" 
                value={proj.liveDemo || ''} 
                onChange={(e) => onUpdate(proj.id, 'liveDemo', e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsForm;
