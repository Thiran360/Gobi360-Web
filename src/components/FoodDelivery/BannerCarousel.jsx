import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  {
    id: 1,
    brand: 'Premium Cuts',
    title: 'Gourmet Burgers',
    highlight: '50-80% Off',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#fbbf24'
  },
  {
    id: 2,
    brand: 'Italian Woodfire',
    title: 'Artisan Pizzas',
    highlight: 'Min. 40% Off',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#f97316'
  },
  {
    id: 3,
    brand: 'Tokyo Drift',
    title: 'Fresh Sushi',
    highlight: 'Flat 30% Off',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#a78bfa'
  },
  {
    id: 4,
    brand: 'The Grill House',
    title: 'Prime Steak',
    highlight: 'Weekend Treat',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#ef4444'
  },
  {
    id: 5,
    brand: 'Pasta La Vista',
    title: 'Truffle Pasta',
    highlight: 'Chef Special',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#fde047'
  },
  {
    id: 6,
    brand: 'Midnight Cravings',
    title: 'Rich Desserts',
    highlight: 'Flat 20% Off',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#fbcfe8'
  },
  {
    id: 7,
    brand: 'Spicy Wok',
    title: 'Ramen & Noodles',
    highlight: 'Combo Deals',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#38bdf8'
  },
  {
    id: 8,
    brand: 'Royal Feast',
    title: 'Dum Biryani',
    highlight: 'Starts at ₹149',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#fda4af'
  },
  {
    id: 9,
    brand: 'Healthy Eats',
    title: 'Power Bowls',
    highlight: 'Buy 1 Get 1',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#4ade80'
  },
  {
    id: 10,
    brand: 'Beverage Bar',
    title: 'Summer Cocktails',
    highlight: 'Happy Hours',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    accentColor: '#2dd4bf'
  }
];

const BannerCarousel = ({ customBanners }) => {
  const activeBanners = customBanners && customBanners.length > 0 ? customBanners : banners;
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500); 
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleDragEnd = (e, { offset }) => {
    const swipe = offset.x;
    if (swipe < -50) {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    } else if (swipe > 50) {
      setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    }
    clearInterval(timerRef.current);
    startTimer();
  };

  return (
    <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginBottom: '2rem' }}>
      <style>
        {`
          @media (max-width: 768px) {
            .banner-content-area {
              padding: 2rem !important;
              align-items: center !important;
              text-align: center !important;
            }
            .banner-title {
              font-size: 1.6rem !important;
            }
            .banner-desc {
              font-size: 1.2rem !important;
              line-height: 1.4 !important;
              margin-top: 0.8rem !important;
            }
            .banner-btn {
              margin-top: 1.2rem !important;
              padding: 0.6rem 1.8rem !important;
              font-size: 1rem !important;
            }
          }
        `}
      </style>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ position: 'relative', height: '320px', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: 'grab',
                background: '#0f172a'
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "tween", duration: 0.6, ease: "easeInOut" }}
            >
              {/* Premium Full Background Image with Zoom */}
              <motion.img 
                src={activeBanners[currentIndex].image}
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 4.5, ease: "linear" }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute'
                }}
                draggable={false}
              />
              
              {/* Premium Dark Gradient Overlay */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 40%, transparent 100%)',
                zIndex: 1
              }} />

              {/* Text Content Area */}
              <div className="banner-content-area" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 5rem', zIndex: 2 }}>
                
                {/* Brand Pill Removed */}
                
                <motion.h2 
                  className="banner-title"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ fontSize: '2.2rem', fontWeight: 500, color: '#e2e8f0', marginBottom: '0.2rem', lineHeight: 1.1 }}
                >
                  {activeBanners[currentIndex].title}
                </motion.h2>
                
                <motion.h3 
                  className="banner-desc"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ fontSize: '1.8rem', fontWeight: 600, color: activeBanners[currentIndex].accentColor, margin: '0.5rem 0 0 0', lineHeight: 1.2, textShadow: '0 4px 10px rgba(0,0,0,0.4)' }}
                >
                  {activeBanners[currentIndex].highlight}
                </motion.h3>

                <motion.button 
                  className="banner-btn"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.8rem 2.2rem',
                    background: 'white',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '3rem',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    width: 'fit-content',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {activeBanners[currentIndex].buttonText || 'Order Now'}
                </motion.button>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Pagination Dots */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {activeBanners.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                setCurrentIndex(idx);
                clearInterval(timerRef.current);
                startTimer();
              }}
              style={{
                width: idx === currentIndex ? '35px' : '10px',
                height: '10px',
                backgroundColor: idx === currentIndex ? '#2563eb' : '#cbd5e1',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: idx === currentIndex ? '0 2px 10px rgba(37,99,235,0.4)' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
