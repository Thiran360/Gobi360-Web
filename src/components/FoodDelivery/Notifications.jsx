import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'fdNotifications';

const defaultNotifications = {
  promotions: true,
  orderUpdates: true,
  newsletters: false,
};

const Notifications = ({ onBack }) => {
  const [settings, setSettings] = useState(defaultNotifications);

  // Load stored settings
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <motion.div className="fd-settings-section" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="fd-panel-header">
        <h2>Notification Settings</h2>
        <button className="fd-address-back" onClick={onBack}>← Back</button>
      </div>

      {/* Alerts & Updates Card */}
      <div className="fd-panel-card">
        <h3 className="fd-panel-subtitle">Alerts & Updates</h3>
        <div className="fd-panel-item">
          <label className="fd-settings-label">
            <Bell size={20} /> Promotional Alerts
          </label>
          <input type="checkbox" checked={settings.promotions} onChange={() => toggle('promotions')} />
        </div>
        <div className="fd-panel-item">
          <label className="fd-settings-label">
            <CheckCircle size={20} /> Order Updates
          </label>
          <input type="checkbox" checked={settings.orderUpdates} onChange={() => toggle('orderUpdates')} />
        </div>
        <div className="fd-panel-item">
          <label className="fd-settings-label">
            <Bell size={20} /> Newsletter
          </label>
          <input type="checkbox" checked={settings.newsletters} onChange={() => toggle('newsletters')} />
        </div>
      </div>
    </motion.div>
  );
};

export default Notifications;
