import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Languages, Menu, X, Zap, Home, Users, LayoutGrid, Star, User, LogIn, UserPlus } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { services } from '../data/servicesData';
import logo from '../assets/gobi360-logo.png';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isLoggedIn } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = services.filter(service => {
      const company = (language === 'en' ? service.company : service.companyTa).toLowerCase();
      const desc = (language === 'en' ? service.desc : service.descTa).toLowerCase();
      const tag = (language === 'en' ? service.tag : service.tagTa).toLowerCase();

      const featuresMatch = service.features.some(f => {
        const title = (language === 'en' ? f.title : f.titleTa).toLowerCase();
        return title.includes(query);
      });

      return company.includes(query) || desc.includes(query) || tag.includes(query) || featuresMatch;
    });

    setSearchResults(filtered);
  }, [searchQuery, language]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 425;


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('Home', 'முகப்பு'), path: '/', icon: Home },
    { name: t('Experts', 'நிபுணர்கள்'), path: '/experts', icon: Users },
    { name: t('Services', 'சேவைகள்'), path: '/services', icon: LayoutGrid },
    { name: t('Reviews', 'மதிப்புரைகள்'), path: '/reviews', icon: Star },
    { name: t('Profile', 'சுயவிவரம்'), path: '/profile', icon: User },
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(15, 23, 42, 0.08)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div className="container" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: scrolled ? '0.75rem 1.5rem' : '1.15rem 1.5rem',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isSmallMobile ? '0.25rem' : '0.5rem' }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Menu size={24} color="#0f172a" />
              </button>
            )}

            {/* Brand */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src={logo} 
                alt="Gobi 360 Logo" 
                style={{ 
                  height: isMobile ? '55px' : '75px', 
                  objectFit: 'contain',
                  transition: 'all 0.3s ease'
                }} 
              />
            </Link>
          </div>

          {/* Global Search Bar - Hidden on mobile, visible on desktop */}
          {!isMobile && location.pathname !== '/services/food-delivery-express' && (
            <div style={{ flex: 1, maxWidth: '480px', margin: '0 2.5rem', position: 'relative' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center',
                  backgroundColor: scrolled ? '#f8fafc' : 'rgba(241, 245, 249, 0.8)',
                  padding: '0.65rem 1.25rem', borderRadius: '1.5rem',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                }}
                onFocusCapture={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.backgroundColor = scrolled ? '#f8fafc' : 'rgba(241, 245, 249, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.02)';
                }}
              >
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("Search services...", "சேவைகளைத் தேடு...")}
                  style={{
                    flex: 1, padding: '0 0.85rem', fontSize: '0.95rem',
                    color: '#1e293b', background: 'transparent', border: 'none', outline: 'none',
                    fontWeight: '500'
                  }}
                />
                {searchQuery && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                    <X
                      size={16}
                      color="#94a3b8"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSearchQuery('')}
                    />
                  </motion.div>
                )}
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 12px)', left: 0, right: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '1.5rem',
                      boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.2)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      maxHeight: '420px', overflowY: 'auto', zIndex: 1001,
                      padding: '0.85rem', backdropFilter: 'blur(10px)'
                    }}
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map(service => (
                        <Link
                          key={service.id}
                          to={`/services/${service.id}`}
                          onClick={() => setSearchQuery('')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '0.9rem', borderRadius: '1rem',
                            textDecoration: 'none', color: 'inherit',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0,
                            backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0'
                          }}>
                            <img src={service.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                              {language === 'en' ? service.company : service.companyTa}
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0', fontWeight: '500' }}>
                              {language === 'en' ? service.desc : service.descTa}
                            </p>
                          </div>
                          <div style={{
                            fontSize: '0.7rem', fontWeight: '900', padding: '5px 10px',
                            borderRadius: '8px', backgroundColor: service.accent + '15', color: service.accent,
                            textTransform: 'uppercase', letterSpacing: '0.5px'
                          }}>
                            {language === 'en' ? service.tag : service.tagTa}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
                        <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
                          <Search size={32} style={{ margin: '0 auto' }} />
                        </div>
                        <p style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                          {t("No services found", "சேவைகள் எதுவும் கிடைக்கவில்லை")}
                        </p>
                        <p style={{ fontSize: '0.85rem', marginTop: '6px', fontWeight: '500' }}>
                          {t("Try searching for something else", "வேறு ஏதாவது தேட முயற்சிக்கவும்")}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}


          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexShrink: 0 }}>
            {!isMobile && (
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                {navItems.map(item => (
                  <Link
                    key={item.name}
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      color: location.pathname === item.path ? '#3b82f6' : '#475569',
                      fontWeight: '800',
                      fontSize: '0.95rem',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      padding: '0.5rem 0.25rem'
                    }}
                    onMouseOver={e => !(location.pathname === item.path) && (e.currentTarget.style.color = '#0f172a')}
                    onMouseOut={e => !(location.pathname === item.path) && (e.currentTarget.style.color = '#475569')}
                  >
                    {item.name}
                    {location.pathname === item.path && (
                      <motion.span
                        layoutId="navUnderline"
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          left: 0, right: 0, height: '3px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '999px',
                        }}
                      />
                    )}
                  </Link>
                ))}
                <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>
              </div>
            )}


            {/* Language Switch Toggle */}
            <div
              onClick={toggleLanguage}
              style={{
                width: '84px',
                height: '36px',
                backgroundColor: '#f1f5f9',
                borderRadius: '999px',
                padding: '3px',
                cursor: 'pointer',
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                border: '1px solid #e2e8f0',
                userSelect: 'none',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                fontSize: '0.65rem',
                fontWeight: '900',
                zIndex: 1,
                pointerEvents: 'none',
                padding: '0 6px'
              }}>
                <span style={{ color: language === 'en' ? 'white' : '#64748b', transition: 'color 0.3s ease' }}>EN</span>
                <span style={{ color: language === 'ta' ? 'white' : '#64748b', transition: 'color 0.3s ease' }}>தமிழ்</span>
              </div>

              <motion.div
                layout
                initial={false}
                animate={{ x: language === 'en' ? 0 : 40 }}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                style={{
                  width: '38px',
                  height: '28px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  zIndex: 0,
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                }}
              />
            </div>

            {isLoggedIn ? (
              <Link to="/profile" style={{
                display: isSmallMobile ? 'none' : 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.5rem 1.15rem',
                borderRadius: '1.25rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.08)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  fontSize: '0.9rem', fontWeight: '900', border: '2px solid white',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
                }}>
                  {user?.name?.[0].toUpperCase()}
                </div>
                <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.9rem' }}>{user?.name}</span>
              </Link>
            ) : (
              <Link to="/login" style={{
                padding: '0.65rem 1.4rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                borderRadius: '1rem',
                fontWeight: '900',
                fontSize: '0.9rem',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: isSmallMobile ? 'none' : 'block'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                }}>
                {t("Login", "உள்நுழை")}
              </Link>
            )}

            {/* Notification bell removed */}
          </nav>
        </div>

      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, bottom: 0,
              width: isSmallMobile ? '85%' : '320px',
              height: '100vh',
              backgroundColor: '#ffffff',
              zIndex: 2000,
              boxShadow: '25px 0 80px rgba(15, 23, 42, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Sidebar Header */}
            <div style={{
              padding: '1.5rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f1f5f9',
              background: 'linear-gradient(to right, #ffffff, #f8fafc)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={logo} 
                  alt="Gobi 360 Logo" 
                  style={{ height: '50px', objectFit: 'contain' }} 
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.6rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  color: '#64748b'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              {/* Mobile Search Bar */}
              {location.pathname !== '/services/food-delivery-express' && (
              <div style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f1f5f9',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid #e2e8f0',
                }}>
                  <Search size={18} color="#94a3b8" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("Search services...", "சேவைகளைத் தேடு...")}
                    style={{
                      flex: 1, padding: '0 0.75rem', fontSize: '0.95rem',
                      color: '#1e293b', background: 'transparent', border: 'none', outline: 'none',
                      fontWeight: '600'
                    }}
                  />
                  {searchQuery && (
                    <X
                      size={18}
                      color="#94a3b8"
                      onClick={() => setSearchQuery('')}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </div>

                {/* Mobile Search Results */}
                {searchQuery && (
                  <div style={{
                    marginTop: '1rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {searchResults.length > 0 ? (
                      searchResults.map(service => (
                        <Link
                          key={service.id}
                          to={`/services/${service.id}`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setSearchQuery('');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0.75rem',
                            borderBottom: '1px solid #f8fafc',
                            textDecoration: 'none'
                          }}
                        >
                          <img src={service.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                              {language === 'en' ? service.company : service.companyTa}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
                              {language === 'en' ? service.tag : service.tagTa}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                        {t("No results found", "முடிவுகள் எதுவும் இல்லை")}
                      </p>
                    )}
                  </div>
                )}
              </div>
              )}

              <p style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '0.75rem',
                paddingLeft: '0.75rem'
              }}>{t("Main Menu", "முக்கிய மெனு")}</p>

              {navItems.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: location.pathname === item.path ? '#3b82f6' : '#334155',
                    padding: '0.85rem 1rem',
                    borderRadius: '1rem',
                    backgroundColor: location.pathname === item.path ? '#eff6ff' : 'transparent',
                    transition: 'all 0.2s ease',
                    border: location.pathname === item.path ? '1px solid rgba(59, 130, 246, 0.1)' : '1px solid transparent'
                  }}
                >
                  <item.icon size={20} style={{ opacity: location.pathname === item.path ? 1 : 0.7 }} />
                  {item.name}
                </Link>
              ))}

              <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '1.5rem 0.5rem' }}></div>

              <p style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '0.75rem',
                paddingLeft: '0.75rem'
              }}>{t("Account", "கணக்கு")}</p>

              {isLoggedIn ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: '#334155',
                    padding: '0.85rem 1rem',
                    borderRadius: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <User size={20} style={{ opacity: 0.7 }} />
                  {t("My Profile", "எனது சுயவிவரம்")}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      color: '#3b82f6',
                      padding: '0.85rem 1rem',
                      borderRadius: '1rem',
                      backgroundColor: '#eff6ff',
                      transition: 'all 0.2s ease',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <LogIn size={20} />
                    {t("Login", "உள்நுழை")}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      color: '#6366f1',
                      padding: '0.85rem 1rem',
                      borderRadius: '1rem',
                      backgroundColor: '#f5f3ff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <UserPlus size={20} />
                    {t("Sign Up", "பதிவு செய்யவும்")}
                  </Link>
                </>
              )}
            </div>

            {/* Sidebar Footer */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <button
                  onClick={() => searchInputRef.current?.focus()}
                  style={{ flex: 1, backgroundColor: 'white', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Search size={20} color="#64748b" />
                </button>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', fontWeight: '600' }}>
                © 2026 Service App. {t("All rights reserved.", "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(10px)',
            zIndex: 1999
          }}
        />
      )}
    </>
  );
};

export default Navbar;
