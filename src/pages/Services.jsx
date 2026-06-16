import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, Star, Zap, ShieldCheck, ArrowRight, Bot, Shield, CheckCircle2 } from 'lucide-react';
import { services } from '../data/servicesData';
import { useLanguage } from '../context/LanguageContext';
import aiBot from '../assets/ai_bot_no_text.png';

/* ─── Design tokens ─────────────────────────────── */
const T = {
  blue:      '#2563eb',
  blueDark:  '#1e3a8a',
  blueGlow:  'rgba(37,99,235,0.15)',
  indigo:    '#4f46e5',
  dark:      '#0f172a',
  darkMid:   '#1e293b',
  slate:     '#475569',
  muted:     '#94a3b8',
  border:    '#cbd5e1', // slightly darker border for professional look
  bg:        '#f8fafc',
  white:     '#ffffff',
};

/* ─── Framer variants ────────────────────────────── */
const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const childFade = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Services() {
  const { t, language } = useLanguage();
  const [hovered, setHovered] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSm = windowWidth <= 425;

  const filteredServices = services.filter(s => {
    const query = searchQuery.toLowerCase();
    const name = (language === 'en' ? s.company : s.companyTa).toLowerCase();
    const desc = (language === 'en' ? s.desc : s.descTa).toLowerCase();
    const tag = (language === 'en' ? s.tag : s.tagTa).toLowerCase();
    return name.includes(query) || desc.includes(query) || tag.includes(query);
  });

  return (
    <main style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ══════════════════════════════════════════════════
          § 1  HERO BANNER - Clean & Corporate
      ══════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        padding: isMobile ? '5rem 0' : '7rem 0 6rem',
        overflow: 'hidden',
        background: T.dark,
        display: 'flex', alignItems: 'center'
      }}>
        {/* Background Image: Professional Modern Environment */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img 
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2074&auto=format&fit=crop" 
            alt="Professional services background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.7) 100%)' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
            gap: isMobile ? '3rem' : '4rem',
            alignItems: 'center'
          }}>
            
            <motion.div variants={stagger} initial="initial" animate="animate" style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <motion.div variants={childFade}>
                <span style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.08)', color: '#e2e8f0',
                  padding: '6px 14px', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '2px', border: '1px solid rgba(255,255,255,0.15)',
                  marginBottom: '1.5rem'
                }}>
                  <Shield size={14} /> {t("Premium Services", "பிரீமியம் சேவைகள்")}
                </span>
              </motion.div>

              <motion.h1 variants={childFade} style={{ 
                fontSize: isSm ? '2.4rem' : isMobile ? '3rem' : '3.8rem', 
                fontWeight: 800, color: T.white, letterSpacing: '-1px', 
                lineHeight: 1.15, margin: '0 0 1.25rem' 
              }}>
                {t("Find the Perfect", "சரியான நிபுணரை")}
                <br/>
                <span style={{ color: '#60a5fa' }}>
                  {t("Expert for Your Need", "கண்டுபிடியுங்கள்")}
                </span>
              </motion.h1>

              <motion.p variants={childFade} style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, margin: isMobile ? '0 auto 2.5rem' : '0 0 2.5rem', fontWeight: 400, maxWidth: 540 }}>
                {t("Connect directly with our verified service partners for professional, reliable solutions at your doorstep.", "தொழில்முறை, நம்பகமான தீர்வுகளுக்கு எங்கள் சரிபார்க்கப்பட்ட சேவை பங்காளிகளுடன் நேரடியாக இணையுங்கள்.")}
              </motion.p>

              {/* Search Bar Inline */}
              <motion.div variants={childFade} style={{ 
                position: 'relative', maxWidth: isMobile ? '100%' : 480,
                display: 'flex', alignItems: 'center', margin: isMobile ? '0 auto' : '0'
              }}>
                <div style={{ position: 'absolute', left: '1.25rem', color: T.muted }}>
                  <Search size={20} />
                </div>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("Search services...", "சேவைகளைத் தேடுங்கள்...")}
                  style={{
                    width: '100%', padding: '1rem 1.2rem 1rem 3.5rem',
                    borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
                    color: T.white, fontSize: '1rem', fontWeight: 500,
                    outline: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                  onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                />
              </motion.div>
            </motion.div>

            {/* Corporate Stats Cards - Desktop Right Side */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{
              display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              {[
                { val: String(services.length), label: t('Service Partners', 'சேவை பங்காளிகள்'), icon: ShieldCheck, color: '#3b82f6' },
                { val: '10k+', label: t('Jobs Done', 'முடிக்கப்பட்ட வேலைகள்'), icon: Zap, color: '#10b981' },
                { val: '4.9/5', label: t('Average Rating', 'சராசரி மதிப்பீடு'), icon: Star, color: '#f59e0b' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)',
                  padding: '1.5rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', gap: '1.25rem'
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={24} color={s.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: T.white, lineHeight: 1.2 }}>{s.val}</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#cbd5e1', marginTop: 4 }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 2  SERVICES GRID - Corporate Directory Style
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: '#f1f5f9' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.5px' }}>{t("Our Services", "எங்கள் சேவைகள்")}</h2>
            <div style={{ width: 60, height: 4, background: T.blue, margin: '1rem auto' }} />
          </div>

          {filteredServices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Search size={32} color={T.slate} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: T.dark, marginBottom: '0.5rem' }}>{t("No services found", "எந்த சேவைகளும் கிடைக்கவில்லை")}</h3>
              <p style={{ color: T.muted }}>{t("Try adjusting your search query.", "உங்கள் தேடலை மாற்றி முயற்சிக்கவும்.")}</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
            }}>
              <AnimatePresence>
                {filteredServices.map((s, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                    key={s.id}
                    onHoverStart={() => setHovered(s.id)}
                    onHoverEnd={() => setHovered(null)}
                    onClick={() => navigate(`/services/${s.id}`)}
                    style={{
                      background: T.white,
                      borderRadius: 16,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1.5px solid #cbd5e1', // Professional distinct border
                      boxShadow: hovered === s.id ? '0 16px 32px rgba(15,23,42,0.1)' : '0 4px 16px rgba(15,23,42,0.05)',
                      transform: hovered === s.id ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Image Area - Corporate clean style */}
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${T.border}` }}>
                      <img
                        src={s.image}
                        alt={language === 'en' ? s.company : s.companyTa}
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover',
                          transform: hovered === s.id ? 'scale(1.05)' : 'scale(1)',
                          transition: 'transform 0.6s ease',
                        }}
                      />
                      
                      {/* Premium Tag - Minimalist */}
                      <div style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)',
                        padding: '4px 10px', borderRadius: 4,
                        display: 'flex', alignItems: 'center', gap: 6,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.accent }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: T.darkMid, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                          {language === 'en' ? s.tag : s.tagTa}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: T.dark, lineHeight: 1.3 }}>
                          {language === 'en' ? s.company : s.companyTa}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f8fafc', padding: '2px 6px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                          <Star size={12} fill="#f59e0b" color="#f59e0b" />
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: T.darkMid }}>4.9</span>
                        </div>
                      </div>
                      
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: T.slate, marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        {language === 'en' ? s.desc : s.descTa}
                      </p>
                      
                      <div style={{ flex: 1 }} />
                      
                      <div style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderTop: `1px solid ${T.border}`, paddingTop: '1.25rem'
                      }}>
                        <span style={{ 
                          fontSize: '0.9rem', fontWeight: 600, 
                          color: hovered === s.id ? T.blue : T.slate,
                          transition: 'color 0.3s ease'
                        }}>
                          {t("View Details", "விவரங்களைக் காண்க")}
                        </span>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: hovered === s.id ? T.blue : '#f1f5f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: hovered === s.id ? T.white : T.slate,
                          transition: 'all 0.3s ease',
                          transform: hovered === s.id ? 'translateX(4px)' : 'translateX(0)'
                        }}>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 3  AI ASSISTANT CTA - Corporate Style
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '2rem 0 6rem', background: '#f1f5f9' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: 24,
              padding: isMobile ? '3rem 1.5rem' : '4rem 5rem',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '3rem',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
              border: '1px solid #334155'
            }}
          >
            {/* Subtle Gradient Backing */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'radial-gradient(ellipse at right, rgba(37,99,235,0.15) 0%, transparent 70%)', zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1, flex: 1, textAlign: isMobile ? 'center' : 'left', maxWidth: 540 }}>
              <span style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.05)', color: '#cbd5e1',
                padding: '6px 14px', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem',
                textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '1.25rem'
              }}>
                <Bot size={14} /> {t("AI Assistant", "AI உதவியாளர்")}
              </span>
              
              <h2 style={{ fontSize: isMobile ? '2rem' : '2.6rem', fontWeight: 800, color: T.white, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '1.25rem' }}>
                {t("Need help finding a service?", "சேவையை கண்டறிய உதவி வேண்டுமா?")}
              </h2>
              
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 400 }}>
                {t("Can't find what you're looking for? Our intelligent voice-enabled AI can instantly guide you to the right professional for your exact needs.", "எங்கள் குரல் வழி AI உங்களை சரியான நிபுணர்களிடம் உடனடியாக அழைத்துச் செல்லும்.")}
              </p>
              
              <Link to="/experts" style={{
                background: T.blue,
                color: T.white,
                padding: '0.9rem 2rem',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
              }} onMouseOver={e => e.currentTarget.style.background = T.blueDark} onMouseOut={e => e.currentTarget.style.background = T.blue}>
                {t("Browse Experts", "நிபுணர்களைத் தேடுங்கள்")} <ArrowRight size={18} />
              </Link>
            </div>

            <div style={{ position: 'relative', zIndex: 1, width: isMobile ? 180 : 260, flexShrink: 0 }}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                style={{
                  width: '100%', aspectRatio: '1/1',
                  borderRadius: 24, overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)'
                }}
              >
                <img src={aiBot} alt="AI Bot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
