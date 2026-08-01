import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Core Shell Components
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';

// View Components
import DashboardView from './components/DashboardView';
import AnalyzerView from './components/AnalyzerView';
import JobMatcherView from './components/JobMatcherView';
import ProfileView from './components/ProfileView';
import ReportsView from './components/ReportsView';
import InboxView from './components/InboxView';
import LandingPage from './components/LandingPage';
import InterviewPage from './components/InterviewPage';
import LoginModal from './components/LoginModal';
import InterviewRoomView from './components/InterviewRoomView';

import SignInRequiredModal from './components/SignInRequiredModal';
import SplashScreen from './components/SplashScreen';
import ResumeAlreadyExistsModal from './components/ResumeAlreadyExistsModal';
import ChatWidget from './components/ChatWidget';
import ResumeBuilderModal from './components/ResumeBuilderModal';
import SplitBuilderView from './components/SplitBuilderView';
import ResumeUploadWorkflow from './components/ResumeUploadWorkflow';
import HRResumeVault from './components/HRResumeVault';
import PublicPortfolioView from './components/PublicPortfolioView';
import SubscriptionView from './components/SubscriptionView';
import CoverLetterView from './components/CoverLetterView';
import AdminDashboardView from './components/AdminDashboardView';

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [appEntered, setAppEntered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  const [recruiterMode, setRecruiterMode] = useState(false);
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Frontend');
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [showResumeUploadWorkflow, setShowResumeUploadWorkflow] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [interviewToken, setInterviewToken] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [publicPortfolioId, setPublicPortfolioId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore Session on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userdb');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        // setAppEntered(true); <- Removed to ensure Landing Page shows first
      } catch (e) {
        console.error('Failed to restore session:', e);
        localStorage.removeItem('userdb');
      }
    } else {
      // It is a guest user, verify or create guestSessionId
      const checkGuestSession = async () => {
        let guestId = localStorage.getItem('guestSessionId');
        if (!guestId) {
          try {
            const response = await fetch('/api/guest/session', { method: 'POST' });
            const data = await response.json();
            if (response.ok && data.success) {
              localStorage.setItem('guestSessionId', data.sessionId);
            }
          } catch (err) {
            console.error('Failed to create guest session on backend:', err);
          }
        }
      };
      checkGuestSession();
    }
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const portfolioId = searchParams.get('portfolio');

      if (portfolioId) {
        setPublicPortfolioId(portfolioId);
        setActiveView('portfolio-view');
        setAppEntered(true);
      } else if (path.startsWith('/interview/')) {
        const token = path.split('/interview/')[1];
        if (token) {
          setInterviewToken(token);
          setActiveView('interview');
          setAppEntered(true);
        }
      } else if (path.startsWith('/interview-room/')) {
        const roomId = path.split('/interview-room/')[1];
        if (roomId) {
          setActiveRoomId(roomId);
          setActiveView('interview-room');
          setAppEntered(true);
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUpload = (file, role = 'Frontend', isBulk = false) => {
    // Duplicate Detection Logic
    const filesToCheck = Array.isArray(file) ? file : [file];
    const isDuplicate = filesToCheck.some(newFile => 
      uploadedResumes.some(existing => 
        existing.name === newFile.name && existing.size === newFile.size
      )
    );

    if (isDuplicate) {
      setShowDuplicateModal(true);
      return;
    }

    // If not duplicate, add to historical list
    const newEntries = filesToCheck.map(f => ({ name: f.name, size: f.size }));
    setUploadedResumes(prev => [...prev, ...newEntries]);

    setResults(null);
    setResumeText('');
    setResumeName('');
    setAppEntered(true);
    setPendingFile(file);
    setSelectedRole(role);
    setRecruiterMode(isBulk);
    setActiveView('analyzer');
  };

  const handleEnterApp = (action = null) => {
    if (action === 'login') {
      setShowLoginModal(true);
      return;
    }
    setAppEntered(true);
    if (action === 'create') {
      setActiveView('builder');
    } else if (action === 'upload') {
      setActiveView('dashboard');
      setShowResumeUploadWorkflow(true);
    } else {
      setActiveView('dashboard');
    }
  };

  const persistTemporaryData = async (userObj) => {
    if (!tempData) return;
    try {
      const token = localStorage.getItem('token');
      if (tempData.type === 'builder') {
        const payload = {
          title: tempData.formData.title,
          templateId: tempData.formData.templateId,
          department: tempData.formData.department,
          personalInfo: tempData.formData.personalInfo,
          experience: tempData.formData.experience,
          education: tempData.formData.education,
          projects: tempData.formData.projects,
          skills: [
            ...(tempData.formData.skills.languages?.split(',').map(s => s.trim()) || []),
            ...(tempData.formData.skills.frameworks?.split(',').map(s => s.trim()) || []),
            ...(tempData.formData.skills.tools?.split(',').map(s => s.trim()) || [])
          ].filter(s => s.length > 0),
          certificates: tempData.formData.certificates
        };

        const response = await fetch('/api/resumes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          console.log('Temporary guest resume persisted successfully to account!');
        }
      } else if (tempData.type === 'upload') {
        const cand = {
          name: tempData.formData?.personal?.firstName ? `${tempData.formData.personal.firstName} ${tempData.formData.personal.lastName}` : (tempData.analysisResults?.name || 'Guest Candidate'),
          fileName: tempData.fileName,
          score: tempData.analysisResults?.score || 0,
          matchPercentage: tempData.analysisResults?.matchPercentage || 0,
          matchedSkills: tempData.analysisResults?.matchedSkills || [],
          skills: tempData.analysisResults?.skills || [],
          missingSkills: tempData.analysisResults?.missingSkills || [],
          strengths: tempData.analysisResults?.strengths || [],
          weaknesses: tempData.analysisResults?.weaknesses || [],
          reasons: tempData.analysisResults?.reasons || [],
          status: 'Applied',
          role: tempData.analysisResults?.role || 'General',
          email: userObj?.email || 'N/A',
          extractedText: tempData.analysisResults?.extractedText || ''
        };

        const response = await fetch('/api/candidates', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(cand)
        });
        if (response.ok) {
          console.log('Temporary guest uploaded candidate persisted successfully to account!');
        }
      }
    } catch (err) {
      console.error('Failed to persist temporary guest data:', err);
    } finally {
      setTempData(null);
    }
  };

  const handleUpdateUser = (newData, isFullLogin = false) => {
    setUser(prev => {
      const updated = prev ? { ...prev, ...newData } : newData;
      return updated;
    });
    if (isFullLogin) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setAppEntered(false);
    setRecruiterMode(false);
    setActiveView('dashboard');
    localStorage.removeItem('userdb');
    localStorage.removeItem('hrdb');
    localStorage.removeItem('token');
    console.log('User logged out and session db cleared');
  };

  const [recentAnalyses, setRecentAnalyses] = useState([
    { 
      name: "Pratik_Sharma_Resume.pdf", 
      role: "Frontend Developer", 
      score: 92, 
      matchPercentage: 88, 
      date: "10:30 AM", 
      status: "Selected",
      matchedSkills: ["React.js", "TypeScript", "Framer Motion", "Tailwind CSS"]
    },
    { 
      name: "Anjali_Rao_Backend.docx", 
      role: "Node.js Developer", 
      score: 75, 
      matchPercentage: 72, 
      date: "09:45 AM", 
      status: "Consider",
      matchedSkills: ["Node.js", "PostgreSQL", "Redis"]
    },
    { 
      name: "Rahul_Mehta_Sales.pdf", 
      role: "Sales Executive", 
      score: 45, 
      matchPercentage: 30, 
      date: "Yesterday", 
      status: "Rejected",
      matchedSkills: ["CRMs", "Communication"]
    }
  ]);
  
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [analyzerRefreshKey, setAnalyzerRefreshKey] = useState(0);

  const fetchRecentAnalyses = async () => {
    setIsDataLoading(true);
    setDbError(null);
    try {
      const response = await fetch('/api/candidates');
      if (response.status === 503) {
        console.error("DATABASE OFFLINE: MONGODB_URI is likely missing from Vercel environment variables.");
        setDbError("Database Disconnected. Please check Vercel environment variables.");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const formatted = data.map(cand => ({
            id: cand._id || cand.id,
            name: cand.name,
            fileName: cand.fileName || '',
            role: cand.role || 'General',
            score: cand.score || 0,
            matchPercentage: cand.matchPercentage || 0,
            matchedSkills: cand.matchedSkills || [],
            missingSkills: cand.missingSkills || [],
            skills: cand.skills || [],
            strengths: cand.strengths || [],
            weaknesses: cand.weaknesses || [],
            reasons: cand.reasons || [],
            extractedText: cand.extractedText || '',
            status: cand.status || 'Applied',
            timestamp: cand.timestamp || cand.updatedAt || new Date().toISOString(),
            date: cand.timestamp ? new Date(cand.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Today'
          })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          setRecentAnalyses(formatted.slice(0, 15));
          // Signal AnalyzerView (recruiter mode) to re-fetch its candidates list
          setAnalyzerRefreshKey(k => k + 1);
        }
      }
    } catch (err) {
      console.error('Failed to sync dashboard data:', err);
      setDbError("Unable to connect to service.");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (appEntered) {
       fetchRecentAnalyses();
    }
  }, [appEntered]);
  
  const handleSelectCandidate = (candidate) => {
    setResults(candidate);
    setResumeName(candidate.fileName || candidate.name);
    setResumeText(candidate.extractedText || "No extractable text found.");
    setActiveView('analyzer');
  };

  const handleAnalysisComplete = async (data, fileName) => {
    setResults(data);
    if (data.extractedText) setResumeText(data.extractedText);
    if (fileName) setResumeName(fileName);
    
    // If the /api/analyze endpoint already auto-saved this candidate to DB,
    // skip the duplicate POST — just refresh the dashboard.
    if (data._autoSaved) {
      console.log('[App] Candidate was auto-saved by /api/analyze. Skipping duplicate POST.');
      await fetchRecentAnalyses();
      setActiveView('analyzer');
      return;
    }

    // Persist to backend to trigger notifications & mail
    try {
      let candidateName = data.name;
      if (!candidateName && data.firstName && data.lastName) {
        candidateName = `${data.firstName} ${data.lastName}`;
      }
      if (!candidateName && user && user.name) {
        candidateName = user.name;
      }
      if (!candidateName && fileName) {
        candidateName = fileName.split('.')[0];
      }
      if (!candidateName) {
        candidateName = "Untitled Analysis";
      }

      const cand = {
        name: candidateName,
        fileName: fileName,
        score: data.score || 0,
        matchPercentage: data.matchPercentage || 0,
        matchedSkills: data.matchedSkills || [],
        skills: data.skills || [],
        missingSkills: data.missingSkills || [],
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        reasons: data.reasons || [],
        status: 'Applied',
        role: data.role || selectedRole || 'General',
        email: user?.email || 'N/A',
        extractedText: data.extractedText || ''
      };

      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cand)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save candidate: ${response.statusText}`);
      }
      
      const savedCand = await response.json();
      console.log('Single analysis persisted:', savedCand.name, '(ID:', savedCand._id || savedCand.id, ')');
      
      // Auto-refresh after persistence
      await fetchRecentAnalyses();
    } catch (err) {
      console.error('Failed to persist single analysis:', err);
      // Still refresh to show auto-saved record if any
      await fetchRecentAnalyses();
    }

    setActiveView('analyzer');
  };

  const handleBatchComplete = (batchResults) => {
    const dashboardEntries = batchResults.map(data => ({
      id: data.id || Date.now().toString(),
      name: data.name || data.fileName?.split('.')[0] || "Untitled Analysis",
      fileName: data.fileName || "",
      role: data.role || "General",
      score: data.score || 0,
      matchPercentage: data.matchPercentage || 0,
      matchedSkills: data.matchedSkills || [],
      missingSkills: data.missingSkills || [],
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      reasons: data.reasons || [],
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: data.status || data.verdict || "Consider"
    }));
    setRecentAnalyses(prev => [...dashboardEntries, ...prev].slice(0, 20));
  };

  useEffect(() => {
    if (appEntered) {
      document.body.classList.add('app-mode');
    } else {
      document.body.classList.remove('app-mode');
    }
  }, [appEntered]);

  const clearResults = () => {
    setResults(null);
    setResumeText('');
    setResumeName('');
  };

  const handleReset = () => {
    clearResults();
    setActiveView('dashboard');
  };

  const handleViewChange = (view) => {
    if (view === 'dashboard' || view === 'vault') {
      fetchRecentAnalyses();
    }
    setActiveView(view);
  };

  return (
    <>
      <AnimatePresence>
        {activeView === 'interview-room' && (
          <motion.div key="room-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
             <InterviewRoomView roomId={activeRoomId} user={user} onExit={() => setActiveView('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>

      <ChatWidget />

      <AnimatePresence mode="wait">
        {activeView === 'portfolio-view' ? (
          <PublicPortfolioView 
            resumeId={publicPortfolioId} 
            onBack={() => {
              setPublicPortfolioId(null);
              if (isLoggedIn) {
                setActiveView('dashboard');
              } else {
                setAppEntered(false);
                setActiveView('dashboard');
              }
            }} 
          />
        ) : showSplash || isInitializing ? (
          <SplashScreen key="splash" onComplete={() => setTimeout(() => setShowSplash(false), 2500)} />
        ) : !appEntered ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <LandingPage
                onUpload={handleUpload}
                analyzing={analyzing}
                onEnterApp={handleEnterApp}
                onPrompt={setShowSignInPrompt}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            className="main-wrapper"
            style={{ position: 'relative', overflow: 'hidden', padding: activeView === 'builder' ? 0 : undefined, gap: activeView === 'builder' ? 0 : undefined }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {activeView !== 'builder' && (
              <Sidebar 
                activeView={activeView} 
                setActiveView={handleViewChange} 
                recruiterMode={recruiterMode}
                user={user}
                onLogout={handleLogout}
                setRecruiterMode={(val) => {
                  setRecruiterMode(val);
                  if (val) setActiveView('analyzer');
                }} 
              />
            )}
            
            <div className="content-area" style={{ gap: activeView === 'builder' ? 0 : undefined }}>
              {activeView !== 'builder' && (
                <TopHeader 
                  recruiterMode={recruiterMode} 
                  user={user} 
                  darkMode={darkMode} 
                  onToggleDark={() => setDarkMode(d => !d)} 
                  onLogout={handleLogout}
                  style={{ position: 'relative', zIndex: 10 }} 
                />
              )}
              
              <main className="view-container" style={{ position: 'relative', zIndex: 10, padding: activeView === 'builder' ? 0 : undefined }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%' }}
                  >
                    {activeView === 'dashboard' && (
                      <DashboardView 
                        user={user} 
                        recentAnalyses={recentAnalyses}
                        setActiveView={handleViewChange} 
                        setRecruiterMode={setRecruiterMode} 
                        recruiterMode={recruiterMode}
                        onRefresh={fetchRecentAnalyses}
                        onUploadNew={() => setShowResumeUploadWorkflow(true)}
                        onSelectCandidate={handleSelectCandidate}
                        isLoading={isDataLoading}
                        dbError={dbError}
                        onEditResume={(id) => {
                          setActiveResumeId(id);
                          handleViewChange('builder');
                        }}
                      />
                    )}
                    {activeView === 'analyzer' && (
                      <AnalyzerView 
                        results={results} 
                        analyzing={analyzing} 
                        setAnalyzing={setAnalyzing}
                        onAnalysisComplete={handleAnalysisComplete}
                        onBatchComplete={handleBatchComplete}
                        onReset={handleReset}
                        clearResults={clearResults}
                        recruiterMode={recruiterMode}
                        setRecruiterMode={setRecruiterMode}
                        initialFile={pendingFile}
                        initialRole={selectedRole}
                        onUpdateUser={handleUpdateUser}
                        onSetRole={setSelectedRole}
                        setResults={setResults}
                        setResumeText={setResumeText}
                        setResumeName={setResumeName}
                        uploadedResumes={uploadedResumes}
                        setUploadedResumes={setUploadedResumes}
                        setShowDuplicateModal={setShowDuplicateModal}
                        user={user}
                        refreshKey={analyzerRefreshKey}
                        onUpgradeRedirect={(data) => {
                          setTempData(data);
                          setActiveView('subscription');
                        }}
                      />
                    )}
                    {activeView === 'matcher' && <JobMatcherView resumeText={resumeText} resumeName={resumeName} setActiveView={setActiveView} />}
                    {activeView === 'profile' && <ProfileView user={user} onUpdateUser={handleUpdateUser} />}
                    {activeView === 'reports' && <ReportsView recentAnalyses={recentAnalyses} />}
                    {activeView === 'mail' && <InboxView setActiveView={setActiveView} />}
                    {activeView === 'interview' && <InterviewPage token={interviewToken} />}
                    {activeView === 'vault' && <HRResumeVault />}
                    {activeView === 'cover-letters' && <CoverLetterView />}
                    {activeView === 'admin' && <AdminDashboardView />}
                    {activeView === 'subscription' && (
                      <SubscriptionView 
                        user={user} 
                        onUpdateUser={handleUpdateUser} 
                        onNavigateToDashboard={() => {
                          setActiveView('dashboard');
                          persistTemporaryData(user);
                          fetchRecentAnalyses();
                        }} 
                      />
                    )}
                    {activeView === 'builder' && (
                      <SplitBuilderView 
                        user={user} 
                        activeResumeId={activeResumeId} 
                        onComplete={() => {
                          setActiveResumeId(null);
                          setActiveView('dashboard');
                        }} 
                        onUpgradeRedirect={(data) => {
                          setTempData(data);
                          setActiveView('subscription');
                        }}
                      />
                    )}
                  </motion.div>

                </AnimatePresence>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SignInRequiredModal 
        isOpen={showSignInPrompt} 
        onClose={() => setShowSignInPrompt(false)} 
        onSignIn={() => {
          setShowSignInPrompt(false);
          setShowLoginModal(true);
        }} 
      />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => {
          setShowLoginModal(false);
          setLoginError(null);
        }} 
        onAuthSuccess={(userData, token) => {
          setUser(userData);
          setIsLoggedIn(true);
          setAppEntered(true);
          setRecruiterMode(userData.role === 'HR');
          if (pendingAction === 'create') {
            setActiveView('builder');
          } else if (pendingAction === 'upload') {
            setActiveView('dashboard');
            setShowResumeUploadWorkflow(true);
          } else if (pendingFile) {
            setActiveView('analyzer');
          } else {
            setActiveView('dashboard');
          }
          setPendingAction(null);
        }}
      />

      <ResumeAlreadyExistsModal 
        isOpen={showDuplicateModal} 
        onClose={() => setShowDuplicateModal(false)}
        onConfirm={() => setShowDuplicateModal(false)}
      />

      <ResumeBuilderModal 
        isOpen={showResumeBuilder} 
        onClose={() => setShowResumeBuilder(false)}
        onComplete={() => {
          fetchRecentAnalyses();
          setActiveView('analyzer');
        }}
      />

      <ResumeUploadWorkflow 
        isOpen={showResumeUploadWorkflow} 
        onClose={() => {
          setShowResumeUploadWorkflow(false);
          // Refresh dashboard so auto-saved candidates from /api/analyze appear
          fetchRecentAnalyses();
        }}
        user={user}
        onUpgradeRedirect={(data) => {
          setTempData(data);
          setShowResumeUploadWorkflow(false);
          setActiveView('subscription');
        }}
        onComplete={({ analysisResults, fileName, formData }) => {
          setShowResumeUploadWorkflow(false);
          if (analysisResults) {
            // Priority: User Edited Fields (personal) > Analysis Results
            const finalData = { ...analysisResults, ...formData?.personal };
            // handleAnalysisComplete also calls fetchRecentAnalyses internally
            handleAnalysisComplete(finalData, fileName);
          } else {
            // No analysis results path — still refresh dashboard so auto-saved record appears
            fetchRecentAnalyses();
            setActiveView('dashboard');
          }
        }}
      />
    </>
  );
}

export default App;
