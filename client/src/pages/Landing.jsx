import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, FileText, CheckCircle2, Layout, Zap } from 'lucide-react';
import Navbar from '../components/common/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary-500 selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-1.5 shadow-sm border border-slate-200 mb-8">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Powered by Gemini AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-8">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Dream Resume</span> <br/>With AI
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
            ATS-Friendly • Professional Templates • Instant Generation
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link 
              to="/onboarding/start" 
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-slate-900/20 transition transform hover:-translate-y-1"
            >
              Create Resume
            </Link>
            <Link 
              to="/upload" 
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-base font-bold shadow-sm transition transform hover:-translate-y-1"
            >
              Upload Resume
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm font-bold text-slate-500">
            <div className="flex -space-x-2 mr-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px]">👤</div>
              ))}
            </div>
            ⭐⭐⭐⭐⭐ Trusted by 50,000+ Professionals
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Professional Templates</h2>
            <p className="text-slate-600 font-medium">Choose from our collection of ATS-optimized designs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Modern', 'Executive', 'Creative', 'Minimal'].map((tpl, i) => (
              <div key={i} className="group relative rounded-2xl bg-slate-100 p-4 hover:shadow-2xl transition duration-300 cursor-pointer">
                <div className="aspect-[1/1.4] bg-white rounded-xl shadow-sm border border-slate-200 mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition">Use Template</span>
                  </div>
                </div>
                <h3 className="text-center font-bold text-slate-800">{tpl}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Why Choose Us</h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">Everything you need to land your next dream job.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Bot size={24}/>, title: 'AI Resume Builder', desc: 'Auto-write your experience and summary with advanced AI.' },
              { icon: <CheckCircle2 size={24}/>, title: 'ATS Score Checker', desc: 'Ensure your resume passes Applicant Tracking Systems.' },
              { icon: <Zap size={24}/>, title: 'Resume Analyzer', desc: 'Upload your current resume and let our AI improve it.' },
              { icon: <FileText size={24}/>, title: 'Cover Letters', desc: 'Generate tailored cover letters matching the job description.' },
              { icon: <Layout size={24}/>, title: 'Portfolio Website', desc: 'Turn your resume into a stunning live portfolio website.' }
            ].map((feat, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-primary-500 transition">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-6">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Simple Pricing</h2>
            <p className="text-slate-600 font-medium">Start for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Free</h3>
              <div className="text-4xl font-black text-slate-900 mb-6">₹0<span className="text-base text-slate-500 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                {['1 Resume', 'Basic Templates', 'Watermarked PDF Download'].map((feat, i) => (
                  <li key={i} className="flex items-center text-slate-600 font-medium text-sm gap-3"><CheckCircle2 size={16} className="text-slate-400"/> {feat}</li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 hover:border-slate-300 transition">Get Started</button>
            </div>
            
            {/* Pro */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Most Popular</div>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <div className="text-4xl font-black text-white mb-6">₹299<span className="text-base text-slate-400 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited Resumes', 'All Premium Templates', 'No Watermark', 'AI Resume Analysis', 'Cover Letter Generator'].map((feat, i) => (
                  <li key={i} className="flex items-center text-slate-300 font-medium text-sm gap-3"><CheckCircle2 size={16} className="text-primary-400"/> {feat}</li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 font-bold text-white shadow-lg shadow-primary-500/20 transition">Upgrade to Pro</button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Enterprise</h3>
              <div className="text-4xl font-black text-slate-900 mb-6">Custom</div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Team Management', 'Custom Templates', 'API Access', 'Dedicated Support'].map((feat, i) => (
                  <li key={i} className="flex items-center text-slate-600 font-medium text-sm gap-3"><CheckCircle2 size={16} className="text-slate-400"/> {feat}</li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 hover:border-slate-300 transition">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 font-medium text-sm">
          © 2026 Forge Resume AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
