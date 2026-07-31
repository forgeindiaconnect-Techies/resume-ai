import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileEdit, Sparkles, Linkedin, Upload, ArrowRight } from 'lucide-react';
import ForgeLogo from '../components/common/ForgeLogo';

const OnboardingStart = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 'scratch',
      title: 'Start from Scratch',
      desc: 'Build your resume step-by-step with our wizard.',
      icon: <FileEdit size={24} className="text-primary-600" />,
      color: 'bg-primary-50 hover:border-primary-500 hover:shadow-primary-100',
      action: () => navigate('/onboarding/wizard')
    },
    {
      id: 'ai',
      title: 'Use AI to Generate',
      desc: 'Let Gemini write your entire resume in seconds.',
      icon: <Sparkles size={24} className="text-accent-600" />,
      color: 'bg-accent-50 hover:border-accent-500 hover:shadow-accent-100',
      action: () => alert('AI Generation coming in Phase 3!')
    },
    {
      id: 'linkedin',
      title: 'Import LinkedIn (Future)',
      desc: 'Convert your profile into a resume instantly.',
      icon: <Linkedin size={24} className="text-blue-600" />,
      color: 'bg-blue-50 hover:border-blue-500 hover:shadow-blue-100 opacity-60 cursor-not-allowed',
      action: () => {}
    },
    {
      id: 'upload',
      title: 'Upload Existing Resume',
      desc: 'Redesign and score your current resume.',
      icon: <Upload size={24} className="text-emerald-600" />,
      color: 'bg-emerald-50 hover:border-emerald-500 hover:shadow-emerald-100',
      action: () => alert('Upload flow coming in Phase 3!')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-primary-500 selection:text-white">
      
      <div className="absolute top-8 left-8">
        <Link to="/" className="hover:opacity-80 transition">
          <ForgeLogo size={32} />
        </Link>
      </div>

      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm border border-slate-200 mb-6 text-3xl">
            👋
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Welcome to Forge</h1>
          <p className="text-lg text-slate-600 font-medium">Let's build your dream resume in just 5 minutes. How would you like to start?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((opt) => (
            <div 
              key={opt.id}
              onClick={opt.action}
              className={`bg-white border-2 border-slate-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-xl group ${opt.color}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-white shadow-sm ${opt.color.split(' ')[0]}`}>
                  {opt.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-slate-800">{opt.title}</h3>
                  <p className="text-sm font-medium text-slate-500">{opt.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OnboardingStart;
