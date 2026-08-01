import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ResumeAlreadyExistsModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{ 
          position: 'fixed', inset: 0, zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)' 
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            background: 'rgba(10, 31, 68, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '28px',
            padding: '3rem',
            maxWidth: '550px',
            width: '90%',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(13, 110, 253, 0.1)'
          }}
        >
          {/* Close Icon (X) in top right */}
          <button 
            onClick={onClose}
            style={{ 
              position: 'absolute', top: '1.5rem', right: '1.5rem', 
              background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', 
              padding: '0.5rem', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            <X size={20} />
          </button>

          {/* Warning Icon (AlertTriangle) in yellow above the title */}
          <div style={{ color: '#F4C400', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <AlertTriangle size={64} strokeWidth={1.5} />
          </div>

          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Resume Already Exists!
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: 500 }}>
            You have already uploaded this resume.<br/>
            Please upload a new one.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '1rem 2rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: '1rem 2rem',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #F4C400 0%, #ffb300 100%)',
                color: '#0A1F44',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(244, 196, 0, 0.2)'
              }}
            >
              OK
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResumeAlreadyExistsModal;
