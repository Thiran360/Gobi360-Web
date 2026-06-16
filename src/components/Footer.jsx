import React from 'react';
import { Mail, Phone, MapPin, Globe, Share2, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useLanguage();
  
  const socialLinks = [
    { icon: <Globe size={18} />, href: '#' },
    { icon: <Share2 size={18} />, href: '#' },
    { icon: <Globe size={18} />, href: '#' },
    { icon: <Share2 size={18} />, href: '#' },
  ];

  const footerSections = [
    {
      title: t('Services', 'சேவைகள்'),
      links: [
        { name: t('Home Maintenance', 'வீட்டு பராமரிப்பு'), path: '/services' },
        { name: t('IT & Software', 'ஐடி மற்றும் மென்பொருள்'), path: '/services' },
        { name: t('Security Systems', 'பாதுகாப்பு அமைப்புகள்'), path: '/services' },
        { name: t('Industrial Work', 'தொழில்துறை வேலை'), path: '/services' },
      ]
    },
    {
      title: t('Quick Links', 'விரைவான இணைப்புகள்'),
      links: [
        { name: t('About Us', 'எங்களைப் பற்றி'), path: '/experts' },
        { name: t('Our Experts', 'எங்கள் நிபுணர்கள்'), path: '/experts' },
        { name: t('Customer Reviews', 'வாடிக்கையாளர் மதிப்புரைகள்'), path: '/reviews' },
        { name: t('Contact Us', 'எங்களைத் தொடர்பு கொள்ளவும்'), path: '#' },
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
            <div style={{ display: 'flex', gap: '1rem' }}>
              {socialLinks.map((social, i) => (
                <a key={i} href={social.href} style={{ 
                  width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', position: 'relative' }}>
                {section.title}
                <span style={{ position: 'absolute', bottom: '-8px', left: 0, width: '30px', height: '2px', backgroundColor: '#3b82f6' }}></span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {section.links.map(link => (
                  <Link key={link.name} to={link.path} style={{ 
                    color: link.color || 'rgba(255,255,255,0.7)', fontSize: '0.95rem', transition: 'all 0.2s ease', textDecoration: 'none', display: 'block'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.color = '#3b82f6';
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.color = link.color || 'rgba(255,255,255,0.7)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Info */}
          <div>
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
                <span style={{ opacity: 0.8, fontSize: '0.95rem' }}>Thiran 360 AI</span>
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
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/privacy-policy" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>{t('Privacy Policy', 'தனியுரிமைக் கொள்கை')}</Link>
            <span style={{ cursor: 'pointer' }}>{t('Terms of Service', 'சேவை விதிமுறைகள்')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
