import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ModernLayout from '../components/layouts/ModernLayout';
import ProfessionalLayout from '../components/layouts/ProfessionalLayout';
import MinimalLayout from '../components/layouts/MinimalLayout';
import ExecutiveLayout from '../components/layouts/ExecutiveLayout';
import CreativeLayout from '../components/layouts/CreativeLayout';
import EnhancvLayout from '../components/layouts/EnhancvLayout';
import ResumeFooter from '../components/layouts/ResumeFooter';
import { 
  Sparkles, Download, ArrowLeft, Palette, Type, ShieldCheck, 
  Check, Edit2, Info
} from 'lucide-react';
import DownloadWorkflowModal from '../components/common/DownloadWorkflowModal';
import { PRESET_COLORS, PRESET_FONTS, loadSession, saveSession } from '../editors/editorUtils';
import { exportResumeToPdf, generateProfessionalFilename } from '../utils/pdfExport';

const AiResumeView = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const [sessionData, setSessionData] = useState(null);
  const [accentColor, setAccentColor] = useState('#0284c7');
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
  const [activeLayout, setActiveLayout] = useState('modern');
  const [saveNote, setSaveNote] = useState('Click any text to edit directly on paper ✏️');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentReason, setPaymentReason] = useState('download');

  const handleDownloadPdf = async () => {
    setShowPaymentModal(true);
  };

  useEffect(() => {
    const handleOpenPayment = (e) => {
      setPaymentReason(e.detail?.reason || 'download');
      setShowPaymentModal(true);
    };
    window.addEventListener('open-payment-modal', handleOpenPayment);
    return () => window.removeEventListener('open-payment-modal', handleOpenPayment);
  }, []);

  useEffect(() => {
    const data = loadSession(sessionId);
    if (data) {
      setSessionData(data);
      if (data.templateId) setActiveLayout(data.templateId.toLowerCase());
    }
  }, [sessionId]);

  if (!sessionData) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '8rem 1.5rem' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 0.8s linear infinite' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>Generating your AI resume...</h3>
        </div>
      </div>
    );
  }

  // Format data for layout components
  const layoutData = {
    name: sessionData.personalInfo?.name || sessionData.personalInfo?.fullName || 'Alexander Wright',
    role: sessionData.personalInfo?.role || sessionData.department || 'Professional',
    contact: {
      email: sessionData.personalInfo?.email || 'user@forgeindiaconnect.app',
      phone: sessionData.personalInfo?.phone || '+1 (555) 000-0000',
      location: sessionData.personalInfo?.location || 'New York, NY',
      linkedin: sessionData.personalInfo?.linkedin || '',
      github: sessionData.personalInfo?.github || ''
    },
    objective: sessionData.personalInfo?.summary || sessionData.summary || `Dedicated ${sessionData.department} with proven results.`,
    skills: {
      languages: Array.isArray(sessionData.skills?.programming) 
        ? sessionData.skills.programming.join(', ') 
        : (typeof sessionData.skills?.languages === 'string' ? sessionData.skills.languages : 'React, TypeScript, JavaScript'),
      frameworks: Array.isArray(sessionData.skills?.frameworks) 
        ? sessionData.skills.frameworks.join(', ') 
        : (typeof sessionData.skills?.frameworks === 'string' ? sessionData.skills.frameworks : 'REST APIs, Redux Toolkit, Tailwind CSS'),
      tools: Array.isArray(sessionData.skills?.databases) 
        ? sessionData.skills.databases.join(', ') 
        : (typeof sessionData.skills?.tools === 'string' ? sessionData.skills.tools : 'PostgreSQL, MongoDB, AWS')
    },
    experience: (sessionData.experience || []).map(e => ({
      title: e.title || e.role || sessionData.department,
      company: e.company || 'Tech Enterprise Solutions',
      duration: e.duration || '2022 - Present',
      desc: e.desc || e.description || ''
    })),
    education: (sessionData.education || []).map(e => ({
      degree: e.degree || 'B.S. in Computer Science',
      institution: e.institution || e.school || 'State University',
      tenure: e.tenure || '2016 - 2020',
      cgpa: e.cgpa || ''
    })),
    projects: (sessionData.projects || []).map(p => ({
      title: p.title || p.name || 'Core SaaS Platform',
      technology: p.technology || 'React, Node.js',
      desc: p.desc || p.description || ''
    }))
  };

  const handlePaperBlur = () => {
    setSaveNote('Changes saved automatically ✔');
    setTimeout(() => {
      setSaveNote('Click any text to edit directly on paper ✏️');
    }, 2500);
  };

  const renderLayout = () => {
    const props = {
      data: layoutData,
      role: layoutData.role,
      customColor: accentColor,
      customFont: fontFamily
    };
    switch (activeLayout) {
      case 'professional': return <ProfessionalLayout {...props} />;
      case 'executive': return <ExecutiveLayout {...props} />;
      case 'creative': return <CreativeLayout {...props} />;
      case 'enhancv': return <EnhancvLayout {...props} />;
      case 'minimal': return <MinimalLayout {...props} />;
      case 'modern':
      default: return <ModernLayout {...props} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e2e8f0', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Top Action Toolbar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #cbd5e1',
        padding: '0.85rem 2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Left Title & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
            >
              <ArrowLeft size={15} /> Back Home
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.72rem', fontWeight: 900, padding: '0.15rem 0.6rem', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} /> AI Generated Resume Ready
                </span>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={13} /> 98% ATS Score
                </span>
              </div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0.15rem 0 0 0' }}>
                {layoutData.name} — {layoutData.role}
              </h1>
            </div>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            
            {/* Color Palette & Custom Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Palette size={13} color={accentColor} /> Color:
              </span>
              {PRESET_COLORS.map(c => {
                const isSel = accentColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.id}
                    title={c.name}
                    onClick={() => setAccentColor(c.hex)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: c.hex,
                      border: isSel ? '2px solid #0f172a' : 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transform: isSel ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  />
                );
              })}

              {/* Custom Color Input */}
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, marginLeft: '2px' }} title="Choose Custom Color">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
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
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: PRESET_COLORS.some(c => c.hex.toLowerCase() === accentColor.toLowerCase())
                      ? 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)'
                      : accentColor,
                    border: !PRESET_COLORS.some(c => c.hex.toLowerCase() === accentColor.toLowerCase())
                      ? '2px solid #0f172a'
                      : '1.5px solid #cbd5e1',
                    boxShadow: !PRESET_COLORS.some(c => c.hex.toLowerCase() === accentColor.toLowerCase())
                      ? `0 0 0 2px ${accentColor}40`
                      : '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </div>
            </div>

            {/* Layout Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '0.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              {['modern', 'professional', 'executive', 'creative', 'minimal'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveLayout(t)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeLayout === t ? '#0284c7' : 'transparent',
                    color: activeLayout === t ? 'white' : '#64748b',
                    fontSize: '0.73rem',
                    fontWeight: 800,
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1.4rem',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                color: 'white',
                fontSize: '0.88rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Download size={16} /> Download PDF
            </button>

          </div>

        </div>
      </div>

      {/* Editing Guidance Subheader */}
      <div style={{ background: '#38bdf815', borderBottom: '1px solid #38bdf830', padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', color: '#0369a1', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Edit2 size={14} color="#0284c7" />
        <span>{saveNote}</span>
      </div>

      {/* Main Inline Editable Resume Canvas Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem 4rem', display: 'flex', justifyContent: 'center' }}>
        
        {/* Paper Document Sheet with contentEditable enabled directly on paper */}
        <div 
          ref={printRef}
          id="resume-preview-sheet"
          className="print-paper-sheet"
          contentEditable={true}
          suppressContentEditableWarning={true}
          onBlur={handlePaperBlur}
          title="Click anywhere to edit text directly on this resume!"
          style={{
            width: '210mm',
            minHeight: '297mm',
            background: 'white',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
            borderRadius: '4px',
            overflow: 'hidden',
            outline: 'none',
            cursor: 'text',
            position: 'relative',
            border: '2px solid transparent',
            transition: 'border 0.2s'
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#0284c7'}
        >
          {renderLayout()}
          <ResumeFooter />
        </div>

      </div>

      {/* New Unified Download Wizard Modal */}
      <DownloadWorkflowModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        formData={sessionData}
        atsScore={92}
        onNavigateHome={() => navigate('/')}
      />
    </div>
  );
};

export default AiResumeView;
