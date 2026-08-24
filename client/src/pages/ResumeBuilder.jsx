import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, GraduationCap, Award, Code, Save, 
  Download, Sparkles, Plus, Trash2, ChevronRight, ChevronLeft, Check, Palette, Type, ZoomIn, ZoomOut, Link2,
  AlertTriangle, Eye, Settings2, ShieldCheck, FileText, CheckCircle2
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
import ResumeFooter from '../components/layouts/ResumeFooter';
import ResumeToolbar from '../components/resume/ResumeToolbar';
import DragDropSections from '../components/DragDropSections';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { generateResumeAI } from '../services/aiService';
import { startSession, trackEvent } from '../utils/sessionTracker';

import DownloadWorkflowModal from '../components/common/DownloadWorkflowModal';
import PhotoEditorModal from '../components/common/PhotoEditorModal';
import JobDescriptionMatcherModal from '../components/common/JobDescriptionMatcherModal';
import AiBulletPolishModal from '../components/common/AiBulletPolishModal';
import { RESUME_PRICING } from '../config/pricing';

const SplitBuilderView = ({ user, onComplete, activeResumeId, onUpgradeRedirect }) => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [showJdMatcherModal, setShowJdMatcherModal] = useState(false);
  const [polishTarget, setPolishTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Auto Saved ✔');
  const [resumeSessionId, setResumeSessionId] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showFullPreviewModal, setShowFullPreviewModal] = useState(false);
  const [showDownloadWorkflowModal, setShowDownloadWorkflowModal] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  
  // AI Assistant States
  const [showAiAssistantModal, setShowAiAssistantModal] = useState(false);
  const [aiAssistantTask, setAiAssistantTask] = useState('');
  const [aiAssistantOutput, setAiAssistantOutput] = useState('');
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);
  const [aiTargetProjectId, setAiTargetProjectId] = useState(null);

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
      trackEvent("AI Generator Used", "/builder");

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
    // Track Builder Open
    trackEvent("Resume Builder Opened", "/builder");
    // INTELLIGENT SYNC: If the current draft hasn't been paid for yet, ensure preview isn't artificially premium
    const draft = JSON.parse(localStorage.getItem('localResumeDraft') || '{}');
    if (draft.paymentStatus !== 'paid') {
      localStorage.removeItem('user_premium');
    }

    // Load resume data
    const handleOpenPayment = (e) => {
      // setPaymentReason(e.detail?.reason || 'download');
      // setShowPaymentModal(true);
    };
    const handleOpenDownload = () => {
      setShowDownloadWorkflowModal(true);
    };
    window.addEventListener('open-payment-modal', handleOpenPayment);
    window.addEventListener('open-download-workflow', handleOpenDownload);
    return () => {
      window.removeEventListener('open-payment-modal', handleOpenPayment);
      window.removeEventListener('open-download-workflow', handleOpenDownload);
    };
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
    spacing: 'normal',
    profilePosition: 'left'
  });

  const [isOnePageActive, setIsOnePageActive] = useState(false);

  const handleFitToOnePage = () => {
    if (!isOnePageActive) {
      setTheme(prev => ({
        ...prev,
        fontSize: 11,
        spacing: 'compact',
        margin: 16,
        lineHeight: 1.35
      }));
      setIsOnePageActive(true);
      setSaveStatus('Optimized for 1-Page Layout ✔');
      setTimeout(() => setSaveStatus('Auto Saved ✔'), 3000);
    } else {
      setTheme(prev => ({
        ...prev,
        fontSize: 13,
        spacing: 'normal',
        margin: 32,
        lineHeight: 1.55
      }));
      setIsOnePageActive(false);
      setSaveStatus('Reset to standard spacing ✔');
      setTimeout(() => setSaveStatus('Auto Saved ✔'), 3000);
    }
  };
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
    templateId: 'enhancv',
    department: 'Senior Technical Project Manager',
    personalInfo: {
      name: user?.name || 'Rohan Sharma',
      email: user?.email || 'rohan.sharma@forgeindiaconnect.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, Karnataka',
      linkedin: 'linkedin.com/in/rohan-sharma-pmp',
      github: 'github.com/rohansharma',
      portfolio: 'rohansharma.pm',
      summary: 'PMP-certified Senior Technical Project Manager with 8+ years of experience leading cross-functional engineering teams in fintech and SaaS. Delivered enterprise projects worth ₹45 Cr+ on time and under budget while improving team sprint velocity by 35%.',
      profilePhoto: ''
    },
    experience: [
      { id: 1, role: 'Lead Technical Project Manager', company: 'Razorpay Technologies', duration: '2021 - Present', desc: '• Spearheaded 12 sprint squads delivering UPI 2.0 multi-bank settlement platform processing ₹1,200 Cr+ monthly GMV.\n• Reduced production incident resolution cycle times by 42% through automated JIRA & CI/CD workflows.' },
      { id: 2, role: 'Senior Agile Scrum Master', company: 'Tata Consultancy Services (TCS)', duration: '2018 - 2021', desc: '• Facilitated sprint planning, daily standups, and retrospectives for 50+ engineers across India and EMEA.\n• Championed agile transformation that elevated delivery predictability from 72% to 96%.' }
    ],
    education: [
      { id: 1, degree: 'B.Tech in Computer Science & Engineering', school: 'National Institute of Technology (NIT) Trichy', department: 'Computer Science', year: '2014 - 2018', cgpa: '8.9 / 10' }
    ],
    skills: {
      programming: ['Agile Scrum', 'JIRA & Confluence', 'PMP Standards', 'Sprint Planning', 'Risk Mitigation'],
      frameworks: ['Budgeting & Forecasting', 'Stakeholder Management', 'UPI & Fintech Architecture'],
      databases: ['Asana', 'MS Project', 'Tableau BI', 'GitLab']
    },
    projects: [
      { id: 1, name: 'Enterprise Instant Payouts Engine', technology: 'Agile, JIRA, Microservices', desc: 'Directed deployment of high-resilience payout infrastructure handling 2.5M transactions daily across 6 major Indian banking nodes.' }
    ],
    certificates: [
      { id: 1, name: 'Project Management Professional (PMP)®', organization: 'PMI', year: '2021' },
      { id: 2, name: 'Certified ScrumMaster (CSM)®', organization: 'Scrum Alliance', year: '2019' }
    ],
    languagesList: ['English (Fluent)', 'Hindi (Native)', 'Kannada (Professional)'],
    achievements: [],
    references: 'Available upon request',
    signature: { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
    source: localStorage.getItem('source') || 'create',
    paymentStatus: 'pending'
  });

  // Enable dynamic sections list (populated from database categorization)
  const [enabledSections, setEnabledSections] = useState(['Personal', 'Summary', 'Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Languages', 'Signature', 'Preview']);

  // Initialize Session & Dynamic Categorization
  useEffect(() => {
    const initializeResumeSession = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        let guestId = localStorage.getItem('guestId');
        if (!user && !guestId) {
          guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('guestId', guestId);
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
                source: draftObj.source || localStorage.getItem('source') || 'create',
                paymentStatus: draftObj.paymentStatus || 'pending',
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
                  id: e.id || Date.now() + Math.random(),
                  role: e.title || e.role || e.position || '',
                  company: e.company || '',
                  duration: e.duration || '',
                  desc: e.desc || e.description || ''
                })),
                education: (draftObj.education || []).map(e => ({
                  id: e.id || Date.now() + Math.random(),
                  degree: e.degree || '',
                  school: e.school || e.institution || '',
                  department: e.department || '',
                  year: e.year || e.tenure || '',
                  cgpa: e.cgpa || ''
                })),
                projects: (draftObj.projects || []).map(p => ({
                  id: p.id || Date.now() + Math.random(),
                  name: p.name || p.title || '',
                  technology: p.technology || '',
                  desc: p.desc || p.description || '',
                  github: p.github || '',
                  liveDemo: p.liveDemo || ''
                })),
                certificates: (draftObj.certificates || []).map(c => ({
                  id: c.id || Date.now() + Math.random(),
                  name: c.name || c.title || '',
                  organization: c.organization || c.org || '',
                  year: c.year || ''
                })),
                achievements: (draftObj.achievements || []).map(a => ({
                  title: a.title || '',
                  desc: a.desc || a.description || ''
                })),
                languagesList: (draftObj.languagesList || []).map(l => typeof l === 'string' ? l : (l.name || l.title || '')).filter(Boolean),
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
              languagesList: rData.languages || rData.languagesList || [],
              achievements: rData.achievements || [],
              references: rData.references || ''
            }));
            
            if (rData.templateId) {
              try {
                const resTpl = await fetch(`${API_BASE_URL}/templates/${rData.templateId}`);
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
            const resTpl = await fetch(`${API_BASE_URL}/templates/${templateSlug}`);
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
    startSession('/builder');
    trackEvent("Resume Builder Opened", "/builder");
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
        if (response.ok && result.success) {
          setSaveStatus('Auto Saved ✔');
          trackEvent("Resume Auto-Saved", "/builder", {
            resumeCreated: true,
            resumeId: resumeSessionId,
            resumeName: formData.personalInfo?.name || null,
            email: formData.personalInfo?.email || null
          });
        } else {
          setSaveStatus('Auto Saved (Local) ✔');
        }
      } catch (err) {
        setSaveStatus('Auto Saved (Local) ✔');
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

  const currentPricing = RESUME_PRICING[formData?.source] || RESUME_PRICING['create'];

  const handleDownload = () => {
    setShowDownloadWorkflowModal(true);
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



  const runAiAssistant = async (taskName, projectId = null) => {
    setAiTargetProjectId(projectId);
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
      if (projectId) {
        const targetProject = formData.projects.find(p => p.id === projectId);
        promptContext = targetProject ? `${targetProject.name || ''}: ${targetProject.desc || ''}` : formData.projects.map(p => p.desc).join('\n');
      } else {
        promptContext = formData.projects.map(p => p.desc).join('\n');
      }
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
      if (aiTargetProjectId) {
        // Update the description of the specific project that triggered the AI
        setFormData(prev => ({
          ...prev,
          projects: prev.projects.map(p =>
            p.id === aiTargetProjectId ? { ...p, desc: aiAssistantOutput } : p
          )
        }));
      } else {
        // Fallback: add a new project if no target id
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
      }
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

  const TEMPLATE_PRESETS = {
    enhancv: {
      name: 'Rohan Sharma',
      role: 'Senior Technical Project Manager | Agile Scrum | PMP',
      email: 'rohan.sharma@forgeindiaconnect.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, Karnataka',
      linkedin: 'linkedin.com/in/rohan-sharma-pmp',
      github: '',
      portfolio: 'rohansharma.pm',
      summary: 'PMP-certified Senior Technical Project Manager with 8+ years of experience leading cross-functional engineering teams in fintech and SaaS. Delivered enterprise projects worth ₹45 Cr+ on time and under budget while improving team sprint velocity by 35%.',
      experience: [
        { id: 1, role: 'Lead Technical Project Manager', company: 'Razorpay Technologies', duration: '2021 - Present', desc: '• Spearheaded 12 sprint squads delivering UPI 2.0 multi-bank settlement platform processing ₹1,200 Cr+ monthly GMV.\n• Reduced production incident resolution cycle times by 42% through automated JIRA & CI/CD workflows.' },
        { id: 2, role: 'Senior Agile Scrum Master', company: 'Tata Consultancy Services (TCS)', duration: '2018 - 2021', desc: '• Facilitated sprint planning, daily standups, and retrospectives for 50+ engineers across India and EMEA.\n• Championed agile transformation that elevated delivery predictability from 72% to 96%.' }
      ],
      education: [
        { id: 1, degree: 'B.Tech in Computer Science & Engineering', school: 'National Institute of Technology (NIT) Trichy', department: 'Computer Science', year: '2014 - 2018', cgpa: '8.9 / 10' }
      ],
      skills: {
        programming: ['Agile Scrum', 'JIRA & Confluence', 'PMP Standards', 'Sprint Planning', 'Risk Mitigation'],
        frameworks: ['Budgeting & Forecasting', 'Stakeholder Management', 'UPI & Fintech Architecture'],
        databases: ['Asana', 'MS Project', 'Tableau BI', 'GitLab']
      },
      projects: [
        { id: 1, name: 'Enterprise Instant Payouts Engine', technology: 'Agile, JIRA, Microservices', desc: 'Directed deployment of high-resilience payout infrastructure handling 2.5M transactions daily across 6 major Indian banking nodes.' }
      ],
      certificates: [
        { id: 1, name: 'Project Management Professional (PMP)®', organization: 'PMI', year: '2021' },
        { id: 2, name: 'Certified ScrumMaster (CSM)®', organization: 'Scrum Alliance', year: '2019' }
      ],
      languagesList: ['English (Fluent)', 'Hindi (Native)', 'Kannada (Professional)'],
      color: '#2563eb',
      font: "'Inter', sans-serif"
    },
    modern: {
      name: 'Pooja Verma',
      role: 'Lead Business Analyst | Data Science & Analytics',
      email: 'pooja.verma@forgeindiaconnect.com',
      phone: '+91 98450 12345',
      location: 'Gurugram, Delhi NCR',
      linkedin: 'linkedin.com/in/pooja-verma-analytics',
      github: 'github.com/pooja-verma',
      portfolio: 'poojaverma.in',
      summary: 'Data-driven Lead Business Analyst with 7+ years of experience transforming complex datasets into executive strategies. Architected automated business intelligence dashboards for E-commerce & Logistics unlocking ₹18 Cr in annual operational efficiencies.',
      experience: [
        { id: 1, role: 'Lead Business Analyst', company: 'Flipkart Internet Pvt. Ltd.', duration: '2021 - Present', desc: '• Developed automated demand forecasting models cutting supply-chain inventory holding costs by ₹8.5 Cr during Big Billion Days.\n• Designed executive Power BI & Tableau dashboards tracking 120+ KPI metrics across 14 fulfilment hubs.' },
        { id: 2, role: 'Senior Data Analyst', company: 'Swiggy', duration: '2018 - 2021', desc: '• Built predictive cohort models for hyper-local delivery zones, boosting 30-day customer retention by 22%.\n• Optimized delivery partner routing algorithms saving ₹3.2 Cr in fuel and fleet overhead.' }
      ],
      education: [
        { id: 1, degree: 'M.Sc. in Data Science & Business Analytics', school: 'Indian Institute of Technology (IIT) Delhi', department: 'Computer Science', year: '2016 - 2018', cgpa: '9.1 / 10' }
      ],
      skills: {
        programming: ['SQL', 'Python (Pandas, NumPy)', 'Power BI', 'Tableau', 'R'],
        frameworks: ['Statistical Modeling', 'A/B Testing', 'ETL Pipelines', 'Supply Chain Optimization'],
        databases: ['PostgreSQL', 'Snowflake', 'BigQuery', 'Apache Spark']
      },
      projects: [
        { id: 1, name: 'Real-Time Dynamic Pricing Engine', technology: 'Python, SQL, Tableau', desc: 'Created real-time dynamic pricing model deployed across 45 Indian metro cities, increasing gross margins by 4.8%.' }
      ],
      certificates: [
        { id: 1, name: 'Tableau Desktop Certified Professional', organization: 'Tableau', year: '2022' },
        { id: 2, name: 'Google Certified Data Analyst', organization: 'Google', year: '2020' }
      ],
      languagesList: ['English (Fluent)', 'Hindi (Native)', 'Punjabi (Conversational)'],
      color: '#0284c7',
      font: "'Poppins', sans-serif"
    },
    professional: {
      name: 'Arjun Mehta',
      role: 'Senior Full Stack & Cloud Architect | React & Node.js',
      email: 'arjun.mehta@forgeindiaconnect.com',
      phone: '+91 98201 88776',
      location: 'Hyderabad, Telangana',
      linkedin: 'linkedin.com/in/arjun-mehta-dev',
      github: 'github.com/arjunmehta',
      portfolio: 'arjunmehta.tech',
      summary: 'Senior Full Stack & Cloud Architect with 8+ years building high-concurrency distributed systems, cloud microservices, and modern React interfaces. Experienced in scaling digital platforms to 10M+ daily active users across Indian telecom & fintech sectors.',
      experience: [
        { id: 1, role: 'Senior Cloud Architect', company: 'Reliance Jio Platforms', duration: '2021 - Present', desc: '• Architected resilient 5G core telemetry microservices handling 250k events/second with 99.999% uptime.\n• Decreased cloud computing and egress costs by ₹65 Lakhs annually via containerized Kubernetes auto-scaling.' },
        { id: 2, role: 'Senior Full Stack Engineer', company: 'Infosys Limited', duration: '2017 - 2021', desc: '• Led a 14-member development pod building cloud-native banking portals in React, Node.js, and TypeScript.\n• Optimized API response latency from 420ms to 65ms using Redis clustering and connection pooling.' }
      ],
      education: [
        { id: 1, degree: 'B.Tech in Computer Science & Engineering', school: 'Indian Institute of Technology (IIT) Bombay', department: 'Computer Science', year: '2013 - 2017', cgpa: '9.4 / 10' }
      ],
      skills: {
        programming: ['React.js', 'Node.js', 'TypeScript', 'Go', 'Python', 'Java'],
        frameworks: ['Next.js', 'Express.js', 'GraphQL', 'Docker', 'Kubernetes', 'Microservices'],
        databases: ['PostgreSQL', 'Redis', 'MongoDB', 'AWS', 'Kafka']
      },
      projects: [
        { id: 1, name: 'High-Throughput Payment Orchestrator', technology: 'Kafka, Go, Docker, AWS', desc: 'Engineered sub-millisecond transaction routing system processing ₹250 Cr in digital transactions on peak festival sale days.' }
      ],
      certificates: [
        { id: 1, name: 'AWS Certified Solutions Architect – Professional', organization: 'Amazon Web Services', year: '2023' },
        { id: 2, name: 'Certified Kubernetes Administrator (CKA)', organization: 'Linux Foundation', year: '2022' }
      ],
      languagesList: ['English (Native)', 'Hindi (Fluent)', 'Telugu (Conversational)'],
      color: '#10b981',
      font: "'Inter', sans-serif"
    },
    executive: {
      name: 'Vikramaditya Singhania',
      role: 'Chief Financial Officer (CFO) | M&A & Capital Markets',
      email: 'v.singhania@forgeindiaconnect.com',
      phone: '+91 99100 55443',
      location: 'Mumbai, Maharashtra',
      linkedin: 'linkedin.com/in/vikramaditya-singhania-cfo',
      github: '',
      portfolio: 'singhaniaexecutive.in',
      summary: 'Senior Finance Executive and Chartered Accountant (FCA) with 17+ years leading corporate finance, investor relations, and multi-hundred-crore M&A transactions. Guided top-tier enterprise growth from ₹80 Cr to ₹950 Cr annual revenue.',
      experience: [
        { id: 1, role: 'Chief Financial Officer', company: 'Tata Consumer Products Ltd.', duration: '2019 - Present', desc: '• Managed annual P&L of ₹1,400 Cr with direct oversight of treasury, tax compliance, and statutory audits across 8 global entities.\n• Successfully executed ₹280 Cr cross-border strategic acquisition, delivering 18% post-merger EBITDA accretion.' },
        { id: 2, role: 'VP of Corporate Finance & Strategy', company: 'HDFC Bank Ltd.', duration: '2013 - 2019', desc: '• Spearheaded institutional debt syndicate raising ₹650 Cr at 65 bps below benchmark borrowing rates.\n• Led SEBI and RBI regulatory reporting with immaculate compliance track record across 24 quarters.' }
      ],
      education: [
        { id: 1, degree: 'Post Graduate Diploma in Management (PGDM - Finance)', school: 'Indian Institute of Management (IIM) Ahmedabad', department: 'Finance', year: '2005 - 2007', cgpa: 'Top 5% Merit' }
      ],
      skills: {
        programming: ['Corporate Finance', 'Mergers & Acquisitions (M&A)', 'Treasury & Risk Management', 'Statutory Compliance'],
        frameworks: ['SEBI / RBI Regulations', 'IND-AS & IFRS Reporting', 'Capital Budgeting', 'Investor Relations'],
        databases: ['SAP S/4HANA Finance', 'Oracle Financials', 'Bloomberg Terminal']
      },
      projects: [
        { id: 1, name: 'Strategic Cross-Border Corporate Restructuring', technology: 'M&A Due Diligence, Tax Structuring', desc: 'Directed the complete fiscal restructuring and consolidation of 4 international subsidiaries, reducing corporate tax burden by ₹18 Cr annually.' }
      ],
      certificates: [
        { id: 1, name: 'Fellow Chartered Accountant (FCA)', organization: 'Institute of Chartered Accountants of India (ICAI)', year: '2008' }
      ],
      languagesList: ['English (Fluent)', 'Hindi (Native)', 'Marathi (Fluent)'],
      color: '#000000',
      font: "'Playfair Display', serif"
    },
    creative: {
      name: 'Ananya Iyer',
      role: 'Creative Director | Brand Identity & UI/UX Design',
      email: 'ananya.iyer@forgeindiaconnect.com',
      phone: '+91 97400 33221',
      location: 'Bengaluru, Karnataka',
      linkedin: 'linkedin.com/in/ananya-iyer-creative',
      github: 'github.com/ananyaiyer',
      portfolio: 'ananyaiyer.design',
      summary: 'Visionary Creative Director with 9+ years creating transformative brand visual identities, enterprise UI/UX design systems, and digital campaigns for India’s fastest growing consumer tech brands.',
      experience: [
        { id: 1, role: 'Head of Brand & Design', company: 'Zomato', duration: '2020 - Present', desc: '• Directed 22-member multi-disciplinary team across brand creative, UI/UX, and marketing motion design.\n• Spearheaded viral national festival campaigns achieving 450M+ impressions and 38% bump in active daily orders.' },
        { id: 2, role: 'Lead Product Designer', company: 'Ola Cabs (ANI Technologies)', duration: '2016 - 2020', desc: '• Redesigned flagship consumer rider mobile app, improving checkout completion rate by 29%.\n• Built and documented comprehensive Figma design system adopted by 150+ engineers and product managers.' }
      ],
      education: [
        { id: 1, degree: 'Master of Design (M.Des) in Visual Communication', school: 'National Institute of Design (NID) Ahmedabad', department: 'Visual Design', year: '2012 - 2016', cgpa: '8.8 / 10' }
      ],
      skills: {
        programming: ['Figma', 'Adobe Creative Cloud', 'UI/UX Design', 'Design Systems', 'Brand Strategy'],
        frameworks: ['Design Tokens', 'User Journey Mapping', 'Motion Graphics', 'Micro-interactions'],
        databases: ['Webflow', 'Framer', 'Principle', 'Miro']
      },
      projects: [
        { id: 1, name: 'Omnichannel Design System Architecture', technology: 'Figma, Design Tokens, React', desc: 'Crafted a scalable, accessible Indian regional-language component design system with 2,400+ UI variants serving 12M monthly users.' }
      ],
      certificates: [
        { id: 1, name: 'Certified Usability Analyst (CUA)™', organization: 'Human Factors International (HFI)', year: '2021' }
      ],
      languagesList: ['English (Fluent)', 'Tamil (Native)', 'Hindi (Professional)'],
      color: '#7c3aed',
      font: "'Montserrat', sans-serif"
    },
    minimal: {
      name: 'Aditya Patel',
      role: 'Senior Product Designer | SaaS & Design Systems',
      email: 'aditya.patel@forgeindiaconnect.com',
      phone: '+91 98250 66778',
      location: 'Pune, Maharashtra',
      linkedin: 'linkedin.com/in/aditya-patel-ux',
      github: 'github.com/adityapatel',
      portfolio: 'adityapatel.design',
      summary: 'Minimalist Product Designer with 6+ years specializing in frictionless B2B SaaS workflows, clean typography, and rapid prototyping that elevates product adoption and Net Promoter Scores.',
      experience: [
        { id: 1, role: 'Senior Product Designer', company: 'Zoho Corporation', duration: '2021 - Present', desc: '• Redesigned core analytics suite navigation, driving 44% increase in daily feature adoption.\n• Established unified component library reducing product development sprint cycles by 3 weeks.' },
        { id: 2, role: 'UI/UX Designer', company: 'Freshworks', duration: '2018 - 2021', desc: '• Conducted 150+ user interviews with enterprise clients across India and Southeast Asia.\n• Built wireframes and interactive micro-interaction prototypes that reduced customer onboarding drop-offs by 31%.' }
      ],
      education: [
        { id: 1, degree: 'B.Des in Interaction Design', school: 'Industrial Design Centre (IDC) - IIT Bombay', department: 'Interaction Design', year: '2014 - 2018', cgpa: '8.95 / 10' }
      ],
      skills: {
        programming: ['User Research', 'Figma', 'Wireframing', 'Information Architecture', 'Prototyping'],
        frameworks: ['Usability Testing', 'Interaction Design', 'Design Thinking', 'B2B SaaS Workflows'],
        databases: ['Notion', 'Miro', 'Lottie', 'FigJam']
      },
      projects: [
        { id: 1, name: 'Unified SaaS Analytics Workspace', technology: 'Figma, React Prototyping', desc: 'Streamlined multi-tenant enterprise dashboard into a distraction-free, high-speed single-page workspace.' }
      ],
      certificates: [
        { id: 1, name: 'Interaction Design Specialist', organization: 'Interaction Design Foundation (IxDF)', year: '2020' }
      ],
      languagesList: ['English (Fluent)', 'Gujarati (Native)', 'Hindi (Fluent)'],
      color: '#000000',
      font: "'Lato', sans-serif"
    }
  };

  const handleTemplateChange = (newTemplateId) => {
    const key = (newTemplateId || 'enhancv').toLowerCase();
    const preset = TEMPLATE_PRESETS[key] || TEMPLATE_PRESETS['enhancv'];

    setSelectedColor(preset.color || '#2563eb');
    setSelectedFont(preset.font || "'Inter', sans-serif");
    setTheme(prev => ({
      ...prev,
      fontFamily: preset.font || prev.fontFamily
    }));

    setFormData(prev => ({
      ...prev,
      templateId: newTemplateId,
      department: preset.role,
      personalInfo: {
        ...prev.personalInfo,
        name: preset.name,
        role: preset.role,
        email: preset.email,
        phone: preset.phone,
        location: preset.location,
        linkedin: preset.linkedin,
        github: preset.github,
        portfolio: preset.portfolio,
        summary: preset.summary
      },
      experience: preset.experience,
      education: preset.education,
      skills: preset.skills,
      projects: preset.projects,
      certificates: preset.certificates,
      languagesList: preset.languagesList
    }));
  };

  const layoutKey = (formData.templateId || 'enhancv').toLowerCase();
  const currentPreset = TEMPLATE_PRESETS[layoutKey] || TEMPLATE_PRESETS['enhancv'];

  const templatePreviewData = {
    name: formData.personalInfo?.name || currentPreset.name,
    role: formData.personalInfo?.role || formData.department || currentPreset.role,
    profilePhoto: formData.personalInfo?.profilePhoto || '',
    photoData: formData.personalInfo?.profilePhoto || null,
    contact: {
      email: formData.personalInfo?.email || currentPreset.email,
      phone: formData.personalInfo?.phone || currentPreset.phone,
      location: formData.personalInfo?.location || currentPreset.location,
      linkedin: formData.personalInfo?.linkedin || currentPreset.linkedin,
      github: formData.personalInfo?.github || currentPreset.github,
      portfolio: formData.personalInfo?.portfolio || currentPreset.portfolio
    },
    objective: formData.personalInfo?.summary || currentPreset.summary,
    education: (formData.education && formData.education.length > 0) ? formData.education.map(e => ({
      degree: e.degree || 'Degree',
      institution: e.school || e.institution || 'University',
      department: e.department || '',
      cgpa: e.cgpa || '',
      tenure: e.year || e.tenure || ''
    })) : currentPreset.education.map(e => ({
      degree: e.degree,
      institution: e.school,
      department: e.department || '',
      cgpa: e.cgpa || '',
      tenure: e.year || ''
    })),
    experience: (formData.experience && formData.experience.length > 0) ? formData.experience.map(e => ({
      title: e.role || e.title || 'Role',
      company: e.company || 'Company',
      duration: e.duration || '',
      desc: e.desc || '',
      points: e.desc ? e.desc.split('\n').filter(b => b.trim().length > 0) : []
    })) : currentPreset.experience.map(e => ({
      title: e.role,
      company: e.company,
      duration: e.duration,
      desc: e.desc,
      points: e.desc ? e.desc.split('\n').filter(b => b.trim().length > 0) : []
    })),
    skills: {
      languages: (formData.skills?.programming && formData.skills.programming.length > 0) ? formData.skills.programming.join(', ') : currentPreset.skills.programming.join(', '),
      frameworks: (formData.skills?.frameworks && formData.skills.frameworks.length > 0) ? formData.skills.frameworks.join(', ') : currentPreset.skills.frameworks.join(', '),
      tools: (formData.skills?.databases && formData.skills.databases.length > 0) ? formData.skills.databases.join(', ') : currentPreset.skills.databases.join(', ')
    },
    projects: (formData.projects && formData.projects.length > 0) ? formData.projects.map(p => ({
      title: p.name || p.title || 'Project',
      technology: p.technology || '',
      desc: p.desc || '',
      points: p.desc ? p.desc.split('\n').filter(b => b.trim().length > 0) : [],
      github: p.github || '',
      liveDemo: p.liveDemo || ''
    })) : currentPreset.projects.map(p => ({
      title: p.name,
      technology: p.technology,
      desc: p.desc,
      points: p.desc ? p.desc.split('\n').filter(b => b.trim().length > 0) : [],
      github: p.github || '',
      liveDemo: p.liveDemo || ''
    })),
    training: (formData.certificates && formData.certificates.length > 0 ? formData.certificates : currentPreset.certificates).map(c => ({
      name: c.name || '',
      title: c.name || '',
      org: c.organization || c.org || '',
      organization: c.organization || c.org || '',
      year: c.year || ''
    })),
    certificates: (formData.certificates && formData.certificates.length > 0 ? formData.certificates : currentPreset.certificates).map(c => ({
      name: c.name || '',
      title: c.name || '',
      org: c.organization || c.org || '',
      organization: c.organization || c.org || '',
      year: c.year || ''
    })),
    certifications: (formData.certificates && formData.certificates.length > 0 ? formData.certificates : currentPreset.certificates).map(c => ({
      name: c.name || '',
      title: c.name || '',
      org: c.organization || c.org || '',
      organization: c.organization || c.org || '',
      year: c.year || ''
    })),
    languagesList: (formData.languagesList && formData.languagesList.length > 0) ? formData.languagesList : currentPreset.languagesList,
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: saveStatus?.includes('Error') ? '#ef4444' : '#10b981' }}>
            <Check size={14} /> {saveStatus}
          </div>

          <button 
            onClick={() => setShowJdMatcherModal(true)}
            style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1.5px solid #bfdbfe',
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s'
            }}
          >
            <span>🎯</span> Match with Job (JD)
          </button>

          <button 
            onClick={handleDownload}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.15s'
            }}
          >
            <Download size={15} /> Download PDF
          </button>
        </div>
      </header>

      {/* Progress Stepper */}
      <div className="no-print" style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '0.75rem 2rem', 
        display: 'flex', 
        flexWrap: 'wrap',
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
                    onOpenPolish={(data) => setPolishTarget({ ...data, isProject: false })}
                  />
                )}

                {currentLabel === 'Projects' && (
                  <ProjectsForm 
                    projects={formData.projects} 
                    onAdd={addProject} 
                    onUpdate={updateProject} 
                    onDelete={deleteProject} 
                    onRunAi={runAiAssistant}
                    onOpenPolish={(data) => setPolishTarget({ ...data, isProject: true })}
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
            onChangeTemplate={handleTemplateChange}
            selectedFont={selectedFont}
            onChangeFont={(f) => {
              setSelectedFont(f);
              setTheme(prev => ({ ...prev, fontFamily: f }));
            }}
            fontSize={theme.fontSize || 13}
            onChangeFontSize={(size) => {
              setTheme(prev => ({ ...prev, fontSize: size }));
            }}
            zoomLevel={zoomLevel}
            onChangeZoom={setZoomLevel}
            isPremiumUser={user?.subscription === 'Premium'}
            onDownloadAction={handleDownload}
            onFitToOnePage={handleFitToOnePage}
            isOnePageActive={isOnePageActive}
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
                marginBottom: '4rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {renderLayout()}
              <ResumeFooter />
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
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {renderLayout()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DownloadWorkflowModal
        isOpen={showDownloadWorkflowModal}
        onClose={() => setShowDownloadWorkflowModal(false)}
        formData={formData}
        atsScore={getAtsScore()}
        onEdit={() => setShowDownloadWorkflowModal(false)}
        onNavigateHome={() => navigate('/')}
      />

      {/* (Old download modal removed - using DownloadWorkflowModal instead) */}

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

      {/* Job Description (JD) Keyword Matcher Modal */}
      <JobDescriptionMatcherModal
        isOpen={showJdMatcherModal}
        onClose={() => setShowJdMatcherModal(false)}
        formData={formData}
        onUpdateSkills={(skillName) => {
          setFormData(prev => ({
            ...prev,
            skills: {
              ...prev.skills,
              programming: Array.from(new Set([...(prev.skills?.programming || []), skillName]))
            }
          }));
          setSaveStatus(`Added "${skillName}" to Skills ✔`);
          setTimeout(() => setSaveStatus('Auto Saved ✔'), 2500);
        }}
      />

      {/* AI Bullet Point Polish Magic Wand Modal */}
      <AiBulletPolishModal
        isOpen={Boolean(polishTarget)}
        onClose={() => setPolishTarget(null)}
        currentText={polishTarget?.text || ''}
        role={polishTarget?.role || formData.personalInfo?.role || formData.department || 'Senior Professional'}
        company={polishTarget?.company || 'Company'}
        onApply={(polishedText) => {
          if (!polishTarget) return;
          if (polishTarget.isProject) {
            setFormData(prev => ({
              ...prev,
              projects: prev.projects.map(p =>
                p.id === polishTarget.id ? { ...p, desc: polishedText } : p
              )
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              experience: prev.experience.map(e =>
                e.id === polishTarget.id ? { ...e, desc: polishedText } : e
              )
            }));
          }
          setSaveStatus('AI Polished & Saved ✔');
          setTimeout(() => setSaveStatus('Auto Saved ✔'), 2500);
        }}
      />
    </div>
  );
};

export default SplitBuilderView;
