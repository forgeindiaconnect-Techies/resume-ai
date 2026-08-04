import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ResumeCard from '../components/ResumeCard';
import { getExamplesByIndustry } from '../services/industryService';
import { ArrowLeft } from 'lucide-react';

const fallbackExamples = {
  'it': [
    { _id: 'fe', jobTitle: 'Frontend Developer', experience: '2-5 Years', template: 'Modern', atsScore: 92, resumeScore: 95 },
    { _id: 'be', jobTitle: 'Backend Developer', experience: '2-5 Years', template: 'Modern', atsScore: 94, resumeScore: 91 },
    { _id: 'fs', jobTitle: 'Full Stack Developer', experience: '5-10 Years', template: 'Modern', atsScore: 97, resumeScore: 96 }
  ]
};

const IndustryCategory = () => {
  const { industryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const industryName = location.state?.industryName || 'Industry';

  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (industryId) {
      navigate(`/industry-examples#${industryId}`, { replace: true });
    }
  }, [industryId, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        padding: '4rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/industry-examples')}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              padding: 0
            }}
          >
            <ArrowLeft size={16} /> Back to Industries
          </button>
          
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {industryName} Resume Examples
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            Proven formats optimized to pass candidate filters inside {industryName.toLowerCase()} departments.
          </p>
        </div>
      </div>

      {/* Roles Grid */}
      <div style={{ maxWidth: '1000px', margin: '3rem auto 0', padding: '0 1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontWeight: 650 }}>
            Loading resume examples...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {examples.map(ex => (
              <ResumeCard
                key={ex._id}
                example={ex}
                onPreview={() => navigate(`/resume-examples/${ex._id}`)}
                onUse={() => {
                  // Preselect template metadata for builder setup
                  localStorage.setItem('selectedTemplateId', ex.template || 'Modern');
                  localStorage.setItem('prefilledJobTitle', ex.jobTitle);
                  navigate('/builder');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryCategory;
