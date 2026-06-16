import React, { useEffect } from 'react';
import { ArrowLeft, Star, Clock, Info } from 'lucide-react';
import { menuData } from '../../data/foodData';
import { motion } from 'framer-motion';

const RestaurantDetail = ({ restaurant, onBack }) => {
  const menu = menuData[restaurant.id] || [];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Group menu by category
  const categories = [...new Set(menu.map(item => item.category))];

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Premium Hero Header */}
      <div className="fd-hero-header">
        <div className="fd-hero-overlay"></div>
        <img 
          src={restaurant.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3'} 
          alt={restaurant.name} 
          className="fd-hero-bg" 
        />
        
        <div className="fd-hero-content fd-container">
          <button className="fd-hero-back" onClick={onBack}>
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="fd-hero-info">
            <h1>{restaurant.name}</h1>
            <p className="fd-hero-cuisines">{restaurant.cuisines.join(', ')}</p>
            
            <div className="fd-hero-stats">
              <div className="fd-hero-stat">
                <div className="fd-stat-rating">
                  <Star size={14} fill="white" /> {restaurant.rating}
                </div>
                <span>1K+ Ratings</span>
              </div>
              <div className="fd-hero-stat-divider"></div>
              <div className="fd-hero-stat">
                <Clock size={18} />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="fd-hero-stat-divider"></div>
              <div className="fd-hero-stat">
                <Info size={18} />
                <span>{restaurant.costForTwo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="fd-container fd-menu-container">
        {categories.map(category => (
          <div key={category} className="fd-menu-section">
            <h3 className="fd-menu-category-title">{category}</h3>
            
            <div className="fd-menu-grid">
              {menu.filter(m => m.category === category).map((item, index) => (
                <motion.div 
                  key={item.id} 
                  className="fd-menu-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="fd-menu-card-content">
                    <div className={`fd-menu-item-type ${item.type}`}></div>
                    <h4 className="fd-menu-card-name">{item.name}</h4>
                    <div className="fd-menu-card-price">₹{item.price}</div>
                    <p className="fd-menu-card-desc">{item.description}</p>
                  </div>
                  
                  <div className="fd-menu-card-media">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="fd-menu-card-image" />
                    ) : (
                      <div className="fd-menu-card-image-placeholder">No Image</div>
                    )}
                    
                    <div className="fd-add-btn-wrapper">
                      <button className="fd-add-btn" onClick={() => window.open('https://ecom.thiran360ai.com/', '_blank')}>Order</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;
