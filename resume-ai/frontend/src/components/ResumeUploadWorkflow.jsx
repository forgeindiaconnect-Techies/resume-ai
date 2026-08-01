import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Sparkles,
  Download,
  Layout as LayoutIcon,
  Globe,
  FileCheck,
  Zap,
  Info,
  Check
} from 'lucide-react';
import ModernResumeTemplate from './ModernResumeTemplate';
import ForgeLogo from './ForgeLogo';

const ResumeUploadWorkflow = ({ isOpen, onClose, onComplete, user, onUpgradeRedirect }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('Modern');
  const [activeTab, setActiveTab] = useState('All templates');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [additionalInfoStep, setAdditionalInfoStep] = useState(1);

  const handleDownload = () => {
    if (user?.subscription !== 'Premium') {
      if (onUpgradeRedirect) {
        onUpgradeRedirect({
          type: 'upload',
          analysisResults,
          formData,
          fileName: uploadedFile?.name || 'Resume.docx'
        });
      }
      return;
    }
    const { personal, experience, education, skills, summary } = formData;
    const fullName = `${personal.firstName} ${personal.lastName}`;
    
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${fullName} - Resume</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40pt; }
          .header { border-bottom: 2pt solid #6366f1; padding-bottom: 10pt; margin-bottom: 20pt; }
          .name { font-size: 26pt; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 0; }
          .title { font-size: 14pt; color: #6366f1; font-weight: 700; margin-top: 5pt; }
          .contact { font-size: 10pt; color: #64748b; margin-top: 5pt; }
          h2 { font-size: 14pt; font-weight: 800; color: #0f172a; text-transform: uppercase; border-bottom: 1pt solid #e2e8f0; padding-bottom: 5pt; margin-top: 25pt; margin-bottom: 10pt; }
          .section { margin-bottom: 15pt; }
          .item-header { display: flex; justify-content: space-between; font-weight: 800; font-size: 11pt; color: #0f172a; }
          .company { color: #6366f1; font-weight: 700; font-size: 10.5pt; margin-bottom: 3pt; }
          .date { color: #94a3b8; font-size: 9pt; }
          .desc { font-size: 10pt; color: #475569; margin-top: 5pt; }
          .skills-box { background: #f8fafc; padding: 10pt; border-radius: 6pt; border: 1pt solid #e2e8f0; }
          .skill-tag { display: inline-block; padding: 3pt 8pt; background: #eef2ff; color: #4f46e5; border-radius: 4pt; font-size: 9pt; font-weight: 700; margin-right: 5pt; margin-bottom: 5pt; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${fullName}</div>
          <div class="title">${personal.jobTitle || 'Professional'}</div>
          <div class="contact">
            ${personal.email} | ${personal.phone} | ${personal.city}, ${personal.country}
          </div>
        </div>

        ${summary ? `
          <div class="section">
            <h2>Professional Summary</h2>
            <p class="desc">${summary}</p>
          </div>
        ` : ''}

        ${experience.length > 0 ? `
          <div class="section">
            <h2>Work Experience</h2>
            ${experience.map(exp => `
              <div style="margin-bottom: 15pt;">
                <div class="item-header">
                  <span>${exp.position}</span>
                  <span class="date">${exp.duration}</span>
                </div>
                <div class="company">${exp.company}</div>
                <div class="desc">${exp.description}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${education.length > 0 ? `
          <div class="section">
            <h2>Education</h2>
            ${education.map(edu => `
              <div style="margin-bottom: 10pt;">
                <div class="item-header">
                  <span>${edu.degree}</span>
                  <span class="date">${edu.year}</span>
                </div>
                <div class="desc">${edu.school}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="section">
            <h2>Technical Expertise</h2>
            <div class="skills-box">
              ${skills.map(s => `<span class="skill-tag">${s}</span>`).join(' ')}
            </div>
          </div>
        ` : ''}
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_${fullName.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      jobTitle: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      drivingLicense: '',
      nationality: '',
      placeOfBirth: '',
      dateOfBirth: ''
    },
    experience: [],
    education: [],
    skills: [],
    summary: ''
  });
  const [analysisResults, setAnalysisResults] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setShowAdditionalInfo(false);
      setAdditionalInfoStep(1);
      setFormData({
        personal: {
          firstName: '',
          lastName: '',
          jobTitle: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          postalCode: '',
          country: '',
          drivingLicense: '',
          nationality: '',
          placeOfBirth: '',
          dateOfBirth: ''
        },
        experience: [],
        education: [],
        skills: [],
        summary: ''
      });
    }
  }, [isOpen]);

  // Step 2: Uploading Progress Simulation
  useEffect(() => {
    if (isOpen && step === 2) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(3), 500); // Small pause at 100%
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isOpen, step]);

  // Step 3 Real Analysis: Processing (starts after upload is done)
  useEffect(() => {
    const runAnalysis = async () => {
      if (isOpen && step === 3 && uploadedFile) {
        try {
          const apiFormData = new FormData();
          apiFormData.append('resume', uploadedFile);
          apiFormData.append('role', 'General');
          
            const response = await fetch('/api/analyze', {
              method: 'POST',
              body: apiFormData,
            });

            if (response.ok) {
              const data = await response.json();
              setAnalysisResults(data);
              console.log('Analysis and Auto-Sync complete');
            
              // Auto-populate formData if AI found names/details (Existing logic)
              if (data.extractedText) {
                const lines = data.extractedText.split('\n').filter(l => l.trim().length > 0);
                if (lines.length > 0) {
                  const nameParts = lines[0].split(' ');
                  setFormData(prev => ({
                    ...prev,
                    personal: {
                      ...prev.personal,
                      firstName: nameParts[0] || prev.personal.firstName,
                      lastName: nameParts.slice(1).join(' ') || prev.personal.lastName,
                      email: data.extractedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || prev.personal.email
                    }
                  }));
                }
              }

              setStep(4);
            } else {
              throw new Error('Analysis failed');
            }
        } catch (error) {
          console.error('Workflow analysis error:', error);
          // Fallback to success anyway for demo, but log error
          setStep(4);
        }
      }
    };

    runAnalysis();
  }, [isOpen, step, uploadedFile]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsUploading(true);
      // Short delay for visual feedback before processing
      setTimeout(() => {
        setStep(2);
        setIsUploading(false);
      }, 800);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const templates = [
    { name: 'Vienna', tag: 'Modern', description: 'Sleek sidebar layout with premium typography', colors: ['#3b82f6', '#10b981', '#f59e0b'], image: '/templates/vienna.png' },
    { name: 'Sydney', tag: 'ATS', description: 'Maximum readability for tracking systems', colors: ['#64748b', '#0f172a', '#3b82f6'], image: '/templates/sydney.png' },
    { name: 'Berlin', tag: 'Creative', description: 'Bold artistic design for visual storytellers', colors: ['#ef4444', '#ec4899', '#8b5cf6'], image: '/templates/berlin.png' },
    { name: 'Tokyo', tag: 'Professional', description: 'Minimalist executive structure with refined spacing', colors: ['#1e293b', '#64748b', '#94a3b8'], image: '/templates/tokyo.png' },
    { name: 'London', tag: 'Classic', description: 'Traditional academic and corporate excellence', colors: ['#0f172a', '#1e293b', '#3b82f6'], image: '/templates/london.png' },
    { name: 'Dublin', tag: 'Modern', description: 'Contemporary layout with dynamic accents', colors: ['#10b981', '#059669', '#34d399'], image: '/templates/dublin.png' },
    { name: 'Amsterdam', tag: 'One column', description: 'Single-column clarity with bold impact', colors: ['#f59e0b', '#d97706', '#fbbf24'], image: '/templates/amsterdam.png' },
    { name: 'Lisbon', tag: 'Creative', description: 'Fluid design elements for modern thinkers', colors: ['#8b5cf6', '#7c3aed', '#a78bfa'], image: '/templates/lisbon.png' },
    { name: 'Madrid', tag: 'Professional', description: 'Refined management-focused structure', colors: ['#0f172a', '#1e293b', '#475569'], image: '/templates/madrid.png' },
    { name: 'Melbourne', tag: 'ATS', description: 'Clean, parse-optimized professional format', colors: ['#334155', '#475569', '#94a3b8'], image: '/templates/melbourne.png' }
  ];

  const tabs = ['All templates', 'ATS', 'Modern', 'Professional', 'Creative', 'One column', 'Classic'];

  const renderTemplateMockup = (t) => {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '12px' }}>
        <img 
          src={t.image} 
          alt={t.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'scale(1.02)'
          }}
          className="template-preview-image"
        />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none'
        }} />
      </div>
    );
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  const RenderStepper = () => {
    const steps = step < 6 ? [
      { id: 1, label: 'Upload & Scan' },
      { id: 5, label: 'Choose template' },
      { id: 6, label: 'Finalize & Download' }
    ] : [
      { id: 6, label: 'Contacts' },
      { id: 7, label: 'Experience' },
      { id: 8, label: 'Education' },
      { id: 9, label: 'Skills' },
      { id: 10, label: 'Summary' },
      { id: 11, label: 'Finalize' }
    ];

    const currentIdx = step < 6 
      ? (step <= 3 ? 0 : step === 5 ? 1 : 2)
      : (step - 6);

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '12px', 
        marginBottom: '3rem', 
        width: '100%',
        paddingTop: '1rem'
      }}>
        {steps.map((s, i) => {
          const isActive = i === currentIdx;
          const isDone = i < currentIdx;
          
          return (
            <React.Fragment key={s.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: isActive ? '#00A3FF' : isDone ? '#00A3FF' : 'transparent',
                  border: isActive || isDone ? 'none' : '2px solid #cbd5e1',
                  color: isActive || isDone ? 'white' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  boxShadow: isActive ? '0 0 15px rgba(0, 163, 255, 0.4)' : 'none'
                }}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: isActive ? 800 : 600, 
                  color: isActive ? '#00A3FF' : '#64748b' 
                }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: '40px', height: '2px', background: i < currentIdx ? '#00A3FF' : '#cbd5e1', borderRadius: '1px' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 10002, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'rgba(5, 10, 25, 0.7)', 
      backdropFilter: 'blur(12px)' 
    }}>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          width: [5, 6].includes(step) ? '1100px' : step === 1 ? '600px' : '760px',
          height: [5, 6].includes(step) ? '780px' : 'auto',
          minHeight: step === 1 ? '500px' : '500px',
          maxHeight: '92vh',
          background: step >= 5 ? '#ffffff' : 'var(--bg-card)',
          borderRadius: '32px',
          border: '1px solid var(--border)',
          boxShadow: '0 50px 100px rgba(0,0,0,0.4)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          margin: '2rem'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="close-btn"
          aria-label="Close modal"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* Scrollable Container Wrapper */}
        <div style={{ 
          width: '100%', 
          height: '100%', 
          overflowY: 'auto', 
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>

        {/* STEPPER ADDED HERE */}
        {step >= 1 && <RenderStepper />}

        <AnimatePresence mode="wait">
          {/* STEP 1: UPLOAD FILE (NEW) */}
          {step === 1 && (
            <motion.div 
              key="step1" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ padding: '4.5rem 3rem', textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ 
                  width: '80px', height: '80px', background: 'var(--primary-glow)', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', margin: '0 auto 1.5rem',
                  color: 'var(--primary)', boxShadow: '0 0 30px var(--primary-glow)'
                }}>
                  <Download size={36} />
                </div>
                <h2 style={{ fontSize: '2.8rem', fontWeight: 950, marginBottom: '0.75rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Upload your resume</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 500 }}>
                  Select or drag a file to start the AI analysis
                </p>
              </div>

              <label style={{ 
                width: '100%', maxWidth: '480px',
                border: '2px dashed var(--border)', borderRadius: '24px', 
                padding: '4rem 2rem', cursor: 'pointer', transition: 'all 0.3s',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }} className="upload-box-glass">
                <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".pdf,.docx,.doc" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <Zap size={24} />
                   </div>
                   <div style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '1.2rem' }}>
                      {uploadedFile ? uploadedFile.name : "Click to browse or drag and drop"}
                   </div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                      Maximum file size: 10MB (PDF, DOCX)
                   </div>
              </div>
              </label>
            </motion.div>
          )}

          {/* STEP 2: UPLOADING (NEW) */}
          {step === 2 && (
            <motion.div 
              key="step2" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ padding: '6rem 3rem', textAlign: 'center' }}
            >
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2.5rem', color: 'var(--primary)' }}>
                <Download size={48} />
                <motion.div 
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ duration: 1, repeat: Infinity }}
                   style={{ position: 'absolute', top: -10, right: -10 }}
                >
                   <Sparkles size={20} />
                </motion.div>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Uploading {uploadedFile?.name}...
              </h2>
              
              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                   <motion.div 
                     initial={{ width: '0%' }}
                     animate={{ width: `${uploadProgress}%` }}
                     style={{ height: '100%', background: 'var(--grad-main)', borderRadius: '10px' }}
                   />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
                   <span>TRANSFERRING DATA</span>
                   <span>{uploadProgress}%</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PROCESSING (FORMERLY STEP 2) */}
          {step === 3 && (
            <motion.div 
              key="step3" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ padding: '6rem 3rem', textAlign: 'center' }}
            >
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2.5rem' }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <motion.circle 
                    cx="40" cy="40" r="36" fill="none" 
                    stroke="var(--primary)" strokeWidth="4" 
                    strokeDasharray="226"
                    initial={{ strokeDashoffset: 226 }}
                    animate={{ strokeDashoffset: [226, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-main)' }}>Analyzing {uploadedFile?.name || 'Resume'}...</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                Please wait while our artificial intelligence processes the information from your resume and selects the right fields
              </p>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS (FORMERLY STEP 3) */}
          {step === 4 && (
            <motion.div 
              key="step4" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ padding: '0 0 4rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column' }}
            >
               <div style={{ 
                 height: '240px', background: 'linear-gradient(180deg, rgba(0, 102, 204, 0.1) 0%, transparent 100%)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
               }}>
                 <div style={{ position: 'relative' }}>
                    <div style={{ width: '120px', height: '160px', borderRadius: '12px', background: 'white', opacity: 0.1, transform: 'rotate(-5deg) translateX(-20px)' }} />
                    <div style={{ width: '120px', height: '160px', borderRadius: '12px', background: 'white', position: 'absolute', top: 0, left: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Check size={30} />
                       </div>
                    </div>
                 </div>
                 {/* Sparkles */}
                 <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', top: '40%', right: '35%' }}><Sparkles size={24} color="var(--primary)"/></motion.div>
                 <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} style={{ position: 'absolute', bottom: '30%', left: '35%' }}><Sparkles size={20} color="var(--primary)"/></motion.div>
               </div>
               
               <div style={{ padding: '0 3rem' }}>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Resume uploaded successfully</h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '2.5rem' }}>
                   Edit and improve your resume with our AI-powered builder.
                 </p>
                 <button 
                  onClick={() => setStep(5)}
                  className="glass-btn btn-primary"
                  style={{ padding: '1rem 4rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '16px' }}
                 >
                   Start Editing
                 </button>
               </div>
            </motion.div>
          )}

          {/* STEP 5: TEMPLATE SELECTION (FORMERLY STEP 4) */}
          {step === 5 && (
            <motion.div 
               key="step5"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: -20, x: -20 }}
               style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
             >
               {/* Fixed/Sticky Header Container */}
               <div style={{ 
                 position: 'sticky', 
                 top: '-2.1rem', 
                 zIndex: 100, 
                 background: 'rgba(23, 23, 23, 0.7)', 
                 backdropFilter: 'blur(15px)', 
                 padding: '2.5rem 0 1.5rem', 
                 margin: '0 -3rem 2rem', 
                 borderBottom: '1px solid var(--border)',
                 maskImage: 'linear-gradient(to bottom, black 85%, transparent)'
               }}>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Choose Your Template</h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', fontWeight: 600 }}>Select the visual style that best represents your professional brand.</p>

                 <div style={{ 
                   display: 'flex', 
                   justifyContent: 'center', 
                   gap: '0.35rem', 
                   flexWrap: 'nowrap',
                   background: 'rgba(255,255,255,0.03)',
                   padding: '0.5rem',
                   borderRadius: '24px',
                   width: 'max-content',
                   margin: '0 auto',
                   border: '1px solid var(--border)',
                   backdropFilter: 'blur(10px)',
                   boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                   overflowX: 'auto'
                 }}>
                   {tabs.map(tab => (
                     <motion.button 
                       key={tab}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setActiveTab(tab)}
                       style={{ 
                         padding: '0.65rem 1.25rem', borderRadius: '18px', border: 'none',
                         background: activeTab === tab ? 'var(--primary)' : 'transparent',
                         color: activeTab === tab ? 'white' : 'var(--text-muted)',
                         fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer',
                         display: 'flex', alignItems: 'center', gap: '0.5rem',
                         whiteSpace: 'nowrap',
                         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                         boxShadow: activeTab === tab ? '0 10px 20px var(--primary-glow)' : 'none',
                         border: activeTab === tab ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent'
                       }}
                     >
                       {tab === 'All templates' && <LayoutIcon size={16} />}
                       {tab === 'ATS' && <FileCheck size={16} />}
                       {tab === 'Modern' && <Sparkles size={16} />}
                       {tab === 'Professional' && <Zap size={16} />}
                       {tab === 'Creative' && <Globe size={16} />}
                       {tab === 'One column' && <LayoutIcon size={16} />}
                       {tab === 'Classic' && <Info size={16} />}
                       {tab}
                     </motion.button>
                   ))}
                 </div>
               </div>

              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem', padding: '0 2rem 4rem' }}
              >
                {templates.filter(t => activeTab === 'All templates' || t.tag === activeTab).map(t => (
                  <motion.div 
                    key={t.name}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                    whileHover={{ y: -15, scale: 1.02 }}
                    onClick={() => { setSelectedTemplate(t.name); }}
                    style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      borderRadius: '32px', 
                      border: selectedTemplate === t.name ? '3px solid var(--primary)' : '1px solid var(--border)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'border 0.3s, box-shadow 0.3s',
                      textAlign: 'left',
                      boxShadow: selectedTemplate === t.name ? '0 20px 40px var(--primary-glow)' : 'none'
                    }}
                    className="template-card-premium"
                  >
                    <div style={{ 
                      height: '320px', 
                      borderRadius: '24px', marginBottom: '1.5rem', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', position: 'relative',
                      background: 'linear-gradient(225deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {/* Resume Preview Image */}
                        {renderTemplateMockup(t)}
                       {/* Selected Overlay */}
                       {selectedTemplate === t.name && (
                         <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           style={{ position: 'absolute', inset: 0, background: 'rgba(0, 163, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
                         >
                            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '14px', fontWeight: 900, fontSize: '0.9rem', boxShadow: '0 10px 20px rgba(0, 163, 255, 0.4)' }}>SELECTED</div>
                         </motion.div>
                       )}
                    </div>

                    <div style={{ padding: '0 0.5rem 1rem' }}>
                      <h4 style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.3rem', marginBottom: '0.4rem' }}>{t.name}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.5 }}>{t.description}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                       <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {t.colors.map(c => (
                            <div key={c} style={{ width: '16px', height: '16px', borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                          ))}
                       </div>
                       <div style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {t.tag}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {selectedTemplate && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', paddingBottom: '3rem' }}
                >
                  <button 
                    onClick={() => setStep(6)}
                    className="glass-btn btn-primary"
                    style={{ padding: '1.25rem 4rem', fontSize: '1.1rem', fontWeight: 950, borderRadius: '20px', boxShadow: '0 15px 30px var(--primary-glow)' }}
                  >
                    PROCEED TO EDITOR <ChevronRight size={20} style={{ marginLeft: '10px' }} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 6: EDITING & PREVIEW (FORMERLY STEP 5) */}
          {step === 6 && (
            <motion.div 
              key="step6" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
            >
              {/* Left Column: Form */}
              <div style={{ flex: 0.6, padding: '3.5rem', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-main)' }}>Contacts</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, marginBottom: '2.5rem', lineHeight: 1.5 }}>
                  Add your up-to-date contact information so employers and recruiters can easily reach you.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>First name</label>
                    <input 
                      name="firstName" 
                      value={formData?.personal?.firstName || ''} 
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                    />
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Last name</label>
                    <input 
                      name="lastName" 
                      value={formData?.personal?.lastName || ''} 
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Desired job title</label>
                  <input 
                    name="jobTitle" 
                    value={formData?.personal?.jobTitle || ''} 
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Phone</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <div style={{ padding: '0 1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
                          <span>🇮🇳</span> <ChevronDown size={14} /> +91
                       </div>
                       <input 
                        name="phone" 
                        value={formData?.personal?.phone?.replace('+91 ', '') || ''} 
                        onChange={(e) => setFormData(p => ({ ...p, personal: { ...p.personal, phone: '+91 ' + e.target.value } }))}
                        style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                       />
                    </div>
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Email</label>
                    <input 
                      name="email" 
                      value={formData?.personal?.email || ''} 
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} 
                    />
                  </div>
                </div>

                <div 
                  onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', marginBottom: showAdditionalInfo ? '1.5rem' : '4rem' }}
                >
                  Additional information <motion.div animate={{ rotate: showAdditionalInfo ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={18} /></motion.div>
                </div>

                <AnimatePresence>
                  {showAdditionalInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      style={{ overflow: 'hidden', marginBottom: '3rem', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}
                    >
                      {/* Sub-step Indicator */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', justifyContent: 'center' }}>
                        {[1, 2, 3].map(s => (
                          <div key={s} style={{ width: s === additionalInfoStep ? '30px' : '10px', height: '6px', borderRadius: '3px', background: s === additionalInfoStep ? 'var(--primary)' : 'rgba(0,0,0,0.1)', transition: 'all 0.3s' }} />
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {additionalInfoStep === 1 && (
                          <motion.div 
                            key="sub1" 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>Step 1: Location Details</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                              <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Address</label>
                                <input name="address" value={formData.personal.address} onChange={handleInputChange} placeholder="e.g. 123 Main St" style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} />
                              </div>
                              <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>City</label>
                                <input name="city" value={formData.personal.city} onChange={handleInputChange} placeholder="e.g. Chennai" style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                              <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Postal Code</label>
                                <input name="postalCode" value={formData.personal.postalCode} onChange={handleInputChange} placeholder="e.g. 600001" style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} />
                              </div>
                              <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Country</label>
                                <input name="country" value={formData.personal.country} onChange={handleInputChange} placeholder="e.g. India" style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {additionalInfoStep === 2 && (
                          <motion.div 
                            key="sub2" 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>Step 2: Identification</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                              <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Driving License</label>
                                <input name="drivingLicense" value={formData.personal.drivingLicense} onChange={handleInputChange} placeholder="if applicable" style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} />
                              </div>
                              <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Nationality</label>
                                <input name="nationality" value={formData.personal.nationality} onChange={handleInputChange} placeholder="e.g. Indian" style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {additionalInfoStep === 3 && (
                          <motion.div 
                            key="sub3" 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>Step 3: Personal Details</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                              <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Place of Birth</label>
                                <input name="placeOfBirth" value={formData.personal.placeOfBirth} onChange={handleInputChange} placeholder="e.g. Chennai" style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} />
                              </div>
                              <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Date of Birth</label>
                                <input name="dateOfBirth" type="date" value={formData.personal.dateOfBirth} onChange={handleInputChange} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', fontWeight: 600 }} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Sub-navigation Controls */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <button 
                          style={{ 
                            background: 'transparent', 
                            border: '1px solid var(--border)', 
                            color: 'var(--text-main)', 
                            padding: '0.75rem 1.5rem', 
                            borderRadius: '12px', 
                            fontSize: '0.85rem', 
                            fontWeight: 800, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            visibility: additionalInfoStep === 1 ? 'hidden' : 'visible' 
                          }}
                          onClick={() => setAdditionalInfoStep(prev => prev - 1)}
                        >
                          <ChevronLeft size={16} /> BACK
                        </button>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button 
                            className="glass-btn btn-primary"
                            style={{ 
                              padding: '0.75rem 2rem', 
                              borderRadius: '12px', 
                              fontSize: '0.85rem', 
                              fontWeight: 900,
                              minWidth: '100px'
                            }}
                            onClick={() => {
                              if (additionalInfoStep < 3) {
                                setAdditionalInfoStep(prev => prev + 1);
                              } else {
                                setShowAdditionalInfo(false);
                              }
                            }}
                          >
                            {additionalInfoStep === 3 ? 'FINISH' : 'NEXT'} {additionalInfoStep < 3 && <ChevronRight size={16} style={{marginLeft: '4px'}} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showAdditionalInfo && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => setStep(7)}
                      className="glass-btn btn-primary"
                      style={{ padding: '1rem 3rem', fontSize: '1rem', fontWeight: 900, borderRadius: '16px' }}
                    >
                      Next: Experience <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                    </button>
                  </div>
                )}
              </div>

              <ResumePreview formData={formData} />
            </motion.div>
          )}

          {/* STEP 7: EXPERIENCE */}
          {step === 7 && (
            <motion.div key="step7" variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 0.6, padding: '3.5rem', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>Experience</h2>
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, experience: [...prev.experience, { company: '', position: '', duration: '', description: '' }] }))}
                    style={{ padding: '0.5rem 1rem', background: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: '10px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    + Add Experience
                  </button>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>List your work history, starting with your most recent role.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {formData.experience.map((exp, index) => (
                    <div key={index} style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                      <button 
                        onClick={() => setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }))}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <X size={18} />
                      </button>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="input-group">
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Company</label>
                          <input 
                            value={exp.company} 
                            onChange={(e) => {
                              const newExp = [...formData.experience];
                              newExp[index].company = e.target.value;
                              setFormData(prev => ({ ...prev, experience: newExp }));
                            }}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', fontSize: '0.9rem' }} 
                          />
                        </div>
                        <div className="input-group">
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Position</label>
                          <input 
                            value={exp.position} 
                            onChange={(e) => {
                              const newExp = [...formData.experience];
                              newExp[index].position = e.target.value;
                              setFormData(prev => ({ ...prev, experience: newExp }));
                            }}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', fontSize: '0.9rem' }} 
                          />
                        </div>
                      </div>
                      <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Duration (e.g. 2020 - Present)</label>
                        <input 
                          value={exp.duration} 
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[index].duration = e.target.value;
                            setFormData(prev => ({ ...prev, experience: newExp }));
                          }}
                          style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', fontSize: '0.9rem' }} 
                        />
                      </div>
                      <div className="input-group">
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Description</label>
                        <textarea 
                          value={exp.description} 
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[index].description = e.target.value;
                            setFormData(prev => ({ ...prev, experience: newExp }));
                          }}
                          rows={3}
                          style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', fontSize: '0.9rem', resize: 'none' }} 
                        />
                      </div>
                    </div>
                  ))}
                  {formData.experience.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '24px', color: 'var(--text-muted)' }}>
                      No experience added yet. Click the button above to add your work history.
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
                  <button onClick={() => setStep(6)} style={{ padding: '1rem 2rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '16px', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}>Back</button>
                  <button onClick={() => setStep(8)} className="glass-btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1rem', fontWeight: 900, borderRadius: '16px' }}>Next: Education</button>
                </div>
              </div>
              <ResumePreview formData={formData} />
            </motion.div>
          )}

          {/* STEP 8: EDUCATION */}
          {step === 8 && (
            <motion.div key="step8" variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 0.6, padding: '3.5rem', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>Education</h2>
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, education: [...prev.education, { school: '', degree: '', year: '' }] }))}
                    style={{ padding: '0.5rem 1rem', background: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: '10px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    + Add Education
                  </button>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Add your educational background and qualifications.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {formData.education.map((edu, index) => (
                    <div key={index} style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                      <button 
                        onClick={() => setFormData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }))}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <X size={18} />
                      </button>
                      <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>School / University</label>
                        <input 
                          value={edu.school} 
                          onChange={(e) => {
                            const newEdu = [...formData.education];
                            newEdu[index].school = e.target.value;
                            setFormData(prev => ({ ...prev, education: newEdu }));
                          }}
                          style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', fontSize: '0.9rem' }} 
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="input-group">
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Degree / Field of Study</label>
                          <input 
                            value={edu.degree} 
                            onChange={(e) => {
                              const newEdu = [...formData.education];
                              newEdu[index].degree = e.target.value;
                              setFormData(prev => ({ ...prev, education: newEdu }));
                            }}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', fontSize: '0.9rem' }} 
                          />
                        </div>
                        <div className="input-group">
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Graduation Year</label>
                          <input 
                            value={edu.year} 
                            onChange={(e) => {
                              const newEdu = [...formData.education];
                              newEdu[index].year = e.target.value;
                              setFormData(prev => ({ ...prev, education: newEdu }));
                            }}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', fontSize: '0.9rem' }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
                  <button onClick={() => setStep(7)} style={{ padding: '1rem 2rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '16px', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}>Back</button>
                  <button onClick={() => setStep(9)} className="glass-btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1rem', fontWeight: 900, borderRadius: '16px' }}>Next: Skills</button>
                </div>
              </div>
              <ResumePreview formData={formData} />
            </motion.div>
          )}

          {/* STEP 9: SKILLS */}
          {step === 9 && (
            <motion.div key="step9" variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 0.6, padding: '3.5rem', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>Skills</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Add relevant skills to showcase your expertise.</p>
                
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input 
                      id="skill-input"
                      placeholder="e.g. React.js" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          setFormData(prev => ({ ...prev, skills: [...prev.skills, e.target.value.trim()] }));
                          e.target.value = '';
                        }
                      }}
                      style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} 
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('skill-input');
                        if (input.value.trim()) {
                          setFormData(prev => ({ ...prev, skills: [...prev.skills, input.value.trim()] }));
                          input.value = '';
                        }
                      }}
                      className="glass-btn btn-primary" 
                      style={{ padding: '0 2rem', borderRadius: '14px' }}
                    >
                      Add
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {formData.skills.map((skill, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ padding: '0.6rem 1.2rem', background: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: '12px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                      >
                        {skill}
                        <X size={14} style={{ cursor: 'pointer' }} onClick={() => setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
                  <button onClick={() => setStep(8)} style={{ padding: '1rem 2rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '16px', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}>Back</button>
                  <button onClick={() => setStep(10)} className="glass-btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1rem', fontWeight: 900, borderRadius: '16px' }}>Next: Summary</button>
                </div>
              </div>
              <ResumePreview formData={formData} />
            </motion.div>
          )}

          {/* STEP 10: SUMMARY */}
          {step === 10 && (
            <motion.div key="step10" variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 0.6, padding: '3.5rem', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>Summary</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Write a short professional summary to grab the recruiter's attention.</p>
                
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                    Professional Summary
                    <span style={{ color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setFormData(prev => ({ ...prev, summary: analysisResults?.objective || prev.summary }))}>
                      <Sparkles size={14} /> Use AI Suggestion
                    </span>
                  </label>
                  <textarea 
                    value={formData.summary} 
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="e.g. Experienced Frontend Developer with a strong background in React..."
                    rows={8}
                    style={{ width: '100%', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.6, outline: 'none', resize: 'none' }} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
                  <button onClick={() => setStep(9)} style={{ padding: '1rem 2rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '16px', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}>Back</button>
                  <button onClick={() => setStep(11)} className="glass-btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1rem', fontWeight: 900, borderRadius: '16px' }}>Next: Finalize</button>
                </div>
              </div>
              <ResumePreview formData={formData} />
            </motion.div>
          )}

          {/* STEP 11: FINALIZE */}
          {step === 11 && (
            <motion.div 
              key="step11" 
              variants={stepVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              style={{ padding: '0 0 4rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column' }}
            >
               <div style={{ 
                 height: '240px', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
               }}>
                 <div style={{ position: 'relative' }}>
                    <div style={{ width: '120px', height: '160px', borderRadius: '12px', background: 'white', opacity: 0.1, transform: 'rotate(-5deg) translateX(-20px)' }} />
                    <div style={{ width: '120px', height: '160px', borderRadius: '12px', background: 'white', position: 'absolute', top: 0, left: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Check size={30} />
                       </div>
                    </div>
                 </div>
                 <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', top: '40%', right: '35%' }}><Sparkles size={24} color="#10b981"/></motion.div>
                 <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} style={{ position: 'absolute', bottom: '30%', left: '35%' }}><Sparkles size={20} color="#10b981"/></motion.div>
               </div>
               
               <div style={{ padding: '0 3rem' }}>
                 <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Your resume is ready!</h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '2.5rem' }}>
                   You've completed all the steps. You can now download your recruiter-ready resume.
                 </p>
                 <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <button 
                      onClick={() => setStep(10)} 
                      style={{ padding: '1rem 2rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '16px', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => { 
                        handleDownload();
                        onComplete({ 
                          formData, 
                          analysisResults, 
                          fileName: uploadedFile?.name 
                        }); 
                        onClose(); 
                        setStep(1); 
                        setUploadedFile(null); 
                        setAnalysisResults(null);
                      }}
                      className="glass-btn btn-primary"
                      style={{ padding: '1rem 4rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '16px' }}
                    >
                      Finish & Download
                    </button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// Internal Preview Component
const ResumePreview = ({ formData }) => (
  <div style={{ flex: 0.4, background: 'rgba(255,255,255,0.015)', padding: '2.5rem', overflow: 'hidden', position: 'relative' }}>
    <div style={{ 
      position: 'absolute', top: '24px', left: '24px', zIndex: 5,
      padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', 
      border: '1px solid var(--border)', borderRadius: '12px',
      display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', fontWeight: 800
    }}>
      <div style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>PRO</div>
      Live Preview <Sparkles size={14} color="#f59e0b" />
    </div>

    <div style={{ background: 'white', height: '100%', borderRadius: '8px', padding: '2rem', color: '#1e293b', overflowY: 'auto' }}>
      <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>{formData.personal.firstName} {formData.personal.lastName}</h1>
        <p style={{ color: 'var(--primary)', fontWeight: 700, margin: '0.25rem 0' }}>{formData.personal.jobTitle || 'Professional'}</p>
        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '1rem' }}>
          <span>{formData.personal.email}</span>
          <span>{formData.personal.phone}</span>
        </div>
      </div>

      {formData.summary && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Summary</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{formData.summary}</p>
        </div>
      )}

      {formData.experience.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Experience</h4>
          {formData.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem' }}>
                <span>{exp.position || 'Position'}</span>
                <span style={{ color: '#64748b' }}>{exp.duration}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>{exp.company || 'Company'}</div>
              <p style={{ fontSize: '0.8rem', margin: '4px 0', color: '#475569' }}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {formData.education.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Education</h4>
          {formData.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.85rem' }}>
                <span>{edu.degree || 'Degree'}</span>
                <span style={{ color: '#64748b' }}>{edu.year}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569' }}>{edu.school || 'Institution'}</div>
            </div>
          ))}
        </div>
      )}

      {formData.skills.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Skills</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {formData.skills.map((s, i) => (
              <span key={i} style={{ padding: '4px 8px', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Internal Helper
const ChevronDown = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default ResumeUploadWorkflow;
