import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Download, FileText, X, RefreshCw, Mail, CreditCard } from 'lucide-react';
import { generateProfessionalFilename, exportResumeToPdf } from '../../utils/pdfExport';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DownloadWorkflowModal = ({
  isOpen,
  onClose,
  formData,
  atsScore,
  onEdit,
  onNavigateHome
}) => {
  const navigate = useNavigate();
  // Steps: 'review' -> 'email' -> 'plan' -> 'progress' -> 'success' | 'error'
  const [step, setStep] = useState('review'); 
  const [progress, setProgress] = useState(0);
  const [customFilename, setCustomFilename] = useState('');
  
  // New State for Wizard
  const [email, setEmail] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [watermarkRemoval, setWatermarkRemoval] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('review');
      setProgress(0);
      setLoadingPayment(false);
      setWatermarkRemoval(false);
      const generated = generateProfessionalFilename(formData?.personalInfo?.name, formData?.department || formData?.personalInfo?.role);
      setCustomFilename(generated);
      
      if (formData?.personalInfo?.email) {
        setEmail(formData.personalInfo.email);
      }
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

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleFreeDownload = () => {
    setWatermarkRemoval(false);
    executeDownloadFlow(false, null);
  };

  const handlePaidDownload = async () => {
    setLoadingPayment(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Failed to load payment gateway. Please check your connection.");
      setLoadingPayment(false);
      return;
    }

    try {
      const activeSessionId = localStorage.getItem('activeResumeSessionId') || 'local_session';
      const token = localStorage.getItem('token');
      
      const resOrder = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          email: email.trim(),
          resumeId: activeSessionId,
          amount: 79,
          watermarkRemoval: true
        })
      });
      
      const orderData = await resOrder.json();
      if (!orderData.success) {
        alert('Failed to initialize payment.');
        setLoadingPayment(false);
        return;
      }

      const options = {
        key: orderData.keyId || orderData.razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        name: "Forge India Connect",
        description: `Clean PDF Download without Watermark`,
        order_id: orderData.order.id || orderData.order.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                resumeId: activeSessionId
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setWatermarkRemoval(true);
              executeDownloadFlow(true, verifyData.payment.paymentId);
            } else {
              alert('Payment verification failed.');
              setLoadingPayment(false);
            }
          } catch (e) {
            console.error(e);
            alert('Error verifying payment.');
            setLoadingPayment(false);
          }
        },
        modal: {
          ondismiss: function() {
            setLoadingPayment(false);
          }
        },
        prefill: {
          email: email.trim(),
        },
        theme: { color: "#0284c7" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert('Payment Failed: ' + response.error.description);
        setLoadingPayment(false);
      });
      rzp1.open();

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Could not start checkout process.');
      setLoadingPayment(false);
    }
  };

  const executeDownloadFlow = async (isClean, paymentIdStr) => {
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
      const activeSessionId = localStorage.getItem('activeResumeSessionId') || 'local_session';
      const token = localStorage.getItem('token');
      
      // Log the download with backend
      if (activeSessionId && activeSessionId !== 'local_session') {
        try {
          await fetch(`${API_BASE_URL}/downloads/${activeSessionId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              email: email.trim(),
              paymentId: paymentIdStr,
              watermarkApplied: !isClean
            })
          });
        } catch(e) {
          console.error("Failed to log download:", e);
        }
      }

      const sheet = document.getElementById('resume-preview-sheet');
      await exportResumeToPdf(sheet, customFilename, isClean);
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
          {/* STEP 1: RESUME REVIEW PAGE */}
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

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => { onClose(); if (onEdit) onEdit(); }}
                  style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#334155', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Edit Resume
                </button>
                <button
                  onClick={() => setStep('email')}
                  style={{ flex: 1.2, padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EMAIL ENTRY */}
          {step === 'email' && (
            <div style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <Mail size={26} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Where should we send it?</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Enter your email to receive a backup copy.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>PDF File Name</label>
                  <input
                    type="text"
                    value={customFilename}
                    onChange={e => setCustomFilename(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setStep('review')}
                  style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#334155', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!email || !email.includes('@')) {
                      alert('Please enter a valid email address.');
                      return;
                    }
                    setStep('plan');
                  }}
                  style={{ flex: 1.2, padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)' }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT PLAN */}
          {step === 'plan' && (
            <div style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Select Download Option</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Choose how you want to download your resume.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Free Option */}
                <div 
                  onClick={handleFreeDownload}
                  style={{ cursor: 'pointer', padding: '1.25rem', border: '2px solid #cbd5e1', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', background: '#f8fafc' }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: '#334155', fontWeight: 800 }}>Free Download</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Standard PDF with Forge India Watermark</p>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#475569' }}>₹0</div>
                </div>

                {/* Paid Option */}
                <div 
                  style={{ position: 'relative', padding: '1.25rem', border: '2px solid #0284c7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0f9ff' }}
                >
                  <div style={{ position: 'absolute', top: '-10px', right: '15px', background: '#0284c7', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>RECOMMENDED</div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: '#0284c7', fontWeight: 800 }}>Clean PDF Export</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#0369a1', fontWeight: 500 }}>High-resolution, ATS-friendly, No Watermark</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#0f172a' }}>₹79</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textDecoration: 'line-through' }}>₹149</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setStep('email')}
                  style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#334155', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
                  disabled={loadingPayment}
                >
                  Back
                </button>
                <button
                  onClick={handlePaidDownload}
                  disabled={loadingPayment}
                  style={{ flex: 1.4, padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loadingPayment ? <RefreshCw size={18} className="animate-spin" /> : <CreditCard size={18} />}
                  Pay ₹79 & Download
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LOADING SCREEN */}
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

          {/* STEP 5: SUCCESS SCREEN */}
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

          {/* STEP 6: ERROR HANDLING & RETRY */}
          {step === 'error' && (
            <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <AlertTriangle size={32} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Unable to Generate PDF</h3>
              <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Something went wrong during PDF generation. Please try again.</p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setStep('plan')}
                  style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: 'white', color: '#334155', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeDownloadFlow(watermarkRemoval, null)}
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
