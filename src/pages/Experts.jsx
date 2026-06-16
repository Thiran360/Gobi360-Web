import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, ShieldCheck, Phone, Building2, CircuitBoard, BookOpen, Sofa, Hammer, Code2, Briefcase, Sun, Camera, Plug, Wrench, Users, Shield, Award, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  border:    '#e2e8f0',
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

const experts = (t) => [
  {
    name: 'Skyline Team',
    role: t('Construction Specialist', 'கட்டுமான நிபுணர்'),
    icon: Building2,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#ea580c',
    rating: 4.8,
    baseReviews: 134,
    serviceKey: 'Plumbing',
    accent: '#ea580c',
    phone: '9443822122',
  },
  {
    name: 'Harichandra Projects',
    role: t('Robotics and PCB Expert', 'ரோபோட்டிக்ஸ் மற்றும் பிசிபி நிபுணர்'),
    icon: CircuitBoard,
    tag: t('EXPERT', 'நிபுணர்'),
    tagColor: '#db2777',
    rating: 4.7,
    baseReviews: 45,
    serviceKey: 'CCTV & Net',
    accent: '#db2777',
    phone: '9489364369',
  },
  {
    name: 'Surendar J',
    role: t('Master Hindi Trainer', 'மாஸ்டர் இந்தி பயிற்சியாளர்'),
    icon: BookOpen,
    tag: t('CERTIFIED', 'சான்றளிக்கப்பட்டது'),
    tagColor: '#16a34a',
    rating: 4.9,
    baseReviews: 210,
    serviceKey: 'Hindi Training',
    accent: '#16a34a',
    phone: '6397255377',
  },
  {
    name: 'Woodzone',
    role: t('Tiles and Furn Expert', 'டைல்ஸ் மற்றும் பர்னிச்சர் நிபுணர்'),
    icon: Sofa,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#ca8a04',
    rating: 4.7,
    baseReviews: 175,
    serviceKey: 'Carpentry',
    accent: '#ca8a04',
    phone: '9842943053',
  },
  {
    name: 'GV Buildtech',
    role: t('Fabrication Expert', 'ஃபேப்ரிகேஷன் நிபுணர்'),
    icon: Hammer,
    tag: t('EXPERT', 'நிபுணர்'),
    tagColor: '#475569',
    rating: 4.8,
    baseReviews: 53,
    serviceKey: 'Painting',
    accent: '#475569',
    phone: '9042967472',
  },
  {
    name: 'Manikavasagar',
    role: t('IT and Software Expert', 'IT மற்றும் மென்பொருள் நிபுணர்'),
    icon: Code2,
    tag: t('CERTIFIED', 'சரிபார்க்கப்பட்டது'),
    tagColor: '#0d9488',
    rating: 4.8,
    baseReviews: 91,
    serviceKey: 'IT & Software',
    accent: '#0d9488',
    phone: '7708805630',
  },
  {
    name: 'Saravanan',
    role: t('Tractor Specialist', 'டிராக்டர் சிறப்பு நிபுணர்'),
    icon: Wrench,
    tag: t('EXPERT', 'நிபுணர்'),
    tagColor: '#059669',
    rating: 4.8,
    baseReviews: 68,
    serviceKey: 'Tractor Service',
    accent: '#059669',
    phone: '9876543211',
  },
  {
    name: 'Sri Vinayak',
    role: t('Insurance and Career Coach', 'காப்பீடு மற்றும் தொழில் பயிற்சியாளர்'),
    icon: Briefcase,
    tag: t('CERTIFIED', 'சான்றளிக்கப்பட்டது'),
    tagColor: '#4f46e5',
    rating: 4.8,
    baseReviews: 34,
    serviceKey: 'Insurance & Career',
    accent: '#4f46e5',
    phone: '9443822123',
  },
  {
    name: 'Sun Power',
    role: t('Solar and Power Consultant', 'சோலார் மற்றும் மின்சார ஆலோசகர்'),
    icon: Sun,
    tag: t('VERIFIED', 'சரிபார்க்கப்பட்டது'),
    tagColor: '#d97706',
    rating: 4.9,
    baseReviews: 76,
    serviceKey: 'Electrical',
    accent: '#d97706',
    phone: '9488214002',
  },
  {
    name: 'Monoj Steels',
    role: t('Steel and Cement Expert', 'இரும்பு மற்றும் சிமெண்ட் நிபுணர்'),
    icon: Hammer,
    tag: t('EXPERT', 'நிபுணர்'),
    tagColor: '#dc2626',
    rating: 4.8,
    baseReviews: 88,
    serviceKey: 'Steel & Cement',
    accent: '#dc2626',
    phone: '9751094748',
  },
  {
    name: 'Majestic Studio',
    role: t('Professional Photographer', 'தொழில்முறை புகைப்படக் கலைஞர்'),
    icon: Camera,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#db2777',
    rating: 4.9,
    baseReviews: 142,
    serviceKey: 'Photography',
    accent: '#db2777',
    phone: '9842943054',
  },
  {
    name: 'Sri Sakthi',
    role: t('Appliance Repair Specialist', 'உபகரண பழுதுபார்ப்பு நிபுணர்'),
    icon: Plug,
    tag: t('VERIFIED', 'சரிபார்க்கப்பட்டது'),
    tagColor: '#0284c7',
    rating: 4.9,
    baseReviews: 119,
    serviceKey: 'AC Service',
    accent: '#0284c7',
    phone: '9042967473',
  },
  {
    name: 'C. Prakash',
    role: t('Glass & Interior Expert', 'கிளாஸ் மற்றும் இன்டீரியர் நிபுணர்'),
    icon: Building2,
    tag: t('EXPERT', 'நிபுணர்'),
    tagColor: '#0f766e',
    rating: 4.8,
    baseReviews: 82,
    serviceKey: 'Home Cleaning',
    accent: '#0f766e',
    phone: '6374822433',
  },
  {
    name: 'Prabhu & Manikandan',
    role: t('Stationery & Binding Expert', 'ஸ்டேஷனரி & பைண்டிங் நிபுணர்'),
    icon: BookOpen,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#4338ca',
    rating: 4.8,
    baseReviews: 65,
    serviceKey: 'Stationery & Binding',
    accent: '#4338ca',
    phone: '9842940548',
  },
  {
    name: 'S. Senthilkumar',
    role: t('Electricals & Hardware Expert', 'எலக்ட்ரிக்கல்ஸ் & ஹார்டுவேர் நிபுணர்'),
    icon: Plug,
    tag: t('PREMIUM', 'பிரீமியம்'),
    tagColor: '#dc2626',
    rating: 4.8,
    baseReviews: 57,
    serviceKey: 'Electrical',
    accent: '#dc2626',
    phone: '9790629888',
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
    } catch (e) {}
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
        } catch (e) {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return counts;
}

export default function Experts() {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(null);
  const expertList = experts(t);
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
        {/* Background Image: Professional business meeting/team */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
            alt="Professional team"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.3 }}
          />
          {/* Refined gradient overlay for better text readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 100%)' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
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
                  <Shield size={14} /> {t("Certified Network", "சான்றளிக்கப்பட்ட வலையமைப்பு")}
                </span>
              </motion.div>

              <motion.h1 variants={childFade} style={{ 
                fontSize: isSm ? '2.4rem' : isMobile ? '3rem' : '3.8rem', 
                fontWeight: 800, color: T.white, letterSpacing: '-1px', 
                lineHeight: 1.15, margin: '0 0 1.25rem' 
              }}>
                {t("Connect with Top", "சிறந்த நிபுணர்களுடன்")}
                <br/>
                <span style={{ color: '#60a5fa' }}>
                  {t("Industry Experts", "இணையுங்கள்")}
                </span>
              </motion.h1>

              <motion.p variants={childFade} style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, margin: isMobile ? '0 auto 2.5rem' : '0 0 2.5rem', fontWeight: 400, maxWidth: 540 }}>
                {t("Our network of vetted, experienced professionals ensures that your projects are handled with the highest standard of excellence and reliability.", "எங்கள் சரிபார்க்கப்பட்ட நிபுணர்களின் வலையமைப்பு உங்கள் திட்டங்கள் சிறந்த தரத்துடன் கையாளப்படுவதை உறுதி செய்கிறது.")}
              </motion.p>

              <motion.div variants={childFade} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <button style={{
                  background: T.blue, color: T.white, padding: '0.9rem 2rem', borderRadius: 8,
                  fontWeight: 600, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
                }} onMouseOver={e => e.currentTarget.style.background = T.blueDark} onMouseOut={e => e.currentTarget.style.background = T.blue}>
                  {t("Browse Experts", "நிபுணர்களைத் தேடுங்கள்")} <ArrowRight size={18} />
                </button>
              </motion.div>
            </motion.div>

            {/* Corporate Stats Cards - Desktop Right Side, Mobile Bottom */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{
              display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              {[
                { val: String(expertList.length), label: t('Certified Professionals', 'சான்றளிக்கப்பட்ட நிபுணர்கள்'), icon: Users, color: '#3b82f6' },
                { val: '1000+', label: t('Successfully Completed Projects', 'வெற்றிகரமாக முடிக்கப்பட்ட திட்டங்கள்'), icon: CheckCircle2, color: '#10b981' },
                { val: '4.8/5', label: t('Average Client Satisfaction', 'சராசரி வாடிக்கையாளர் திருப்தி'), icon: Star, color: '#f59e0b' },
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
                  <div style={{ padding: '2rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    
                    {/* Icon Avatar */}
                    <div style={{
                      width: 64, height: 64, borderRadius: 12, flexShrink: 0,
                      background: `${e.accent}12`,
                      border: `1px solid ${e.accent}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <e.icon size={30} color={e.accent} strokeWidth={1.8} />
                    </div>

                    <div style={{ flex: 1 }}>
                       {/* Header row: Tag and Rating */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span style={{
                          background: `${e.tagColor}15`, color: e.tagColor,
                          padding: '3px 10px', borderRadius: 4,
                          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                        }}>
                          {e.tag}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: T.darkMid }}>
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{e.rating}</span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: T.dark, marginBottom: '0.2rem', lineHeight: 1.3 }}>
                        {e.name}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: T.slate, fontWeight: 500 }}>
                        {e.role}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    {/* Meta info */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem',
                      background: '#f8fafc', borderRadius: 8, border: `1px solid ${T.border}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShieldCheck size={16} color="#16a34a" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: T.slate }}>{t("Verified", "சரிபார்க்கப்பட்டது")}</span>
                      </div>
                      <div style={{ width: 1, height: 12, background: '#cbd5e1' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: T.dark }}>
                          {e.serviceKey
                            ? e.baseReviews + (reviewCounts[e.serviceKey] || 0)
                            : e.baseReviews}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: T.muted }}>{t("Reviews", "மதிப்புரைகள்")}</span>
                      </div>
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* CTA Button */}
                    <button
                      onClick={() => window.location.href = `tel:${e.phone}`}
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
  );
}
