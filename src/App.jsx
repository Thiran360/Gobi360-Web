import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Experts from './pages/Experts';
import Services from './pages/Services';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyServices from './pages/MyServices';
import SupportTickets from './pages/SupportTickets';
import SecurityPrivacy from './pages/SecurityPrivacy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import aiAvatar from './assets/ai_bot_no_text.png';

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
        <Router>
          <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/experts" element={<Experts />} />
                <Route path="/services" element={<Services />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/my-services" element={<MyServices />} />
                <Route path="/support-tickets" element={<SupportTickets />} />
                <Route path="/security" element={<SecurityPrivacy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              </Routes>
            </div>

            <Footer />

            <VoiceAssistant />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
