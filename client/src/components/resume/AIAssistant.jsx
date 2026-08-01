import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

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
    'Improve Summary',
    'Generate Experience',
    'Generate Projects',
    'Improve Skills',
    'ATS Suggestions',
    'Resume Review'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={onClose} 
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(3px)', zIndex: 999 }} 
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            style={{ 
              position: 'fixed', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: 'calc(100% - 32px)', 
              maxWidth: '480px', 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)', 
              zIndex: 1000,
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#7c3aed" /> AI Assistant Operations
              </h3>
              <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20}/>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {operations.map(opt => (
                <button 
                  key={opt}
                  onClick={() => onRunAi(opt)}
                  style={{ 
                    padding: '0.75rem', 
                    background: '#f8fafc', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '10px', 
                    fontSize: '0.8rem', 
                    fontWeight: 800, 
                    color: '#334155', 
                    cursor: 'pointer', 
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {aiOutput && (
              <div style={{ 
                padding: '1rem', 
                background: '#f5f3ff', 
                border: '1px solid #d8b4fe', 
                borderRadius: '12px', 
                fontSize: '0.85rem', 
                color: '#5b21b6', 
                lineHeight: 1.6, 
                fontWeight: 650, 
                marginBottom: '1.5rem',
                maxHeight: '160px',
                overflowY: 'auto'
              }}>
                {aiOutput}
              </div>
            )}

            {loading && (
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #e2e8f0', borderTop: '2px solid #7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                AI Generating suggestions for {currentTask}...
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                onClick={onClose} 
                style={{ padding: '0.65rem 1.25rem', background: 'none', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
              {aiOutput && (
                <button 
                  onClick={onApply} 
                  style={{ padding: '0.65rem 1.25rem', background: '#7c3aed', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Apply Text
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
