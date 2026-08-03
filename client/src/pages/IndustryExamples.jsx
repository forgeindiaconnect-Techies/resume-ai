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
  Search, Maximize2, X, Layers, ArrowUp, ArrowDown, Edit3, ExternalLink
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

const formatRoleItem = (item, category) => {
  const rawTitle = item.title || item.name || `${category} Professional`;
  const rData = item.resumeData || {};
  const pInfo = rData.personalInfo || {};

  const name = pInfo.fullName || pInfo.name || rData.name || 'Alexander Wright';
  const role = pInfo.role || rData.role || rawTitle;

  // Contact
  const contact = {
    email: pInfo.email || rData.contact?.email || 'user@forgeindiaconnect.app',
    phone: pInfo.phone || rData.contact?.phone || '+1 (555) 000-0000',
    location: pInfo.location || rData.contact?.location || 'New York, NY',
    linkedin: pInfo.linkedin || rData.contact?.linkedin || '',
    github: pInfo.github || rData.contact?.github || ''
  };

  // Summary / Objective
  const rawSummary = rData.summary || rData.objective || pInfo.summary;
  const objective = (rawSummary && typeof rawSummary === 'string' && !rawSummary.includes('undefined')) 
    ? rawSummary 
    : `Accomplished and results-driven ${rawTitle} with over 5+ years of specialized experience in ${category} operations, team leadership, and strategic planning. Proven track record of spearheading high-impact organizational initiatives, boosting department efficiency by up to 35%, and consistently delivering measurable business outcomes under budget.`;

  // Skills
  let skillsObj = { languages: '', frameworks: '', tools: '' };
  if (rData.skills) {
    if (typeof rData.skills === 'object' && !Array.isArray(rData.skills)) {
      skillsObj.languages = Array.isArray(rData.skills.languages) 
        ? rData.skills.languages.join(', ') 
        : (rData.skills.languages || (rData.skills.programming ? rData.skills.programming.join(', ') : ''));
      
      skillsObj.frameworks = Array.isArray(rData.skills.frameworks) 
        ? rData.skills.frameworks.join(', ') 
        : (rData.skills.frameworks || '');

      skillsObj.tools = Array.isArray(rData.skills.tools) 
        ? rData.skills.tools.join(', ') 
        : (rData.skills.tools || (rData.skills.databases ? rData.skills.databases.join(', ') : ''));
    } else if (Array.isArray(rData.skills)) {
      skillsObj.languages = rData.skills.join(', ');
    } else if (typeof rData.skills === 'string') {
      skillsObj.languages = rData.skills;
    }
  }
  if (!skillsObj.languages && !skillsObj.frameworks && !skillsObj.tools) {
    skillsObj.languages = `${rawTitle} Architecture, Strategic Leadership, ${category} Operations, Problem Solving`;
    skillsObj.frameworks = `Agile Methodologies, Process Optimization, Performance Metrics, SOP Standardisation`;
    skillsObj.tools = `Analytics Dashboards, Enterprise Resource Tools, JIRA, SQL, Tableau`;
  }

  // Experience
  let experience = [];
  if (Array.isArray(rData.experience) && rData.experience.length > 0) {
    experience = rData.experience.map(exp => ({
      title: exp.title || exp.role || rawTitle,
      company: exp.company || 'Global Enterprise Solutions Inc.',
      duration: exp.duration || exp.period || '2021 - Present',
      desc: exp.desc || exp.description || (Array.isArray(exp.points) ? exp.points.join('\n• ') : 'Spearheaded key department initiatives resulting in 25% YoY operational efficiency improvements.')
    }));
  } else {
    experience = [
      {
        title: `Senior ${rawTitle}`,
        company: 'Global Operations Inc.',
        duration: '2021 - Present',
        desc: `• Led cross-functional team of 12+ specialists delivering core ${category} projects on schedule with 99% audit accuracy.\n• Optimized workflow processes and automated tracking systems to reduce project turnaround time by 32%.\n• Managed multi-year budgets exceeding $3.5M, saving $150K annually through vendor negotiation.`
      },
      {
        title: `${rawTitle}`,
        company: 'Apex Solutions LLC',
        duration: '2018 - 2021',
        desc: `• Managed client deliverables and key operational metrics, maintaining a 98% customer satisfaction rating.\n• Introduced standardized SOP training manuals adopted by 4 regional branches.`
      }
    ];
  }

  // Education
  let education = [];
  if (Array.isArray(rData.education) && rData.education.length > 0) {
    education = rData.education.map(e => ({
      degree: e.degree || `B.S. in ${category} & Applied Sciences`,
      institution: e.institution || e.school || 'Northwestern University',
      tenure: e.tenure || e.year || '2014 - 2018',
      cgpa: e.cgpa || '3.8 / 4.0'
    }));
  } else {
    education = [
      { degree: `B.S. in ${category} & Management`, institution: 'Northwestern University', tenure: '2014 - 2018', cgpa: '3.8 / 4.0' }
    ];
  }

  // Projects
  let projects = [];
  if (Array.isArray(rData.projects) && rData.projects.length > 0) {
    projects = rData.projects.map(p => ({
      title: p.title || p.name || `${rawTitle} Initiative`,
      technology: p.technology || 'Strategy, Data Analytics, Cloud Infrastructure',
      desc: p.desc || p.description || 'Engineered scalable system architecture delivering measurable results.'
    }));
  } else {
    projects = [
      { 
        title: `${rawTitle} Digital Transformation Platform`, 
        technology: 'Analytics, Process Automation, Agile Framework', 
        desc: 'Designed and deployed enterprise solution improving workflow tracking across departments and elevating team productivity by 28%.' 
      },
      {
        title: `Cross-Functional ${category} Integration`,
        technology: 'Data Pipelines, Executive Dashboards',
        desc: 'Streamlined legacy database structures into unified real-time reporting metrics for C-suite leaders.'
      }
    ];
  }

  return {
    id: item._id || item.id || `role_${Date.now()}_${Math.random()}`,
    title: rawTitle,
    category: category,
    experience: item.experience || item.experienceLevel || '2-5 Years',
    atsScore: item.atsScore || 96,
    templateId: item.templateId || item.template || 'modern',
    description: item.description || `Professional ${rawTitle} resume example tailored for ${category} positions.`,
    resumeData: {
      name,
      role,
      contact,
      objective,
      skills: skillsObj,
      experience,
      education,
      projects
    }
  };
};

const IndustryExamples = () => {
  const navigate = useNavigate();
  const previewRef = useRef(null);

  // States
  const [dbExamples, setDbExamples] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Business');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayoutOverride, setActiveLayoutOverride] = useState(null);
  const [showFullModal, setShowFullModal] = useState(false);
  const [hoverPreviewPaper, setHoverPreviewPaper] = useState(false);

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
    const map = {};

    // 1. Format static fallback examples for all categories
    Object.keys(fallbackResumeExamples).forEach(cat => {
      map[cat] = (fallbackResumeExamples[cat] || []).map(item => formatRoleItem(item, cat));
    });

    // 2. Merge MongoDB API examples
    if (dbExamples.length > 0) {
      dbExamples.forEach(item => {
        const cat = item.category || 'Business';
        if (!map[cat]) map[cat] = [];
        const formatted = formatRoleItem(item, cat);
        const existingIdx = map[cat].findIndex(x => x.id === formatted.id || x.title === formatted.title);
        if (existingIdx >= 0) {
          map[cat][existingIdx] = formatted;
        } else {
          map[cat].unshift(formatted);
        }
      });
    }

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
    const activeLayout = (activeLayoutOverride || roleObj?.templateId || 'modern').toLowerCase();

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
        name: roleObj?.resumeData?.name || 'Alexander Wright',
        role: roleObj?.resumeData?.role || roleObj?.title || '',
        email: roleObj?.resumeData?.contact?.email || 'user@forgeindiaconnect.app',
        phone: roleObj?.resumeData?.contact?.phone || '+1 (555) 000-0000',
        location: roleObj?.resumeData?.contact?.location || 'New York, NY',
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
        cgpa: e.cgpa || '',
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
      {/* Fixed Navbar */}
      <div style={{ flexShrink: 0 }}>
        <Navbar />
      </div>

      {/* Ultra-Professional Header Banner */}
      <div style={{ flexShrink: 0, padding: '1rem 2.5rem', borderBottom: '1px solid #e2e8f0', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.12em', background: '#e0f2fe', padding: '0.15rem 0.6rem', borderRadius: '50px', border: '1px solid #bae6fd' }}>
                FORGE INDIA CONNECT STYLE GUIDE
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={12} /> Live Template Editor Ready
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {selectedCategory} Industry Resume Templates
            </h1>
            <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.83rem' }}>
              Browse real-world examples. Click any role or template card below to test layouts and open directly in your live editor workspace.
            </p>
          </div>

          <button
            onClick={() => handleUseTemplate(currentRole)}
            style={{
              padding: '0.7rem 1.6rem',
              borderRadius: '24px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              color: 'white',
              fontSize: '0.88rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Edit3 size={16} /> Open Selected Template in Editor
          </button>
        </div>
      </div>

      {/* 3 Independent Internal Scroll Columns Container */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        
        {/* Column 1: Left Categories Sidebar */}
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

        {/* Column 2: Middle Resume Roles List */}
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
                  onDoubleClick={() => handleUseTemplate(roleObj)}
                  style={{
                    padding: '0.95rem',
                    borderRadius: '12px',
                    border: `1.5px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                    background: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? '0 4px 14px rgba(2,132,199,0.18)' : '0 2px 4px rgba(0,0,0,0.02)',
                    position: 'relative'
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

                  <p style={{ margin: '0 0 0.65rem', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {roleObj.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Exp: {roleObj.experience}</span>
                    {isSelected && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0284c7' }}>✓ Selected</span>
                    )}
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

        {/* Column 3: Right Large Resume Preview */}
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
              
              {/* Interactive Toolbar Header + Layout Switcher */}
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

                  {/* Action Buttons */}
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
                  </div>
                </div>

                {/* Template Layout Switcher Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={13} /> Switch Layout Design:
                  </span>
                  {templateOptions.map((tOpt) => {
                    const activeT = (activeLayoutOverride || currentRole.templateId || 'modern').toLowerCase() === tOpt.id;
                    return (
                      <button
                        key={tOpt.id}
                        onClick={() => setActiveLayoutOverride(tOpt.id)}
                        style={{
                          padding: '0.22rem 0.65rem',
                          borderRadius: '16px',
                          border: `1px solid ${activeT ? '#0284c7' : '#e2e8f0'}`,
                          background: activeT ? '#e0f2fe' : 'white',
                          color: activeT ? '#0284c7' : '#64748b',
                          fontSize: '0.73rem',
                          fontWeight: activeT ? 900 : 600,
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

              {/* Live Interactive Resume Sheet Paper Preview */}
              <div 
                onClick={() => handleUseTemplate(currentRole)}
                title="Click to open template in Editor"
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
                  overflow: 'hidden',
                  minHeight: '750px',
                  border: '1.5px solid #cbd5e1',
                  position: 'relative',
                  cursor: 'pointer',
                  marginBottom: '2rem'
                }}
              >
                {renderLayoutComponent(currentRole)}
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
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1.25rem',
          overflow: 'hidden'
        }}>
          {/* Header Controls */}
          <div style={{ width: '100%', maxWidth: '880px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexShrink: 0 }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📄</span> {currentRole.title} Full Resume Preview
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
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                }}
              >
                <Edit3 size={15} /> Edit in Builder
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
                  justifyContent: 'center',
                  transition: 'background 0.15s'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Full-Page Scrollable Resume Container */}
          <div style={{ 
            flex: 1,
            width: '100%', 
            maxWidth: '880px', 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)', 
            overflowY: 'auto',
            padding: '2rem',
            marginBottom: '0.5rem',
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 transparent'
          }}>
            {renderLayoutComponent(currentRole)}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryExamples;
