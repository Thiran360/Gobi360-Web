import React, { useState, useEffect, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Phone, MessageCircle, User, ShieldCheck, Zap, Warehouse, Layout, Home, Building2, Calendar, Clock, Droplet, Camera, Heart, ShoppingCart, X, Receipt, Store, CheckCircle2 } from 'lucide-react';
import { services } from '../data/servicesData';
import { useLanguage } from '../context/LanguageContext';
import FoodDeliveryApp from '../components/FoodDelivery/FoodDeliveryApp';
import SupermarketApp from '../components/Supermarket/SupermarketApp';
import DynamicCategoryApp from '../components/DynamicCategory/DynamicCategoryApp';
import { useAuth } from '../context/AuthContext';
import { ENDPOINTS, apiJson } from '../lib/api';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const initialService = services.find(s => s.id === id);
  const [apiData, setApiData] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [apiShops, setApiShops] = useState([]);
  const [apiProductCategories, setApiProductCategories] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [apiServicesData, setApiServicesData] = useState(null);
  const [singleApiExpert, setSingleApiExpert] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const hasFetched = useRef(false);

  const handleCallTracking = async (serviceObj) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const realExpert = apiData.find(a =>
      a.contact_number === serviceObj.phone || a.expert_name === serviceObj.person
    );
    const resolvedExpertId = realExpert?.id || 4;

    let finalServiceId = parseInt(initialService?.id, 10);
    if (isNaN(finalServiceId)) finalServiceId = 39;

    try {
      await fetch('https://api.codingboss.in/gobi360/call-request/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: parseInt(user?.id || 3, 10),
          expert: parseInt(resolvedExpertId, 10) || 4,
          service: finalServiceId,
          status: 'not_answered'
        })
      });
    } catch (e) {
      console.error('Call tracking error:', e);
    }
    window.location.href = `tel:${serviceObj.phone}`;
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch('https://api.codingboss.in/gobi360/experts/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setApiData(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/categories/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setApiCategories(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/product-categories/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setApiProductCategories(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/products/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setApiProducts(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (id && id.startsWith('api-cat-')) {
      fetch('https://api.codingboss.in/gobi360/shops/', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => res.json())
        .then(data => setApiShops(Array.isArray(data) ? data : data.results || []))
        .catch(err => console.error(err));
    } else if (id && id.startsWith('api-')) {
      const matchedId = id.replace('api-', '');
      setIsApiLoading(true);
      const headers = { 'ngrok-skip-browser-warning': 'true' };
      Promise.all([
        fetch(`https://api.codingboss.in/gobi360/experts/${matchedId}/`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`https://api.codingboss.in/gobi360/experts/${matchedId}/services/`, { headers }).then(r => r.ok ? r.json() : []).catch(() => [])
      ]).then(([expertData, servicesData]) => {
        if (expertData) {
          setSingleApiExpert(expertData);
        }
        setApiServicesData(Array.isArray(servicesData) ? servicesData : servicesData.results || servicesData.services || []);
        setIsApiLoading(false);
      }).catch(() => setIsApiLoading(false));
    }
  }, [id]);

  const service = React.useMemo(() => {
    const staticService = services.find(s => s.id === id || s.id === Number(id));
    if (staticService) return staticService;

    if (id && id.startsWith('api-cat-')) {
      // Data fetching is now handled by DynamicCategoryApp.
      // We just need a placeholder service so the rest of the file doesn't crash if it bypasses the early return.
      return { id };
    }

    if (id && id.startsWith('api-')) {
      const matchedId = id.replace('api-', '');
      const apiService = singleApiExpert || apiData.find(e => String(e.id) === matchedId);

      if (apiService) {
        const servicesArray = (Array.isArray(apiServicesData) ? apiServicesData : (apiServicesData && apiServicesData.services)) || apiService.services || [];
        return {
          id: `api-${apiService.id}`,
          company: apiService.expert_name,
          companyTa: apiService.expert_name_ta || apiService.expert_name,
          tag: apiService.badge || 'EXPERT',
          tagTa: apiService.badge_ta || apiService.badge || 'நிபுணர்',
          desc: apiService.category,
          descTa: apiService.category_ta || apiService.category,
          image: apiService.expert_image,
          accent: '#3b82f6',
          phone: apiService.contact_number,
          features: servicesArray.map(s => ({
            title: s.service_name,
            titleTa: s.service_name_ta || s.service_name,
            desc: s.short_description,
            descTa: s.short_description_ta || s.short_description,
            techAnalysis: s.long_description,
            image: s.service_image
          }))
        };
      }
    }
    return null;
  }, [id, apiData, singleApiExpert, apiServicesData]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState('services');
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedProductCategoryId, setSelectedProductCategoryId] = useState(null);

  const [showBillModal, setShowBillModal] = useState(false);
  const [userBills, setUserBills] = useState([]);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [rewardSettings, setRewardSettings] = useState(null);
  const [pointsInput, setPointsInput] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchRewardSettings = async () => {
      if (service && service.id && String(service.id).startsWith('api-') && !String(service.id).startsWith('api-cat-')) {
        const rateRupees = Number(localStorage.getItem('rateRupees')) || 100;
        const ratePoints = Number(localStorage.getItem('ratePoints')) || 2;
        setRewardSettings({
          purchase_amount: rateRupees,
          reward_points: ratePoints,
          redeem_points: Number(localStorage.getItem('redeemPoints')) || 10,
          redeem_amount: Number(localStorage.getItem('redeemAmount')) || 1,
          minimum_redeem_points: Number(localStorage.getItem('minRedeemPoints')) || 50,
        });
      }
    };
    fetchRewardSettings();
  }, [service]);

  const handleApplyPoints = async (billId, pointsToApply) => {
    try {
      const pointsToRedeem = pointsToApply > 0 ? pointsToApply : 10;
      setUserBills(prevBills => prevBills.map(b => b.id === billId ? {
        ...b,
        amount: Math.max(0, Number(b.amount) - pointsToRedeem),
        redeemedPoints: (Number(b.redeemedPoints) || 0) + pointsToRedeem,
        redeemDiscount: pointsToRedeem.toFixed(2),
        isPointsApplied: true
      } : b));

      setToastMessage('Points redeemed successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('Error applying points:', err);
    }
  };

  useEffect(() => {
    if (showBillModal) {
      setAvailablePoints(0);
    }
  }, [showBillModal, service]);

  useEffect(() => {
    const fetchUserBills = async () => {
      try {
        const loggedInUserStr = localStorage.getItem('user');
        if (loggedInUserStr && loggedInUserStr !== 'undefined') {
          const loggedInUser = JSON.parse(loggedInUserStr);

          if (loggedInUser.id) {
            const data = await apiJson(ENDPOINTS.customerServiceOrders(loggedInUser.id));

            if (data?.status === true && data.service_orders) {
              let apiBills = data.service_orders.map(req => ({
                id: req.id,
                serviceType: req.service?.service_name || 'Expert Service',
                description: req.service?.short_description || 'Service',
                serviceImage: req.service?.service_image || null,
                amount: req.final_amount || req.quotation_amount || req.amount || '0',
                status: req.status || 'pending',
                paymentStatus: req.payment_status || 'unpaid',
                date: req.created_at || new Date().toISOString(),
                completedAt: req.completed_at || null,
                expertName: req.expert?.expert_name || req.expert?.full_name || req.expert?.name || 'Expert',
                expertImage: req.expert?.expert_image || null,
                customerName: req.customer?.full_name || req.customer?.name || loggedInUser.name,
                earnedPoints: (req.earned_points !== undefined && req.earned_points !== null) ? Number(req.earned_points) : Number(req.points || 0),
                redeemedPoints: req.redeemed_points || 0,
                redeemDiscount: req.redeem_discount || '0.00'
              }));

              // Sort newest first
              apiBills = apiBills.sort((a, b) => new Date(b.date) - new Date(a.date));

              // Only show bills from the CURRENT expert page being viewed
              if (service?.company) {
                apiBills = apiBills.filter(bill => bill.expertName === service.company);
              }

              setUserBills(apiBills);
              return; // Success, we don't need to fallback to local storage
            }
          }

          // Fallback to local storage if API fails or user doesn't have an ID
          const allBills = JSON.parse(localStorage.getItem('expertServiceBills') || '[]');
          let myBills = allBills.filter(bill => bill.mobile === loggedInUser.phone || bill.mobile === loggedInUser.mobile);

          // Only show bills from the CURRENT expert page being viewed
          if (service?.company) {
            myBills = myBills.filter(bill => bill.expertName === service.company);
          }

          setUserBills(myBills);
        }
      } catch (err) {
        console.error("Failed to fetch bills:", err);
      }
    };

    fetchUserBills();
  }, [id, showBillModal, service]);


  useEffect(() => {
    if (service) {
      if (service.steelCement) setActiveTab('steelCement');
      else if (service.electricalServices) setActiveTab('electricalServices');
      else if (service.insurance) setActiveTab('insurance');
      else if (service.waterRO) setActiveTab('waterRO');
      else if (service.studioPortrait) setActiveTab('studioPortrait');
      else if (service.models) setActiveTab('models');
      else setActiveTab('services');
    }
  }, [id, service]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 425;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (id === 'food-delivery-express') {
    return <FoodDeliveryApp />;
  }

  if (id === 'supermarket') {
    return <SupermarketApp />;
  }

  if (id && id.startsWith('api-cat-')) {
    const catId = Number(id.replace('api-cat-', ''));
    const searchParams = new URLSearchParams(location.search);
    const shopIdStr = searchParams.get('shop');
    const shopId = shopIdStr ? Number(shopIdStr) : null;

    return <DynamicCategoryApp categoryId={catId} initialShopId={shopId} onBack={() => navigate(`/services#service-card-api-cat-${catId}`)} />;
  }

  if (isApiLoading && id && id.startsWith('api-') && !id.startsWith('api-cat-')) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{t("Service not found", "சேவை கிடைக்கவில்லை")}</h2>
        <button
          onClick={() => navigate('/services')}
          style={{ marginTop: '1.5rem', color: '#3b82f6', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          {t("Back to Services", "சேவைகளுக்குத் திரும்பு")}
        </button>
      </div>
    );
  }

  // Icons for Skyline sub-features
  const skylineIcons = [Warehouse, Layout, Home, Building2];

  return (
    <main style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '5rem', position: 'relative' }}>


      {toastMessage && (() => {
        const isError = toastMessage.toLowerCase().startsWith('error') || toastMessage.toLowerCase().includes('failed') || toastMessage.toLowerCase().includes('network');
        const accentColor = isError ? '#ef4444' : '#10b981';
        const bgColor = isError ? '#fff5f5' : '#f0fdf4';
        const subColor = isError ? '#b91c1c' : '#166634';
        return (
          <div style={{
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
            fontFamily: "'Inter', system-ui, sans-serif",
            animation: 'slideDown 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards'
          }}>
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
          </div>
        );
      })()}



      {/* Hero Section */}
      <section style={{ position: 'relative', height: isMobile ? '350px' : '450px', overflow: 'hidden' }}>
        <img
          src={service.image}
          alt={language === 'en' ? service.company : service.companyTa}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%)'
        }} />

        {/* Service name overlay — directly on hero image */}
        <div style={{
          position: 'absolute',
          top: '35%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          zIndex: 20,
          padding: '0 1rem',
          pointerEvents: 'none'
        }}>
          <h1 style={{
            fontSize: isMobile ? '2rem' : '3rem',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '-1px',
            lineHeight: 1.2,
            textShadow: '0 4px 24px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.9)'
          }}>
            {language === 'en' ? service.company : (service.companyTa || service.company)}
          </h1>
        </div>

        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: isMobile ? '2.5rem' : '4rem', zIndex: 10 }}>

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/services')}
            style={{
              position: 'absolute', top: isMobile ? '1.5rem' : '2.5rem', left: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none',
              padding: isMobile ? '0.5rem 1rem' : '0.7rem 1.4rem', borderRadius: '9999px', display: 'flex',
              alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '800',
              fontSize: '0.8rem', color: '#0f172a', boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <ArrowLeft size={18} /> {t("Back to Services", "சேவைகளுக்குத் திரும்பு")}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              backgroundColor: service.accent, color: 'white',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '0.4rem 1rem', borderRadius: '9999px',
              fontSize: '0.75rem', fontWeight: '900', marginBottom: '1rem',
              letterSpacing: '1px', textTransform: 'uppercase',
              boxShadow: `0 4px 15px ${service.accent}40`
            }}>
              <Star size={12} fill="white" /> {language === 'en' ? service.tag : service.tagTa}
            </div>
            <h1 style={{ fontSize: isMobile ? '2.25rem' : '3.5rem', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '0.75rem', letterSpacing: '-1px' }}>
              {language === 'en' ? service.company : service.companyTa}
            </h1>
            <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#cbd5e1', fontWeight: '600', maxWidth: '700px', lineHeight: '1.5' }}>
              {language === 'en' ? service.desc : service.descTa}
            </p>
          </motion.div>
        </div>

      </section>

      <div className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 400px', gap: '2rem' }}>

          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.5rem' : '2.5rem' }}>


            {/* Features Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ textAlign: 'center', padding: '2rem 1rem 0' }}
              >
                <span style={{ color: service.accent, fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{t("Expertise", "நிபுணத்துவம்")}</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginTop: '0.5rem', letterSpacing: '-1px' }}>{t("Core Features & Solutions", "முக்கிய அம்சங்கள் மற்றும் தீர்வுகள்")}</h2>
              </motion.div>

              {/* Toggle for Models/Services if applicable */}
              {service.models && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '9999px', padding: '0.4rem', gap: '0.5rem' }}>
                    <button
                      onClick={() => setActiveTab('models')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'models' ? '#dc2626' : 'transparent',
                        color: activeTab === 'models' ? 'white' : '#64748b',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Warehouse size={18} /> {t("Models", "மாடல்கள்")}
                    </button>
                    <button
                      onClick={() => setActiveTab('services')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'services' ? 'white' : 'transparent',
                        color: activeTab === 'services' ? '#1e293b' : '#64748b',
                        boxShadow: activeTab === 'services' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Zap size={18} /> {t("Services", "சேவைகள்")}
                    </button>
                  </div>
                </div>
              )}

              {service.insurance && service.enrichment && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '9999px', padding: '0.4rem', gap: '0.5rem' }}>
                    <button
                      onClick={() => setActiveTab('insurance')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'insurance' ? '#0f766e' : 'transparent',
                        color: activeTab === 'insurance' ? 'white' : '#64748b',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <ShieldCheck size={18} /> {t("Insurance", "காப்பீடு")}
                    </button>
                    <button
                      onClick={() => setActiveTab('enrichment')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'enrichment' ? 'white' : 'transparent',
                        color: activeTab === 'enrichment' ? '#1e293b' : '#64748b',
                        boxShadow: activeTab === 'enrichment' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <User size={18} /> {t("Enrichment", "திறன் மேம்பாடு")}
                    </button>
                  </div>
                </div>
              )}

              {service.waterRO && service.solarPower && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '9999px', padding: '0.4rem', gap: '0.5rem' }}>
                    <button
                      onClick={() => setActiveTab('waterRO')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'waterRO' ? '#2563eb' : 'transparent',
                        color: activeTab === 'waterRO' ? 'white' : '#64748b',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Droplet size={18} /> {t("Water R.O", "நீர் ஆர்.ஓ")}
                    </button>
                    <button
                      onClick={() => setActiveTab('solarPower')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'solarPower' ? 'white' : 'transparent',
                        color: activeTab === 'solarPower' ? '#1e293b' : '#64748b',
                        boxShadow: activeTab === 'solarPower' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Zap size={18} /> {t("Solar & Power", "சோலார் & பவர்")}
                    </button>
                  </div>
                </div>
              )}

              {/* Studio & Portrait / Wedding & Outdoor toggle */}
              {service.studioPortrait && service.weddingOutdoor && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '9999px', padding: '0.4rem', gap: '0.5rem' }}>
                    <button
                      onClick={() => setActiveTab('studioPortrait')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'studioPortrait' ? '#db2777' : 'transparent',
                        color: activeTab === 'studioPortrait' ? 'white' : '#64748b',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Camera size={18} /> {t("Studio & Portrait", "ஸ்டுடியோ & உருவப்படம்")}
                    </button>
                    <button
                      onClick={() => setActiveTab('weddingOutdoor')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'weddingOutdoor' ? 'white' : 'transparent',
                        color: activeTab === 'weddingOutdoor' ? '#1e293b' : '#64748b',
                        boxShadow: activeTab === 'weddingOutdoor' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Heart size={18} /> {t("Weddings & Outdoor", "திருமணம் & வெளிப்புறம்")}
                    </button>
                  </div>
                </div>
              )}

              {/* Steel & Cement / Aggregates & Blocks toggle for Monoj Steels */}
              {service.steelCement && service.aggregatesBlocks && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '9999px', padding: '0.4rem', gap: '0.5rem' }}>
                    <button
                      onClick={() => setActiveTab('steelCement')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'steelCement' ? '#dc2626' : 'transparent',
                        color: activeTab === 'steelCement' ? 'white' : '#64748b',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Warehouse size={18} /> {t("Steel & Cement", "இரும்பு & சிமெண்ட்")}
                    </button>
                    <button
                      onClick={() => setActiveTab('aggregatesBlocks')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'aggregatesBlocks' ? '#dc2626' : 'transparent',
                        color: activeTab === 'aggregatesBlocks' ? 'white' : '#64748b',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Layout size={18} /> {t("Aggregates & Blocks", "ஜல்லி & கற்கள்")}
                    </button>
                  </div>
                </div>
              )}

              {/* Electrical / Electronics toggle for Sri Sakthi */}
              {service.electricalServices && service.electronicsRepair && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '9999px', padding: '0.4rem', gap: '0.5rem' }}>
                    <button
                      onClick={() => setActiveTab('electricalServices')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'electricalServices' ? '#0ea5e9' : 'transparent',
                        color: activeTab === 'electricalServices' ? 'white' : '#64748b',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Zap size={18} /> {t("Electrical Services", "மின்சார சேவைகள்")}
                    </button>
                    <button
                      onClick={() => setActiveTab('electronicsRepair')}
                      style={{
                        padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                        fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: activeTab === 'electronicsRepair' ? '#0ea5e9' : 'transparent',
                        color: activeTab === 'electronicsRepair' ? 'white' : '#64748b',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Layout size={18} /> {t("Electronics Repair", "எலக்ட்ரானிக்ஸ் பழுதுபார்ப்பு")}
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Header for Monoj Steels depending on activeTab */}
              {id === 'monoj-steels' && (
                <div style={{ textAlign: 'left', marginBottom: '1rem', marginTop: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
                    {activeTab === 'steelCement' ? t("Cement & TMT Steel Supply", "சிமெண்ட் & டிஎம்டி எஃகு விநியோகம்") : t("Aggregates & Building Blocks", "ஜல்லி & கட்டிடக் கற்கள்")}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '600' }}>
                    {activeTab === 'steelCement'
                      ? t("IS-certified reinforcement TMT steel bars and high-grade cement for solid foundations.", "உறுதியான அடித்தளங்களுக்கான IS-சான்றளிக்கப்பட்ட டிஎம்டி கம்பிகள் மற்றும் உயர்தர சிமெண்ட்.")
                      : t("Premium blue metal, M-Sand, P-Sand and concrete blocks for quality construction.", "தரமான கட்டுமானத்திற்கான பிரீமியம் ப்ளூ மெட்டல், எம்-சாண்ட், பி-சாண்ட் மற்றும் கான்கிரீட் கற்கள்.")}
                  </p>
                </div>
              )}

              {/* Dynamic Header for Sri Sakthi depending on activeTab */}
              {id === 'sri-sakthi-electrical' && (
                <div style={{ textAlign: 'left', marginBottom: '1rem', marginTop: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
                    {activeTab === 'electricalServices' ? t("Electrical Installation & Repairs", "மின் நிறுவல் மற்றும் பழுதுபார்ப்பு") : t("Electronics & Appliance Repairs", "எலக்ட்ரானிக்ஸ் மற்றும் உபகரணங்கள் பழுதுபார்ப்பு")}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '600' }}>
                    {activeTab === 'electricalServices'
                      ? t("Professional electrical solutions for residential and commercial needs.", "குடியிருப்பு மற்றும் வணிக தேவைகளுக்கான தொழில்முறை மின் தீர்வுகள்.")
                      : t("Expert diagnostics and component-level repairs for all your electronics.", "உங்கள் அனைத்து எலக்ட்ரானிக்ஸ் சாதனங்களுக்கும் நிபுணத்துவ பழுதுபார்ப்பு சேவைகள்.")}
                  </p>
                </div>
              )}

              {/* Dynamic Header for Sun Power depending on activeTab */}
              {id === 'sun-power' && (
                <div style={{ textAlign: 'left', marginBottom: '1rem', marginTop: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    {t("Our Products & Solutions", "எங்கள் தயாரிப்புகள் மற்றும் தீர்வுகள்")}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '600' }}>
                    {t("Comprehensive solar, R.O water purification, and power backup solutions for homes and businesses.", "வீடுகள் மற்றும் வணிகங்களுக்கான விரிவான சோலார், ஆர்.ஓ நீர் சுத்திகரிப்பு மற்றும் பவர் பேக்கப் தீர்வுகள்.")}
                  </p>
                </div>
              )}

              {/* Dynamic Feature Rendering */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>

                {(!service.models && !service.insurance && !service.waterRO && !service.studioPortrait) || activeTab === 'services' ? service.features.map((feature, idx) => {
                  const IconComp = (id === 'skyline-builders' || id === 'baas-tech') && skylineIcons[idx] ? skylineIcons[idx] : Zap;

                  return (
                    <motion.div
                      key={idx}
                      onClick={() => feature.id ? setSelectedShopId(selectedShopId === feature.id ? null : feature.id) : null}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.1) }}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '2.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                        border: '1px solid #e2e8f0',
                        cursor: feature.id ? 'pointer' : 'default'
                      }}
                    >
                      {/* Image at top if available */}
                      {feature.image && (
                        <div style={{ height: '220px', overflow: 'hidden' }}>
                          <img
                            src={feature.image}
                            alt={language === 'en' ? feature.title : feature.titleTa}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      <div style={{ padding: '2rem' }}>
                        {/* Title with Icon Block */}
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <div style={{
                            width: '56px', height: '56px', borderRadius: '1rem',
                            backgroundColor: feature.iconBg || '#f1f5f9', display: 'flex', flexShrink: 0,
                            alignItems: 'center', justifyContent: 'center'
                          }}>
                            {feature.icon ? <feature.icon size={24} color={feature.iconColor || service.accent} /> : id === 'skyline-builders' ? <IconComp size={24} color="#1e293b" /> : <Zap size={24} color={service.accent} />}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.2rem' }}>
                              {language === 'en' ? feature.title : feature.titleTa}
                            </h3>
                            {feature.subLabel && (
                              <p style={{ fontSize: '0.85rem', fontWeight: '800', color: feature.subLabelColor || '#3b82f6', textTransform: 'uppercase' }}>
                                {language === 'en' ? feature.subLabel : feature.subLabelTa}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p style={{ color: '#64748b', fontSize: '0.98rem', lineHeight: '1.6', fontWeight: '600', marginBottom: '2rem' }}>
                          {language === 'en' ? feature.desc : feature.descTa}
                        </p>

                        {/* Technical Analysis Box (Styled like the request) */}
                        {feature.techAnalysis && (
                          <div style={{
                            backgroundColor: feature.techBg || '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: '1.5rem',
                            borderLeft: `5px solid ${feature.techColor || service.accent}`,
                            position: 'relative',
                            marginBottom: feature.id && selectedShopId === feature.id ? '1.5rem' : '0'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                              {feature.techIcon ? <feature.techIcon size={18} color={feature.techColor || "#1e293b"} /> : <ShieldCheck size={18} color="#1e293b" />}
                              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: feature.techColor || '#1e293b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {feature.techTitle ? (language === 'en' ? feature.techTitle : feature.techTitleTa) : t("Technical Analysis", "தொழில்நுட்ப பகுப்பாய்வு")}
                              </span>
                            </div>
                            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.5', fontWeight: '600' }}>
                              {feature.techAnalysis}
                            </p>
                          </div>
                        )}

                        {/* Product Categories Section */}
                        {feature.id && selectedShopId === feature.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}
                          >
                            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
                              {t("Product Categories", "பொருள் பிரிவுகள்")}
                            </h4>
                            {apiProductCategories.filter(pc => pc.shop === feature.id || pc.shop_id === feature.id).length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {apiProductCategories.filter(pc => pc.shop === feature.id || pc.shop_id === feature.id).map(pc => (
                                  <div key={pc.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div
                                      onClick={(e) => { e.stopPropagation(); setSelectedProductCategoryId(selectedProductCategoryId === pc.id ? null : pc.id); }}
                                      style={{
                                        padding: '0.75rem 1.25rem', background: selectedProductCategoryId === pc.id ? '#3b82f6' : 'white',
                                        border: '1px solid #cbd5e1', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: '700',
                                        color: selectedProductCategoryId === pc.id ? 'white' : '#334155', cursor: 'pointer', transition: 'all 0.2s ease',
                                        boxShadow: selectedProductCategoryId === pc.id ? '0 4px 12px rgba(59,130,246,0.3)' : '0 2px 4px rgba(0,0,0,0.02)'
                                      }}
                                    >
                                      {pc.name || pc.category_name}
                                    </div>

                                    {selectedProductCategoryId === pc.id && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        style={{ marginTop: '0.5rem', padding: '1rem', background: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                                      >
                                        <h5 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.75rem', color: '#1e293b' }}>{t("Products", "பொருட்கள்")}</h5>
                                        {apiProducts.filter(p => p.category === pc.id || p.category_id === pc.id || p.product_category === pc.id).length > 0 ? (
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                            {apiProducts.filter(p => p.category === pc.id || p.category_id === pc.id || p.product_category === pc.id).map(p => (
                                              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
                                                {p.image_url || p.product_image ? (
                                                  <img src={p.image_url || p.product_image} alt={p.name || p.product_name} style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
                                                ) : (
                                                  <div style={{ width: '48px', height: '48px', background: '#e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Zap size={20} color="#94a3b8" />
                                                  </div>
                                                )}
                                                <div>
                                                  <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '2px' }}>{p.name || p.product_name}</p>
                                                  <p style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10b981' }}>₹{p.price || p.product_price || 0}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>{t("No products found in this category.", "இந்த பிரிவில் எந்த பொருட்களும் கிடைக்கவில்லை.")}</p>
                                        )}
                                      </motion.div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                {t("No product categories available yet.", "பொருள் பிரிவுகள் இன்னும் கிடைக்கவில்லை.")}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                }) : null}
                {service.steelCement && activeTab === 'steelCement' && service.steelCement.map((item, idx) => (
                  <motion.div
                    key={`steel-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '2rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      border: '1px solid #e2e8f0',
                      display: 'flex', flexDirection: 'column'
                    }}
                  >
                    {item.image && (
                      <div style={{ height: '220px', overflow: 'hidden' }}>
                        <img src={item.image} alt={language === 'en' ? item.title : item.titleTa} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '1rem',
                          backgroundColor: '#fef2f2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <Warehouse size={24} color="#dc2626" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b' }}>
                            {language === 'en' ? item.title : item.titleTa}
                          </h3>
                        </div>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '600', marginBottom: '1.5rem' }}>
                        {language === 'en' ? item.desc : item.descTa}
                      </p>
                      {item.techAnalysis && (
                        <div style={{
                          backgroundColor: '#f8fafc',
                          padding: '1.5rem',
                          borderRadius: '1.5rem',
                          borderLeft: '4px solid #dc2626',
                          marginTop: 'auto'
                        }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                            {t("MATERIAL SPECIFICATIONS", "பொருள் விவரக்குறிப்புகள்")}
                          </div>
                          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '600' }}>
                            {item.techAnalysis}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {service.aggregatesBlocks && activeTab === 'aggregatesBlocks' && service.aggregatesBlocks.map((item, idx) => (
                  <motion.div
                    key={`agg-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '2rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      border: '1px solid #e2e8f0',
                      display: 'flex', flexDirection: 'column'
                    }}
                  >
                    {item.image && (
                      <div style={{ height: '220px', overflow: 'hidden' }}>
                        <img src={item.image} alt={language === 'en' ? item.title : item.titleTa} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '1rem',
                          backgroundColor: '#fef2f2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <Layout size={24} color="#dc2626" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b' }}>
                            {language === 'en' ? item.title : item.titleTa}
                          </h3>
                        </div>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '600', marginBottom: '1.5rem' }}>
                        {language === 'en' ? item.desc : item.descTa}
                      </p>
                      {item.techAnalysis && (
                        <div style={{
                          backgroundColor: '#f8fafc',
                          padding: '1.5rem',
                          borderRadius: '1.5rem',
                          borderLeft: '4px solid #dc2626',
                          marginTop: 'auto'
                        }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                            {t("MATERIAL SPECIFICATIONS", "பொருள் விவரக்குறிப்புகள்")}
                          </div>
                          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '600' }}>
                            {item.techAnalysis}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {service.electricalServices && activeTab === 'electricalServices' && service.electricalServices.map((item, idx) => (
                  <motion.div
                    key={`elec-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '2rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      border: '1px solid #e2e8f0',
                      display: 'flex', flexDirection: 'column'
                    }}
                  >
                    {item.image && (
                      <div style={{ height: '220px', overflow: 'hidden' }}>
                        <img src={item.image} alt={language === 'en' ? item.title : item.titleTa} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '1rem',
                          backgroundColor: '#f0f9ff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <Zap size={24} color="#0ea5e9" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b' }}>
                            {language === 'en' ? item.title : item.titleTa}
                          </h3>
                        </div>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '600', marginBottom: '1.5rem' }}>
                        {language === 'en' ? item.desc : item.descTa}
                      </p>
                      {item.techAnalysis && (
                        <div style={{
                          backgroundColor: '#f8fafc',
                          padding: '1.5rem',
                          borderRadius: '1.5rem',
                          borderLeft: '4px solid #0ea5e9',
                          marginTop: 'auto'
                        }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                            {t("TECHNICAL DIAGNOSTICS", "தொழில்நுட்ப பகுப்பாய்வு")}
                          </div>
                          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '600' }}>
                            {item.techAnalysis}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {service.electronicsRepair && activeTab === 'electronicsRepair' && service.electronicsRepair.map((item, idx) => (
                  <motion.div
                    key={`electro-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '2rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      border: '1px solid #e2e8f0',
                      display: 'flex', flexDirection: 'column'
                    }}
                  >
                    {item.image && (
                      <div style={{ height: '220px', overflow: 'hidden' }}>
                        <img src={item.image} alt={language === 'en' ? item.title : item.titleTa} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '1rem',
                          backgroundColor: '#f0f9ff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <Layout size={24} color="#0ea5e9" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b' }}>
                            {language === 'en' ? item.title : item.titleTa}
                          </h3>
                        </div>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '600', marginBottom: '1.5rem' }}>
                        {language === 'en' ? item.desc : item.descTa}
                      </p>
                      {item.techAnalysis && (
                        <div style={{
                          backgroundColor: '#f8fafc',
                          padding: '1.5rem',
                          borderRadius: '1.5rem',
                          borderLeft: '4px solid #0ea5e9',
                          marginTop: 'auto'
                        }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                            {t("TECHNICAL DIAGNOSTICS", "தொழில்நுட்ப பகுப்பாய்வு")}
                          </div>
                          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '600' }}>
                            {item.techAnalysis}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {service.models && activeTab === 'models' && service.models.map((model, idx) => (
                  <motion.div
                    key={`model-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '2rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      border: '1px solid #e2e8f0',
                      display: 'flex', flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '220px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                      <img
                        src={model.image}
                        alt={model.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.4rem' }}>
                        {model.name}
                      </h3>
                      <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                        <span style={{ color: '#dc2626', fontWeight: '900' }}>{model.hp}</span> {model.tagline}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {service.insurance && (activeTab === 'insurance' || activeTab === 'enrichment') && (activeTab === 'insurance' ? service.insurance : service.enrichment).map((item, idx) => (
                  <motion.div
                    key={`ins-enr-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '2rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      border: '1px solid #e2e8f0',
                      display: 'flex', flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '220px', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={language === 'en' ? item.title : item.titleTa}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '1rem',
                          backgroundColor: activeTab === 'insurance' ? '#ccfbf1' : '#f3e8ff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {activeTab === 'insurance' ? <ShieldCheck size={24} color="#0f766e" /> : <User size={24} color="#7e22ce" />}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b' }}>
                            {language === 'en' ? item.title : item.titleTa}
                          </h3>
                          {item.subLabel && (
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                              {item.subLabel.split('&').map((badge, i) => (
                                <span key={i} style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.7rem', color: '#475569', fontWeight: '800' }}>
                                  {badge.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '600', marginBottom: '1.5rem' }}>
                        {language === 'en' ? item.desc : item.descTa}
                      </p>

                      <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '1.5rem',
                        borderLeft: `4px solid ${activeTab === 'insurance' ? '#0f766e' : '#7e22ce'}`,
                        marginTop: 'auto'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                          {t("SERVICE SPECIFICATIONS", "சேவை விவரக்குறிப்புகள்")}
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '600' }}>
                          {item.techAnalysis}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {service.waterRO && (activeTab === 'waterRO' || activeTab === 'solarPower') && (activeTab === 'waterRO' ? service.waterRO : service.solarPower).map((item, idx) => (
                  <motion.div
                    key={`water-solar-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '2rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      border: '1px solid #e2e8f0',
                      display: 'flex', flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '220px', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={language === 'en' ? item.title : item.titleTa}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '1rem',
                          backgroundColor: activeTab === 'waterRO' ? '#eff6ff' : '#fffbeb',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {activeTab === 'waterRO' ? <Droplet size={24} color="#2563eb" /> : <Zap size={24} color="#f59e0b" />}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b' }}>
                            {language === 'en' ? item.title : item.titleTa}
                          </h3>
                        </div>
                      </div>

                      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '600', marginBottom: '1.5rem' }}>
                        {language === 'en' ? item.desc : item.descTa}
                      </p>

                      <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '1.5rem',
                        borderLeft: `4px solid ${activeTab === 'waterRO' ? '#2563eb' : '#f59e0b'}`,
                        marginTop: 'auto'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                          {t("PRODUCT SPECIFICATIONS", "தயாரிப்பு விவரக்குறிப்புகள்")}
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '600' }}>
                          {item.techAnalysis}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {service.studioPortrait && (activeTab === 'studioPortrait' || activeTab === 'weddingOutdoor') && (activeTab === 'studioPortrait' ? service.studioPortrait : service.weddingOutdoor).map((item, idx) => (
                  <motion.div
                    key={`studio-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '2rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      border: '1px solid #e2e8f0',
                      display: 'flex', flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '220px', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={language === 'en' ? item.title : item.titleTa}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '1rem',
                          backgroundColor: activeTab === 'studioPortrait' ? '#fdf2f8' : '#fff7ed',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {activeTab === 'studioPortrait'
                            ? <Camera size={24} color="#db2777" />
                            : <Heart size={24} color="#ea580c" />}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b' }}>
                            {language === 'en' ? item.title : item.titleTa}
                          </h3>
                        </div>
                      </div>

                      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '600', marginBottom: '1.5rem' }}>
                        {language === 'en' ? item.desc : item.descTa}
                      </p>

                      <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '1.5rem',
                        borderLeft: `4px solid ${activeTab === 'studioPortrait' ? '#db2777' : '#ea580c'}`,
                        marginTop: 'auto'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '900', color: activeTab === 'studioPortrait' ? '#db2777' : '#ea580c', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                          {t("STUDIO SPECIFICATIONS", "ஸ்டுடியோ விவரக்குறிப்புகள்")}
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '600' }}>
                          {item.techAnalysis}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

              </div>
            </div>

            {/* Service Standards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                backgroundColor: 'white', borderRadius: isMobile ? '2rem' : '3rem', padding: isMobile ? '1.5rem' : '3rem',
                border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
              }}
            >
              <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: '900', color: '#0f172a', marginBottom: '2rem' }}>{t("Service Standards", "சேவை தரநிலைகள்")}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '2rem' }}>

                {[
                  { icon: ShieldCheck, title: t('Verified Partner', 'சரிபார்க்கப்பட்ட கூட்டாளர்'), desc: t('Background checked and technically certified.', 'பின்னணி சரிபார்க்கப்பட்டு தொழில்நுட்ப ரீதியாக சான்றளிக்கப்பட்டது.') },
                  { icon: Calendar, title: t('Easy Booking', 'எளிதான முன்பதிவு'), desc: t('Flexible scheduling to match your availability.', 'உங்கள் வசதிக்கேற்ப நெகிழ்வான திட்டமிடல்.') },
                  { icon: Clock, title: t('Timely Execution', 'நேரத்திற்கு முடித்தல்'), desc: t('Punctual service with professional handover.', 'தொழில்முறை ஒப்படைப்புடன் கூடிய சரியான நேர சேவை.') },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '1.5rem',
                      backgroundColor: `${service.accent}12`, margin: '0 auto 1.25rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <item.icon size={28} color={service.accent} />
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', lineHeight: '1.5' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                backgroundColor: 'white', borderRadius: isMobile ? '2rem' : '3rem', padding: isMobile ? '1.5rem' : '2.5rem',
                border: '1px solid #e2e8f0', boxShadow: '0 30px 60px rgba(15,23,42,0.1)',
                position: isMobile ? 'static' : 'sticky', top: '120px'
              }}
            >

              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '2.5rem',
                  backgroundColor: `${service.accent}15`, margin: '0 auto 1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px dashed ${service.accent}40`
                }}>
                  <User size={48} color={service.accent} />
                </div>
                <p style={{ color: service.accent, fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>{t("Direct Contact", "நேரடி தொடர்பு")}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.25rem' }}>
                  {language === 'en' ? service.person : service.person}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#22c55e', fontWeight: '800', fontSize: '0.85rem' }}>
                  <ShieldCheck size={16} /> {t("Verified Professional", "சரிபார்க்கப்பட்ட நிபுணர்")}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <motion.a
                  onClick={(e) => {
                    e.preventDefault();
                    handleCallTracking(service);
                  }}
                  href={`tel:${service.phone}`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '10px', backgroundColor: service.accent, color: 'white',
                    padding: '1.25rem', borderRadius: '1.5rem', fontWeight: '900',
                    textDecoration: 'none', boxShadow: `0 12px 24px -6px ${service.accent}50`,
                    fontSize: '1rem'
                  }}
                >
                  <Phone size={22} /> {t("Book Appointment", "அப்பாயிண்ட்மென்ட் முன்பதிவு")}
                </motion.a>

                <motion.a
                  href={`https://wa.me/91${service.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '10px', backgroundColor: '#25D366', color: 'white',
                    padding: '1.25rem', borderRadius: '1.5rem', fontWeight: '900',
                    textDecoration: 'none', boxShadow: '0 12px 24px -6px rgba(37, 211, 102, 0.4)',
                    fontSize: '1rem'
                  }}
                >
                  <MessageCircle size={22} /> WhatsApp
                </motion.a>

                <motion.button
                  onClick={() => setShowBillModal(true)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '10px', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white',
                    padding: '1.25rem', borderRadius: '1.5rem', fontWeight: '900',
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 12px 24px -6px rgba(139, 92, 246, 0.4)',
                    fontSize: '1rem', position: 'relative'
                  }}
                >
                  <ShoppingCart size={22} /> View Service Bills
                  {userBills.filter(b => b.status === 'unpaid').length > 0 && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid #f8fafc',
                        boxShadow: '0 4px 8px rgba(239, 68, 68, 0.5)',
                        zIndex: 10
                      }}>
                      {userBills.filter(b => b.status === 'unpaid').length}
                    </motion.span>
                  )}
                </motion.button>
              </div>


              <div style={{
                marginTop: '2.5rem', padding: '1.25rem', backgroundColor: '#f0fdf4',
                borderRadius: '1.5rem', border: '1px solid #dcfce7', textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '800', lineHeight: '1.5' }}>
                  {t("Personally vetted by Service Web for quality.", "தரத்திற்காக சர்வீஸ் வெப் மூலம் தனிப்பட்ட முறையில் சரிபார்க்கப்பட்டது.")}
                </p>
              </div>
            </motion.div>
          </aside>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MY SERVICE BILLS MODAL (Matches Image 1)
      ══════════════════════════════════════════════════ */}
      {showBillModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="clean-modal-content"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '2rem',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: 'none',
              filter: 'none',
              padding: '2.25rem 2.25rem 2rem',
              border: 'none',
              outline: 'none'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  My Service Bills
                </h2>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '600' }}>
                  {userBills.length} {userBills.length === 1 ? 'invoice' : 'invoices'} found
                </span>
              </div>
              <button
                onClick={() => setShowBillModal(false)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1px solid #e2e8f0', backgroundColor: '#f8fafc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#64748b'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Reward Points Header inside Modal (Matching Image 1 design) */}
            {userBills.length > 0 && (() => {
              const totalEarned = userBills.reduce((acc, bill) => acc + (Number(bill.earnedPoints) || 0), 0);
              const totalRedeemed = userBills.reduce((acc, bill) => acc + (Number(bill.redeemedPoints) || 0), 0);
              const availablePts = Math.max(0, totalEarned - totalRedeemed);

              return (
                <div style={{
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: '1.25rem',
                  padding: '1.1rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    backgroundColor: '#f59e0b', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(245,158,11,0.25)'
                  }}>
                    ★
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#b45309', marginBottom: '0.15rem' }}>
                      {userBills[0]?.expertName || 'Expert'} Reward Points
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#78350f', display: 'flex', alignItems: 'baseline', gap: '0.4rem', lineHeight: 1.1 }}>
                      {availablePts} pts <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b45309' }}>(Available)</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #fde68a', margin: '0.5rem 0 0.25rem 0' }} />
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', fontWeight: '700', color: '#b45309' }}>
                      <span>Total Earned: <strong>{totalEarned} pts</strong></span>
                      <span>Redeemed: <strong>{totalRedeemed} pts</strong></span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Bills List */}
            {userBills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                <Receipt size={40} color="#cbd5e1" style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ margin: 0, fontWeight: '600' }}>No bills found for this expert.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {userBills.map((bill) => {
                  const isPending = (bill.status || '').toLowerCase() === 'pending';
                  const isCompleted = (bill.status || '').toLowerCase() === 'completed';
                  const isPaid = (bill.paymentStatus || '').toLowerCase() === 'paid';

                  const totalEarned = userBills.reduce((acc, b) => acc + (Number(b.earnedPoints) || 0), 0);
                  const totalRedeemed = userBills.reduce((acc, b) => acc + (Number(b.redeemedPoints) || 0), 0);
                  const currentAvailable = Math.max(0, totalEarned - totalRedeemed);

                  return (
                    <div
                      key={bill.id}
                      style={{
                        borderRadius: '1.25rem',
                        border: '1px solid #e2e8f0',
                        padding: '1.25rem 1.5rem',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Top Row: Service Name + Status Indicators */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.2rem 0', textTransform: 'capitalize', letterSpacing: '-0.2px' }}>
                            {bill.serviceType}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>
                            {bill.expertName}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                          <span style={{
                            color: isCompleted ? '#10b981' : isPending ? '#f59e0b' : '#3b82f6',
                            fontSize: '0.9rem',
                            fontWeight: '800',
                            textTransform: 'capitalize'
                          }}>
                            {isCompleted ? 'Completed' : isPending ? 'Pending' : bill.status}
                          </span>
                          <span style={{
                            color: isPaid ? '#10b981' : '#ef4444',
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            <span style={{ fontSize: '0.6rem' }}>●</span> {isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.3rem 0 0.6rem 0', fontWeight: '500' }}>
                        {bill.description || 'Premium Service Solution'}
                      </p>

                      {/* Reward Points Box inside Card (Matching Image 1) */}
                      {(Number(bill.earnedPoints) > 0 || Number(bill.redeemedPoints) > 0) && (
                        <div style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '0.85rem',
                          padding: '0.65rem 0.85rem',
                          margin: '0.6rem 0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                          border: '1px solid #f1f5f9'
                        }}>
                          {Number(bill.earnedPoints) > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.85rem', fontWeight: '700' }}>
                              <span style={{ fontSize: '0.9rem' }}>★</span>
                              <span>Earned: <strong>{bill.earnedPoints} pts</strong></span>
                            </div>
                          )}
                          {Number(bill.redeemedPoints) > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontSize: '0.85rem', fontWeight: '700' }}>
                              <span style={{ fontSize: '0.9rem' }}>★</span>
                              <span>Redeemed: <strong>{bill.redeemedPoints} pts</strong> (-₹{parseFloat(bill.redeemDiscount || bill.redeemedPoints).toFixed(2)})</span>
                            </div>
                          )}
                        </div>
                      )}

                      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.65rem 0 0.85rem' }} />

                      {/* Bottom Row: Total Amount & Apply Points Button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.2rem' }}>
                            Total Amount
                          </div>
                          <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>
                            ₹{parseFloat(bill.amount || 0).toFixed(2)}
                          </div>
                        </div>

                        {Number(bill.redeemedPoints || 0) === 0 && !isPaid && currentAvailable > 0 && (
                          <button
                            onClick={() => handleApplyPoints(bill.id, currentAvailable)}
                            style={{
                              backgroundColor: '#fffbeb',
                              color: '#b45309',
                              border: '1px solid #fde68a',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.75rem',
                              fontSize: '0.85rem',
                              fontWeight: '800',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              boxShadow: '0 2px 5px rgba(245, 158, 11, 0.1)'
                            }}
                          >
                            <span>★</span> Apply Points
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default ServiceDetail;
