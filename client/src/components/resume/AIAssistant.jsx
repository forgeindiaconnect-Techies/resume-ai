import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';

const AIAssistant = ({
  isOpen,
  onClose,
  onRunAi,
  aiOutput,
  loading,
  onApply,
  currentTask
}) => {
  const operations = [
    { label: 'Improve Summary', icon: '📝' },
    { label: 'Generate Experience', icon: '💼' },
    { label: 'Generate Projects', icon: '🚀' },
    { label: 'Improve Skills', icon: '⚡' },
    { label: 'ATS Suggestions', icon: '🎯' },
    { label: 'Resume Review', icon: '✨' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={onClose} 
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', zIndex: 999 }} 
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            style={{ 
              position: 'fixed', 
              top: '25px', 
              bottom: '25px',
              left: '50%', 
              transform: 'translateX(-50%)', 
              width: 'calc(100% - 32px)', 
              maxWidth: '520px', 
              maxHeight: 'calc(100vh - 50px)',
              background: 'white', 
              borderRadius: '20px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)', 
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              textAlign: 'left'
            }}
          >
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
              flexShrink: 0
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} color="#7c3aed" /> AI Assistant Operations
              </h3>
              <button 
                onClick={onClose} 
                style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
              >
                <X size={20}/>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Select AI Operation
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                {operations.map(opt => (
                  <button 
                    key={opt.label}
                    onClick={() => onRunAi(opt.label)}
                    style={{ 
                      padding: '0.5rem 0.75rem', 
                      background: currentTask === opt.label ? '#f5f3ff' : '#f8fafc', 
                      border: `1px solid ${currentTask === opt.label ? '#7c3aed' : '#e2e8f0'}`, 
                      borderRadius: '8px', 
                      fontSize: '0.78rem', 
                      fontWeight: 800, 
                      color: currentTask === opt.label ? '#7c3aed' : '#334155', 
                      cursor: 'pointer', 
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>

              {loading && (
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #cbd5e1', borderTop: '2px solid #7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Generating AI suggestions for {currentTask}...
                </div>
              )}

              {aiOutput && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    AI Output Result
                  </span>
                  <div style={{ 
                    padding: '0.9rem', 
                    background: '#f5f3ff', 
                    border: '1.5px solid #d8b4fe', 
                    borderRadius: '12px', 
                    fontSize: '0.85rem', 
                    color: '#4c1d95', 
                    lineHeight: 1.55, 
                    fontWeight: 600, 
                    whiteSpace: 'pre-line',
                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)'
                  }}>
                    {aiOutput}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Pinned at Bottom) */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              flexShrink: 0
            }}>
              <button 
                onClick={onClose} 
                style={{ padding: '0.55rem 1.1rem', background: 'white', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Close
              </button>

              {aiOutput && !loading && (
                <button 
                  onClick={onApply} 
                  style={{ 
                    padding: '0.6rem 1.25rem', 
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', 
                    border: 'none', 
                    color: 'white', 
                    borderRadius: '8px', 
                    fontWeight: 900, 
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  <CheckCircle2 size={15} /> Apply to Resume
                </button>
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIAssistant;
