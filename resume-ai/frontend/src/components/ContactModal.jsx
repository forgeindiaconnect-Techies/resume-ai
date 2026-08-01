import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Mail, Shield, MessageSquare, Phone, MapPin, 
  Linkedin, Github, Twitter, Send, CheckCircle, HelpCircle,
  FileText, Clock, Users, ChevronRight, LayoutDashboard,
  BrainCircuit, Award
} from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({ fullName: '', email: '', subject: '', message: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ background: 'rgba(6, 13, 26, 0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="central-glow"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="contact-modal-glass"
        style={{
          width: '95%',
          maxWidth: '900px',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
          zIndex: 1001,
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
      >
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'rgba(255,255,255,0.06)', border: 'none',
            color: 'rgba(255,255,255,0.5)', borderRadius: '50%',
            width: '36px', height: '36px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10, transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <X size={20} />
        </button>

        <div 
          className={`contact-modal-grid ${isSubmitted ? 'is-submitted' : ''}`}
          style={{ 
            transition: 'all 0.4s ease'
          }}
        >
          
          {/* Left Column: Form / Success Message */}
          <div className="contact-form-panel" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Contact Us</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '400px' }}>
                    Have questions or need assistance? Feel free to reach out to us. We’re here to help you with your hiring process.
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      <div className="contact-input-group">
                        <label style={labelStyle}>Full Name</label>
                        <input 
                          type="text" required placeholder="John Doe"
                          value={formData.fullName} 
                          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div className="contact-input-group">
                        <label style={labelStyle}>Email Address</label>
                        <input 
                          type="email" required placeholder="john@example.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div className="contact-input-group">
                      <label style={labelStyle}>Subject</label>
                      <input 
                        type="text" required placeholder="How can we help?"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div className="contact-input-group">
                      <label style={labelStyle}>Message</label>
                      <textarea 
                        required rows="4" placeholder="Tell us more about your needs..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        style={{ ...inputStyle, resize: 'none', height: '120px', paddingTop: '1rem' }}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(244,196,0,0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      style={{
                        marginTop: '1rem', padding: '1rem', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #F4C400, #FFB700)',
                        border: 'none', color: '#0A1628', fontSize: '1rem', fontWeight: 800,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                        letterSpacing: '0.02em'
                      }}
                    >
                      Send Message <Send size={18} />
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  style={{ 
                    height: '100%', display: 'flex', flexDirection: 'column', 
                    alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    padding: '3rem', position: 'relative', overflow: 'hidden'
                  }}
                >
                  {/* Decorative Orbs */}
                  <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -20, 0], rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', top: '10%', left: '15%', width: '150px', height: '150px', 
                             background: 'radial-gradient(circle, rgba(244,196,0,0.12) 0%, transparent 70%)', 
                             borderRadius: '50%', filter: 'blur(30px)', zIndex: 0 }}
                  />
                  <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', bottom: '15%', right: '10%', width: '120px', height: '120px', 
                             background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', 
                             borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}
                  />

                  {/* Icon Container */}
                  <div style={{ position: 'relative', marginBottom: '2.5rem', zIndex: 2 }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      style={{
                        position: 'absolute', inset: '-15px', borderRadius: '50%',
                        border: '1px dashed rgba(16, 185, 129, 0.3)', pointerEvents: 'none'
                      }}
                    />
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.2 }}
                      style={{ 
                        width: '100px', height: '100px', borderRadius: '32px', 
                        background: 'rgba(16, 185, 129, 0.1)', border: '2.5px solid #10b981',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#10b981', boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)'
                      }}
                    >
                      <CheckCircle size={52} strokeWidth={2.5} />
                    </motion.div>
                  </div>

                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ 
                      fontSize: '3.25rem', fontWeight: 900, marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #F4C400 0%, #FFD700 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.03em'
                    }}
                  >
                    Thank You!
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ 
                      color: 'rgba(255,255,255,0.65)', fontSize: '1.25rem', fontWeight: 500, lineWeight: 1.6, 
                      marginBottom: '3rem', maxWidth: '440px', zIndex: 2 
                    }}
                  >
                    Your inquiry has been received. Our team will review your message and connect with you shortly.
                  </motion.p>
                  
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05, y: -2, background: 'rgba(255,255,255,0.12)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetForm}
                    style={{
                      padding: '1.1rem 3.5rem', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1rem', fontWeight: 800, 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', zIndex: 2
                    }}
                  >
                    Close Window <ChevronRight size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Info - Hidden when submitted */}
          {!isSubmitted && (
            <div className="contact-info-panel" style={{ 
              background: 'linear-gradient(180deg, rgba(244,196,0,0.05) 0%, rgba(14,165,233,0.03) 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', gap: '3rem'
            }}>
            {/* Contact Details */}
            <section>
              <h4 style={sectionHeaderStyle}>Contact Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={infoRowStyle}>
                  <div style={iconBoxStyle}><Mail size={16} /></div>
                  <div>
                    <div style={infoLabelStyle}>Email</div>
                    <div style={infoValueStyle}>support@yourapp.com</div>
                  </div>
                </div>
                <div style={infoRowStyle}>
                  <div style={iconBoxStyle}><Phone size={16} /></div>
                  <div>
                    <div style={infoLabelStyle}>Phone</div>
                    <div style={infoValueStyle}>+91 XXXXX XXXXX</div>
                  </div>
                </div>
                <div style={infoRowStyle}>
                  <div style={iconBoxStyle}><MapPin size={16} /></div>
                  <div>
                    <div style={infoLabelStyle}>Location</div>
                    <div style={infoValueStyle}>Chennai, India</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Help */}
            <section>
              <h4 style={sectionHeaderStyle}>Need Quick Help?</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['How to upload resume', 'How to schedule interview', 'How to view results'].map(help => (
                  <button key={help} style={helpLinkStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <HelpCircle size={14} color="#F4C400" />
                      {help}
                    </div>
                    <ChevronRight size={14} opacity={0.3} />
                  </button>
                ))}
              </div>
            </section>

            {/* Social Links */}
            <section style={{ marginTop: 'auto' }}>
              <h4 style={sectionHeaderStyle}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { Icon: Linkedin, href: '#' },
                  { Icon: Github, href: '#' },
                  { Icon: Twitter, href: '#' }
                ].map(({ Icon, href }, i) => (
                  <a key={i} href={href} style={socialIconStyle}>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </section>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* --- Styled Utility Constants --- */

const labelStyle = { 
  display: 'block', 
  fontSize: '0.8rem', 
  fontWeight: 700, 
  color: 'rgba(255,255,255,0.4)', 
  textTransform: 'uppercase', 
  marginBottom: '0.5rem', 
  marginLeft: '0.5rem' 
};

const inputStyle = {
  width: '100%',
  padding: '0 1.25rem',
  height: '52px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '0.95rem',
  fontWeight: 500,
  outline: 'none',
  transition: 'all 0.3s ease'
};

const sectionHeaderStyle = {
  fontSize: '0.8rem',
  fontWeight: 800,
  color: 'rgba(255,255,255,0.4)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: '1.5rem'
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const iconBoxStyle = {
  width: '38px', height: '38px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F4C400'
};

const infoLabelStyle = { fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '1px' };
const infoValueStyle = { fontSize: '0.95rem', fontWeight: 700, color: '#fff' };

const helpLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.85rem 1rem',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'left'
};

const socialIconStyle = {
  width: '44px', height: '44px', borderRadius: '12px',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'rgba(255,255,255,0.5)', transition: 'all 0.3s ease'
};

export default ContactModal;
