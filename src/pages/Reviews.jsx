import React, { useState, useEffect, useRef } from 'react';
import { Star, ThumbsUp, MessageSquare, Send, CheckCircle2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

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
  border:    '#cbd5e1', // Professional border
  bg:        '#f8fafc',
  white:     '#ffffff',
};

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const childFade = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const initialReviews = [
  { id: 'r1', name: 'Ravi Kumar', role: 'Home Owner', service: 'Plumbing', review: 'The plumber they sent was incredibly professional. Fixed the issue in no time and cleaned up after. Highly recommend!', rating: 5, initials: 'RK', color: '#3b82f6', date: 'Apr 28, 2026', helpful: 14 },
  { id: 'r2', name: 'Priya Dharshini', role: 'Business Owner', service: 'AC Service', review: 'Booked an AC service and they arrived right on time. The technician explained everything clearly. Will book again!', rating: 5, initials: 'PD', color: '#8b5cf6', date: 'Apr 22, 2026', helpful: 9 },
  { id: 'r3', name: 'Vikram Sethupathi', role: 'Apartment Resident', service: 'Electrical', review: 'Electrical work done perfectly. Transparent pricing and no surprises. Best service platform I have used so far.', rating: 5, initials: 'VS', color: '#ec4899', date: 'Apr 18, 2026', helpful: 21 },
  { id: 'r4', name: 'Deepa Natarajan', role: 'Home Owner', service: 'Painting', review: 'Wall painting was done beautifully. The team was neat and completed the work ahead of schedule. Very satisfied!', rating: 4, initials: 'DN', color: '#ea580c', date: 'Apr 15, 2026', helpful: 7 },
  { id: 'r5', name: 'Suresh Krishnan', role: 'Shop Owner', service: 'CCTV & Net', review: 'CCTV installation was seamless. The technician knew exactly what he was doing. Great service at a fair price.', rating: 5, initials: 'SK', color: '#0ea5e9', date: 'Apr 10, 2026', helpful: 12 },
  { id: 'r6', name: 'Anitha Raj', role: 'Home Owner', service: 'Home Cleaning', review: 'The cleaning team was thorough and professional. My home has never been this spotless. Will definitely rehire!', rating: 5, initials: 'AR', color: '#10b981', date: 'Apr 5, 2026', helpful: 18 },
  { id: 'r7', name: 'Mohanraj D', role: 'Office Manager', service: 'IT & Software', review: 'Quick and efficient IT support. They fixed our network issues within an hour. Very professional and knowledgeable.', rating: 4, initials: 'MD', color: '#f59e0b', date: 'Mar 30, 2026', helpful: 5 },
  { id: 'r8', name: 'Kavitha S', role: 'Home Owner', service: 'Carpentry', review: 'Had custom shelves made. The carpenter was skilled and delivered exactly what I envisioned. Excellent finish!', rating: 5, initials: 'KS', color: '#d946ef', date: 'Mar 25, 2026', helpful: 10 },
  { id: 'r9', name: 'Rajesh P', role: 'Apartment Resident', service: 'Plumbing', review: 'Fast response and great work. The quote was accurate with no hidden charges. Will recommend to neighbors!', rating: 4, initials: 'RP', color: '#e11d48', date: 'Mar 20, 2026', helpful: 6 },
];

const filters = [
  'All',
  'Plumbing', 'AC Service', 'Electrical', 'Painting',
  'CCTV & Net', 'Home Cleaning', 'IT & Software', 'Carpentry',
  'Construction', 'Hindi Training', 'Tractor Service',
  'Insurance & Career', 'Steel & Cement', 'Photography', 'Stationery & Binding',
];

const StarRow = ({ rating, size = 16, interactive = false, onStarClick = () => {} }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1, 2, 3, 4, 5].map(s => (
      <Star 
        key={s} 
        size={size} 
        fill={s <= rating ? '#f59e0b' : 'transparent'} 
        color={s <= rating ? '#f59e0b' : '#cbd5e1'} 
        style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.2s ease' }}
        onClick={() => interactive && onStarClick(s)}
      />
    ))}
  </div>
);

export default function Reviews() {
  const { isLoggedIn, user } = useAuth();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('thiran360_reviews');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load reviews from local storage', e);
    }
    return initialReviews;
  });

  useEffect(() => {
    localStorage.setItem('thiran360_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [successMsg, setSuccessMsg] = useState(false);
  const reviewsRef = useRef(null);
  
  // Form state
  const [newReview, setNewReview] = useState({ rating: 5, service: 'Plumbing', review: '' });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSm = windowWidth <= 425;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.review.trim()) return;

    // Generate a unique id so AnimatePresence tracks it correctly
    const uniqueId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const reviewObj = {
      id: uniqueId,
      name: user?.name || 'Anonymous',
      role: t('Verified User', 'சரிபார்க்கப்பட்ட பயனர்'),
      service: newReview.service,
      review: newReview.review,
      rating: newReview.rating,
      initials: (user?.name || 'A').split(' ').map(n => n[0]).join('').toUpperCase(),
      color: T.blue,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      helpful: 0
    };

    // Prepend review, reset filter to All so it's always visible, clear form
    setReviews(prev => [reviewObj, ...prev]);
    setActiveFilter('All');
    setNewReview({ rating: 5, service: 'Plumbing', review: '' });

    // Also save ONLY user-submitted reviews separately for the Experts page count
    // This avoids double-counting the initial sample reviews with the expert baseReviews
    try {
      const existing = JSON.parse(localStorage.getItem('thiran360_user_reviews') || '[]');
      localStorage.setItem('thiran360_user_reviews', JSON.stringify([reviewObj, ...existing]));
    } catch (e) {
      console.error('Failed to save user review', e);
    }

    // Show success toast
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3500);

    // Smooth scroll to reviews list
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const filtered = activeFilter === 'All' ? reviews : reviews.filter(r => r.service === activeFilter);
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <main style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* ── Success Toast ── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: 90, left: '50%', transform: 'translateX(-50%)',
              zIndex: 9999, background: '#10b981', color: '#fff',
              padding: '1rem 2rem', borderRadius: 12,
              display: 'flex', alignItems: 'center', gap: 10,
              fontWeight: 700, fontSize: '0.95rem',
              boxShadow: '0 10px 30px rgba(16,185,129,0.35)',
              whiteSpace: 'nowrap'
            }}
          >
            <CheckCircle2 size={20} />
            {t('Your review was submitted successfully!', 'உங்கள் மதிப்புரை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!')}
          </motion.div>
        )}
      </AnimatePresence>
      
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
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2062&auto=format&fit=crop"
            alt="Customer review background"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.3 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 100%)' }} />
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
                  <CheckCircle2 size={14} /> {t("Verified Feedback", "சரிபார்க்கப்பட்ட கருத்து")}
                </span>
              </motion.div>

              <motion.h1 variants={childFade} style={{ 
                fontSize: isSm ? '2.4rem' : isMobile ? '3rem' : '3.8rem', 
                fontWeight: 800, color: T.white, letterSpacing: '-1px', 
                lineHeight: 1.15, margin: '0 0 1.25rem' 
              }}>
                {t("What Our Clients", "வாடிக்கையாளர்கள்")}
                <br/>
                <span style={{ color: '#60a5fa' }}>
                  {t("Say About Us", "கூறுவது")}
                </span>
              </motion.h1>

              <motion.p variants={childFade} style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, margin: isMobile ? '0 auto 2.5rem' : '0 0 2.5rem', fontWeight: 400, maxWidth: 540 }}>
                {t("Real reviews from verified customers who experienced our professional services firsthand.", "எங்கள் சேவைகளை அனுபவித்த வாடிக்கையாளர்களிடமிருந்து உண்மையான மதிப்புரைகள்.")}
              </motion.p>
            </motion.div>

            {/* Corporate Stats Cards - Desktop Right Side, Mobile Bottom */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{
              display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)',
                padding: '2rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: '3rem', fontWeight: 800, color: T.white, lineHeight: 1 }}>{avgRating}</span>
                    <div>
                      <StarRow rating={Math.round(avgRating)} size={18} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginTop: 4 }}>
                        {t("Average Rating", "சராசரி மதிப்பீடு")}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,0.1)' }} className="hide-mobile" />

                <div>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: T.white, lineHeight: 1, display: 'block', marginBottom: 4 }}>{reviews.length}+</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>
                    {t("Total Reviews", "மொத்த மதிப்புரைகள்")}
                  </span>
                </div>

                <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,0.1)' }} className="hide-mobile" />

                <div>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', lineHeight: 1, display: 'block', marginBottom: 4 }}>98%</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>
                    {t("Satisfaction", "திருப்தி")}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 2  FILTER TABS & FORM
      ══════════════════════════════════════════════════ */}
      
      {/* Sticky Filter Bar */}
      <section style={{ padding: '1rem 0', borderBottom: `1px solid ${T.border}`, background: 'rgba(248, 250, 252, 0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: '70px', zIndex: 100 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }} className="hide-scrollbar">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  if (f !== 'All') {
                    setNewReview(prev => ({ ...prev, service: f }));
                  }
                }}
                style={{
                  padding: '0.6rem 1.25rem', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem',
                  whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s ease',
                  background: activeFilter === f ? T.dark : T.white,
                  color: activeFilter === f ? T.white : T.slate,
                  border: activeFilter === f ? `1px solid ${T.dark}` : `1px solid ${T.border}`,
                  boxShadow: activeFilter === f ? '0 4px 12px rgba(15,23,42,0.15)' : 'none',
                }}
              >
                {f === 'All' ? t('All Services', 'அனைத்து சேவைகள்') : f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Inline Review Form */}
      <section style={{ padding: '4rem 0 2rem' }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          <form onSubmit={handleSubmit} style={{
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
            background: T.white, padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: 16,
            border: `1.5px solid ${T.border}`, boxShadow: '0 10px 30px rgba(15,23,42,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.5rem' }}>
              <MessageSquare size={24} color={T.blue} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.5px' }}>
                {t("Share Your Experience", "உங்கள் அனுபவத்தைப் பகிரவும்")}
              </h3>
            </div>
            
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: T.slate }}>{t("Select Service", "சேவையைத் தேர்ந்தெடுக்கவும்")}</label>
                <select 
                  value={newReview.service}
                  onChange={(e) => setNewReview({...newReview, service: e.target.value})}
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, fontSize: '0.95rem', fontWeight: 500, outline: 'none', color: T.dark }}
                >
                  {filters.slice(1).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: T.slate }}>{t("Your Rating", "உங்கள் மதிப்பீடு")}</label>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', background: T.bg, padding: '0 1.25rem', borderRadius: 8, border: `1px solid ${T.border}` }}>
                  <StarRow rating={newReview.rating} size={22} interactive={true} onStarClick={(s) => setNewReview({...newReview, rating: s})} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: T.slate }}>{t("Your Review", "உங்கள் விமர்சனம்")}</label>
              <textarea 
                required
                value={newReview.review}
                onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                placeholder={t("Tell us how we did...", "நாங்கள் எப்படி செய்தோம் என்று சொல்லுங்கள்...")}
                style={{ width: '100%', height: '120px', padding: '1rem', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, fontSize: '0.95rem', fontWeight: 400, outline: 'none', resize: 'vertical', color: T.dark }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: T.blue, color: T.white, padding: '0.9rem 2rem',
                borderRadius: 8, fontWeight: 600, fontSize: '1rem', alignSelf: 'flex-end',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)', transition: 'background 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = T.blueDark}
              onMouseOut={e => e.currentTarget.style.background = T.blue}
            >
              {t("Submit Feedback", "கருத்தைச் சமர்ப்பிக்கவும்")} <Send size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 3  REVIEWS GRID - Corporate Style
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '2rem 0 6rem' }} ref={reviewsRef}>
        <div className="container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.5px' }}>
              {t("Recent Reviews", "சமீபத்திய மதிப்புரைகள்")}
            </h2>
            <p style={{ color: T.slate, fontSize: '0.95rem', fontWeight: 600, background: T.white, padding: '6px 14px', borderRadius: 6, border: `1px solid ${T.border}` }}>
              {filtered.length} {t(`results`, `முடிவுகள்`)} {activeFilter !== 'All' && `· ${activeFilter}`}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(15,23,42,0.08)' }}
                  style={{
                    background: T.white, borderRadius: 16, padding: '2rem',
                    boxShadow: '0 4px 16px rgba(15,23,42,0.04)', border: `1.5px solid ${T.border}`,
                    display: 'flex', flexDirection: 'column', gap: '1.25rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Header Row: Stars + Tag */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <StarRow rating={r.rating} />
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, color: r.color,
                      background: `${r.color}15`, padding: '4px 10px', borderRadius: 4,
                      border: `1px solid ${r.color}30`, textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>
                      {r.service}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p style={{ fontSize: '0.95rem', color: T.darkMid, lineHeight: 1.6, fontWeight: 500, flex: 1 }}>
                    "{r.review}"
                  </p>

                  {/* Footer Row: User + Helpful */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Avatar */}
                      <div style={{
                        width: 42, height: 42, borderRadius: 8,
                        background: `${r.color}15`, border: `1px solid ${r.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 800, color: r.color, flexShrink: 0,
                      }}>
                        {r.initials}
                      </div>
                      <div>
                        <p style={{ fontWeight: 800, color: T.dark, fontSize: '0.95rem', margin: 0, lineHeight: 1.2 }}>{r.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <Shield size={12} color="#10b981" />
                          <p style={{ fontSize: '0.75rem', color: T.slate, margin: 0, fontWeight: 600 }}>{r.role} · {r.date}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Helpful Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.muted, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = T.blue} onMouseOut={e => e.currentTarget.style.color = T.muted}>
                      <ThumbsUp size={14} /> {r.helpful}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <div style={{ background: T.white, width: 80, height: 80, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: `1.5px solid ${T.border}` }}>
                <MessageSquare size={32} color={T.slate} />
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: T.dark }}>{t("No reviews found.", "மதிப்புரைகள் எதுவும் கிடைக்கவில்லை.")}</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 500, color: T.slate, marginTop: '0.5rem' }}>{t("Be the first to share your experience with this service!", "இந்த சேவை குறித்த உங்கள் அனுபவத்தைப் பகிரும் முதல் நபராக இருங்கள்!")}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
