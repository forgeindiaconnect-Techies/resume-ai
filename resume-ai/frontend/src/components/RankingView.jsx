import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap, TrendingUp, User, ChevronRight } from 'lucide-react';

const RankingView = ({ candidates, onSelectCandidate }) => {
  const sortedCandidates = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>AI Candidate <span className="gradient-text">Ranking</span></h2>
        <div style={{ background: 'rgba(255,255,190,0.1)', border: '1px solid rgba(255,215,0,0.3)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={16} /> DATA-DRIVEN INSIGHTS
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {sortedCandidates.map((can, i) => (
          <motion.div
            key={can.id || i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="glass-card"
            style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', border: i === 0 ? '2px solid var(--primary)' : '1px solid var(--glass-border)' }}
          >
            {i === 0 && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--grad-main)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={12} /> TOP MATCH
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'var(--grad-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>{can.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{can.role || 'General Role'}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>AI Score</p>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: can.score > 80 ? '#10b981' : can.score > 50 ? 'var(--primary)' : '#ef4444' }}>{can.score}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Match %</p>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{can.matchPercentage}%</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Target size={14} className="gradient-text" /> KEY SKILLS
              </h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(can.matchedSkills || []).slice(0, 4).map((skill, si) => (
                  <span key={si} style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '0.7rem', fontWeight: 700, border: '1px solid var(--glass-border)' }}>
                    {typeof skill === 'object' ? skill.name : skill}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => onSelectCandidate && onSelectCandidate(can)}
              className="gradient-btn-outline button-pulse" 
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              VIEW FULL PROFILE <ChevronRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RankingView;
