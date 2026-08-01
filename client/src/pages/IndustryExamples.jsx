import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { resumeCategories, resumeExamples as fallbackResumeExamples } from '../data/resumeExamples';
import { getExamples } from '../services/exampleService';
import ProfessionalLayout from '../components/layouts/ProfessionalLayout';
import ModernLayout from '../components/layouts/ModernLayout';
import MinimalLayout from '../components/layouts/MinimalLayout';
import ExecutiveLayout from '../components/layouts/ExecutiveLayout';
import CreativeLayout from '../components/layouts/CreativeLayout';
import { 
  Briefcase, Palette, BookOpen, Settings, DollarSign, 
  Activity, Laptop, TrendingUp, Target, Sparkles, ArrowRight, ShieldCheck,
  Search, Maximize2, X, Layers, ArrowUp, ArrowDown
} from 'lucide-react';

const iconMap = {
  Briefcase: Briefcase,
  Palette: Palette,
  BookOpen: BookOpen,
  Settings: Settings,
  DollarSign: DollarSign,
  Activity: Activity,
  Laptop: Laptop,
  TrendingUp: TrendingUp,
  Target: Target
};

const templateOptions = [
  { id: 'modern', name: 'Modern' },
  { id: 'professional', name: 'Professional' },
  { id: 'executive', name: 'Executive' },
  { id: 'creative', name: 'Creative' },
  { id: 'minimal', name: 'Minimal' }
];

const IndustryExamples = () => {
  const navigate = useNavigate();
  const previewRef = useRef(null);

  // States
  const [dbExamples, setDbExamples] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Business');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayoutOverride, setActiveLayoutOverride] = useState(null);
  const [showFullModal, setShowFullModal] = useState(false);

  // Fetch examples from MongoDB API on mount
  useEffect(() => {
    const fetchApiExamples = async () => {
      const data = await getExamples();
      if (data && data.length > 0) {
        setDbExamples(data);
      }
    };
    fetchApiExamples();
  }, []);

  // Compute merged examples map
  const currentResumeExamples = useMemo(() => {
    if (dbExamples.length === 0) return fallbackResumeExamples;
    
    const map = {};
    dbExamples.forEach(item => {
      const cat = item.category || 'Business';
      if (!map[cat]) map[cat] = [];
      map[cat].push({
        id: item._id || item.id,
        title: item.title,
        category: item.category,
        experience: item.experienceLevel || '2-5 Years',
        atsScore: item.atsScore || 95,
        templateId: item.template || 'modern',
        description: item.description || `Professional ${item.title} resume example tailored for ${cat} positions.`,
        resumeData: {
          name: item.resumeData?.personalInfo?.fullName || 'John Smith',
          role: item.resumeData?.personalInfo?.role || item.title,
          contact: {
            email: item.resumeData?.personalInfo?.email || 'user@forgeindiaconnect.app',
            phone: item.resumeData?.personalInfo?.phone || '+1 (555) 000-0000',
            location: item.resumeData?.personalInfo?.location || 'New York, NY',
            linkedin: item.resumeData?.personalInfo?.linkedin || '',
            github: item.resumeData?.personalInfo?.github || ''
          },
          objective: item.resumeData?.summary || item.resumeData?.personalInfo?.summary || `Dedicated ${item.title} with proven industry results.`,
          skills: {
            languages: (item.resumeData?.skills || []).join(', '),
            frameworks: '',
            tools: ''
          },
          experience: (item.resumeData?.experience || []).map(exp => ({
            title: exp.title || item.title,
            company: exp.company || 'Enterprise Solutions',
            duration: exp.duration || '2021 - Present',
            desc: exp.desc || exp.description || ''
          })),
          education: item.resumeData?.education || [],
          projects: item.resumeData?.projects || []
        }
      });
    });

    // Merge fallback categories if DB doesn't have them yet
    Object.keys(fallbackResumeExamples).forEach(cat => {
      if (!map[cat]) {
        map[cat] = fallbackResumeExamples[cat];
      }
    });

    return map;
  }, [dbExamples]);

  const activeCategoryRoles = useMemo(() => {
    return currentResumeExamples[selectedCategory] || currentResumeExamples['Business'] || [];
  }, [selectedCategory, currentResumeExamples]);

  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return activeCategoryRoles;
    const q = searchQuery.toLowerCase();
    return activeCategoryRoles.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.description.toLowerCase().includes(q)
    );
  }, [activeCategoryRoles, searchQuery]);

  const [selectedRole, setSelectedRole] = useState(activeCategoryRoles[0] || null);

  useEffect(() => {
    if (activeCategoryRoles.length > 0) {
      setSelectedRole(activeCategoryRoles[0]);
    }
  }, [selectedCategory, currentResumeExamples]);

  const handleSelectCategory = (catName) => {
    setSelectedCategory(catName);
    setSearchQuery('');
    setActiveLayoutOverride(null);
  };

  const handleUseTemplate = (roleObj) => {
    const activeLayout = activeLayoutOverride || roleObj?.templateId || 'modern';

    // Map template IDs to the correct dynamic editor route
    const editorRouteMap = {
      executive:    '/editor/executive',
      creative:     '/editor/creative',
      modern:       '/editor/modern',
      professional: '/editor/professional',
      minimal:      '/editor/minimal',
    };
    const editorRoute = editorRouteMap[activeLayout] || '/editor/modern';

    const sessionData = {
      title: roleObj?.title || 'Resume Draft',
      department: selectedCategory,
      templateId: activeLayout,
      personalInfo: {
        name: roleObj?.resumeData?.name || '',
        role: roleObj?.resumeData?.role || roleObj?.title || '',
        email: roleObj?.resumeData?.contact?.email || '',
        phone: roleObj?.resumeData?.contact?.phone || '',
        location: roleObj?.resumeData?.contact?.location || '',
        linkedin: roleObj?.resumeData?.contact?.linkedin || '',
        github: roleObj?.resumeData?.contact?.github || '',
        portfolio: '',
        summary: roleObj?.resumeData?.objective || ''
      },
      skills: {
        programming: (roleObj?.resumeData?.skills?.languages || '').split(',').map(s => s.trim()).filter(Boolean),
        frameworks:  (roleObj?.resumeData?.skills?.frameworks || '').split(',').map(s => s.trim()).filter(Boolean),
        databases:   (roleObj?.resumeData?.skills?.tools || '').split(',').map(s => s.trim()).filter(Boolean),
      },
      experience: (roleObj?.resumeData?.experience || []).map(e => ({
        title: e.title || '',
        company: e.company || '',
        duration: e.duration || '',
        desc: e.desc || '',
      })),
      education: (roleObj?.resumeData?.education || []).map(e => ({
        degree: e.degree || '',
        institution: e.institution || e.school || '',
        tenure: e.tenure || e.year || '',
      })),
      projects: (roleObj?.resumeData?.projects || []).map(p => ({
        name: p.name || p.title || '',
        technology: p.technology || '',
        desc: p.desc || p.description || '',
        github: p.github || '',
        liveDemo: p.liveDemo || '',
      })),
    };

    const newSessionId = 'session_' + Date.now();
    localStorage.setItem('activeResumeSessionId', newSessionId);
    localStorage.setItem(`resume_draft_${newSessionId}`, JSON.stringify(sessionData));

    navigate(`${editorRoute}/${newSessionId}`);
  };


  const scrollPreview = (direction) => {
    if (previewRef.current) {
      const amount = direction === 'down' ? 350 : -350;
      previewRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  const renderLayoutComponent = (roleObj) => {
    if (!roleObj || !roleObj.resumeData) return null;
    const tId = (activeLayoutOverride || roleObj.templateId || 'modern').toLowerCase();
    const props = {
      data: roleObj.resumeData,
      role: roleObj.resumeData.role,
      customColor: '#0284c7',
      customFont: "'Inter', sans-serif"
    };

    switch (tId) {
      case 'professional':
        return <ProfessionalLayout {...props} />;
      case 'modern':
        return <ModernLayout {...props} />;
      case 'minimal':
        return <MinimalLayout {...props} />;
      case 'executive':
        return <ExecutiveLayout {...props} />;
      case 'creative':
        return <CreativeLayout {...props} />;
      default:
        return <ModernLayout {...props} />;
    }
  };

  const currentRole = selectedRole || filteredRoles[0] || activeCategoryRoles[0];

  return (
    <div style={{ 
      height: '100vh', 
      maxHeight: '100vh',
      overflow: 'hidden', 
      background: '#f8fafc', 
      color: '#0f172a', 
      fontFamily: "'Inter', sans-serif", 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Fixed Navbar (No Outer Scroll) */}
      <div style={{ flexShrink: 0 }}>
        <Navbar />
      </div>

      {/* Fixed Header Banner (No Outer Scroll) */}
      <div style={{ flexShrink: 0, padding: '1.15rem 2.5rem 0.95rem', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '0.15rem' }}>
              FORGE INDIA CONNECT STYLE GUIDE
            </span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {selectedCategory} Industry Resume Examples
            </h1>
            <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.84rem' }}>
              Browse real-world resume examples. Click any role to test different layouts and launch directly into the builder.
            </p>
          </div>

          <button
            onClick={() => handleUseTemplate(currentRole)}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '24px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
            }}
          >
            <Sparkles size={16} /> Use Selected Template
          </button>
        </div>
      </div>

      {/* 3 Independent Internal Scroll Columns Container */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        
        {/* Column 1: Left Categories Sidebar (Independent Scroll) */}
        <div style={{ 
          width: '230px', 
          background: 'white', 
          borderRight: '1px solid #e2e8f0', 
          padding: '1rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          overflowY: 'auto',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem 0.4rem' }}>
            Categories
          </span>
          {resumeCategories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Briefcase;
            const isActive = selectedCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: `1px solid ${isActive ? '#bae6fd' : 'transparent'}`,
                  background: isActive ? '#e0f2fe' : 'transparent',
                  color: isActive ? '#0284c7' : '#475569',
                  fontSize: '0.83rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.color = '#0f172a';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                <IconComponent size={16} color={isActive ? '#0284c7' : '#64748b'} />
                <span style={{ flex: 1 }}>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Column 2: Middle Resume Roles List (Independent Scroll) */}
        <div style={{ 
          width: '330px', 
          background: '#f8fafc', 
          borderRight: '1px solid #e2e8f0', 
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          overflowY: 'auto',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Quick Search Filter */}
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={`Search ${selectedCategory} roles...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                outline: 'none',
                background: 'white',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.1rem 0' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>
              {selectedCategory} Roles
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '0.15rem 0.5rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
              {filteredRoles.length} Available
            </span>
          </div>

          {filteredRoles.length > 0 ? (
            filteredRoles.map((roleObj) => {
              const isSelected = currentRole?.id === roleObj.id;

              return (
                <div
                  key={roleObj.id}
                  onClick={() => {
                    setSelectedRole(roleObj);
                    setActiveLayoutOverride(null);
                  }}
                  style={{
                    padding: '0.95rem',
                    borderRadius: '12px',
                    border: `1.5px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                    background: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? '0 4px 14px rgba(2,132,199,0.18)' : '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: isSelected ? '#0284c7' : '#0f172a' }}>
                      {roleObj.title}
                    </h3>
                    <span style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: 900, 
                      color: '#059669', 
                      background: '#d1fae5', 
                      padding: '0.15rem 0.45rem', 
                      borderRadius: '4px',
                      border: '1px solid #a7f3d0'
                    }}>
                      {roleObj.atsScore}/100 ATS
                    </span>
                  </div>

                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {roleObj.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.72rem', color: '#64748b' }}>
                    <span>Exp: {roleObj.experience}</span>
                    <span style={{ color: isSelected ? '#0284c7' : '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Preview <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textTransform: 'none', color: '#64748b', fontSize: '0.82rem', textAlign: 'center', padding: '2rem 1rem' }}>
              No roles matching "{searchQuery}".
            </div>
          )}
        </div>

        {/* Column 3: Right Large Resume Preview (Independent Scroll) */}
        <div 
          ref={previewRef}
          style={{ 
            flex: 1, 
            background: '#f1f5f9', 
            padding: '1rem 2rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            height: '100%',
            scrollBehavior: 'smooth',
            boxSizing: 'border-box'
          }}
        >
          {currentRole ? (
            <div style={{ maxWidth: '820px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Interactive Toolbar Header + Preview Scroll Controls */}
              <div style={{ 
                background: 'white', 
                padding: '0.85rem 1.25rem', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                        {currentRole.title}
                      </h2>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        color: '#059669', 
                        background: '#d1fae5', 
                        padding: '0.15rem 0.5rem', 
                        borderRadius: '10px',
                        border: '1px solid #a7f3d0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <ShieldCheck size={12} /> {currentRole.atsScore}/100 ATS Score
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem', display: 'block' }}>
                      {selectedCategory} • {currentRole.experience} Experience
                    </span>
                  </div>

                  {/* Scroll & View Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    
                    {/* Dedicated Preview Scroll Buttons */}
                    <div style={{ display: 'flex', gap: '2px', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <button
                        title="Scroll Up Resume"
                        onClick={() => scrollPreview('up')}
                        style={{
                          padding: '0.35rem 0.55rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'white',
                          color: '#0284c7',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        title="Scroll Down Resume"
                        onClick={() => scrollPreview('down')}
                        style={{
                          padding: '0.35rem 0.55rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'white',
                          color: '#0284c7',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => setShowFullModal(true)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: 'white',
                        color: '#475569',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Maximize2 size={14} /> Full Screen
                    </button>

                    <button
                      onClick={() => handleUseTemplate(currentRole)}
                      style={{
                        padding: '0.5rem 1.3rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 4px 12px rgba(2,132,199,0.25)'
                      }}
                    >
                      <Sparkles size={15} /> Use Template
                    </button>
                  </div>
                </div>

                {/* Template Layout Switcher Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={13} /> Switch Design:
                  </span>
                  {templateOptions.map((tOpt) => {
                    const activeT = (activeLayoutOverride || currentRole.templateId || 'modern').toLowerCase() === tOpt.id;
                    return (
                      <button
                        key={tOpt.id}
                        onClick={() => setActiveLayoutOverride(tOpt.id)}
                        style={{
                          padding: '0.22rem 0.6rem',
                          borderRadius: '16px',
                          border: `1px solid ${activeT ? '#0284c7' : '#e2e8f0'}`,
                          background: activeT ? '#e0f2fe' : 'white',
                          color: activeT ? '#0284c7' : '#64748b',
                          fontSize: '0.73rem',
                          fontWeight: activeT ? 800 : 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {tOpt.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Resume Sheet Paper Preview */}
              <div style={{
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                minHeight: '650px',
                border: '1px solid #cbd5e1'
              }}>
                {renderLayoutComponent(currentRole)}
              </div>

              {/* Bottom Call to Action */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0 2.5rem' }}>
                <button
                  onClick={() => handleUseTemplate(currentRole)}
                  style={{
                    padding: '0.75rem 2.2rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                    color: 'white',
                    fontSize: '0.92rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 6px 18px rgba(2,132,199,0.3)'
                  }}
                >
                  <Sparkles size={18} /> Use This Template Now
                </button>
              </div>

            </div>
          ) : null}
        </div>

      </div>

      {/* Full Screen Modal View */}
      {showFullModal && currentRole && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          overflowY: 'auto'
        }}>
          <div style={{ width: '100%', maxWidth: '850px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>
              {currentRole.title} Preview
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => handleUseTemplate(currentRole)}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Use Template
              </button>
              <button
                onClick={() => setShowFullModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', width: '100%', maxWidth: '850px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            {renderLayoutComponent(currentRole)}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryExamples;
