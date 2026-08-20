import React, { lazy, Suspense, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import OnboardingStart from './pages/OnboardingStart';
import CareerWizard from './pages/CareerWizard';
import ResumeBuilder from './pages/ResumeBuilder';
import IndustryExamples from './pages/IndustryExamples';
import IndustryCategory from './pages/IndustryCategory';
import ResumeExample from './pages/ResumeExample';
import ResumeExamples from './pages/ResumeExamples';
import Templates from './pages/Templates';
import TemplatePreview from './pages/TemplatePreview';
import Plans from './pages/Plans';
import Pricing from './pages/Pricing';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminTemplates from './pages/admin/AdminTemplates';
import AddTemplate from './pages/admin/AddTemplate';
import EditTemplate from './pages/admin/EditTemplate';
import AdminResumeExamples from './pages/admin/AdminResumeExamples';
import AdminPlans from './pages/admin/AdminPlans';
import PlanForm from './pages/admin/PlanForm';
import AdminReports from './pages/admin/AdminReports';
import AdminDownloads from './pages/admin/AdminDownloads';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminSessions from './pages/admin/AdminSessions';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import { getAnonymousId } from './utils/userIdentity';
import { identifyUser } from './utils/identifyUser';
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
import { API_BASE_URL } from "./config/api";

function App() {
  useEffect(() => {
    identifyUser().catch(err => console.error("Identity error:", err));
  }, []);

  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        const sessionId = localStorage.getItem("activeResumeSessionId") || localStorage.getItem("userSessionId");

        if (!sessionId) return;

        await fetch(
          `${API_BASE_URL}/sessions/track`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              sessionId,
              action: "HEARTBEAT",
              page: window.location.pathname
            })
          }
        );
      } catch (error) {
        console.error("Heartbeat error:", error);
      }
    };

    // Send immediately
    sendHeartbeat();

    // Update every 30 seconds
    const interval = setInterval(sendHeartbeat, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          localStorage.removeItem("user_premium");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/subscription/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.isPremium === true) {
          localStorage.setItem("user_premium", "true");
        } else {
          localStorage.setItem("user_premium", "false");
        }
      } catch (error) {
        console.error("Subscription check failed:", error);
        localStorage.removeItem("token");
        localStorage.setItem("user_premium", "false");
      }
    };

    const fetchPublicSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/settings`);
        if (res.data.success && res.data.settings) {
          localStorage.setItem("app_settings", JSON.stringify(res.data.settings));
        }
      } catch (error) {
        console.error("Failed to fetch app settings:", error);
      }
    };

    checkSubscription();
    fetchPublicSettings();
  }, []);

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
        <Route path="/resume-examples" element={<ResumeExamples />} />
        <Route path="/resume-examples/:id" element={<ResumeExample />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/preview/:id" element={<TemplatePreview />} />
        <Route path="/admin/examples" element={<AdminResumeExamples />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/templates" element={<AdminTemplates />} />
          <Route path="/admin/templates/add" element={<AddTemplate />} />
          <Route path="/admin/templates/edit/:id" element={<EditTemplate />} />
          <Route path="/admin/resume-examples" element={<AdminResumeExamples />} />
          <Route path="/admin/plans" element={<AdminPlans />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/downloads" element={<AdminDownloads />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/activity" element={<AdminSessions />} />
          <Route path="/admin/users/:id" element={<AdminUserDetails />} />
          <Route path="/admin/plans/add" element={<PlanForm />} />
          <Route path="/admin/plans/edit/:id" element={<PlanForm />} />
        </Route>
        
        <Route path="/plans" element={<Plans />} />
        <Route path="/pricing" element={<Pricing />} />

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
