import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, Eye, EyeOff, Briefcase, Sparkles } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const guestSessionId = localStorage.getItem('guestSessionId');
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password, role: formData.role, sessionId: guestSessionId };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save token and user details to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userdb', JSON.stringify(data.user));
        if (data.user.role === 'HR') {
          localStorage.setItem('hrdb', JSON.stringify(data.user));
        }

        onAuthSuccess(data.user, data.token);
        onClose();
        // Reset form
        setFormData({ name: '', email: '', password: '', role: 'Employee' });
      } else {
        setLocalError(data.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Auth request failed:', err);
      setLocalError('Network error. Unable to connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="central-glow"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="login-modal-glass"
        style={{ maxWidth: '460px' }}
      >
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="login-header">
          <div className="user-icon-hollow" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
            <User size={48} strokeWidth={1} />
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {isLogin ? 'Sign in to access your resumes & analysis reports' : 'Get started by creating your candidate or recruiter profile'}
          </p>
          
          {localError && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 600, marginTop: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: '10px' }}
            >
              {localError}
            </motion.p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="login-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
          
          {/* Name Field - Register only */}
          {!isLogin && (
            <div className="input-group-glass">
              <div className="input-icon">
                <User size={20} strokeWidth={1.5} />
              </div>
              <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
          )}

          {/* Email Field */}
          <div className="input-group-glass">
            <div className="input-icon">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          {/* Password Field */}
          <div className="input-group-glass">
            <div className="input-icon">
              <Lock size={20} strokeWidth={1.5} />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Role Field - Register only */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', width: '100%' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>I am registering as a:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Employee' })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: formData.role === 'Employee' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: formData.role === 'Employee' ? 'var(--primary-glow)' : 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Job Seeker / Employee
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'HR' })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: formData.role === 'HR' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: formData.role === 'HR' ? 'var(--primary-glow)' : 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Recruiter / HR
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="login-submit-btn" 
            disabled={loading}
            style={{
              padding: '1rem',
              borderRadius: '14px',
              border: 'none',
              background: 'var(--grad-main)',
              color: '#fff',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--primary-glow)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
          </button>

          {isLogin && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Reset password functionality is currently being processed by our support email.'); }}>Forgot password?</a>
            </div>
          )}
        </form>

        <div className="login-footer">
          <div className="divider"></div>
          <p className="footer-link-row">
            {isLogin ? "Don't have an account ?" : "Already have an account ?"}{' '}
            <button type="button" onClick={handleToggleMode} className="register-link-btn">
              {isLogin ? 'REGISTER HERE' : 'LOGIN HERE'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
