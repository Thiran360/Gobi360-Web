import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowLeft, Plus, Clock, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupportTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', description: '' });

  useEffect(() => {
    const saved = localStorage.getItem('gobi_support_tickets');
    if (saved) {
      setTickets(JSON.parse(saved));
    } else {
      // Default dummy ticket
      const defaultTicket = [{
        id: 'TKT-1001',
        subject: 'Cannot access analytics dashboard',
        description: 'I keep getting a 403 error when trying to view my reports.',
        status: 'In Progress',
        date: new Date().toLocaleDateString()
      }];
      setTickets(defaultTicket);
      localStorage.setItem('gobi_support_tickets', JSON.stringify(defaultTicket));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.description) return;

    const ticket = {
      id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
      subject: newTicket.subject,
      description: newTicket.description,
      status: 'Open',
      date: new Date().toLocaleDateString()
    };

    const updated = [ticket, ...tickets];
    setTickets(updated);
    localStorage.setItem('gobi_support_tickets', JSON.stringify(updated));
    setNewTicket({ subject: '', description: '' });
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return { bg: '#fee2e2', text: '#ef4444' };
      case 'In Progress': return { bg: '#fef3c7', text: '#f59e0b' };
      case 'Resolved': return { bg: '#d1fae5', text: '#10b981' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f3e8ff', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                <HelpCircle size={24} />
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a' }}>Support Tickets</h1>
            </div>
            
            <button 
              onClick={() => setShowForm(!showForm)}
              style={{ 
                padding: '0.75rem 1.5rem', backgroundColor: '#8b5cf6', color: 'white', 
                border: 'none', borderRadius: '1rem', fontWeight: '800', 
                display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              {showForm ? 'Cancel' : <><Plus size={18} /> New Ticket</>}
            </button>
          </div>

          {showForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleSubmit}
              style={{ 
                backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', 
                border: '1px solid #e2e8f0', marginBottom: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>Create New Ticket</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.5rem' }}>Subject</label>
                <input 
                  type="text" required
                  value={newTicket.subject}
                  onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                  placeholder="Briefly describe your issue"
                  style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', outline: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.5rem' }}>Description</label>
                <textarea 
                  required rows="4"
                  value={newTicket.description}
                  onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                  placeholder="Provide more details about the problem..."
                  style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', outline: 'none', resize: 'vertical' }}
                />
              </div>
              <button type="submit" style={{ width: '100%', padding: '1.1rem', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '1rem', fontWeight: '800', cursor: 'pointer' }}>
                Submit Ticket
              </button>
            </motion.form>
          )}

          <div style={{ display: 'grid', gap: '1rem' }}>
            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', backgroundColor: 'white', borderRadius: '1.5rem', border: '1px dashed #cbd5e1' }}>
                <MessageSquare size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p style={{ fontWeight: '600' }}>No support tickets found.</p>
              </div>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px' }}>{ticket.id}</span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginTop: '0.25rem' }}>{ticket.subject}</h3>
                    </div>
                    <span style={{ 
                      padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '800',
                      backgroundColor: getStatusColor(ticket.status).bg, color: getStatusColor(ticket.status).text
                    }}>
                      {ticket.status}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {ticket.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>
                    <Clock size={14} /> Submitted on {ticket.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportTickets;
