import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplateById, useTemplate } from '../services/templateService';
import ModernResumeTemplate from '../components/builder/ModernResumeTemplate';
import Navbar from '../components/common/Navbar';
import { ArrowLeft, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';

const TemplatePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock resume data for preview rendering
  const mockPreviewData = {
    name: 'Alex Johnson',
    contact: {
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexj',
      github: 'github.com/alexj',
      portfolio: 'alexj.dev'
    },
    objective: 'Results-driven professional with over 5 years of experience leading projects, optimizing workflows, and building modern, high-performance systems. Passionate about driving business efficiency and cross-functional team collaboration.',
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        department: 'EECS',
        cgpa: '3.8/4.0',
        tenure: '2016 - 2020'
      }
    ],
    experience: [
      {
        title: 'Senior Engineer / Specialist',
        company: 'Apex Tech Solutions',
        duration: '2022 - Present',
        desc: 'Spearheaded the development of a scalable cloud orchestration system.\nMentored 6 junior engineers and optimized CI/CD build cycles by 35%.\nCollaborated with product teams to scope and implement core business metrics.'
      },
      {
        title: 'Software Developer',
        company: 'Core Systems Inc.',
        duration: '2020 - 2022',
        desc: 'Implemented RESTful APIs using Node.js and Express supporting high-concurrency requests.\nMaintained test suites achieving 90%+ code coverage.'
      }
    ],
    skills: {
      languages: 'JavaScript, TypeScript, Python, Java, SQL, HTML/CSS',
      frameworks: 'React, Node.js, Express, Next.js, Redux, TailwindCSS',
      tools: 'Git, Docker, AWS (S3, EC2), MongoDB, PostgreSQL, Redis'
    },
    projects: [
      {
        title: 'Analytics Dashboard Platform',
        technology: 'React, D3.js, Node.js, PostgreSQL',
        desc: 'A real-time data visualization tool monitoring enterprise metrics.\nOptimized rendering pipeline to support 10k+ concurrent data feeds.'
      }
    ],
    training: [
      'AWS Certified Cloud Practitioner (2024)',
      'Certified Scrum Developer (CSD)'
    ],
    languagesList: ['English (Native)', 'Spanish (Conversational)'],
    references: 'Available upon request'
  };

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      try {
        const res = await getTemplateById(id);
        if (res.data && res.data.data) {
          setTemplate(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching template details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplateDetails();
  }, [id]);

  const handleUseTemplate = async () => {
    if (!template) return;
    try {
      const guestId = localStorage.getItem('guestSessionId');
      
      const res = await useTemplate(template._id, {
        userId: null,
        guestId: guestId
      });

      if (res.data && res.data.data) {
        const newResume = res.data.data;
        const slug = template.name.toLowerCase().replace(/\s+/g, '-');
        localStorage.setItem('selectedTemplateSlug', slug);
        localStorage.setItem('selectedJobRole', template.name);
        localStorage.setItem('activeResumeSessionId', newResume._id);
        navigate(`/builder/${newResume._id}`);
      }
    } catch (err) {
      console.error('Error starting template session:', err);
      // Fallback
      const slug = template.name.toLowerCase().replace(/\s+/g, '-');
      localStorage.setItem('selectedTemplateSlug', slug);
      localStorage.setItem('selectedJobRole', template.name);
      navigate('/builder');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #0056b8', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#475569', fontWeight: 800 }}>Loading template preview...</h3>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '10rem 1.5rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 900, marginBottom: '1rem' }}>Template Not Found</h2>
          <button 
            onClick={() => navigate('/templates')}
            style={{ padding: '0.75rem 1.5rem', background: '#0056b8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  const customColor = template.layout?.color || '#0056b8';
  const customFont = template.layout?.font || "'Inter', sans-serif";

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Toolbar Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        zIndex: 10
      }}>
        <button 
          onClick={() => navigate('/templates')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#475569', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <ArrowLeft size={18} /> Back to Templates
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
            <ShieldCheck size={16} /> ATS Compliance Score: {template.atsScore}%
          </div>
          <button 
            onClick={handleUseTemplate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.65rem 1.5rem',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
            }}
          >
            <Sparkles size={14} /> Use Template
          </button>
        </div>
      </div>

      {/* Viewport Split Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Layout Options Info */}
        <div style={{
          width: '320px',
          background: 'white',
          borderRight: '1px solid #e2e8f0',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          overflowY: 'auto'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0056b8', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
              {template.category}
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0.5rem 0' }}>{template.name}</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{template.description}</p>
          </div>

          <div style={{ height: '1px', background: '#e2e8f0' }} />

          {/* Layout details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 850, color: '#1e293b', margin: 0 }}>Layout Specifications</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>Grid Layout:</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>{template.layout?.columns || 2} Columns</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>Header Block:</span>
              <span style={{ fontWeight: 800, color: '#0f172a', textTransform: 'capitalize' }}>{template.layout?.header || 'top'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>Primary Accent:</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#0f172a' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: customColor }} />
                {customColor}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>Default Font:</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>{customFont.split(',')[0].replace(/'/g, '')}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Resume Blueprint Scroll Canvas */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{
            width: '210mm',
            minHeight: '297mm',
            boxShadow: '0 20px 40px rgba(15,23,42,0.1)',
            background: 'white',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <ModernResumeTemplate 
              data={mockPreviewData} 
              role={template.industry} 
              customColor={customColor} 
              customFont={customFont} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TemplatePreview;
