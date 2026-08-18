import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, MapPin, Phone,
  IndianRupee, LogOut, RefreshCw, ChevronRight,
  AlertCircle, Bike, Navigation, UserCircle, Menu, X, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';

const API = API_BASE_URL;
const HEADERS = { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' };

const T = {
  bg: '#f1f5f9', dark: '#0f172a', blue: '#2563eb', blueDark: '#1e40af',
  blueLight: '#eff6ff', green: '#16a34a', greenLight: '#f0fdf4',
  orange: '#ea580c', red: '#dc2626', yellow: '#d97706', yellowLight: '#fef3c7',
  white: '#ffffff', slate: '#475569', muted: '#94a3b8', border: '#e2e8f0',
  sidebar: '#ffffff', sidebarBorder: '#e2e8f0', sidebarText: '#475569', sidebarMuted: '#94a3b8',
};

const STATUS = {
  pending: { label: 'Ready for Pickup', color: T.yellow, bg: T.yellowLight, icon: Clock },
  assigned: { label: 'Ready for Pickup', color: T.blue, bg: T.blueLight, icon: Bike },
  delivery: { label: 'Ready for Pickup', color: T.blue, bg: T.blueLight, icon: Bike },
  out_for_delivery: { label: 'Out for Delivery', color: T.orange, bg: '#fff7ed', icon: Navigation },
  delivered: { label: 'Delivered', color: T.green, bg: T.greenLight, icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: T.red, bg: '#fef2f2', icon: AlertCircle },
};

const NEXT = { assigned: 'accept', delivery: 'accept', pending: 'accept', out_for_delivery: 'delivered' };

const TABS = [
  { key: 'active', label: 'Active', icon: Bike },
  { key: 'on_delivery', label: 'On Delivery', icon: Navigation },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

/* ─── Sidebar Nav Item ───────────────────────── */
const SideNavItem = ({ icon: Icon, label, active, count, onClick }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.75rem 1rem', borderRadius: 12, cursor: 'pointer',
    background: active ? T.blue : 'transparent',
    color: active ? T.white : T.sidebarText,
    fontWeight: active ? 800 : 600, fontSize: '0.9rem',
    marginBottom: '0.25rem', transition: 'all 0.15s ease',
  }}
    onMouseOver={e => { if (!active) { e.currentTarget.style.background = T.bg; e.currentTarget.style.color = T.dark; } }}
    onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.sidebarText; } }}
  >
    <Icon size={18} />
    <span style={{ flex: 1 }}>{label}</span>
    {count > 0 && (
      <span style={{
        fontSize: '0.7rem', fontWeight: 800, minWidth: 20, height: 20,
        borderRadius: 10, background: active ? 'rgba(255,255,255,0.25)' : T.blueLight,
        color: active ? T.white : T.blue, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '0 6px'
      }}>{count}</span>
    )}
    {active && <ChevronRight size={14} />}
  </div>
);

/* ─── Order Card ─────────────────────────────── */
const OrderCard = ({ order, onUpdateStatus, updating }) => {
  const st = STATUS[order.status] || STATUS.pending;
  const Icon = st.icon;
  const nextSt = NEXT[order.status];
  const isAccept = nextSt === 'accept';
  const btnBg = isAccept
    ? `linear-gradient(135deg, #2563eb, #1e40af)`
    : nextSt === 'delivered'
      ? `linear-gradient(135deg, #16a34a, #15803d)`
      : null;
  const btnShadow = isAccept ? '0 4px 14px rgba(37,99,235,0.3)' : '0 4px 14px rgba(22,163,74,0.3)';

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      style={{ background: T.white, borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${T.border}`, boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>

      {/* Header */}
      <div style={{ padding: '0.9rem 1.25rem', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafbff', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${st.color}25`, flexShrink: 0 }}>
            <Icon size={17} color={st.color} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: T.dark }}>Order #{order.id}</div>
            <div style={{ fontSize: '0.72rem', color: T.muted, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.shop_name || 'Shop'}</div>
          </div>
        </div>
        <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '3px 9px', borderRadius: 20, backgroundColor: st.bg, color: st.color, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {st.label}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '0.9rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserCircle size={15} color={T.muted} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: T.dark, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.customer_name || 'Customer'}</span>
          {(order.customer_phone || order.phone) && (
            <a href={`tel:${order.customer_phone || order.phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: T.blue, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', background: T.blueLight, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>
              <Phone size={12} /> Call
            </a>
          )}
        </div>

        {(order.delivery_address || order.address) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <MapPin size={14} color={T.muted} style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: T.slate, fontWeight: 500, lineHeight: 1.45 }}>
              {order.delivery_address || order.address}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IndianRupee size={14} color={T.muted} />
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: T.dark }}>₹{parseFloat(order.total_amount || order.amount || 0).toFixed(2)}</span>
          {order.payment_method && (
            <span style={{ fontSize: '0.7rem', color: T.muted, fontWeight: 600, background: '#f1f5f9', padding: '2px 8px', borderRadius: 8 }}>{order.payment_method}</span>
          )}
        </div>

        {order.products && order.products.length > 0 && (
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.6rem 0.85rem', marginTop: 2, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {order.products.slice(0, 3).map((p, i) => {
              const pName = p._resolvedName || (typeof p.product === 'string' ? p.product : null) || p.product_name || p.item_name || p.name || p.title || p.product?.name || '';
              const pQty = p.quantity || 1;
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: T.slate, fontWeight: 500, lineHeight: 1.4 }}>
                  <span style={{ display: 'flex', gap: 6, minWidth: 0 }}>
                    <span style={{ color: T.blue, fontWeight: 800, flexShrink: 0 }}>•</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pName}</span>
                  </span>
                  <span style={{ fontWeight: 700, color: T.dark, background: '#e2e8f0', padding: '2px 6px', borderRadius: 6, fontSize: '0.7rem', flexShrink: 0, marginLeft: 8 }}>×{pQty}</span>
                </div>
              );
            })}
            {order.products.length > 3 && <div style={{ fontSize: '0.7rem', color: T.muted, fontWeight: 600, textAlign: 'center', marginTop: 2 }}>+{order.products.length - 3} more items</div>}
          </div>
        )}
      </div>

      {/* Action Button */}
      {nextSt && btnBg && (
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <button disabled={updating === order.id} onClick={() => onUpdateStatus(order.id, nextSt)}
            style={{
              width: '100%', padding: '0.75rem', border: 'none', borderRadius: 10,
              cursor: updating === order.id ? 'not-allowed' : 'pointer',
              background: updating === order.id ? T.muted : btnBg,
              color: T.white, fontSize: '0.88rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: updating === order.id ? 'none' : btnShadow, transition: 'all 0.2s'
            }}>
            {updating === order.id
              ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</>
              : isAccept
                ? <><Bike size={15} /> Pick me</>
                : <><CheckCircle2 size={15} /> Mark Delivered</>}
          </button>
        </div>
      )}
    </motion.div>
  );
};

/* ─── Stat Card ──────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color, bg, delay = 0, isMobile }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }}
    style={{ background: T.white, borderRadius: 14, padding: isMobile ? '0.85rem 0.5rem' : '1.25rem', border: `1.5px solid ${T.border}`, boxShadow: '0 2px 10px rgba(15,23,42,0.04)', display: 'flex', alignItems: 'center', gap: isMobile ? '0.4rem' : '1rem' }}>
    <div style={{ width: isMobile ? 34 : 44, height: isMobile ? 34 : 44, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={isMobile ? 16 : 20} color={color} />
    </div>
    <div style={{ minWidth: 0, overflow: 'hidden' }}>
      <div style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', fontWeight: 900, color: T.dark, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: isMobile ? '0.58rem' : '0.72rem', color: T.muted, fontWeight: 600, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
    </div>
  </motion.div>
);

/* ─── Empty State ────────────────────────────── */
const EmptyState = ({ tab, onRefresh }) => {
  const cfg = {
    active: { icon: Bike, title: 'No Active Orders', sub: 'New orders ready for pickup will appear here automatically.' },
    on_delivery: { icon: Navigation, title: 'Nothing On Delivery', sub: 'Orders you accepted (Pick me) will appear here.' },
    completed: { icon: CheckCircle2, title: 'No Completed Deliveries', sub: 'Orders you marked as Delivered will be stored here.' },
  }[tab] || {};
  const Icon = cfg.icon || Package;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ background: T.white, borderRadius: 20, padding: '3.5rem 2rem', textAlign: 'center', border: `1.5px solid ${T.border}`, maxWidth: 420 }}>
      <div style={{ marginBottom: '1rem', color: T.slate, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: T.bg, padding: '1.25rem', borderRadius: '50%' }}>
          <Icon size={40} />
        </div>
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: T.dark, margin: '0 0 0.4rem' }}>{cfg.title}</h3>
      <p style={{ fontSize: '0.85rem', color: T.muted, fontWeight: 500, margin: '0 0 1.5rem', lineHeight: 1.5 }}>{cfg.sub}</p>
      <button onClick={onRefresh} style={{ padding: '0.6rem 1.4rem', background: T.blue, color: T.white, border: 'none', borderRadius: 10, fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <RefreshCw size={14} /> Refresh
      </button>
    </motion.div>
  );
};

/* ─── Main Dashboard ─────────────────────────── */
export default function DeliveryDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [lastRefresh, setLastRefresh] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fn = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const isMobile = windowWidth <= 768;

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const storedRaw = localStorage.getItem('user');
      const stored = storedRaw ? JSON.parse(storedRaw) : {};
      const uid = user?.id || user?.deliveryman_id || user?.user_id
        || stored?.id || stored?.deliveryman_id || stored?.user_id;

      if (!uid) { setOrders([]); setLoading(false); return; }

      const [resA, resM] = await Promise.all([
        fetch(`${API}/deliveryman/available-orders/${uid}/`, { headers: HEADERS }).catch(() => null),
        fetch(`${API}/deliveryman/my-orders/${uid}/`, { headers: HEADERS }).catch(() => null),
      ]);

      const aData = resA?.ok ? await resA.json() : [];
      const mData = resM?.ok ? await resM.json() : [];

      const aList = Array.isArray(aData) ? aData : aData?.orders || aData?.results || [];
      const mList = Array.isArray(mData) ? mData : mData?.orders || mData?.results || [];

      const norm = (o, isAvailable) => {
        if (!o) return null;
        let status = isAvailable ? 'assigned' : (o.status || 'pending');
        if (!isAvailable && ['packaging', 'pending', 'delivery'].includes(status)) status = 'assigned';
        return {
          ...o,
          id: o.order_id || o.id,
          status,
          shop_name: o.shop?.shop_name || o.shop_name || 'Shop',
          customer_name: o.customer?.customer_name || o.customer_name || 'Customer',
          customer_phone: o.customer?.customer_mobile || o.customer_phone || '',
          delivery_address: o.address
            ? `${o.address.address_line || ''}, ${o.address.city || ''}`.replace(/^,\s*/, '')
            : (o.delivery_address || ''),
          total_amount: o.total_amount || o.amount || 0,
          payment_method: o.payment_method || o.payment_status || 'COD',
          products: (o.products || o.items || o.order_items || []).map(p => ({
            ...p,
            // Backend returns product name as a plain string in the 'product' field
            _resolvedName:
              (typeof p.product === 'string' ? p.product : null) ||
              p.product_name ||
              p.item_name ||
              p.name ||
              p.title ||
              p.product?.name ||
              null,
          })),
        };
      };
      // Debug: log a sample order's products to the console
      if (process.env.NODE_ENV !== 'production') {
        const sample = [...aList, ...mList][0];
        if (sample?.products?.length) {
          console.log('[DeliveryDashboard] sample product fields:', sample.products[0]);
        } else if (sample?.items?.length) {
          console.log('[DeliveryDashboard] sample item fields:', sample.items[0]);
        } else if (sample?.order_items?.length) {
          console.log('[DeliveryDashboard] sample order_item fields:', sample.order_items[0]);
        }
      }

      const map = new Map();
      aList.forEach(o => { const n = norm(o, true); if (n?.id) map.set(n.id, n); });
      mList.forEach(o => { const n = norm(o, false); if (n?.id) map.set(n.id, n); });

      setOrders(Array.from(map.values()));
      setLastRefresh(new Date());
    } catch (err) {
      console.error('[Delivery] fetch error:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders(false);
    const iv = setInterval(() => fetchOrders(true), 5000);
    const onVisible = () => { if (document.visibilityState === 'visible') fetchOrders(true); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', onVisible); };
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    const storedRaw = localStorage.getItem('user');
    const stored = storedRaw ? JSON.parse(storedRaw) : {};
    const uid = user?.id || user?.deliveryman_id || user?.user_id
      || stored?.id || stored?.deliveryman_id || stored?.user_id;
    try {
      if (newStatus === 'accept') {
        await fetch(`${API}/deliveryman/accept-delivery/${orderId}/`, {
          method: 'POST', headers: HEADERS, body: JSON.stringify({ user_id: uid })
        });
        // Optimistically move to On Delivery tab
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'out_for_delivery' } : o));
        setActiveTab('on_delivery');
      } else {
        const res = await fetch(`${API}/deliveryman/update-order-status/${uid}/`, {
          method: 'PUT', headers: HEADERS,
          body: JSON.stringify({ order_id: orderId, status: newStatus })
        });
        if (!res.ok) console.error('[Delivery] update error:', await res.text());
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (newStatus === 'delivered') setActiveTab('completed');
      }
    } catch (e) { console.error('[Delivery] update catch:', e); }
    setUpdating(null);
    fetchOrders(true);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const [authChecked] = useState(() => {
    try {
      const s = localStorage.getItem('user');
      if (!s || s === 'undefined') return false;
      const p = JSON.parse(s);
      return !!(p && (p.id || p.user_id || p.mobile || p.phone || p.name));
    } catch { return false; }
  });

  useEffect(() => { if (!authChecked) navigate('/login'); }, [authChecked, navigate]);

  if (!authChecked) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Loading Dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  /* Derived order lists */
  const activeOrders = orders.filter(o => ['pending', 'assigned', 'delivery'].includes(o.status));
  const onDeliveryOrders = orders.filter(o => o.status === 'out_for_delivery');
  const completedOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const tabOrders = { active: activeOrders, on_delivery: onDeliveryOrders, completed: completedOrders }[activeTab] || [];
  const tabTitles = { active: 'Active Orders', on_delivery: 'On Delivery', completed: 'Completed' };
  const TabIcon = { active: Bike, on_delivery: Navigation, completed: CheckCircle2 }[activeTab] || Bike;

  const sidebarW = 272;

  const Sidebar = () => (
    <div style={{
      width: isMobile ? '100%' : sidebarW, height: '100vh',
      background: T.sidebar, display: 'flex', flexDirection: 'column',
      padding: '1.75rem 1.25rem', boxSizing: 'border-box', flexShrink: 0,
      borderRight: `1px solid ${T.sidebarBorder}`, boxShadow: '4px 0 24px rgba(15,23,42,0.04)',
      ...(isMobile ? {} : { position: 'fixed', top: 0, left: 0, zIndex: 100 })
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: T.white, fontSize: '1.1rem', flexShrink: 0 }}>G</div>
        <span style={{ fontSize: '1.15rem', fontWeight: 900, color: T.dark, letterSpacing: '-0.5px' }}>Gobi360</span>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto', background: T.bg, border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color={T.slate} />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -16, right: -16, width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.25)' }}>
            <Bike size={20} color={T.white} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delivery Partner</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: T.white, marginTop: 1 }}>{user?.name || user?.full_name || 'Partner'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { val: activeOrders.length, lbl: 'Active' },
            { val: onDeliveryOrders.length, lbl: 'Delivering' },
            { val: completedOrders.length, lbl: 'Done' },
          ].map(({ val, lbl }) => (
            <div key={lbl} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '0.5rem 0.4rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: T.white }}>{val}</div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.65rem', color: T.sidebarMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Navigation</div>
        <SideNavItem icon={Bike} label="Active Orders" active={activeTab === 'active'} count={activeOrders.length} onClick={() => { setActiveTab('active'); setSidebarOpen(false); }} />
        <SideNavItem icon={Navigation} label="On Delivery" active={activeTab === 'on_delivery'} count={onDeliveryOrders.length} onClick={() => { setActiveTab('on_delivery'); setSidebarOpen(false); }} />
        <SideNavItem icon={CheckCircle2} label="Completed" active={activeTab === 'completed'} count={completedOrders.length} onClick={() => { setActiveTab('completed'); setSidebarOpen(false); }} />
      </div>

      {/* Logout */}
      <div style={{ borderTop: `1px solid ${T.sidebarBorder}`, paddingTop: '1rem' }}>
        <div onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 12, cursor: 'pointer', color: '#f87171', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.15s' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={18} /> Logout
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: T.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.6}50%{opacity:.3}}
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {!isMobile && <Sidebar />}
      {isMobile && sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', zIndex: 1, width: '85%', maxWidth: 320, height: '100vh' }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, marginLeft: isMobile ? 0 : sidebarW, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0, overflowX: 'hidden' }}>

        {/* Top Bar */}
        <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', position: 'sticky', top: 0, zIndex: 50, gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, flex: 1, minWidth: 0 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ width: 36, height: 36, borderRadius: 10, background: T.blueLight, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Menu size={18} color={T.blue} />
              </button>
            )}
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 900, color: T.dark, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 6 }}>
                <TabIcon size={isMobile ? 16 : 20} color={T.blue} />
                {tabTitles[activeTab]}
              </h1>
              {lastRefresh && (
                <p style={{ fontSize: '0.62rem', color: T.muted, margin: '2px 0 0', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  Updated {lastRefresh.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <button onClick={fetchOrders} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: isMobile ? '0' : '0.55rem 1rem',
            width: isMobile ? 36 : 'auto', height: isMobile ? 36 : 'auto', flexShrink: 0,
            background: T.blueLight, color: T.blue, border: `1.5px solid #bfdbfe`,
            borderRadius: 10, fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer'
          }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {!isMobile && 'Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ padding: isMobile ? '1rem 1rem 0' : '1.25rem 1.5rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: isMobile ? '0.5rem' : '1rem' }}>
            <StatCard icon={Bike} label="Active" value={activeOrders.length} color={T.blue} bg={T.blueLight} delay={0} isMobile={isMobile} />
            <StatCard icon={Navigation} label="On Delivery" value={onDeliveryOrders.length} color={T.orange} bg="#fff7ed" delay={0.05} isMobile={isMobile} />
            <StatCard icon={CheckCircle2} label="Completed" value={completedOrders.length} color={T.green} bg={T.greenLight} delay={0.1} isMobile={isMobile} />
          </div>
        </div>

        {/* 3-Tab Switcher */}
        <div style={{ padding: isMobile ? '0.75rem 1rem 0' : '1rem 1.5rem 0' }}>
          <div style={{ display: 'flex', background: T.white, borderRadius: 14, padding: 4, border: `1.5px solid ${T.border}`, boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
            {TABS.map(({ key, label, icon: Icon }) => {
              const counts = { active: activeOrders.length, on_delivery: onDeliveryOrders.length, completed: completedOrders.length };
              const isActive = activeTab === key;
              return (
                <button key={key} onClick={() => setActiveTab(key)} style={{
                  flex: 1, padding: isMobile ? '0.6rem 0.2rem' : '0.65rem 0.5rem', borderRadius: 10, border: 'none',
                  background: 'transparent', position: 'relative',
                  color: isActive ? T.white : T.slate,
                  fontSize: isMobile ? '0.68rem' : '0.82rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: isMobile ? 3 : 6, transition: 'color 0.2s', whiteSpace: 'nowrap', zIndex: 1
                }}>
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      style={{ position: 'absolute', inset: 0, background: T.blue, borderRadius: 10, zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={isMobile ? 14 : 16} />
                  <span>{label}</span>
                  {counts[key] > 0 && (
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 900, padding: '1px 5px', borderRadius: 8,
                      background: isActive ? 'rgba(255,255,255,0.3)' : T.blueLight,
                      color: isActive ? T.white : T.blue, transition: 'all 0.2s'
                    }}>{counts[key]}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders */}
        <div style={{ padding: isMobile ? '1rem 1rem 1.5rem' : '1.25rem 1.5rem 2rem', flex: 1, overflowX: 'hidden' }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: 210, background: T.white, borderRadius: 16, border: `1.5px solid ${T.border}`, animation: 'pulse 1.5s ease infinite' }} />
                ))}
              </motion.div>
            ) : tabOrders.length === 0 ? (
              <motion.div key={`empty-${activeTab}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                <EmptyState tab={activeTab} onRefresh={fetchOrders} />
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${activeTab}`}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}
              >
                <AnimatePresence>
                  {tabOrders.map(order => (
                    <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} updating={updating} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
