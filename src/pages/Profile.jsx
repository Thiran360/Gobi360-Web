import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, User, Mail, Phone, ArrowLeft, Shield,
  ChevronRight, Lock, Eye, EyeOff, Bell, Globe,
  CheckCircle, AlertCircle, Settings, Edit3, Save, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Reusable Toggle ──────────────────────────────────────────────────────────
const PrivacyToggle = ({ label, description, storageKey }) => {
  const [enabled, setEnabled] = useState(() => {
    const v = localStorage.getItem('profilePrivacy_' + storageKey);
    return v === null ? true : v === 'true';
  });

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem('profilePrivacy_' + storageKey, String(next));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ flex: 1, paddingRight: '1rem' }}>
        <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{label}</p>
        <p style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: '500' }}>{description}</p>
      </div>
      <button
        onClick={toggle}
        style={{
          width: '46px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer',
          background: enabled ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#e2e8f0',
          position: 'relative', transition: 'background 0.3s ease', flexShrink: 0
        }}
      >
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%', background: 'white',
          position: 'absolute', top: '3px', transition: 'left 0.3s ease',
          left: enabled ? '23px' : '3px', boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
        }} />
      </button>
    </div>
  );
};

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    style={{
      background: 'white', borderRadius: '1.5rem',
      padding: '1.75rem', boxShadow: '0 4px 24px rgba(99,102,241,0.06)',
      border: '1px solid #f1f5f9', marginBottom: '1.25rem'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', padding: '0.5rem', borderRadius: '0.65rem', color: 'white', display: 'flex' }}>
        {icon}
      </div>
      <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>{title}</h2>
    </div>
    {children}
  </motion.div>
);

// ─── Sub-view wrapper ─────────────────────────────────────────────────────────
const SubView = ({ title, onBack, children }) => (
  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
    <button
      onClick={onBack}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '700', padding: '0.5rem 0' }}
    >
      <ArrowLeft size={17} /> {title}
    </button>
    {children}
  </motion.div>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const InputField = ({ label, type = 'text', value, onChange, icon, placeholder, rightEl }) => (
  <div style={{ marginBottom: '1.1rem' }}>
    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#475569', marginBottom: '0.45rem', marginLeft: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      {icon && (
        <div style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
          {icon}
        </div>
      )}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: '100%', padding: `1rem ${rightEl ? '3.25rem' : '1.25rem'} 1rem ${icon ? '3rem' : '1.25rem'}`,
          borderRadius: '1rem', background: '#f8fafc', border: '1.5px solid #e2e8f0',
          fontSize: '0.95rem', fontWeight: '600', outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={e => e.target.style.borderColor = '#6366f1'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
      {rightEl && (
        <div style={{ position: 'absolute', right: '1.1rem', top: '50%', transform: 'translateY(-50%)' }}>
          {rightEl}
        </div>
      )}
    </div>
  </div>
);

const Toast = ({ msg, type }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    style={{
      position: 'fixed', top: '90px', left: '50%', transform: 'translateX(-50%)',
      background: type === 'success' ? '#22c55e' : '#ef4444',
      color: 'white', padding: '0.8rem 1.5rem', borderRadius: '2rem',
      fontWeight: '800', fontSize: '0.875rem', zIndex: 9999,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem'
    }}
  >
    {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    {msg}
  </motion.div>
);

// ─── Change Password Sub-view ─────────────────────────────────────────────────
const ChangePassword = ({ onBack, showToast }) => {
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPwd: false, confirm: false });
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    if (!form.current || !form.newPwd || !form.confirm) { setError('All fields are required.'); return; }
    if (form.newPwd.length < 6) { setError('New password must be at least 6 characters.'); return; }
    if (form.newPwd !== form.confirm) { setError('Passwords do not match.'); return; }

    const stored = localStorage.getItem('registeredUser');
    if (stored) {
      const reg = JSON.parse(stored);
      if (reg.password !== form.current) { setError('Current password is incorrect.'); return; }
      reg.password = form.newPwd;
      localStorage.setItem('registeredUser', JSON.stringify(reg));
    }
    showToast('Password changed successfully!', 'success');
    onBack();
  };

  const eyeBtn = (key) => (
    <button type="button" onClick={() => setShow(p => ({ ...p, [key]: !p[key] }))}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
      {show[key] ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <SubView title="Back to Profile" onBack={onBack}>
      <SectionCard title="Change Password" icon={<Lock size={16} />}>
        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.875rem 1rem', borderRadius: '0.875rem', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: '700', border: '1px solid #fee2e2', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}
        <InputField label="Current Password" type={show.current ? 'text' : 'password'} value={form.current}
          onChange={e => setForm(p => ({ ...p, current: e.target.value }))}
          icon={<Lock size={17} />} placeholder="Enter current password" rightEl={eyeBtn('current')} />
        <InputField label="New Password" type={show.newPwd ? 'text' : 'password'} value={form.newPwd}
          onChange={e => setForm(p => ({ ...p, newPwd: e.target.value }))}
          icon={<Lock size={17} />} placeholder="Min. 6 characters" rightEl={eyeBtn('newPwd')} />
        <InputField label="Confirm New Password" type={show.confirm ? 'text' : 'password'} value={form.confirm}
          onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
          icon={<Lock size={17} />} placeholder="Re-enter new password" rightEl={eyeBtn('confirm')} />
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          style={{ width: '100%', padding: '1.1rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '0.975rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
          <Save size={17} /> Update Password
        </motion.button>
      </SectionCard>
    </SubView>
  );
};

// ─── Notifications Sub-view ───────────────────────────────────────────────────
const NotificationSettings = ({ onBack }) => (
  <SubView title="Back to Profile" onBack={onBack}>
    <SectionCard title="Notification Preferences" icon={<Bell size={16} />}>
      <PrivacyToggle label="Push Notifications" description="Receive alerts on your device" storageKey="push" />
      <PrivacyToggle label="SMS Alerts" description="Get important updates via SMS" storageKey="sms" />
      <PrivacyToggle label="Email Notifications" description="Receive emails for account activity" storageKey="email" />
      <PrivacyToggle label="Promotional Offers" description="Deals and discount notifications" storageKey="promo" />
      <PrivacyToggle label="Security Alerts" description="Alerts for login and security events" storageKey="security" />
    </SectionCard>
  </SubView>
);

// ─── Language Sub-view ────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
];

const LanguageSettings = ({ onBack, showToast }) => {
  const [selected, setSelected] = useState(() => localStorage.getItem('appLanguage') || 'en');

  const handleSelect = (code) => {
    setSelected(code);
    localStorage.setItem('appLanguage', code);
    showToast('Language preference saved!', 'success');
  };

  return (
    <SubView title="Back to Profile" onBack={onBack}>
      <SectionCard title="Language & Region" icon={<Globe size={16} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem', borderRadius: '1rem', border: `2px solid ${selected === lang.code ? '#6366f1' : '#e2e8f0'}`,
                background: selected === lang.code ? '#eef2ff' : '#f8fafc',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>{lang.label}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: '600' }}>{lang.native}</p>
              </div>
              {selected === lang.code && <CheckCircle size={20} color="#6366f1" />}
            </button>
          ))}
        </div>
      </SectionCard>
    </SubView>
  );
};

// ─── Edit Profile Sub-view ────────────────────────────────────────────────────
const EditProfile = ({ onBack, showToast }) => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || user?.mobile || '',
  });
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    const phoneRegex = /^[+]?\d{7,15}$/;
    if (form.phone && !phoneRegex.test(form.phone.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number.'); return;
    }
    updateUser({ name: form.name, email: form.email, phone: form.phone });
    // Also update registeredUser
    const stored = localStorage.getItem('registeredUser');
    if (stored) {
      const reg = JSON.parse(stored);
      localStorage.setItem('registeredUser', JSON.stringify({ ...reg, name: form.name, email: form.email, phone: form.phone }));
    }
    showToast('Profile updated successfully!', 'success');
    onBack();
  };

  return (
    <SubView title="Back to Profile" onBack={onBack}>
      <SectionCard title="Edit Profile" icon={<Edit3 size={16} />}>
        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.875rem 1rem', borderRadius: '0.875rem', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: '700', border: '1px solid #fee2e2', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}
        <InputField label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          icon={<User size={17} />} placeholder="Your full name" />
        <InputField label="Mobile Number" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          icon={<Phone size={17} />} placeholder="+91 98765 43210" />
        <InputField label="Email Address" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          icon={<Mail size={17} />} placeholder="name@example.com" />
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          style={{ width: '100%', padding: '1.1rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '0.975rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(99,102,241,0.35)', marginTop: '0.5rem' }}>
          <Save size={17} /> Save Changes
        </motion.button>
      </SectionCard>
    </SubView>
  );
};

// ─── Main Profile ─────────────────────────────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [view, setView] = useState('main'); // main | editProfile | changePassword | notifications | language
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const initials = (user?.name || 'G').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ background: 'linear-gradient(160deg,#eef2ff 0%,#f8fafc 100%)', minHeight: '100vh', paddingTop: '90px', paddingBottom: '4rem' }}>
      <AnimatePresence>{toast && <Toast msg={toast.msg} type={toast.type} />}</AnimatePresence>

      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '0 1.25rem' }}>

        <AnimatePresence mode="wait">

          {/* ── MAIN VIEW ── */}
          {view === 'main' && (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button
                onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '1.75rem', fontSize: '0.9rem', fontWeight: '700', padding: '0.5rem 0' }}
              >
                <ArrowLeft size={17} /> Back to Home
              </button>

              {/* Hero Card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{ background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 50%,#4338ca 100%)', borderRadius: '1.75rem', padding: '2.5rem 2rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(99,102,241,0.3)' }}
              >
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '3px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '900', color: 'white', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Gobi 360 Account</p>
                    <h1 style={{ color: 'white', fontSize: '1.55rem', fontWeight: '900', marginBottom: '0.4rem' }}>{user?.name || 'Guest User'}</h1>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.8rem', borderRadius: '2rem' }}>
                      <CheckCircle size={12} color="#86efac" />
                      <span style={{ color: '#86efac', fontSize: '0.75rem', fontWeight: '800' }}>Verified Account</span>
                    </div>
                  </div>
                  <button onClick={() => setView('editProfile')} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '0.75rem', padding: '0.6rem', color: 'white', cursor: 'pointer', display: 'flex', flexShrink: 0, backdropFilter: 'blur(4px)' }}>
                    <Edit3 size={18} />
                  </button>
                </div>
              </motion.div>

              {/* Account Info */}
              <SectionCard title="Account Information" icon={<User size={16} />} delay={0.1}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { icon: <Phone size={15} />, label: 'Mobile Number', value: user?.phone || user?.mobile },
                    { icon: <Mail size={15} />, label: 'Email Address', value: user?.email },
                  ].map(({ icon, label, value }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', padding: '0.65rem', borderRadius: '0.75rem', color: 'white', display: 'flex', flexShrink: 0 }}>{icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label}</p>
                        <p style={{ color: value ? '#0f172a' : '#cbd5e1', fontWeight: '700', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: value ? 'normal' : 'italic' }}>
                          {value || 'Not provided'}
                        </p>
                      </div>
                      <CheckCircle size={16} color={value ? '#22c55e' : '#e2e8f0'} />
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Settings */}
              <SectionCard title="Settings" icon={<Settings size={16} />} delay={0.3}>
                {[
                  { icon: <Lock size={16} />, label: 'Change Password', sub: 'Update your account password', action: () => setView('changePassword') },
                  { icon: <Bell size={16} />, label: 'Notifications', sub: 'Manage alerts and reminders', action: () => setView('notifications') },
                  { icon: <Globe size={16} />, label: 'Language & Region', sub: 'Tamil / English / Hindi', action: () => setView('language') },
                ].map(({ icon, label, sub, action }, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
                    onClick={action}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 0.75rem', background: 'none', border: 'none', borderRadius: '1rem', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s ease' }}
                    onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', padding: '0.65rem', borderRadius: '0.75rem', color: 'white', flexShrink: 0 }}>{icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.925rem' }}>{label}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500' }}>{sub}</p>
                    </div>
                    <ChevronRight size={18} color="#cbd5e1" />
                  </motion.button>
                ))}
              </SectionCard>

              {/* Logout */}
              <motion.button
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                onClick={() => { logout(); navigate('/'); }}
                style={{ width: '100%', padding: '1.1rem', background: '#fef2f2', color: '#ef4444', border: '2px solid #fecaca', borderRadius: '1.25rem', fontSize: '0.975rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                whileHover={{ scale: 1.01, backgroundColor: '#fee2e2' }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={19} /> Log Out
              </motion.button>
              <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '0.78rem', fontWeight: '600', marginTop: '1.5rem' }}>Gobi 360 · Version 1.0.0</p>
            </motion.div>
          )}

          {view === 'editProfile' && (
            <EditProfile key="edit" onBack={() => setView('main')} showToast={showToast} />
          )}
          {view === 'changePassword' && (
            <ChangePassword key="pwd" onBack={() => setView('main')} showToast={showToast} />
          )}
          {view === 'notifications' && (
            <NotificationSettings key="notif" onBack={() => setView('main')} />
          )}
          {view === 'language' && (
            <LanguageSettings key="lang" onBack={() => setView('main')} showToast={showToast} />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
