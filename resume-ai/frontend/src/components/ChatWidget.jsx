import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Minimize2, Maximize2 } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your AI Recruitment Assistant. How can I help you today?", sender: 'bot', time: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      time: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getAIResponse(inputValue),
        sender: 'bot',
        time: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('help')) return "I can help you analyze resumes, check job matches, or schedule interviews. What would you like to do first?";
    if (q.includes('resume')) return "To analyze a resume, just head to the 'Analyzer' tab and upload your file. I'll provide a detailed score and skill breakdown.";
    if (q.includes('interview')) return "You can schedule interviews for candidates in the 'Reports' or 'Pipeline' view by clicking the 'Schedule' button.";
    if (q.includes('hello') || q.includes('hi')) return "Hello! Hope your recruitment process is going smoothly. How can I assist?";
    return "That's interesting! I'm still learning, but I can definitely help with resume ranking and candidate insights. Try asking about 'Resume Analysis'!";
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10000, fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            whileHover={{ scale: 1.1, boxShadow: '0 10px 25px rgba(244, 196, 0, 0.4)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F4C400 0%, #FFCC00 100%)',
              border: 'none',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }}
          >
            <MessageSquare size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '80px' : '520px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              width: '380px',
              background: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '1.25rem 1.5rem', 
              background: '#001f3f', 
              color: '#fff', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={22} color="#F4C400" />
                  </div>
                  <div style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, background: '#10b981', borderRadius: '50%', border: '2px solid #001f3f' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>ATS Assistant</h4>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Always Active</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '4px' }}
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div style={{ 
                  flex: 1, 
                  padding: '1.5rem', 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  background: '#f8fafc'
                }}>
                  {messages.map((msg) => (
                    <div key={msg.id} style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      width: '100%'
                    }}>
                      <div style={{ 
                        maxWidth: '85%', 
                        padding: '0.8rem 1.1rem', 
                        borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                        background: msg.sender === 'user' ? '#001f3f' : '#ffffff',
                        color: msg.sender === 'user' ? '#fff' : '#1e293b',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        boxShadow: msg.sender === 'user' ? '0 5px 15px rgba(0,31,63,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                        border: msg.sender === 'bot' ? '1px solid rgba(0,0,0,0.05)' : 'none'
                      }}>
                        {msg.text}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>
                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: 'flex', gap: '4px', padding: '8px' }}>
                      {[0, 1, 2].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                          style={{ width: 6, height: 6, background: '#F4C400', borderRadius: '50%' }} 
                        />
                      ))}
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Footer Input */}
                <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)', background: '#fff' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    background: '#f1f5f9',
                    padding: '8px 12px',
                    borderRadius: '16px'
                  }}>
                    <input 
                      type="text" 
                      placeholder="Type your question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      style={{ 
                        flex: 1, 
                        border: 'none', 
                        background: 'transparent', 
                        outline: 'none', 
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: '#1e293b'
                      }}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      style={{ 
                        background: '#001f3f', 
                        color: '#fff', 
                        border: 'none', 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        opacity: inputValue.trim() ? 1 : 0.5
                      }}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
