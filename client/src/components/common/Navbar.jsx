import React from 'react';
import { Link } from 'react-router-dom';
import ForgeLogo from './ForgeLogo';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 cursor-pointer hover:opacity-90 transition">
            <ForgeLogo size={32} />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition">Features</a>
            <a href="#templates" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition">Templates</a>
            <a href="#pricing" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition">Pricing</a>
            <a href="#about" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition">About</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-primary-600 transition">Login</Link>
            <Link 
              to="/onboarding/start" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary-500/30 transition transform hover:-translate-y-0.5"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
