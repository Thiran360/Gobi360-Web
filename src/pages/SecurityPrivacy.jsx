import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, CheckCircle, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecurityPrivacy = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage('New passwords do not match!');
      return;
    }
    
    // Simulate updating password locally for now
    const stored = localStorage.getItem('registeredUser');
    if (stored) {
      const regUser = JSON.parse(stored);
      if (passwords.current !== regUser.password) {
        setMessage('Current password is incorrect.');
        return;
      }
      regUser.password = passwords.new;
      localStorage.setItem('registeredUser', JSON.stringify(regUser));
      setMessage('Password updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      setMessage('Failed to update password.');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/profile')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            background: 'none', border: 'none', color: '#64748b', 
            fontWeight: '700', cursor: 'pointer', marginBottom: '2rem' 
          }}
        >
          <ArrowLeft size={18} /> Back to Profile
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <Shield size={24} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a' }}>Security & Privacy</h1>
          </div>

          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Password Change Form */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} color="#64748b" /> Change Password
              </h3>
              
              {message && (
                <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '1rem', backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2', color: message.includes('success') ? '#059669' : '#dc2626', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {message.includes('success') && <CheckCircle size={16} />} {message}
                </div>
              )}

              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.5rem' }}>Current Password</label>
                  <input 
                    type="password" required
                    value={passwords.current}
                    onChange={e => setPasswords({...passwords, current: e.target.value})}
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.5rem' }}>New Password</label>
                  <input 
                    type="password" required minLength="6"
                    value={passwords.new}
                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.5rem' }}>Confirm New Password</label>
                  <input 
                    type="password" required minLength="6"
                    value={passwords.confirm}
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <button type="submit" style={{ marginTop: '0.5rem', padding: '1.1rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: '800', cursor: 'pointer' }}>
                  Update Password
                </button>
              </form>
            </div>

            {/* Two Factor Auth Toggle */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Smartphone size={20} color="#64748b" /> Two-Factor Authentication
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Add an extra layer of security to your account.</p>
              </div>
              <button 
                onClick={() => setTwoFactor(!twoFactor)}
                style={{
                  width: '56px', height: '32px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                  backgroundColor: twoFactor ? '#10b981' : '#e2e8f0', position: 'relative', transition: 'all 0.3s'
                }}
              >
                <div style={{
                  width: '24px', height: '24px', backgroundColor: 'white', borderRadius: '50%',
                  position: 'absolute', top: '4px', left: twoFactor ? '28px' : '4px', transition: 'all 0.3s',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
