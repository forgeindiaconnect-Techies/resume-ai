import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, GraduationCap, Award, Code, Save, 
  Download, Sparkles, Plus, Trash2, X, ChevronRight, ChevronLeft, Check, Palette, Type, ZoomIn, ZoomOut, Link2
} from 'lucide-react';
import ModernResumeTemplate from './ModernResumeTemplate';
import ForgeLogo from './ForgeLogo';

const SplitBuilderView = ({ user, onComplete, activeResumeId, onUpgradeRedirect }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Auto Saved ✔');
  const [resumeId, setResumeId] = useState(activeResumeId || null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // AI Assistant States
  const [showAiAssistantModal, setShowAiAssistantModal] = useState(false);
  const [aiAssistantTask, setAiAssistantTask] = useState('');
  const [aiAssistantOutput, setAiAssistantOutput] = useState('');
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);

  // Preview Config States
  const [zoomLevel, setZoomLevel] = useState(0.6);
  const [selectedColor, setSelectedColor] = useState('#7c3aed'); // Purple
  const [selectedFont, setSelectedFont] = useState("'Inter', sans-serif");

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: 'My Professional Resume',
    templateId: 'modern',
    department: 'Fullstack',
    personalInfo: {
      name: user?.name || 'Your Name',
      email: user?.email || 'your.email@example.com',
      phone: '+1 123 456 7890',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/username',
      github: 'github.com/username',
      portfolio: 'portfolio.dev',
      summary: 'Experienced software developer specialized in building modern web applications.'
    },
    experience: [
      { id: 1, role: 'Senior Software Engineer', company: 'InnovateTech', duration: '2023 - Present', desc: 'Led a team of frontend engineers to build a high-performance web dashboard.' }
    ],
    education: [
      { id: 1, degree: 'B.S. in Computer Science', school: 'State University', department: 'CS Department', cgpa: '9.2', year: '2019 - 2023' }
    ],
    projects: [
      { id: 1, name: 'SaaS Platform', technology: 'React, Node, Express, MongoDB', desc: 'Created an enterprise application handling high traffic.', github: 'github.com/proj', liveDemo: 'demo.com' }
    ],
    skills: {
      programming: ['Java', 'Python', 'JavaScript'],
      frameworks: ['React', 'Node'],
      databases: ['MongoDB', 'MySQL']
    },
    certificates: [
      { id: 1, name: 'AWS Certified Cloud Practitioner', organization: 'Amazon Web Services', year: '2024' }
    ],
    languagesList: ['English', 'Hindi'],
    references: 'Available upon request'
  });

  // Calculate completion progress
  const getProgressPercent = () => {
    let score = 20; // baseline
    if (formData.personalInfo.name && formData.personalInfo.name !== 'Your Name') score += 15;
    if (formData.personalInfo.summary) score += 15;
    if (formData.education.length > 0) score += 10;
    if (formData.experience.length > 0) score += 10;
    if (formData.projects.length > 0) score += 10;
    if (formData.certificates.length > 0) score += 10;
    if (formData.skills.programming.length > 0) score += 10;
    return Math.min(score, 100);
  };

  // Calculate ATS Score Match
  const getAtsScore = () => {
    let score = 70; // base ATS compliance
    score += Math.min((formData.experience?.length || 0) * 4, 12);
    score += Math.min((formData.projects?.length || 0) * 3, 9);
    if (formData.skills.programming.length > 0) score += 4;
    if (formData.skills.frameworks.length > 0) score += 3;
    return Math.min(score, 98);
  };

  // Restore Guest or Permanent draft on mount
  useEffect(() => {
    const fetchResume = async () => {
      if (resumeId) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/resumes/${resumeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok && data.success) {
            setFormData({
              title: data.data.title || 'My Professional Resume',
              templateId: data.data.templateId || 'modern',
              department: data.data.department || 'Fullstack',
              personalInfo: data.data.personalInfo || { name: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' },
              experience: data.data.experience || [],
              education: data.data.education || [],
              projects: data.data.projects || [],
              skills: data.data.skills || { programming: [], frameworks: [], databases: [] },
              certificates: data.data.certificates || [],
              languagesList: data.data.languagesList || [],
              references: data.data.references || ''
            });
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const guestId = localStorage.getItem('guestSessionId');
        if (guestId) {
          try {
            const response = await fetch(`/api/resume/temp/${guestId}`);
            const data = await response.json();
            if (response.ok && data.success && data.data) {
              setFormData(data.data);
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
    };
    fetchResume();
  }, [resumeId]);

  // Auto-Save Effect (1.5s Debounce)
  useEffect(() => {
    setSaveStatus('Saving...');
    const delayDebounce = setTimeout(async () => {
      localStorage.setItem('localResumeDraft', JSON.stringify(formData));
      
      const guestId = localStorage.getItem('guestSessionId');
      if (!user && guestId) {
        try {
          await fetch('/api/resume/temp-save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: guestId, resumeData: formData })
          });
          setSaveStatus('Auto Saved ✔');
        } catch (err) {
          setSaveStatus('Offline Mode');
        }
      } else {
        setSaveStatus('Saved Locally ✔');
      }
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [formData, user]);

  const handlePersonalChange = (e) => {
    setFormData({
      ...formData,
      personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value }
    });
  };

  const toggleSkillItem = (category, skill) => {
    const list = formData.skills[category] || [];
    const updated = list.includes(skill)
      ? list.filter(item => item !== skill)
      : [...list, skill];
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [category]: updated
      }
    });
  };

  // Handlers for dynamic lists
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { id: Date.now(), role: '', company: '', duration: '', desc: '' }]
    });
  };

  const updateExperience = (id, field, value) => {
    setFormData({
      ...formData,
      experience: formData.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const deleteExperience = (id) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { id: Date.now(), degree: '', school: '', department: '', cgpa: '', year: '' }]
    });
  };

  const updateEducation = (id, field, value) => {
    setFormData({
      ...formData,
      education: formData.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const deleteEducation = (id) => {
    setFormData({
      ...formData,
      education: formData.education.filter(edu => edu.id !== id)
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { id: Date.now(), name: '', technology: '', desc: '', github: '', liveDemo: '' }]
    });
  };

  const updateProject = (id, field, value) => {
    setFormData({
      ...formData,
      projects: formData.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
    });
  };

  const deleteProject = (id) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter(proj => proj.id !== id)
    });
  };

  const addCert = () => {
    setFormData({
      ...formData,
      certificates: [...formData.certificates, { id: Date.now(), name: '', organization: '', year: '' }]
    });
  };

  const updateCert = (id, field, value) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.map(c => c.id === id ? { ...c, [field]: value } : c)
    });
  };

  const deleteCert = (id) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter(c => c.id !== id)
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus('Saving Draft...');
    
    const token = localStorage.getItem('token');
    const url = resumeId ? `/api/resumes/${resumeId}` : '/api/resumes';
    const method = resumeId ? 'PUT' : 'POST';

    // Format skill tags to array
    const skillsArray = [
      ...(formData.skills.programming || []),
      ...(formData.skills.frameworks || []),
      ...(formData.skills.databases || [])
    ];

    const payload = {
      title: formData.title,
      templateId: formData.templateId,
      department: formData.department,
      personalInfo: formData.personalInfo,
      experience: formData.experience,
      education: formData.education,
      projects: formData.projects,
      skills: skillsArray,
      certificates: formData.certificates.map(c => c.name),
      languagesList: formData.languagesList || [],
      references: formData.references || ''
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSaveStatus('Saved Successfully! ✔');
        if (!resumeId && data.data._id) {
          setResumeId(data.data._id);
        }
        setTimeout(() => setSaveStatus('Auto Saved'), 3000);
      } else {
        setSaveStatus('Error saving details');
      }
    } catch (err) {
      setSaveStatus('Connection Error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (user?.subscription !== 'Premium') {
      setShowUpgradeModal(true);
      return;
    }
    const printContent = document.getElementById('resume-preview-sheet').innerHTML;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${formData.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap');
            body { margin: 0; font-family: 'Inter', sans-serif; }
            @media print {
              @page { margin: 0; size: A4; }
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body onload="window.print();">
          <div class="resume-print-wrapper" style="width: 100%; max-width: 210mm; min-height: 297mm; margin: 0 auto; box-sizing: border-box; background: white;">
            ${printContent}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 3000);
  };

  const handleGenerateAI = () => {
    setIsGeneratingAI(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGeneratingAI(false);
            setActiveStep(8); // Jump to preview
          }, 1200);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // AI Assistant trigger methods
  const runAiAssistant = async (taskName) => {
    setAiAssistantTask(taskName);
    setAiAssistantLoading(true);
    setAiAssistantOutput('');
    setShowAiAssistantModal(true);

    let promptContext = '';
    if (taskName === 'Improve Summary' || taskName === 'AI Generate Summary' || taskName === 'AI Improve Summary') {
      promptContext = formData.personalInfo.summary;
    } else if (taskName === 'Improve Skills') {
      promptContext = formData.skills.programming.join(', ');
    } else if (taskName === 'Generate Experience' || taskName === 'AI Generate Description') {
      promptContext = formData.experience.map(e => e.desc).join('\n');
    } else if (taskName === 'Generate Projects' || taskName === 'AI Improve Project') {
      promptContext = formData.projects.map(p => p.desc).join('\n');
    } else if (taskName === 'Generate Achievements') {
      promptContext = formData.experience.map(e => e.desc).join('\n');
    }

    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promptContext, section: taskName.toLowerCase() })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAiAssistantOutput(data.text);
      } else {
        setAiAssistantOutput('AI suggestion failed. Please enter context details.');
      }
    } catch (e) {
      setAiAssistantOutput('Network error connecting to AI assistant.');
    } finally {
      setAiAssistantLoading(false);
    }
  };

  const applyAiText = () => {
    if (aiAssistantTask.includes('Summary')) {
      setFormData({
        ...formData,
        personalInfo: { ...formData.personalInfo, summary: aiAssistantOutput }
      });
    }
    setShowAiAssistantModal(false);
  };

  const steps = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Summary' },
    { num: 3, label: 'Education' },
    { num: 4, label: 'Experience' },
    { num: 5, label: 'Projects' },
    { num: 6, label: 'Skills' },
    { num: 7, label: 'Certificates' },
    { num: 8, label: 'Preview' }
  ];

  const templatePreviewData = {
    name: formData.personalInfo.name || 'YOUR NAME',
    contact: {
      email: formData.personalInfo.email,
      phone: formData.personalInfo.phone,
      location: formData.personalInfo.location
    },
    objective: formData.personalInfo.summary || 'Describe your profession...',
    education: formData.education.map(e => ({
      degree: e.degree || 'Degree',
      institution: e.school || 'School',
      tenure: e.year || 'Year'
    })),
    skills: {
      languages: formData.skills.programming.join(', '),
      frameworks: formData.skills.frameworks.join(', '),
      tools: formData.skills.databases.join(', ')
    },
    projects: formData.projects.map(p => ({
      title: p.name || 'Project Name',
      period: p.duration || 'Duration',
      role: p.role || 'Role',
      points: p.desc ? p.desc.split('\n').filter(b => b.trim().length > 0) : []
    })),
    training: formData.certificates.map(c => c.name),
    department: formData.department,
    languagesList: formData.languagesList,
    references: formData.references
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Navbar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.85rem 2.5rem', 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <ForgeLogo size={32} />
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
          <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>Resume Builder</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {/* Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Resume Completion:</span>
            <div style={{ width: '80px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${getProgressPercent()}%`, height: '100%', background: '#7c3aed', borderRadius: '4px' }} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#7c3aed' }}>{getProgressPercent()}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
            <Check size={14} /> {saveStatus}
          </div>

          {user?.subscription !== 'Premium' && (
            <button 
              onClick={() => onUpgradeRedirect({ type: 'builder', formData })}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              Upgrade Pro
            </button>
          )}
        </div>
      </header>

      {/* Progress Stepper */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '0.75rem 2rem', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '0.85rem', 
        flexShrink: 0 
      }}>
        {steps.map((step) => {
          const isActive = activeStep === step.num;
          const isDone = activeStep > step.num;
          return (
            <div 
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                cursor: 'pointer',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                background: isActive ? '#f5f3ff' : 'transparent'
              }}
            >
              <div style={{ 
                width: '22px', 
                height: '22px', 
                borderRadius: '50%', 
                background: isActive ? '#7c3aed' : isDone ? '#10b981' : '#e2e8f0',
                color: isActive || isDone ? 'white' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 900
              }}>
                {isDone ? <Check size={12} /> : step.num}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: isActive ? 800 : 600, color: isActive ? '#7c3aed' : isDone ? '#10b981' : '#64748b' }}>
                {step.label}
              </span>
              {step.num < 8 && <ChevronRight size={12} color="#cbd5e1" style={{ marginLeft: '0.4rem' }} />}
            </div>
          );
        })}
      </div>

      {/* Three Column Grid Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Column (20% width): Metrics Sidebar */}
        <div style={{ 
          width: '20%', 
          background: 'white', 
          borderRight: '1px solid #e2e8f0', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '1.75rem',
          gap: '1.75rem',
          overflowY: 'auto'
        }}>
          {/* Resume Score Card */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Resume Score</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#7c3aed', margin: '0.4rem 0' }}>92%</div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: '#e6fcf5', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>Excellent</span>
          </div>

          {/* ATS Score Card */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ATS Score</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#10b981', margin: '0.4rem 0' }}>86%</div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>Good</span>
          </div>

          {/* AI Suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a' }}>AI Suggestions</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Improve Summary', 'Add Leadership', 'Add Metrics', 'Improve Skills'].map((tip, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 650, color: '#475569' }}>
                  <span style={{ color: '#10b981', fontWeight: 900 }}>✔</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: '#cbd5e1' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: '#64748b', fontWeight: 700 }}>Template:</span>
            <span style={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>{formData.templateId}</span>
          </div>
        </div>

        {/* Middle Column (40% width): Step Form */}
        <div style={{ 
          width: '40%', 
          background: 'white', 
          borderRight: '1px solid #e2e8f0', 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          position: 'relative'
        }}>
          
          <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              
              {/* Step 1: Personal Details */}
              {activeStep === 1 && (
                <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Personal Details</h3>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Full Name</label>
                    <input type="text" name="name" value={formData.personalInfo.name} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Email Address</label>
                    <input type="email" name="email" value={formData.personalInfo.email} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Phone</label>
                      <input type="text" name="phone" value={formData.personalInfo.phone} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                    </div>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Location</label>
                      <input type="text" name="location" value={formData.personalInfo.location} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>LinkedIn URL</label>
                    <input type="text" name="linkedin" value={formData.personalInfo.linkedin} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>GitHub URL</label>
                      <input type="text" name="github" value={formData.personalInfo.github} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                    </div>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem' }}>Portfolio Link</label>
                      <input type="text" name="portfolio" value={formData.personalInfo.portfolio} onChange={handlePersonalChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Summary */}
              {activeStep === 2 && (
                <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Professional Summary</h3>
                  <textarea 
                    name="summary" 
                    value={formData.personalInfo.summary} 
                    onChange={handlePersonalChange} 
                    rows={8} 
                    placeholder="State your key professional highlights..."
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => runAiAssistant('AI Generate Summary')} style={{ border: 'none', background: '#eff6ff', color: '#2563eb', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}>
                      ✨ AI Generate Summary
                    </button>
                    <button type="button" onClick={() => runAiAssistant('AI Improve Summary')} style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}>
                      ✨ AI Improve Summary
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Education */}
              {activeStep === 3 && (
                <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Education</h3>
                    <button onClick={addEducation} style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                      + Add Education
                    </button>
                  </div>
                  {formData.education.map((edu, idx) => (
                    <div key={edu.id || idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <button onClick={() => deleteEducation(edu.id)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                        <input placeholder="College/University" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <input placeholder="Degree (e.g. B.Tech)" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Department (e.g. CSE)" value={edu.department} onChange={(e) => updateEducation(edu.id, 'department', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input placeholder="CGPA / Score" value={edu.cgpa} onChange={(e) => updateEducation(edu.id, 'cgpa', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Year" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Step 4: Experience */}
              {activeStep === 4 && (
                <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Experience</h3>
                    <button onClick={addExperience} style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                      + Add Experience
                    </button>
                  </div>
                  {formData.experience.map((exp, idx) => (
                    <div key={exp.id || idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <button onClick={() => deleteExperience(exp.id)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Role" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                      <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                        <input placeholder="Duration (e.g. 2023 - Present)" value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Description</label>
                        <button type="button" onClick={() => runAiAssistant('AI Generate Description')} style={{ border: 'none', background: '#eff6ff', color: '#2563eb', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
                          ✨ AI Generate Description
                        </button>
                      </div>
                      <textarea placeholder="List key contributions..." value={exp.desc} onChange={(e) => updateExperience(exp.id, 'desc', e.target.value)} rows={3} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none' }} />
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Step 5: Projects */}
              {activeStep === 5 && (
                <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Projects</h3>
                    <button onClick={addProject} style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                      + Add Project
                    </button>
                  </div>
                  {formData.projects.map((proj, idx) => (
                    <div key={proj.id || idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <button onClick={() => deleteProject(proj.id)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                        <input placeholder="Project Name" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Technology Stack" value={proj.technology} onChange={(e) => updateProject(proj.id, 'technology', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Description</label>
                        <button type="button" onClick={() => runAiAssistant('AI Improve Project')} style={{ border: 'none', background: '#eff6ff', color: '#2563eb', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
                          ✨ AI Improve Project
                        </button>
                      </div>
                      <textarea placeholder="Describe project..." value={proj.desc} onChange={(e) => updateProject(proj.id, 'desc', e.target.value)} rows={2} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', marginBottom: '0.75rem' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input placeholder="GitHub URL" value={proj.github} onChange={(e) => updateProject(proj.id, 'github', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Live Demo Link" value={proj.liveDemo} onChange={(e) => updateProject(proj.id, 'liveDemo', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Step 6: Skills */}
              {activeStep === 6 && (
                <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Skills & Categorization</h3>
                  
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Programming</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {['Java', 'Python', 'C#', 'JavaScript', 'TypeScript', 'Go'].map(lang => {
                        const checked = formData.skills.programming.includes(lang);
                        return (
                          <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                            <input type="checkbox" checked={checked} onChange={() => toggleSkillItem('programming', lang)} />
                            {lang}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Frameworks</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {['React', 'Angular', 'Node', 'Express', 'Vue', 'NextJS'].map(f => {
                        const checked = formData.skills.frameworks.includes(f);
                        return (
                          <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                            <input type="checkbox" checked={checked} onChange={() => toggleSkillItem('frameworks', f)} />
                            {f}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Databases</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Firebase'].map(db => {
                        const checked = formData.skills.databases.includes(db);
                        return (
                          <label key={db} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                            <input type="checkbox" checked={checked} onChange={() => toggleSkillItem('databases', db)} />
                            {db}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Step 7: Certificates */}
              {activeStep === 7 && (
                <motion.div key="s7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Certifications</h3>
                    <button onClick={addCert} style={{ border: 'none', background: '#f5f3ff', color: '#7c3aed', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                      + Add Certificate
                    </button>
                  </div>
                  {formData.certificates.map((cert, idx) => (
                    <div key={cert.id || idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <button onClick={() => deleteCert(cert.id)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                        <input placeholder="Certificate Name" value={cert.name} onChange={(e) => updateCert(cert.id, 'name', e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input placeholder="Organization" value={cert.organization} onChange={(e) => updateCert(cert.id, 'organization', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Year" value={cert.year} onChange={(e) => updateCert(cert.id, 'year', e.target.value)} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Step 8: Preview */}
              {activeStep === 8 && (
                <motion.div key="s8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Resume Preview</h3>
                  
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748b', fontWeight: 700 }}>Resume Score:</span>
                      <span style={{ fontWeight: 900, color: '#7c3aed' }}>92%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748b', fontWeight: 700 }}>ATS Score:</span>
                      <span style={{ fontWeight: 900, color: '#10b981' }}>86%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748b', fontWeight: 700 }}>Template:</span>
                      <span style={{ fontWeight: 800, textTransform: 'capitalize' }}>{formData.templateId}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleDownload}
                    style={{ 
                      width: '100%', 
                      padding: '1.1rem', 
                      borderRadius: '12px', 
                      fontWeight: 900, 
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Download PDF
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem 2.5rem', 
            borderTop: '1px solid #e2e8f0', 
            background: 'white', 
            flexShrink: 0 
          }}>
            <button 
              disabled={activeStep === 1}
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: '1px solid #cbd5e1', color: activeStep === 1 ? '#cbd5e1' : '#0f172a', padding: '0.65rem 1.25rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button 
              onClick={handleSave}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: '1px solid #cbd5e1', color: '#64748b', padding: '0.65rem 1.25rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <Save size={16} /> Save Draft
            </button>

            <button 
              disabled={activeStep === 8}
              onClick={() => setActiveStep(prev => Math.min(8, prev + 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: activeStep === 8 ? '#cbd5e1' : '#7c3aed', border: 'none', color: 'white', padding: '0.65rem 1.25rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Next Step <ChevronRight size={16} />
            </button>
          </div>

          {/* AI Assistant button inside Middle Column */}
          <div style={{ position: 'absolute', bottom: '90px', right: '2.5rem', zIndex: 99 }}>
            <button 
              onClick={() => setShowAiAssistantModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.75rem 1.25rem', 
                borderRadius: '50px', 
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', 
                color: 'white', 
                border: 'none', 
                fontWeight: 900, 
                fontSize: '0.8rem',
                boxShadow: '0 8px 20px rgba(124, 58, 237, 0.35)',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={14} /> AI Assistant
            </button>
          </div>

        </div>

        {/* Right Column (40% width): Live Preview */}
        <div style={{ 
          width: '40%', 
          background: '#f1f5f9', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          overflow: 'hidden', 
          position: 'relative' 
        }}>
          
          {/* Preset controls */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0.75rem 1.5rem', 
            background: 'white', 
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {['#7c3aed', '#10b981', '#2563eb', '#f59e0b', '#dc2626', '#000000'].map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    background: c, 
                    border: selectedColor === c ? '2px solid white' : '1px solid #cbd5e1', 
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>

            <select 
              value={formData.templateId} 
              onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
              style={{ border: '1px solid #cbd5e1', background: 'white', padding: '0.2rem 0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, outline: 'none' }}
            >
              <option value="modern">Modern</option>
              <option value="minimalist">Minimalist</option>
              <option value="executive">Executive</option>
            </select>

            <select 
              value={selectedFont} 
              onChange={(e) => setSelectedFont(e.target.value)}
              style={{ border: '1px solid #cbd5e1', background: 'white', padding: '0.2rem 0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, outline: 'none' }}
            >
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Playfair Display', serif">Playfair</option>
              <option value="'Roboto', sans-serif">Roboto</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
              {[0.5, 0.6, 0.8, 1.0].map(val => (
                <button 
                  key={val}
                  onClick={() => setZoomLevel(val)}
                  style={{ 
                    border: '1px solid #cbd5e1', 
                    background: zoomLevel === val ? '#f3f4f6' : 'white', 
                    padding: '0.2rem 0.4rem', 
                    fontSize: '0.7rem', 
                    borderRadius: '4px', 
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {val * 100}%
                </button>
              ))}
            </div>

            <button 
              onClick={handleDownload}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem', 
                padding: '0.4rem 0.85rem', 
                background: user?.subscription === 'Premium' ? '#10b981' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', 
                color: 'white',
                border: 'none',
                borderRadius: '8px', 
                fontSize: '0.75rem', 
                fontWeight: 900, 
                cursor: 'pointer'
              }}
            >
              {user?.subscription === 'Premium' ? <Download size={13} /> : <Sparkles size={13} />} 
              {user?.subscription === 'Premium' ? 'Download PDF' : '✨ Unlock Premium'}
            </button>
          </div>

          {/* Canva A4 paper canvas sheet preview */}
          <div style={{ 
            flex: 1, 
            overflow: 'auto', 
            padding: '2rem', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-start'
          }}>
            <div 
              id="resume-preview-sheet" 
              style={{ 
                width: '210mm', 
                minHeight: '297mm',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
                background: 'white',
                marginBottom: '4rem'
              }}
            >
              <ModernResumeTemplate 
                data={templatePreviewData} 
                role={formData.department} 
                customColor={selectedColor} 
                customFont={selectedFont} 
              />
            </div>
          </div>

        </div>

      </div>

      {/* AI Assistant Output Modal */}
      <AnimatePresence>
        {showAiAssistantModal && (
          <>
            <div onClick={() => setShowAiAssistantModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(3px)', zIndex: 999 }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              style={{ 
                position: 'fixed', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: 'calc(100% - 32px)', 
                maxWidth: '480px', 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '20px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)', 
                zIndex: 1000,
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#7c3aed" /> AI Assistant Operations
                </h3>
                <button onClick={() => setShowAiAssistantModal(false)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  'Improve Summary',
                  'Generate Experience',
                  'Generate Projects',
                  'Improve Skills',
                  'ATS Suggestions',
                  'Resume Review'
                ].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => runAiAssistant(opt)}
                    style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: '#334155', cursor: 'pointer', textAlign: 'center' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {aiAssistantOutput && (
                <div style={{ padding: '1rem', background: '#f5f3ff', border: '1px solid #d8b4fe', borderRadius: '12px', fontSize: '0.85rem', color: '#5b21b6', lineHeight: 1.6, fontWeight: 600, marginBottom: '1.5rem' }}>
                  {aiAssistantOutput}
                </div>
              )}

              {aiAssistantLoading && (
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '1.5rem' }}>AI Generating suggestions...</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => setShowAiAssistantModal(false)} style={{ padding: '0.65rem 1.25rem', background: 'none', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Close</button>
                {aiAssistantOutput && <button onClick={applyAiText} style={{ padding: '0.65rem 1.25rem', background: '#7c3aed', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Apply Text</button>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Resume Generation progress overlay */}
      <AnimatePresence>
        {isGeneratingAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              color: 'white',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center', width: '90%', maxWidth: '400px' }}
            >
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.5rem', color: 'white' }}>
                {generationProgress < 100 ? 'Generating Resume...' : 'Resume Generated Successfully'}
              </h2>
              <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ width: `${generationProgress}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #4f46e5)', transition: 'width 0.15s ease-out' }} />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>
                {generationProgress}%
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            <div 
              onClick={() => setShowUpgradeModal(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'calc(100% - 32px)',
                maxWidth: '480px',
                background: 'white',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                padding: '2.5rem',
                boxShadow: '0 30px 60px rgba(15,23,42,0.3)',
                zIndex: 10000,
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 950, letterSpacing: '-0.02em', color: '#0f172a' }}>
                  🎉 Resume Ready
                </h3>
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>Resume Score</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7c3aed' }}>92%</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>ATS Score</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>86%</div>
                </div>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Unlock Premium
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                {[
                  'PDF Download',
                  'AI Report',
                  'Cover Letter',
                  'Portfolio'
                ].map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                    <span style={{ color: '#10b981', fontWeight: 900 }}>✔</span> {feat}
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>Pro Plan Access</span>
                <span style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 950 }}>₹299<span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>/month</span></span>
              </div>

              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  if (onUpgradeRedirect) onUpgradeRedirect({ type: 'builder', formData });
                }}
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  border: 'none',
                  color: 'white',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                }}
              >
                Continue
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SplitBuilderView;
