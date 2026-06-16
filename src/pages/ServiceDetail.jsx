import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Phone, MessageCircle, User, ShieldCheck, Zap, Warehouse, Layout, Home, Building2, Calendar, Clock, Droplet, Camera, Heart } from 'lucide-react';
import { services } from '../data/servicesData';
import { useLanguage } from '../context/LanguageContext';
import FoodDeliveryApp from '../components/FoodDelivery/FoodDeliveryApp';
import SupermarketApp from '../components/Supermarket/SupermarketApp';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const service = services.find(s => s.id === id);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState('services');

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
    <main style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '5rem' }}>
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
        
        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: isMobile ? '2.5rem' : '4rem', zIndex: 10 }}>
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
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
                    {activeTab === 'waterRO' ? t("R.O Water Purifier Sales & Services", "ஆர்.ஓ நீர் சுத்திகரிப்பு விற்பனை மற்றும் சேவைகள்") : t("Solar, UPS & Battery Solutions", "சோலார், யுபிஎஸ் மற்றும் பேட்டரி தீர்வுகள்")}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '600' }}>
                    {activeTab === 'waterRO' 
                      ? t("Premium domestic and industrial R.O water purifiers ensuring safe, clean, and healthy drinking water.", "பாதுகாப்பான, சுத்தமான மற்றும் ஆரோக்கியமான குடிநீரை உறுதி செய்யும் பிரீமியம் வீட்டு மற்றும் தொழில்துறை ஆர்.ஓ நீர் சுத்திகரிப்பாளர்கள்.") 
                      : t("Sustainable solar systems and reliable UPS/battery backup configurations to keep you powered 24/7.", "24/7 உங்களை இயங்க வைக்கும் நிலையான சோலார் அமைப்புகள் மற்றும் நம்பகமான யுபிஎஸ்/பேட்டரி பேக்கப் கட்டமைப்புகள்.")}
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.1) }}
                      style={{ 
                        backgroundColor: 'white', 
                        borderRadius: '2.5rem', 
                        overflow: 'hidden',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                        border: '1px solid #e2e8f0'
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
                            backgroundColor: '#f1f5f9', display: 'flex', flexShrink: 0,
                            alignItems: 'center', justifyContent: 'center'
                          }}>
                            {id === 'skyline-builders' ? <IconComp size={24} color="#1e293b" /> : <Zap size={24} color={service.accent} />}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.2rem' }}>
                              {language === 'en' ? feature.title : feature.titleTa}
                            </h3>
                            {feature.subLabel && (
                              <p style={{ fontSize: '0.85rem', fontWeight: '800', color: '#3b82f6', textTransform: 'capitalize' }}>
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
                            backgroundColor: '#f8fafc', 
                            padding: '1.5rem', 
                            borderRadius: '1.5rem',
                            borderLeft: `5px solid ${service.accent}`,
                            position: 'relative'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                              <ShieldCheck size={18} color="#1e293b" />
                              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {t("Technical Analysis", "தொழில்நுட்ப பகுப்பாய்வு")}
                              </span>
                            </div>
                            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.5', fontWeight: '600', fontStyle: 'italic' }}>
                              {feature.techAnalysis}
                            </p>
                          </div>
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
                  <Phone size={22} /> {t("Call Now", "இப்போது அழைக்கவும்")}
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
    </main>
  );
};

export default ServiceDetail;
