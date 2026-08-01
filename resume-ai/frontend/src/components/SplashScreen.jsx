import React from 'react';
import { motion } from 'framer-motion';
import ForgeLogo from './ForgeLogo';

const SplashScreen = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Standard professional splash duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem'
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <ForgeLogo size={80} showText={false} variant="sidebar" />
      </motion.div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ 
            color: 'white', 
            fontSize: '1.8rem', 
            fontWeight: 900, 
            letterSpacing: '0.2em',
            margin: 0
          }}
        >
          ATS <span style={{ color: '#ffcc00' }}>AI</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          style={{ 
            color: 'rgba(255,255,255,0.4)', 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            letterSpacing: '0.1em' 
          }}
        >
          PREPARING INTELLIGENCE...
        </motion.p>
      </div>

      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(0, 86, 184, 0.2) 0%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: -1
      }} />
    </motion.div>
  );
};

export default SplashScreen;
