import React, { useState, useRef, useEffect } from 'react';
import {
  Smartphone, Cpu, Code2, Grid3X3, Layout, Building2, Cctv,
  HelpCircle, Wrench, ArrowUp, PaintRoller, CircuitBoard, Truck,
  ArrowRight, Star, ChevronLeft, ChevronRight, Briefcase, Sun,
  Hammer, Camera, CheckCircle2, Zap, ShieldCheck, Award,
  Clock, MapPin, Users, TrendingUp, Play, Calendar, FileText,
} from 'lucide-react';
import { services as allServices } from '../data/servicesData';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import plumberImg from '../assets/plumber_hero.png';
import acImg from '../assets/ac_service.png';
import electricalImg from '../assets/electrical.png';
import cleaningImg from '../assets/cleaning.png';
import paintingImg from '../assets/painting.png';
import meetingImg from '../assets/office_meeting_clapping.png';
import homeVideo from '../assets/home_video.mp4';
import hero1 from '../assets/hero1.jpeg';
import hero2 from '../assets/hero2.jpeg';
import hero3 from '../assets/hero3.jpeg';
import hero4 from '../assets/hero4.png';
import hero5 from '../assets/hero5.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useShop } from '../context/ShopContext';
import GalleryAnimation from '../components/ui/gallery-animation';

/* ─── Design tokens ─────────────────────────────── */
const T = {
  blue: '#3b82f6',
  blueDark: '#1d4ed8',
  blueGlow: 'rgba(59,130,246,0.18)',
  indigo: '#6366f1',
  orange: '#f97316',
  dark: '#0f172a',
  darkMid: '#1e293b',
  slate: '#475569',
  muted: '#64748b',
  border: '#e2e8f0',
  bg: '#f8fafc',
  white: '#ffffff',
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
const leftSliderImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", // food
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80", // grocery
  "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80", // fruits
  "https://images.unsplash.com/photo-1599598425947-33002570deab?w=600&q=80", // nuts
];
const rightSliderImages = [
  "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&q=80", // vegetables
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80", // sports
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80", // stationary
  "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&q=80", // wood
];

const heroSliderItems = [
  {
    id: 1,
    label: 'PREMIUM CONSTRUCTION',
    title: 'Build Your Dream Space.',
    desc: 'From planning to execution, we bring your architectural visions to life with top-tier construction professionals.',
    btn: 'Explore Builders',
    image: hero3
  },
  {
    id: 2,
    label: 'IT & SOFTWARE SOLUTIONS',
    title: 'Transform Your Digital Future.',
    desc: 'Cutting-edge IT services, software development, and tech support to scale your business to new heights.',
    btn: 'Hire Tech Experts',
    image: hero4
  },
  {
    id: 3,
    label: 'FRESH GROCERIES',
    title: 'Farm Fresh to Your Door.',
    desc: 'Get the freshest vegetables, fruits, and daily essentials delivered lightning fast to your home.',
    btn: 'Shop Groceries',
    image: hero1
  },
  {
    id: 4,
    label: 'GOURMET FOOD DELIVERY',
    title: 'Cravings Satisfied Instantly.',
    desc: 'Discover top-rated restaurants and enjoy mouth-watering meals delivered hot and fresh anywhere.',
    btn: 'Order Food',
    image: hero2
  },
  {
    id: 5,
    label: 'LUXURY EVENTS',
    title: 'Unforgettable Wedding Moments.',
    desc: 'Premium event management and wedding planners to make your special day truly magical.',
    btn: 'Plan Your Event',
    image: hero5
  },
];

export default function Home() {
  const { t, language } = useLanguage();
  const { getMyDiscount } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const myDiscount = getMyDiscount();
  const [selectedService, setSelectedService] = useState(null);
  const heroContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSm, setIsSm] = useState(window.innerWidth <= 425);
  const [apiData, setApiData] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [expertCategories, setExpertCategories] = useState([]);

  useEffect(() => {
    if (!location.hash) return;
    const sectionId = location.hash.replace('#', '');
    const timer = setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  /* Tamil names for expert categories fetched from API */
  const expertCategoryTranslations = {
    'Constructions & Related Works': 'கட்டுமானம் மற்றும் தொடர்புடைய பணிகள்',
    'IT Concerns': 'தகவல் தொழில்நுட்பம்',
    'Hardware & Electronics': 'வன்பொருள் மற்றும் மின்னுலகம்',
    'Real Estate': 'ரியல் எஸ்டேட்',
    'Travels': 'பயணம்',
    'Studio / Printing Works': 'ஸ்டூடியோ / அச்சிடு பணிகள்',
    'Commercial Services': 'வணிக சேவைகள்',
    'Vehicle Services': 'வாகன சேவைகள்',
    'Pharmacy / Lab': 'மருந்தகம் / பரிசோதனை கூடம்',
    'Wedding / Events Services': 'திருமணம் / நிகழ்வு சேவைகள்',
    'School / Academy': 'பள்ளி / அகாடமி',
    'Stationaries': 'எழுதுபொருள் மற்றும் அறிவியல் பொருட்கள்',
    'Sports': 'விளையாட்டுகள்',
    'Health Care': 'சுகாதாரம்',
    'Finance/Insurance': 'நிதி / காப்பீடு',
    'Puncture': 'பஞ்சர் ஜோட்டி',
    'Organics /Herbals': 'இயற்கை / மூலிகை பொருட்கள்',
    'Fasion / Clothing': 'ஃபேஷன் / ஆடைகள்',
    'Emergency Services': 'அவசர சேவைகள்',
    'Learning / Training': 'கல்வி / பயிற்சி',
    'Animals / Pets': 'விலங்குகள் / செல்லப்பிராணிகள்',
  };
  const [ecomCategories, setEcomCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productVariations, setProductVariations] = useState([]);
  const hasFetched = useRef(false);

  // New state for inline category experts
  const [selectedCategoryExperts, setSelectedCategoryExperts] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedProductCategoryId, setSelectedProductCategoryId] = useState(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);
  const [heroSliderIndex, setHeroSliderIndex] = useState(0);

  useEffect(() => {
    const leftInterval = setInterval(() => {
      setLeftImageIndex(prev => (prev + 1) % leftSliderImages.length);
    }, 2000);
    const rightInterval = setInterval(() => {
      setRightImageIndex(prev => (prev + 1) % rightSliderImages.length);
    }, 2300);
    const heroInterval = setInterval(() => {
      setHeroSliderIndex(prev => (prev + 1) % heroSliderItems.length);
    }, 2500);
    return () => { clearInterval(leftInterval); clearInterval(rightInterval); clearInterval(heroInterval); };
  }, []);

  // New state for inline ecom category shops
  const [selectedEcomCategoryId, setSelectedEcomCategoryId] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState(null);

  const handleCategoryClick = (catId) => {
    if (selectedCategoryId === catId) {
      setSelectedCategoryId(null); // Toggle off
      setSelectedCategoryExperts(null);
      return;
    }
    setSelectedCategoryId(catId);
    setIsCategoryLoading(true);
    fetch(`https://api.codingboss.in/gobi360/expert-categories/${catId}/experts/`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        let apiData = Array.isArray(data) ? data : data.results || [];

        let staticIds = [];
        if (catId === 1) {
          staticIds = ['skyline-builders', 'woodzone', 'monoj-steels', 'sri-jayam-glass-house'];
        } else if (catId === 2) {
          staticIds = ['thiran360ai'];
        } else if (catId === 3) {
          staticIds = ['sri-ganagathara-agency', 'sri-maha-ganapathi-electricals', 'sun-power', 'sri-sakthi-electrical'];
        } else if (catId === 6) {
          staticIds = ['sri-abirami-book-binding', 'majestic-studio'];
        } else if (catId === 8) {
          staticIds = ['saaral-motors'];
        } else if (catId === 11) {
          staticIds = ['hindi-academy'];
        } else if (catId === 12) {
          staticIds = ['sri-abirami-book-binding'];
        }

        if (staticIds.length > 0) {
          const staticExperts = allServices
            .filter(s => staticIds.includes(s.id))
            .map(s => ({
              id: s.id,
              expert_name: s.company || s.person,
              category: s.tag || 'Expert',
              expert_image: s.image,
              contact_number: s.phone,
              isStatic: true
            }));

          if (catId === 2) {
            apiData = [...staticExperts, ...apiData];
          } else {
            apiData = [...apiData, ...staticExperts];
          }
        }

        setSelectedCategoryExperts(apiData);
        setIsCategoryLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsCategoryLoading(false);
      });
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch('https://api.codingboss.in/gobi360/experts/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setApiData(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/categories/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setApiCategories(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/expert-categories/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setExpertCategories(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/shops/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setEcomCategories(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/product-categories/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setProductCategories(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/products/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/product-variations/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setProductVariations(Array.isArray(data) ? data : data.results || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let timeoutId = null;
    const h = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
        setIsSm(window.innerWidth <= 425);
      }, 150);
    };
    window.addEventListener('resize', h);
    return () => {
      window.removeEventListener('resize', h);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const updateScrollBtns = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  const scrollSvc = (d) => scrollRef.current?.scrollBy({ left: d * 380, behavior: 'smooth' });

  /* service icons */
  const iconMap = { Smartphone, Cpu, Code2, Grid3X3, Layout, Building2, Cctv, HelpCircle, Wrench, ArrowUp, PaintRoller, CircuitBoard, Truck, Briefcase, Sun, Hammer, Camera, Star };
  const pastelBg = ['#FEE2E2', '#E0F2FE', '#FDE68A', '#DBEAFE', '#F9A8D4', '#FCD34D', '#C7D2FE', '#A7F3D0', '#FFE4E1', '#F0FFF0'];
  const accentClr = ['#ef4444', '#3b82f6', '#f59e0b', '#6366f1', '#ec4899', '#f97316', '#8b5cf6', '#10b981', '#f43f5e', '#22c55e'];

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

  const apiServices = apiData.map(e => ({
    id: `api-${e.id}`,
    company: e.expert_name,
    companyTa: e.expert_name,
    phone: e.contact_number,
    isApi: true
  }));

  const mappedCategories = apiCategories.map(c => ({
    id: `api-cat-${c.id}`,
    company: c.name,
    companyTa: c.name,
    desc: 'Explore services in this category.',
    descTa: 'இந்தப் பிரிவில் உள்ள சேவைகளை ஆராயுங்கள்.',
    image: c.image_url,
    accent: '#10b981',
    tag: 'CATEGORY',
    tagTa: 'பிரிவு',
    isApiCategory: true
  }));

  const mergedServices = [...allServices, ...apiServices, ...mappedCategories];

  const services = mergedServices.map((s, i) => ({
    name: t(s.company, s.companyTa), icon: getIcon(s.company, i),
    bg: pastelBg[i % pastelBg.length], color: accentClr[i % accentClr.length], id: s.id,
  }));

  // Removed slides array as requested



  const stats = [
    { val: 10000, suffix: '+', label: t('Happy Users', 'மகிழ்ச்சியான பயனர்கள்') },
    { val: 500, suffix: '+', label: t('Partners', 'பங்காளிகள்') },
    { val: 98, suffix: '%', label: t('Satisfaction', 'திருப்தி') },
    { val: 50, suffix: '+', label: t('Cities', 'நகரங்கள்') },
  ];

  const whyUs = [
    { Icon: ShieldCheck, title: t('Verified Experts', 'சரிபார்க்கப்பட்ட நிபுணர்கள்'), desc: t('Every professional is background-checked and skill-verified.', 'ஒவ்வொரு நிபுணரும் பின்னணி சரிபார்க்கப்பட்டு திறன் உறுதி செய்யப்படுகிறது.'), accent: '#3b82f6', bg: '#eff6ff' },
    { Icon: Zap, title: t('Fast Booking', 'விரைவான முன்பதிவு'), desc: t('Book a service in under 2 minutes with instant confirmation.', '2 நிமிடங்களுக்குள் சேவையை முன்பதிவு செய்யுங்கள்.'), accent: '#f97316', bg: '#fff7ed' },
    { Icon: CheckCircle2, title: t('Transparent Pricing', 'வெளிப்படையான விலை'), desc: t('No hidden charges. Full cost visible before you book.', 'மறைமுக கட்டணங்கள் இல்லை. முன்பதிவுக்கு முன் முழு விலை தெரியும்.'), accent: '#22c55e', bg: '#f0fdf4' },
    { Icon: Award, title: t('5-Star Quality', '5-நட்சத்திர தரம்'), desc: t('Our 4.9/5 rating shows our commitment to excellence.', 'எங்களின் 4.9/5 மதிப்பீடு சிறப்புக்கான அர்ப்பணிப்பை காட்டுகிறது.'), accent: '#ec4899', bg: '#fdf2f8' },
  ];

  const steps = [
    { num: '01', emoji: '🔍', title: t('Browse Services', 'சேவைகளைத் தேடுங்கள்'), desc: t('Explore our wide range of professional services.', 'எங்கள் விரிவான தொழில்முறை சேவைகளை ஆராயுங்கள்.') },
    { num: '02', emoji: '📅', title: t('Book an Expert', 'நிபுணரை முன்பதிவு செய்யுங்கள்'), desc: t('Schedule at your convenience. Experts come to you.', 'உங்கள் வசதிக்கேற்ப திட்டமிடுங்கள். நிபுணர்கள் வருவார்கள்.') },
    { num: '03', emoji: '✅', title: t('Get It Done', 'வேலையை முடியுங்கள்'), desc: t('Sit back while our verified professionals excel.', 'சரிபார்க்கப்பட்ட நிபுணர்கள் சிறப்பாக செய்கிறார்கள்.') },
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
    <main style={{ background: T.white, overflowX: 'clip' }}>

      {/* Customer Discount Banner */}
      <AnimatePresence>
        {myDiscount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', zIndex: 100, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            <Award size={24} color="#fcd34d" />
            Special Offer: You have a {myDiscount}% discount on your next order!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          § 1 HERO (Video on Mobile, Slider on Desktop)
      ══════════════════════════════════════════════════ */}
      {isMobile ? (
        <section style={{ width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#000000' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain'
            }}
          >
            <source src="https://gobi360.in/images/Videos/home%20video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </section>
      ) : (
        <section style={{ width: '100%', aspectRatio: '21/9', background: '#f8fafc' }}>
          <GalleryAnimation items={heroSliderItems} isMobile={isMobile} />
        </section>
      )}
      {/* ══════════════════════════════════════════════════
          § 1.5 WELCOME INTRO
      ══════════════════════════════════════════════════ */}
      <section id="about" style={{ padding: isMobile ? '3rem 1.5rem' : '4rem 2rem', background: T.white, textAlign: 'center' }}>
        <div className="container" style={{ margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{
              fontSize: isMobile ? '1.6rem' : '3rem',
              fontWeight: 800,
              color: '#333333',
              marginBottom: '1.25rem',
              letterSpacing: '-0.5px',
              whiteSpace: 'nowrap'
            }}>
              {t('Welcome To Gobi360', 'கோபி360 க்கு வரவேற்கிறோம்')}
            </h1>
            <p style={{
              fontSize: isMobile ? '0.95rem' : '1.15rem',
              color: '#555555',
              lineHeight: isMobile ? 1.6 : 1.85,
              fontWeight: 400,
              margin: 0,
              maxWidth: isMobile ? '98%' : '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'justify'
            }}>
              {isMobile
                ? t(
                  "Gobi360 is your trusted multi-service platform for all home and commercial needs. From expert AC repair to home maintenance, we connect you with highly skilled professionals to deliver reliable solutions directly to your doorstep.",
                  "கோபி360 அனைத்து வீட்டு மற்றும் வணிக தேவைகளுக்கான உங்கள் நம்பகமான பல சேவை தளமாகும். ஏசி பழுதுபார்ப்பு முதல் வீட்டை பராமரிப்பது வரை, உங்கள் வீட்டு வாசலில் நம்பகமான தீர்வுகளை வழங்க மிகவும் திறமையான நிபுணர்களுடன் உங்களை இணைக்கிறோம்."
                )
                : t(
                  "Established to redefine convenience, Gobi360 is your trusted multi-service platform for all home and commercial needs. From expert AC repair and electrical work to comprehensive home appliance maintenance, we connect you with highly skilled, background-checked professionals. Guided by a philosophy of excellence and customer satisfaction, we deliver reliable, safe, and sustainable solutions directly to your doorstep. Operating with a commitment to quality, we ensure that every service meets the highest standards.",
                  "வசதியை மறுவரையறை செய்வதற்காக நிறுவப்பட்ட கோபி360, அனைத்து வீட்டு மற்றும் வணிக தேவைகளுக்கான உங்கள் நம்பகமான பல சேவை தளமாகும். நிபுணத்துவம் வாய்ந்த ஏசி பழுதுபார்ப்பு மற்றும் மின் வேலைகள் முதல் விரிவான வீட்டு உபயோகப் பொருட்கள் பராமரிப்பு வரை, மிகவும் திறமையான, பின்னணி சரிபார்க்கப்பட்ட நிபுணர்களுடன் உங்களை இணைக்கிறோம். சிறந்த சேவை மற்றும் வாடிக்கையாளர் திருப்தி என்ற தத்துவத்தால் வழிநடத்தப்பட்டு, உங்கள் வீட்டு வாசலில் நம்பகமான, பாதுகாப்பான மற்றும் நிலையான தீர்வுகளை வழங்குகிறோம். தரத்தில் அர்ப்பணிப்புடன் செயல்படுவதன் மூலம், ஒவ்வொரு சேவையும் மிக உயர்ந்த தரத்தை பூர்த்தி செய்வதை உறுதி செய்கிறோம்."
                )
              }
            </p>
          </motion.div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════
          § 3 EXPERT CATEGORIES
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '3rem 0' : '5rem 0', background: T.white }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
            <Pill>{t('Services', 'சேவைகள்')}</Pill>
            <h2 style={{ fontSize: isMobile ? '1.9rem' : '2.6rem', fontWeight: 900, color: T.dark, letterSpacing: '-1.5px', margin: '0.75rem 0 0.5rem' }}>
              {t('Explore Services', 'சேவைகளை ஆராயுங்கள்')}
            </h2>
            <p style={{ color: T.muted, fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              {t('Find exactly what you need from our wide range of services.', 'எங்கள் பல்வேறு சேவைகளில் இருந்து உங்களுக்குத் தேவையானதை சரியாகக் கண்டறியவும்.')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: isMobile ? '0.5rem' : '1.5rem',
            justifyContent: 'center'
          }}>
            {expertCategories
              .filter(cat => selectedCategoryId ? cat.id === selectedCategoryId : true)
              .map((cat, i) => (
                <React.Fragment key={cat.id}>
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => handleCategoryClick(cat.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: isMobile ? '90px' : '140px',
                      margin: '0 auto 1rem auto',
                      aspectRatio: '1 / 1',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(15,23,42,0.1)',
                      border: '4px solid #ffffff'
                    }}>
                      <img
                        src={cat.category_image || cat.image}
                        alt={cat.category_name || cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80' }}
                      />
                      {/* Subtle inner shadow overlay to make it look premium */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
                        pointerEvents: 'none'
                      }} />
                    </div>
                    <h3 style={{
                      color: T.slate,
                      fontSize: isMobile ? '0.6rem' : '0.8rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      margin: 0,
                      padding: isMobile ? '0' : '0 0.5rem',
                      letterSpacing: isMobile ? '0.5px' : '1px',
                      textTransform: 'uppercase',
                      wordBreak: 'break-word'
                    }}>
                      {language === 'ta'
                        ? (cat.category_name_ta || cat.name_ta || expertCategoryTranslations[cat.category_name?.trim()] || expertCategoryTranslations[cat.name?.trim()] || cat.category_name || cat.name)
                        : (cat.category_name || cat.name)}
                    </h3>
                  </motion.div>

                  {/* Inline Experts Display right below the clicked category */}
                  <AnimatePresence>
                    {selectedCategoryId === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        style={{
                          gridColumn: '1 / -1',
                          padding: isMobile ? '1.5rem' : '2rem',
                          background: '#f8fafc',
                          borderRadius: 24,
                          border: '1px solid #e2e8f0',
                          overflow: 'hidden',
                          marginBottom: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                          <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 800, color: T.dark, margin: 0 }}>
                            {language === 'ta'
                              ? (cat.category_name_ta || expertCategoryTranslations[cat.category_name?.trim()] || cat.category_name || cat.name)
                              : (cat.category_name || cat.name)}{' '}{t('Experts', 'நிபுணர்கள்')}
                          </h3>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedCategoryId(null); setSelectedCategoryExperts(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.slate, fontSize: '0.9rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: 8, background: 'rgba(0,0,0,0.05)' }}>
                            {t('Close', 'மூடு')}
                          </button>
                        </div>

                        {isCategoryLoading ? (
                          <div style={{ textAlign: 'center', padding: '3rem 0', color: T.slate, fontSize: '1.1rem', fontWeight: 500 }}>
                            {t('Loading experts...', 'நிபுணர்களை ஏற்றுகிறது...')}
                          </div>
                        ) : selectedCategoryExperts && selectedCategoryExperts.length > 0 ? (
                          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {selectedCategoryExperts.map((expert, j) => (
                              <motion.div
                                key={expert.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: j * 0.05 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (expert.isStatic) {
                                    navigate(`/services/${expert.id}`);
                                  } else {
                                    navigate(`/services/api-${expert.id}`);
                                  }
                                }}
                                style={{
                                  background: T.white, borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
                                  border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(15,23,42,0.1)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.05)'; }}
                              >
                                <div style={{ height: 180, position: 'relative' }}>
                                  <img src={expert.expert_image} alt={expert.expert_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.95)', padding: '4px 10px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 700, color: T.darkMid }}>
                                    {expert.category || 'EXPERT'}
                                  </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: T.dark, margin: '0 0 0.5rem 0' }}>{expert.expert_name}</h4>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.slate, fontSize: '0.85rem', fontWeight: 500 }}>
                                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> 4.9
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '3rem 0', color: T.slate, fontSize: '1.1rem', fontWeight: 500 }}>
                            {t('No experts found in this category.', 'இந்த பிரிவில் நிபுணர்கள் யாரும் இல்லை.')}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          § 4 ECOM CATEGORIES
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '3rem 0' : '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
            <Pill color={T.orange}>{t('Ecom Categories', 'ஈகாம் பிரிவுகள்')}</Pill>
            <h2 style={{ fontSize: isMobile ? '1.9rem' : '2.6rem', fontWeight: 900, color: T.dark, letterSpacing: '-1.5px', margin: '0.75rem 0 0.5rem' }}>
              {t('Explore E-commerce', 'இ-காமர்ஸ் ஆராயுங்கள்')}
            </h2>
            <p style={{ color: T.muted, fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              {t('Find top shops and products easily.', 'சிறந்த கடைகள் மற்றும் தயாரிப்புகளை எளிதாகக் கண்டறியவும்.')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: isMobile ? '0.5rem' : '1.5rem',
            justifyContent: 'center'
          }}>
            {apiCategories.map((cat, i) => (
              <motion.div
                key={`ecom-${cat.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(`/services/api-cat-${cat.id}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: isMobile ? '90px' : '140px',
                  margin: '0 auto 1rem auto',
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(15,23,42,0.1)',
                  border: '4px solid #ffffff'
                }}>
                  <img
                    src={cat.shop_image || cat.image_url}
                    alt={cat.shop_name || cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80' }}
                  />
                  {/* Subtle inner shadow overlay to make it look premium */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
                    pointerEvents: 'none'
                  }} />
                </div>
                <h3 style={{
                  color: T.slate,
                  fontSize: isMobile ? '0.6rem' : '0.8rem',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  margin: 0,
                  padding: isMobile ? '0' : '0 0.5rem',
                  letterSpacing: isMobile ? '0.5px' : '1px',
                  textTransform: 'uppercase',
                  wordBreak: 'break-word'
                }}>
                  {cat.shop_name || cat.name}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* Inline Shops Display below the categories grid */}
          <AnimatePresence>
            {selectedEcomCategoryId && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '2rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{
                  padding: isMobile ? '1.5rem' : '2rem',
                  background: '#f8fafc',
                  borderRadius: 24,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 800, color: T.dark, margin: 0 }}>
                    {apiCategories.find(c => c.id === selectedEcomCategoryId)?.name} {t('Shops', 'கடைகள்')}
                  </h3>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedEcomCategoryId(null); setSelectedShopId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.slate, fontSize: '0.9rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: 8, background: 'rgba(0,0,0,0.05)' }}>
                    {t('Close', 'மூடு')}
                  </button>
                </div>

                <div className="hide-scrollbar" style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: '1rem',
                  paddingBottom: '1rem',
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}>
                  {ecomCategories.filter(shop => shop.category === selectedEcomCategoryId).length > 0 ? (
                    ecomCategories.filter(shop => shop.category === selectedEcomCategoryId).map((shop, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedShopId(selectedShopId === shop.id ? null : shop.id);
                          setSelectedProductCategoryId(null);
                        }}
                        style={{
                          cursor: 'pointer',
                          background: T.white,
                          borderRadius: 24,
                          padding: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          border: `2px solid ${selectedShopId === shop.id ? '#1e293b' : 'transparent'}`,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          minWidth: '160px',
                          scrollSnapAlign: 'start',
                          flexShrink: 0
                        }}
                      >
                        <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                          <img src={shop.shop_image} alt={shop.shop_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80' }} />
                        </div>
                        <h4 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.3 }}>{shop.shop_name}</h4>
                      </div>
                    ))
                  ) : (
                    <div style={{ width: '100%', textAlign: 'center', padding: '2rem', color: T.muted, fontSize: '0.9rem' }}>
                      {t('No shops available in this category.', 'இந்த பிரிவில் கடைகள் எதுவும் இல்லை.')}
                    </div>
                  )}
                </div>

                {/* Product Categories for selected shop */}
                <AnimatePresence>
                  {selectedShopId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginTop: '1.5rem' }}
                    >
                      <div style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                          Refine within {ecomCategories.find(s => s.id === selectedShopId)?.shop_name}
                        </h3>
                      </div>

                      <div className="hide-scrollbar" style={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: '1rem',
                        scrollSnapType: 'x mandatory',
                        paddingBottom: '1rem',
                        WebkitOverflowScrolling: 'touch'
                      }}>
                        {productCategories.filter(p => p.shop === selectedShopId).length > 0 ? (
                          productCategories.filter(p => p.shop === selectedShopId).map((pCat, pIdx) => (
                            <div
                              key={pIdx}
                              style={{
                                cursor: 'pointer',
                                background: T.white,
                                borderRadius: 24,
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                border: `2px solid ${selectedProductCategoryId === pCat.id ? '#1e293b' : 'transparent'}`,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                minWidth: '160px',
                                scrollSnapAlign: 'start',
                                flexShrink: 0
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProductCategoryId(selectedProductCategoryId === pCat.id ? null : pCat.id);
                              }}
                            >
                              <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                <img src={pCat.image_url} alt={pCat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80' }} />
                              </div>
                              <h4 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '0.85rem', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.3 }}>{pCat.name}</h4>
                            </div>
                          ))
                        ) : (
                          <p style={{ fontSize: '0.8rem', color: T.muted, width: '100%', textAlign: 'center', margin: 0 }}>No product categories found.</p>
                        )}
                      </div>

                      {/* Products Grid */}
                      <AnimatePresence>
                        {selectedProductCategoryId && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}
                          >
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>
                              {productCategories.find(p => p.id === selectedProductCategoryId)?.name} {t('Products', 'தயாரிப்புகள்')}
                            </h3>
                            {products.filter(pr => pr.product_category === selectedProductCategoryId).length > 0 ? (
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '1.5rem',
                              }}>
                                {products.filter(pr => pr.product_category === selectedProductCategoryId).map((prod, pIdx) => (
                                  <div
                                    key={pIdx}
                                    style={{
                                      background: T.white,
                                      borderRadius: 20,
                                      overflow: 'hidden',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      border: '1px solid rgba(0,0,0,0.03)',
                                      boxShadow: '0 10px 30px -10px rgba(15,23,42,0.06)'
                                    }}
                                  >
                                    <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                                      <img
                                        src={prod.image_url}
                                        alt={prod.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80' }}
                                      />
                                    </div>
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: T.dark, marginBottom: '0.5rem' }}>
                                        {prod.name}
                                      </h3>
                                      <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                                        {prod.description || 'Premium quality product'}
                                      </p>

                                      <div style={{ flex: 1 }}>
                                        {/* Display Variations */}
                                        {productVariations.filter(v => v.product === prod.id).length > 0 && (
                                          <div style={{ marginBottom: '1rem' }}>
                                            <select
                                              style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                borderRadius: 8,
                                                border: '1px solid #cbd5e1',
                                                background: '#f8fafc',
                                                fontSize: '0.9rem',
                                                color: '#334155',
                                                outline: 'none',
                                                cursor: 'pointer'
                                              }}
                                            >
                                              {productVariations.filter(v => v.product === prod.id).map(v => (
                                                <option key={v.id} value={v.id}>
                                                  {v.variation_value} - ₹{v.price}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        )}
                                      </div>

                                      <button style={{
                                        background: T.blue, color: T.white, border: 'none', padding: '0.6rem 1rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', marginTop: 'auto'
                                      }}>
                                        {t('View Product', 'தயாரிப்பைப் பார்க்கவும்')}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ color: T.muted, textAlign: 'center', padding: '2rem' }}>No products available in this category.</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS BAR (Moved below Explore E-commerce)
      ══════════════════════════════════════════════════ */}
      <section style={{ background: '#0f172a', padding: '4.5rem 0', borderTop: '1px solid #1e293b' }}>
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
                  fontSize: isMobile ? '2.2rem' : '3rem', fontWeight: 900,
                  background: 'linear-gradient(135deg, #ffffff, #cbd5e1)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  lineHeight: 1, letterSpacing: '-1px',
                  textShadow: '0 10px 30px rgba(255,255,255,0.05)',
                  margin: '0 0 0.8rem 0'
                }}>
                  <AnimCounter to={val} suffix={suffix} />
                </p>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
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
                    padding: '2.5rem 2rem',
                    border: `1.5px solid #3b82f6`,
                    boxShadow: `0 12px 40px -10px ${accent}15, 0 4px 12px rgba(15,23,42,0.03)`,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'default',
                    position: 'relative',
                    zIndex: 1,
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = '#2563eb'; // Darker blue on hover
                    e.currentTarget.style.boxShadow = `0 24px 60px -15px ${accent}35, 0 8px 24px ${accent}20`;
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = `0 12px 40px -10px ${accent}15, 0 4px 12px rgba(15,23,42,0.03)`;
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    {/* Emoji with glowing background */}
                    <div style={{
                      width: 72, height: 72, borderRadius: 20,
                      background: `linear-gradient(135deg, ${cardBg} 0%, #ffffff 100%)`,
                      border: `1px solid ${accent}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 8px 24px ${accent}15`,
                      fontSize: '2.2rem',
                      margin: '0 auto 1.5rem',
                    }}>
                      {s.emoji}
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: accent, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                      {t('STEP', 'படி')} {s.num}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: T.dark, margin: '0.75rem 0', letterSpacing: '-0.3px' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.95rem', color: T.slate, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
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
      <section style={{ padding: '2rem 0 6rem', background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)', position: 'relative', overflow: 'hidden' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: '1.5rem' }}>
            {whyUs.map(({ Icon, title, desc, accent }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                style={{
                  background: T.white,
                  borderRadius: 16,
                  padding: '2rem 1.75rem',
                  border: `1px solid #e2e8f0`,
                  boxShadow: '0 4px 12px rgba(15,23,42,0.03)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.boxShadow = `0 20px 40px -10px ${accent}25`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.03)';
                }}
              >
                {/* Subtle top gradient accent on hover */}
                <div
                  className="hover-gradient"
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                    background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
                    opacity: 0, transition: 'opacity 0.3s ease'
                  }}
                />

                <style>{`
                  div:hover > .hover-gradient { opacity: 1 !important; }
                `}</style>

                {/* Professional Icon Container */}
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${accent}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: accent
                }}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem', letterSpacing: '-0.3px' }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, lineHeight: 1.6, margin: 0, flex: 1 }}>{desc}</p>
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
                    {[[T.blue, '#eff6ff'], [T.orange, '#fff7ed']].map(([c, bg], j) => (
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
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="#f97316" color="#f97316" />)}
                  </div>
                  <p style={{ fontSize: '0.68rem', color: T.darkMid, fontWeight: 700 }}>{t('Great service!', 'சிறந்த சேவை!')}</p>
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
              {[t('Real-time Tracking', 'நேரடி கண்காணிப்பு'), t('Instant Booking', 'உடனடி முன்பதிவு'), t('Exclusive Offers', 'சிறப்பு சலுகைகள்')].map(f => (
                <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 700, color: T.blue, background: '#eff6ff', padding: '0.35rem 0.9rem', borderRadius: 999, border: `1px solid ${T.blue}28` }}>
                  <CheckCircle2 size={12} /> {f}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
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

              <div style={{
                background: '#fff',
                padding: '0.6rem',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                border: `1px solid ${T.border}`
              }}>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://play.google.com/store/apps/details?id=in.gobi360.app"
                  alt="Gobi360 App QR Code"
                  style={{ width: 100, height: 100, display: 'block', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: T.slate, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('Scan to Download', 'பதிவிறக்க ஸ்கேன் செய்யவும்')}</span>
              </div>
            </div>
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
