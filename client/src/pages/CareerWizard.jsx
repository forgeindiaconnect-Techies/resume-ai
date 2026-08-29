import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Target, Briefcase, Clock, Palette } from 'lucide-react';
import ForgeLogo from '../components/common/ForgeLogo';

const CareerWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    level: '',
    job: '',
    experience: '',
    style: ''
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      // Pass data to builder later via context/state
      navigate('/builder');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/onboarding/start');
  };

  const OptionButton = ({ selected, onClick, label, icon }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
        selected 
          ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-md transform scale-[1.02]' 
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
      }`}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${selected ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300'}`}>
        {selected && <Check size={14} strokeWidth={4} />}
      </div>
      {icon && <span className={selected ? 'text-primary-600' : 'text-slate-400'}>{icon}</span>}
      <span className="font-bold text-lg">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-primary-500 selection:text-white">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center bg-white border-b border-slate-200">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleBack}
            title={step > 1 ? "Previous Step" : "Back"}
            aria-label={step > 1 ? "Previous Step" : "Back"}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              cursor: 'pointer',
              transition: 'all 0.15s',
              flexShrink: 0,
              padding: 0
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <Link to="/" className="hover:opacity-80 transition flex items-center">
            <ForgeLogo size={52} />
          </Link>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 w-16 rounded-full transition-colors duration-300 ${i <= step ? 'bg-primary-600' : 'bg-slate-200'}`} />
          ))}
        </div>
        <button onClick={() => navigate('/builder')} className="text-slate-400 font-bold text-sm hover:text-slate-600 transition">Skip</button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <Target size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">What's your career level?</h2>
                <p className="text-slate-500 font-medium">This helps us recommend the right format for your experience.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Student', 'Fresher', 'Junior Developer', 'Mid Level', 'Senior', 'Manager'].map(level => (
                  <OptionButton 
                    key={level} 
                    label={level} 
                    selected={data.level === level} 
                    onClick={() => { setData({...data, level}); setTimeout(handleNext, 300); }} 
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <Briefcase size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Which job are you applying for?</h2>
                <p className="text-slate-500 font-medium">We'll optimize your keywords for this role.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Java Developer', 'Python Developer', 'UI/UX Designer'].map(job => (
                  <OptionButton 
                    key={job} 
                    label={job} 
                    selected={data.job === job} 
                    onClick={() => { setData({...data, job}); setTimeout(handleNext, 300); }} 
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <Clock size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Years of Experience</h2>
                <p className="text-slate-500 font-medium">How long have you been working in this field?</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {['0-1 Years (Entry Level)', '2-5 Years (Mid Level)', '5-10 Years (Senior)', '10+ Years (Expert)'].map(exp => (
                  <OptionButton 
                    key={exp} 
                    label={exp} 
                    selected={data.experience === exp} 
                    onClick={() => { setData({...data, experience: exp}); setTimeout(handleNext, 300); }} 
                  />
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <Palette size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Choose a Resume Style</h2>
                <p className="text-slate-500 font-medium">Pick a template that matches your target company culture.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Modern', 'Professional', 'Creative', 'Minimal', 'Executive'].map(style => (
                  <OptionButton 
                    key={style} 
                    label={style} 
                    selected={data.style === style} 
                    onClick={() => { setData({...data, style}); }} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-12 pt-6 flex justify-between items-center border-t border-slate-200">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 font-bold text-slate-500 hover:text-slate-800 transition px-4 py-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button 
              onClick={handleNext}
              disabled={
                (step === 1 && !data.level) || 
                (step === 2 && !data.job) || 
                (step === 3 && !data.experience) || 
                (step === 4 && !data.style)
              }
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
            >
              {step === 4 ? 'Start Building' : 'Continue'} <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CareerWizard;
