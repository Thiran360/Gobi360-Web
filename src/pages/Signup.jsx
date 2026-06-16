import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import authBg from '../assets/auth_bg_new.png';

const Signup = () => {
  const { t } = useLanguage();
  const { signup, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1024;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (formData.password !== formData.confirmPassword) {
      setLocalError(t("Passwords do not match", "கடவுச்சொற்கள் பொருந்தவில்லை"));
      return;
    }

    // Send a broad object with common naming variants to ensure API compatibility
    const signupData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      contact: formData.phone,
      password: formData.password
    };

    console.log("Signup Attempting with:", signupData);
    const result = await signup(signupData);
    if (result.success) {
      console.log("Signup Successful");
      navigate('/profile');
    } else {
      console.log("Signup Failed:", result.error);
      setLocalError(result.error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '1.5rem',
      backgroundColor: '#ffffff'
    }}>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '520px',
          position: 'relative',
          zIndex: 1
        }}
      >

        {/* Focused Signup Card */}
        <div style={{
          backgroundColor: 'white',
          padding: isMobile ? '2rem 1.5rem' : '3.5rem',
          borderRadius: '2.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
              {t("Create Account", "கணக்கை உருவாக்கவும்")}
            </h1>
            <p style={{ color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>
              {t("Enter your details to get started", "தொடங்குவதற்கு உங்கள் விவரங்களை உள்ளிடவும்")}
            </p>
          </div>

          {localError && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              border: '1px solid #fee2e2'
            }}>
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#475569', marginBottom: '0.4rem', marginLeft: '0.5rem' }}>
                {t("Full Name", "முழு பெயர்")}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <User size={18} />
                </div>
                <input
                  type="text" required placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%', padding: '1rem 1.25rem 1rem 3.25rem',
                    borderRadius: '1.25rem', backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#475569', marginBottom: '0.4rem', marginLeft: '0.5rem' }}>
                {t("Mobile Number", "கைபேசி எண்")}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Phone size={18} />
                </div>
                <input
                  type="tel" required placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%', padding: '1rem 1.25rem 1rem 3.25rem',
                    borderRadius: '1.25rem', backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#475569', marginBottom: '0.4rem', marginLeft: '0.5rem' }}>
                {t("Email Address", "மின்னஞ்சல் முகவரி")}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email" required placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%', padding: '1rem 1.25rem 1rem 3.25rem',
                    borderRadius: '1.25rem', backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#475569', marginBottom: '0.4rem', marginLeft: '0.5rem' }}>
                {t("Password", "கடவுச்சொல்")}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%', padding: '1rem 3.25rem 1rem 3.25rem',
                    borderRadius: '1.25rem', backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', outline: 'none'
                  }}
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* Confirm Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#475569', marginBottom: '0.4rem', marginLeft: '0.5rem' }}>
                {t("Confirm Password", "கடவுச்சொல் உறுதிப்படுத்தல்")}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={{
                    width: '100%', padding: '1rem 3.25rem 1rem 3.25rem',
                    borderRadius: '1.25rem', backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: '1rem', backgroundColor: loading ? '#94a3b8' : '#6366f1',
                color: 'white', padding: '1.1rem', borderRadius: '1.25rem',
                fontSize: '1rem', fontWeight: '800', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                boxShadow: loading ? 'none' : '0 10px 25px rgba(99, 102, 241, 0.4)',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? t("Creating Account...", "கணக்கு உருவாக்கப்படுகிறது...") : <>{t("Create Account", "பதிவு செய்யவும்")} <ArrowRight size={20} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontWeight: '600', fontSize: '0.95rem' }}>
            {t("Already have an account?", "ஏற்கனவே கணக்கு உள்ளதா?")}{' '}
            <Link to="/login" style={{ color: '#6366f1', fontWeight: '800', textDecoration: 'none' }}>
              {t("Log In", "உள்நுழைக")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
