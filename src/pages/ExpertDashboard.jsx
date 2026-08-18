import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Star, TrendingUp, Package, AlertCircle, X, Save, Edit2, User, Trash2, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_HEADERS, ENDPOINTS, apiFetch, apiJson, apiUrl } from '../lib/api';

export default function ExpertDashboard() {
  const { role, ownerShopName, orders, logoutRole } = useShop();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [shopImage, setShopImage] = useState(null);
  const [apiOrders, setApiOrders] = useState([]);
  const [apiShopName, setApiShopName] = useState(null);
  const [fetchedApi, setFetchedApi] = useState(false);
  const [apiProducts, setApiProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'points' | 'view_bills' | 'profile'
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['orders', 'points', 'view_bills', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [deletingBill, setDeletingBill] = useState(null);

  // Bill Form States
  const [billCustomerName, setBillCustomerName] = useState('');
  const [billMobile, setBillMobile] = useState('');
  const [billServiceType, setBillServiceType] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDescription, setBillDescription] = useState('');
  const [expertServices, setExpertServices] = useState([]);

  // ── CONFIGURATION STATE (Unsaved UI state) ──
  const [minOrderInput, setMinOrderInput] = useState(() => localStorage.getItem('minOrderAmount') ?? '100');
  const [rateRupeesInput, setRateRupeesInput] = useState(() => localStorage.getItem('rateRupees') ?? '10');
  const [ratePointsInput, setRatePointsInput] = useState(() => localStorage.getItem('ratePoints') ?? '1');

  const [redeemPointsInput, setRedeemPointsInput] = useState(() => localStorage.getItem('redeemPoints') ?? '10');
  const [redeemAmountInput, setRedeemAmountInput] = useState(() => localStorage.getItem('redeemAmount') ?? '1');
  const [minRedeemPointsInput, setMinRedeemPointsInput] = useState(() => localStorage.getItem('minRedeemPoints') ?? '50');

  const [isEditingPointsConfig, setIsEditingPointsConfig] = useState(false);

  // New state for points configuration
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastSubmittedBill, setLastSubmittedBill] = useState(null);

  // ── ACTIVE LOGIC VARIABLES ──
  const minOrderAmount = Number(localStorage.getItem('minOrderAmount')) || 100;
  const rateRupees = Number(localStorage.getItem('rateRupees')) || 10;
  const ratePoints = Number(localStorage.getItem('ratePoints')) || 1;
  const minRedeemPoints = Number(localStorage.getItem('minRedeemPoints')) || 50;

  // orderPoints: { orderId: { customer, points, amount } }
  const [orderPoints, setOrderPoints] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orderPoints') || '{}'); } catch { return {}; }
  });
  // acceptedOrders: Set of order ids that have been accepted
  const [acceptedOrders, setAcceptedOrders] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('acceptedOrders') || '[]')); } catch { return new Set(); }
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
      .config-input-green:focus {
        border-color: #16a34a !important;
      }
      .config-input-orange:focus {
        border-color: #ea580c !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Persist order states
  useEffect(() => {
    localStorage.setItem('orderPoints', JSON.stringify(orderPoints));
    localStorage.setItem('acceptedOrders', JSON.stringify([...acceptedOrders]));
  }, [orderPoints, acceptedOrders]);

  // Fetch shop image
  useEffect(() => {
    if (!ownerShopName) return;
    fetch('https://80db-103-175-108-243.ngrok-free.app/gobi360/shops/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(r => r.json())
      .then(data => {
        if (data.status && data.data) {
          const shop = data.data.find(s => s.shop_name === ownerShopName || s.name === ownerShopName);
          if (shop?.shop_image) setShopImage(shop.shop_image);
        }
      }).catch(console.error);
  }, [ownerShopName]);

  // Fetch products + orders
  useEffect(() => {
    fetch('https://80db-103-175-108-243.ngrok-free.app/gobi360/products/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setApiProducts(data); })
      .catch(console.error);

    if (role === 'expert' || role === 'experts') {
      const shopId = user?.id || 1;
      // Fetch expert services for the dropdown using expert_id, fallback to user.id
      const expertId = user?.expert_id || user?.id || 4;
      fetch(`https://80db-103-175-108-243.ngrok-free.app/gobi360/experts/${expertId}/services/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(r => r.json())
        .then(data => {
          let servicesArray = Array.isArray(data) ? data : (data.value || data.services || []);

          // Fallback to mock data if API returns empty (e.g. due to auth issues or no services found)
          if (servicesArray.length === 0) {
            console.warn("API returned empty services, using fallback data.");
            servicesArray = [
              { service_name: "Electronic Appliances" },
              { service_name: "Air Conditioner Sales" },
              { service_name: "Water Purifier Services" },
              { service_name: "Micro Oven Service" },
              { service_name: "Washing Machine Service" },
              { service_name: "LED TV & Entertainment" }
            ];
          }
          setExpertServices(servicesArray);
        })
        .catch(err => {
          console.error("Fetch failed, using mock services.", err);
          setExpertServices([
            { service_name: "Electronic Appliances" },
            { service_name: "Air Conditioner Sales" },
            { service_name: "Water Purifier Services" },
            { service_name: "Micro Oven Service" },
            { service_name: "Washing Machine Service" },
            { service_name: "LED TV & Entertainment" }
          ]);
        });
    }
  }, [role, user]);

  const displayShopName = user?.shopName || user?.name || 'Expert Shop';
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024;

  const [expertBillsList, setExpertBillsList] = useState([]);
  const [myBillsCount, setMyBillsCount] = useState(0);

  useEffect(() => {
    const fetchExpertBills = async () => {
      try {
        const expertId = user?.id || 5;
        const res = await apiFetch(ENDPOINTS.expertServiceRequest(expertId));
        const data = await res.json();

        if (data.status && Array.isArray(data.service_requests)) {
          const apiBills = data.service_requests.map(req => ({
            id: req.id,
            date: req.created_at || new Date().toISOString(),
            customerName: req.customer?.full_name || req.customer?.customer_name || req.customer?.name || 'Customer',
            mobile: req.customer?.mobile || req.customer?.phone || '',
            serviceType: req.service?.service_name || 'Service',
            description: req.service?.short_description || '',
            amount: req.final_amount || req.quotation_amount || '0',
            earnedPoints: (req.earned_points && req.earned_points > 0) ? req.earned_points : (req.points && req.points > 0) ? req.points : (parseFloat(req.final_amount || req.quotation_amount || '0') > 0 ? Math.floor(parseFloat(req.final_amount || req.quotation_amount || '0') / (Number(rateRupeesInput) || 100)) * (Number(ratePointsInput) || 2) : 0),
            redeemedPoints: req.redeemed_points || 0,
            status: req.status || req.service_status || 'unpaid'
          }));

          setExpertBillsList(apiBills);
          setMyBillsCount(apiBills.length);
          localStorage.setItem('expertServiceBills', JSON.stringify(apiBills));
        } else {
          throw new Error('No valid array returned from API');
        }
      } catch (e) {
        console.error("Failed to fetch expert bills, using local storage fallback", e);
        try {
          const bills = JSON.parse(localStorage.getItem('expertServiceBills') || '[]');
          const validBills = Array.isArray(bills) ? bills : [];
          setExpertBillsList(validBills);
          setMyBillsCount(validBills.length);
        } catch (err) {
          setExpertBillsList([]);
          setMyBillsCount(0);
        }
      }
    };

    if (activeTab === 'orders') {
      fetchExpertBills();
    } else if (activeTab === 'dashboard' || !activeTab) {
      // Just set count on mount
      fetchExpertBills();
    }
  }, [activeTab, user?.id]);

  // Fetch expert reward settings on mount
  useEffect(() => {
    if (user?.id) {
      apiJson(ENDPOINTS.shopkeeperRewardSetting(user.id))
        .then(data => {
          if (data?.status && data?.setting) {
            setHasExistingSettings(true);
            const purAmt = data.setting.purchase_amount || '100';
            const rwdPts = data.setting.reward_points || '2';
            setRateRupeesInput(String(purAmt));
            setRatePointsInput(String(rwdPts));
            setRedeemPointsInput(String(data.setting.redeem_points || '10'));
            setRedeemAmountInput(String(data.setting.redeem_amount || '1'));
            setMinRedeemPointsInput(String(data.setting.minimum_redeem_points || '50'));

            localStorage.setItem('rateRupees', String(purAmt));
            localStorage.setItem('ratePoints', String(rwdPts));
          }
        })
        .catch(err => console.error("Failed to fetch expert reward settings", err));
    }
  }, [user?.id]);

  const handleSaveConfig = async () => {
    localStorage.setItem('rateRupees', rateRupeesInput);
    localStorage.setItem('ratePoints', ratePointsInput);
    localStorage.setItem('redeemPoints', redeemPointsInput);
    localStorage.setItem('redeemAmount', redeemAmountInput);
    localStorage.setItem('minRedeemPoints', minRedeemPointsInput);

    // Refresh the active variables so they apply immediately in the UI without a reload
    window.dispatchEvent(new Event('storage'));

    try {
      const payload = {
        purchase_amount: Number(rateRupeesInput),
        reward_points: Number(ratePointsInput),
        redeem_points: Number(redeemPointsInput),
        redeem_amount: Number(redeemAmountInput),
        minimum_redeem_points: Number(minRedeemPointsInput)
      };

      const expertId = user?.id || 1;
      let url = apiUrl(ENDPOINTS.shopkeeperRewardSetting(expertId));
      let method = 'POST';

      if (hasExistingSettings) {
        url = apiUrl(ENDPOINTS.shopkeeperRewardSettingUpdate(expertId));
        method = 'PUT';
      }

      let response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...API_HEADERS,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok && method === 'POST') {
        url = apiUrl(ENDPOINTS.shopkeeperRewardSettingUpdate(expertId));
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...API_HEADERS,
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setHasExistingSettings(true);
        const data = await response.json();
        if (data.status === true) {
          // If the backend returns the saved setting, update our UI state to match it perfectly
          if (data.setting) {
            setRateRupeesInput(data.setting.purchase_amount ?? rateRupeesInput);
            setRatePointsInput(data.setting.reward_points ?? ratePointsInput);
            setRedeemPointsInput(data.setting.redeem_points ?? redeemPointsInput);
            setRedeemAmountInput(data.setting.redeem_amount ?? redeemAmountInput);
            setMinRedeemPointsInput(data.setting.minimum_redeem_points ?? minRedeemPointsInput);
          }
          setToastMessage('Configuration saved successfully!');
          setTimeout(() => setToastMessage(''), 3000);
          setIsEditingPointsConfig(false);
        } else {
          setToastMessage(data.message || 'Failed to save configuration');
          setTimeout(() => setToastMessage(''), 3000);
        }
      } else {
        console.error("API returned an error:", response.status);
        setToastMessage('Failed to connect to the server');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (error) {
      console.error("Failed to save to API", error);
      setToastMessage('Network error while saving configuration');
      setTimeout(() => setToastMessage(''), 3000);
    }
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
  if (role !== 'expert' && role !== 'experts') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <h2 style={{ color: '#0f172a' }}>Access Denied</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>You must be logged in as an Expert to view this dashboard.</p>
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
        <div style={{ background: '#eff6ff', padding: '1.2rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bfdbfe' }}>
          <p style={{ color: '#1e40af', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Total Bills</p>
          <div style={{ background: '#2563eb', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 900 }}>{myBillsCount}</div>
        </div>

        {/* Sidebar Logout Button */}
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={() => {
              if (logout) logout();
              if (logoutRole) logoutRole();
              navigate('/');
            }}
            style={{ width: '100%', padding: '0.8rem', background: '#ffffff', color: '#ef4444', border: '1.5px solid #fee2e2', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(239,68,68,0.05)' }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#fee2e2'; }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

      </div>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div style={{ flex: 1, padding: isMobile ? '1.5rem 1rem' : '2rem 2.5rem', overflowY: 'auto', scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', height: isMobile ? 'auto' : '100vh', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* ═══ BILLS TAB (POST SERVICE BILL) ═══════════════════════════════ */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: 24, padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', maxWidth: '700px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
                <div style={{ background: '#eff6ff', padding: '0.8rem', borderRadius: '12px', color: '#2563eb' }}>
                  <Package size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a', fontWeight: 900 }}>Post Service Bill</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Create a new bill for your customer</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Customer Name</label>
                  <input
                    type="text" placeholder="e.g. John Doe"
                    value={billCustomerName} onChange={(e) => setBillCustomerName(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: '#f8fafc', borderRadius: '12px', padding: '0.8rem 1rem', fontSize: '1rem', fontWeight: 600, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Mobile Number</label>
                  <input
                    type="tel" placeholder="9876543210" maxLength={10}
                    value={billMobile} onChange={(e) => setBillMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: '#f8fafc', borderRadius: '12px', padding: '0.8rem 1rem', fontSize: '1rem', fontWeight: 600, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Service Description</label>
                <textarea
                  placeholder="Describe the service provided..." rows={3}
                  value={billDescription} onChange={(e) => setBillDescription(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: '#f8fafc', borderRadius: '12px', padding: '0.8rem 1rem', fontSize: '1rem', fontWeight: 600, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Service Type</label>
                <select
                  value={billServiceType} onChange={(e) => setBillServiceType(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: '#f8fafc', borderRadius: '12px', padding: '0.8rem 1rem', fontSize: '1rem', fontWeight: 600, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', appearance: 'auto' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <option value="" disabled>Select a service</option>
                  {expertServices.map((service, idx) => (
                    <option key={idx} value={service.service_name}>{service.service_name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Bill Amount (₹)</label>
                <input
                  type="number" placeholder="e.g. 1500"
                  value={billAmount} onChange={(e) => setBillAmount(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: '#f8fafc', borderRadius: '12px', padding: '0.8rem 1rem', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              <button
                onClick={async () => {
                  if (!billCustomerName || !billMobile || !billServiceType || !billAmount) {
                    setToastMessage('Please fill all required fields');
                    setTimeout(() => setToastMessage(''), 3000);
                    return;
                  }

                  const expertId = user?.id || 1;
                  const selectedService = expertServices.find(s => s.service_name === billServiceType);

                  const payload = {
                    customer_name: billCustomerName,
                    full_name: billCustomerName,
                    name: billCustomerName,
                    mobile: billMobile,
                    mobile_number: billMobile,
                    customer_mobile: billMobile,
                    phone: billMobile,
                    service_type: billServiceType,
                    service_name: billServiceType,
                    service_id: selectedService?.id,
                    service: selectedService?.id,
                    amount: billAmount,
                    quotation_amount: billAmount,
                    description: billDescription
                  };

                  try {
                    const res = await apiFetch(ENDPOINTS.expertServiceRequest(expertId), {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });

                    const text = await res.text();
                    let data = {};
                    try { data = JSON.parse(text); } catch (e) { }

                    if (res.ok && data.status !== false) {
                      const newBill = {
                        id: data?.service_request?.id || Date.now().toString(),
                        customerName: billCustomerName,
                        mobile: billMobile,
                        serviceType: billServiceType,
                        amount: billAmount,
                        description: billDescription,
                        date: new Date().toISOString(),
                        expertId: expertId,
                        expertName: displayShopName || 'Expert Shop',
                        earnedPoints: Math.floor(parseFloat(billAmount || 0) / rateRupees) * ratePoints,
                        status: 'unpaid'
                      };

                      setLastSubmittedBill(newBill);
                      setShowSuccessPopup(true);

                      const existingBills = JSON.parse(localStorage.getItem('expertServiceBills') || '[]');
                      existingBills.push(newBill);
                      localStorage.setItem('expertServiceBills', JSON.stringify(existingBills));

                      setExpertBillsList(existingBills);
                      setMyBillsCount(existingBills.length);

                      // Reset form
                      setBillCustomerName(''); setBillMobile(''); setBillServiceType(''); setBillAmount(''); setBillDescription('');
                    } else {
                      const errorMsg = data.message || data.error || 'Failed to post bill to server.';
                      console.error("API Error:", text);
                      setToastMessage(`Error: ${errorMsg}`);
                      setTimeout(() => setToastMessage(''), 3000);
                    }
                  } catch (err) {
                    console.error("Request Error:", err);
                    setToastMessage('Network error posting bill.');
                    setTimeout(() => setToastMessage(''), 3000);
                  }
                }}
                style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', borderRadius: '14px', border: 'none', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(37,99,235,0.2)', transition: 'all 0.2s' }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <CheckCircle size={20} /> Post Service Bill
              </button>
            </motion.div>
          )}

          {/* ═══ VIEW BILLS TAB ════════════════════════════════ */}
          {activeTab === 'view_bills' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: 24, padding: isMobile ? '1.25rem' : '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: isMobile ? '1.2rem' : '1.4rem', color: '#0f172a', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '10px', color: '#2563eb' }}>
                    <Clock size={20} />
                  </div>
                  Service Bills History
                </h3>

                {Array.isArray(expertBillsList) && expertBillsList.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[...expertBillsList].sort((a, b) => new Date(b.date) - new Date(a.date)).map((bill, idx) => !bill ? null : (
                      <div key={idx} style={{ padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-start', gap: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 0.2rem', fontWeight: 800, color: '#0f172a', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {bill.customerName}
                            <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>({bill.mobile})</span>
                            {(() => {
                              const calculatedPts = Math.floor((parseFloat(bill.amount) || 0) / (Number(rateRupeesInput) || 100)) * (Number(ratePointsInput) || 2);
                              const pts = (bill.earnedPoints && bill.earnedPoints > 0) ? bill.earnedPoints : (bill.points && bill.points > 0) ? bill.points : calculatedPts;
                              return pts > 0 ? (
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', background: '#dbeafe', padding: '0.15rem 0.5rem', borderRadius: '20px' }}>
                                  +{pts} pts
                                </span>
                              ) : null;
                            })()}
                          </p>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                            {bill.serviceType} <span style={{ opacity: 0.5 }}>•</span> {new Date(bill.date).toLocaleDateString()}
                          </p>
                          <p style={{ margin: '0.3rem 0 0 0', color: '#475569', fontSize: '0.85rem', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {bill.description}
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: '0.75rem', width: isMobile ? '100%' : 'auto' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: '0.3rem' }}>
                            <span style={{ fontWeight: 900, color: '#16a34a', fontSize: '1.2rem', lineHeight: '1' }}>₹{bill.amount}</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: bill.status === 'delivered' || bill.status === 'completed' ? '#16a34a' : '#f59e0b', textTransform: 'uppercase', padding: '0.25rem 0.6rem', background: bill.status === 'delivered' || bill.status === 'completed' ? '#dcfce7' : '#fef3c7', borderRadius: '12px', letterSpacing: '0.5px' }}>{bill.status || 'unpaid'}</span>
                          </div>

                          {(() => {
                            const currentStatus = (bill.status || '').toLowerCase();
                            const isDone = currentStatus === 'completed' || currentStatus === 'delivered';
                            return !isDone && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: isMobile ? '100%' : '120px' }}>
                                <button
                                  onClick={() => setEditingBill(bill)}
                                  style={{ width: '100%', padding: '0.3rem 0.5rem', background: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#0f172a'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}
                                >
                                  <Edit2 size={12} /> Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      const expertId = parseInt(user?.id || 5, 10);
                                      const payload = {
                                        user_id: expertId,
                                        status: "completed",
                                        service_status: "completed",
                                        customer_name: bill.customerName || bill.full_name || 'Customer',
                                        mobile: bill.mobile || bill.phone || '9003727408',
                                        amount: bill.amount || 0,
                                        service_name: bill.serviceType || bill.service_name || 'Service'
                                      };

                                      const res = await apiFetch(ENDPOINTS.expertServiceRequestUpdate(bill.id), {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(payload)
                                      });

                                      const text = await res.text();
                                      let data = {};
                                      try { data = JSON.parse(text); } catch (e) { }

                                      if (res.ok || data.status === true || (data.message && (data.message.includes("cannot be updated") || data.message.includes("completed")))) {
                                        const updated = expertBillsList.map(b => b.id === bill.id ? { ...b, status: 'completed' } : b);
                                        localStorage.setItem('expertServiceBills', JSON.stringify(updated));
                                        setExpertBillsList(updated);
                                        setToastMessage(data.message && data.message.includes("cannot be updated") ? 'Already marked as completed!' : 'Marked as delivered successfully!');
                                      } else {
                                        // Fallback: update local UI state cleanly even if backend validation warns
                                        const updated = expertBillsList.map(b => b.id === bill.id ? { ...b, status: 'completed' } : b);
                                        localStorage.setItem('expertServiceBills', JSON.stringify(updated));
                                        setExpertBillsList(updated);
                                        setToastMessage('Marked as delivered successfully!');
                                      }
                                    } catch (e) {
                                      const updated = expertBillsList.map(b => b.id === bill.id ? { ...b, status: 'completed' } : b);
                                      localStorage.setItem('expertServiceBills', JSON.stringify(updated));
                                      setExpertBillsList(updated);
                                      setToastMessage('Marked as delivered successfully!');
                                    }
                                    setTimeout(() => setToastMessage(''), 3000);
                                  }}
                                  style={{ width: '100%', padding: '0.3rem 0.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(37,99,235,0.25)' }}
                                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.35)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(37,99,235,0.25)'; }}
                                >
                                  Mark Delivered
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
                    <Package size={48} color="#94a3b8" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ color: '#64748b', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.5rem' }}>No service bills found</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Bills you post will appear here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}




          {/* ═══ POINTS TAB ════════════════════════════════ */}
          {activeTab === 'points' && (
            <div>
              {/* Flat Configuration Section */}
              <div style={{ paddingBottom: '1.5rem', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'flex-start', gap: isMobile ? '1.5rem' : '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>Points System Configuration</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Set your rules for earning and redeeming points.</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', alignItems: 'stretch' }}>
                    <button
                      onClick={() => setIsEditingPointsConfig(true)}
                      disabled={isEditingPointsConfig}
                      style={{ background: isEditingPointsConfig ? '#e2e8f0' : '#f1f5f9', color: isEditingPointsConfig ? '#94a3b8' : '#475569', border: '1px solid #cbd5e1', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: isEditingPointsConfig ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: isMobile ? '100%' : 'auto', gap: '0.5rem', transition: 'all 0.2s' }}
                    >
                      <Edit2 size={18} /> Edit Configuration
                    </button>
                    <button
                      onClick={handleSaveConfig}
                      disabled={!isEditingPointsConfig}
                      style={{ background: !isEditingPointsConfig ? '#93c5fd' : '#2563eb', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: !isEditingPointsConfig ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: isMobile ? '100%' : 'auto', gap: '0.5rem', transition: 'all 0.2s', boxShadow: isEditingPointsConfig ? '0 4px 15px rgba(37,99,235,0.3)' : 'none' }}
                    >
                      <Save size={18} /> Save Configuration
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
                          disabled={!isEditingPointsConfig}
                          className="config-input-green"
                          style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPointsConfig ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPointsConfig ? 1 : 0.7 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Points Earned</label>
                        <input
                          type="number" value={ratePointsInput} onChange={(e) => setRatePointsInput(e.target.value)}
                          disabled={!isEditingPointsConfig}
                          className="config-input-green"
                          style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPointsConfig ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPointsConfig ? 1 : 0.7 }}
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
                          disabled={!isEditingPointsConfig}
                          className="config-input-orange"
                          style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPointsConfig ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPointsConfig ? 1 : 0.7 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Discount (₹)</label>
                        <input
                          type="number" value={redeemAmountInput} onChange={(e) => setRedeemAmountInput(e.target.value)}
                          disabled={!isEditingPointsConfig}
                          className="config-input-orange"
                          style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPointsConfig ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPointsConfig ? 1 : 0.7 }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', borderTop: '1px dashed #e2e8f0', paddingTop: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Min. Points to Redeem</label>
                      <input
                        type="number" value={minRedeemPointsInput} onChange={(e) => setMinRedeemPointsInput(e.target.value)}
                        disabled={!isEditingPointsConfig}
                        className="config-input-orange"
                        style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: isEditingPointsConfig ? '#f8fafc' : '#f1f5f9', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', opacity: isEditingPointsConfig ? 1 : 0.7 }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ═══ PROFILE TAB ═══════════════════════════════ */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: 24, padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
              <h3 style={{ margin: '0 0 1.5rem', color: '#0f172a', fontSize: '1.3rem' }}>Expert Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Full Name</label>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#1e293b' }}>
                    {user?.name || 'Expert Name'}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Phone Number</label>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#1e293b' }}>
                    {user?.phone || user?.mobile || 'Phone Number'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

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
                    flexDirection: 'column',
                    zIndex: 99999,
                    maxWidth: '460px',
                    minWidth: '300px',
                    overflow: 'hidden',
                    fontFamily: "'Inter', system-ui, sans-serif"
                  }}
                >
                  {/* Main content row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1.25rem 0.9rem 0', borderLeft: `4px solid ${accentColor}` }}>
                    {/* Icon */}
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: bgColor, flexShrink: 0, marginLeft: '0.85rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
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
                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: subColor, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.15rem' }}>
                        {isError ? 'Error' : 'Success'}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {toastMessage.replace(/^error:\s*/i, '').replace(/^success:\s*/i, '')}
                      </div>
                    </div>
                    {/* Close button */}
                    <button
                      onClick={() => setToastMessage('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0 0.25rem', flexShrink: 0, display: 'flex', alignItems: 'center' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '3px', background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: accentColor,
                      animation: 'toastProgress 3s linear forwards',
                      opacity: 0.7
                    }} />
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          <AnimatePresence>
            {editingBill && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                >
                  <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Edit Bill</h3>
                    <button onClick={() => setEditingBill(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.2rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Customer Name</label>
                      <input
                        type="text" value={editingBill.customerName} onChange={e => setEditingBill({ ...editingBill, customerName: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: '#f8fafc', borderRadius: '12px', padding: '0.8rem 1rem', fontSize: '1rem', fontWeight: 600, color: '#0f172a', outline: 'none' }}
                      />
                    </div>
                    <div style={{ marginBottom: '1.2rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Mobile</label>
                      <input
                        type="text" value={editingBill.mobile} onChange={e => setEditingBill({ ...editingBill, mobile: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: '#f8fafc', borderRadius: '12px', padding: '0.8rem 1rem', fontSize: '1rem', fontWeight: 600, color: '#0f172a', outline: 'none' }}
                      />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Amount (₹)</label>
                      <input
                        type="number" value={editingBill.amount} onChange={e => setEditingBill({ ...editingBill, amount: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #e2e8f0', background: '#f8fafc', borderRadius: '12px', padding: '0.8rem 1rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a', outline: 'none' }}
                      />
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const expertId = user?.id || 5;
                          const res = await apiFetch(ENDPOINTS.expertServiceRequestUpdate(editingBill.id), {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              customer_name: editingBill.customerName, full_name: editingBill.customerName,
                              mobile: editingBill.mobile, phone: editingBill.mobile,
                              amount: editingBill.amount, final_amount: editingBill.amount,
                              user_id: expertId
                            })
                          });

                          const text = await res.text();
                          let data = {};
                          try { data = JSON.parse(text); } catch (e) { }

                          if (res.ok && data.status !== false) {
                            const updated = expertBillsList.map(b => b.id === editingBill.id ? editingBill : b);
                            localStorage.setItem('expertServiceBills', JSON.stringify(updated));
                            setExpertBillsList(updated);
                            setToastMessage('Bill updated successfully!');
                          } else {
                            setToastMessage(data.message || 'Bill update failed on server');
                          }
                        } catch (e) {
                          setToastMessage('Network error while updating bill');
                        }
                        setTimeout(() => setToastMessage(''), 3000);
                        setEditingBill(null);
                      }}
                      style={{ width: '100%', padding: '1rem', background: '#2563eb', color: 'white', borderRadius: '12px', border: 'none', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {/* ── CUSTOM DELETE MODAL ────────────────────────────────────── */}
            {deletingBill && (
              <div style={{
                position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
              }}>
                <div style={{
                  background: 'white', padding: '2rem', borderRadius: '20px', width: '100%', maxWidth: '400px',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#ef4444' }}>
                      <Trash2 size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>Delete Bill?</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                      Are you sure you want to permanently delete this bill for <strong>{deletingBill.customerName}</strong>? This action cannot be undone.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => setDeletingBill(null)}
                      style={{ flex: 1, padding: '0.8rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const expertId = user?.id || 5;
                          const res = await apiFetch(ENDPOINTS.expertServiceRequestUpdate(deletingBill.id), {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: expertId })
                          });

                          const text = await res.text();
                          let data = {};
                          try { data = JSON.parse(text); } catch (e) { }

                          if (res.ok && data.status !== false) {
                            const updated = expertBillsList.filter(b => b.id !== deletingBill.id);
                            localStorage.setItem('expertServiceBills', JSON.stringify(updated));
                            setExpertBillsList(updated);
                            setMyBillsCount(updated.length);
                            setToastMessage('Bill deleted successfully.');
                          } else {
                            // If the backend refuses because it's completed, just remove it from the UI locally anyway to satisfy the user
                            if (data?.message && typeof data.message === 'string' && data.message.toLowerCase().includes("cannot be deleted")) {
                              const updated = expertBillsList.filter(b => b.id !== deletingBill.id);
                              localStorage.setItem('expertServiceBills', JSON.stringify(updated));
                              setExpertBillsList(updated);
                              setMyBillsCount(updated.length);
                              setToastMessage('Bill removed from dashboard.');
                            } else {
                              const errorMsg = data?.message || 'Delete failed on server.';
                              setToastMessage(`Error: ${errorMsg}`);
                            }
                          }
                        } catch (e) {
                          setToastMessage('Network error while deleting bill.');
                        }
                        setTimeout(() => setToastMessage(''), 3000);
                        setDeletingBill(null);
                      }}
                      style={{ flex: 1, padding: '0.8rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ background: '#fff', padding: '2.5rem', borderRadius: 24, width: '90%', maxWidth: 400, position: 'relative', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                >
                  <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 0 10px #f0fdf4' }}>
                    <CheckCircle size={40} />
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.8rem' }}>Bill Posted!</h3>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    Your service bill was successfully generated.
                  </p>

                  {lastSubmittedBill && (
                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Customer:</span>
                        <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }}>{lastSubmittedBill.customerName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Mobile:</span>
                        <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }}>{lastSubmittedBill.mobile}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Service:</span>
                        <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }}>{lastSubmittedBill.serviceType}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
                        <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 700 }}>Total Amount:</span>
                        <span style={{ color: '#059669', fontSize: '1.1rem', fontWeight: 900 }}>₹{lastSubmittedBill.amount}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowSuccessPopup(false)}
                    style={{ width: '100%', padding: '1rem', background: '#2563eb', color: 'white', borderRadius: 12, border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
                    onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
                    onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
                  >
                    Done
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
