import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { getTemplates, useTemplate } from '../services/templateService';
import { Search, ShieldCheck, Sparkles, Filter, CheckCircle } from 'lucide-react';

const fallbackTemplates = [
  {
    _id: 'modern_tpl',
    name: 'Modern ATS Template',
    category: 'Technology',
    industry: 'Software Engineering & IT',
    description: 'Clean single and multi-column layout with vibrant accents, highly recommended for technical roles.',
    atsScore: 98,
    layout: { layout: 'modern', color: '#0284c7', columns: 2 }
  },
  {
    _id: 'executive_tpl',
    name: 'Executive Leadership Template',
    category: 'Business',
    industry: 'Management & Corporate',
    description: 'Authoritative, elegant serif-infused header structure for directors, VPs, and senior executives.',
    atsScore: 96,
    layout: { layout: 'executive', color: '#1e293b', columns: 1 }
  },
  {
    _id: 'creative_tpl',
    name: 'Creative Portfolio Template',
    category: 'Marketing',
    industry: 'Design, UX & Media',
    description: 'Bold sidebar layout with skill progress bars and project highlight blocks.',
    atsScore: 94,
    layout: { layout: 'creative', color: '#7c3aed', columns: 2 }
  },
  {
    _id: 'professional_tpl',
    name: 'Professional Standard Template',
    category: 'Finance',
    industry: 'Accounting, Banking & Legal',
    description: 'Classic horizontal dividers, clean typography, 100% compliant with enterprise ATS scanners.',
    atsScore: 99,
    layout: { layout: 'professional', color: '#0f172a', columns: 1 }
  },
  {
    _id: 'minimal_tpl',
    name: 'Minimalist Sleek Template',
    category: 'Education',
    industry: 'Research, Academia & General',
    description: 'Ultra-clean, distraction-free layout focusing strictly on experience and measurable achievements.',
    atsScore: 95,
    layout: { layout: 'minimal', color: '#334155', columns: 1 }
  }
];

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Technology',
    'Business',
    'Marketing',
    'Finance',
    'Education'
  ];

  useEffect(() => {
    const fetchTemplatesData = async () => {
      try {
        const res = await getTemplates();
        if (res.data && res.data.data && res.data.data.length > 0) {
          setTemplates(res.data.data);
        } else {
          setTemplates(fallbackTemplates);
        }
      } catch (error) {
        console.error('Error fetching templates, using fallback:', error);
        setTemplates(fallbackTemplates);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplatesData();
  }, []);

  const handleUseTemplate = (template) => {
    const layoutName = (template.layout?.layout || template.name || 'modern').toLowerCase();
    const editorRouteMap = {
      executive:    '/editor/executive',
      creative:     '/editor/creative',
      modern:       '/editor/modern',
      professional: '/editor/professional',
      minimal:      '/editor/minimal',
    };
    const editorRoute = editorRouteMap[layoutName] || '/editor/modern';

    const newSessionId = 'session_' + Date.now();
    localStorage.setItem('activeResumeSessionId', newSessionId);
    navigate(`${editorRoute}/${newSessionId}`);
  };

  // Filter & Search Logic
  const filteredTemplates = templates.filter(tpl => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(6, 182, 212, 0.15)',
            color: '#22d3ee',
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '1.25rem'
          }}>SaaS Resume Gallery</span>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            ATS-Optimized Professional Templates
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Choose from our recruiter-vetted designs. Instantly editable, ATS-compatible, and fully customizable.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 1.5rem' }}>
        
        {/* Controls: Search & Categories */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          marginBottom: '3rem',
          background: 'white',
          padding: '1.5rem',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
            <input
              type="text"
              placeholder="Search by role, industry, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3.5rem',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0056b8';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 86, 184, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '0.5rem' }}>
              <Filter size={16} /> Filter by Category:
            </span>
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '50px',
                    border: '1px solid #e2e8f0',
                    background: isActive ? '#0056b8' : 'white',
                    color: isActive ? 'white' : '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 4px 12px rgba(0, 86, 184, 0.2)' : 'none'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #0056b8', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#475569', fontWeight: 800 }}>Loading templates...</h3>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTemplates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 1.5rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 900, marginBottom: '0.5rem' }}>No templates found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Try modifying your search keywords or choosing a different category filter.</p>
          </div>
        )}

        {/* Templates Grid */}
        {!loading && filteredTemplates.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl._id}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  border: '2px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#0056b8';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 35px rgba(0, 86, 184, 0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Template Graphic Preview Area */}
                <div style={{
                  background: '#f8fafc',
                  height: '180px',
                  borderBottom: '1px solid #e2e8f0',
                  position: 'relative',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Dynamic Graphic Preview based on layout configs */}
                  <div style={{
                    background: 'white',
                    borderRadius: '10px',
                    width: '100%',
                    height: '100%',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ height: '14px', width: '50%', background: tpl.layout?.color || '#0056b8', borderRadius: '4px' }} />
                      <div style={{ height: '14px', width: '14px', borderRadius: '50%', background: '#cbd5e1' }} />
                    </div>
                    <div style={{ height: '6px', width: '30%', background: '#cbd5e1', borderRadius: '2px' }} />
                    <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                    <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '2px' }} />
                        <div style={{ height: '18px', background: '#f1f5f9', borderRadius: '2px' }} />
                      </div>
                      {tpl.layout?.columns > 1 && (
                        <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '2px' }} />
                          <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '2px' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ATS Score Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    background: 'rgba(15, 23, 42, 0.85)',
                    color: 'white',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backdropFilter: 'blur(4px)'
                  }}>
                    <ShieldCheck size={12} color="#10b981" />
                    <span>ATS Score: {tpl.atsScore}%</span>
                  </div>
                </div>

                {/* Template Info */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{tpl.name}</h3>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0056b8', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {tpl.category}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{tpl.description}</p>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => navigate(`/preview/${tpl._id}`)}
                      style={{
                        flex: 1,
                        background: 'none',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleUseTemplate(tpl)}
                      style={{
                        flex: 1,
                        background: '#0056b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 86, 184, 0.12)',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                      onMouseLeave={e => e.currentTarget.style.opacity = 1}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
