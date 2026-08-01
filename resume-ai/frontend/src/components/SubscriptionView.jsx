import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, CreditCard, Sparkles, Star, AlertCircle, ArrowRight, UserPlus, LogIn } from 'lucide-react';

const SubscriptionView = ({ user, onUpdateUser, onNavigateToDashboard }) => {
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [checkoutStep, setCheckoutStep] = useState('pricing'); // 'pricing', 'register', 'payment', 'success'
  
  // Registration / Inline Login States
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee'
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  // Payment checkout states
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleCreateOrder = () => {
    if (selectedPlan === 'Free') {
      onNavigateToDashboard();
      return;
    }
    
    // If user is guest, direct to register first
    if (!user) {
      setCheckoutStep('register');
    } else {
      setCheckoutStep('payment');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError(null);

    const url = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const payload = isLoginMode 
      ? { email: registerForm.email, password: registerForm.password }
      : { name: registerForm.name, email: registerForm.email, password: registerForm.password, role: registerForm.role };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userdb', JSON.stringify(data.user));
        
        if (onUpdateUser) {
          // Log user in and set user object globally
          onUpdateUser(data.user, true);
        }
        
        // Advance to payment checkout step
        setCheckoutStep('payment');
      } else {
        throw new Error(data.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setRegisterError(err.message || 'Network error connecting to auth server.');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const token = localStorage.getItem('token');
      // 1. Create order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: 299 })
      });
      const orderData = await orderRes.json();
      
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to initialize order');
      }

      const paymentId = orderData.order.paymentId;

      // 2. Verify payment (simulate payment success callback)
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentId, status: 'Completed' })
      });
      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        // Upgrade session user state
        const savedUser = localStorage.getItem('userdb');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          parsed.subscription = 'Premium';
          localStorage.setItem('userdb', JSON.stringify(parsed));
        }
        if (onUpdateUser) {
          onUpdateUser({ subscription: 'Premium' });
        }
        setCheckoutStep('success');
      } else {
        throw new Error(verifyData.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error(err);
      setPaymentError(err.message || 'Failed to complete transaction order. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      
      {/* Checkout Progress Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        {[
          { key: 'pricing', label: '1. Select Plan' },
          { key: 'register', label: '2. Create Account' },
          { key: 'payment', label: '3. Pay & Unlock' }
        ].map((s, idx) => {
          const isCurrent = checkoutStep === s.key;
          const isDone = (s.key === 'pricing' && (checkoutStep === 'register' || checkoutStep === 'payment' || checkoutStep === 'success')) ||
                         (s.key === 'register' && (checkoutStep === 'payment' || checkoutStep === 'success'));
          return (
            <React.Fragment key={s.key}>
              <div style={{ 
                fontSize: '0.85rem', 
                fontWeight: 800, 
                color: isCurrent ? 'var(--primary)' : isDone ? '#10b981' : 'var(--text-muted)',
                opacity: isCurrent || isDone ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: isDone ? '#e2fbe9' : isCurrent ? 'var(--primary-glow)' : 'rgba(0,0,0,0.05)',
                  border: `1.5px solid ${isDone ? '#10b981' : isCurrent ? 'var(--primary)' : 'var(--border)'}`,
                  color: isDone ? '#10b981' : isCurrent ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 900
                }}>
                  {isDone ? '✓' : idx + 1}
                </span>
                {s.label}
              </div>
              {idx < 2 && <div style={{ width: '40px', height: '1px', background: 'var(--border)' }} />}
            </React.Fragment>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        
        {/* Step 1: Pricing Grid */}
        {checkoutStep === 'pricing' && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-glow)', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '50px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                <Star size={12} /> Pricing Plans
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-0.04em', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Unlock Premium Features
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 600 }}>
                Choose a plan to save your work and download in PDF format.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
              
              {/* Free Plan */}
              <div 
                onClick={() => setSelectedPlan('Free')}
                style={{
                  background: 'var(--bg-card)',
                  border: `2px solid ${selectedPlan === 'Free' ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '24px',
                  padding: '2.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: selectedPlan === 'Free' ? '0 15px 35px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Basic Free</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2rem' }}>Ideal for testing the resume builder tool</p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)' }}>₹0</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ forever</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '3rem', flex: 1 }}>
                  {[
                    { text: 'Build & Save Resumes', active: true },
                    { text: 'Live Workspace Preview', active: true },
                    { text: 'Download PDF', active: false },
                    { text: 'Full ATS Match Analytics', active: false },
                    { text: 'AI Improvement Suggestions', active: false }
                  ].map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: feat.active ? 'var(--text-main)' : 'var(--text-muted)', opacity: feat.active ? 1 : 0.5 }}>
                      <span style={{ color: feat.active ? '#10b981' : '#ef4444' }}>{feat.active ? '✓' : '✘'}</span>
                      {feat.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Pro Plan */}
              <div 
                onClick={() => setSelectedPlan('Pro')}
                style={{
                  background: 'var(--bg-card)',
                  border: `2px solid ${selectedPlan === 'Pro' ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '24px',
                  padding: '2.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: selectedPlan === 'Pro' ? '0 15px 35px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ position: 'absolute', top: '-14px', right: '24px', background: 'var(--grad-main)', color: 'white', fontSize: '0.7rem', fontWeight: 900, padding: '0.35rem 0.85rem', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 12px var(--primary-glow)' }}>
                  Recommended
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Premium Pro</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2rem' }}>Complete suite for professionals seeking callbacks</p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)' }}>₹299</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ month</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '3rem', flex: 1 }}>
                  {[
                    { text: 'Build & Save Resumes', active: true },
                    { text: 'Live Workspace Preview', active: true },
                    { text: 'Download PDF', active: true },
                    { text: 'Full ATS Match Analytics', active: true },
                    { text: 'AI Improvement Suggestions', active: true },
                    { text: 'Portfolio Webpage Link', active: true }
                  ].map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      {feat.text}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={handleCreateOrder}
                className="glass-btn btn-primary"
                style={{
                  padding: '1rem 3rem',
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  boxShadow: '0 10px 25px var(--primary-glow)',
                  cursor: 'pointer'
                }}
              >
                {selectedPlan === 'Pro' ? 'Subscribe Now' : 'Continue Free'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Create Account / Inline Login */}
        {checkoutStep === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '480px', margin: '1rem auto' }}
          >
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  {isLoginMode ? <LogIn size={20} /> : <UserPlus size={20} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                    {isLoginMode ? 'Sign In to Account' : 'Create Your Account'}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>
                    Required to link and save your resume details
                  </p>
                </div>
              </div>

              {registerError && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  <AlertCircle size={16} />
                  {registerError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                {!isLoginMode && (
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Full Name</label>
                    <input required type="text" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} placeholder="e.g. Pooja R" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontWeight: 600 }} />
                  </div>
                )}

                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Email Address</label>
                  <input required type="email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} placeholder="pooja@gmail.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontWeight: 600 }} />
                </div>

                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Password</label>
                  <input required type="password" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} placeholder="Minimum 6 characters" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontWeight: 600 }} />
                </div>

                <button 
                  type="submit" 
                  disabled={registerLoading}
                  className="glass-btn btn-primary"
                  style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', boxShadow: '0 8px 16px var(--primary-glow)' }}
                >
                  {registerLoading ? 'Processing...' : isLoginMode ? 'Sign In & Continue' : 'Create Account & Continue'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <span 
                    onClick={() => { setIsLoginMode(!isLoginMode); setRegisterError(null); }} 
                    style={{ fontSize: '0.8rem', fontWeight: 850, color: 'var(--primary)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    {isLoginMode ? 'Create a new account instead' : 'Already have an account? Sign in'}
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment Checkout simulation */}
        {checkoutStep === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '480px', margin: '1rem auto' }}
          >
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Secure Checkout</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>Processed securely with UPI/Card simulation</p>
                </div>
              </div>

              <div style={{ background: 'var(--bg-hover)', padding: '1rem 1.25rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>Premium Pro Access</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>₹299.00</span>
              </div>

              {paymentError && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  <AlertCircle size={16} />
                  {paymentError}
                </div>
              )}

              <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Card Number</label>
                  <input required type="text" placeholder="4111 2222 3333 4444" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontWeight: 600 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Expiry Date</label>
                    <input required type="text" placeholder="12/28" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontWeight: 600 }} />
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>CVV Code</label>
                    <input required type="password" maxLength="3" placeholder="***" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontWeight: 600 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setCheckoutStep('pricing')}
                    style={{ flex: 1, padding: '0.85rem', background: 'none', border: '1px solid var(--border)', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={paymentLoading}
                    className="glass-btn btn-primary"
                    style={{ flex: 1.5, padding: '0.85rem', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 16px var(--primary-glow)' }}
                  >
                    {paymentLoading ? 'Processing...' : 'Pay ₹299.00'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success Screen */}
        {checkoutStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '480px', margin: '4rem auto', textAlign: 'center' }}
          >
            <div className="glass-card" style={{ padding: '3rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}>
                <ShieldCheck size={36} />
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Payment Successful!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '2rem', lineHeight: 1.5 }}>
                Your account is now upgraded to Premium Pro. All resume features, PDF downloads, and dashboard tools are now fully unlocked.
              </p>

              <button 
                onClick={onNavigateToDashboard}
                className="glass-btn btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px var(--primary-glow)',
                  cursor: 'pointer'
                }}
              >
                Open Dashboard Workspace <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default SubscriptionView;
