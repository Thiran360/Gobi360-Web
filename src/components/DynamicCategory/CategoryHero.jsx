import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryHero = ({ banners, categoryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds per slide
    
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  return (
    <div style={{ position: 'relative' }}>
      <div 
        style={{ 
          position: 'relative',
          borderRadius: '0',
          overflow: 'hidden',
          minHeight: '380px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 24px 50px rgba(0,0,0,0.12)',
          background: '#0f172a' // Fallback dark color
        }}
      >
        {/* Animated Background Images */}
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            src={banners[currentIndex].image} 
            alt={banners[currentIndex].title}
            style={{ 
              position: 'absolute', 
              top: 0, left: 0, 
              width: '100%', height: '100%', 
              objectFit: 'cover',
              zIndex: 0
            }}
          />
        </AnimatePresence>

        {/* Elegant Gradient Overlay - Darker on the left for text readability */}
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          background: `linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 45%, rgba(15,23,42,0.1) 100%)`,
          zIndex: 1
        }} />

        {/* Text Content in a Floating Glassmorphism Box */}
        <div style={{ 
          position: 'relative', 
          zIndex: 2,
          padding: '3.5rem',
          maxWidth: '550px',
          marginLeft: '2rem',
          color: 'white',
        }} className="category-hero-content">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              padding: '0.5rem 1.5rem',
              borderRadius: '2rem',
              border: '1px solid rgba(255,255,255,0.3)',
              fontSize: '0.8rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              marginBottom: '1.5rem',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            {categoryName || 'Explore Category'}
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.h2 
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              style={{ 
                fontSize: '3.8rem', 
                fontWeight: 900, 
                lineHeight: 1.1, 
                marginBottom: '1rem', 
                color: '#ffffff',
                letterSpacing: '-1.5px',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              {banners[currentIndex].title}
            </motion.h2>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.p 
              key={`desc-${currentIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ 
                fontSize: '1.25rem', 
                opacity: 0.9, 
                marginBottom: '2.5rem', 
                lineHeight: 1.6,
                fontWeight: 400,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              {banners[currentIndex].subtitle}
            </motion.p>
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 15px 35px ${banners[currentIndex].color}80` }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              background: banners[currentIndex].color || '#3b82f6', 
              color: 'white', 
              border: 'none', 
              padding: '1.2rem 2.8rem', 
              borderRadius: '99px', 
              fontWeight: 800, 
              fontSize: '1.1rem', 
              cursor: 'pointer',
              boxShadow: `0 10px 25px ${banners[currentIndex].color}50`,
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {banners[currentIndex].buttonText || 'Discover More'}
            <span style={{ fontSize: '1.3rem' }}>→</span>
          </motion.button>
        </div>

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            right: '3rem',
            display: 'flex',
            gap: '10px',
            zIndex: 3
          }}>
            {banners.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: idx === currentIndex ? '35px' : '10px',
                  height: '10px',
                  borderRadius: '10px',
                  background: idx === currentIndex ? (banners[idx].color || '#fff') : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: idx === currentIndex ? `0 0 10px ${banners[idx].color}` : 'none'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .category-hero-content {
            padding: 2.5rem 1.5rem !important;
            margin-left: 0 !important;
          }
          .category-hero-content h2 {
            font-size: 2.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryHero;
