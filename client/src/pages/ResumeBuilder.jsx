import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, GraduationCap, Award, Code, Save, 
  Download, Sparkles, Plus, Trash2, X, ChevronRight, ChevronLeft, Check, Palette, Type, ZoomIn, ZoomOut, Link2
} from 'lucide-react';
import ModernResumeTemplate from '../components/builder/ModernResumeTemplate';
import ProfessionalLayout from '../components/layouts/ProfessionalLayout';
import ModernLayout from '../components/layouts/ModernLayout';
import MinimalLayout from '../components/layouts/MinimalLayout';
import ExecutiveLayout from '../components/layouts/ExecutiveLayout';
import CreativeLayout from '../components/layouts/CreativeLayout';
import EnhancvLayout from '../components/layouts/EnhancvLayout';
import ForgeLogo from '../components/common/ForgeLogo';

// Import modular form components
import PersonalForm from '../components/resume/PersonalForm';
import SummaryForm from '../components/resume/SummaryForm';
import EducationForm from '../components/resume/EducationForm';
import ExperienceForm from '../components/resume/ExperienceForm';
import ProjectsForm from '../components/resume/ProjectsForm';
import SkillsForm from '../components/resume/SkillsForm';
import CertificatesForm from '../components/resume/CertificatesForm';
import LanguagesForm from '../components/resume/LanguagesForm';
import AchievementsForm from '../components/resume/AchievementsForm';
import SignatureForm from '../components/resume/SignatureForm';
import AIAssistant from '../components/resume/AIAssistant';
import ResumeToolbar from '../components/resume/ResumeToolbar';
import DragDropSections from '../components/DragDropSections';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { generateResumeAI } from '../services/aiService';

import PaymentModal from '../components/common/PaymentModal';
import DownloadWorkflowModal from '../components/common/DownloadWorkflowModal';
import PhotoEditorModal from '../components/common/PhotoEditorModal';
import { exportResumeToPdf, generateProfessionalFilename } from '../utils/pdfExport';

const SplitBuilderView = ({ user, onComplete, activeResumeId, onUpgradeRedirect }) => {
  const { resumeId } = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Auto Saved ✔');
  const [resumeSessionId, setResumeSessionId] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentReason, setPaymentReason] = useState('download'); // Default
  const [showFullPreviewModal, setShowFullPreviewModal] = useState(false);
  const [showDownloadWorkflowModal, setShowDownloadWorkflowModal] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  
  // AI Assistant States
  const [showAiAssistantModal, setShowAiAssistantModal] = useState(false);
  const [aiAssistantTask, setAiAssistantTask] = useState('');
  const [aiAssistantOutput, setAiAssistantOutput] = useState('');
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);

  // AI Resume Generator States
  const [showAiGeneratorModal, setShowAiGeneratorModal] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiExperience, setAiExperience] = useState('');
  const [aiSkillsInput, setAiSkillsInput] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleGenerateAI = async () => {
    if (!aiJobTitle.trim()) {
      alert('Please enter a target Job Title.');
      return;
    }

    try {
      setLoadingAI(true);

      const res = await generateResumeAI({
        jobTitle: aiJobTitle,
        experience: aiExperience,
        skills: aiSkillsInput,
      });

      const aiData =
        typeof res.data.data === 'string'
          ? JSON.parse(res.data.data)
          : res.data.data;

      const updatedData = {
        title: `${aiJobTitle} Resume`,
        department: aiJobTitle,
        templateId: formData.templateId || 'modern',
        personalInfo: {
          ...formData.personalInfo,
          name: (formData.personalInfo?.name && formData.personalInfo.name !== 'Your Name') ? formData.personalInfo.name : 'Alexander Wright',
          role: aiJobTitle,
          summary: aiData.summary || formData.personalInfo.summary
        },
        skills: {
          programming: Array.isArray(aiData.skills) ? aiData.skills : (aiSkillsInput ? aiSkillsInput.split(',').map(s => s.trim()).filter(Boolean) : ['React.js', 'Node.js', 'TypeScript']),
          frameworks: ['REST APIs', 'Redux Toolkit', 'Tailwind CSS'],
          databases: ['PostgreSQL', 'MongoDB', 'AWS']
        },
        experience: aiData.experience && aiData.experience.length > 0 ? aiData.experience.map(e => ({
          role: e.position || e.title || aiJobTitle,
          company: e.company || 'Enterprise Solutions Ltd.',
          duration: e.duration || '2022 - Present',
          desc: e.description || e.desc || ''
        })) : [
          {
            role: `Senior ${aiJobTitle}`,
            company: 'Apex Digital Systems',
            duration: '2022 - Present',
            desc: `Spearheaded key developments using ${aiSkillsInput || 'modern technical stack'}.\nOptimized overall system efficiency by 35%.`
          }
        ],
        projects: aiData.projects && aiData.projects.length > 0 ? aiData.projects.map(p => ({
          name: p.title || p.name || `${aiJobTitle} Platform`,
          technology: aiSkillsInput || 'React, Node.js',
          desc: p.description || p.desc || ''
        })) : [
          {
            name: `${aiJobTitle} Automation Suite`,
            technology: aiSkillsInput || 'React, Node.js, Cloud',
            desc: 'Built scalable web solution handling high-concurrency requests with 99.9% uptime.'
          }
        ],
        education: formData.education.length > 0 ? formData.education : [
          { degree: 'B.S. in Computer Science', institution: 'University of Washington', tenure: '2016 - 2020', cgpa: '3.9' }
        ]
      };

      setFormData(prev => ({
        ...prev,
        department: aiJobTitle,
        personalInfo: updatedData.personalInfo,
        skills: updatedData.skills,
        experience: updatedData.experience,
        projects: updatedData.projects,
        education: updatedData.education
      }));

      const activeSessionId = resumeSessionId || localStorage.getItem('activeResumeSessionId') || 'session_ai_' + Date.now();
      localStorage.setItem('activeResumeSessionId', activeSessionId);
      localStorage.setItem(`resume_draft_${activeSessionId}`, JSON.stringify(updatedData));
      localStorage.setItem('localResumeDraft', JSON.stringify(updatedData));

      setShowAiGeneratorModal(false);
      setSaveStatus('AI Generated & Saved ✔');
    } catch (error) {
      console.error(error);
      alert('AI resume generation failed.');
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    const handleOpenPayment = (e) => {
      setPaymentReason(e.detail?.reason || 'download');
      setShowPaymentModal(true);
    };
    window.addEventListener('open-payment-modal', handleOpenPayment);
    return () => window.removeEventListener('open-payment-modal', handleOpenPayment);
  }, []);

  // Preview Config States
  const [zoomLevel, setZoomLevel] = useState(0.6);
  const [selectedColor, setSelectedColor] = useState('#7c3aed'); // Purple
  const [selectedFont, setSelectedFont] = useState("'Inter', sans-serif");
  
  const [theme, setTheme] = useState({
    primaryColor: '#2563eb',
    secondaryColor: '#111827',
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    lineHeight: 1.6,
    margin: 35,
    profilePosition: 'left'
  });
  // Structured section objects for @hello-pangea/dnd
  const [sections, setSections] = useState([
    { id: 'Summary',      title: 'Professional Summary' },
    { id: 'Experience',   title: 'Experience' },
    { id: 'Education',    title: 'Education' },
    { id: 'Skills',       title: 'Skills' },
    { id: 'Projects',     title: 'Projects' },
    { id: 'Certificates', title: 'Certifications' },
    { id: 'Languages',    title: 'Languages' },
  ]);

  // Pangea DND drag end – reorders sections state and syncs enabledSections
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...sections];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
    // Sync to enabledSections for live preview ordering
    setEnabledSections(['Personal', ...items.map(s => s.id), 'Preview']);
  };

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
      summary: 'Experienced software developer specialized in building modern web applications.',
      profilePhoto: ''
    },
    experience: [],
    education: [],
    projects: [],
    skills: {
      programming: [],
      frameworks: [],
      databases: []
    },
    certificates: [],
    languagesList: [],
    achievements: [],
    references: 'Available upon request',
    signature: { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' }
  });

  // Enable dynamic sections list (populated from database categorization)
  const [enabledSections, setEnabledSections] = useState(['Personal', 'Summary', 'Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Signature', 'Preview']);

  // Initialize Session & Dynamic Categorization
  useEffect(() => {
    const initializeResumeSession = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        let guestId = localStorage.getItem('guestSessionId');
        if (!user && !guestId) {
          guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('guestSessionId', guestId);
        }

        const savedSessionId = resumeId || localStorage.getItem('activeResumeSessionId');

        // 1. Check local draft storage first for instant responsiveness
        let localDraftRaw = null;
        if (savedSessionId) {
          localDraftRaw = localStorage.getItem(`resume_draft_${savedSessionId}`);
        }
        if (!localDraftRaw) {
          localDraftRaw = localStorage.getItem('localResumeDraft');
        }

        if (localDraftRaw) {
          try {
            localDraftRaw = localDraftRaw.replace(/enhancv\.com/gi, 'forgeindiaconnect.com');
            const draftObj = JSON.parse(localDraftRaw);
            if (draftObj) {
              setResumeSessionId(savedSessionId || 'local_session');
              setFormData(prev => ({
                ...prev,
                title: draftObj.title || prev.title,
                templateId: draftObj.templateId || prev.templateId,
                department: draftObj.department || prev.department,
                personalInfo: {
                  name: draftObj.personalInfo?.name || draftObj.personalInfo?.fullName || prev.personalInfo.name,
                  email: (draftObj.personalInfo?.email || prev.personalInfo.email || '').replace(/enhancv\.com/gi, 'forgeindiaconnect.com'),
                  phone: draftObj.personalInfo?.phone || prev.personalInfo.phone,
                  location: draftObj.personalInfo?.location || prev.personalInfo.location,
                  linkedin: draftObj.personalInfo?.linkedin || prev.personalInfo.linkedin,
                  github: draftObj.personalInfo?.github || prev.personalInfo.github,
                  portfolio: draftObj.personalInfo?.portfolio || prev.personalInfo.portfolio,
                  summary: draftObj.personalInfo?.summary || draftObj.summary || prev.personalInfo.summary,
                },
                skills: {
                  programming: Array.isArray(draftObj.skills?.programming) ? draftObj.skills.programming : (Array.isArray(draftObj.skills) ? draftObj.skills : []),
                  frameworks: Array.isArray(draftObj.skills?.frameworks) ? draftObj.skills.frameworks : [],
                  databases: Array.isArray(draftObj.skills?.databases) ? draftObj.skills.databases : [],
                },
                experience: (draftObj.experience || []).map(e => ({
                  role: e.title || e.role || e.position || '',
                  company: e.company || '',
                  duration: e.duration || '',
                  desc: e.desc || e.description || ''
                })),
                education: (draftObj.education || []).map(e => ({
                  degree: e.degree || '',
                  institution: e.institution || e.school || '',
                  tenure: e.tenure || e.year || '',
                  cgpa: e.cgpa || ''
                })),
                projects: (draftObj.projects || []).map(p => ({
                  name: p.name || p.title || '',
                  technology: p.technology || '',
                  desc: p.desc || p.description || ''
                })),
                certificates: (draftObj.certificates || []).map(c => ({
                  name: c.name || c.title || '',
                  organization: c.organization || c.org || '',
                  year: c.year || ''
                })),
                achievements: (draftObj.achievements || []).map(a => ({
                  title: a.title || '',
                  desc: a.desc || a.description || ''
                })),
                languagesList: (draftObj.languagesList || []).map(l => ({
                  name: l.name || '',
                  level: l.level || ''
                })),
              }));
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Failed to parse local draft:', e);
          }
        }

        if (savedSessionId) {
          const resSession = await fetch(`${API_BASE_URL}/resume-session/${savedSessionId}`, {
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          const dataSession = await resSession.json();
          if (dataSession.success && dataSession.data) {
            const rData = dataSession.data;
            setResumeSessionId(rData._id);
            setFormData(prev => ({
              ...prev,
              title: rData.title || 'My Professional Resume',
              templateId: rData.templateId || 'modern',
              personalInfo: rData.personalInfo || { name: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' },
              experience: rData.experience || [],
              education: rData.education || [],
              projects: rData.projects || [],
              skills: rData.skills || { programming: [], frameworks: [], databases: [] },
              certificates: rData.certificates || [],
              languagesList: rData.languagesList || [],
              achievements: rData.achievements || [],
              references: rData.references || ''
            }));
            
            if (rData.templateId) {
              try {
                const resTpl = await fetch(`${API_BASE_URL}/template/${rData.templateId}`);
                const dataTpl = await resTpl.json();
                if (dataTpl.success && dataTpl.sections) {
                  const mapped = dataTpl.sections.map(s => {
                    if (s.toLowerCase().includes('personal')) return 'Personal';
                    if (s.toLowerCase().includes('summary')) return 'Summary';
                    if (s.toLowerCase().includes('education')) return 'Education';
                    if (s.toLowerCase().includes('experience')) return 'Experience';
                    if (s.toLowerCase().includes('project')) return 'Projects';
                    if (s.toLowerCase().includes('skill')) return 'Skills';
                    if (s.toLowerCase().includes('cert')) return 'Certificates';
                    if (s.toLowerCase().includes('lang')) return 'Languages';
                    if (s.toLowerCase().includes('achieve')) return 'Achievements';
                    return s;
                  });
                  if (!mapped.includes('Preview')) mapped.push('Preview');
                  setEnabledSections(mapped);
                }
              } catch (err) {}
            }
            return;
          }
        }

        const templateSlug = localStorage.getItem('selectedTemplateSlug') || 'modern-blue';
        const jobRole = localStorage.getItem('selectedJobRole') || 'React Developer';

        // 1. Fetch Dynamic Sections list from sitemap/template slug
        if (templateSlug) {
          try {
            const resTpl = await fetch(`${API_BASE_URL}/template/${templateSlug}`);
            const dataTpl = await resTpl.json();
            if (dataTpl.success && dataTpl.sections) {
              const mapped = dataTpl.sections.map(s => {
                if (s.toLowerCase().includes('personal')) return 'Personal';
                if (s.toLowerCase().includes('summary')) return 'Summary';
                if (s.toLowerCase().includes('education')) return 'Education';
                if (s.toLowerCase().includes('experience')) return 'Experience';
                if (s.toLowerCase().includes('project')) return 'Projects';
                if (s.toLowerCase().includes('skill')) return 'Skills';
                if (s.toLowerCase().includes('cert')) return 'Certificates';
                if (s.toLowerCase().includes('lang')) return 'Languages';
                if (s.toLowerCase().includes('achieve')) return 'Achievements';
                return s;
              });
              if (!mapped.includes('Preview')) mapped.push('Preview');
              setEnabledSections(mapped);
            }
          } catch (err) {
            console.error('Error fetching dynamic sections:', err);
          }
        }

        // 2. Initialize or load session on backend
        const body = {
          userId: user?._id || null,
          guestId: user ? null : guestId,
          templateId: templateSlug,
          jobRole: jobRole
        };

        const resSession = await fetch(`${API_BASE_URL}/resume-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(body)
        });

        const dataSession = await resSession.json();
        if (dataSession.success) {
          setResumeSessionId(dataSession.sessionId);
          const rData = dataSession.data;
          const sessionInfo = dataSession.session;
          
          setFormData(prev => ({
            ...prev,
            title: sessionInfo.title || 'My Professional Resume',
            templateId: sessionInfo.templateId || 'modern',
            personalInfo: rData.personal || { name: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' },
            experience: rData.experience || [],
            education: rData.education || [],
            projects: rData.projects || [],
            skills: rData.skills || { programming: [], frameworks: [], databases: [] },
            certificates: rData.certificates || [],
            languagesList: rData.languages || [],
            achievements: rData.achievements || [],
            references: rData.references || ''
          }));
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        // Fallback to local storage draft
        const localDraft = localStorage.getItem('localResumeDraft');
        if (localDraft) {
          try {
            setFormData(JSON.parse(localDraft));
          } catch (e) {}
        }
      } finally {
        setLoading(false);
      }
    };

    initializeResumeSession();
  }, [user]);

  // Auto-Save Effect (1.5s Debounce)
  useEffect(() => {
    if (!resumeSessionId) return;

    setSaveStatus('Saving...');
    const delayDebounce = setTimeout(async () => {
      localStorage.setItem('localResumeDraft', JSON.stringify(formData));
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/resume-session/${resumeSessionId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            personal: formData.personalInfo,
            education: formData.education,
            experience: formData.experience,
            projects: formData.projects,
            skills: formData.skills,
            certificates: formData.certificates,
            languages: formData.languagesList,
            achievements: formData.achievements,
            references: formData.references
          })
        });
        const result = await response.json();
        if (result.success) {
          setSaveStatus('Auto Saved ✔');
        } else {
          setSaveStatus('Error Saving');
        }
      } catch (err) {
        setSaveStatus('Offline Mode');
      }
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [formData, resumeSessionId]);

  // Calculation Metrics
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

  const getAtsScore = () => {
    let score = 70; // base ATS compliance
    score += Math.min((formData.experience?.length || 0) * 4, 12);
    score += Math.min((formData.projects?.length || 0) * 3, 9);
    if (formData.skills.programming.length > 0) score += 4;
    if (formData.skills.frameworks.length > 0) score += 3;
    return Math.min(score, 98);
  };

  const handleDownload = () => {
    const isPremium = localStorage.getItem('user_premium') === 'true';
    if (!isPremium) {
      setShowPaymentModal(true);
    } else {
      setShowFullPreviewModal(false);
      setShowDownloadWorkflowModal(true);
    }
  };

  // Handlers for personal details
  const handlePersonalChange = (e) => {
    setFormData({
      ...formData,
      personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value }
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

  // Skills Handlers
  const handleToggleSkill = (category, skill) => {
    const list = formData.skills[category] || [];
    const updated = list.includes(skill)
      ? list.filter(item => item !== skill)
      : [...list, skill];
    setFormData({
      ...formData,
      skills: { ...formData.skills, [category]: updated }
    });
  };

  const handleAddSkill = (category, skill) => {
    const list = formData.skills[category] || [];
    if (!list.includes(skill)) {
      setFormData({
        ...formData,
        skills: { ...formData.skills, [category]: [...list, skill] }
      });
    }
  };

  const handleRemoveSkill = (category, skill) => {
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [category]: (formData.skills[category] || []).filter(s => s !== skill)
      }
    });
  };

  // Languages Handlers
  const handleAddLanguage = (lang) => {
    if (!formData.languagesList.includes(lang)) {
      setFormData({
        ...formData,
        languagesList: [...formData.languagesList, lang]
      });
    }
  };

  const handleRemoveLanguage = (lang) => {
    setFormData({
      ...formData,
      languagesList: formData.languagesList.filter(l => l !== lang)
    });
  };

  // Achievements Handlers
  const handleAddAchievement = (ach) => {
    if (!formData.achievements.includes(ach)) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, ach]
      });
    }
  };

  const handleDeleteAchievement = (idx) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== idx)
    });
  };

  const handleSave = async () => {
    if (!resumeSessionId) return;
    setLoading(true);
    setSaveStatus('Saving Draft...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/resume-session/${resumeSessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          personal: formData.personalInfo,
          education: formData.education,
          experience: formData.experience,
          projects: formData.projects,
          skills: formData.skills,
          certificates: formData.certificates,
          languages: formData.languagesList,
          achievements: formData.achievements,
          references: formData.references
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSaveStatus('Saved Successfully! ✔');
        setTimeout(() => setSaveStatus('Auto Saved ✔'), 3000);
      } else {
        setSaveStatus('Error saving details');
      }
    } catch (err) {
      setSaveStatus('Connection Error');
    } finally {
      setLoading(false);
    }
  };



  const runAiAssistant = async (taskName) => {
    setAiAssistantTask(taskName);
    setAiAssistantLoading(true);
    setAiAssistantOutput('');
    setShowAiAssistantModal(true);

    let promptContext = '';
    if (taskName.includes('Summary')) {
      promptContext = formData.personalInfo.summary;
    } else if (taskName.includes('Skills')) {
      promptContext = (formData.skills.programming || []).join(', ');
    } else if (taskName.includes('Experience')) {
      promptContext = formData.experience.map(e => e.desc).join('\n');
    } else if (taskName.includes('Project')) {
      promptContext = formData.projects.map(p => p.desc).join('\n');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ai/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promptContext, section: taskName.toLowerCase(), role: formData.personalInfo.role || formData.department || 'Software Engineer' })
      });
      const data = await response.json();
      if (response.ok && data.success && data.text) {
        setAiAssistantOutput(data.text);
      } else {
        const userText = promptContext.trim();
        if (userText) {
          setAiAssistantOutput(`Dedicated & results-driven ${userText.replace(/^([A-Z])/, (m) => m.toLowerCase())} Demonstrates a proven track record of advancing operational standards, optimizing workflow efficiency, and delivering high-impact clinical/business outcomes.`);
        } else {
          setAiAssistantOutput(`Results-oriented ${formData.personalInfo.role || formData.department || 'Professional'} with strong industry expertise, proven problem-solving capabilities, and commitment to driving operational excellence.`);
        }
      }
    } catch (e) {
      const userText = promptContext.trim();
      if (userText) {
        setAiAssistantOutput(`Dedicated & results-driven ${userText.replace(/^([A-Z])/, (m) => m.toLowerCase())} Demonstrates a proven track record of advancing operational standards, optimizing workflow efficiency, and delivering high-impact clinical/business outcomes.`);
      } else {
        setAiAssistantOutput(`Results-oriented ${formData.personalInfo.role || formData.department || 'Professional'} with strong industry expertise, proven problem-solving capabilities, and commitment to driving operational excellence.`);
      }
    } finally {
      setAiAssistantLoading(false);
    }
  };

  const applyAiText = () => {
    if (!aiAssistantOutput) return;
    if (aiAssistantTask.includes('Summary')) {
      setFormData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, summary: aiAssistantOutput }
      }));
    } else if (aiAssistantTask.includes('Experience')) {
      setFormData(prev => ({
        ...prev,
        experience: [
          ...prev.experience,
          {
            id: Date.now(),
            role: prev.personalInfo.role || 'Senior Specialist',
            company: 'Apex Digital Solutions',
            duration: '2022 - Present',
            desc: aiAssistantOutput
          }
        ]
      }));
    } else if (aiAssistantTask.includes('Project')) {
      setFormData(prev => ({
        ...prev,
        projects: [
          ...prev.projects,
          {
            id: Date.now(),
            name: `${prev.personalInfo.role || 'Core'} Project Platform`,
            technology: 'React, Node.js, Cloud',
            desc: aiAssistantOutput,
            github: '',
            liveDemo: ''
          }
        ]
      }));
    } else if (aiAssistantTask.includes('Skills')) {
      const parsed = aiAssistantOutput.split(',').map(s => s.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          programming: Array.from(new Set([...(prev.skills.programming || []), ...parsed]))
        }
      }));
    }
    setShowAiAssistantModal(false);
  };

  const steps = enabledSections.map((label, index) => ({
    num: index + 1,
    label
  }));

  const templatePreviewData = {
    name: formData.personalInfo?.name || 'Your Name',
    role: formData.personalInfo?.role || formData.department || '',
    profilePhoto: formData.personalInfo?.profilePhoto || '',
    photoData: formData.personalInfo?.profilePhoto || null,
    contact: {
      email: formData.personalInfo?.email || '',
      phone: formData.personalInfo?.phone || '',
      location: formData.personalInfo?.location || '',
      linkedin: formData.personalInfo?.linkedin || '',
      github: formData.personalInfo?.github || '',
      portfolio: formData.personalInfo?.portfolio || ''
    },
    objective: formData.personalInfo?.summary || '',
    education: formData.education.map(e => ({
      degree: e.degree || 'Degree',
      institution: e.school || 'School',
      department: e.department || '',
      cgpa: e.cgpa || '',
      tenure: e.year || ''
    })),
    experience: formData.experience.map(e => ({
      title: e.role || 'Role',
      company: e.company || 'Company',
      duration: e.duration || '',
      desc: e.desc || '',
      points: e.desc ? e.desc.split('\n').filter(b => b.trim().length > 0) : []
    })),
    skills: {
      languages: (formData.skills.programming || []).join(', '),
      frameworks: (formData.skills.frameworks || []).join(', '),
      tools: (formData.skills.databases || []).join(', ')
    },
    projects: formData.projects.map(p => ({
      title: p.name || 'Project',
      technology: p.technology || '',
      desc: p.desc || '',
      points: p.desc ? p.desc.split('\n').filter(b => b.trim().length > 0) : []
    })),
    training: formData.certificates.map(c => c.name).filter(Boolean),
    languagesList: formData.languagesList || [],
    references: formData.references || '',
    signature: formData.signature
  };

  const renderLayout = () => {
    const layoutKey = (formData.templateId || 'professional').toLowerCase();
    const props = {
      data: templatePreviewData,
      role: formData.department,
      customColor: selectedColor,
      secondaryColor: theme.primaryColor,
      customFont: selectedFont,
      sections: sections,
      sectionsOrder: enabledSections,
      headingSize: theme.fontSize ? theme.fontSize + 8 : 22,
      fontSize: theme.fontSize,
      lineHeight: theme.lineHeight,
      spacing: theme.margin > 40 ? 'comfortable' : theme.margin < 25 ? 'compact' : 'normal',
      profilePosition: theme.profilePosition,
      theme: theme
    };

    switch (layoutKey) {
      case 'professional':
        return <ProfessionalLayout {...props} />;
      case 'modern':
        return <ModernLayout {...props} />;
      case 'minimal':
      case 'minimalist':
        return <MinimalLayout {...props} />;
      case 'executive':
        return <ExecutiveLayout {...props} />;
      case 'creative':
        return <CreativeLayout {...props} />;
      case 'enhancv':
        return <EnhancvLayout {...props} />;
      default:
        return <ProfessionalLayout {...props} />;
    }
  };

  const currentLabel = steps.find(s => s.num === activeStep)?.label || 'Personal';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Navbar */}
      <header className="no-print" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.85rem 2.5rem', 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0',
        zIndex: 50,
        flex: '0 0 auto'
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

          {localStorage.getItem('builder_mode') === 'ai' ? (
            <button 
              onClick={() => setShowAiGeneratorModal(true)}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.15s'
              }}
            >
              <Sparkles size={14} /> Generate with AI
            </button>
          ) : (
            <button 
              onClick={() => setShowAiAssistantModal(true)}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.15s'
              }}
            >
              <Sparkles size={14} /> AI Assistant
            </button>
          )}

          {user?.subscription !== 'Premium' && (
            <button 
              onClick={() => setShowPaymentModal(true)}
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
      <div className="no-print" style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '0.75rem 2rem', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '0.85rem', 
        flex: '0 0 auto',
        zIndex: 40
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
              {step.num < steps.length && <ChevronRight size={12} color="#cbd5e1" style={{ marginLeft: '0.4rem' }} />}
            </div>
          );
        })}
      </div>

      {/* Three Column Grid Workspace */}
      <div style={{ display: 'flex', flex: '1 1 auto', overflow: 'hidden', minHeight: 0, boxSizing: 'border-box', paddingTop: '10px' }}>
        
        {/* Left Column (Fixed 240px width): Metrics Sidebar */}
        <div className="no-print" style={{ 
          width: '240px',
          minWidth: '240px',
          maxWidth: '240px',
          height: '100%',
          minHeight: 0,
          background: 'white', 
          borderRight: '1px solid #e2e8f0', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '1.25rem 1rem',
          gap: '1.5rem',
          overflowY: 'auto',
          boxSizing: 'border-box'
        }}>


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

          {/* Section Reordering Widget */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <DragDropSections
              sections={sections}
              setSections={(newSections) => {
                setSections(newSections);
                const reorderedIds = newSections.map(s => typeof s === 'string' ? s : (s.id || s.title));
                setEnabledSections(['Personal', ...reorderedIds, 'Preview']);
              }}
              hiddenSections={sections.filter(s => s.enabled === false).map(s => s.id || s.title || s)}
              setHiddenSections={(updater) => {
                if (typeof updater === 'function') {
                  const currentHidden = sections.filter(s => s.enabled === false).map(s => s.id || s.title || s);
                  const nextHidden = updater(currentHidden);
                  setSections(prev => prev.map(s => {
                    const id = s.id || s.title || s;
                    return typeof s === 'object' ? { ...s, enabled: !nextHidden.includes(id) } : { id: s, title: s, enabled: !nextHidden.includes(s) };
                  }));
                }
              }}
              onAiGenerated={() => {
                setShowAiGeneratorModal(true);
              }}
            />
          </div>

          <div style={{ height: '1px', background: '#cbd5e1' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontWeight: 700 }}>Active Layout:</span>
            <span style={{ fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', background: '#f5f3ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{formData.templateId || 'professional'}</span>
          </div>

          {/* Layout Selector Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Switch Layout</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {['professional', 'modern', 'minimal', 'executive', 'creative'].map((lType) => {
                const isActive = (formData.templateId || 'professional').toLowerCase() === lType;
                return (
                  <button
                    key={lType}
                    onClick={() => setFormData({ ...formData, templateId: lType })}
                    style={{
                      flex: '1 1 40%',
                      padding: '0.4rem 0.5rem',
                      borderRadius: '6px',
                      border: `1px solid ${isActive ? '#7c3aed' : '#cbd5e1'}`,
                      background: isActive ? '#f5f3ff' : 'white',
                      color: isActive ? '#7c3aed' : '#475569',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      boxShadow: isActive ? '0 2px 8px rgba(124,58,237,0.15)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    {lType}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: '#cbd5e1' }} />

          {/* Theme Customization Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a' }}>Customize Theme</span>
            
            {/* Primary & Secondary Color Pickers */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Primary</label>
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => {
                    setTheme({ ...theme, primaryColor: e.target.value });
                    setSelectedColor(e.target.value);
                  }}
                  style={{ width: '100%', height: '30px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', background: 'none', padding: 0 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Secondary</label>
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  style={{ width: '100%', height: '30px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', background: 'none', padding: 0 }}
                />
              </div>
            </div>

            {/* Font Family Selector */}
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Font Family</label>
              <select
                value={theme.fontFamily}
                onChange={(e) => {
                  setTheme({ ...theme, fontFamily: e.target.value });
                  setSelectedFont(e.target.value);
                }}
                style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 700, outline: 'none' }}
              >
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Playfair Display', serif">Playfair</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Arial, sans-serif">Arial</option>
              </select>
            </div>

            {/* Font Size Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.2rem' }}>
                <span>Font Size</span>
                <span>{theme.fontSize}px</span>
              </div>
              <input
                type="range"
                min="11"
                max="18"
                value={theme.fontSize}
                onChange={(e) => setTheme({ ...theme, fontSize: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
              />
            </div>

            {/* Line Spacing Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.2rem' }}>
                <span>Line Spacing</span>
                <span>{theme.lineHeight}</span>
              </div>
              <input
                type="range"
                min="1.2"
                max="2.2"
                step="0.1"
                value={theme.lineHeight}
                onChange={(e) => setTheme({ ...theme, lineHeight: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
              />
            </div>

            {/* Page Margins Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.2rem' }}>
                <span>Page Margins</span>
                <span>{theme.margin}px</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                value={theme.margin}
                onChange={(e) => setTheme({ ...theme, margin: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
              />
            </div>

            {/* Header Alignment Position Selector */}
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Header Alignment</label>
              <select
                value={theme.profilePosition}
                onChange={(e) => setTheme({ ...theme, profilePosition: e.target.value })}
                style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 700, outline: 'none' }}
              >
                <option value="left">Left Align</option>
                <option value="center">Center Align</option>
                <option value="right">Right Align</option>
              </select>
            </div>
          </div>
        </div>

        {/* Middle Column (Form Editor): Step Form */}
        <div className="no-print" style={{ 
          flex: '0 0 440px',
          width: '440px', 
          maxWidth: '460px',
          height: '100%',
          minHeight: 0,
          background: 'white', 
          borderRight: '1px solid #e2e8f0', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          boxSizing: 'border-box'
        }}>
          
          <div style={{ flex: 1, padding: '1.25rem 1.5rem', overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentLabel}
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                {currentLabel === 'Personal' && (
                  <PersonalForm 
                    personalInfo={formData.personalInfo} 
                    onChange={handlePersonalChange} 
                    onOpenPhotoEditor={() => setShowPhotoEditor(true)}
                  />
                )}

                {currentLabel === 'Summary' && (
                  <SummaryForm 
                    summary={formData.personalInfo.summary} 
                    onChange={handlePersonalChange} 
                    onRunAi={runAiAssistant}
                  />
                )}

                {currentLabel === 'Education' && (
                  <EducationForm 
                    education={formData.education} 
                    onAdd={addEducation} 
                    onUpdate={updateEducation} 
                    onDelete={deleteEducation} 
                  />
                )}

                {currentLabel === 'Experience' && (
                  <ExperienceForm 
                    experience={formData.experience} 
                    onAdd={addExperience} 
                    onUpdate={updateExperience} 
                    onDelete={deleteExperience} 
                    onRunAi={runAiAssistant}
                  />
                )}

                {currentLabel === 'Projects' && (
                  <ProjectsForm 
                    projects={formData.projects} 
                    onAdd={addProject} 
                    onUpdate={updateProject} 
                    onDelete={deleteProject} 
                    onRunAi={runAiAssistant}
                  />
                )}

                {currentLabel === 'Skills' && (
                  <SkillsForm 
                    skills={formData.skills} 
                    onToggleSkill={handleToggleSkill} 
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                  />
                )}

                {currentLabel === 'Certificates' && (
                  <CertificatesForm 
                    certificates={formData.certificates} 
                    onAdd={addCert} 
                    onUpdate={updateCert} 
                    onDelete={deleteCert} 
                  />
                )}

                {currentLabel === 'Languages' && (
                  <LanguagesForm 
                    languagesList={formData.languagesList} 
                    onAddLanguage={handleAddLanguage} 
                    onRemoveLanguage={handleRemoveLanguage} 
                  />
                )}

                {currentLabel === 'Achievements' && (
                  <AchievementsForm 
                    achievements={formData.achievements} 
                    onAddAchievement={handleAddAchievement} 
                    onDeleteAchievement={handleDeleteAchievement} 
                    references={formData.references}
                    onChangeReferences={(val) => setFormData({ ...formData, references: val })}
                  />
                )}

                {currentLabel === 'Signature' && (
                  <SignatureForm 
                    signatureData={formData.signature} 
                    onChange={(sig) => setFormData({ ...formData, signature: sig })} 
                  />
                )}

                {currentLabel === 'Preview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Resume Ready</h3>
                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b', fontWeight: 700 }}>Resume Score:</span>
                        <span style={{ fontWeight: 900, color: '#7c3aed' }}>{getProgressPercent()}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b', fontWeight: 700 }}>ATS Score:</span>
                        <span style={{ fontWeight: 900, color: '#10b981' }}>{getAtsScore()}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b', fontWeight: 700 }}>Template:</span>
                        <span style={{ fontWeight: 800, textTransform: 'capitalize' }}>{formData.templateId}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowFullPreviewModal(true)}
                      style={{ 
                        width: '100%', 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        fontWeight: 800, 
                        background: '#ffffff',
                        color: '#0284c7',
                        border: '2px solid #0284c7',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                      }}
                    >
                      👁️ Full-Screen Read-Only Preview
                    </button>

                    <button 
                      onClick={handleDownload}
                      style={{ 
                        width: '100%', 
                        padding: '1.1rem', 
                        borderRadius: '12px', 
                        fontWeight: 900, 
                        background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.95rem'
                      }}
                    >
                      <Download size={18} /> Download PDF
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0.85rem 1rem', 
            borderTop: '1px solid #e2e8f0', 
            background: 'white', 
            flexShrink: 0,
            gap: '0.4rem'
          }}>
            <button 
              disabled={activeStep === 1}
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: '1px solid #cbd5e1', color: activeStep === 1 ? '#cbd5e1' : '#0f172a', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <button 
              onClick={handleSave}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: '1px solid #cbd5e1', color: '#64748b', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
            >
              <Save size={14} /> Save
            </button>

            <button 
              onClick={() => setShowAiAssistantModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', color: 'white', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,58,237,0.2)' }}
            >
              <Sparkles size={13} /> AI
            </button>

            <button 
              disabled={activeStep === steps.length}
              onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: activeStep === steps.length ? '#cbd5e1' : '#7c3aed', border: 'none', color: 'white', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

        </div>

        {/* Right Column (Flex Fill): Live Preview */}
        <div style={{ 
          flex: 1, 
          height: '100%',
          minHeight: 0,
          background: '#f1f5f9', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', 
          position: 'relative',
          boxSizing: 'border-box'
        }}>
          
          {/* Preset controls */}
          <ResumeToolbar 
            selectedColor={selectedColor}
            onChangeColor={setSelectedColor}
            templateId={formData.templateId}
            onChangeTemplate={(val) => setFormData({ ...formData, templateId: val })}
            selectedFont={selectedFont}
            onChangeFont={setSelectedFont}
            zoomLevel={zoomLevel}
            onChangeZoom={setZoomLevel}
            isPremiumUser={user?.subscription === 'Premium'}
            onDownloadAction={handleDownload}
          />

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
              className="print-paper-sheet"
              style={{ 
                width: '210mm', 
                minHeight: '297mm',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '2px',
                overflow: 'visible',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
                background: 'white',
                marginBottom: '4rem'
              }}
            >
              {renderLayout()}
            </div>
          </div>

        </div>

      </div>

      {/* AI Assistant Output Modal */}
      <AIAssistant 
        isOpen={showAiAssistantModal}
        onClose={() => setShowAiAssistantModal(false)}
        onRunAi={runAiAssistant}
        aiOutput={aiAssistantOutput}
        loading={aiAssistantLoading}
        onApply={applyAiText}
        currentTask={aiAssistantTask}
      />

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
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7c3aed' }}>{getProgressPercent()}%</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>ATS Score</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>{getAtsScore()}%</div>
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

      {/* AI Resume Generator Modal */}
      <AnimatePresence>
        {showAiGeneratorModal && (
          <>
            <div 
              onClick={() => setShowAiGeneratorModal(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(3px)', zIndex: 999 }}
            />
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
                  <Sparkles size={20} color="#7c3aed" /> AI Resume Generator
                </h3>
                <button onClick={() => setShowAiGeneratorModal(false)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1.25rem' }}>
                Enter your target position, years of experience, and key skills to automatically generate an entire ATS-optimized resume.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={aiJobTitle}
                    onChange={(e) => setAiJobTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Years of Experience</label>
                  <input
                    type="number"
                    placeholder="e.g. 2"
                    value={aiExperience}
                    onChange={(e) => setAiExperience(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, MongoDB"
                    value={aiSkillsInput}
                    onChange={(e) => setAiSkillsInput(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowAiGeneratorModal(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#64748b', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAI}
                  disabled={loadingAI}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    cursor: loadingAI ? 'not-allowed' : 'pointer',
                    opacity: loadingAI ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loadingAI ? 'Generating with AI...' : 'Generate with AI'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full-Screen Read-Only Resume Lock & Confirmation Modal */}
      <AnimatePresence>
        {showFullPreviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(10px)',
              zIndex: 10000,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Top Confirmation Action Bar */}
            <div style={{
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              padding: '0.9rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  Your resume is ready! 🎉
                </h3>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                  Please review your clean read-only preview before downloading.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => setShowFullPreviewModal(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 1.2rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    background: 'white',
                    color: '#334155',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <ChevronLeft size={16} /> Back to Edit
                </button>

                <button
                  onClick={handleDownload}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 1.4rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </div>

            {/* Read-Only Resume Document Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2.5rem 1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}>
              <div
                id="resume-preview-sheet"
                className="print-paper-sheet"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  background: 'white',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {renderLayout()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps 28-34: Resume Review & Professional Download Workflow Modal */}
      <DownloadWorkflowModal
        isOpen={showDownloadWorkflowModal}
        onClose={() => setShowDownloadWorkflowModal(false)}
        formData={formData}
        atsScore={getAtsScore()}
        onEdit={() => setShowDownloadWorkflowModal(false)}
        onNavigateHome={() => navigate('/')}
      />

      {/* Razorpay Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planType="PREMIUM"
        reason={paymentReason}
        onSuccess={() => {
          setShowDownloadWorkflowModal(true);
        }}
      />

      {/* Profile Photo Editor Modal */}
      <PhotoEditorModal
        isOpen={showPhotoEditor}
        onClose={() => setShowPhotoEditor(false)}
        photoData={formData.personalInfo?.profilePhoto}
        onSave={(photoData) => {
          setFormData({
            ...formData,
            personalInfo: {
              ...formData.personalInfo,
              profilePhoto: photoData
            }
          });
          setShowPhotoEditor(false);
        }}
        themeColor={theme.primaryColor}
      />
    </div>
  );
};

export default SplitBuilderView;
