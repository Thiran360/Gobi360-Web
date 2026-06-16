import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ShoppingBag, ChevronDown, ChevronUp, Trash2, Star, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PastOrders = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('fdPastOrders');
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  const handleDeleteOrder = (orderId) => {
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem('fdPastOrders', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all past orders?')) {
      setOrders([]);
      localStorage.removeItem('fdPastOrders');
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#16a34a';
      case 'Cancelled': return '#ef4444';
      case 'Processing': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Delivered': return '#f0fdf4';
      case 'Cancelled': return '#fef2f2';
      case 'Processing': return '#fffbeb';
      default: return '#f8fafc';
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="fd-past-orders-header">
        <div className="fd-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="fd-address-back" onClick={onBack}>
              <ArrowLeft size={16} /> Back
            </button>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              <Clock size={22} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: '#fc8019' }} />
              Past Orders
            </h2>
          </div>
          {orders.length > 0 && (
            <button 
              onClick={handleClearAll}
              style={{
                background: 'none', border: '1px solid #fca5a5', color: '#ef4444',
                padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.target.style.background = '#fef2f2'; }}
              onMouseOut={e => { e.target.style.background = 'none'; }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="fd-container" style={{ maxWidth: '800px', marginTop: '1.5rem' }}>
        {orders.length === 0 ? (
          <motion.div 
            className="fd-past-orders-empty"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <ShoppingBag size={44} color="#fc8019" />
            </div>
            <h3 style={{ color: '#1e293b', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>No orders yet</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>
              Your order history will appear here once you place your first order.
            </p>
          </motion.div>
        ) : (
          <div className="fd-past-orders-list">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                className="fd-past-order-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                {/* Order Header */}
                <div className="fd-past-order-top">
                  <div className="fd-past-order-restaurant">
                    {order.restaurantImage && (
                      <img 
                        src={order.restaurantImage} 
                        alt={order.restaurantName}
                        className="fd-past-order-img"
                      />
                    )}
                    <div>
                      <h4 className="fd-past-order-name">{order.restaurantName}</h4>
                      <p className="fd-past-order-date">{formatDate(order.date)}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span 
                      className="fd-past-order-status"
                      style={{ 
                        background: getStatusBg(order.status), 
                        color: getStatusColor(order.status),
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Summary Row */}
                <div className="fd-past-order-summary">
                  <div className="fd-past-order-items-preview">
                    {order.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="fd-past-order-item-tag">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="fd-past-order-item-tag" style={{ background: '#f1f5f9', color: '#64748b' }}>
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="fd-past-order-total">
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                </div>

                {/* Expand/Collapse */}
                <div className="fd-past-order-actions">
                  <button 
                    className="fd-past-order-details-btn"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    {expandedOrder === order.id ? (
                      <><ChevronUp size={16} /> Hide Details</>
                    ) : (
                      <><ChevronDown size={16} /> View Details</>
                    )}
                  </button>
                  <button 
                    className="fd-past-order-delete-btn"
                    onClick={() => handleDeleteOrder(order.id)}
                    title="Delete order"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div 
                      className="fd-past-order-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="fd-past-order-detail-header">Items Ordered</div>
                      {order.items.map((item, i) => (
                        <div key={i} className="fd-past-order-detail-row">
                          <span>{item.name} × {item.quantity}</span>
                          <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="fd-past-order-detail-divider" />
                      <div className="fd-past-order-detail-row">
                        <span>Item Total</span>
                        <span>₹{order.itemTotal.toFixed(2)}</span>
                      </div>
                      <div className="fd-past-order-detail-row">
                        <span>Delivery Fee</span>
                        <span>₹{order.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="fd-past-order-detail-row">
                        <span>Taxes</span>
                        <span>₹{order.tax.toFixed(2)}</span>
                      </div>
                      <div className="fd-past-order-detail-divider" />
                      <div className="fd-past-order-detail-row" style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                        <span>Grand Total</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="fd-past-order-detail-row" style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                        <span>Order ID: #{order.id}</span>
                        <span>Paid via {order.paymentMethod}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastOrders;
