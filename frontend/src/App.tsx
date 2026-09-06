import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SyntheticBanner } from './components/SyntheticBanner';
import { GuidedDemoTour } from './components/GuidedDemoTour';

import { LoginPage } from './pages/LoginPage';
import { ConsentPage } from './pages/ConsentPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientListPage } from './pages/PatientListPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { BaselinePage } from './pages/BaselinePage';
import { EvaluationPage } from './pages/EvaluationPage';
import { FailureCasesPage } from './pages/FailureCasesPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { PrivacySafetyPage } from './pages/PrivacySafetyPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, hasConsent } = useAuth();
  const location = useLocation();
  const [demoTourOpen, setDemoTourOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasConsent && location.pathname !== '/consent') {
    return <Navigate to="/consent" replace />;
  }

  if (location.pathname === '/consent') {
    return <>{children}</>;
  }

  const getTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Ward Safety Overview';
    if (path.startsWith('/patients/')) return 'Patient Decision Support Profile';
    if (path.startsWith('/patients')) return 'Patient Census Directory';
    if (path.startsWith('/baseline')) return 'Baseline Benchmark Experiment';
    if (path.startsWith('/evaluation')) return 'Evaluation Metrics Dashboard';
    if (path.startsWith('/failure-cases')) return 'Handled Failure & Edge Cases';
    if (path.startsWith('/audit-logs')) return 'Governance & Audit Trail';
    if (path.startsWith('/feedback')) return 'Stakeholder Usability Validation';
    if (path.startsWith('/privacy')) return 'Privacy & Safety Statement';
    if (path.startsWith('/settings')) return 'System Settings';
    return 'MEDSAFE Workstation';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar onStartDemo={() => setDemoTourOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SyntheticBanner />
        <Header title={getTitle(location.pathname)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <GuidedDemoTour isOpen={demoTourOpen} onClose={() => setDemoTourOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/consent" element={<ProtectedLayout><ConsentPage /></ProtectedLayout>} />
          <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
          <Route path="/patients" element={<ProtectedLayout><PatientListPage /></ProtectedLayout>} />
          <Route path="/patients/:patientId" element={<ProtectedLayout><PatientDetailPage /></ProtectedLayout>} />
          <Route path="/baseline" element={<ProtectedLayout><BaselinePage /></ProtectedLayout>} />
          <Route path="/evaluation" element={<ProtectedLayout><EvaluationPage /></ProtectedLayout>} />
          <Route path="/failure-cases" element={<ProtectedLayout><FailureCasesPage /></ProtectedLayout>} />
          <Route path="/audit-logs" element={<ProtectedLayout><AuditLogsPage /></ProtectedLayout>} />
          <Route path="/feedback" element={<ProtectedLayout><FeedbackPage /></ProtectedLayout>} />
          <Route path="/privacy" element={<ProtectedLayout><PrivacySafetyPage /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
