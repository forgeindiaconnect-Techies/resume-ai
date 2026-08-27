import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Download, FileText, X, RefreshCw, Mail, CreditCard } from 'lucide-react';
import { generateProfessionalFilename, exportResumeToPdf } from '../../utils/pdfExport';
import { trackEvent } from '../../utils/sessionTracker';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../../config/api';

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
  const [selectedPlan, setSelectedPlan] = useState('no_watermark');
  const [downloadPlans, setDownloadPlans] = useState([]);

  useEffect(() => {
    const fetchDownloadPlans = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/download-plans`
        );
        const data = await response.json();
        if (data.success) {
          setDownloadPlans(
            (data.plans || []).filter(plan => plan.isActive)
          );
        }
      } catch (error) {
        console.error("Failed to load download plans:", error);
      }
    };

    if (isOpen) {
      fetchDownloadPlans();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStep('review');
      setProgress(0);
      setLoadingPayment(false);
      setSelectedPlan('no_watermark');
      const generated = generateProfessionalFilename(formData?.personalInfo?.name, formData?.department || formData?.personalInfo?.role);
      setCustomFilename(generated);
      
      if (formData?.personalInfo?.email) {
        setEmail(formData.personalInfo.email);
      }
      
      trackEvent("Download Popup Opened", "/builder");
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

  const handleContinueToPayment = async () => {
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email ID.");
      return;
    }

    if (!selectedPlan) {
      alert("Please select a download option.");
      return;
    }

    try {
      const sheet =
        document.getElementById("resume-preview-sheet") ||
        document.querySelector(".print-paper-sheet") ||
        document.querySelector(".resume-page") ||
        document.querySelector(".resume-preview-container") ||
        document.querySelector(".editor-right-preview > div:last-child > div");

      if (!sheet) {
        alert("Resume preview not found. Please ensure the preview canvas is loaded.");
        return;
      }

      setLoadingPayment(true);

      const isLoaded = await loadRazorpay();
      if (!isLoaded || !window.Razorpay) {
        setLoadingPayment(false);
        alert("Unable to load Razorpay payment gateway. Please check your internet connection.");
        return;
      }

      const resName = formData?.personalInfo?.name || formData?.name || localStorage.getItem("userName") || "Resume";
      const normalizedEmail = email.trim().toLowerCase();
      if (email) localStorage.setItem("userEmail", normalizedEmail);
      if (resName) localStorage.setItem("userName", resName);

      const resumeIdentifier = formData?.resumeId || localStorage.getItem("activeResumeSessionId") || `RESUME_${Date.now()}`;
      const token = localStorage.getItem("token");

      // 1. Create Razorpay Order on Backend
      const orderResponse = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          email: normalizedEmail,
          resumeId: resumeIdentifier,
          plan: selectedPlan,
          planKey: selectedPlan
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to initialize Razorpay order");
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        name: "Forge India Connect",
        description: selectedPlan === "no_watermark" ? "High-Res PDF (No Watermark)" : "Standard PDF (Watermarked)",
        order_id: orderData.order.id,
        prefill: {
          name: resName,
          email: normalizedEmail,
          contact: formData?.personalInfo?.phone || ""
        },
        theme: {
          color: "#0ea5e9"
        },
        handler: async function (paymentResponse) {
          try {
            setStep('progress');
            setProgress(30);

            // 3. Verify Payment on Backend
            const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                resumeId: resumeIdentifier
              })
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.message || "Payment signature verification failed");
            }

            setProgress(60);

            // 4. Save Download Record in MongoDB
            await fetch(`${API_BASE_URL}/downloads`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                sessionId: localStorage.getItem("userSessionId") || null,
                guestId: localStorage.getItem("guestId") || null,
                email: normalizedEmail,
                resumeId: resumeIdentifier,
                resumeName: resName,
                downloadType: selectedPlan,
                paymentId: verifyData.payment?._id || paymentResponse.razorpay_payment_id
              })
            }).catch(e => console.warn("Save download error:", e));

            setProgress(80);

            // 5. Generate and Export PDF
            const isClean = selectedPlan === "no_watermark";
            const filename = generateProfessionalFilename(
              resName || "Resume",
              formData?.department || "Professional"
            );

            await exportResumeToPdf(sheet, filename, isClean);

            setProgress(100);

            // 6. Track Event
            await trackEvent("RESUME_DOWNLOADED", "/builder", {
              resumeName: resName,
              email: normalizedEmail,
              downloaded: true,
              downloadType: selectedPlan,
              paymentId: paymentResponse.razorpay_payment_id
            });

            setStep('success');
            setTimeout(() => {
              onClose();
            }, 2500);

          } catch (verifyError) {
            console.error("Verification/Download Error:", verifyError);
            alert(verifyError.message || "Payment verification failed.");
            setStep('plan');
          } finally {
            setLoadingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Razorpay Payment Failed:", response.error);
        alert(`Payment failed: ${response.error?.description || "Transaction was declined"}`);
        setLoadingPayment(false);
      });

      rzp.open();

    } catch (error) {
      console.error("PAYMENT / ORDER CREATION ERROR:", error);
      setLoadingPayment(false);
      alert(error.message || "Unable to initiate payment.");
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
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Download Your Resume</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Enter your email address and select your preferred download option to continue.</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '-0.5rem' }}>SELECT YOUR PLAN</label>
                {downloadPlans
                  .filter(plan => plan.key === "watermarked")
                  .map(plan => (
                    <div 
                      key={plan._id}
                      onClick={() => setSelectedPlan(plan.key)}
                      style={{ 
                        cursor: 'pointer', padding: '1.25rem', 
                        border: selectedPlan === 'watermarked' ? '2px solid #0284c7' : '1px solid #cbd5e1', 
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                        transition: 'all 0.2s', background: selectedPlan === 'watermarked' ? '#f0f9ff' : '#f8fafc' 
                      }}
                    >
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: selectedPlan === 'watermarked' ? '#0284c7' : '#334155', fontWeight: 800 }}>{plan.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Standard PDF with Watermark</p>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '1.2rem', color: selectedPlan === 'watermarked' ? '#0284c7' : '#475569' }}>₹{plan.price}</div>
                    </div>
                  ))}

                {downloadPlans
                  .filter(plan => plan.key === "no_watermark")
                  .map(plan => (
                    <div 
                      key={plan._id}
                      onClick={() => setSelectedPlan(plan.key)}
                      style={{ 
                        cursor: 'pointer', position: 'relative', padding: '1.25rem', 
                        border: selectedPlan === 'no_watermark' ? '2px solid #0ea5e9' : '1px solid #cbd5e1', 
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                        background: selectedPlan === 'no_watermark' ? '#f0f9ff' : '#f8fafc', transition: 'all 0.2s' 
                      }}
                    >
                      <div style={{ position: 'absolute', top: '-10px', right: '15px', background: '#0ea5e9', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>RECOMMENDED</div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: selectedPlan === 'no_watermark' ? '#0ea5e9' : '#334155', fontWeight: 800 }}>{plan.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: selectedPlan === 'no_watermark' ? '#0284c7' : '#64748b', fontWeight: 500 }}>High-res PDF, No Watermark</p>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '1.3rem', color: selectedPlan === 'no_watermark' ? '#0ea5e9' : '#0f172a' }}>₹{plan.price}</div>
                    </div>
                  ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleContinueToPayment}
                  disabled={loadingPayment}
                  style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: 'none', background: '#0ea5e9', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loadingPayment ? <RefreshCw size={18} className="animate-spin" /> : <CreditCard size={18} />}
                  Continue to Payment
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
            <div style={{ padding: '2.5rem 2rem' }}>
              <div style={{ width: 65, height: 65, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Payment & Download Successful! 🎉</h3>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Company Name</span>
                    <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 900 }}>Forge India Connect</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Customer Name</span>
                    <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 900 }}>{formData?.personalInfo?.name && formData.personalInfo.name !== 'Your Name' ? formData.personalInfo.name : 'Valued Customer'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Subject</span>
                    <span style={{ fontSize: '0.95rem', color: '#059669', fontWeight: 900 }}>ATS-Friendly Resume Generation</span>
                  </div>
                  <div style={{ paddingTop: '0.5rem' }}>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>
                      Thank you for choosing Forge India Connect to build your professional profile. We are thrilled to be part of your career journey.
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>
                      Your high-resolution PDF has been downloaded as:
                    </p>
                    <div style={{ background: 'white', border: '1px solid #cbd5e1', padding: '0.65rem 1rem', borderRadius: '8px', fontWeight: 800, color: '#0284c7', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} /> {customFilename}
                    </div>
                  </div>
                </div>
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
                  onClick={handleContinueToPayment}
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
