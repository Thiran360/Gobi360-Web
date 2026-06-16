import React, { useState, useEffect } from 'react';
import { MapPin, Edit2, Trash2, Star, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Utility to generate a simple unique id
const generateId = () => Date.now().toString();

const STORAGE_KEY = 'fdAddresses';

const defaultAddresses = [
  {
    id: 'a1',
    label: 'Home',
    line1: '123 Main Street',
    line2: 'Gobichettipalayam, Tamil Nadu',
    phone: '+91 9876543210',
    isDefault: true,
  },
  {
    id: 'a2',
    label: 'Office',
    line1: '456 Business Park',
    line2: 'Erode, Tamil Nadu',
    phone: '+91 9123456789',
    isDefault: false,
  },
];

const AddressList = ({ onBack }) => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Load addresses from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAddresses(JSON.parse(stored));
    } else {
      setAddresses(defaultAddresses);
    }
  }, []);

  // Persist addresses whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const openForm = (addr = null) => {
    setEditingAddress(addr);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingAddress(null);
    setShowForm(false);
  };
  const handleSetDefault = (id) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this address?')) {
      const updated = addresses.filter(a => a.id !== id);
      const hadDefault = addresses.find(a => a.id === id && a.isDefault);
      if (hadDefault && updated.length) {
        updated[0].isDefault = true;
      }
      setAddresses(updated);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      id: editingAddress ? editingAddress.id : generateId(),
      label: form.label.value,
      line1: form.line1.value.trim(),
      line2: form.line2.value.trim(),
      phone: form.phone.value.trim(),
      isDefault: form.isDefault.checked,
    };
    if (!data.label) return alert('Please select an address type');
    if (!data.line1) return alert('Address line 1 is required');
    if (!data.phone) return alert('Phone number is required');
    let updated = [];
    if (editingAddress) {
      updated = addresses.map(a => (a.id === data.id ? data : a));
    } else {
      updated = [...addresses, data];
    }
    if (data.isDefault) {
      updated = updated.map(a => ({ ...a, isDefault: a.id === data.id }));
    }
    setAddresses(updated);
    closeForm();
    alert('Address saved successfully');
  };

  return (
    <motion.div className="fd-address-list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="fd-address-header">
        <h2>Saved Addresses</h2>
        <button className="fd-address-back" onClick={onBack}>← Back</button>
      </div>
        {showForm && (
          <form className="fd-address-form" onSubmit={handleSave}>
            <div className="fd-form-group">
              <label>Address Type</label>
              <select name="label" defaultValue={editingAddress?.label || ''} required>
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="fd-form-group">
              <label>Address Line 1</label>
              <input type="text" name="line1" defaultValue={editingAddress?.line1 || ''} required />
            </div>
            <div className="fd-form-group">
              <label>Address Line 2</label>
              <input type="text" name="line2" defaultValue={editingAddress?.line2 || ''} />
            </div>
            <div className="fd-form-group">
              <label>Phone</label>
              <input type="text" name="phone" defaultValue={editingAddress?.phone || ''} required />
            </div>
            <div className="fd-form-group checkbox-group">
              <label>
                <input type="checkbox" name="isDefault" defaultChecked={editingAddress?.isDefault || false} /> Set as default
              </label>
            </div>
            <div className="fd-form-actions">
              <button type="submit" className="fd-save-btn">Save</button>
              <button type="button" className="fd-cancel-btn" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        )}
      <div className="fd-address-items">
        {addresses.map(addr => (
            <div key={addr.id} className="fd-address-card" data-default={addr.isDefault}>
              <div className="fd-address-icon">
                <MapPin size={20} color="#fc8019" />
              </div>
              <div className="fd-address-info">
                <h4>{addr.label}{addr.isDefault && <span className="fd-default-badge">Default</span>}</h4>
                <p>{addr.line1}</p>
                <p>{addr.line2}</p>
                <p>{addr.phone}</p>
              </div>
              <div className="fd-address-actions">
                {!addr.isDefault && (
                  <button aria-label="Set as default" onClick={() => handleSetDefault(addr.id)} title="Set as default">
                    <Star size={18} color="#cbd5f6" />
                  </button>
                )}
                <button className="fd-edit-address" aria-label="Edit address" onClick={() => openForm(addr)}>
                  <Edit2 size={18} color="#64748b" />
                </button>
                <button className="fd-delete-address" aria-label="Delete address" onClick={() => handleDelete(addr.id)}>
                  <Trash2 size={18} color="#ef4444" />
                </button>
              </div>
            </div>
        ))}
          <button className="fd-add-address" onClick={() => openForm(null)}>+ Add New Address</button>
      </div>
    </motion.div>
  );
};

export default AddressList;
