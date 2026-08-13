import React, { useState, useEffect, useRef } from 'react';
import { Star, ArrowRight, ShieldCheck, Phone, Building2, CircuitBoard, BookOpen, Sofa, Hammer, Code2, Briefcase, Sun, Camera, Plug, Wrench, Users, Shield, Award, CheckCircle2, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import gvGlazing from '../assets/gv_glazing.png';
import abiramiMain from '../assets/abirami_main.png';
import electricalImg from '../assets/electrical.png';
import imgSkyline from '../assets/svc_skyline.png';
import imgHarichandra from '../assets/svc_harichandra.png';
import imgSurendar from '../assets/expert_surendar.png';
import imgWoodzone from '../assets/svc_woodzone.png';
import imgGV from '../assets/svc_gv_buildtech.png';
import imgManikavasagar from '../assets/thiran web.png';
import imgTractor from '../assets/swathi_tractor.png';
import imgVinayak from '../assets/svc_vinayak.png';
import imgSunPower from '../assets/svc_sunpower.png';
import imgMonoj from '../assets/svc_monojsteels.png';
import imgMajestic from '../assets/svc_majesticstudio.png';
import imgSriSakthi from '../assets/svc_srisakthi.png';

/* ─── Design tokens ─────────────────────────────── */
const T = {
  blue: '#2563eb',
  blueDark: '#1e3a8a',
  blueGlow: 'rgba(37,99,235,0.15)',
  indigo: '#4f46e5',
  dark: '#0f172a',
  darkMid: '#1e293b',
  slate: '#475569',
  muted: '#64748b',
  border: '#e2e8f0',
  bg: '#f8fafc',
  white: '#ffffff',
};

/* ─── Framer variants ────────────────────────────── */
const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const childFade = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const experts = (t) => [
  {
    id: 'skyline-builders',
    name: 'Skyline Team',
    role: t('Construction Specialist', 'கட்டுமான நிபுணர்'),
    icon: Building2,
    logo: imgSkyline,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#ea580c',
    rating: 4.8,
    baseReviews: 134,
    serviceKey: 'Plumbing',
    accent: '#ea580c',
    phone: '9443822122',
  },

  {
    id: 'hindi-academy',
    name: 'Surendar J',
    role: t('Master Hindi Trainer', 'மாஸ்டர் இந்தி பயிற்சியாளர்'),
    icon: BookOpen,
    logo: imgSurendar,
    tag: t('CERTIFIED', 'சான்றளிக்கப்பட்டது'),
    tagColor: '#16a34a',
    rating: 4.9,
    baseReviews: 210,
    serviceKey: 'Hindi Training',
    accent: '#16a34a',
    phone: '6397255377',
  },
  {
    id: 'woodzone',
    name: 'Woodzone',
    role: t('Tiles and Furn Expert', 'டைல்ஸ் மற்றும் பர்னிச்சர் நிபுணர்'),
    icon: Sofa,
    logo: imgWoodzone,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#ca8a04',
    rating: 4.7,
    baseReviews: 175,
    serviceKey: 'Carpentry',
    accent: '#ca8a04',
    phone: '9842943053',
  },
  {
    id: 'gv-buildtech',
    name: 'GV Buildtech',
    role: t('Fabrication Expert', 'ஃபேப்ரிகேஷன் நிபுணர்'),
    icon: Hammer,
    logo: imgGV,
    tag: t('EXPERT', 'நிபுணர்'),
    tagColor: '#475569',
    rating: 4.8,
    baseReviews: 53,
    serviceKey: 'Painting',
    accent: '#475569',
    phone: '9042967472',
  },
  {
    id: 'thiran360ai',
    name: 'Maanicka Vasagar',
    role: t('IT and Software Expert', 'IT மற்றும் மென்பொருள் நிபுணர்'),
    icon: Code2,
    logo: imgManikavasagar,
    tag: t('CERTIFIED', 'சரிபார்க்கப்பட்டது'),
    tagColor: '#0d9488',
    rating: 4.8,
    baseReviews: 91,
    serviceKey: 'IT & Software',
    accent: '#0d9488',
    phone: '7708805630',
  },
  {
    id: 'swathi-traders',
    name: 'Saravanan',
    role: t('Tractor Specialist', 'டிராக்டர் சிறப்பு நிபுணர்'),
    icon: Wrench,
    logo: imgTractor,
    tag: t('EXPERT', 'நிபுணர்'),
    tagColor: '#059669',
    rating: 4.8,
    baseReviews: 68,
    serviceKey: 'Tractor Service',
    accent: '#059669',
    phone: '9876543211',
  },
  {
    id: 'sri-vinayak',
    name: 'Sri Vinayak',
    role: t('Insurance and Career Coach', 'காப்பீடு மற்றும் தொழில் பயிற்சியாளர்'),
    icon: Briefcase,
    logo: imgVinayak,
    tag: t('CERTIFIED', 'சான்றளிக்கப்பட்டது'),
    tagColor: '#4f46e5',
    rating: 4.8,
    baseReviews: 34,
    serviceKey: 'Insurance & Career',
    accent: '#4f46e5',
    phone: '9443822123',
  },
  {
    id: 'sun-power',
    name: 'Mega Sun Power Equipments',
    role: t('Solar and Power Consultant', 'சோலார் மற்றும் மின்சார ஆலோசகர்'),
    icon: Sun,
    logo: imgSunPower,
    tag: t('VERIFIED', 'சரிபார்க்கப்பட்டது'),
    tagColor: '#d97706',
    rating: 4.9,
    baseReviews: 76,
    serviceKey: 'Electrical',
    accent: '#d97706',
    phone: '9488214002',
  },
  {
    id: 'monoj-steels',
    name: 'Monoj Steels',
    role: t('Steel and Cement Expert', 'இரும்பு மற்றும் சிமெண்ட் நிபுணர்'),
    icon: Hammer,
    logo: imgMonoj,
    tag: t('EXPERT', 'நிபுணர்'),
    tagColor: '#dc2626',
    rating: 4.8,
    baseReviews: 88,
    serviceKey: 'Steel & Cement',
    accent: '#dc2626',
    phone: '9751094748',
  },
  {
    id: 'majestic-studio',
    name: 'Majestic Studio',
    role: t('Professional Photographer', 'தொழில்முறை புகைப்படக் கலைஞர்'),
    icon: Camera,
    logo: imgMajestic,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#db2777',
    rating: 4.9,
    baseReviews: 142,
    serviceKey: 'Photography',
    accent: '#db2777',
    phone: '9842943054',
  },
  {
    id: 'sri-sakthi-electrical',
    name: 'Sri Sakthi',
    role: t('Appliance Repair Specialist', 'உபகரண பழுதுபார்ப்பு நிபுணர்'),
    icon: Plug,
    logo: imgSriSakthi,
    tag: t('VERIFIED', 'சரிபார்க்கப்பட்டது'),
    tagColor: '#0284c7',
    rating: 4.9,
    baseReviews: 119,
    serviceKey: 'AC Service',
    accent: '#0284c7',
    phone: '9042967473',
  },
  {
    id: 'sri-jayam-glass-house',
    name: 'C. Prakash',
    role: t('Glass & Interior Expert', 'கிளாஸ் மற்றும் இன்டீரியர் நிபுணர்'),
    icon: Building2,
    logo: gvGlazing,
    tag: t('EXPERT', 'நிபுணர்'),
    tagColor: '#0f766e',
    rating: 4.8,
    baseReviews: 82,
    serviceKey: 'Home Cleaning',
    accent: '#0f766e',
    phone: '6374822433',
  },
  {
    id: 'sri-abirami-book-binding',
    name: 'Prabhu & Manikandan',
    role: t('Stationery & Binding Expert', 'ஸ்டேஷனரி & பைண்டிங் நிபுணர்'),
    icon: BookOpen,
    logo: abiramiMain,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#4338ca',
    rating: 4.8,
    baseReviews: 65,
    serviceKey: 'Stationery & Binding',
    accent: '#4338ca',
    phone: '9842940548',
  },
  {
    id: 'sri-maha-ganapathi-electricals',
    name: 'S. Senthilkumar',
    role: t('Electricals & Hardware Expert', 'எலக்ட்ரிக்கல்ஸ் & ஹார்டுவேர் நிபுணர்'),
    icon: Plug,
    logo: electricalImg,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#dc2626',
    rating: 4.8,
    baseReviews: 57,
    serviceKey: 'Electrical',
    accent: '#dc2626',
    phone: '9790629888',
  },
  {
    id: 'stg-team',
    name: 'STG Team',
    role: t('Esports & Gaming Expert', 'ஈஸ்போர்ட்ஸ் & கேமிங் நிபுணர்'),
    icon: Gamepad2,
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#ef4444',
    rating: 4.9,
    baseReviews: 120,
    serviceKey: 'Esports',
    accent: '#ef4444',
    phone: '8056823309',
  },
];

// Load ONLY user-submitted reviews from localStorage and compute per-service counts
// Uses a separate key to avoid double-counting the initial sample reviews
function useReviewCounts() {
  const [counts, setCounts] = useState(() => {
    try {
      const saved = localStorage.getItem('thiran360_user_reviews');
      if (saved) {
        const reviews = JSON.parse(saved);
        return reviews.reduce((acc, r) => {
          acc[r.service] = (acc[r.service] || 0) + 1;
          return acc;
        }, {});
      }
    } catch (e) { }
    return {};
  });

  useEffect(() => {
    // Re-read when another tab submits a review
    const onStorage = (e) => {
      if (e.key === 'thiran360_user_reviews') {
        try {
          const reviews = JSON.parse(e.newValue || '[]');
          setCounts(reviews.reduce((acc, r) => {
            acc[r.service] = (acc[r.service] || 0) + 1;
            return acc;
          }, {}));
        } catch (e) { }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return counts;
}

export default function Experts() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [hovered, setHovered] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [apiServices, setApiServices] = useState([]); // All services from API
  const hasFetched = useRef(false);

  // Call attended popup state
  const [callPopup, setCallPopup] = useState(null); // { expertName, callRequestId }
  const [callFeedbackSent, setCallFeedbackSent] = useState(false);
  const callPopupTimer = useRef(null);

  const handleCallTracking = async (expertObj, phone) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Match expert by phone number (normalize: remove spaces)
    const normalizePhone = (p) => String(p || '').replace(/\s+/g, '').trim();
    const phoneNorm = normalizePhone(phone);

    const realExpert = apiData.find(a =>
      normalizePhone(a.contact_number) === phoneNorm || a.expert_name === expertObj.name
    );
    const resolvedExpertId = realExpert?.id || expertObj.id || 4;

    // Find the correct service ID for this expert from the services API
    // Look for first service that belongs to this expert
    let finalServiceId = null;
    if (apiServices.length > 0 && resolvedExpertId) {
      const matchedService = apiServices.find(
        s => s.expert?.id === resolvedExpertId
      );
      finalServiceId = matchedService?.id || null;
    }
    // Fallback: try expertObj.serviceId (rarely set)
    if (!finalServiceId) {
      const parsed = parseInt(expertObj.serviceId, 10);
      finalServiceId = isNaN(parsed) ? null : parsed;
    }
    // Last resort: use expert's first service from hardcoded phone map
    if (!finalServiceId) {
      // Use a safe non-wrong default only if nothing matched
      finalServiceId = resolvedExpertId; // Use expert ID as service ID as best guess
    }

    let callRequestId = null;
    try {
      const res = await fetch('https://api.codingboss.in/gobi360/call-request/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: parseInt(user?.id || 3, 10),
          expert: parseInt(resolvedExpertId, 10) || 4,
          service: parseInt(finalServiceId, 10),
          status: 'not_answered'
        })
      });
      const data = await res.json().catch(() => ({}));
      callRequestId = data?.id || null;
    } catch (e) {
      console.error('Call tracking error:', e);
    }

    // Open phone dialer
    window.location.href = `tel:${phone}`;

    // After 5 seconds show the "Was the call attended?" popup
    setCallFeedbackSent(false);
    clearTimeout(callPopupTimer.current);
    callPopupTimer.current = setTimeout(() => {
      setCallPopup({ expertName: expertObj.name, callRequestId, resolvedExpertId, finalServiceId });
    }, 5000);
  };

  // Send attended / not-attended response to admin
  const handleCallFeedback = async (attended) => {
    if (!callPopup) return;
    const status = attended ? 'answered' : 'not_answered';
    try {
      // Try PATCH on existing call request
      if (callPopup.callRequestId) {
        await fetch(`https://api.codingboss.in/gobi360/call-request/${callPopup.callRequestId}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
      } else {
        // Fallback: create a new call request with correct status
        await fetch('https://api.codingboss.in/gobi360/call-request/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: parseInt(user?.id || 3, 10),
            expert: parseInt(callPopup.resolvedExpertId, 10) || 4,
            service: callPopup.finalServiceId,
            status
          })
        });
      }
    } catch (e) {
      console.error('Feedback error:', e);
    }
    setCallFeedbackSent(true);
    setTimeout(() => {
      setCallPopup(null);
      setCallFeedbackSent(false);
    }, 1800);
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Fetch experts
    fetch('https://api.codingboss.in/gobi360/experts/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setApiData(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    // Fetch services to map expert → correct service ID
    fetch('https://api.codingboss.in/gobi360/services/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setApiServices(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error('Services fetch error:', err));
  }, []);

  // Scroll to the expert card if navigated via hash (e.g. /experts#expert-card-skyline-team)
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const elementId = location.hash.substring(1);
    const attemptScroll = () => {
      const el = document.getElementById(elementId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    attemptScroll();
    setTimeout(attemptScroll, 600);
    setTimeout(attemptScroll, 1200);
  }, [location, apiData]);


  const apiExperts = apiData.map(e => ({
    id: `api-${e.id}`,
    name: e.expert_name,
    role: e.category,
    icon: Users,
    logo: e.expert_image,
    tag: e.badge || 'EXPERT',
    tagColor: '#3b82f6',
    rating: 4.8,
    phone: e.contact_number,
    accent: '#3b82f6',
    isApi: true
  }));

  const expertList = [...experts(t), ...apiExperts];
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const reviewCounts = useReviewCounts();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSm = windowWidth <= 425;

  return (
    <>
      <main style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

        {/* ══════════════════════════════════════════════════
          § 1  HERO BANNER - Clean & Corporate
      ══════════════════════════════════════════════════ */}
        <section style={{
          position: 'relative',
          padding: isMobile ? '3rem 0 8rem' : '6rem 0 10rem',
          background: T.dark, // matches the footer color
          color: T.white,
          overflow: 'visible'
        }}>
          {/* Wave Bottom */}
          <div style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: isMobile ? '60px' : '150px' }}>
              <path fill="#f1f5f9" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,197.3C960,171,1056,117,1152,101.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: isMobile ? '2rem' : '3rem' }}>

              {/* Left Content */}
              <motion.div variants={stagger} initial="initial" animate="animate" style={{ flex: 1, maxWidth: 700, textAlign: 'left' }}>
                <motion.h1 variants={childFade} style={{
                  fontSize: isSm ? '2rem' : isMobile ? '2.5rem' : '3.5rem',
                  fontWeight: 800, color: T.white, letterSpacing: '-1px',
                  lineHeight: 1.15, margin: '0 0 1.25rem'
                }}>
                  {t("Find the Best Experts of 2026", "2026 இன் சிறந்த நிபுணர்களைக் கண்டறியவும்")}
                </motion.h1>

                <motion.p variants={childFade} style={{ color: '#e2e8f0', fontSize: isMobile ? '1rem' : '1.15rem', lineHeight: 1.6, margin: isMobile ? '0 auto 1.5rem' : '0 0 2rem', fontWeight: 400, maxWidth: 600 }}>
                  {t("Take advantage of our platform to compare and connect with the leading professionals in various fields. Check out their profiles, reviews, and get your tasks done today.", "பல்வேறு துறைகளில் உள்ள முன்னணி நிபுணர்களுடன் ஒப்பிட்டு இணைக்க எங்கள் தளத்தைப் பயன்படுத்திக் கொள்ளுங்கள்.")}
                </motion.p>
              </motion.div>
              {/* Right Illustration */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ flex: 0.8, display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', width: '100%' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '2rem',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? 140 : 250, height: isMobile ? 140 : 250,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Users size={isMobile ? 60 : 120} color="#cbd5e1" strokeWidth={1} />
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════
          § 2  EXPERTS GRID - Professional Directory Style
      ══════════════════════════════════════════════════ */}
        <section style={{ padding: '6rem 0', background: '#f1f5f9' }}>
          <div className="container">

            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.5px' }}>{t("Our Directory", "எங்கள் கோப்பகம்")}</h2>
              <div style={{ width: 60, height: 4, background: T.blue, margin: '1rem auto' }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}>
              <AnimatePresence>
                {expertList.map((e, i) => (
                  <motion.div
                    key={i}
                    id={`expert-card-${e.id || e.name.toLowerCase().replace(/\s+/g, '-')}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    onHoverStart={() => setHovered(i)}
                    onHoverEnd={() => setHovered(null)}
                    style={{
                      background: T.white,
                      borderRadius: 16,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1.5px solid #cbd5e1',
                      boxShadow: hovered === i ? '0 16px 32px rgba(15,23,42,0.1)' : '0 4px 16px rgba(15,23,42,0.05)',
                      transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ padding: '2rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>

                      {/* Icon Avatar */}
                      <div style={{
                        width: 64, height: 64, borderRadius: 12, flexShrink: 0,
                        background: `${e.accent}12`,
                        border: `1px solid ${e.accent}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {e.logo ? (
                          <img src={e.logo} alt={e.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <e.icon size={30} color={e.accent} strokeWidth={1.8} />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: T.dark, marginBottom: '0.2rem', lineHeight: 1.3 }}>
                          {e.name}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: T.slate, fontWeight: 500, margin: 0 }}>
                          {e.role}
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                      {/* Meta info */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem',
                        background: '#f8fafc', borderRadius: 8, border: `1px solid ${T.border}`,
                        justifyContent: 'center', flexWrap: 'wrap'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ShieldCheck size={15} color="#16a34a" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: T.slate }}>{t("Verified", "சரிபார்க்கப்பட்டது")}</span>
                        </div>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: T.dark }}>
                            {e.serviceKey
                              ? e.baseReviews + (reviewCounts[e.serviceKey] || 0)
                              : e.baseReviews}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: T.muted }}>{t("Reviews", "மதிப்புரைகள்")}</span>
                        </div>
                      </div>

                      <div style={{ flex: 1 }} />

                      {/* CTA Button */}
                      <button
                        onClick={() => handleCallTracking(e, e.phone)}
                        style={{
                          width: '100%',
                          background: hovered === i ? e.accent : T.white,
                          color: hovered === i ? T.white : T.dark,
                          padding: '0.85rem',
                          borderRadius: 8,
                          fontWeight: 600, fontSize: '0.9rem',
                          border: hovered === i ? `1px solid ${e.accent}` : `1px solid ${T.border}`, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Phone size={16} /> {t("Contact Expert", "நிபுணரைத் தொடர்பு கொள்ளுங்கள்")}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* ── Call Attended Popup Modal ─────────────────────────────── */}
      <AnimatePresence>
        {callPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              backgroundColor: 'rgba(15,23,42,0.55)',
              backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => { setCallPopup(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '1.75rem',
                padding: '2.25rem 2rem',
                maxWidth: '380px',
                width: '100%',
                boxShadow: '0 32px 80px rgba(15,23,42,0.22)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.1rem'
              }}
            >
              {callFeedbackSent ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{
                      width: 72, height: 72, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(34,197,94,0.3)'
                    }}
                  >
                    <CheckCircle2 size={38} color="white" />
                  </motion.div>
                  <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {t('Thank you for your feedback!', 'உங்கள் கருத்துக்கு நன்றி!')}
                  </p>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                    {t('Admin has been notified.', 'நிர்வாகி அறிவிக்கப்பட்டார்.')}
                  </p>
                </>
              ) : (
                <>
                  {/* Phone icon badge */}
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #bfdbfe',
                    boxShadow: '0 8px 24px rgba(59,130,246,0.15)'
                  }}>
                    <Phone size={32} color="#2563eb" strokeWidth={2} />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                      {t('Was the call attended?', 'அழைப்பு கலந்துகொண்டதா?')}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                      {t('Let us know if', 'என்னவென்று தெரியப்படுத்துங்கள்')}{' '}
                      <strong style={{ color: '#0f172a' }}>{callPopup.expertName}</strong>{' '}
                      {t('picked up your call.', 'உங்கள் அழைப்பை எடுத்தார்களா.')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.25rem' }}>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleCallFeedback(true)}
                      style={{
                        flex: 1, padding: '0.9rem',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: 'white', border: 'none', borderRadius: '1rem',
                        fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 8px 20px rgba(34,197,94,0.3)'
                      }}
                    >
                      <CheckCircle2 size={18} /> {t('Attended', 'பதிலளித்தார்')}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleCallFeedback(false)}
                      style={{
                        flex: 1, padding: '0.9rem',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white', border: 'none', borderRadius: '1rem',
                        fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 8px 20px rgba(239,68,68,0.3)'
                      }}
                    >
                      <Phone size={18} /> {t('Not Attended', 'எடுக்கவில்லை')}
                    </motion.button>
                  </div>

                  <button
                    onClick={() => setCallPopup(null)}
                    style={{
                      background: 'none', border: 'none', color: '#94a3b8',
                      fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginTop: '-0.25rem'
                    }}
                  >
                    {t('Skip for now', 'இப்போது தவிர்க்கவும்')}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
