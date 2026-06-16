import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  {
    id: 1,
    title: 'Get 50% OFF',
    subtitle: 'On your first order! Welcome to FoodExpress.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#ff7a00'
  },
  {
    id: 2,
    title: 'Free Delivery',
    subtitle: 'On orders above ₹500 all week long.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#0f172a'
  },
  {
    id: 3,
    title: 'Midnight Cravings',
    subtitle: 'Try our special late-night desserts.',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#22c55e'
  }
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    if (swipe < -50) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (swipe > 50) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
    clearInterval(timerRef.current);
    startTimer();
  };

  return (
    <div className="swiggy-banner-wrapper fd-container" style={{ padding: '0 1rem' }}>
      <div className="swiggy-banner-carousel" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            className="swiggy-banner-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <motion.img 
              src={banners[currentIndex].image}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "linear" }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute'
              }}
            />
            <div 
              className="swiggy-banner-gradient" 
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(to right, ${banners[currentIndex].color}e6 0%, ${banners[currentIndex].color}99 50%, transparent 100%)`,
                display: 'flex',
                alignItems: 'center',
                padding: '3rem'
              }}
            >
              <motion.div 
                className="swiggy-banner-text"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ maxWidth: '400px', color: 'white' }}
              >
                <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.1, textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  {banners[currentIndex].title}
                </h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.95, textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {banners[currentIndex].subtitle}
                </p>
                <button 
                  className="swiggy-banner-btn" 
                  style={{ 
                    color: banners[currentIndex].color,
                    padding: '0.8rem 2rem',
                    fontSize: '1rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'white',
                    border: 'none',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Order Now
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="swiggy-banner-dots" style={{ marginTop: '1.5rem' }}>
        {banners.map((_, index) => (
          <div 
            key={index} 
            style={{
              width: index === currentIndex ? '30px' : '8px',
              height: '8px',
              background: index === currentIndex ? 'var(--primary)' : 'var(--border-medium)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => {
              setCurrentIndex(index);
              clearInterval(timerRef.current);
              startTimer();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
