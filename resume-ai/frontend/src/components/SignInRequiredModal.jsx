import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardList, Lock, User, ChevronRight } from 'lucide-react';

const SignInRequiredModal = ({ isOpen, onClose, onSignIn }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="login-modal-glass"
            style={{ 
              maxWidth: '440px', 
              padding: '2.5rem', 
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              <X size={20} />
            </button>

            {/* Icon Illustration */}
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 2rem' }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'rgba(99, 102, 241, 0.05)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(99, 102, 241, 0.1)'
              }}>
                <div style={{ position: 'relative' }}>
                  <ClipboardList size={60} color="var(--primary)" strokeWidth={1.5} />
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -20%)',
                    background: 'white',
                    borderRadius: '50%',
                    padding: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <User size={20} color="var(--primary)" />
                  </div>
                  <div style={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: -10,
                    background: 'var(--grad-main)',
                    borderRadius: '8px',
                    padding: '6px',
                    boxShadow: '0 4px 15px var(--primary-glow)',
                    color: 'white'
                  }}>
                    <Lock size={16} fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 800, 
              color: '#1e293b', 
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Sign In Required
            </h2>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: '1rem', 
              lineHeight: 1.6, 
              marginBottom: '2.5rem',
              fontWeight: 500
            }}>
              Please sign in first, then upload your resume.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={onSignIn}
                className="gradient-btn"
                style={{ flex: 1, padding: '1rem', fontSize: '1rem', justifyContent: 'center' }}
              >
                Sign In
              </button>
              <button 
                onClick={onClose}
                className="glass-card"
                style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  fontSize: '1rem', 
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontWeight: 700
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignInRequiredModal;
