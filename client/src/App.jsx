import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import OnboardingStart from './pages/OnboardingStart';
import CareerWizard from './pages/CareerWizard';
import ResumeBuilder from './pages/ResumeBuilder';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding/start" element={<OnboardingStart />} />
        <Route path="/onboarding/wizard" element={<CareerWizard />} />
        <Route path="/builder" element={<ResumeBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
