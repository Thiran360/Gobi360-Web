import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ENDPOINTS, apiJson } from '../lib/api';

const MyServices = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnedPoints, setTotalEarnedPoints] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      if (!isLoggedIn || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiJson(ENDPOINTS.customerServiceOrders(user.id));
        if (!data) {
          setServiceOrders([]);
          return;
        }

        let orders = [];
        if (data && data.service_orders && Array.isArray(data.service_orders)) {
          orders = data.service_orders;
        } else if (Array.isArray(data)) {
          orders = data;
        } else if (data && data.service_requests && Array.isArray(data.service_requests)) {
          orders = data.service_requests;
        } else if (data && data.data && Array.isArray(data.data)) {
          orders = data.data;
        }

        setServiceOrders(orders);

        const pts = orders.reduce((sum, item) => {
          const itemPts = Number(item.earned_points) || Number(item.earnedPoints) || Number(item.points) || 0;
          return sum + itemPts;
        }, 0);
        setTotalEarnedPoints(pts);
      } catch (err) {
        console.error("Failed to fetch customer services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user, isLoggedIn]);

  const getExpertName = (order) => {
    return order.expert?.expert_name || order.expert?.full_name || order.expert?.name || 'Assigned Expert';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '1.5rem 1rem 4rem', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '1.75rem' }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              position: 'absolute', left: 0,
              background: 'none', border: 'none', color: '#0f172a',
              cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center'
            }}
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
            Service Orders
          </h1>
        </div>

        {!isLoggedIn ? (
          <div style={{ background: 'white', padding: '2.5rem 1.5rem', borderRadius: '1.25rem', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <AlertCircle size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.75rem', fontWeight: 800 }}>Please log in</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>You need to be logged in to view your service orders.</p>
            <button
              onClick={() => navigate('/login')}
              style={{ background: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '10px', border: 'none', fontWeight: 800, cursor: 'pointer' }}
            >
              Go to Login
            </button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontWeight: 600 }}>
            Loading your service orders...
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {/* Reward Points Header Banner (Matches Image 1 Exact Design) */}
            {(() => {
              const totalEarned = serviceOrders.reduce((sum, item) => sum + (Number(item.earned_points) || Number(item.earnedPoints) || Number(item.points) || 0), 0);
              const totalRedeemed = serviceOrders.reduce((sum, item) => sum + (Number(item.redeemed_points) || Number(item.redeemedPoints) || 0), 0);
              const availablePts = Math.max(0, totalEarned - totalRedeemed);
              const expertName = serviceOrders.length > 0 && serviceOrders[0].expert?.expert_name ? serviceOrders[0].expert.expert_name : 'Expert';

              return (
                <div style={{
                  backgroundColor: '#fffbeb',
                  border: '1.2px solid #fef3c7',
                  borderRadius: '1.25rem',
                  padding: '1.25rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    backgroundColor: '#f59e0b', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 2px 6px rgba(245,158,11,0.3)'
                  }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>★</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#d97706', fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.2rem' }}>
                      {expertName} Reward Points
                    </div>
                    <div style={{ color: '#b45309', fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'baseline', gap: '0.4rem', lineHeight: 1.1 }}>
                      {availablePts} pts <span style={{ color: '#b45309', fontSize: '0.95rem', fontWeight: '700' }}>(Available)</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #fde68a', margin: '0.5rem 0 0.25rem 0' }} />
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', fontWeight: '700', color: '#b45309' }}>
                      <span>Total Earned: <strong>{totalEarned} pts</strong></span>
                      <span>Redeemed: <strong>{totalRedeemed} pts</strong></span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Section Title */}
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', letterSpacing: '-0.3px' }}>
              Your Service Orders
            </h2>

            {serviceOrders.length === 0 ? (
              <div style={{ background: 'white', padding: '3rem 1.5rem', borderRadius: '1.25rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <Briefcase size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: 800 }}>No orders found</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>You haven't requested any services yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {serviceOrders.map(order => {
                  const isPending = (order.status || '').toLowerCase() === 'pending';
                  const isCompleted = (order.status || '').toLowerCase() === 'completed';
                  const isPaid = (order.payment_status || '').toLowerCase() === 'paid';

                  const earnedPts = Number(order.earned_points) || Number(order.earnedPoints) || Number(order.points) || 0;
                  const redeemedPts = Number(order.redeemed_points) || Number(order.redeemedPoints) || 0;
                  const redeemDiscount = order.redeem_discount || redeemedPts.toFixed(2);

                  const statusText = isCompleted ? 'Completed' : isPending ? 'Pending' : order.status;
                  const statusColor = isCompleted ? '#10b981' : isPending ? '#f59e0b' : '#3b82f6';
                  const paymentColor = isPaid ? '#10b981' : '#ef4444';

                  const totalEarnedAll = serviceOrders.reduce((sum, item) => sum + (Number(item.earned_points) || Number(item.earnedPoints) || Number(item.points) || 0), 0);
                  const totalRedeemedAll = serviceOrders.reduce((sum, item) => sum + (Number(item.redeemed_points) || Number(item.redeemedPoints) || 0), 0);
                  const availablePtsAll = Math.max(0, totalEarnedAll - totalRedeemedAll);

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '1.25rem',
                        padding: '1.5rem 1.25rem 1.25rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem'
                      }}
                    >
                      {/* Header Row: Service Name + Status & Payment Dot */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem 0', lineHeight: 1.25, letterSpacing: '-0.3px', textTransform: 'capitalize' }}>
                            {order.service?.service_name || 'Service Order'}
                          </h3>
                          <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', margin: 0 }}>
                            {getExpertName(order)}
                          </p>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: '800', color: statusColor, textTransform: 'capitalize' }}>
                            {statusText}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: paymentColor, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: paymentColor, display: 'inline-block' }} />
                            {isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {(order.service?.short_description || order.service?.long_description) && (
                        <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0.25rem 0 0', lineHeight: 1.4, fontWeight: '500' }}>
                          {order.service?.short_description || order.service?.long_description}
                        </p>
                      )}

                      {/* Points box inside card matching Image 1 */}
                      {(earnedPts > 0 || redeemedPts > 0) && (
                        <div style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '0.85rem',
                          padding: '0.65rem 0.85rem',
                          margin: '0.4rem 0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                          border: '1px solid #f1f5f9'
                        }}>
                          {earnedPts > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.85rem', fontWeight: '700' }}>
                              <span style={{ fontSize: '0.9rem' }}>★</span>
                              <span>Earned: <strong>{earnedPts} pts</strong></span>
                            </div>
                          )}
                          {redeemedPts > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontSize: '0.85rem', fontWeight: '700' }}>
                              <span style={{ fontSize: '0.9rem' }}>★</span>
                              <span>Redeemed: <strong>{redeemedPts} pts</strong> (-₹{parseFloat(redeemDiscount).toFixed(2)})</span>
                            </div>
                          )}
                        </div>
                      )}

                      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.4rem 0 0.1rem' }} />

                      {/* Footer Row: Total Amount + Apply Points */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.15rem' }}>
                            Total Amount
                          </div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
                            ₹{parseFloat(order.final_amount || order.quotation_amount || order.amount || 0).toFixed(2)}
                          </div>
                        </div>

                        {!isPaid && redeemedPts === 0 && availablePtsAll > 0 && (
                          <button
                            onClick={() => {
                              const ptsToApply = availablePtsAll;
                              setServiceOrders(prev => prev.map(o => o.id === order.id ? {
                                ...o,
                                final_amount: Math.max(0, (Number(o.final_amount || o.amount || 0) - ptsToApply)),
                                redeemed_points: ptsToApply,
                                redeem_discount: ptsToApply.toFixed(2)
                              } : o));
                            }}
                            style={{
                              backgroundColor: '#fffbeb',
                              border: '1.2px solid #fde68a',
                              color: '#b45309',
                              padding: '0.65rem 1.25rem',
                              borderRadius: '0.75rem',
                              fontWeight: '800',
                              fontSize: '0.95rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(245, 158, 11, 0.05)'
                            }}
                          >
                            <span style={{ color: '#d97706', fontSize: '1rem' }}>★</span> Apply Points
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyServices;

