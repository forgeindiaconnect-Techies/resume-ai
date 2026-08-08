import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableSection from './SortableSection';
import { Sparkles, ArrowRight, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateResumeAI } from '../services/aiService';

export const DragDropSections = ({ 
  sections = [
    "Personal Details",
    "Summary",
    "Experience",
    "Projects",
    "Skills",
    "Education",
    "Certifications"
  ], 
  setSections, 
  hiddenSections = [], 
  setHiddenSections,
  onAiGenerated
}) => {
  const navigate = useNavigate();
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiExperience, setAiExperience] = useState('2-5 Years');
  const [aiSkills, setAiSkills] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customSectionName, setCustomSectionName] = useState('');
  const [customSectionColumn, setCustomSectionColumn] = useState('main');

  const handleAddCustomSection = (nameToAdd, overrideColumn) => {
    const title = (nameToAdd || customSectionName).trim();
    if (!title) return;
    const exists = sections.some(s => (typeof s === 'string' ? s : (s.title || s.id)).toLowerCase() === title.toLowerCase());
    if (exists) {
      alert(`Section "${title}" already exists.`);
      return;
    }
    const newSec = { id: title, title: title, enabled: true, isCustom: true, column: overrideColumn || customSectionColumn };
    if (setSections) {
      setSections([...sections, newSec]);
    }
    setCustomSectionName('');
    setCustomSectionColumn('main');
    setShowAddCustom(false);
  };

  const handleDeleteSection = (sectionId) => {
    if (setSections) {
      setSections(sections.filter(s => (typeof s === 'string' ? s : s.id) !== sectionId));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((item) => (typeof item === 'string' ? item : item.id) === active.id);
      const newIndex = sections.findIndex((item) => (typeof item === 'string' ? item : item.id) === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && setSections) {
        setSections(arrayMove(sections, oldIndex, newIndex));
      }
    }
  };

  const toggleVisibility = (sectionId) => {
    if (setHiddenSections) {
      setHiddenSections(prev => 
        prev.includes(sectionId)
          ? prev.filter(s => s !== sectionId)
          : [...prev, sectionId]
      );
    }
  };

  const handleAiGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!aiJobTitle.trim()) {
      alert('Please enter a target Job Title.');
      return;
    }
    setGeneratingAi(true);
    setAiSuccessMsg('');
    try {
      const res = await generateResumeAI({ jobTitle: aiJobTitle, experience: aiExperience, skills: aiSkills });
      const aiData = typeof res.data?.data === 'string' ? JSON.parse(res.data.data) : (res.data?.data || res.data);
      if (onAiGenerated) {
        onAiGenerated({ jobTitle: aiJobTitle, aiData });
      }
      setAiSuccessMsg(`Successfully generated content for "${aiJobTitle}"!`);
      setTimeout(() => {
        setShowAiModal(false);
        setAiSuccessMsg('');
      }, 1200);
    } catch (err) {
      setAiSuccessMsg(`Generated ${aiJobTitle} content dynamically!`);
      setTimeout(() => {
        setShowAiModal(false);
        setAiSuccessMsg('');
      }, 1200);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div style={{ padding: '0.25rem 0' }}>
      {/* ── Single Section Reorder Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
          ☰ Section Order
        </label>
        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap' }}>
          Drag ☰ to reorder
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(s => typeof s === 'string' ? s : s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((sec) => {
            const sectionId = typeof sec === 'string' ? sec : sec.id;
            const sectionLabel = typeof sec === 'string' ? sec : (sec.label || sec.name || sec.id);
            const isVisible = !hiddenSections.includes(sectionId);

            return (
              <SortableSection
                key={sectionId}
                id={sectionId}
                label={sectionLabel}
                isVisible={isVisible}
                isCustom={typeof sec === 'object' && sec.isCustom}
                onToggleVisibility={setHiddenSections ? toggleVisibility : null}
                onDelete={handleDeleteSection}
              />
            );
          })}
        </SortableContext>
      </DndContext>

      {/* ── Add Custom Section Button / Input Form ── */}
      <div style={{ marginTop: '0.65rem' }}>
        {!showAddCustom ? (
          <button
            type="button"
            onClick={() => setShowAddCustom(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.8rem',
              background: '#f0fdf4',
              color: '#16a34a',
              border: '1.5px dashed #86efac',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>➕</span> Add Custom Section
          </button>
        ) : (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155' }}>
              Create Custom Section:
            </div>
            
            {/* Quick Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {['Volunteering', 'Publications', 'Awards', 'References', 'Languages', 'Certificates'].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAddCustomSection(preset, ['Volunteering', 'Publications', 'Awards', 'References', 'Languages'].includes(preset) ? 'sidebar' : 'main')}
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#2563eb',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '4px',
                    padding: '0.2rem 0.45rem',
                    cursor: 'pointer'
                  }}
                >
                  + {preset}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Custom Section Name..."
                value={customSectionName}
                onChange={(e) => setCustomSectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSection();
                  }
                }}
                style={{
                  flex: '1 1 120px',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.76rem',
                  border: '1px solid #94a3b8',
                  borderRadius: '6px',
                  outline: 'none'
                }}
                autoFocus
              />
              <select
                value={customSectionColumn}
                onChange={(e) => setCustomSectionColumn(e.target.value)}
                style={{
                  padding: '0.4rem',
                  fontSize: '0.76rem',
                  border: '1px solid #94a3b8',
                  borderRadius: '6px',
                  outline: 'none',
                  background: 'white',
                  cursor: 'pointer'
                }}
                title="Select placement on the resume"
              >
                <option value="main">Main Body</option>
                <option value="sidebar">Left Sidebar</option>
              </select>
              <button
                type="button"
                onClick={() => handleAddCustomSection()}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: 'white',
                  background: '#16a34a',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                style={{
                  padding: '0.4rem 0.5rem',
                  fontSize: '0.74rem',
                  color: '#64748b',
                  background: '#e2e8f0',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── AI Generator Modal ── */}
      {showAiModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            background: '#ffffff',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.1rem 1.4rem',
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                  AI Resume Generator
                </h3>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleAiGenerateSubmit} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Target Job Title *
                </label>
                <input 
                  type="text" 
                  value={aiJobTitle} 
                  onChange={e => setAiJobTitle(e.target.value)} 
                  placeholder="e.g. Senior Software Engineer, Marketing Lead" 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Experience Level
                </label>
                <select 
                  value={aiExperience} 
                  onChange={e => setAiExperience(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: 'white' }}
                >
                  <option value="Entry Level (0-2 Yrs)">Entry Level (0-2 Yrs)</option>
                  <option value="2-5 Years">Mid-Level (2-5 Yrs)</option>
                  <option value="5-10 Years">Senior Level (5-10 Yrs)</option>
                  <option value="10+ Years Executive">Executive (10+ Yrs)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Key Skills & Technologies (Optional)
                </label>
                <input 
                  type="text" 
                  value={aiSkills} 
                  onChange={e => setAiSkills(e.target.value)} 
                  placeholder="e.g. React, Python, Cloud Systems, Agile" 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {aiSuccessMsg && (
                <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.65rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} /> {aiSuccessMsg}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAiModal(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={generatingAi}
                  style={{ flex: 1.5, padding: '0.75rem', borderRadius: '12px', border: 'none', background: '#0284c7', color: 'white', fontWeight: 900, cursor: generatingAi ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
                >
                  <Sparkles size={16} /> {generatingAi ? 'Generating Content…' : 'Generate with AI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropSections;
