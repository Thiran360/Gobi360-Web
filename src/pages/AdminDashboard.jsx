import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, LogOut, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState('call-list');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  const [callList, setCallList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalls = () => {
      fetch(`${API_BASE_URL}/call-request-list/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => res.json())
        .then(data => {
          // Handle if response is { results: [...] } or just [...]
          const results = Array.isArray(data) ? data : (data.results || []);
          setCallList(results);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch call list:", err);
          setLoading(false);
        });
    };

    fetchCalls();
    const callInterval = setInterval(fetchCalls, 5000);
    return () => clearInterval(callInterval);
  }, []);

  // ── SIDEBAR NAV STYLE ────────────────────────────────────
  const navItemStyle = (active) => ({
    padding: '1rem 1.25rem',
    background: active ? '#eff6ff' : 'transparent',
    color: active ? '#2563eb' : '#64748b',
    borderRadius: '12px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    cursor: 'pointer',
    marginBottom: '0.6rem',
    transition: 'all 0.2s',
    border: active ? `1.5px solid #bfdbfe` : '1.5px solid transparent'
  });

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      {!isMobile && (
        <div style={{ width: '280px', height: '100vh', background: 'white', borderRight: '1px solid #e2e8f0', borderBottom: 'none', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', flexShrink: 0, boxShadow: '4px 0 24px rgba(0,0,0,0.02)', zIndex: 10, boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #ea580c, #c2410c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem' }}>A</div>
            Admin Panel
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div
              onClick={() => setActiveTab('call-list')}
              style={navItemStyle(activeTab === 'call-list')}
            >
              <PhoneCall size={20} />
              Call List
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <div
              onClick={handleLogout}
              style={{ ...navItemStyle(false), color: '#ef4444', marginBottom: 0 }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#fef2f2';
                e.currentTarget.style.borderColor = '#fecaca';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <LogOut size={20} />
              Logout
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div style={{ flex: 1, padding: isMobile ? '1.5rem 1rem' : '2.5rem 3rem', overflowY: 'auto', height: isMobile ? 'auto' : '100vh', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          {activeTab === 'call-list' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>Call List</h1>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Manage and view all incoming calls and requests.</p>
              </div>

              <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {loading ? (
                    <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading calls...</p>
                  ) : callList.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No call requests found.</p>
                  ) : callList.map((call, idx) => {
                    const cName = call.customer_name || call.customer?.name || `Customer ID: ${call.customer || 'Unknown'}`;
                    const rawPhone = call.customer_mobile || call.customer_phone || call.customer?.mobile || call.customer?.phone || call.mobile || call.phone || call.expert_mobile;
                    const cPhone = rawPhone ? `Phone: ${rawPhone}` : 'Phone N/A';
                    const cDate = call.created_at ? new Date(call.created_at).toLocaleString() : 'N/A';
                    let rawStatus = call.status || 'not_answered';
                    const displayStatus = rawStatus === 'not_answered' ? 'Missed' : (rawStatus === 'answered' ? 'Answered' : rawStatus);

                    const isCompleted = displayStatus === 'Answered' || displayStatus === 'Completed';

                    return (
                      <div key={call.id || idx} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#f8fafc', gap: '1rem' }}>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isCompleted ? '#dcfce7' : '#fee2e2', color: isCompleted ? '#16a34a' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Phone size={24} />
                          </div>
                          <div>
                            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{cName}</h3>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>{cPhone}</p>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>
                              {call.expert_name ? `Expert: ${call.expert_name}` : `Expert ID: ${call.expert || 'N/A'}`}
                              {' • '}
                              {call.service_name ? `Service: ${call.service_name}` : `Service ID: ${call.service || 'N/A'}`}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'center' : 'flex-end', justifyContent: 'space-between', width: isMobile ? '100%' : 'auto', gap: '0.5rem' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>{cDate}</span>
                          <span style={{
                            background: isCompleted ? '#dcfce7' : '#fee2e2',
                            color: isCompleted ? '#16a34a' : '#ef4444',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            textTransform: 'uppercase'
                          }}>
                            {displayStatus}
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
}
