import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import authBg from '../assets/auth_bg_new.png';
import logo from '../assets/gobi360-logo.png';

const Login = () => {
  const { t } = useLanguage();
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ phone: '', password: '' });
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
    const result = await login(formData.phone, formData.password);
    if (result.success) {
      navigate('/profile');
    } else {
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
          maxWidth: '440px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Branding Header with Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'black', marginBottom: '0.5rem' }}>Welcome Back!</h2>
          <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#3b82f6', marginBottom: '0.5rem' }}>Sign in to continue your journey</p>
        </div>



        {/* Focused Auth Card */}
        <div style={{
          backgroundColor: 'white',
          padding: isMobile ? '1.5rem 1.5rem' : '2rem 1.5rem',
          borderRadius: '2.5rem',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>


          {localError && (
            <div style={{
              backgroundColor: '#fef2f2', color: '#dc2626', padding: '1rem',
              borderRadius: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem',
              fontWeight: '700', border: '1px solid #fee2e2'
            }}>
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#475569', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>
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
                    width: '100%', padding: '1.1rem 1.25rem 1.1rem 3.25rem',
                    borderRadius: '1.25rem', backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#475569' }}>{t("Password", "கடவுச்சொல்")}</label>
                <Link to="#" style={{ fontSize: '0.8rem', fontWeight: '700', color: '#3b82f6' }}>{t("Forgot?", "மறந்துவிட்டதா?")}</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%', padding: '1.1rem 3.25rem 1.1rem 3.25rem',
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

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: '0.5rem', backgroundColor: loading ? '#94a3b8' : '#3b82f6',
                color: 'white', padding: '1.1rem', borderRadius: '1.25rem',
                fontSize: '1rem', fontWeight: '800', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                boxShadow: loading ? 'none' : '0 10px 25px rgba(59, 130, 246, 0.2)',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? t("Signing In...", "உள்நுழைகிறது...") : <>{t("Sign In", "உள்நுழையவும்")} <ArrowRight size={20} /></>}
            </button>
          </form>





          <p style={{
            textAlign: 'center',
            marginTop: '2.5rem',
            color: '#64748b',
            fontWeight: '600',
            fontSize: '0.95rem',
            backgroundColor: '#ffffff',
            padding: '0.75rem',
            borderRadius: '1rem'
          }}>
            New to Gobi 360?{' '}
            <Link
              to="/signup"
              style={{
                color: '#3b82f6',
                fontWeight: '800',
                textDecoration: 'none'
              }}
            >
              Create Account
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
