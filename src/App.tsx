import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SafetyProvider } from './context/SafetyContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { HowItWorks } from './pages/HowItWorks';
import { Resources } from './pages/Resources';
import { About } from './pages/About';
import { Faq } from './pages/Faq';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// App Portal Pages (Protected)
import { Dashboard } from './pages/app/Dashboard';
import { SosPage } from './pages/app/SosPage';
import { ContactsPage } from './pages/app/ContactsPage';
import { LocationPage } from './pages/app/LocationPage';
import { SafeRoutePage } from './pages/app/SafeRoutePage';
import { FakeCallPage } from './pages/app/FakeCallPage';
import { FindHelpPage } from './pages/app/FindHelpPage';
import { ReportPage } from './pages/app/ReportPage';
import { SettingsPage } from './pages/app/SettingsPage';

// Public Page Shell
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#0B1020] text-white">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SafetyProvider>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/features" element={<PublicLayout><Features /></PublicLayout>} />
          <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
          <Route path="/resources" element={<PublicLayout><Resources /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><Faq /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Authenticated Application Portal Routes (Strictly Protected) */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/sos" element={<ProtectedRoute><AppLayout><SosPage /></AppLayout></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><AppLayout><ContactsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/location" element={<ProtectedRoute><AppLayout><LocationPage /></AppLayout></ProtectedRoute>} />
          <Route path="/safe-route" element={<ProtectedRoute><AppLayout><SafeRoutePage /></AppLayout></ProtectedRoute>} />
          <Route path="/fake-call" element={<ProtectedRoute><AppLayout><FakeCallPage /></AppLayout></ProtectedRoute>} />
          <Route path="/find-help" element={<ProtectedRoute><AppLayout><FindHelpPage /></AppLayout></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><AppLayout><ReportPage /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SafetyProvider>
    </AuthProvider>
  );
};

export default App;
