import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, User, Mail, Phone, ArrowLeft, Shield,
  ChevronRight, Lock, Eye, EyeOff, Bell, Globe,
  CheckCircle, AlertCircle, Settings, Edit3, Save, X, Package, MapPin, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useResponsive from '../hooks/useResponsive';
import { useShop } from '../context/ShopContext';
import { apiUrl, ENDPOINTS } from '../lib/api';

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
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '700', padding: '0.25rem 0' }}
    >
      <ArrowLeft size={17} /> {title}
    </button>
    {children}
  </motion.div>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const InputField = ({ label, type = 'text', value, onChange, icon, placeholder, rightEl, maxLength }) => (
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
        type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
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

// ─── Orders Sub-view ──────────────────────────────────────────────────────────
const YourOrders = ({ onBack, onViewOrder, showToast }) => {
  const { orders: mockOrders, customerName } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).id || JSON.parse(storedUser).user_id || 1 : 1;
        const [resOrders, resShops, resProducts] = await Promise.all([
          fetch(apiUrl(ENDPOINTS.orders(userId)), {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          }),
          fetch(apiUrl(ENDPOINTS.shops), {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          }),
          fetch(apiUrl(ENDPOINTS.products), {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          })
        ]);

        const data = await resOrders.json();
        let shopsData = {};
        try { shopsData = await resShops.json(); } catch (e) { }
        let productsData = {};
        try { productsData = await resProducts.json(); } catch (e) { }

        const shopMap = {};
        const shopsList = shopsData.value || shopsData.data || shopsData;
        if (Array.isArray(shopsList)) {
          shopsList.forEach(s => {
            shopMap[s.id] = s.shop_name || s.name;
          });
        }

        const productMap = {};
        const productsList = productsData.value || productsData.data || productsData;
        if (Array.isArray(productsList)) {
          productsList.forEach(p => {
            productMap[p.id] = p.name;
          });
        }

        const attachShopAndProducts = (ordersList) => ordersList.map(o => ({
          ...o,
          shopName: o.shopName || shopMap[o.shop] || 'Unknown Shop',
          // Extract delivery boy details from all possible backend field names
          delivery_boy_name:
            o.delivery_boy_name ||
            o.deliveryman_name ||
            o.deliveryman?.name ||
            o.deliveryman?.deliveryman_name ||
            o.delivery_agent_name ||
            o.rider_name ||
            null,
          delivery_boy_phone:
            o.delivery_boy_phone ||
            o.deliveryman_phone ||
            o.deliveryman?.phone ||
            o.deliveryman?.mobile ||
            o.deliveryman?.contact_number ||
            o.delivery_agent_phone ||
            o.rider_phone ||
            null,
          items: o.items ? o.items.map(i => ({
            ...i,
            mappedProductName: productMap[i.product] || productMap[i.id] ||
              (typeof i.product === 'string' ? i.product : null) ||
              i.product_name || i.name
          })) : []
        }));

        if (data.status && data.orders) {
          setOrders(attachShopAndProducts(data.orders));
        } else if (Array.isArray(data)) {
          setOrders(attachShopAndProducts(data));
        } else if (data.data && Array.isArray(data.data)) {
          setOrders(attachShopAndProducts(data.data));
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayedOrders = (() => {
    return [...orders].sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0));
  })();

  const handleCancelClick = (e, orderId) => {
    e.stopPropagation();
    setCancelConfirmId(orderId);
  };

  const confirmCancelOrder = async () => {
    const orderId = cancelConfirmId;
    setCancelConfirmId(null);
    setCancelling(orderId);
    try {
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id || JSON.parse(storedUser).user_id || null : null;

      const res = await fetch(apiUrl(ENDPOINTS.orderCancel), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ user_id: userId, order_id: orderId })
      });

      const data = await res.json();
      if (res.ok || data.status) {
        // Update local state to show cancelled
        setOrders(prev => prev.map(o => o.id === orderId || o.order_id === orderId ? { ...o, status: 'Cancelled' } : o));
        if (showToast) showToast('Order cancelled successfully.', 'success');
      } else {
        if (showToast) showToast('Failed to cancel order.', 'error');
      }
    } catch (err) {
      console.error('Error cancelling order', err);
      if (showToast) showToast('Error cancelling order. Please try again.', 'error');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <SubView title="Back to Profile" onBack={onBack}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.2rem', marginTop: 0 }}>My Orders</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>View and track your recent orders.</p>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 1.5rem 0' }} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Loading orders...</div>
      ) : displayedOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <Package size={48} color="#e2e8f0" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>No orders found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {displayedOrders.map((order, idx) => (
            <div
              key={idx}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column' }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'}
            >
              {/* Header with Shop Info and Status */}
              <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(37,99,235,0.2)', flexShrink: 0 }}>
                    {(order.shopName || 'S').charAt(0)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem 0', letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.shopName || 'Unknown Shop'}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Order #{order.id || order.order_id || 'N/A'} • {new Date(order.created_at || order.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
                    background: order.status?.toLowerCase() === 'cancelled' ? '#fef2f2' : (order.status?.toLowerCase() === 'pending' ? '#fffbeb' : (order.status?.toLowerCase() === 'packaging' ? '#eff6ff' : (order.status?.toLowerCase() === 'assigned' ? '#e0e7ff' : (order.status?.toLowerCase() === 'out_for_delivery' || order.status?.toLowerCase() === 'out for delivery' ? '#f3e8ff' : '#ecfdf5')))),
                    color: order.status?.toLowerCase() === 'cancelled' ? '#dc2626' : (order.status?.toLowerCase() === 'pending' ? '#d97706' : (order.status?.toLowerCase() === 'packaging' ? '#2563eb' : (order.status?.toLowerCase() === 'assigned' ? '#4f46e5' : (order.status?.toLowerCase() === 'out_for_delivery' || order.status?.toLowerCase() === 'out for delivery' ? '#9333ea' : '#059669'))))
                  }}>
                    {order.status ? order.status.replace(/_/g, ' ').toUpperCase() : 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Items Section */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '16px', height: '16px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '3px', flexShrink: 0 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', margin: 0, lineHeight: 1.3 }}>
                            {item.quantity || 1} x {item.mappedProductName || item.product_name || item.name || item.product?.name || 'Item'}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>
                        ₹{(item.price || item.product?.price || 0) * (item.quantity || 1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Item details unavailable</p>
                )}

                {/* Delivery Agent Details — from backend */}
                {(() => {
                  const st = order.status?.toLowerCase();
                  const showAgent = ['out_for_delivery', 'out for delivery', 'assigned', 'delivery'].includes(st);
                  const agentName = order.delivery_boy_name;
                  const agentPhone = order.delivery_boy_phone;
                  if (!showAgent || !agentName) return null;
                  return (
                    <div style={{ marginTop: '0.5rem', padding: '1rem', background: '#fffbeb', borderRadius: '0.75rem', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.9rem', color: '#92400e', fontWeight: 800 }}>Delivery Agent Details</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#b45309', fontWeight: 600 }}>
                          {agentName}
                          {agentPhone && (
                            <> •{' '}
                              <a href={`tel:${agentPhone}`} style={{ color: '#d97706', textDecoration: 'none', fontWeight: 700 }}>
                                {agentPhone}
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                      {agentPhone && (
                        <a
                          href={`tel:${agentPhone}`}
                          style={{ background: '#f59e0b', color: 'white', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}
                          title={`Call ${agentName}`}
                        >
                          <Phone size={16} />
                        </a>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Footer Section (Total & Action) */}
              <div style={{ padding: '1rem 1.25rem', borderTop: '1px dashed #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                    ₹{order.amount || order.total_amount || order.total_price || order.total || '0'}
                  </span>
                </div>
                {(!order.status || !['cancelled', 'delivered', 'delivery', 'completed'].includes(order.status.toLowerCase())) && (
                  <button
                    onClick={(e) => handleCancelClick(e, order.id || order.order_id)}
                    disabled={cancelling === (order.id || order.order_id)}
                    style={{ background: 'white', color: cancelling === (order.id || order.order_id) ? '#9ca3af' : '#ef4444', border: `1px solid ${cancelling === (order.id || order.order_id) ? '#e2e8f0' : '#fca5a5'}`, padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 700, cursor: cancelling === (order.id || order.order_id) ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, whiteSpace: 'nowrap' }}
                    onMouseOver={e => { if (cancelling !== (order.id || order.order_id)) { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#ef4444'; } }}
                    onMouseOut={e => { if (cancelling !== (order.id || order.order_id)) { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#fca5a5'; } }}
                  >
                    {cancelling === (order.id || order.order_id) ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Custom Confirmation Popup */}
      <AnimatePresence>
        {cancelConfirmId && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setCancelConfirmId(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: 900 }}>Cancel Order</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: '#475569', fontSize: '0.95rem' }}>Are you sure you want to cancel this order? This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setCancelConfirmId(null)} style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>No, Keep It</button>
                <button onClick={confirmCancelOrder} style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Yes, Cancel Order</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SubView>
  );
};

// ─── Order Details Sub-view ───────────────────────────────────────────────────
const OrderDetails = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(apiUrl(ENDPOINTS.order(orderId)), {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await res.json();
        if (data.status && data.order) {
          setOrder(data.order);
        } else {
          setOrder(data);
        }
      } catch (err) {
        console.error('Failed to fetch order details', err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  return (
    <SubView title="Back to Orders" onBack={onBack}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.3rem' }}>Order Details</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>ID: #{orderId}</p>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 1.5rem 0' }} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Loading order details...</div>
      ) : !order ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#ef4444', fontWeight: 600 }}>Order not found.</div>
      ) : (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: '1.5rem', gap: isMobile ? '1rem' : '0' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.2rem' }}>Order Date</p>
              <p style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>
                {new Date(order.created_at || order.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.2rem' }}>Total Amount</p>
              <p style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 900 }}>₹{order.total_amount || order.total || '0'}</p>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Items</h4>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: '60px', height: '60px', border: '1px solid #f1f5f9', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', flexShrink: 0 }}>
                  {item.image || item.product_image || item.product?.image ? (
                    <img src={item.image || item.product_image || item.product?.image} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Package size={24} color="#94a3b8" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.3rem 0' }}>{item.product_name || item.name || item.product?.name || 'Item'}</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 600 }}>Qty: {item.quantity || 1} &times; ₹{item.price || item.unit_price || 0}</p>
                </div>
                <div style={{ fontWeight: 800, color: '#0f172a', alignSelf: isMobile ? 'flex-start' : 'center' }}>
                  ₹{item.total_price || (item.price * (item.quantity || 1)) || 0}
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>No items details available.</p>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>Shipping & Payment</h4>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
              <p style={{ margin: '0 0 0.5rem 0' }}><strong>Status:</strong> {order.status ? order.status.toUpperCase() : 'PENDING'}</p>
              <p style={{ margin: '0 0 0.5rem 0' }}><strong>Payment:</strong> {order.payment_status || 'Pending'}</p>
              <p style={{ margin: 0 }}><strong>Address ID:</strong> {order.address || 'N/A'}</p>
            </div>
          </div>

        </div>
      )}
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
        <InputField label="Mobile Number" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
          icon={<Phone size={17} />} placeholder="9876543210" maxLength={10} />
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
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useResponsive();

  // Detect page refresh vs fresh navigation.
  // On fresh navigation (clicking Profile in navbar), always reset to 'main'.
  // On page refresh, restore the last view from sessionStorage.
  const [view, setViewState] = useState(() => {
    // If navigated here with explicit state (e.g. programmatic navigate), use that
    if (location.state && location.state.view) {
      return location.state.view;
    }
    // Check if this is a page refresh (performance.navigation.type === 1)
    // or if a refresh-flag is set in sessionStorage
    const isRefresh = sessionStorage.getItem('profileIsRefresh') === 'true';
    if (isRefresh) {
      return sessionStorage.getItem('profileView') || 'main';
    }
    // Fresh navigation — always start at main
    return 'main';
  });

  // Set refresh flag after mount so next refresh can detect it
  useEffect(() => {
    sessionStorage.setItem('profileIsRefresh', 'true');
    return () => {
      // When component unmounts (user navigates away), clear the refresh flag
      sessionStorage.removeItem('profileIsRefresh');
      sessionStorage.removeItem('profileView');
      sessionStorage.removeItem('profileSelectedOrderId');
    };
  }, []);

  const setView = (newView) => {
    sessionStorage.setItem('profileView', newView);
    setViewState(newView);
  };

  const [selectedOrderId, setSelectedOrderIdState] = useState(() => {
    const isRefresh = sessionStorage.getItem('profileIsRefresh') === 'true';
    return isRefresh ? (sessionStorage.getItem('profileSelectedOrderId') || null) : null;
  });

  const setSelectedOrderId = (id) => {
    if (id) {
      sessionStorage.setItem('profileSelectedOrderId', id);
    } else {
      sessionStorage.removeItem('profileSelectedOrderId');
    }
    setSelectedOrderIdState(id);
  };

  const [toast, setToast] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // customer-points endpoint is not available on the backend yet
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  if (!isLoggedIn) return null;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const initials = (user?.name || 'G').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ background: 'linear-gradient(160deg,#eef2ff 0%,#f8fafc 100%)', minHeight: '100vh', paddingTop: isMobile ? '1.5rem' : '2.5rem', paddingBottom: '4rem' }}>
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
                style={{ background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 50%,#4338ca 100%)', borderRadius: '1.75rem', padding: isMobile ? '1.75rem 1.25rem' : '2.5rem 2rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(99,102,241,0.3)' }}
              >
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                <button onClick={() => setView('editProfile')} style={{ position: 'absolute', top: isMobile ? '1.25rem' : '1.5rem', right: isMobile ? '1.25rem' : '1.5rem', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '0.75rem', padding: '0.6rem', color: 'white', cursor: 'pointer', display: 'flex', zIndex: 10, backdropFilter: 'blur(4px)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
                  <Edit3 size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '1rem' : '1.5rem', position: 'relative', zIndex: 5, paddingRight: isMobile ? '2.5rem' : '0' }}>
                  <div style={{ width: isMobile ? '64px' : '80px', height: isMobile ? '64px' : '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '3px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '1.4rem' : '1.75rem', fontWeight: '900', color: 'white', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: isMobile ? '0.7rem' : '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Gobi 360 Account</p>
                    <h1 style={{ color: 'white', fontSize: isMobile ? '1.3rem' : '1.55rem', fontWeight: '900', marginBottom: '0.6rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Guest User'}</h1>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.6rem', borderRadius: '2rem' }}>
                        <CheckCircle size={12} color="#86efac" />
                        <span style={{ color: '#86efac', fontSize: '0.7rem', fontWeight: '800' }}>Verified</span>
                      </div>
                    </div>
                  </div>
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

              {/* My Activity */}
              <SectionCard title="My Activity" icon={<Package size={16} />} delay={0.3}>
                {[
                  { icon: <ShoppingBag size={16} />, label: 'Your Orders', sub: 'View your order history', action: () => setView('orders') },
                  { icon: <MapPin size={16} />, label: 'Manage Address', sub: 'Update shipping addresses', action: () => alert('Address management coming soon') },
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
                onClick={() => {
                  sessionStorage.removeItem('profileView');
                  sessionStorage.removeItem('profileSelectedOrderId');
                  sessionStorage.removeItem('profileIsRefresh');
                  logout();
                  navigate('/');
                }}
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
          {view === 'orders' && (
            <YourOrders
              key="orders"
              onBack={() => setView('main')}
              onViewOrder={(id) => { setSelectedOrderId(id); setView('orderDetails'); }}
              showToast={showToast}
            />
          )}
          {view === 'orderDetails' && (
            <OrderDetails
              key="orderDetails"
              orderId={selectedOrderId}
              onBack={() => setView('orders')}
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
