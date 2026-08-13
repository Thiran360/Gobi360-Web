import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Star, TrendingUp, Package, AlertCircle, X, Save, Edit2, Edit, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OwnerDashboard() {
  const { role, ownerShopName, orders, logoutRole } = useShop();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [shopImage, setShopImage] = useState(null);
  const [ownerShopkeeperId, setOwnerShopkeeperId] = useState(null);
  const [apiOrders, setApiOrders] = useState([]);
  const [apiShopName, setApiShopName] = useState(null);
  const [fetchedApi, setFetchedApi] = useState(false);
  const [apiProducts, setApiProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'points'
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'orders' || tabParam === 'points') {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const [confirmingOrder, setConfirmingOrder] = useState(null);

  // ── CONFIGURATION STATE (Unsaved UI state) ──
  const [minOrderInput, setMinOrderInput] = useState(() => localStorage.getItem('minOrderAmount') ?? '100');
  const [rateRupeesInput, setRateRupeesInput] = useState(() => localStorage.getItem('rateRupees') ?? '10');
  const [ratePointsInput, setRatePointsInput] = useState(() => localStorage.getItem('ratePoints') ?? '1');

  const [redeemPointsInput, setRedeemPointsInput] = useState(() => localStorage.getItem('redeemPoints') ?? '10');
  const [redeemAmountInput, setRedeemAmountInput] = useState(() => localStorage.getItem('redeemAmount') ?? '1');
  const [minRedeemPointsInput, setMinRedeemPointsInput] = useState(() => localStorage.getItem('minRedeemPoints') ?? '50');

  // New state for points configuration
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // ── ACTIVE LOGIC VARIABLES ──
  const [minOrderAmount, setMinOrderAmount] = useState(() => Number(localStorage.getItem('minOrderAmount')) || 100);
  const [rateRupees, setRateRupees] = useState(() => Number(localStorage.getItem('rateRupees')) || 10);
  const [ratePoints, setRatePoints] = useState(() => Number(localStorage.getItem('ratePoints')) || 1);
  const [minRedeemPoints, setMinRedeemPoints] = useState(() => Number(localStorage.getItem('minRedeemPoints')) || 50);

  // orderPoints: { orderId: { customer, points, amount } }
  const [orderPoints, setOrderPoints] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orderPoints') || '{}'); } catch { return {}; }
  });
  // acceptedOrders: Set of order ids that have been accepted
  const [acceptedOrders, setAcceptedOrders] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('acceptedOrders') || '[]')); } catch { return new Set(); }
  });
  // pickedToOrder: Set of order ids that have been pushed to delivery locally
  const [pickedToOrder, setPickedToOrder] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('pickedToOrder') || '[]')); } catch { return new Set(); }
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Inject CSS to hide number input arrows globally for this component since inline styles for pseudo-elements don't work
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Persist order states
  useEffect(() => {
    localStorage.setItem('orderPoints', JSON.stringify(orderPoints));
    localStorage.setItem('acceptedOrders', JSON.stringify([...acceptedOrders]));
    localStorage.setItem('pickedToOrder', JSON.stringify([...pickedToOrder]));
  }, [orderPoints, acceptedOrders, pickedToOrder]);

  // Fetch shop image
  useEffect(() => {
    if (!ownerShopName) return;
    fetch('https://api.codingboss.in/gobi360/shops/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(r => r.json())
      .then(data => {
        if (data.status && data.data) {
          const shop = data.data.find(s => s.shop_name === ownerShopName || s.name === ownerShopName || String(s.shopkeeper_id) === String(user?.id) || String(s.user) === String(user?.id));
          if (shop) {
            if (shop.shop_image) setShopImage(shop.shop_image);
            if (shop.shopkeeper_id) setOwnerShopkeeperId(shop.shopkeeper_id);
          }
        }
      }).catch(console.error);
  }, [ownerShopName]);

  // Fetch products + orders
  useEffect(() => {
    fetch('https://api.codingboss.in/gobi360/products/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setApiProducts(data); })
      .catch(console.error);

    if (role === 'owner') {
      if (user?.id) {
        const fetchOrders = () => {
          fetch(`https://api.codingboss.in/gobi360/shopkeeper-orders/${user.id}/`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          })
            .then(r => r.json())
            .then(data => {
              if (data.status) {
                setApiShopName(data.shop);
                if (data.orders) setApiOrders(data.orders);
              }
              setFetchedApi(true);
            }).catch(console.error);
        };

        fetchOrders();
        const ordersInterval = setInterval(fetchOrders, 5000);

        // Fetch Reward Settings only if user has a real ID
        fetch(`https://api.codingboss.in/gobi360/shopkeeper/reward-setting/${user.id}/`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
          .then(r => r.json())
          .then(data => {
            if (data && data.status && data.setting) {
              const setting = data.setting;
              setHasExistingSettings(true);

              if (setting.purchase_amount !== undefined) {
                const parsedVal = parseFloat(setting.purchase_amount);
                setRateRupeesInput(parsedVal.toString());
                setRateRupees(parsedVal);
                localStorage.setItem('rateRupees', parsedVal.toString());
              }
              if (setting.reward_points !== undefined) {
                const parsedVal = parseInt(setting.reward_points);
                setRatePointsInput(parsedVal.toString());
                setRatePoints(parsedVal);
                localStorage.setItem('ratePoints', parsedVal.toString());
              }
              if (setting.redeem_points !== undefined) {
                setRedeemPointsInput(setting.redeem_points.toString());
                localStorage.setItem('redeemPoints', setting.redeem_points.toString());
              }
              if (setting.redeem_amount !== undefined) {
                setRedeemAmountInput(parseFloat(setting.redeem_amount).toString());
                localStorage.setItem('redeemAmount', parseFloat(setting.redeem_amount).toString());
              }
              if (setting.minimum_redeem_points !== undefined) {
                const parsedVal = parseInt(setting.minimum_redeem_points);
                setMinRedeemPointsInput(parsedVal.toString());
                setMinRedeemPoints(parsedVal);
                localStorage.setItem('minRedeemPoints', parsedVal.toString());
              }
            }
          }).catch(console.error);

        return () => clearInterval(ordersInterval);
      }
    }
  }, [role, user]);

  const getProduct = (productId) => apiProducts.find(p => p.id === productId) || {};

  const formattedApiOrders = apiOrders.map(o => ({
    id: `ORD-${o?.order_id || o?.id}`,
    rawId: o?.order_id || o?.id,
    customerName: o?.customer_name || `Customer #${o?.customer_id || o?.user}`,
    customerId: o?.customer_id || o?.user,
    amount: parseFloat(o?.final_amount || o?.total_amount || 0),
    totalAmount: parseFloat(o?.total_amount || 0),
    redeemDiscount: parseFloat(o?.redeem_discount || 0),
    finalAmount: parseFloat(o?.final_amount || o?.total_amount || 0),
    earnedPoints: parseInt(o?.earned_points || 0),
    redeemedPoints: parseInt(o?.redeemed_points || 0),
    paymentStatus: o?.payment_status || 'unpaid',
    date: o?.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A',
    status: o?.status,
    items: (o?.products || o?.items || []).map(i => {
      // API provides product as a string name. Let's find it in apiProducts by name to get the image.
      const p = apiProducts.find(prod =>
        prod?.name?.toLowerCase() === i?.product?.toLowerCase()
      ) || getProduct(i?.product);

      return {
        name: i?.product || p?.name || i?.product_name || `Unknown Product`,
        price: i?.price,
        quantity: i?.quantity,
        image: p?.image_url || i?.product_image || null
      };
    })
  }));

  const myOrders = fetchedApi
    ? formattedApiOrders
    : (orders || []).filter(o => o?.shopName === ownerShopName).map(o => ({
      ...o,
      amount: parseFloat(o?.amount || 0),
      totalAmount: parseFloat(o?.totalAmount || o?.amount || 0),
      redeemDiscount: parseFloat(o?.redeemDiscount || 0),
      finalAmount: parseFloat(o?.finalAmount || o?.amount || 0),
      earnedPoints: parseInt(o?.earnedPoints || 0),
      redeemedPoints: parseInt(o?.redeemedPoints || 0),
      paymentStatus: o?.paymentStatus || 'unpaid',
      rawId: o?.id,
      customerId: o?.customerName
    }));

  const displayShopName = apiShopName || ownerShopName;
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024;

  // ── POINTS LOGIC ──────────────────────────────────────────
  const calcPoints = (amount) => {
    if (amount < rateRupees) return 0;
    return Math.floor(amount / rateRupees) * ratePoints;
  };

  const handlePickToOrder = async (order) => {
    // Mark locally immediately — this makes the button say "Waiting for Delivery Boy"
    setPickedToOrder(prev => {
      const next = new Set(prev);
      next.add(order.rawId);
      return next;
    });

    // Silently try to progress the backend status — backend may reject but the order
    // is already in 'packaging' which appears in /deliveryman/available-orders/ endpoint.
    const statuses = ['out_for_delivery', 'assigned', 'delivery', 'ready_for_pickup'];
    for (const st of statuses) {
      try {
        const res = await fetch(`https://api.codingboss.in/gobi360/shopkeeper/order-status/${order.rawId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
          body: JSON.stringify({
            order_id: order.rawId,
            user_id: user?.id || 1,
            shopkeeper_id: ownerShopkeeperId || user?.id || 1,
            shop_id: ownerShopkeeperId || user?.id || 1,
            status: st
          })
        });
        if (res.ok) break; // Stop on first success
      } catch { /* ignore */ }
    }

    // Show a brief success toast
    const toast = document.createElement('div');
    toast.textContent = '✅ Order sent to Delivery Boy!';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#10b981;color:white;padding:12px 24px;border-radius:12px;font-weight:700;font-size:0.95rem;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.15);';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleAccept = async (order, selectedStatus) => {
    setConfirmingOrder(null);
    if (order.status === 'delivered' || order.status === 'Delivered') return;

    try {
      const res = await fetch(`https://api.codingboss.in/gobi360/shopkeeper/order-status/${order.rawId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          order_id: order.rawId,
          user_id: user?.id || 1,
          shopkeeper_id: ownerShopkeeperId || user?.id || 1,
          shop_id: ownerShopkeeperId || user?.id || 1,
          status: selectedStatus || 'packaging'
        })
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API error:', errorText);
        alert(`Failed to update status. Server responded: ${errorText}`);
      }
    } catch (err) {
      console.error('Failed to update status on server:', err);
    }

    // Refresh from backend
    if (user?.id) {
      try {
        const orderRes = await fetch(`https://api.codingboss.in/gobi360/shopkeeper-orders/${user.id}/`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const orderData = await orderRes.json();
        if (orderData.status && orderData.orders) {
          setApiOrders(orderData.orders);
        }
      } catch (e) {
        console.error('Failed to refresh orders from backend', e);
      }
    }
  };

  const handleSaveConfig = async () => {
    localStorage.setItem('rateRupees', rateRupeesInput);
    localStorage.setItem('ratePoints', ratePointsInput);
    localStorage.setItem('redeemPoints', redeemPointsInput);
    localStorage.setItem('redeemAmount', redeemAmountInput);
    localStorage.setItem('minRedeemPoints', minRedeemPointsInput);

    setRateRupees(Number(rateRupeesInput));
    setRatePoints(Number(ratePointsInput));
    setMinRedeemPoints(Number(minRedeemPointsInput));

    // Refresh the active variables so they apply immediately in the UI without a reload
    window.dispatchEvent(new Event('storage')); // optional broadcast

    try {
      const payload = {
        purchase_amount: Number(rateRupeesInput),
        reward_points: Number(ratePointsInput),
        redeem_points: Number(redeemPointsInput),
        redeem_amount: Number(redeemAmountInput),
        minimum_redeem_points: Number(minRedeemPointsInput)
      };

      const shopId = user?.id || 1;
      let url = `https://api.codingboss.in/gobi360/shopkeeper/reward-setting/${shopId}/`;
      let method = 'POST';

      if (hasExistingSettings) {
        url = `https://api.codingboss.in/gobi360/shopkeeper/reward-setting/update/${shopId}/`;
        method = 'PUT';
      }

      let response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });

      // Bulletproof fallback: If we thought it didn't exist but the backend says 400 (already exists),
      // we immediately fall back to the PUT update endpoint.
      if (!response.ok && method === 'POST') {
        url = `https://api.codingboss.in/gobi360/shopkeeper/reward-setting/update/${shopId}/`;
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setHasExistingSettings(true);
        setIsEditingPoints(false);
      } else {
        console.error("API returned an error:", response.status);
      }
    } catch (error) {
      console.error("Failed to save to API", error);
    }

    setToastMessage('Configuration saved successfully!');
    setTimeout(() => setToastMessage(''), 3000);
    // Trigger re-render to apply logic
    setActiveTab('');
    setTimeout(() => setActiveTab('points'), 0);
  };

  // Aggregate points per customer
  const pointsByCustomer = Object.values(orderPoints).reduce((acc, entry) => {
    if (!entry || !entry.customer) return acc;
    const key = entry.customer;
    acc[key] = (acc[key] || 0) + (entry.points || 0);
    return acc;
  }, {});

  const totalPointsAwarded = Object.values(orderPoints).reduce((s, e) => s + (e?.points || 0), 0);
  const totalSpend = Object.values(orderPoints).reduce((s, e) => s + (e?.amount || 0), 0);
  // We don't have an active tracking of redeemed points yet, so set it to 0 for display
  const totalRedeemed = 0;

  // ── ACCESS GUARD ─────────────────────────────────────────
  if (role !== 'owner') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <h2 style={{ color: '#0f172a' }}>Access Denied</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>You must be logged in as an Owner to view this dashboard.</p>
        <button onClick={() => navigate('/login')} style={{ background: '#3b82f6', color: 'white', padding: '0.75rem 2rem', borderRadius: 12, border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          Go to Login
        </button>
      </div>
    );
  }

  // ── SIDEBAR NAV STYLE ────────────────────────────────────
  const navItem = (active, bg, color) => ({
    padding: '0.8rem 1rem',
    background: active ? bg : 'transparent',
    color: active ? color : '#64748b',
    borderRadius: '12px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    cursor: 'pointer',
    marginBottom: '0.6rem',
    transition: 'all 0.2s',
    border: active ? `1.5px solid ${color}30` : '1.5px solid transparent'
  });

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <div style={{ width: isMobile ? '100%' : '280px', height: isMobile ? 'auto' : '100vh', background: 'white', borderRight: isMobile ? 'none' : '1px solid #e2e8f0', borderBottom: isMobile ? '1px solid #e2e8f0' : 'none', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', flexShrink: 0, boxShadow: '4px 0 24px rgba(0,0,0,0.02)', zIndex: 10, boxSizing: 'border-box' }}>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem' }}>G</div>
          Gobi360
        </h2>

        {/* Shop card */}
        <div style={{ background: shopImage ? `url(${shopImage}) center/cover no-repeat` : 'linear-gradient(135deg, #2563eb, #1e40af)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(37,99,235,0.25)', position: 'relative', overflow: 'hidden' }}>
          {shopImage && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,58,138,0.95), rgba(30,58,138,0.4))' }} />}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Active Shop</p>
            <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 900, margin: 0, lineHeight: 1.2, letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{displayShopName}</h3>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: '#eff6ff', padding: '1.2rem', borderRadius: '16px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bfdbfe' }}>
          <p style={{ color: '#1e40af', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Total Orders</p>
          <div style={{ background: '#2563eb', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 900 }}>{myOrders.length}</div>
        </div>
        <div style={{ background: '#f0fdf4', padding: '1.2rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bbf7d0' }}>
          <p style={{ color: '#166534', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Points Awarded</p>
          <div style={{ background: '#16a34a', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 900 }}>{totalPointsAwarded}</div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div
            onClick={() => {
              if (logout) logout();
              navigate('/');
            }}
            style={{
              padding: '0.8rem 1rem',
              color: '#ef4444',
              borderRadius: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1.5px solid transparent'
            }}
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

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div style={{ flex: 1, padding: isMobile ? '1.5rem 1rem' : '2rem 2.5rem', overflowY: 'auto', height: isMobile ? 'auto' : '100vh', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* ═══ ORDERS TAB ═══════════════════════════════ */}
          {activeTab === 'orders' && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'), gap: '1.5rem' }}>
              {myOrders.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', background: '#fff', borderRadius: 24, padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
                  <Clock size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', color: '#475569', margin: 0 }}>No orders yet for {displayShopName}.</h3>
                </div>
              ) : (
                myOrders.map((order, i) => {
                  const isAccepted = order.status === 'delivered' || order.status === 'Delivered';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      style={{ background: '#fff', borderRadius: 24, padding: '1.5rem', boxShadow: isAccepted ? '0 0 0 2px #10b98140' : '0 10px 30px rgba(0,0,0,0.04)', border: isAccepted ? '1.5px solid #10b981' : '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.2rem' }}>{order.customerName}</h3>
                          <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 0.4rem', fontWeight: 500 }}>{order.date} • {order.id}</p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-block', background: isAccepted ? '#d1fae5' : (order.status?.toLowerCase() === 'packaging' ? '#eff6ff' : (order.status?.toLowerCase() === 'assigned' || order.status?.toLowerCase() === 'delivery' ? '#e0e7ff' : (order.status?.toLowerCase() === 'out_for_delivery' || order.status?.toLowerCase() === 'out for delivery' ? '#f3e8ff' : '#fef3c7'))), color: isAccepted ? '#047857' : (order.status?.toLowerCase() === 'packaging' ? '#2563eb' : (order.status?.toLowerCase() === 'assigned' || order.status?.toLowerCase() === 'delivery' ? '#4f46e5' : (order.status?.toLowerCase() === 'out_for_delivery' || order.status?.toLowerCase() === 'out for delivery' ? '#9333ea' : '#b45309'))), padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                              {order.status ? order.status.replace(/_/g, ' ') : 'Pending'}
                            </span>
                            <span style={{ display: 'inline-block', background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fee2e2', color: order.paymentStatus === 'paid' ? '#16a34a' : '#ef4444', padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                              {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                        </div>
                        <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.4rem 0.8rem', borderRadius: 12, fontWeight: 900, fontSize: '1.1rem' }}>
                          ₹{order.finalAmount}
                        </div>
                      </div>

                      {/* Financial & Points Summary */}
                      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1.2rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569', marginBottom: '0.4rem' }}>
                          <span>Subtotal:</span>
                          <span style={{ fontWeight: 700 }}>₹{order.totalAmount}</span>
                        </div>
                        {order.redeemDiscount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#16a34a', marginBottom: '0.4rem' }}>
                            <span>Points Discount ({order.redeemedPoints} pts):</span>
                            <span style={{ fontWeight: 700 }}>- ₹{order.redeemDiscount}</span>
                          </div>
                        )}
                        {order.earnedPoints > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 800, marginTop: '0.4rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                            <span>Points Awarded:</span>
                            <span>+{order.earnedPoints} Pts</span>
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.6rem' }}>Items Ordered</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                                  {item.image ? (
                                    <img src={item.image} alt="item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                                  )}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{item.name}</p>
                                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Qty: {item.quantity || 1} • ₹{item.price}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No items info.</p>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                        {(() => {
                          const currentStatus = (order.status || 'pending').toLowerCase();
                          let nextActionText = '';
                          let targetStatus = '';
                          let requiresModal = false;
                          let isFinished = false;

                          if (currentStatus === 'pending') {
                            nextActionText = 'Packaging';
                            targetStatus = 'packaging';
                          } else if (currentStatus === 'packaging' || currentStatus === 'ready_for_pickup') {
                            if (pickedToOrder.has(order.rawId)) {
                              nextActionText = 'Waiting for Delivery Boy';
                              isFinished = true;
                            } else {
                              nextActionText = 'Pick to Order';
                              targetStatus = 'local_pick_to_order';
                            }
                          } else if (currentStatus === 'assigned' || currentStatus === 'delivery') {
                            nextActionText = 'Waiting for Delivery Boy';
                            isFinished = true;
                          } else if (currentStatus === 'out_for_delivery' || currentStatus === 'out for delivery') {
                            nextActionText = 'Out for Delivery';
                            isFinished = true;
                          } else if (currentStatus === 'delivered') {
                            nextActionText = 'Delivered';
                            isFinished = true;
                          } else if (currentStatus === 'cancelled') {
                            nextActionText = 'Cancelled';
                            isFinished = true;
                          } else {
                            // Unknown/unhandled status — show as-is, do not allow action
                            nextActionText = order.status || 'Unknown';
                            isFinished = true;
                          }

                          let btnBg = '#10b981';
                          let btnHoverBg = '#059669';

                          if (isFinished) {
                            btnBg = '#d1fae5';
                          } else if (currentStatus === 'pending') {
                            btnBg = '#2563eb';
                            btnHoverBg = '#1d4ed8';
                          } else if (currentStatus === 'packaging') {
                            btnBg = '#10b981';
                            btnHoverBg = '#059669';
                          }

                          return (
                            <button
                              onClick={() => {
                                if (targetStatus === 'local_pick_to_order') {
                                  handlePickToOrder(order);
                                } else {
                                  handleAccept(order, targetStatus);
                                }
                              }}
                              disabled={isFinished}
                              style={{ background: btnBg, color: isFinished ? '#047857' : 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 12, fontWeight: 700, cursor: isFinished ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s', opacity: isFinished ? 0.8 : 1 }}
                              onMouseOver={e => { if (!isFinished) e.currentTarget.style.background = btnHoverBg; }}
                              onMouseOut={e => { if (!isFinished) e.currentTarget.style.background = btnBg; }}
                            >
                              <CheckCircle size={16} /> {nextActionText}
                            </button>
                          );
                        })()}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {/* Confirm Accept Modal */}
          <AnimatePresence>
            {confirmingOrder && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ background: '#fff', padding: '2.5rem', borderRadius: 24, width: '90%', maxWidth: 450, position: 'relative' }}
                >
                  <button onClick={() => setConfirmingOrder(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X size={24} />
                  </button>

                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#0f172a' }}>Confirm Order</h3>
                  <p style={{ color: '#64748b', marginBottom: '2rem' }}>You are about to accept <strong>{confirmingOrder.customerName}'s</strong> order.</p>

                  <div style={{ background: '#f8fafc', borderRadius: 16, padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '1rem' }}>
                      <span style={{ fontWeight: 700, color: '#475569' }}>Order Amount:</span>
                      <span style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.2rem' }}>₹{confirmingOrder.amount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#475569' }}>Points to be Awarded:</span>
                      <span style={{ fontWeight: 900, color: '#16a34a', fontSize: '1.2rem' }}>{calcPoints(confirmingOrder.amount)} pts</span>
                    </div>
                    {confirmingOrder.amount < rateRupees && (
                      <p style={{ margin: '1rem 0 0', fontSize: '0.85rem', color: '#dc2626', fontWeight: 600, textAlign: 'center' }}>
                        * Minimum ₹{rateRupees} required for points.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleAccept(confirmingOrder, 'delivered')}
                    style={{ width: '100%', padding: '1rem', background: '#10b981', color: 'white', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <CheckCircle size={20} /> Confirm Delivery & Award Points
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>


          {/* ═══ POINTS TAB ════════════════════════════════ */}
          {activeTab === 'points' && (
            <div>

              {/* Total summary removed per user request */}


              {/* Flat Configuration Section */}
              <div style={{ paddingBottom: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>Points System Configuration</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Set your rules for earning and redeeming points.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', width: isMobile ? '100%' : 'auto' }}>
                    <button
                      onClick={() => setIsEditingPoints(!isEditingPoints)}
                      style={{ flex: isMobile ? 1 : 'none', background: isEditingPoints ? '#e2e8f0' : '#f1f5f9', color: '#334155', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
                      onMouseOut={e => e.currentTarget.style.background = isEditingPoints ? '#e2e8f0' : '#f1f5f9'}
                    >
                      <Edit size={18} /> {isEditingPoints ? 'Cancel Edit' : 'Edit'}
                    </button>
                    <button
                      onClick={handleSaveConfig}
                      style={{ flex: isMobile ? 1 : 'none', background: '#2563eb', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Save size={18} /> Save
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>

                  {/* Earning Rules */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #16a34a', boxShadow: '0 10px 25px rgba(22,163,74,0.06)', transition: 'all 0.3s' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800, color: '#16a34a', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <TrendingUp size={18} /> Earning Rules
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Spend Amount (₹)</label>
                        <input
                          type="number" value={rateRupeesInput} onChange={(e) => setRateRupeesInput(e.target.value)}
                          disabled={!isEditingPoints}
                          style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPoints ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: isEditingPoints ? '#0f172a' : '#64748b', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPoints ? 1 : 0.8 }}
                          onFocus={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#16a34a'; }}
                          onBlur={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Points Earned</label>
                        <input
                          type="number" value={ratePointsInput} onChange={(e) => setRatePointsInput(e.target.value)}
                          disabled={!isEditingPoints}
                          style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPoints ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: isEditingPoints ? '#0f172a' : '#64748b', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPoints ? 1 : 0.8 }}
                          onFocus={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#16a34a'; }}
                          onBlur={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        />
                      </div>
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, background: '#f0fdf4', padding: '1rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                      Customers earn <strong>{ratePointsInput || 0} point(s)</strong> for every <strong>₹{rateRupeesInput || 0}</strong> they spend.
                    </p>
                  </div>

                  {/* Redemption Rules */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #ea580c', boxShadow: '0 10px 25px rgba(234,88,12,0.06)', transition: 'all 0.3s' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800, color: '#ea580c', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <Star size={18} fill="#ea580c" /> Redemption Rules
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Points Used</label>
                        <input
                          type="number" value={redeemPointsInput} onChange={(e) => setRedeemPointsInput(e.target.value)}
                          disabled={!isEditingPoints}
                          style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPoints ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: isEditingPoints ? '#0f172a' : '#64748b', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPoints ? 1 : 0.8 }}
                          onFocus={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#ea580c'; }}
                          onBlur={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Discount (₹)</label>
                        <input
                          type="number" value={redeemAmountInput} onChange={(e) => setRedeemAmountInput(e.target.value)}
                          disabled={!isEditingPoints}
                          style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPoints ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: isEditingPoints ? '#0f172a' : '#64748b', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPoints ? 1 : 0.8 }}
                          onFocus={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#ea580c'; }}
                          onBlur={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', borderTop: '1px dashed #e2e8f0', paddingTop: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Min. Points to Redeem</label>
                      <input
                        type="number" value={minRedeemPointsInput} onChange={(e) => setMinRedeemPointsInput(e.target.value)}
                        disabled={!isEditingPoints}
                        style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPoints ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: isEditingPoints ? '#0f172a' : '#64748b', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPoints ? 1 : 0.8 }}
                        onFocus={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#ea580c'; }}
                        onBlur={e => { if (isEditingPoints) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      <AnimatePresence>
        {toastMessage && (() => {
          const isError = toastMessage.toLowerCase().startsWith('error') || toastMessage.toLowerCase().includes('failed') || toastMessage.toLowerCase().includes('network');
          const accentColor = isError ? '#ef4444' : '#10b981';
          const bgColor = isError ? '#fff5f5' : '#f0fdf4';
          const subColor = isError ? '#b91c1c' : '#166534';
          return (
            <motion.div
              initial={{ opacity: 0, y: -70, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              style={{
                position: 'fixed',
                top: '1.25rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                zIndex: 99999,
                maxWidth: '460px',
                minWidth: '280px',
                padding: '0.85rem 1.25rem 0.85rem 0',
                borderLeft: `4px solid ${accentColor}`,
                overflow: 'hidden',
                fontFamily: "'Inter', system-ui, sans-serif"
              }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: bgColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginLeft: '0.85rem'
              }}>
                {isError ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: subColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.1rem' }}>
                  {isError ? 'Error' : 'Success'}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {toastMessage.replace(/^error:\s*/i, '').replace(/^success:\s*/i, '')}
                </div>
              </div>
              <div style={{ width: '0.75rem', flexShrink: 0 }} />
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
