import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GalleryAnimation = ({ items = [], isMobile = false }) => {
  const [hoveredIndex, setHoveredIndex] = useState(0); // For backwards compatibility or mobile
  const [deskIndex, setDeskIndex] = useState(0); // For desktop carousel
  const scrollRef = useRef(null);

  // Duplicate the items to create a virtually infinite scroll for all screens
  const loopCount = 100;
  const loopItems = Array(loopCount).fill(items).flat();

  useEffect(() => {
    if (!scrollRef.current || items.length === 0) return;
    const container = scrollRef.current;
    
    // Start in the middle so users can swipe both ways immediately
    const middleIndex = Math.floor(loopCount / 2) * items.length;
    setTimeout(() => {
      if (container && container.clientWidth > 0) {
        // Temporarily disable smooth scroll to instantly jump to middle
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = middleIndex * container.clientWidth;
      }
    }, 100);
  }, [items.length, loopCount]);

  useEffect(() => {
    if (!scrollRef.current || items.length === 0) return;
    
    const container = scrollRef.current;

    // Custom smooth scroll function
    const slowSmoothScroll = (element, distance, duration) => {
      const start = element.scrollLeft;
      const target = start + distance;
      let startTime = null;
      
      // Temporarily disable snap to prevent fighting with animation
      element.style.scrollSnapType = 'none';

      const animateScroll = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (easeInOutQuad)
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        element.scrollLeft = start + (distance * ease);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        } else {
          // Restore snap when done
          element.style.scrollSnapType = 'x mandatory';
        }
      };
      requestAnimationFrame(animateScroll);
    };

    const interval = setInterval(() => {
      if (container) {
        slowSmoothScroll(container, container.clientWidth, 600); // 0.6s smooth transition
      }
    }, 4500); // Wait 4.5 seconds between slides

    return () => clearInterval(interval);
  }, [items.length]);

  const handlePrev = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
  };
  const handleNext = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={scrollRef}
        className="mobile-snap-gallery"
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>{`
          .mobile-snap-gallery::-webkit-scrollbar { display: none; }

        `}</style>
        {loopItems.map((item, index) => (
          <div
            key={`slide-${index}`}
            style={{
              flex: '0 0 100%',
              width: '100%',
              height: '100%',
              scrollSnapAlign: 'start',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              padding: 0,
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            <img 
              src={item.image} 
              alt={item.title || 'Hero Image'}
              loading="eager"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows - Only visible on desktop */}
      {!isMobile && (
        <>
          <button 
            onClick={handlePrev}
            style={{ 
              position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', 
              background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', 
              width: 40, height: 40, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
          >
            <ChevronLeft size={22} color="#0f172a" />
          </button>

          <button 
            onClick={handleNext}
            style={{ 
              position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', 
              background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', 
              width: 40, height: 40, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
          >
            <ChevronRight size={22} color="#0f172a" />
          </button>
        </>
      )}
    </div>
  );
};

export default GalleryAnimation;
