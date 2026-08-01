import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, GraduationCap, Award, ChevronRight, ChevronLeft, Save, Sparkles, Plus, Trash2 } from 'lucide-react';

const ResumeBuilderModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: { name: '', email: '', phone: '', location: '', summary: '' },
    experience: [{ id: 1, role: '', company: '', duration: '', desc: '' }],
    education: [{ id: 1, degree: '', school: '', year: '' }],
    skills: ['React', 'JavaScript', 'Node.js']
  });

  const [isSaving, setIsSaving] = useState(false);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };

  const addExperience = () => {
    setFormData(prev => ({ 
      ...prev, 
      experience: [...prev.experience, { id: Date.now(), role: '', company: '', duration: '', desc: '' }] 
    }));
  };

  const removeExperience = (id) => {
    setFormData(prev => ({ 
      ...prev, 
      experience: prev.experience.filter(e => e.id !== id) 
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSave = async () => {
     setIsSaving(true);
     try {
        const response = await fetch('/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData?.personal?.name || 'Unknown',
            email: formData?.personal?.email || 'N/A',
            role: 'Builder Profile',
            status: 'Applied',
            skills: formData.skills,
            reasons: ['Profile manually built via Forge Resume Builder']
          })
        });

        if (response.ok) {
           setIsSaving(false);
           onComplete();
           onClose();
           setStep(1);
        } else {
           throw new Error('Failed to save to database');
        }
     } catch (err) {
        console.error('Save error:', err);
        // Fallback to local complete if API fails (e.g. local dev)
        setIsSaving(false);
        onComplete();
        onClose();
     }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          width: '740px',
          height: '680px',
          background: '#fff',
          borderRadius: '32px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '8px', background: '#F4C400', borderRadius: '10px', color: '#000' }}>
                <Sparkles size={24} />
              </div>
              Build Your Resume
            </h2>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Step {step} of 4: {['Personal Details', 'Professional Experience', 'Education Info', 'Technical Skills'][step-1]}</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', color: '#475569', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', background: '#fafbfc' }}>
           <AnimatePresence mode="wait">
             {step === 1 && (
               <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Full Name</label>
                      <input name="name" value={formData.personal.name} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: 600 }} placeholder="John Doe" />
                    </div>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Email Address</label>
                      <input name="email" value={formData.personal.email} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: 600 }} placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Professional Summary</label>
                    <textarea name="summary" value={formData.personal.summary} onChange={handlePersonalChange} rows={4} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontWeight: 600, resize: 'none' }} placeholder="Tell us about your career journey..." />
                  </div>
               </motion.div>
             )}

             {step === 2 && (
               <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {formData.experience.map((exp, idx) => (
                    <div key={exp.id} style={{ padding: '1.5rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', position: 'relative' }}>
                       <button onClick={() => removeExperience(exp.id)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                          <input placeholder="Job Role" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 600 }} />
                          <input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 600 }} />
                       </div>
                       <textarea placeholder="Description of work..." value={exp.desc} onChange={(e) => updateExperience(exp.id, 'desc', e.target.value)} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 600, resize: 'none' }} />
                    </div>
                  ))}
                  <button onClick={addExperience} style={{ width: '100%', padding: '1rem', border: '2px dashed #cbd5e1', background: 'none', borderRadius: '16px', color: '#64748b', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Plus size={20} /> ADD EXPERIENCE
                  </button>
               </motion.div>
             )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F4C40020', color: '#F4C400', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <Award size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Technical Expertise</h3>
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Add the tools and technologies you dominate.</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '1rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', minHeight: '120px' }}>
                    {formData.skills.map(skill => (
                      <motion.div key={skill} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                        {skill}
                        <button onClick={() => removeSkill(skill)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                      </motion.div>
                    ))}
                    <input 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addSkill(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      placeholder="Type skill & press Enter..." 
                      style={{ border: 'none', outline: 'none', padding: '0.5rem', fontWeight: 600, color: '#0f172a', flex: 1, minWidth: '200px' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                     {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'SQL', 'MongoDB'].filter(s => !formData.skills.includes(s)).map(suggest => (
                       <button key={suggest} onClick={() => addSkill(suggest)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>+ {suggest}</button>
                     ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #001f3f, #003366)', borderRadius: '24px', color: '#fff', boxShadow: '0 10px 30px rgba(0,31,63,0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                         <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F4C400', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: '1.2rem' }}>{formData?.personal?.name?.[0] || 'U'}</div>
                         <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>{formData?.personal?.name || 'Untitled Profile'}</h3>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>{formData?.personal?.email || 'No email provided'}</p>
                         </div>
                      </div>
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '1rem' }} />
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.5, opacity: 0.9, fontStyle: 'italic' }}>"{formData.personal.summary || 'No summary provided.'}"</p>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ padding: '1.25rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                         <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={14} /> Experience</h4>
                         {formData.experience.slice(0, 2).map((exp, i) => (
                           <div key={i} style={{ marginBottom: '0.75rem' }}>
                             <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{exp.role || 'Role'}</div>
                             <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{exp.company || 'Company'}</div>
                           </div>
                         ))}
                      </div>
                      <div style={{ padding: '1.25rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                         <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={14} /> Expertise</h4>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {formData.skills.slice(0, 6).map(s => <span key={s} style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', background: '#f1f5f9', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>{s}</span>)}
                            {formData.skills.length > 6 && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>+{formData.skills.length - 6} more</span>}
                         </div>
                      </div>
                   </div>
                   
                   <div style={{ padding: '1rem', background: '#F4C40010', border: '1px solid #F4C40030', borderRadius: '14px', display: 'flex', gap: '0.75rem' }}>
                      <Sparkles size={20} color="#F4C400" style={{ flexShrink: 0 }} />
                      <p style={{ fontSize: '0.8rem', color: '#854d0e', fontWeight: 600, margin: 0 }}>Review your profile one last time. Once finalized, our AI will automatically suggest optimizations and rank you for relevant roles.</p>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{ padding: '2rem 2.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ border: 'none', background: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChevronLeft size={20} /> PREVIOUS
            </button>
          ) : <div />}
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(s => s + 1)} 
              style={{ padding: '0.8rem 2rem', background: '#001f3f', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              NEXT STEP <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              style={{ padding: '0.8rem 2.5rem', background: '#F4C400', color: '#000', border: 'none', borderRadius: '14px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 5px 15px rgba(244,196,0,0.3)' }}
            >
              {isSaving ? 'PERSISTING...' : <><Save size={20} /> FINISH & ANALYZE</>}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeBuilderModal;
