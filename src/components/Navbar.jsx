import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Languages, Menu, X, Zap, Home, Users, LayoutGrid, Star, User, LogIn, UserPlus, ShoppingCart, Package, Clock, TrendingUp, LogOut, Trash2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { services } from '../data/servicesData';
import { API_HEADERS, ENDPOINTS, apiFetch, apiUrl } from '../lib/api';
import logo from '../assets/gobi360-logo.png';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isLoggedIn, logout } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [apiServices, setApiServices] = useState([]);
  const [apiSearchPool, setApiSearchPool] = useState([]); // API experts + shops for search
  const [cartCount, setCartCount] = useState(0);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [miniCartItems, setMiniCartItems] = useState([]);
  const [miniCartPoints, setMiniCartPoints] = useState(0);
  const [miniCartRewardSetting, setMiniCartRewardSetting] = useState(null);
  const [applyMiniCartPoints, setApplyMiniCartPoints] = useState(false);

  const refreshCart = async () => {
    try {
      const local = JSON.parse(localStorage.getItem('localCart') || '[]');
      const u = localStorage.getItem('user');
      if (u && u !== 'undefined') {
        const parsed = JSON.parse(u);
        const userId = parsed?.id || parsed?.user_id;
        if (userId) {
          try {
            const r = await fetch(`https://api.codingboss.in/gobi360/cart/?user_id=${userId}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (r.ok) {
              const data = await r.json();
              if (data && data.status && Array.isArray(data.shops)) {
                let apiItems = [];
                data.shops.forEach(shop => {
                  if (shop.products && Array.isArray(shop.products)) {
                    shop.products.forEach(p => {
                      const prodId = p.product_id || p.product || p.id;
                      const localMatch = local.find(l => String(l.productId || l.product_id || l.id) === String(prodId));
                      apiItems.push({
                        ...p,
                        cart_item_id: p.cart_item_id || p.id,
                        productId: prodId,
                        shopId: shop.shop_id || shop.id,
                        shopName: shop.shop_name || shop.name,
                        name: p.product_name || p.name || localMatch?.name,
                        image: p.image || p.product_image || p.image_url || localMatch?.image || localMatch?.product_image,
                        price: parseFloat(p.price || localMatch?.price || 0),
                        quantity: parseInt(p.quantity || 1, 10),
                        variationName: p.variation_name || p.variation?.value || localMatch?.variationName
                      });
                    });
                  }
                });
                setCartCount(apiItems.length);
                setMiniCartItems(apiItems);
                localStorage.setItem('localCart', JSON.stringify(apiItems));
                return;
              }
            }
          } catch (e) { }
        }
      }

      setCartCount(local.length);
      setMiniCartItems(local);
    } catch (err) {
      setCartCount(0);
      setMiniCartItems([]);
    }
  };

  // Fetch API experts + shops so search bar includes all real services
  useEffect(() => {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    Promise.all([
      fetch('https://api.codingboss.in/gobi360/experts/', { headers }).then(r => r.json()).catch(() => []),
      fetch('https://api.codingboss.in/gobi360/shops/', { headers }).then(r => r.json()).catch(() => [])
    ]).then(([expertsRaw, shopsRaw]) => {
      const experts = (Array.isArray(expertsRaw) ? expertsRaw : expertsRaw?.results || []);
      const shops = (Array.isArray(shopsRaw) ? shopsRaw : shopsRaw?.results || []);

      const mappedExperts = experts.map(e => ({
        id: `api-${e.id}`,
        company: e.expert_name || '',
        companyTa: e.expert_name_ta || e.expert_name || '',
        desc: e.category || '',
        descTa: e.category_ta || e.category || '',
        person: e.expert_name || '',
        phone: e.contact_number || '',
        image: e.expert_image || '',
        accent: '#3b82f6',
        tag: e.badge || 'EXPERT',
        tagTa: e.badge_ta || 'நிபுணர்',
        features: [],
        isApi: true
      }));

      const mappedShops = shops.filter(s => s.is_active).map(s => ({
        id: `api-shop-${s.id}`,
        company: s.shop_name || '',
        companyTa: s.shop_name || '',
        desc: 'Shop & Order Online',
        descTa: 'கடையின் மூலம் ஆர்டர் செய்யுங்கள்',
        person: s.owner_name || s.shop_name || '',
        phone: s.phone || '',
        image: s.shop_image || '',
        accent: '#f59e0b',
        tag: 'STORE',
        tagTa: 'கடை',
        features: [],
        isApiShop: true,
        shopId: s.id,
        categoryId: s.category
      }));

      setApiSearchPool([...mappedExperts, ...mappedShops]);
    });
  }, []);

  useEffect(() => {
    refreshCart();
    window.addEventListener('storage', refreshCart);
    window.addEventListener('cartUpdated', refreshCart);
    return () => {
      window.removeEventListener('storage', refreshCart);
      window.removeEventListener('cartUpdated', refreshCart);
    };
  }, []);

  // Fetch reward settings when mini-cart is opened
  useEffect(() => {
    if (showMiniCart && miniCartItems.length > 0) {
      const shopId = miniCartItems[0].shopId || miniCartItems[0].shop_id || 1;

      setMiniCartPoints(0);

      fetch(apiUrl(ENDPOINTS.rewardSetting(shopId)), {
        headers: API_HEADERS
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.status) {
            setMiniCartRewardSetting({
              purchase_amount: parseFloat(data.purchase_amount) || 100,
              reward_points: data.reward_points || 1,
              redeem_points: data.redeem_points || 10,
              redeem_amount: parseFloat(data.redeem_amount) || 1,
              minimum_redeem_points: data.minimum_redeem_points || 10,
              message: data.message || null
            });
          } else {
            setMiniCartRewardSetting({
              purchase_amount: 100,
              reward_points: 1,
              redeem_points: 10,
              redeem_amount: 1,
              minimum_redeem_points: 10,
              message: null
            });
          }
        })
        .catch(() => {
          setMiniCartRewardSetting({
            purchase_amount: 100,
            reward_points: 1,
            redeem_points: 10,
            redeem_amount: 1,
            minimum_redeem_points: 10,
            message: null
          });
        });
    }
  }, [showMiniCart, miniCartItems]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    const allFeatureLists = (service) => [
      service.features,
      service.insurance,
      service.steelCement,
      service.aggregatesBlocks,
      service.electricalServices,
      service.electronicsRepair,
      service.studioPortrait,
      service.weddingOutdoor,
      service.enrichment,
    ];

    // Combine static + API services for search
    const allServices = [...services, ...apiSearchPool];

    const results = [];

    allServices.forEach(service => {
      const company = (language === 'en' ? service.company : service.companyTa || '').toLowerCase();
      const desc = (language === 'en' ? service.desc : service.descTa || '').toLowerCase();
      const tag = (language === 'en' ? service.tag : service.tagTa || '').toLowerCase();
      const person = (service.person || '').toLowerCase();

      let matchType = null;
      let matchedKeyword = '';
      let priority = 2;

      if (company.includes(query)) {
        matchType = 'Service';
        matchedKeyword = language === 'en' ? service.company : service.companyTa || service.company;
        priority = company.startsWith(query) ? 0 : 2;
      } else if (person.includes(query)) {
        matchType = 'Expert';
        matchedKeyword = service.person;
        priority = person.startsWith(query) ? 1 : 2;
      } else if (tag.includes(query)) {
        matchType = 'Category';
        matchedKeyword = language === 'en' ? service.tag : service.tagTa || service.tag;
        priority = tag.startsWith(query) ? 1 : 2;
      } else if (desc.includes(query)) {
        matchType = 'Service';
        matchedKeyword = language === 'en' ? service.desc : service.descTa || service.desc;
        priority = 2;
      } else {
        for (const list of allFeatureLists(service)) {
          if (!Array.isArray(list)) continue;
          for (const f of list) {
            const title = (language === 'en' ? f.title : f.titleTa || '').toLowerCase();
            const fdesc = (language === 'en' ? f.desc : f.descTa || '').toLowerCase();
            if (title.includes(query) || fdesc.includes(query)) {
              matchType = 'Feature';
              matchedKeyword = language === 'en' ? f.title : f.titleTa || f.title;
              priority = title.startsWith(query) ? 1 : 2;
              break;
            }
          }
          if (matchType) break;
        }
      }

      if (matchType) {
        results.push({ ...service, matchType, matchedKeyword, _priority: priority });
      }
    });

    // Sort: starts-with first (priority 0 → 1 → 2), then alphabetically within each group
    results.sort((a, b) => {
      if (a._priority !== b._priority) return a._priority - b._priority;
      const aName = (language === 'en' ? a.company : a.companyTa || a.company).toLowerCase();
      const bName = (language === 'en' ? b.company : b.companyTa || b.company).toLowerCase();
      return aName.localeCompare(bName);
    });

    setSearchResults(results);
    setIsDropdownOpen(true);
  }, [searchQuery, language, apiSearchPool]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    setIsDropdownOpen(false);
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }

    if (searchResults.length > 0) {
      const topResult = searchResults[0];
      const topName = (language === 'en' ? topResult.company : topResult.companyTa || topResult.company).trim().toLowerCase();
      const personName = (topResult.person || '').trim().toLowerCase();

      if (topName === q || personName === q || topName.includes(q) || searchResults.length === 1) {
        if (topResult.isApiShop) {
          navigate(`/services/api-cat-${topResult.categoryId}?shop=${topResult.shopId}`);
          setSearchQuery('');
          return;
        }
        if (topResult.isApi || topResult.matchType === 'Service') {
          navigate(`/services/${topResult.id}`);
          setSearchQuery('');
          return;
        }
        if (topResult.matchType === 'Expert') {
          const anchor = topResult.id?.toLowerCase().replace(/\s+/g, '-');
          navigate(`/experts#expert-card-${anchor}`);
          setSearchQuery('');
          return;
        }
      }
    }

    navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };


  useEffect(() => {
    if (showMiniCart) {
      window.dispatchEvent(new CustomEvent('cartVisibilityChanged', { detail: { isVisible: true } }));
    } else {
      window.dispatchEvent(new CustomEvent('cartVisibilityChanged', { detail: { isVisible: false } }));
    }
  }, [showMiniCart]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 425;


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let navItems = [
    { name: t('Home', 'முகப்பு'), path: '/', icon: Home },
    { name: t('Experts', 'நிபுணர்கள்'), path: '/experts', icon: Users },
    { name: t('Services', 'சேவைகள்'), path: '/services', icon: LayoutGrid },
    { name: t('Reviews', 'மதிப்புரைகள்'), path: '/reviews', icon: Star },
    { name: t('Profile', 'சுயவிவரம்'), path: '/profile', icon: User },
  ];

  if (location.pathname.startsWith('/owner-dashboard')) {
    navItems = [
      { name: t('Orders', 'ஆர்டர்கள்'), path: '/owner-dashboard?tab=orders', icon: Package },
      { name: t('Points', 'புள்ளிகள்'), path: '/owner-dashboard?tab=points', icon: Star },
    ];
  } else if (location.pathname.startsWith('/expert-dashboard')) {
    navItems = [
      { name: t('Post Bill', 'பில் பதிவுசெய்'), path: '/expert-dashboard?tab=orders', icon: Package },
      { name: t('View Bills', 'பில்களைக் காண்'), path: '/expert-dashboard?tab=view_bills', icon: LayoutGrid },
      { name: t('Add Points', 'புள்ளிகள் சேர்'), path: '/expert-dashboard?tab=points', icon: Star },
      { name: t('Profile', 'சுயவிவரம்'), path: '/expert-dashboard?tab=profile', icon: User },
    ];
  } else if (location.pathname.startsWith('/admin-dashboard')) {
    navItems = [
      { name: t('Dashboard', 'கட்டுப்பாட்டகம்'), path: '/admin-dashboard', icon: TrendingUp },
    ];
  } else if (location.pathname.startsWith('/delivery-dashboard')) {
    // Delivery dashboard has its own full-page sidebar — hide global Navbar
    return null;
  }

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(15, 23, 42, 0.08)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div className="container" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          rowGap: isMobile ? '0.4rem' : '0',
          padding: scrolled ? '0.5rem 1rem' : (isMobile ? '0.6rem 1rem' : '0.85rem 1rem'),
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isSmallMobile ? '0.25rem' : '0.5rem' }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Menu size={24} color="#0f172a" />
              </button>
            )}

            {/* Brand */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img
                src={logo}
                alt="Gobi 360 Logo"
                style={{
                  height: isMobile ? '55px' : '75px',
                  objectFit: 'contain',
                  transition: 'all 0.3s ease'
                }}
              />
            </Link>
          </div>

          {/* Global Search Bar - Visible on desktop and mobile */}
          {location.pathname !== '/services/food-delivery-express' && (
            <div
              ref={searchContainerRef}
              style={{
                flex: isMobile ? 'none' : 1,
                width: isMobile ? '100%' : 'auto',
                maxWidth: isMobile ? '100%' : '380px',
                margin: isMobile ? '0 0 0.25rem 0' : '0 1.5rem',
                position: 'relative',
                order: isMobile ? 3 : 2
              }}
            >
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: 'flex', alignItems: 'center',
                  backgroundColor: scrolled ? '#f8fafc' : 'rgba(241, 245, 249, 0.8)',
                  padding: isMobile ? '0.5rem 1rem' : '0.65rem 1.25rem', borderRadius: '1.5rem',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                }}
                onFocusCapture={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  setIsDropdownOpen(true);
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.backgroundColor = scrolled ? '#f8fafc' : 'rgba(241, 245, 249, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.02)';
                }}
              >
                <Search
                  size={18}
                  color="#94a3b8"
                  style={{ cursor: 'pointer' }}
                  onClick={handleSearchSubmit}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  placeholder={t("Search services...", "சேவைகளைத் தேடு...")}
                  style={{
                    flex: 1, padding: '0 0.85rem', fontSize: '0.95rem',
                    color: '#1e293b', background: 'transparent', border: 'none', outline: 'none',
                    fontWeight: '500'
                  }}
                />
                {searchQuery && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                    <X
                      size={16}
                      color="#94a3b8"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSearchQuery('');
                        setIsDropdownOpen(false);
                      }}
                    />
                  </motion.div>
                )}
              </form>

              {/* Search Results Dropdown – Keyword-based */}
              <AnimatePresence>
                {searchQuery && isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0,
                      backgroundColor: '#fff', borderRadius: '1.25rem',
                      boxShadow: '0 20px 60px -10px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08)',
                      border: '1.5px solid #e2e8f0',
                      maxHeight: '480px', overflowY: 'auto', zIndex: 1001,
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    {searchResults.length > 0 ? (
                      <>
                        {/* Header */}
                        <div style={{
                          padding: '0.85rem 1.1rem 0.5rem',
                          borderBottom: '1px solid #f1f5f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            {searchResults.length} {t('results for', 'முடிவுகள்')} &ldquo;<span style={{ color: '#2563eb' }}>{searchQuery}</span>&rdquo;
                          </span>
                          <span
                            onClick={() => setSearchQuery('')}
                            style={{ fontSize: '0.72rem', color: '#94a3b8', cursor: 'pointer', fontWeight: '600' }}
                          >
                            {t('Clear', 'அழி')}
                          </span>
                        </div>

                        {/* Results List */}
                        <div style={{ padding: '0.5rem 0.6rem' }}>
                          {searchResults.map((service, idx) => {
                            const matchTypeColors = {
                              Service: { bg: '#eff6ff', text: '#2563eb' },
                              Expert: { bg: '#f0fdf4', text: '#16a34a' },
                              Feature: { bg: '#fdf4ff', text: '#9333ea' },
                              Category: { bg: '#fff7ed', text: '#ea580c' },
                            };
                            const mt = matchTypeColors[service.matchType] || matchTypeColors.Service;

                            // Highlight matched keyword
                            const highlightText = (text, query) => {
                              if (!text) return text;
                              const idx = text.toLowerCase().indexOf(query.toLowerCase());
                              if (idx === -1) return text;
                              return (
                                <>
                                  {text.slice(0, idx)}
                                  <span style={{ backgroundColor: '#fef08a', borderRadius: '2px', fontWeight: '800', color: '#713f12' }}>
                                    {text.slice(idx, idx + query.length)}
                                  </span>
                                  {text.slice(idx + query.length)}
                                </>
                              );
                            };

                            const companyName = language === 'en' ? service.company : service.companyTa || service.company;
                            const descText = language === 'en' ? service.desc : service.descTa || service.desc;

                            return (
                              <Link
                                key={service.id}
                                to={(() => {
                                  if (service.isApiShop) {
                                    return `/services/api-cat-${service.categoryId}?shop=${service.shopId}`;
                                  }
                                  if (service.isApi) {
                                    // API expert → go to /services/<id> detail page (e.g. /services/api-25)
                                    return `/services/${service.id}`;
                                  }
                                  if (service.matchType === 'Expert') {
                                    // Static expert matched by person name → scroll to experts page
                                    const anchor = service.id?.toLowerCase().replace(/\s+/g, '-');
                                    return `/experts#expert-card-${anchor}`;
                                  }
                                  // Static service → go to service detail page
                                  return `/services/${service.id}`;
                                })()}
                                onClick={() => {
                                  setSearchQuery('');
                                  setIsDropdownOpen(false);
                                }}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '12px',
                                  padding: '0.75rem 0.6rem', borderRadius: '0.85rem',
                                  textDecoration: 'none', color: 'inherit',
                                  transition: 'background 0.15s ease',
                                  borderBottom: idx < searchResults.length - 1 ? '1px solid #f8fafc' : 'none'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                {/* Thumbnail */}
                                <div style={{
                                  width: '46px', height: '46px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0,
                                  border: `2px solid ${service.accent}30`, backgroundColor: '#f1f5f9'
                                }}>
                                  <img src={service.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                {/* Text */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.25, marginBottom: '1px' }}>
                                    {highlightText(companyName, searchQuery)}
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {service.matchType === 'Expert' ? (
                                      <>
                                        <span style={{ color: '#16a34a', fontWeight: '700' }}>👤 </span>
                                        {highlightText(service.person, searchQuery)}
                                      </>
                                    ) : service.matchType === 'Feature' ? (
                                      <>
                                        <span style={{ color: '#9333ea', fontWeight: '700' }}>⚡ </span>
                                        {highlightText(service.matchedKeyword, searchQuery)}
                                      </>
                                    ) : (
                                      highlightText(descText, searchQuery)
                                    )}
                                  </div>
                                </div>

                                {/* Match Type Badge */}
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                  {service.matchType.toUpperCase() !== (language === 'en' ? service.tag : service.tagTa || service.tag).toUpperCase() && (
                                    <span style={{
                                      fontSize: '0.62rem', fontWeight: '800', padding: '2px 8px',
                                      borderRadius: '20px', backgroundColor: mt.bg, color: mt.text,
                                      textTransform: 'uppercase', letterSpacing: '0.04em'
                                    }}>
                                      {t(service.matchType, service.matchType)}
                                    </span>
                                  )}
                                  <span style={{
                                    fontSize: '0.62rem', fontWeight: '700', padding: '2px 7px',
                                    borderRadius: '20px', backgroundColor: service.accent + '18', color: service.accent,
                                    textTransform: 'uppercase', letterSpacing: '0.03em'
                                  }}>
                                    {language === 'en' ? service.tag : service.tagTa || service.tag}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Footer */}
                        <div style={{
                          padding: '0.65rem 1.1rem',
                          borderTop: '1px solid #f1f5f9',
                          display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                          <Search size={12} color="#94a3b8" />
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' }}>
                            {t('Showing keyword matches · click to view service', 'கீவேர்ட் பொருத்தங்கள் · சேவையைப் பார்க்க கிளிக் செய்யவும்')}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
                        <p style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          {t('No results for', 'இதற்கு முடிவு இல்லை')} &ldquo;<span style={{ color: '#2563eb' }}>{searchQuery}</span>&rdquo;
                        </p>
                        <p style={{ fontSize: '0.8rem', marginTop: '6px', color: '#94a3b8', fontWeight: '500' }}>
                          {t('Try: wood, solar, steel, biryani, hindi…', 'முயற்சிக்க: wood, solar, steel, biryani, hindi…')}
                        </p>
                        {/* Quick keyword chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '1rem' }}>
                          {['solar', 'builders', 'steel', 'software', 'photo', 'insurance'].map(kw => (
                            <button
                              key={kw}
                              onClick={() => setSearchQuery(kw)}
                              style={{
                                padding: '4px 12px', borderRadius: '20px', border: '1.5px solid #e2e8f0',
                                backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.75rem',
                                fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s ease'
                              }}
                              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#2563eb'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563eb'; }}
                              onMouseOut={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                              {kw}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}


          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexShrink: 0, order: isMobile ? 2 : 3 }}>
            {!isMobile && (
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                {navItems.map(item => (
                  <Link
                    key={item.name}
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      color: location.pathname === item.path ? '#3b82f6' : '#475569',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      padding: '0.5rem 0.2rem'
                    }}
                    onMouseOver={e => !(location.pathname === item.path) && (e.currentTarget.style.color = '#0f172a')}
                    onMouseOut={e => !(location.pathname === item.path) && (e.currentTarget.style.color = '#475569')}
                  >
                    {item.name}
                    {location.pathname === item.path && (
                      <motion.span
                        layoutId="navUnderline"
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          left: 0, right: 0, height: '3px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '999px',
                        }}
                      />
                    )}
                  </Link>
                ))}
                <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>
              </div>
            )}


            {/* Language Switch Toggle - hidden on admin dashboard and mobile */}
            {!location.pathname.startsWith('/admin-dashboard') && !isMobile && (
              <div
                onClick={toggleLanguage}
                style={{
                  width: '92px',
                  height: '36px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '999px',
                  padding: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  position: 'relative',
                  alignItems: 'center',
                  border: '1px solid #e2e8f0',
                  userSelect: 'none',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: '3px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  alignItems: 'center',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: language === 'en' ? '#ffffff' : '#64748b', transition: 'color 0.3s ease' }}>EN</span>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '2px', color: language === 'ta' ? '#ffffff' : '#64748b', transition: 'color 0.3s ease' }}>தமிழ்</span>
                </div>

                <motion.div
                  layout
                  initial={false}
                  animate={{ x: language === 'en' ? 0 : 43 }}
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  style={{
                    width: '43px',
                    height: '28px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    zIndex: 0,
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                  }}
                />
              </div>
            )}

            {/* Cart Icon in Navbar */}
            {!location.pathname.startsWith('/owner-dashboard') && !location.pathname.startsWith('/expert-dashboard') && !location.pathname.startsWith('/admin-dashboard') && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const loggedIn = (() => {
                      try {
                        const u = localStorage.getItem('user');
                        if (!u || u === 'undefined') return false;
                        const parsed = JSON.parse(u);
                        return !!(parsed?.id || parsed?.user_id);
                      } catch { return false; }
                    })();

                    if (!loggedIn) {
                      window.location.href = '/login';
                      return;
                    }
                    // Always open mini-cart sidebar — refresh items first
                    refreshCart();
                    setShowMiniCart(true);
                  }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    color: '#3b82f6',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    marginRight: '0.5rem'
                  }}
                  title={t("Cart", "கூடை")}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: '900',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 5px rgba(239,68,68,0.4)',
                        border: '2px solid white'
                      }}
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.div>
                  )}
                </button>
              </div>
            )}

            {!location.pathname.startsWith('/admin-dashboard') && (isLoggedIn ? (
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '0' : '0.85rem',
                padding: isMobile ? '0' : '0.5rem 1.15rem',
                borderRadius: isMobile ? '50%' : '1.25rem',
                backgroundColor: isMobile ? 'transparent' : '#f8fafc',
                border: isMobile ? 'none' : '1px solid #e2e8f0',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: isMobile ? 'none' : '0 2px 4px rgba(0,0,0,0.02)'
              }}
                onMouseOver={e => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.08)';
                  }
                }}
                onMouseOut={e => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                  }
                }}>
                <div style={{
                  width: isMobile ? '36px' : '32px',
                  height: isMobile ? '36px' : '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  fontSize: isMobile ? '1rem' : '0.9rem', fontWeight: '900', border: '2px solid white',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                  flexShrink: 0
                }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                {!isMobile && <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.9rem' }}>{user?.name}</span>}
              </Link>
            ) : (
              <Link to="/login" style={{
                padding: isMobile ? '0.45rem 0.9rem' : '0.65rem 1.4rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                borderRadius: '0.85rem',
                fontWeight: '900',
                fontSize: isMobile ? '0.82rem' : '0.9rem',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'block',
                textDecoration: 'none'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                }}>
                {t("Login", "உள்நுழை")}
              </Link>
            ))}

            {/* Notification bell removed */}
          </nav>
        </div>

      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, bottom: 0,
              width: isSmallMobile ? '85%' : '320px',
              height: '100vh',
              backgroundColor: '#ffffff',
              zIndex: 2000,
              boxShadow: '25px 0 80px rgba(15, 23, 42, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Sidebar Header */}
            <div style={{
              padding: '1.5rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f1f5f9',
              background: 'linear-gradient(to right, #ffffff, #f8fafc)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={logo}
                  alt="Gobi 360 Logo"
                  style={{ height: '50px', objectFit: 'contain' }}
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.6rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  color: '#64748b'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>

              {/* Language Toggle inside Sidebar for Mobile */}
              {!location.pathname.startsWith('/admin-dashboard') && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '1rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569' }}>
                    {language === 'en' ? 'English' : 'தமிழ்'}
                  </span>
                  <div
                    onClick={toggleLanguage}
                    style={{
                      width: '92px', height: '34px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '999px', padding: '3px',
                      cursor: 'pointer', display: 'flex',
                      position: 'relative', alignItems: 'center',
                      border: '1px solid #e2e8f0', userSelect: 'none',
                      overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{
                      position: 'absolute', inset: '3px',
                      display: 'grid', gridTemplateColumns: '1fr 1fr',
                      alignItems: 'center', fontSize: '0.7rem', fontWeight: '800',
                      zIndex: 1, pointerEvents: 'none'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: language === 'en' ? '#ffffff' : '#64748b', transition: 'color 0.3s ease' }}>EN</span>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '2px', color: language === 'ta' ? '#ffffff' : '#64748b', transition: 'color 0.3s ease' }}>தமிழ்</span>
                    </div>
                    <motion.div
                      layout initial={false}
                      animate={{ x: language === 'en' ? 0 : 43 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      style={{
                        width: '43px', height: '26px', borderRadius: '999px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        zIndex: 0, boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                      }}
                    />
                  </div>
                </div>
              )}

              <p style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '0.75rem',
                paddingLeft: '0.75rem'
              }}>{t("Main Menu", "முக்கிய மெனு")}</p>

              {navItems.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: location.pathname === item.path ? '#3b82f6' : '#334155',
                    padding: '0.85rem 1rem',
                    borderRadius: '1rem',
                    backgroundColor: location.pathname === item.path ? '#eff6ff' : 'transparent',
                    transition: 'all 0.2s ease',
                    border: location.pathname === item.path ? '1px solid rgba(59, 130, 246, 0.1)' : '1px solid transparent'
                  }}
                >
                  <item.icon size={20} style={{ opacity: location.pathname === item.path ? 1 : 0.7 }} />
                  {item.name}
                </Link>
              ))}

              {!location.pathname.startsWith('/owner-dashboard') && !location.pathname.startsWith('/expert-dashboard') && !location.pathname.startsWith('/admin-dashboard') && (
                <>
                  <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '1.5rem 0.5rem' }}></div>

                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '0.75rem',
                    paddingLeft: '0.75rem'
                  }}>{t("Account", "கணக்கு")}</p>

                  {isLoggedIn ? (
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '1.05rem',
                        fontWeight: '700',
                        color: '#334155',
                        padding: '0.85rem 1rem',
                        borderRadius: '1rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <User size={20} style={{ opacity: 0.7 }} />
                      {t("My Profile", "எனது சுயவிவரம்")}
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '1.05rem',
                          fontWeight: '700',
                          color: '#3b82f6',
                          padding: '0.85rem 1rem',
                          borderRadius: '1rem',
                          backgroundColor: '#eff6ff',
                          transition: 'all 0.2s ease',
                          marginBottom: '0.5rem'
                        }}
                      >
                        <LogIn size={20} />
                        {t("Login", "உள்நுழை")}
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '1.05rem',
                          fontWeight: '700',
                          color: '#6366f1',
                          padding: '0.85rem 1rem',
                          borderRadius: '1rem',
                          backgroundColor: '#f5f3ff',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <UserPlus size={20} />
                        {t("Sign Up", "பதிவு செய்யவும்")}
                      </Link>
                    </>
                  )}
                </>
              )}

              {/* Logout button for dashboard pages */}
              {(location.pathname.startsWith('/owner-dashboard') || location.pathname.startsWith('/expert-dashboard') || location.pathname.startsWith('/admin-dashboard')) && (
                <>
                  <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '1.5rem 0.5rem' }}></div>
                  <button
                    onClick={() => {
                      if (logout) logout();
                      setMobileMenuOpen(false);
                      window.location.href = '/';
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      color: '#ef4444',
                      padding: '0.85rem 1rem',
                      borderRadius: '1rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <LogOut size={20} />
                    {t('Logout', 'வெளியேறு')}
                  </button>
                </>
              )}
            </div>

            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc'
            }}>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', fontWeight: '600' }}>
                © 2026 Service App. {t("All rights reserved.", "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(10px)',
            zIndex: 1999
          }}
        />
      )}

      {/* ===== GLOBAL MINI CART SIDEBAR ===== */}
      <AnimatePresence>
        {showMiniCart && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMiniCart(false)}
              style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(15,23,42,0.45)',
                backdropFilter: 'blur(4px)',
                zIndex: 9998
              }}
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              style={{
                position: 'fixed', top: 0, right: 0,
                width: '100%', maxWidth: '420px',
                height: '100vh',
                background: 'white',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.15)'
              }}
            >
              {/* Header */}
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShoppingCart size={22} color="#0f172a" />
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Your Cart</h2>
                  <span style={{ background: '#2563eb', color: 'white', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>{cartCount}</span>
                </div>
                <button onClick={() => setShowMiniCart(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#64748b', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              {miniCartItems.length === 0 ? (
                /* Empty State */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#fbfcfd' }}>
                  <div style={{ width: '100px', height: '100px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <ShoppingCart size={48} color="#cbd5e1" />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#475569', fontWeight: 700, margin: '0 0 0.5rem' }}>Your cart is empty.</h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.75rem', textAlign: 'center' }}>Add items from our shop to get started!</p>
                  <button
                    onClick={() => { setShowMiniCart(false); window.location.href = '/services/api-cat-1'; }}
                    style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.85rem 2.5rem', borderRadius: '999px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#1d4ed8'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#2563eb'; }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                /* Items List */
                <>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', background: '#f8fafc' }}>
                    {(() => {
                      const grouped = miniCartItems.reduce((acc, item) => {
                        const sId = item.shopId || item.shop_id || 'default';
                        if (!acc[sId]) acc[sId] = [];
                        acc[sId].push(item);
                        return acc;
                      }, {});

                      return Object.entries(grouped).map(([sId, items]) => (
                        <div key={sId} style={{ background: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '0.75rem' }}>
                          {/* Shop Header */}
                          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                            {items[0]?.shopName || items[0]?.shop_name || 'Sri Bannari Amman'}
                          </h3>

                          {items.map((item, idx) => {
                            const actualIdx = miniCartItems.findIndex(i => i === item);
                            return (
                              <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.85rem', border: '1px solid #f1f5f9', marginBottom: idx < items.length - 1 ? '0.75rem' : '0' }}>
                                {/* Image */}
                                <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                                  {item.image || item.product_image || item.image_url ? (
                                    <img
                                      src={item.image || item.product_image || item.image_url}
                                      alt={item.name || item.product_name || 'Product'}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      onError={e => { e.target.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <ShoppingCart size={24} color="#cbd5e1" />
                                  )}
                                </div>

                                {/* Details */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ margin: '0 0 0.2rem', fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {item.name || item.product_name || `Item #${actualIdx + 1}`}
                                    </h4>
                                    <button
                                      onClick={async () => {
                                        const updated = miniCartItems.filter((_, i) => i !== actualIdx);
                                        setMiniCartItems(updated);
                                        setCartCount(updated.length);
                                        localStorage.setItem('localCart', JSON.stringify(updated));
                                        window.dispatchEvent(new Event('cartUpdated'));

                                        const itemId = item.cart_item_id || item.id;
                                        const u = localStorage.getItem('user');
                                        let userId = null;
                                        if (u && u !== 'undefined') {
                                          try {
                                            const parsed = JSON.parse(u);
                                            userId = parsed?.id || parsed?.user_id;
                                          } catch (e) { }
                                        }

                                        if (itemId) {
                                          apiFetch(ENDPOINTS.cartItem(itemId), {
                                            method: 'DELETE',
                                          }).catch(console.error);
                                        }
                                      }}
                                      style={{
                                        background: '#fff1f2', border: 'none', borderRadius: '50%',
                                        width: '28px', height: '28px', cursor: 'pointer', color: '#f43f5e',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                      }}
                                      title="Delete Item"
                                    >
                                      <Trash2 size={14} color="#f43f5e" />
                                    </button>
                                  </div>

                                  {item.variationName && (
                                    <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600, display: 'inline-block', marginBottom: '0.4rem' }}>{item.variationName}</span>
                                  )}

                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                                    <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a' }}>₹{Number(item.price).toFixed(0)}</span>

                                    {/* Quantity Stepper */}
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2px' }}>
                                      <button
                                        onClick={() => {
                                          const newQty = (item.quantity || 1) - 1;
                                          if (newQty <= 0) {
                                            const updated = miniCartItems.filter((_, i) => i !== actualIdx);
                                            setMiniCartItems(updated);
                                            setCartCount(updated.length);
                                            localStorage.setItem('localCart', JSON.stringify(updated));
                                            window.dispatchEvent(new Event('cartUpdated'));
                                            return;
                                          }
                                          const updated = [...miniCartItems];
                                          updated[actualIdx] = { ...updated[actualIdx], quantity: newQty };
                                          setMiniCartItems(updated);
                                          localStorage.setItem('localCart', JSON.stringify(updated));
                                          window.dispatchEvent(new Event('cartUpdated'));
                                        }}
                                        style={{ width: '26px', height: '26px', background: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontWeight: 800 }}
                                      >-</button>
                                      <span style={{ width: '28px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{item.quantity || 1}</span>
                                      <button
                                        onClick={() => {
                                          const updated = [...miniCartItems];
                                          updated[actualIdx] = { ...updated[actualIdx], quantity: (item.quantity || 1) + 1 };
                                          setMiniCartItems(updated);
                                          localStorage.setItem('localCart', JSON.stringify(updated));
                                          window.dispatchEvent(new Event('cartUpdated'));
                                        }}
                                        style={{ width: '26px', height: '26px', background: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontWeight: 800 }}
                                      >+</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {/* Shop Loyalty Points Block */}
                          {miniCartRewardSetting && (
                            <div style={{ background: 'white', border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '1rem', marginTop: '1rem' }}>
                              <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                  <h4 style={{ margin: '0 0 0.2rem', color: '#1e3a8a', fontSize: '1rem', fontWeight: 800 }}>Shop Loyalty Points</h4>
                                  <p style={{ margin: 0, color: miniCartPoints > 0 ? '#2563eb' : '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Balance: {miniCartPoints} pts</p>
                                </div>
                                <div style={{ background: '#bfdbfe', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Star size={16} fill="#3b82f6" color="#3b82f6" />
                                </div>
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <div style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.6, flex: 1 }}>
                                  <p style={{ margin: '0 0 0.3rem', color: '#0f172a', fontWeight: 700 }}>• {miniCartRewardSetting.message?.earn || `Spend ₹${Number(miniCartRewardSetting.purchase_amount).toFixed(0)} → Earn ${miniCartRewardSetting.reward_points} point${miniCartRewardSetting.reward_points !== 1 ? 's' : ''}.`}</p>
                                  <p style={{ margin: '0 0 0.3rem' }}>• {miniCartRewardSetting.message?.redeem || `Redeem ${miniCartRewardSetting.redeem_points} points = ₹${Number(miniCartRewardSetting.redeem_amount).toFixed(0)} discount.`}</p>
                                  {miniCartPoints === 0 ? (
                                    <p style={{ margin: 0, color: '#f97316', fontWeight: 600 }}>• {miniCartRewardSetting.message?.minimum || 'Purchase to earn your first loyalty points!'}</p>
                                  ) : miniCartPoints < (miniCartRewardSetting.minimum_redeem_points || 10) ? (
                                    <p style={{ margin: 0, color: '#ef4444', fontWeight: 600 }}>• {miniCartRewardSetting.message?.minimum || `Need ${(miniCartRewardSetting.minimum_redeem_points || 10) - miniCartPoints} more points to redeem (spend ₹${Math.ceil((((miniCartRewardSetting.minimum_redeem_points || 10) - miniCartPoints) / (miniCartRewardSetting.reward_points || 1)) * (miniCartRewardSetting.purchase_amount || 100))} more).`}</p>
                                  ) : (
                                    <p style={{ margin: 0, color: '#16a34a', fontWeight: 600 }}>• You have enough points to redeem!</p>
                                  )}
                                </div>
                                {miniCartPoints > 0 && miniCartPoints >= (miniCartRewardSetting.minimum_redeem_points || 10) && (
                                  <div style={{ flexShrink: 0, marginLeft: 'auto', alignSelf: 'center' }}>
                                    <button
                                      onClick={() => setApplyMiniCartPoints(prev => !prev)}
                                      style={{
                                        background: applyMiniCartPoints ? '#ef4444' : '#2563eb',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.45rem 0.9rem',
                                        borderRadius: '0.5rem',
                                        fontWeight: 800,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {applyMiniCartPoints ? 'REMOVE' : 'APPLY'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Footer matching full cart UI */}
                  <div style={{ padding: '1rem 1.25rem 1.5rem', background: 'white', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'flex-end', color: '#64748b' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>Subtotal</span>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>₹{miniCartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                      <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#0f172a' }}>Total</span>
                      <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                        ₹{miniCartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0).toFixed(2)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem', fontWeight: 500 }}>Taxes and shipping calculated at checkout.</p>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => {
                          setShowMiniCart(false);
                          const shopId = miniCartItems[0]?.shopId || miniCartItems[0]?.shop_id;
                          window.location.href = shopId ? `/services/api-cat-1?shop=${shopId}#cart` : '/services/api-cat-1#cart';
                        }}
                        style={{ flex: 1, background: '#f1f5f9', color: '#334155', padding: '0.85rem 0.5rem', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
                      >
                        View Cart
                      </button>
                      <button
                        onClick={() => {
                          setShowMiniCart(false);
                          const shopId = miniCartItems[0]?.shopId || miniCartItems[0]?.shop_id;
                          const targetUrl = shopId
                            ? `/services/api-cat-1?shop=${shopId}#checkout`
                            : '/services/api-cat-1#checkout';
                          // If already on the shop page, fire event to open checkout directly
                          if (window.location.pathname === '/services/api-cat-1') {
                            window.dispatchEvent(new CustomEvent('triggerCheckout'));
                            window.history.replaceState(null, '', window.location.pathname + window.location.search);
                          } else {
                            window.location.href = targetUrl;
                          }
                        }}
                        style={{ flex: 1.5, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '0.85rem 0.5rem', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 8px 20px rgba(37,99,235,0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        Checkout <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
