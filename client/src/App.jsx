import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';
import OnboardingStart from './pages/OnboardingStart';
import CareerWizard from './pages/CareerWizard';
import ResumeBuilder from './pages/ResumeBuilder';
import IndustryExamples from './pages/IndustryExamples';
import IndustryCategory from './pages/IndustryCategory';
import ResumeExample from './pages/ResumeExample';
import Templates from './pages/Templates';
import AdminTemplates from './pages/AdminTemplates';
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
        <Route path="/industry-examples/:industryId" element={<IndustryCategory />} />
        <Route path="/resume-examples/:id" element={<ResumeExample />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/admin/templates" element={<AdminTemplates />} />
      </Routes>
    </Router>
  );
}

export default App;
