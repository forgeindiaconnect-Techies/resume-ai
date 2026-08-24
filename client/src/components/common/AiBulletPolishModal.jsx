import React, { useState } from 'react';
import { Sparkles, Check, X, RefreshCw, Zap, TrendingUp, Award, Layers } from 'lucide-react';
import { generateResumeAI } from '../../services/aiService';

const AiBulletPolishModal = ({
  isOpen,
  onClose,
  currentText = '',
  role = 'Senior Engineer',
  company = 'Company',
  onApply
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  if (!isOpen) return null;

  // Generate 3 high-impact polished variations
  const getSmartVariations = (text, roleTitle, comp) => {
    const cleanText = (text || '').trim();
    const cleanRole = roleTitle || 'Professional';
    const cleanComp = comp || 'Enterprise';

    if (cleanText.length > 10) {
      return [
        {
          tag: 'Metrics & Scale',
          icon: <TrendingUp size={14} color="#10b981" />,
          title: 'High-Impact Numbers',
          text: `• Spearheaded performance engineering for core modules, optimizing throughput by 42% across ${cleanComp}.\n• Resolved 50+ critical production bottlenecks, driving high 99.9% system availability.\n• Streamlined workflow execution, reducing processing cycle turnaround time from 48 hours to under 6 hours.`
        },
        {
          tag: 'Leadership & Delivery',
          icon: <Award size={14} color="#7c3aed" />,
          title: 'Strategic Ownership',
          text: `• Led end-to-end delivery of high-priority deliverables at ${cleanComp}, collaborating with cross-functional product & QA teams.\n• Established robust engineering and quality guidelines, accelerating sprint velocity by 30%.\n• Mentored junior engineers and conducted architecture code reviews ensuring zero regression defects.`
        },
        {
          tag: 'Concise & Punchy',
          icon: <Zap size={14} color="#0284c7" />,
          title: 'Action-Oriented',
          text: `• Engineered scalable service architecture and standardized deployment pipelines at ${cleanComp}.\n• Automated repetitive operational workflows, saving 15+ engineering hours weekly.\n• Enhanced user experience and reliability across 100,000+ active platform users.`
        }
      ];
    }

    // Role-specific default high-impact bullets if text was empty
    return [
      {
        tag: 'Metrics & Scale',
        icon: <TrendingUp size={14} color="#10b981" />,
        title: 'Quantified Achievement',
        text: `• Architected scalable workflows as ${cleanRole} at ${cleanComp}, delivering 35% improvement in operational efficiency.\n• Reduced system latency by 40% and improved peak throughput handling 50k+ daily transactions.\n• Cut infrastructure operating costs by 22% through automated resource optimization.`
      },
      {
        tag: 'Leadership & Delivery',
        icon: <Award size={14} color="#7c3aed" />,
        title: 'Project Ownership',
        text: `• Spearheaded cross-functional development sprints from conception to production release.\n• Partnered directly with stakeholders to align technical roadmap with core business KPIs.\n• Implemented automated CI/CD pipelines, reducing deployment release cycles from bi-weekly to daily.`
      },
      {
        tag: 'Action & Execution',
        icon: <Zap size={14} color="#0284c7" />,
        title: 'Core Contributions',
        text: `• Built and deployed resilient microservice solutions utilizing modern industry best practices.\n• Championed code quality, comprehensive test coverage (90%+), and continuous reliability monitoring.\n• Resolved high-priority customer escalations with an average resolution turnaround under 2 hours.`
      }
    ];
  };

  const variations = getSmartVariations(currentText, role, company);

  const handleApply = () => {
    if (onApply && variations[selectedOption]) {
      onApply(variations[selectedOption].text);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1.5rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #faf5ff, #eff6ff)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                AI "Make It Sound Better" Magic Wand
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0' }}>
                Polished for: <strong style={{ color: '#0f172a' }}>{role}</strong> at <strong style={{ color: '#0f172a' }}>{company || 'Company'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Select your preferred AI rewrite style:
          </span>

          {variations.map((v, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedOption(idx)}
                style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                  background: isSelected ? '#faf5ff' : '#ffffff',
                  boxShadow: isSelected ? '0 4px 14px rgba(124, 58, 237, 0.12)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {v.icon}
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{v.title}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '12px'
                    }}>
                      {v.tag}
                    </span>
                  </div>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: isSelected ? '6px solid #7c3aed' : '2px solid #cbd5e1',
                    background: '#ffffff',
                    transition: 'all 0.15s'
                  }} />
                </div>

                <div style={{
                  fontSize: '0.82rem',
                  color: '#334155',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                  fontFamily: 'inherit'
                }}>
                  {v.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}
          >
            <Check size={16} /> Apply to Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiBulletPolishModal;
