import React, { useState } from 'react';
import { Phone, MapPin, Smartphone, Share2, X, Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useLocation } from 'react-router-dom';

const InstagramIcon = ({ size = 18, strokeWidth = 2 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.gobi360.app';
const INSTAGRAM_URL = 'https://www.instagram.com/gobi360.in/';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=CFX3%2B8J%2C+Kullampalayam%2C+Tamil+Nadu+638476';

const Footer = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hide footer on full-page dashboard routes that have their own layout
  if (location.pathname.startsWith('/delivery-dashboard')) return null;

  const shareLink = typeof window !== 'undefined' ? window.location.href : 'https://www.gobi360.com';

  const scrollToContact = () => {
    scrollToSection('footer-contact');
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (sectionId === 'about') {
      window.location.href = '/#about';
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t('Copy this link:', 'இந்த இணைப்பை நகலெடுக்கவும்:'), shareLink);
    }
  };

  const footerIcons = [
    {
      key: 'app',
      icon: Smartphone,
      label: t('App', 'செயலி'),
      href: PLAY_STORE_URL,
      external: true,
    },
    {
      key: 'instagram',
      icon: InstagramIcon,
      label: t('Instagram', 'இன்ஸ்டாகிராம்'),
      href: INSTAGRAM_URL,
      external: true,
    },
    {
      key: 'location',
      icon: MapPin,
      label: t('Location', 'இடம்'),
      href: MAPS_URL,
      external: true,
    },
    {
      key: 'share',
      icon: Share2,
      label: t('Share', 'பகிர்'),
      action: () => setShowShareModal(true),
    },
  ];

  const iconButtonStyle = {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none',
    padding: 0,
  };

  const handleIconHover = (e, isEnter) => {
    e.currentTarget.style.backgroundColor = isEnter ? '#3b82f6' : 'rgba(255,255,255,0.05)';
    e.currentTarget.style.borderColor = isEnter ? '#3b82f6' : 'rgba(255,255,255,0.1)';
    e.currentTarget.style.transform = isEnter ? 'translateY(-2px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow = isEnter ? '0 8px 20px rgba(59, 130, 246, 0.35)' : 'none';
  };

  const footerSections = [
    {
      title: t('Quick Links', 'விரைவான இணைப்புகள்'),
      links: [
        { name: t('About Us', 'எங்களைப் பற்றி'), path: '/#about', scroll: true, scrollTarget: 'about' },
        { name: t('Our Experts', 'எங்கள் நிபுணர்கள்'), path: '/experts' },
        { name: t('Customer Reviews', 'வாடிக்கையாளர் மதிப்புரைகள்'), path: '/reviews' },
        { name: t('Privacy Policy', 'தனியுரிமைக் கொள்கை'), path: '/privacy-policy', color: '#3b82f6' },
      ]
    }
  ];

  return (
    <footer style={{ backgroundColor: '#0f172a', color: 'white', padding: '5rem 0 2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '4rem',
          marginBottom: '4rem'
        }}>
          {/* Brand & Social */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <p style={{ opacity: 0.7, lineHeight: '1.7', fontSize: '0.95rem' }}>
              {t(
                "Connecting you with certified professionals for all your service needs. Quality, trust, and excellence guaranteed.",
                "உங்கள் அனைத்து சேவைத் தேவைகளுக்கும் சான்றளிக்கப்பட்ட நிபுணர்களுடன் உங்களை இணைக்கிறோம். தரம், நம்பிக்கை மற்றும் சிறப்பு உத்தரவாதம்."
              )}
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {footerIcons.map(({ key, icon: Icon, label, href, internal, external, action }) => {
                const iconEl = <Icon size={18} strokeWidth={2} />;

                if (action) {
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-label={label}
                      title={label}
                      onClick={action}
                      style={iconButtonStyle}
                      onMouseEnter={(e) => handleIconHover(e, true)}
                      onMouseLeave={(e) => handleIconHover(e, false)}
                    >
                      {iconEl}
                    </button>
                  );
                }

                if (internal) {
                  return (
                    <Link
                      key={key}
                      to={href}
                      aria-label={label}
                      title={label}
                      style={iconButtonStyle}
                      onMouseEnter={(e) => handleIconHover(e, true)}
                      onMouseLeave={(e) => handleIconHover(e, false)}
                    >
                      {iconEl}
                    </Link>
                  );
                }

                return (
                  <a
                    key={key}
                    href={href}
                    aria-label={label}
                    title={label}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    style={iconButtonStyle}
                    onMouseEnter={(e) => handleIconHover(e, true)}
                    onMouseLeave={(e) => handleIconHover(e, false)}
                  >
                    {iconEl}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {footerSections.map(section => (
              <div key={section.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', position: 'relative' }}>
                  {section.title}
                  <span style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '30px', height: '2px', backgroundColor: '#3b82f6' }}></span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  {section.links.map(link => (
                    link.scroll ? (
                      <a
                        key={link.name}
                        href={link.path}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(link.scrollTarget || 'footer-contact');
                        }}
                        style={{
                          color: link.color || 'rgba(255,255,255,0.7)', fontSize: '0.95rem', transition: 'all 0.2s ease', textDecoration: 'none', display: 'block', cursor: 'pointer'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.color = '#3b82f6';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.color = link.color || 'rgba(255,255,255,0.7)';
                        }}
                      >
                        {link.name}
                      </a>
                    ) : (
                    <Link key={link.name} to={link.path} style={{ 
                      color: link.color || 'rgba(255,255,255,0.7)', fontSize: '0.95rem', transition: 'all 0.2s ease', textDecoration: 'none', display: 'block'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = '#3b82f6';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = link.color || 'rgba(255,255,255,0.7)';
                    }}>
                      {link.name}
                    </Link>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div id="footer-contact">
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', position: 'relative' }}>
              {t('Contact Us', 'எங்களைத் தொடர்பு கொள்ளவும்')}
              <span style={{ position: 'absolute', bottom: '-8px', left: 0, width: '30px', height: '2px', backgroundColor: '#3b82f6' }}></span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ opacity: 0.9, fontSize: '1rem', fontWeight: '600', color: 'white' }}>Technical Team</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <MapPin size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
                <span style={{ opacity: 0.8, fontSize: '0.95rem' }}>CFX3+8J, Kullampalayam, Tamil Nadu 638476</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Phone size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
                <span style={{ opacity: 0.8, fontSize: '0.95rem', fontWeight: '500' }}>9842743053</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Phone size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
                <span style={{ opacity: 0.8, fontSize: '0.95rem', fontWeight: '500' }}>7708805630</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          paddingTop: '2rem', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.875rem',
          opacity: 0.6
        }}>
          <p>© 2026 Service. {t("All rights reserved.", "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.")}</p>

        </div>
      </div>

      {/* Share Link Modal */}
      {showShareModal && (
        <div
          onClick={() => setShowShareModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', overflow: 'hidden'
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {t('Share Gobi360', 'கோபி360 ஐப் பகிரவும்')}
              </h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                aria-label={t('Close', 'மூடு')}
                style={{
                  background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>
                {t('Sharable link', 'பகிரக்கூடிய இணைப்பு')}
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.75rem 1rem'
              }}>
                <span style={{
                  flex: 1, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a',
                  wordBreak: 'break-all', lineHeight: 1.5
                }}>
                  {shareLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.35rem',
                    background: copied ? '#16a34a' : '#3b82f6', color: 'white', border: 'none',
                    borderRadius: '10px', padding: '0.55rem 0.85rem', fontSize: '0.8rem',
                    fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s ease'
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? t('Copied', 'நகலெடுக்கப்பட்டது') : t('Copy', 'நகலெடு')}
                </button>
              </div>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.share({
                        title: 'Gobi360',
                        text: t('Check out Gobi360!', 'கோபி360 ஐப் பாருங்கள்!'),
                        url: shareLink,
                      });
                    } catch {
                      // User cancelled
                    }
                  }}
                  style={{
                    width: '100%', marginTop: '1rem', padding: '0.85rem',
                    background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px',
                    fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  {t('Share via...', 'வழியாகப் பகிர்...')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
