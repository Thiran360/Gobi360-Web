import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for better performance (Code splitting)
const Home = lazy(() => import('./pages/Home'));
const Experts = lazy(() => import('./pages/Experts'));
const Services = lazy(() => import('./pages/Services'));
const Profile = lazy(() => import('./pages/Profile'));
const Reviews = lazy(() => import('./pages/Reviews'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const MyServices = lazy(() => import('./pages/MyServices'));
const SupportTickets = lazy(() => import('./pages/SupportTickets'));
const SecurityPrivacy = lazy(() => import('./pages/SecurityPrivacy'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'));
const ExpertDashboard = lazy(() => import('./pages/ExpertDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DeliveryDashboard = lazy(() => import('./pages/DeliveryDashboard'));
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import VoiceAssistant from './components/VoiceAssistant';

const App = () => {
  React.useEffect(() => {
    // Check if the URL has an old hash (e.g., /home/#/privacy-policy or /#/privacy-policy)
    if (window.location.hash.startsWith('#/')) {
      const cleanPath = window.location.hash.substring(1); // Remove the '#'
      // Redirect to the clean path at the root level
      window.location.replace(cleanPath);
    } else if (window.location.pathname.toLowerCase().includes('/home')) {
      // If they somehow got to /home, redirect to root
      window.location.replace('/');
    }
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <ShopProvider>
          <Router>
            <DashboardAuthGuard />
            <ScrollToTop />
            <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />

              <div style={{ flex: 1 }}>
                <Suspense fallback={
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>
                      {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                    </style>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/experts" element={<Experts />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:id" element={<ServiceDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/my-services" element={<MyServices />} />
                    <Route path="/support-tickets" element={<SupportTickets />} />
                    <Route path="/security" element={<SecurityPrivacy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/owner-dashboard" element={<OwnerDashboard />} />
                    <Route path="/expert-dashboard" element={<ExpertDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
                  </Routes>
                </Suspense>
              </div>

              <Footer />

              <VoiceAssistant />
            </div>
          </Router>
        </ShopProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

// Guard component that runs inside Router and has access to location and auth context
import { useAuth } from './context/AuthContext';
import { useLocation } from 'react-router-dom';

const DashboardAuthGuard = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const prevPathRef = React.useRef(location.pathname);

  React.useEffect(() => {
    const prev = prevPathRef.current.toLowerCase();
    const curr = location.pathname.toLowerCase();

    const isDashboard = (path) => 
      path.startsWith('/owner-dashboard') || 
      path.startsWith('/expert-dashboard') || 
      path.startsWith('/admin-dashboard') ||
      path.startsWith('/delivery-dashboard');

    // If navigated away from a dashboard to a non-dashboard page, log out automatically
    if (isDashboard(prev) && !isDashboard(curr)) {
      logout();
    }

    prevPathRef.current = location.pathname;
  }, [location.pathname, logout]);

  return null;
};

export default App;
