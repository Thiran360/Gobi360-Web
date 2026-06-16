import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Edit, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'fdAccountSettings';

const defaultSettings = {
  privacy: true, // true = public profile
  twoFA: false,
  language: 'en',
};

const AccountSettings = ({ onBack }) => {
  const [settings, setSettings] = useState(defaultSettings);

  // Load stored settings
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleLanguageChange = (e) => {
    setSettings((prev) => ({ ...prev, language: e.target.value }));
  };

  return (
    <motion.div className="fd-settings-section" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="fd-panel-header">
        <h2>Account Settings</h2>
        <button className="fd-address-back" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      </div>

      {/* Privacy & Security Card */}
      <div className="fd-panel-card">
        <h3 className="fd-panel-subtitle">Privacy & Security</h3>
        <div className="fd-panel-item">
          <label className="fd-settings-label">
            <Shield size={20} /> Public Profile
          </label>
          <input type="checkbox" checked={settings.privacy} onChange={() => handleToggle('privacy')} />
        </div>
        <div className="fd-panel-item">
          <label className="fd-settings-label">
            <Edit size={20} /> Two‑Factor Authentication
          </label>
          <input type="checkbox" checked={settings.twoFA} onChange={() => handleToggle('twoFA')} />
        </div>
      </div>

      {/* Language Preference Card */}
      <div className="fd-panel-card">
        <h3 className="fd-panel-subtitle">Language Preference</h3>
        <div className="fd-panel-item">
          <label className="fd-settings-label"><Globe size={20} /> Language</label>
          <select value={settings.language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettings;
