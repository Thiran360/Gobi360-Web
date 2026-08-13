import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, Star, Zap, ShieldCheck, ArrowRight, Bot, Shield, CheckCircle2, ShoppingCart } from 'lucide-react';
import { services } from '../data/servicesData';
import { useLanguage } from '../context/LanguageContext';
import aiBot from '../assets/ai_bot_no_text.png';
import { ENDPOINTS, apiJson } from '../lib/api';
import { STATIC_EXPERTS_BY_CATEGORY, getCategoryLabel } from '../lib/expertCategoryMap';

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
  border: '#cbd5e1', // slightly darker border for professional look
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

let cachedApiData = [];
let cachedApiCategories = [];
let cachedApiShops = [];
let hasFetchedCache = false;

export default function Services() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId');
  const [hovered, setHovered] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSm, setIsSm] = useState(window.innerWidth <= 425);
  const [apiData, setApiData] = useState(cachedApiData);
  const [apiCategories, setApiCategories] = useState(cachedApiCategories);
  const [apiShops, setApiShops] = useState(cachedApiShops);
  const [expertCategories, setExpertCategories] = useState([]);
  const [userBills, setUserBills] = useState([]);
  const hasFetched = useRef(hasFetchedCache);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || params.get('search') || '';
    setSearchQuery(q);
    if (q) {
      const element = document.getElementById('categories');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (categoryId) {
      const timer = setTimeout(() => {
        document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [categoryId]);

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1);

      const attemptScroll = () => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };

      // Attempt immediately
      attemptScroll();
      // Attempt again after a short delay in case API data is still rendering
      setTimeout(attemptScroll, 500);
    }
  }, [location, apiData, apiCategories]);

  useEffect(() => {
    const expertUrl = categoryId
      ? `https://api.codingboss.in/gobi360/expert-categories/${categoryId}/experts/`
      : 'https://api.codingboss.in/gobi360/experts/';

    fetch(expertUrl, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => {
        let d = Array.isArray(data) ? data : data.results || data.experts || [];
        const staticIds = STATIC_EXPERTS_BY_CATEGORY[Number(categoryId)] || [];
        if (staticIds.length > 0 && categoryId) {
          const staticExperts = staticIds.map((serviceId) => {
            const match = services.find((s) => s.id === serviceId);
            if (!match) return null;
            return {
              id: match.id,
              expert_name: match.company || match.person,
              category: match.tag || 'Expert',
              expert_image: match.image,
              contact_number: match.phone,
              isStatic: true,
            };
          }).filter(Boolean);

          d = Number(categoryId) === 2 ? [...staticExperts, ...d] : [...d, ...staticExperts];
        }
        setApiData(d);
      })
      .catch(err => console.error(err));

    fetch('https://api.codingboss.in/gobi360/expert-categories/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.results || [];
        setExpertCategories(list);
      })
      .catch(err => console.error(err));

    if (!hasFetchedCache) {
      hasFetchedCache = true;
      Promise.all([
        fetch('https://api.codingboss.in/gobi360/categories/', { headers: { 'ngrok-skip-browser-warning': 'true' } }).then(res => res.json()),
        fetch('https://api.codingboss.in/gobi360/shops/', { headers: { 'ngrok-skip-browser-warning': 'true' } }).then(res => res.json())
      ])
        .then(([catsData, shopsData]) => {
          const c = Array.isArray(catsData) ? catsData : catsData.results || [];
          cachedApiCategories = c;
          setApiCategories(c);

          const s = Array.isArray(shopsData) ? shopsData : shopsData.results || [];
          cachedApiShops = s;
          setApiShops(s);
        })
        .catch(err => console.error(err));
    }

    // Fetch user bills for notification badges
    const loggedInUserStr = localStorage.getItem('user');
    if (loggedInUserStr && loggedInUserStr !== 'undefined') {
      const loggedInUser = JSON.parse(loggedInUserStr);
      if (loggedInUser.id) {
        apiJson(ENDPOINTS.customerServiceOrders(loggedInUser.id))
          .then(data => {
            if (!data) return;
            if (data.status === true && data.service_orders) {
              const apiBills = data.service_orders.map(req => ({
                id: req.id,
                status: req.status || 'pending',
                paymentStatus: req.payment_status || 'unpaid',
                expertName: req.expert?.expert_name || req.expert?.full_name || req.expert?.name || 'Expert'
              }));
              setUserBills(apiBills);
            }
          })
          .catch(err => console.error("Error fetching user bills:", err));
      }
    }
  }, [categoryId]);

  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
        setIsSm(window.innerWidth <= 425);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const categoryTranslations = {
    "Rental Spaces": "வாடகை இடங்கள்",
    "Beauty & Salon Services": "அழகு மற்றும் சலூன் சேவைகள்",
    "Fire Safety Equipment": "தீயணைப்பு சாதனங்கள்",
    "Electronics & Appliances": "எலக்ட்ரானிக்ஸ் & உபகரணங்கள்",
    "Tax Services": "வரி சேவைகள்",
    "Multi Brand Car Services": "கார் சேவைகள்",
    "Travel & Tour Services": "பயண சேவைகள்",
    "Leather Products": "தோல் பொருட்கள்",
    "Desktop Sales & Services": "கணினி விற்பனை மற்றும் சேவைகள்",
    "Insurance Services": "காப்பீட்டு சேவைகள்",
    "Ladies Tailoring": "பெண்கள் தையல்",
    "Real Estate / Rental Spaces": "ரியல் எஸ்டேட் / வாடகை இடங்கள்",
    "Real Estate": "ரியல் எஸ்டேட்",
    "Puncture & Tyre Repair": "பஞ்சர் மற்றும் டயர் பழுது",
    "Fitness & Gym": "உடற்பயிற்சி கூடம்",
    "Land Survey Services": "நில அளவை சேவைகள்",
    "Flex Printing & Signage": "ஃப்ளெக்ஸ் பிரிண்டிங்",
    "Hair Salon / Barber": "முடி திருத்தும் சேவைகள்",
    "Master Health Checkup": "முழு உடல் பரிசோதனை",
    "Tally Solutions & Services": "டாலி சேவைகள்",
    "Wood works": "மர வேலைகள்",
    "Jaggery Powder": "நாட்டுச் சர்க்கரை",
    "Farmers Market": "உழவர் சந்தை",
    "Electronics / Motors": "எலக்ட்ரானிக்ஸ் / மோட்டார்ஸ்",
    "Construction Materials": "கட்டுமானப் பொருட்கள்",
    "Legal Services": "சட்ட சேவைகள்",
    "Home Care Services": "வீட்டு பராமரிப்பு சேவைகள்",
    "Automobiles": "ஆட்டோமொபைல்ஸ்",
    "Interior & Decorators": "உட்புற அலங்காரம்",
    "Agencies & Distributors": "ஏஜென்சிகள் & விநியோகஸ்தர்கள்",
    "Wedding & Events": "திருமணம் & நிகழ்வுகள்",
    "Catering Services": "கேட்டரிங் சேவைகள்",
    "Education & Training": "கல்வி & பயிற்சி",
    "Vehicle Services": "வாகன சேவைகள்",
    "Loan Advisor": "கடன் ஆலோசகர்",
    "Home Appliences and services": "வீட்டு உபயோக பொருட்கள்",
    "Wedding Agencies ": "திருமண ஏஜென்சிகள்",
    "Furniture and Wood Works": "மரச்சாமான்கள்",
    "Manpower Consultancy": "மனிதவள ஆலோசனை",
    "Travel & Transportation": "பயணம் மற்றும் போக்குவரத்து",
    "Traditional Bone Treatment": "பாரம்பரிய எலும்பு சிகிச்சை",
    "Pet Shop": "செல்லப்பிராணி கடை",
    "Tiles & Flooring": "டைல்ஸ் மற்றும் தரைத்தளம்",
    "Animal Feeds": "கால்நடை தீவனம்",
    "Learning Platform ": "கற்றல் தளம்",
    "Emergency Service ": "அவசர சேவை"
  };

  const expertTranslations = {
    "Narpavi Ladies Hostel": "நற்பவி பெண்கள் விடுதி",
    "Infinity Womens Parlar": "இன்ஃபினிட்டி மகளிர் பார்லர்",
    "Freeze Fire": "ஃப்ரீஸ் ஃபயர்",
    "Anseena Electronics": "அன்சீனா எலக்ட்ரானிக்ஸ்",
    "Karthy Account": "கார்த்தி அக்கவுண்ட்ஸ்",
    "SS Car Care": "எஸ்.எஸ். கார் கேர்",
    "Dazzling Holiday": "டாஸ்லிங் ஹாலிடே",
    "Gupta Leathers": "குப்தா லெதர்ஸ்",
    "Yaksha Systems": "யக்ஷா சிஸ்டம்ஸ்",
    "Sundaravadivel Kotak Insurance": "சுந்தரவடிவேல் கோடக் இன்சூரன்ஸ்",
    "Sri Kantha Ladies Tailoring": "ஸ்ரீ காந்தா மகளிர் தையலகம்",
    "Vip Golden City": "விஐபி கோல்டன் சிட்டி",
    "SSS Real Estate": "எஸ்.எஸ்.எஸ். ரியல் எஸ்டேட்",
    "Ismail Puncture": "இஸ்மாயில் பஞ்சர்",
    "Deva Puncture": "தேவா பஞ்சர்",
    "K7 Gym": "கே7 ஜிம்",
    "Senthur Digital Land Survey": "செந்தூர் லேண்ட் சர்வே",
    "Balu Puncture Shop": "பாலு பஞ்சர் கடை",
    "Balu Flex": "பாலு ஃப்ளெக்ஸ்",
    "Manju Ladies Tailoring": "மஞ்சு மகளிர் தையலகம்",
    "Kovai's Haircut": "கோவைஸ் ஹேர்கட்",
    "Sri Ram Diagnostic Center": "ஸ்ரீ ராம் டயக்னாஸ்டிக் சென்டர்",
    "Sun Tech Solutions": "சன் டெக் சொல்யூஷன்ஸ்",
    "Sai Playwoods": "சாய் ப்ளைவுட்ஸ்",
    "Azhi ": "ஆழி",
    "Uyir Organic": "உயிர் ஆர்கானிக்",
    "Gayathri Agency": "காயத்ரி ஏஜென்சி",
    "Kongu Pavers & Bricks": "கொங்கு பேவர்ஸ் & பிரிக்ஸ்",
    "SS Legal Solutions": "எஸ்.எஸ். லீகல் சொல்யூஷன்ஸ்",
    "Shakazhra Home Care": "ஷகாஸ்ரா ஹோம் கேர்",
    "Sri Mithra Motors": "ஸ்ரீ மித்ரா மோட்டார்ஸ்",
    "SAT Decorators": "சாட் டெக்கரேட்டர்ஸ்",
    "Thirupathi Agency": "திருப்பதி ஏஜென்சி",
    "Thirupathi Wedding & Events": "திருப்பதி வெட்டிங் & ஈவென்ட்ஸ்",
    "Joys Catering": "ஜாய்ஸ் கேட்டரிங்",
    "G_Nest Pre School": "ஜி_நெஸ்ட் ப்ரீ ஸ்கூல்",
    "Sun Auto Works": "சன் ஆட்டோ வொர்க்ஸ்",
    "Sri Thirumalai Assosiates": "ஸ்ரீ திருமலை அசோசியேட்ஸ்",
    "Sri SaiLakshmi Homecare": "ஸ்ரீ சாய்லட்சுமி ஹோம் கேர்",
    "Sumangali Kalyanam Stores": "சுமங்கலி கல்யாணம் ஸ்டோர்ஸ்",
    "Sun Water works": "சன் வாட்டர் வொர்க்ஸ்",
    "Sri Sai Carpenter Works": "ஸ்ரீ சாய் கார்பெண்டர் வொர்க்ஸ்",
    "SB Brothers Man Power Consulting Service": "எஸ்பி பிரதர்ஸ் மேன்பவர் கன்சல்டிங்",
    "Voyager Transport": "வாயேஜர் டிரான்ஸ்போர்ட்",
    "Natarajan Elumbu Murivu": "நடராஜன் எலும்பு முறிவு",
    "Little Steps Kanel": "லிட்டில் ஸ்டெப்ஸ் கெனல்",
    "Wood Zone Tiles": "வுட் ஜோன் டைல்ஸ்",
    "Saarathy Cattle Feed": "சாரதி மாட்டுத் தீவனம்",
    "Coding Boss": "கோடிங் பாஸ்",
    "kongu Ambulance": "கொங்கு ஆம்புலன்ஸ்",
    "Raavana Ambulance": "ராவணா ஆம்புலன்ஸ்",
    "Anthiyur Ambulance": "அந்தியூர் ஆம்புலன்ஸ்",
    "Kani Ambulance": "கனி ஆம்புலன்ஸ்",
    "GRV Ambulance": "ஜி.ஆர்.வி. ஆம்புலன்ஸ்",
    "Balu Ambulance": "பாலு ஆம்புலன்ஸ்",
    "Gobi Star Ambulance": "கோபி ஸ்டார் ஆம்புலன்ஸ்",
    "Kongu Ambulance": "கொங்கு ஆம்புலன்ஸ்",
    "Star Ambulance": "ஸ்டார் ஆம்புலன்ஸ்",
    "Sankotiyan Ambulance ": "செங்கோட்டையன் ஆம்புலன்ஸ்",
    "Gobi Ambulance": "கோபி ஆம்புலன்ஸ்",
    "Osan Ambulance": "ஓசன் ஆம்புலன்ஸ்",
    "Abirami Ambulance": "அபிராமி ஆம்புலன்ஸ்"
  };

  const apiServices = apiData.map(e => ({
    id: e.isStatic ? e.id : `api-${e.id}`,
    company: e.expert_name,
    companyTa: e.expert_name_ta || expertTranslations[e.expert_name?.trim()] || e.expert_name,
    desc: e.category,
    descTa: e.category_ta || categoryTranslations[e.category?.trim()] || e.category,
    image: e.expert_image,
    accent: '#3b82f6',
    tag: e.badge || 'EXPERT',
    tagTa: e.badge_ta || (e.badge ? e.badge : 'நிபுணர்'),
    phone: e.contact_number,
    isApi: !e.isStatic,
    isStatic: !!e.isStatic,
  }));

  const ecomCategoryTranslations = {
    "Restaurants / Food": "உணவகங்கள் / உணவு",
    "Supermarket / Grocery": "சூப்பர் மார்க்கெட் / மளிகை",
    "Organic Items": "இயற்கை பொருட்கள்",
    "Clothes / Opticals": "துணிகள் / ஆப்டிகல்ஸ்"
  };

  const mappedCategories = apiCategories.map(c => ({
    id: `api-cat-${c.id}`,
    company: c.name,
    companyTa: c.name_ta || ecomCategoryTranslations[c.name?.trim()] || c.name,
    desc: 'Explore services in this category.',
    descTa: 'இந்தப் பிரிவில் உள்ள சேவைகளை ஆராயுங்கள்.',
    image: c.image_url,
    accent: '#10b981',
    tag: 'CATEGORY',
    tagTa: 'பிரிவு',
    isApiCategory: true
  }));

  const ecomShopTranslations = {
    "Sri Bannari Amman": "ஸ்ரீ பண்ணாரி அம்மன்",
    "Parasakthi Hotel": "பராசக்தி ஹோட்டல்",
    "SRM Sweets": "எஸ்.ஆர்.எம். ஸ்வீட்ஸ்",
    "PVR Super Market": "பி.வி.ஆர். சூப்பர் மார்க்கெட்",
    "Zha Super Market": "ழா சூப்பர் மார்க்கெட்",
    "Dharani Herbals": "தரணி ஹெர்பல்ஸ்",
    "NehaShri Food Court": "நேஹாஸ்ரீ ஃபுட் கோர்ட்",
    "Yazhini Collections": "யாழினி கலெக்ஷன்ஸ்",
    "Dindugal Anand Briyani": "திண்டுக்கல் ஆனந்த் பிரியாணி",
    "Sri Valli Tex": "ஸ்ரீ வள்ளி டெக்ஸ்"
  };

  const mappedApiShops = apiShops.filter(s => s.is_active).map(s => ({
    id: `api-cat-${s.category}?shop=${s.id}`,
    company: s.shop_name,
    companyTa: ecomShopTranslations[s.shop_name?.trim()] || s.shop_name,
    desc: 'Shop & Order Online',
    descTa: 'கடையின் மூலம் ஆர்டர் செய்யுங்கள்',
    image: s.shop_image,
    accent: '#f59e0b',
    tag: 'STORE',
    tagTa: 'கடை',
    isApiShop: true
  }));

  const activeExpertCategory = expertCategories.find(c => String(c.id) === String(categoryId));

  // If a category is selected, only show experts for that category.
  const mergedServices = categoryId ? [...apiServices] : [...services, ...apiServices, ...mappedApiShops, ...mappedCategories];

  const filteredServices = mergedServices.filter(s => {
    const query = searchQuery.toLowerCase();
    const nameEn = s.company?.toLowerCase() || '';
    const nameTa = s.companyTa?.toLowerCase() || '';
    const descEn = s.desc?.toLowerCase() || '';
    const descTa = s.descTa?.toLowerCase() || '';
    const tagEn = s.tag?.toLowerCase() || '';
    const tagTa = s.tagTa?.toLowerCase() || '';
    return nameEn.includes(query) || nameTa.includes(query) ||
      descEn.includes(query) || descTa.includes(query) ||
      tagEn.includes(query) || tagTa.includes(query);
  });

  return (
    <main style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* ══════════════════════════════════════════════════
          § 1  HERO BANNER - Clean & Corporate
      ══════════════════════════════════════════════════ */}
      {!categoryId && (
        <section style={{
          position: 'relative',
          padding: isMobile ? '3rem 0 6rem' : '6rem 0 10rem',
          background: T.dark, // matches the footer color
          color: T.white,
          overflow: 'visible'
        }}>
          {/* Wave Bottom */}
          <div style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 1 }}>
            <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: isMobile ? '80px' : '150px' }}>
              <path fill="#f1f5f9" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,197.3C960,171,1056,117,1152,101.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: '3rem' }}>

              {/* Left Content */}
              <motion.div variants={stagger} initial="initial" animate="animate" style={{ flex: 1, maxWidth: 700 }}>
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
                  fontSize: isSm ? '2rem' : isMobile ? '2.5rem' : '3.5rem',
                  fontWeight: 800, color: T.white, letterSpacing: '-1px',
                  lineHeight: 1.15, margin: '0 0 1.25rem'
                }}>
                  {t("Find the Perfect", "சரியான நிபுணரை")}
                  <br />
                  <span style={{ color: '#60a5fa' }}>
                    {t("Expert for Your Need", "கண்டுபிடியுங்கள்")}
                  </span>
                </motion.h1>

                <motion.p variants={childFade} style={{ color: '#e2e8f0', fontSize: '1.15rem', lineHeight: 1.6, margin: '0 0 2rem', fontWeight: 400, maxWidth: 600 }}>
                  {t("Connect directly with our verified service partners for professional, reliable solutions at your doorstep.", "தொழில்முறை, நம்பகமான தீர்வுகளுக்கு எங்கள் சரிபார்க்கப்பட்ட சேவை பங்காளிகளுடன் நேரடியாக இணையுங்கள்.")}
                </motion.p>


              </motion.div>

              {/* Corporate Stats Cards - Desktop Right Side */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{
                display: 'flex', flexDirection: 'column', gap: '1rem', flex: 0.8, width: isMobile ? '100%' : 'auto'
              }}>
                {[
                  { val: String(services.length) + "+", label: t('Service Categories', 'சேவை பிரிவுகள்'), icon: ShieldCheck, color: '#3b82f6' },
                  { val: '10k+', label: t('Verified Professionals', 'சரிபார்க்கப்பட்ட நிபுணர்கள்'), icon: Zap, color: '#10b981' },
                  { val: '4.9/5', label: t('Average Client Rating', 'சராசரி மதிப்பீடு'), icon: Star, color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                    padding: '1.25rem 1.5rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ width: 50, height: 50, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${s.color}30` }}>
                      <s.icon size={24} color={s.color} />
                    </div>
                    <div>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: T.white, lineHeight: 1.2 }}>{s.val}</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginTop: 4 }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          § 2  SERVICES GRID - Corporate Directory Style
      ══════════════════════════════════════════════════ */}
      <section id="categories" style={{ padding: categoryId ? '3rem 0 6rem' : '6rem 0', background: '#f1f5f9', minHeight: categoryId ? '80vh' : 'auto' }}>
        <div className="container">

          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.5px' }}>
              {categoryId
                ? getCategoryLabel(activeExpertCategory, language, categoryTranslations) || t("Services", "சேவைகள்")
                : searchQuery
                  ? `${t('Search Results for', 'தேடல் முடிவுகள்:')} "${searchQuery}"`
                  : t("Our Services", "எங்கள் சேவைகள்")
              }
            </h2>
            {categoryId && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                marginTop: '0.85rem', padding: '6px 18px', borderRadius: '20px',
                backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '700', fontSize: '0.9rem',
                boxShadow: '0 2px 8px rgba(30, 64, 175, 0.1)'
              }}>
                <span>{t('Filtered category', 'வடிகட்டப்பட்ட பிரிவு')}</span>
                <button
                  onClick={() => navigate('/services')}
                  style={{
                    background: '#1e40af', color: 'white', border: 'none',
                    borderRadius: '50%', width: '20px', height: '20px',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontWeight: '900', fontSize: '0.75rem', marginLeft: '4px'
                  }}
                  title={t('View all services', 'அனைத்து சேவைகளையும் காட்டு')}
                >
                  ✕
                </button>
              </div>
            )}
            {searchQuery && !categoryId && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                marginTop: '0.85rem', padding: '6px 18px', borderRadius: '20px',
                backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '700', fontSize: '0.9rem',
                boxShadow: '0 2px 8px rgba(30, 64, 175, 0.1)'
              }}>
                <span>🔍 {t('Search', 'தேடல்')}: <strong>"{searchQuery}"</strong></span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    navigate('/services');
                  }}
                  style={{
                    background: '#1e40af', color: 'white', border: 'none',
                    borderRadius: '50%', width: '20px', height: '20px',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontWeight: '900', fontSize: '0.75rem', marginLeft: '4px'
                  }}
                  title={t('Clear search', 'தேடலை அழி')}
                >
                  ✕
                </button>
              </div>
            )}
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
                    id={`service-card-${s.id}`}
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
                      borderRadius: 24,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid rgba(0,0,0,0.03)',
                      boxShadow: hovered === s.id ? '0 25px 50px -12px rgba(15,23,42,0.15)' : '0 10px 30px -10px rgba(15,23,42,0.06)',
                      transform: hovered === s.id ? 'translateY(-6px)' : 'translateY(0)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {/* Image Area - Corporate clean style */}
                    <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={s.image}
                        alt={language === 'en' ? s.company : s.companyTa}
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover',
                          transform: hovered === s.id ? 'scale(1.08)' : 'scale(1)',
                          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                      {/* Gradient Overlay for a premium touch */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.4) 0%, transparent 40%)' }} />

                      {/* Premium Tag - Minimalist */}
                      <div style={{
                        position: 'absolute', top: '1.25rem', right: '1.25rem',
                        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
                        padding: '6px 14px', borderRadius: 20,
                        display: 'flex', alignItems: 'center', gap: 6,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.4)',
                        zIndex: 2
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.accent, boxShadow: `0 0 8px ${s.accent}` }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: T.darkMid, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                          {language === 'en' ? s.tag : s.tagTa}
                        </span>
                      </div>

                      {/* Unpaid Bills Notification Badge */}
                      {userBills.filter(b => (b.expertName === (language === 'en' ? s.company : s.companyTa) || b.expertName === s.company) && (b.status === 'unpaid' || b.paymentStatus === 'unpaid')).length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          style={{
                            position: 'absolute', top: '1.25rem', left: '1.25rem',
                            backgroundColor: '#ef4444', color: 'white',
                            padding: '0.35rem 0.8rem', borderRadius: '2rem',
                            fontWeight: '900', fontSize: '0.75rem',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            boxShadow: '0 4px 12px rgba(239,68,68,0.5)', border: '2px solid white',
                            zIndex: 10
                          }}
                        >
                          <ShoppingCart size={14} />
                          {userBills.filter(b => (b.expertName === (language === 'en' ? s.company : s.companyTa) || b.expertName === s.company) && (b.status === 'unpaid' || b.paymentStatus === 'unpaid')).length}
                        </motion.div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', background: T.white }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: T.dark, lineHeight: 1.3, letterSpacing: '-0.5px' }}>
                          {language === 'en' ? s.company : s.companyTa}
                        </h3>
                      </div>

                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        {language === 'en' ? s.desc : s.descTa}
                      </p>

                      <div style={{ flex: 1 }} />

                      {/* View Details Button */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginTop: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        background: hovered === s.id ? T.blue : '#f8fafc',
                        borderRadius: 12,
                        transition: 'all 0.3s ease',
                        border: hovered === s.id ? `1px solid ${T.blue}` : '1px solid #e2e8f0'
                      }}>
                        <span style={{
                          fontSize: '0.9rem', fontWeight: 700,
                          color: hovered === s.id ? T.white : T.slate,
                          transition: 'color 0.3s ease'
                        }}>
                          {t("View Details", "விவரங்களைக் காண்க")}
                        </span>
                        <div style={{
                          color: hovered === s.id ? T.white : T.slate,
                          transition: 'all 0.3s ease',
                          transform: hovered === s.id ? 'translateX(4px)' : 'translateX(0)'
                        }}>
                          <ChevronRight size={18} strokeWidth={2.5} />
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
