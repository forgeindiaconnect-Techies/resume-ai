import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';
import OnboardingStart from './pages/OnboardingStart';
import CareerWizard from './pages/CareerWizard';
import ResumeBuilder from './pages/ResumeBuilder';
import IndustryExamples from './pages/IndustryExamples';
import Templates from './pages/Templates';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding/start" element={<OnboardingStart />} />
        <Route path="/onboarding/wizard" element={<CareerWizard />} />
        <Route path="/builder" element={<ResumeBuilder />} />
        <Route path="/industry-examples" element={<IndustryExamples />} />
        <Route path="/templates" element={<Templates />} />
      </Routes>
    </Router>
  );
}

export default App;
