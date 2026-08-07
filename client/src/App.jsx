import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';
import OnboardingStart from './pages/OnboardingStart';
import CareerWizard from './pages/CareerWizard';
import ResumeBuilder from './pages/ResumeBuilder';
import IndustryExamples from './pages/IndustryExamples';
import IndustryCategory from './pages/IndustryCategory';
import ResumeExample from './pages/ResumeExample';
import Templates from './pages/Templates';
import TemplatePreview from './pages/TemplatePreview';
import AdminTemplates from './pages/AdminTemplates';
import AdminResumeExamples from './pages/AdminResumeExamples';
import Plans from './pages/Plans';
import { Toaster } from 'react-hot-toast';

// Dynamic Template Editors (lazy-loaded for performance)
const ExecutiveEditor    = lazy(() => import('./editors/ExecutiveEditor'));
const EnhancvEditor      = lazy(() => import('./editors/EnhancvEditor'));
const CreativeEditor     = lazy(() => import('./editors/CreativeEditor'));
const ModernEditor       = lazy(() => import('./editors/ModernEditor'));
const ProfessionalEditor = lazy(() => import('./editors/ProfessionalEditor'));
const MinimalEditor      = lazy(() => import('./editors/MinimalEditor'));

const EditorLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f1f5f9', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <span style={{ color: '#64748b', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>Loading Editor…</span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

import AiResumeView from './pages/AiResumeView';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding/start" element={<OnboardingStart />} />
        <Route path="/onboarding/wizard" element={<CareerWizard />} />
        <Route path="/builder" element={<ResumeBuilder />} />
        <Route path="/builder/:resumeId" element={<ResumeBuilder />} />
        <Route path="/ai-resume/:sessionId" element={<AiResumeView />} />
        <Route path="/industry-examples" element={<IndustryExamples />} />
        <Route path="/industry-examples/:industryId" element={<IndustryCategory />} />
        <Route path="/resume-examples/:id" element={<ResumeExample />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/preview/:id" element={<TemplatePreview />} />
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/examples" element={<AdminResumeExamples />} />
        <Route path="/plans" element={<Plans />} />

        {/* ── Dynamic Template-Specific Editors ── */}
        <Route path="/editor/executive/:sessionId" element={<Suspense fallback={<EditorLoader />}><ExecutiveEditor /></Suspense>} />
        <Route path="/editor/enhancv/:sessionId"   element={<Suspense fallback={<EditorLoader />}><EnhancvEditor /></Suspense>} />
        <Route path="/editor/creative/:sessionId"  element={<Suspense fallback={<EditorLoader />}><CreativeEditor /></Suspense>} />
        <Route path="/editor/modern/:sessionId"    element={<Suspense fallback={<EditorLoader />}><ModernEditor /></Suspense>} />
        <Route path="/editor/professional/:sessionId" element={<Suspense fallback={<EditorLoader />}><ProfessionalEditor /></Suspense>} />
        <Route path="/editor/minimal/:sessionId"   element={<Suspense fallback={<EditorLoader />}><MinimalEditor /></Suspense>} />
      </Routes>
    </Router>
  );
}

export default App;
