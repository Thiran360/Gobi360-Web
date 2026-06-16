import React, { useState, useRef, useEffect } from 'react';
import {
  Smartphone, Cpu, Code2, Grid3X3, Layout, Building2, Cctv,
  HelpCircle, Wrench, ArrowUp, PaintRoller, CircuitBoard, Truck,
  ArrowRight, Star, ChevronLeft, ChevronRight, Briefcase, Sun,
  Hammer, Camera, CheckCircle2, Zap, ShieldCheck, Award,
  Clock, MapPin, Users, TrendingUp, Play,
} from 'lucide-react';
import { services as allServices } from '../data/servicesData';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import plumberImg from '../assets/plumber_hero.png';
import acImg from '../assets/ac_service.png';
import electricalImg from '../assets/electrical.png';
import cleaningImg from '../assets/cleaning.png';
import paintingImg from '../assets/painting.png';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

/* ─── Design tokens ─────────────────────────────── */
const T = {
  blue:      '#3b82f6',
  blueDark:  '#1d4ed8',
  blueGlow:  'rgba(59,130,246,0.18)',
  indigo:    '#6366f1',
  orange:    '#f97316',
  dark:      '#0f172a',
  darkMid:   '#1e293b',
  slate:     '#475569',
  muted:     '#94a3b8',
  border:    '#e2e8f0',
  bg:        '#f8fafc',
  white:     '#ffffff',
};

/* ─── Framer variants ────────────────────────────── */
const fadeUp = (delay = 0, duration = 0.65) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const childFade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Reusable pill label ────────────────────────── */
const Pill = ({ children, color = T.blue }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 7,
    background: `${color}14`, border: `1px solid ${color}30`,
    color, fontWeight: 800, fontSize: '0.72rem',
    textTransform: 'uppercase', letterSpacing: '1.8px',
    padding: '5px 14px', borderRadius: 999,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 0 3px ${color}30` }} />
    {children}
  </span>
);

/* ─── Animated counter ──────────────────────────── */
const AnimCounter = ({ to, suffix = '', duration = 1600 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, to, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
};

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const h = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSm     = windowWidth <= 425;

  const updateScrollBtns = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  const scrollSvc = (d) => scrollRef.current?.scrollBy({ left: d * 380, behavior: 'smooth' });

  /* service icons */
  const iconMap = { Smartphone, Cpu, Code2, Grid3X3, Layout, Building2, Cctv, HelpCircle, Wrench, ArrowUp, PaintRoller, CircuitBoard, Truck, Briefcase, Sun, Hammer, Camera, Star };
  const pastelBg  = ['#FEE2E2','#E0F2FE','#FDE68A','#DBEAFE','#F9A8D4','#FCD34D','#C7D2FE','#A7F3D0','#FFE4E1','#F0FFF0'];
  const accentClr = ['#ef4444','#3b82f6','#f59e0b','#6366f1','#ec4899','#f97316','#8b5cf6','#10b981','#f43f5e','#22c55e'];

  const getIcon = (company, i) => {
    const l = company.toLowerCase();
    if (l.includes('smart auto')) return Smartphone;
    if (l.includes('robotics')) return Cpu;
    if (l.includes('it') || l.includes('software')) return Code2;
    if (l.includes('thiran') || l.includes('ai')) return Cpu;
    if (l.includes('upvc') || l.includes('nets')) return Grid3X3;
    if (l.includes('tiles') || l.includes('furn')) return Layout;
    if (l.includes('construction')) return Building2;
    if (l.includes('cctv') || l.includes('net')) return Cctv;
    if (l.includes('hindi')) return HelpCircle;
    if (l.includes('carpentry') || l.includes('carpenter')) return Wrench;
    if (l.includes('roofing')) return ArrowUp;
    if (l.includes('painting')) return PaintRoller;
    if (l.includes('electronics') || l.includes('computer')) return CircuitBoard;
    if (l.includes('tractor')) return Truck;
    if (l.includes('finance') || l.includes('career')) return Briefcase;
    if (l.includes('solar') || l.includes('power')) return Sun;
    if (l.includes('steel') || l.includes('cement')) return Hammer;
    if (l.includes('studio') || l.includes('media')) return Camera;
    return Object.values(iconMap)[i % Object.values(iconMap).length];
  };

  const services = allServices.map((s, i) => ({
    name: t(s.company, s.companyTa), icon: getIcon(s.company, i),
    bg: pastelBg[i % pastelBg.length], color: accentClr[i % accentClr.length], id: s.id,
  }));

  const slides = [
    { title: t('Plumbing Service','பிளம்பிங் சேவை'), sub: t('Verified Experts','சரிபார்க்கப்பட்ட நிபுணர்கள்'), img: plumberImg, btn: t('Book Now','முன்பதிவு') },
    { title: t('AC Service','ஏசி சேவை'), sub: t('Expert Cooling','நிபுணர் குளிரூட்டல்'), img: acImg, btn: t('Explore','ஆராயுங்கள்') },
    { title: t('Electrical Setup','மின்சார அமைப்பு'), sub: t('Certified Wiring','சான்றளிக்கப்பட்ட வயரிங்'), img: electricalImg, btn: t('Get Quote','விலைப்புள்ளி') },
    { title: t('Home Cleaning','வீடு சுத்தம்'), sub: t('Deep Sanitization','ஆழமான சுத்திகரிப்பு'), img: cleaningImg, btn: t('Order','ஆர்டர்') },
    { title: t('Wall Painting','சுவர் பெயிண்டிங்'), sub: t('Premium Finish','பிரீமியம் பினிஷ்'), img: paintingImg, btn: t('Consult','ஆலோசனை') },
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const stats = [
    { val: 10000, suffix: '+', label: t('Happy Users','மகிழ்ச்சியான பயனர்கள்') },
    { val: 500,   suffix: '+', label: t('Partners','பங்காளிகள்') },
    { val: 98,    suffix: '%', label: t('Satisfaction','திருப்தி') },
    { val: 50,    suffix: '+', label: t('Cities','நகரங்கள்') },
  ];

  const whyUs = [
    { Icon: ShieldCheck, title: t('Verified Experts','சரிபார்க்கப்பட்ட நிபுணர்கள்'), desc: t('Every professional is background-checked and skill-verified.','ஒவ்வொரு நிபுணரும் பின்னணி சரிபார்க்கப்பட்டு திறன் உறுதி செய்யப்படுகிறது.'), accent: '#3b82f6', bg: '#eff6ff' },
    { Icon: Zap,         title: t('Fast Booking','விரைவான முன்பதிவு'), desc: t('Book a service in under 2 minutes with instant confirmation.','2 நிமிடங்களுக்குள் சேவையை முன்பதிவு செய்யுங்கள்.'), accent: '#f97316', bg: '#fff7ed' },
    { Icon: CheckCircle2,title: t('Transparent Pricing','வெளிப்படையான விலை'), desc: t('No hidden charges. Full cost visible before you book.','மறைமுக கட்டணங்கள் இல்லை. முன்பதிவுக்கு முன் முழு விலை தெரியும்.'), accent: '#22c55e', bg: '#f0fdf4' },
    { Icon: Award,       title: t('5-Star Quality','5-நட்சத்திர தரம்'), desc: t('Our 4.9/5 rating shows our commitment to excellence.','எங்களின் 4.9/5 மதிப்பீடு சிறப்புக்கான அர்ப்பணிப்பை காட்டுகிறது.'), accent: '#ec4899', bg: '#fdf2f8' },
  ];

  const steps = [
    { num: '01', emoji: '🔍', title: t('Browse Services','சேவைகளைத் தேடுங்கள்'), desc: t('Explore our wide range of professional services.','எங்கள் விரிவான தொழில்முறை சேவைகளை ஆராயுங்கள்.') },
    { num: '02', emoji: '📅', title: t('Book an Expert','நிபுணரை முன்பதிவு செய்யுங்கள்'), desc: t('Schedule at your convenience. Experts come to you.','உங்கள் வசதிக்கேற்ப திட்டமிடுங்கள். நிபுணர்கள் வருவார்கள்.') },
    { num: '03', emoji: '✅', title: t('Get It Done','வேலையை முடியுங்கள்'), desc: t('Sit back while our verified professionals excel.','சரிபார்க்கப்பட்ட நிபுணர்கள் சிறப்பாக செய்கிறார்கள்.') },
  ];

  /* ─── Button styles ──────────────────────────────── */
  const primaryBtn = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: `linear-gradient(135deg, ${T.blue} 0%, ${T.indigo} 100%)`,
    color: T.white, padding: '0.875rem 1.875rem',
    borderRadius: 14, fontWeight: 800, fontSize: '0.95rem',
    border: 'none', cursor: 'pointer',
    boxShadow: `0 8px 24px ${T.blueGlow}, 0 2px 6px rgba(99,102,241,0.2)`,
    transition: 'all 0.25s ease',
  };

  const ghostBtn = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: T.white, color: T.dark,
    padding: '0.875rem 1.875rem', borderRadius: 14,
    fontWeight: 800, fontSize: '0.95rem',
    border: `1.5px solid ${T.border}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    cursor: 'pointer', transition: 'all 0.25s ease',
  };

  /* ─────────────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────────────── */
  return (
    <main style={{ background: T.white, overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', minHeight: '92vh',
        display: 'flex', alignItems: 'center',
        padding: isMobile ? '6rem 0 4rem' : '6rem 0 5rem',
        overflow: 'hidden',
      }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* layered overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg,rgba(255,255,255,0.98) 0%,rgba(239,246,255,0.95) 42%,rgba(219,234,254,0.55) 75%,transparent 100%)' }} />
          {/* decorative blobs */}
          <div style={{ position: 'absolute', top: '-15%', right: '8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.13) 0%,transparent 68%)', filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%,transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        <div className="container" style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
          gap: isMobile ? '3rem' : '5rem',
          alignItems: 'center',
        }}>
          {/* ── Left copy ── */}
          <motion.div variants={stagger} initial="initial" animate="animate" style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <motion.div variants={childFade}>
              <Pill>{t('Premium Home Services', 'பிரீமியம் வீட்டு சேவைகள்')}</Pill>
            </motion.div>

            <motion.h1
              variants={childFade}
              style={{
                fontSize: isSm ? '2.1rem' : isMobile ? '2.6rem' : '3.6rem',
                fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.12,
                color: T.dark, margin: '1.25rem 0 1.25rem',
              }}
            >
              {t('Your Home, Our', 'உங்கள் வீடு,')}
              {' '}
              <span style={{
                background: `linear-gradient(135deg, ${T.blue}, ${T.indigo})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {t('Expertise.', 'எங்கள் நிபுணர்கள்.')}
              </span>
            </motion.h1>

            <motion.p variants={childFade} style={{
              fontSize: '1.05rem', color: T.slate, lineHeight: 1.8,
              maxWidth: isMobile ? '100%' : 470,
              margin: isMobile ? '0 auto 2rem' : '0 0 2rem',
            }}>
              {t(
                'Discover top-tier verified professionals for every home service need. Fast booking, transparent pricing, and guaranteed satisfaction.',
                'வீட்டு சேவைத் தேவைகளுக்கு சரிபார்க்கப்பட்ட நிபுணர்களைக் கண்டறியவும். விரைவான முன்பதிவு, வெளிப்படையான விலை மற்றும் திருப்தி உத்தரவாதம்.'
              )}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={childFade} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <button
                style={primaryBtn}
                onClick={() => navigate('/services')}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 36px ${T.blueGlow}`; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 8px 24px ${T.blueGlow}`; }}
              >
                {t('Explore Services', 'சேவைகளை ஆராயுங்கள்')} <ArrowRight size={17} />
              </button>
              <button
                style={ghostBtn}
                onClick={() => navigate('/experts')}
                onMouseOver={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.color = T.blue; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.dark; e.currentTarget.style.transform = ''; }}
              >
                <Users size={17} /> {t('Meet Experts', 'நிபுணர்களை சந்தியுங்கள்')}
              </button>
            </motion.div>

            {/* Trust strip */}
            <motion.div variants={childFade} style={{
              display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-start',
              marginTop: '2rem',
            }}>
              {/* Avatars */}
              <div style={{ display: 'flex' }}>
                {['#3b82f6','#6366f1','#f97316','#22c55e'].map((c, i) => (
                  <div key={i} style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: `linear-gradient(135deg,${c}cc,${c})`,
                    border: '2px solid white', marginLeft: i ? -10 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.7rem', fontWeight: 800,
                  }}>
                    {['K','R','A','M'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#f97316" color="#f97316" />)}
                </div>
                <p style={{ fontSize: '0.78rem', color: T.slate, fontWeight: 700, marginTop: 2 }}>
                  {t('Trusted by 10,000+ users', '10,000+ பயனர்களால் நம்பப்படுகிறது')}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right image card ── */}
          <motion.div {...fadeUp(0.12)} style={{ position: 'relative', height: isSm ? 320 : 480 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: 28, overflow: 'hidden',
                  boxShadow: '0 40px 80px rgba(15,23,42,0.2)',
                  border: '6px solid rgba(255,255,255,0.9)',
                }}
              >
                <img src={slides[heroIndex].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.55) 0%, transparent 55%)' }} />

                {/* Glass card at bottom */}
                <div style={{
                  position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem',
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  padding: '1rem 1.25rem', borderRadius: 18,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.7)',
                }}>
                  <div>
                    <p style={{ fontWeight: 900, color: T.dark, fontSize: '0.95rem', marginBottom: 2 }}>{slides[heroIndex].title}</p>
                    <p style={{ fontSize: '0.75rem', color: T.blue, fontWeight: 700 }}>{slides[heroIndex].sub}</p>
                  </div>
                  <button style={{ background: `linear-gradient(135deg,${T.blue},${T.indigo})`, color: T.white, padding: '0.5rem 1.1rem', borderRadius: 10, fontWeight: 800, fontSize: '0.82rem', border: 'none', cursor: 'pointer', boxShadow: `0 4px 14px ${T.blueGlow}` }}>
                    {slides[heroIndex].btn}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div style={{ position: 'absolute', bottom: '-28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => setHeroIndex(i)} style={{ width: heroIndex === i ? 24 : 7, height: 7, borderRadius: 999, background: heroIndex === i ? T.blue : T.border, border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
              ))}
            </div>

            {/* Floating badge – top-right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: -18, right: isMobile ? -8 : -24,
                background: T.white, borderRadius: 16, padding: '0.65rem 1rem',
                boxShadow: '0 12px 32px rgba(15,23,42,0.14)',
                display: 'flex', alignItems: 'center', gap: 8,
                border: `1px solid ${T.border}`,
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>🛡️</span>
              <div>
                <p style={{ fontSize: '0.68rem', fontWeight: 900, color: T.dark, lineHeight: 1.2 }}>100% Verified</p>
                <p style={{ fontSize: '0.6rem', color: T.muted, fontWeight: 600 }}>{t('Professionals', 'நிபுணர்கள்')}</p>
              </div>
            </motion.div>

            {/* Floating badge – bottom-left */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{
                position: 'absolute', bottom: 90, left: isMobile ? -8 : -28,
                background: T.white, borderRadius: 16, padding: '0.65rem 1rem',
                boxShadow: '0 12px 32px rgba(15,23,42,0.14)',
                display: 'flex', alignItems: 'center', gap: 8,
                border: `1px solid ${T.border}`,
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={17} color="#22c55e" />
              </div>
              <div>
                <p style={{ fontSize: '0.68rem', fontWeight: 900, color: T.dark }}>30-min Response</p>
                <p style={{ fontSize: '0.6rem', color: T.muted, fontWeight: 600 }}>{t('Guaranteed', 'உத்தரவாதம்')}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 2  STATS BAR
      ══════════════════════════════════════════════════ */}
      <section style={{ background: T.dark, padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '2rem' }}>
            {stats.map(({ val, suffix, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                style={{ textAlign: 'center' }}
              >
                <p style={{
                  fontSize: isMobile ? '2rem' : '2.6rem', fontWeight: 900,
                  background: `linear-gradient(135deg,${T.blue},${T.indigo})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  lineHeight: 1, letterSpacing: '-2px',
                }}>
                  <AnimCounter to={val} suffix={suffix} />
                </p>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', fontWeight: 700, marginTop: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 3  SERVICES SCROLL
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', background: T.white }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <Pill>{t('What We Offer', 'நாங்கள் வழங்குவது')}</Pill>
            <h2 style={{ fontSize: isMobile ? '1.7rem' : '2.2rem', fontWeight: 900, color: T.dark, letterSpacing: '-1.5px', margin: '0.75rem 0 0.4rem' }}>
              {t('Explore Services', 'சேவைகளை ஆராயுங்கள்')}
            </h2>
            <p style={{ color: T.muted, fontSize: '0.95rem' }}>
              {t('Find the right expert for your exact need', 'உங்கள் தேவைக்கு சரியான நிபுணரைக் கண்டறியவும்')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {[{ dir: -1, active: canScrollLeft }, { dir: 1, active: canScrollRight }].map(({ dir, active }, i) => (
              <button
                key={i}
                onClick={() => scrollSvc(dir)}
                disabled={!active}
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: active ? (dir === 1 ? `linear-gradient(135deg,${T.blue},${T.indigo})` : T.dark) : T.bg,
                  color: active ? T.white : T.muted,
                  border: `1.5px solid ${active ? 'transparent' : T.border}`,
                  boxShadow: active ? '0 6px 16px rgba(59,130,246,0.28)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: active ? 'pointer' : 'default', transition: 'all 0.22s ease',
                }}
              >
                {dir === -1 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={scrollRef} onScroll={updateScrollBtns}
          className="hide-scrollbar"
          style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', padding: isMobile ? '0.5rem 1rem 1.5rem' : '0.5rem 4rem 1.5rem' }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedService(s)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flexShrink: 0, width: 100, textAlign: 'center' }}
            >
              <div style={{
                width: 74, height: 74, borderRadius: 24,
                background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 6px 20px ${s.color}22`, border: `1.5px solid ${s.color}18`,
                transition: 'all 0.25s',
              }}>
                <s.icon size={30} color={s.color} />
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: T.darkMid, lineHeight: 1.3 }}>{s.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 4  FOOD DELIVERY BANNER
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '3rem 0', background: T.bg }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', borderRadius: 28, overflow: 'hidden',
              background: 'linear-gradient(130deg,#0f172a 0%,#1e293b 55%,#1a3a6b 100%)',
              display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center',
              boxShadow: '0 32px 64px rgba(15,23,42,0.22)',
            }}
          >
            {/* Glow blobs */}
            <div style={{ position: 'absolute', top: '-60px', right: '28%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.18) 0%,transparent 68%)' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '15%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%)' }} />

            <div style={{ flex: 1, padding: isMobile ? '3rem 2rem' : '4.5rem 4.5rem', zIndex: 1 }}>
              <span style={{
                display: 'inline-block', background: 'rgba(249,115,22,0.15)', color: '#f97316',
                padding: '5px 14px', borderRadius: 999, fontWeight: 800, fontSize: '0.72rem',
                textTransform: 'uppercase', letterSpacing: '1.8px',
                border: '1px solid rgba(249,115,22,0.28)', marginBottom: '1.25rem',
              }}>
                {t('Food Delivery', 'உணவு விநியோகம்')}
              </span>
              <h2 style={{ fontSize: isMobile ? '2rem' : '2.9rem', fontWeight: 900, color: T.white, lineHeight: 1.18, letterSpacing: '-1.5px', marginBottom: '1rem' }}>
                {t('Hungry?', 'பசியாக உள்ளதா?')}
                {' '}
                <span style={{ color: '#f97316' }}>{t("We've got you.", 'நாங்கள் இருக்கிறோம்.')}</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.8, maxWidth: 420, marginBottom: '2.5rem' }}>
                {t('Explore top restaurants, discover delicious meals, and get them delivered hot and fresh.', 'சிறந்த உணவகங்களை ஆராயுங்கள், சுவையான உணவுகளைக் கண்டறியுங்கள்.')}
              </p>
              <button
                onClick={() => navigate('/services/food-delivery-express')}
                style={{
                  background: 'linear-gradient(135deg,#f97316,#fb923c)',
                  color: T.white, border: 'none',
                  padding: '1rem 2.25rem', borderRadius: 14,
                  fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 10px 28px rgba(249,115,22,0.42)',
                  transition: 'all 0.25s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(249,115,22,0.52)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 28px rgba(249,115,22,0.42)'; }}
              >
                {t('Order Food Now', 'இப்போது உணவு ஆர்டர் செய்யுங்கள்')} <ArrowRight size={19} />
              </button>
            </div>

            <div style={{ flex: 1, height: isMobile ? 240 : '100%', minHeight: isMobile ? 'auto' : 420, position: 'relative', width: '100%' }}>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                alt="Food" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
              <div style={{ position: 'absolute', inset: 0, background: isMobile ? 'linear-gradient(to top,#0f172a,transparent 60%)' : 'linear-gradient(to right,#1e293b,transparent 52%)' }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 5  HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background blobs */}
        <div style={{ position: 'absolute', top: '-60px', left: '-40px', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Pill>{t('Simple Process', 'எளிமையான முறை')}</Pill>
            <h2 style={{ fontSize: isMobile ? '1.9rem' : '2.6rem', fontWeight: 900, color: T.dark, letterSpacing: '-1.5px', margin: '0.75rem 0 0.5rem' }}>
              {t('How It Works', 'இது எப்படி வேலை செய்கிறது')}
            </h2>
            <p style={{ color: T.muted, fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              {t('Get expert help in just three easy steps', 'மூன்று எளிய படிகளில் நிபுணர் உதவியைப் பெறுங்கள்')}
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '1.5rem', position: 'relative' }}>
            {/* Dashed connector line (desktop only) */}
            {!isMobile && (
              <div style={{ position: 'absolute', top: 52, left: 'calc(16.7% + 2rem)', right: 'calc(16.7% + 2rem)', height: 2, borderTop: `2.5px dashed ${T.border}`, zIndex: 0 }} />
            )}
            {steps.map((s, i) => {
              const accent = ['#3b82f6', '#8b5cf6', '#10b981'][i];
              const cardBg = ['#eff6ff', '#f5f3ff', '#ecfdf5'][i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  style={{
                    background: T.white,
                    borderRadius: 24,
                    padding: '0',
                    border: `1.5px solid ${T.border}`,
                    boxShadow: '0 6px 28px rgba(15,23,42,0.07)',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1,
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = accent + '60';
                    e.currentTarget.style.boxShadow = `0 20px 50px ${accent}25`;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.boxShadow = '0 6px 28px rgba(15,23,42,0.07)';
                  }}
                >
                  {/* Colored top strip */}
                  <div style={{ height: 6, background: `linear-gradient(90deg, ${accent}, ${accent}99)` }} />

                  <div style={{ padding: '1.875rem' }}>
                    {/* Emoji with glowing background */}
                    <div style={{
                      width: 60, height: 60, borderRadius: 18,
                      background: cardBg,
                      border: `1.5px solid ${accent}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '1.25rem',
                      boxShadow: `0 6px 20px ${accent}20`,
                      fontSize: '1.8rem',
                      margin: '0 auto 1.25rem',
                    }}>
                      {s.emoji}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 900, color: accent, letterSpacing: 2, textTransform: 'uppercase' }}>
                        {t('STEP', 'படி')} {s.num}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: T.dark, margin: '0.5rem 0 0.6rem', letterSpacing: '-0.3px' }}>{s.title}</h3>
                      <p style={{ fontSize: '0.83rem', color: T.muted, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>

                      {/* Bottom accent */}
                      <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <div style={{ width: 28, height: 3, borderRadius: 99, background: `linear-gradient(90deg, ${accent}, ${accent}66)` }} />
                        <div style={{ width: 8, height: 3, borderRadius: 99, background: accent + '33' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 6  WHY CHOOSE US
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Pill>{t('Our Advantage', 'எங்கள் சிறப்பு')}</Pill>
            <h2 style={{ fontSize: isMobile ? '1.9rem' : '2.6rem', fontWeight: 900, color: T.dark, letterSpacing: '-1.5px', margin: '0.75rem 0 0.5rem' }}>
              {t('Why Choose Us', 'ஏன் எங்களைத் தேர்ந்தெடுக்க வேண்டும்')}
            </h2>
            <p style={{ color: T.muted, fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
              {t('Trusted by thousands across the region', 'இப்பகுதி முழுவதும் ஆயிரக்கணக்கானோரால் நம்பப்படுகிறது')}
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '1.5rem' }}>
            {whyUs.map(({ Icon, title, desc, accent, bg: cardBg }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                whileHover={{ y: -10, scale: 1.03 }}
                style={{
                  background: T.white,
                  borderRadius: 24,
                  padding: '0',
                  border: `1.5px solid ${T.border}`,
                  boxShadow: '0 6px 28px rgba(15,23,42,0.07)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  overflow: 'hidden',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = accent + '60';
                  e.currentTarget.style.boxShadow = `0 20px 50px ${accent}25`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(15,23,42,0.07)';
                }}
              >
                {/* Colored top strip */}
                <div style={{ height: 6, background: `linear-gradient(90deg, ${accent}, ${accent}99)` }} />

                <div style={{ padding: '1.875rem' }}>
                  {/* Icon with glowing background */}
                  <div style={{
                    width: 60, height: 60, borderRadius: 18,
                    background: cardBg,
                    border: `1.5px solid ${accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                    boxShadow: `0 6px 20px ${accent}20`,
                  }}>
                    <Icon size={27} color={accent} strokeWidth={2} />
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: T.dark, marginBottom: '0.6rem', letterSpacing: '-0.3px' }}>{title}</h3>
                  <p style={{ fontSize: '0.83rem', color: T.muted, lineHeight: 1.7, margin: 0 }}>{desc}</p>

                  {/* Bottom accent */}
                  <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 28, height: 3, borderRadius: 99, background: `linear-gradient(90deg, ${accent}, ${accent}66)` }} />
                    <div style={{ width: 8, height: 3, borderRadius: 99, background: accent + '33' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 7  APP DOWNLOAD
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '5.5rem 0', background: T.white, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -60, width: 560, height: 560, borderRadius: '50%', background: `radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 68%)`, filter: 'blur(28px)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -60, width: 420, height: 420, borderRadius: '50%', background: `radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)`, filter: 'blur(40px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', alignItems: 'center', gap: isMobile ? '3rem' : '6rem' }}>

          {/* Phone mockup */}
          <motion.div initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              {/* Phone shell */}
              <div style={{
                width: 255, height: 525, borderRadius: 44,
                background: T.dark,
                padding: 10, boxShadow: `0 50px 100px rgba(15,23,42,0.22), 0 0 0 1px rgba(255,255,255,0.05) inset`,
              }}>
                {/* Screen */}
                <div style={{ width: '100%', height: '100%', borderRadius: 36, background: '#f1f5f9', overflow: 'hidden', position: 'relative' }}>
                  {/* Notch */}
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 90, height: 26, background: T.dark, borderRadius: '0 0 16px 16px', zIndex: 10 }} />

                  <div style={{ padding: '3rem 1rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* App header row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg,${T.blue},${T.indigo})`, flexShrink: 0 }} />
                      <div>
                        <div style={{ height: 10, background: '#cbd5e1', borderRadius: 5, width: 70, marginBottom: 5 }} />
                        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, width: 48 }} />
                      </div>
                    </div>

                    {/* Banner */}
                    <div style={{ height: 110, borderRadius: 18, background: `linear-gradient(135deg,${T.blue},${T.indigo})`, display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                      <div>
                        <div style={{ height: 10, background: 'rgba(255,255,255,0.55)', borderRadius: 5, width: 70, marginBottom: 6 }} />
                        <div style={{ height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 4, width: 90 }} />
                      </div>
                    </div>

                    {/* Mini cards */}
                    {[[T.blue,'#eff6ff'],[T.orange,'#fff7ed']].map(([c, bg], j) => (
                      <div key={j} style={{ height: 64, background: T.white, borderRadius: 14, display: 'flex', alignItems: 'center', padding: '0 0.85rem', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ height: 9, background: '#e2e8f0', borderRadius: 4, width: '70%', marginBottom: 5 }} />
                          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, width: '50%' }} />
                        </div>
                        <div style={{ width: 26, height: 26, borderRadius: 8, background: c + '20' }} />
                      </div>
                    ))}

                    <div style={{ flex: 1 }} />

                    {/* Bottom nav */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
                      {[T.blue, '#cbd5e1', '#cbd5e1', '#cbd5e1'].map((c, k) => (
                        <div key={k} style={{ width: 22, height: 22, borderRadius: 6, background: c, opacity: c === T.blue ? 1 : 0.45 }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating review card on phone */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', bottom: 80, right: -48,
                  background: T.white, borderRadius: 14, padding: '0.7rem 1rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  border: `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'center', gap: 10, minWidth: 150,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${T.blue},${T.indigo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: T.white, fontSize: '0.75rem', fontWeight: 900 }}>K</div>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="#f97316" color="#f97316" />)}
                  </div>
                  <p style={{ fontSize: '0.68rem', color: T.darkMid, fontWeight: 700 }}>Great service!</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div initial={{ opacity: 0, x: 36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
            <Pill color={T.indigo}>{t('Mobile App', 'மொபைல் செயலி')}</Pill>
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', fontWeight: 900, color: T.dark, letterSpacing: '-2px', margin: '0.875rem 0 1.1rem', lineHeight: 1.15 }}>
              {t('Download the', 'பதிவிறக்கவும்')}{' '}
              <span style={{ background: `linear-gradient(135deg,${T.blue},${T.indigo})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('Gobi 360 App', 'கோபி 360 செயலி')}
              </span>
            </h2>
            <p style={{ color: T.muted, fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 460, margin: isMobile ? '0 auto 2rem' : '0 0 2rem' }}>
              {t('Experience seamless service booking on the go with exclusive offers, real-time tracking, and instant support.', 'பயணத்தின்போது தடையற்ற சேவையை முன்பதிவு செய்து அனுபவியுங்கள்.')}
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2.25rem', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {[t('Real-time Tracking','நேரடி கண்காணிப்பு'), t('Instant Booking','உடனடி முன்பதிவு'), t('Exclusive Offers','சிறப்பு சலுகைகள்')].map(f => (
                <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 700, color: T.blue, background: '#eff6ff', padding: '0.35rem 0.9rem', borderRadius: 999, border: `1px solid ${T.blue}28` }}>
                  <CheckCircle2 size={12} /> {f}
                </span>
              ))}
            </div>

            <button
              onClick={() => window.open('https://play.google.com/store/apps/details?id=in.gobi360.app', '_blank')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 14,
                background: T.dark, color: T.white,
                padding: '0.95rem 1.875rem', borderRadius: 16,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 12px 28px rgba(15,23,42,0.2)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 22px 44px rgba(15,23,42,0.28)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 12px 28px rgba(15,23,42,0.2)'; }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path d="M4 2.5C4 2 4.4 1.7 4.9 1.9L20.6 11.1C21.1 11.4 21.1 12.1 20.6 12.4L4.9 21.6C4.4 21.9 4 21.5 4 21V2.5Z" fill="#34A853" />
                <path d="M4 2.5V21L13.5 11.7L4 2.5Z" fill="#4285F4" />
                <path d="M4 2.5L13.5 11.7L20.6 12.4L4.9 1.9C4.4 1.7 4 2 4 2.5Z" fill="#EA4335" />
                <path d="M4 21L13.5 11.7L20.6 11.1L4.9 21.6C4.4 21.9 4 21.5 4 21Z" fill="#FBBC04" />
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>{t('GET IT ON', 'இதிலிருந்து பெறவும்')}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.5px', marginTop: 1 }}>Google Play</div>
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 8  SERVICE MODAL
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.72)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={e => e.stopPropagation()}
              style={{ background: T.white, borderRadius: 28, padding: '3rem', width: '100%', maxWidth: 420, textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.24)' }}
            >
              <div style={{ width: 82, height: 82, borderRadius: 26, background: selectedService.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.75rem', boxShadow: `0 12px 30px ${selectedService.color}28` }}>
                <selectedService.icon size={40} color={selectedService.color} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: T.dark, marginBottom: '0.75rem', letterSpacing: '-1px' }}>{selectedService.name}</h2>
              <p style={{ color: T.muted, lineHeight: 1.75, marginBottom: '2.25rem' }}>
                {t(`Professional ${selectedService.name} services tailored for your needs.`, `உங்கள் தேவைகளுக்கு ஏற்ப தொழில்முறை ${selectedService.name} சேவைகள்.`)}
              </p>
              <button
                onClick={() => { setSelectedService(null); if (selectedService.id) navigate(`/services/${selectedService.id}`); }}
                style={{
                  background: `linear-gradient(135deg,${T.blue},${T.indigo})`,
                  color: T.white, padding: '1rem 2rem', borderRadius: 14, fontWeight: 900, width: '100%',
                  border: 'none', cursor: 'pointer', fontSize: '1rem',
                  boxShadow: `0 10px 28px ${T.blueGlow}`,
                  transition: 'all 0.25s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 16px 36px ${T.blueGlow}`; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 10px 28px ${T.blueGlow}`; }}
              >
                {t('View Details', 'விவரங்களைக் காண்க')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
