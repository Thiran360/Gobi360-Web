import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import authBg from '../assets/auth_bg_new.png';
import logo from '../assets/gobi360-logo.png';

const Login = () => {
  const { t } = useLanguage();
  const { login, loading, error: authError } = useAuth();
  const { loginRole } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
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
    
    const inputUser = formData.phone.trim();
    const inputPass = formData.password.trim();

    // Intercept Hardcoded Owner Login as fallback
    if (inputUser.toLowerCase() === 'admin1' && inputPass === 'admin123') {
      loginRole('owner', 'Admin', 'Bannari Amman');
      navigate('/owner-dashboard');
      return;
    }
    
    if (inputUser.toLowerCase() === 'admin2' && inputPass === 'admin123') {
      loginRole('owner', 'Admin', 'Gobi Restaurant');
      navigate('/owner-dashboard');
      return;
    }

    // Intercept Hardcoded Admin Login
    if (inputUser === '9003727408' && inputPass === '9003727408') {
      loginRole('owner', 'Super Admin', 'Gobi360 Admin');
      navigate('/admin-dashboard');
      return;
    }

    // Since the backend strictly requires a 'role', we must try them in sequence.
    // The 400 Bad Request in the network tab is expected for incorrect roles and is harmless.
    let result = await login(inputUser, inputPass, 'deliveryman');

    if (!result.success) {
      result = await login(inputUser, inputPass, 'expert');
    }

    if (!result.success) {
      result = await login(inputUser, inputPass, 'shopkeeper');
    }
    
    if (!result.success) {
      result = await login(inputUser, inputPass, 'customer');
    }

    if (result.success) {
      // Use the role that succeeded
      const userRole = result.user?.role || result.roleUsed || 'customer';
      
      if (userRole === 'deliveryman' || userRole === 'delivery') {
        loginRole('delivery', result.user?.name || 'Delivery Partner');
        navigate('/delivery-dashboard');
      } else if (userRole === 'expert' || userRole === 'experts') {
        loginRole('expert', result.user?.name || 'Expert');
        navigate('/expert-dashboard');
      } else if (userRole === 'shopkeeper' || userRole === 'owner' || userRole === 'admin') {
        loginRole('owner', result.user?.name || 'Admin', result.user?.shopName || 'My Shop');
        navigate('/owner-dashboard');
      } else {
        loginRole('customer', result.user?.name || inputUser);
        navigate(location.state?.from || '/');
      }
    } else {
      // Show the last meaningful error; if all attempts returned role-mismatch
      // fall back to a clear, professional message
      const errMsg = result.error || '';
      const errLower = errMsg.toLowerCase();
      const isCredentialError =
        errLower.includes('incorrect password') ||
        errLower.includes('no account found') ||
        errLower.includes('disabled') ||
        errLower.includes('too many');

      if (isCredentialError) {
        setLocalError(errMsg);
      } else {
        setLocalError(
          'We could not sign you in. The mobile number or password you entered is incorrect. Please double-check and try again.'
        );
      }
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1.5rem',
      backgroundColor: '#ffffff'
    }}>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Branding Header with Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'black', marginBottom: '0.5rem' }}>{t("Welcome Back!", "மீண்டும் வருக!")}</h2>
          <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#3b82f6', marginBottom: '0.5rem' }}>{t("Sign in to continue your journey", "தொடர உள்நுழையவும்")}</p>
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
              backgroundColor: '#fff5f5',
              border: '1.5px solid #fecaca',
              borderRadius: '1rem',
              marginBottom: '1.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1rem 1.1rem'
              }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <XCircle size={18} color="#dc2626" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '0.2rem' }}>
                    Sign In Failed
                  </p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#dc2626', lineHeight: 1.45 }}>
                    {localError}
                  </p>
                </div>
              </div>
              <div style={{ height: '3px', background: 'linear-gradient(90deg, #ef4444, #f87171, #fca5a5)', borderRadius: '0 0 1rem 1rem' }} />
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
                  type="tel" required placeholder="9876543210" maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
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
            {t("New to Gobi 360? ", "கோபி 360 க்கு புதியவரா? ")}
            <Link
              to="/signup"
              state={location.state}
              style={{
                color: '#3b82f6',
                fontWeight: '800',
                textDecoration: 'none'
              }}
            >
              {t("Create Account", "கணக்கை உருவாக்கு")}
            </Link>
          </p>


        </div>
      </motion.div>
    </div>
  );
};

export default Login;
