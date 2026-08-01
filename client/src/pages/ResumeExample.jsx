import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ResumePreview from '../components/ResumePreview';
import { getExampleById } from '../services/industryService';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

const mockExampleData = {
  _id: 'fe',
  jobTitle: 'Frontend Developer',
  experience: '2-5 Years',
  template: 'Modern',
  atsScore: 92,
  resumeScore: 95,
  description: 'Clean layout structure optimizing spacing and typography to clearly highlight technical frameworks, custom component libraries, and frontend performance optimizations.',
  resumeJson: {
    name: 'Aakash Sharma',
    role: 'Frontend Developer',
    contact: {
      email: 'aakash.sharma@example.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, Karnataka',
      linkedin: 'linkedin.com/in/aakash-frontend',
      github: 'github.com/aakash-dev'
    },
    objective: 'Passionate and detail-oriented Frontend Developer with 3+ years of experience building responsive, accessible, and high-performance web applications. Expert in React, modern JavaScript, and UI design systems.',
    education: [
      { degree: 'B.Tech in Computer Science', institution: 'Vellore Institute of Technology', tenure: '2017 - 2021', cgpa: '8.9' }
    ],
    skills: {
      languages: 'JavaScript (ES6+), TypeScript, HTML5, CSS3',
      frameworks: 'React.js, Next.js, Redux Toolkit, Tailwind CSS',
      tools: 'Git, Webpack, Vite, Figma'
    },
    experience: [
      {
        title: 'Software Engineer (Frontend)',
        company: 'TechSolutions Pvt. Ltd.',
        duration: '2021 - Present',
        desc: 'Developed and optimized 15+ user-facing features using React and Next.js, improving page load speeds by 35%.\nCollaborated closely with UI/UX designers to translate Figma design tokens into clean, modular CSS/Tailwind components.\nBuilt a reusable component library that reduced code duplication across 3 different company dashboards.'
      }
    ],
    projects: [
      {
        title: 'E-Commerce Dashboard',
        technology: 'React, Tailwind, Chart.js',
        desc: 'Created an analytical dashboard for managing products, tracking sales metrics, and viewing customer behavior reports.'
      }
    ],
    training: ['React Advanced Certification', 'Meta Frontend Developer Professional Certificate']
  }
};

const ResumeExample = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [example, setExample] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExample = async () => {
      const data = await getExampleById(id);
      if (data) {
        setExample(data);
      } else {
        setExample(mockExampleData);
      }
      setLoading(false);
    };
    loadExample();
  }, [id]);

  const handleUseTemplate = () => {
    if (example) {
      localStorage.setItem('selectedTemplateId', example.template || 'Modern');
      localStorage.setItem('prefilledJobTitle', example.jobTitle);
      localStorage.setItem('prefilledResumeJson', JSON.stringify(example.resumeJson));
      navigate('/onboarding/start');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b', fontWeight: 650 }}>
          Loading details...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', paddingBottom: '5rem', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '0.85rem',
            marginBottom: '2rem',
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Two-Column split layout: Details & Metrics on left, Large A4 preview on right */}
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Left Column: Details & Gauges */}
          <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <span style={{
                background: '#eff6ff',
                color: '#0056b8',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>{example.experience} Experience</span>
              
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
                {example.jobTitle} Resume Example
              </h1>
              
              <p style={{ color: '#475569', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                {example.description || `A complete professionally styled sample resume for ${example.jobTitle} candidates. Fully customizable and compliance tested.`}
              </p>
            </div>

            {/* Metrics cards */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              
              {/* Resume Score Card */}
              <div style={{
                background: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.25rem',
                flex: 1,
                minWidth: '140px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resume Score</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0056b8', margin: '0.25rem 0' }}>{example.resumeScore}%</div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', background: '#e6fcf5', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Excellent</span>
              </div>

              {/* ATS score card */}
              <div style={{
                background: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.25rem',
                flex: 1,
                minWidth: '140px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Score</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#10b981', margin: '0.25rem 0' }}>{example.atsScore}%</div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0056b8', background: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Highly Compliant</span>
              </div>

            </div>

            {/* Actions Panel */}
            <div style={{
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Start Customizing This Sample</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Click below to copy this exact data format into your personal editor sandbox workspace instantly.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  onClick={handleUseTemplate}
                  style={{
                    background: '#0056b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 6px 18px rgba(0, 86, 184, 0.2)',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  <Check size={18} strokeWidth={3} /> Use This Template
                </button>

                <button
                  onClick={handlePrint}
                  style={{
                    background: 'white',
                    color: '#0f172a',
                    border: '2px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f172a'; e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'white'; }}
                >
                  Download Sample PDF
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: A4 sheet preview canvas */}
          <div style={{ flex: 1.2, minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
            <ResumePreview
              data={example.resumeJson}
              color="#0056b8"
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default ResumeExample;
