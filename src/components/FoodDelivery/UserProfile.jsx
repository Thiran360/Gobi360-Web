import React, { useState, useEffect } from 'react';
import { User, MapPin, Clock, CreditCard, ChevronRight, LogOut, ArrowLeft, Settings, Bell, Shield, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import AddressList from './AddressList';
import AccountSettings from './AccountSettings';
import Notifications from './Notifications';
import PastOrders from './PastOrders';
import { useAuth } from '../../context/AuthContext';

// Added subview handling for profile sections



  const UserProfile = ({ onBack }) => {
  const { user, logout } = useAuth();
  
  const [profile, setProfile] = useState({
    picture: '',
    name: 'Guest User',
    email: 'guest@example.com',
    phone: '+91 0000000000',
  });
  const [editing, setEditing] = useState(false);
  const [activeView, setActiveView] = useState('profile');

  // Load profile mixing fdUserProfile (local) and AuthContext (global)
  useEffect(() => {
    let localProfile = {
      picture: '',
      email: 'guest@example.com',
    };
    const stored = localStorage.getItem('fdUserProfile');
    if (stored) {
      localProfile = JSON.parse(stored);
    }
    
    setProfile(prev => ({
      ...prev,
      picture: user?.picture || localProfile.picture || prev.picture,
      email: user?.email || localProfile.email || prev.email,
      name: user?.name || localProfile.name || 'Guest User',
      phone: user?.phone || user?.mobile || localProfile.phone || '+91 0000000000',
    }));
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, picture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRegex = /^[+]?\d{7,15}$/;
    if (!profile.name.trim()) return 'Name is required';
    if (!emailRegex.test(profile.email)) return 'Invalid email address';
    if (!phoneRegex.test(profile.phone.replace(/\s+/g, ''))) return 'Invalid phone number';
    return null;
  };

  const handleSave = () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }
    
    // Save to local fdUserProfile
    localStorage.setItem('fdUserProfile', JSON.stringify(profile));
    setEditing(false);
  };

  // Render subviews based on activeView
  if (activeView !== 'profile') {
    const viewMap = {
      addresses: <AddressList onBack={() => setActiveView('profile')} />, 
      settings: <AccountSettings onBack={() => setActiveView('profile')} />, 
      notifications: <Notifications onBack={() => setActiveView('profile')} />, 
      pastOrders: <PastOrders onBack={() => setActiveView('profile')} />,
    };
    return viewMap[activeView] || null;
  }



    return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Premium Profile Header */}
      <div className="fd-profile-header">
        <div className="fd-profile-overlay"></div>
        <div className="fd-profile-header-content fd-container">
          <button className="fd-profile-back" onClick={onBack}>
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="fd-profile-user-card">
            <div className="fd-profile-avatar-large">
              {profile.picture ? (
          <img src={profile.picture} alt="User" style={{ width: '120px', borderRadius: '50%' }} />
        ) : (
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="User" style={{ width: '120px', borderRadius: '50%' }} />
        )}
            </div>
            <div className="fd-profile-user-info">
              <h1>{profile.name}</h1>
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
            </div>
            {!editing ? (
        <button className="fd-profile-edit-btn" onClick={() => setEditing(true)}>
          Edit Profile
        </button>
      ) : (
        <div className="fd-edit-form">
          <div className="fd-edit-picture">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {profile.picture && (
              <img src={profile.picture} alt="Profile" className="fd-profile-preview" style={{ width: '80px', borderRadius: '50%', marginTop: '8px' }} />
            )}
          </div>
          <div className="fd-edit-field">
            <label>Name</label>
            <input type="text" name="name" value={profile.name} onChange={handleChange} />
          </div>
          <div className="fd-edit-field">
            <label>Email</label>
            <input type="email" name="email" value={profile.email} onChange={handleChange} />
          </div>
          <div className="fd-edit-field">
            <label>Phone</label>
            <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
          </div>
          <div className="fd-edit-actions">
            <button onClick={handleSave} className="fd-save-btn">Save Changes</button>
            <button onClick={() => setEditing(false)} className="fd-cancel-btn">Cancel</button>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>

      <div className="fd-container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
        
        {/* Menu Items Grid */}
        <div className="fd-profile-sections">
          
          <div className="fd-profile-section-title">Food Orders</div>
          <div className="fd-profile-menu-group">
            <motion.div className="fd-profile-menu-item" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onClick={() => setActiveView('pastOrders')}>
              <div className="fd-profile-menu-icon" style={{ background: '#fff0ed', color: '#fc8019' }}>
                <Clock size={20} />
              </div>
              <div className="fd-profile-menu-text">
                <h3>Past Orders</h3>
                <p>View your previous orders</p>
              </div>
              <ChevronRight size={20} color="#cbd5e1" />
            </motion.div>

            <motion.div className="fd-profile-menu-item" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} onClick={() => setActiveView('addresses')}>
              <div className="fd-profile-menu-icon" style={{ background: '#f0fdf4', color: '#22c55e' }}>
                <MapPin size={20} />
              </div>
              <div className="fd-profile-menu-text">
                <h3>Saved Addresses</h3>
                <p>Manage delivery locations</p>
              </div>
              <ChevronRight size={20} color="#cbd5e1" />
            </motion.div>
          </div>

          <div className="fd-profile-section-title">Settings</div>
          <div className="fd-profile-menu-group">

            <motion.div className="fd-profile-menu-item" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} onClick={() => setActiveView('settings')}>
              <div className="fd-profile-menu-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                <Settings size={20} />
              </div>
              <div className="fd-profile-menu-text">
                <h3>Account Settings</h3>
                <p>Privacy, security & language</p>
              </div>
              <ChevronRight size={20} color="#cbd5e1" />
            </motion.div>

            <motion.div className="fd-profile-menu-item" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onClick={() => setActiveView('notifications')}>
              <div className="fd-profile-menu-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                <Bell size={20} />
              </div>
              <div className="fd-profile-menu-text">
                <h3>Notifications</h3>
                <p>Manage alerts & emails</p>
              </div>
              <ChevronRight size={20} color="#cbd5e1" />
            </motion.div>
          </div>

          <div className="fd-profile-menu-group" style={{ marginTop: '2rem' }}>
            <motion.div 
              className="fd-profile-menu-item fd-logout-item" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.35 }}
              onClick={() => {
                logout();
                onBack();
              }}
            >
              <div className="fd-profile-menu-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
                <LogOut size={20} />
              </div>
              <div className="fd-profile-menu-text">
                <h3 style={{ color: '#ef4444' }}>Log Out</h3>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
