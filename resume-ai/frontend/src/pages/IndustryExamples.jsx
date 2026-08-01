import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import IndustryCard from '../components/IndustryCard';
import { getIndustries } from '../services/industryService';

const fallbackIndustries = [
  { _id: 'it', name: 'Information Technology', icon: 'Laptop', description: 'Professional IT & Software Developer Resume Examples' },
  { _id: 'biz', name: 'Business', icon: 'Briefcase', description: 'Resume examples for management, consulting, and operational roles' },
  { _id: 'eng', name: 'Engineering', icon: 'Settings', description: 'Resume templates for hardware, civil, and mechanical engineers' },
  { _id: 'health', name: 'Healthcare', icon: 'Activity', description: 'Clinical, nurse, and general practitioner resume examples' },
  { _id: 'fin', name: 'Finance', icon: 'DollarSign', description: 'Formats for certified accountants and investment analysts' },
  { _id: 'edu', name: 'Education', icon: 'BookOpen', description: 'Resumes for professors, advisors, and school counselors' }
];

const IndustryExamples = () => {
  const navigate = useNavigate();
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIndustries = async () => {
      const data = await getIndustries();
      if (data && data.length > 0) {
        setIndustries(data);
      } else {
        setIndustries(fallbackIndustries);
      }
      setLoading(false);
    };
    loadIndustries();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        padding: '5.5rem 2rem 4.5rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(234, 179, 8, 0.15)',
            color: '#eab308',
            padding: '0.4rem 1.1rem',
            borderRadius: '50px',
            fontSize: '0.78rem',
            fontWeight: 850,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '1.25rem'
          }}>SaaS Career Guide</span>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '3rem', fontWeight: 900, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Job-Specific Resume Examples
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Choose an industry below to browse hundreds of ATS-tested resume examples built for recruiters. Select a template and start customizing.
          </p>
        </div>
      </div>

      {/* Main categories section */}
      <div style={{ maxWidth: '1200px', margin: '4rem auto 0', padding: '0 1.5rem' }}>
        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.8rem',
          fontWeight: 900,
          color: '#0f172a',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>Select an Industry Category</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontWeight: 650 }}>
            Loading categories...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {industries.map(ind => (
              <IndustryCard
                key={ind._id}
                industry={ind}
                onClick={() => navigate(`/industry-examples/${ind._id}`, { state: { industryName: ind.name } })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryExamples;
