import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyServices = () => {
  const navigate = useNavigate();

  const activeServices = [
    {
      id: 1,
      name: 'Gobi 360 Business Premium',
      status: 'Active',
      renewalDate: 'Dec 15, 2026',
      price: '$99.00/mo'
    },
    {
      id: 2,
      name: 'Advanced Analytics Dashboard',
      status: 'Active',
      renewalDate: 'Nov 30, 2026',
      price: '$29.00/mo'
    }
  ];

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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Briefcase size={24} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a' }}>My Services</h1>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {activeServices.map(service => (
              <div key={service.id} style={{ 
                backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', 
                border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                    {service.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '700' }}>
                      <CheckCircle size={14} /> {service.status}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
                      Renews: {service.renewalDate}
                    </span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.25rem' }}>
                    {service.price}
                  </div>
                  <button style={{ 
                    padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid #cbd5e1', 
                    borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: '700', color: '#64748b',
                    cursor: 'pointer'
                  }}>
                    Manage Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyServices;
