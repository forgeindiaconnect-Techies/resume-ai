import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Download, FileText, X, RefreshCw } from 'lucide-react';
import { generateProfessionalFilename, exportResumeToPdf } from '../../utils/pdfExport';
import { useNavigate } from 'react-router-dom';

const DownloadWorkflowModal = ({
  isOpen,
  onClose,
  formData,
  atsScore,
  onEdit,
  onNavigateHome
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('review'); // 'review' | 'confirm' | 'progress' | 'success' | 'error'
  const [progress, setProgress] = useState(0);
  const [customFilename, setCustomFilename] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('review');
      setProgress(0);
      const generated = generateProfessionalFilename(formData?.personalInfo?.name, formData?.department || formData?.personalInfo?.role);
      setCustomFilename(generated);
    }
  }, [isOpen, formData]);

  if (!isOpen) return null;

  // Quality check validation
  const checks = [
    { label: 'Personal Details', ok: Boolean(formData?.personalInfo?.name && formData?.personalInfo?.name !== 'Your Name' && formData?.personalInfo?.email) },
    { label: 'Professional Summary', ok: Boolean(formData?.personalInfo?.summary) },
    { label: 'Work Experience', ok: Boolean(formData?.experience && formData.experience.length > 0) },
    { label: 'Skills & Competencies', ok: Boolean(formData?.skills?.programming?.length > 0 || formData?.skills?.frameworks?.length > 0) },
    { label: 'Education', ok: Boolean(formData?.education && formData.education.length > 0) }
  ];

  const completedCount = checks.filter(c => c.ok).length;
  const completionPercent = Math.round((completedCount / checks.length) * 100);

  const startPdfGeneration = async () => {
    const appSettingsString = localStorage.getItem('app_settings');
    let appSettings = {};
    if (appSettingsString) {
      try {
        appSettings = JSON.parse(appSettingsString);
      } catch (e) {}
    }

    const premiumDownloadOnly = appSettings.premiumDownloadOnly !== false; // default true
    const isPremium = localStorage.getItem('user_premium') === 'true';

    if (premiumDownloadOnly && !isPremium) {
      alert("Please upgrade your plan to download without watermark.");
      onClose();
      navigate("/pricing");
      return;
    }

    setStep('progress');
    setProgress(15);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const sheet = document.getElementById('resume-preview-sheet');
      await exportResumeToPdf(sheet, customFilename, true);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setStep('success');
      }, 400);
    } catch (err) {
      clearInterval(interval);
      setStep('error');
    }
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '540px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', overflow: 'hidden', border: '1px solid #e2e8f0' }}
        >
          {/* STEP 28: RESUME REVIEW PAGE */}
          {step === 'review' && (
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Resume Ready 🎉</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
              </div>

              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0.85rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Template</span>
                  <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.95rem', textTransform: 'capitalize', marginTop: '0.2rem' }}>{formData?.templateId || 'Modern'}</div>
                </div>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '0.85rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 800, textTransform: 'uppercase' }}>ATS Score</span>
                  <div style={{ fontWeight: 900, color: '#059669', fontSize: '0.95rem', marginTop: '0.2rem' }}>{atsScore || 92}%</div>
                </div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '0.85rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase' }}>Pages</span>
                  <div style={{ fontWeight: 900, color: '#2563eb', fontSize: '0.95rem', marginTop: '0.2rem' }}>1 Page A4</div>
                </div>
              </div>

              {/* Sections Quality Checklist */}
              <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sections Checklist</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {checks.map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>{c.label}</span>
                      {c.ok ? (
                        <span style={{ color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={16} /> Complete
                        </span>
                      ) : (
                        <span style={{ color: '#d97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <AlertTriangle size={16} /> Optional
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {completionPercent < 80 && (
                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#b45309', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} />
                  <span>Your resume is {completionPercent}% complete. Complete all sections for optimal results.</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => { onClose(); if (onEdit) onEdit(); }}
                  style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#334155', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Edit Resume
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  style={{ flex: 1.2, padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
                >
                  Next: Download PDF →
                </button>
              </div>
            </div>
          )}

          {/* STEP 29: DOWNLOAD CONFIRMATION */}
          {step === 'confirm' && (
            <div style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <Download size={26} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Download Resume</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Confirm your file settings before exporting</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Professional File Name</label>
                  <input
                    type="text"
                    value={customFilename}
                    onChange={e => setCustomFilename(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Quality</span>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.85rem', marginTop: '0.2rem', display: 'block' }}>⭐⭐⭐⭐⭐ High Quality</span>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Paper Size</span>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', marginTop: '0.2rem', display: 'block' }}>Standard A4 (210mm × 297mm)</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setStep('review')}
                  style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#334155', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={startPdfGeneration}
                  style={{ flex: 1.4, padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)' }}
                >
                  Download Now 📥
                </button>
              </div>
            </div>
          )}

          {/* STEP 30: LOADING SCREEN */}
          {step === 'progress' && (
            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <RefreshCw size={28} className="animate-spin" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Generating High-Res PDF...</h3>
              <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Please wait while we render your vector A4 resume...</p>

              <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #0ea5e9)', borderRadius: '10px', transition: 'width 0.2s ease' }} />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0284c7' }}>{progress}%</span>
            </div>
          )}

          {/* STEP 31: SUCCESS SCREEN */}
          {step === 'success' && (
            <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{ width: 65, height: 65, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Resume Downloaded Successfully! 🎉</h3>
              <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Saved to your device as:</p>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.85rem 1.25rem', borderRadius: '12px', fontWeight: 800, color: '#0284c7', fontSize: '0.9rem', marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} /> {customFilename}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => { onClose(); if (onEdit) onEdit(); }}
                  style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#334155', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Edit Again
                </button>
                <button
                  onClick={() => { onClose(); if (onNavigateHome) onNavigateHome(); }}
                  style={{ flex: 1.2, padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
                >
                  Create Another / Home
                </button>
              </div>
            </div>
          )}

          {/* STEP 32: ERROR HANDLING & RETRY */}
          {step === 'error' && (
            <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <AlertTriangle size={32} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Unable to Generate PDF</h3>
              <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Something went wrong during PDF generation. Please try again.</p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setStep('confirm')}
                  style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#334155', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={startPdfGeneration}
                  style={{ flex: 1.2, padding: '0.9rem', borderRadius: '12px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Retry PDF Download 🔄
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DownloadWorkflowModal;
