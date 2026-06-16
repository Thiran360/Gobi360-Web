import React, { useState } from 'react';
import { Search, MapPin, ChevronDown, User, Tag, Mic } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import RestaurantList from './RestaurantList';
import RestaurantDetail from './RestaurantDetail';
import OrderTracking from './OrderTracking';
import BannerCarousel from './BannerCarousel';
import UserProfile from './UserProfile';
import './FoodDelivery.css';
import './PremiumOverride.css';

const FoodDeliveryApp = () => {
  // Views: 'home', 'restaurant', 'checkout', 'tracking', 'profile'
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant');
  };

  const handleBackToHome = () => {
    setSelectedRestaurant(null);
    setCurrentView('home');
  };


  if (currentView === 'tracking') {
    return <OrderTracking orderId={lastOrderId} onBackHome={() => setCurrentView('home')} />;
  }

  if (currentView === 'profile') {
    return <UserProfile onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="swiggy-app-container">
      {/* Premium Sticky Header */}
      <header className="swiggy-global-header">
        <div className="fd-container swiggy-header-inner">
          <div className="swiggy-header-left">
            <div className="swiggy-logo" onClick={() => setCurrentView('home')}>
              <MapPin size={24} color="var(--primary)" />
            </div>
            <div className="swiggy-location">
              <span className="swiggy-loc-type">Home</span>
              <span className="swiggy-loc-text">Gobichettipalayam, Erode, Tamil Nadu...</span>
              <ChevronDown size={16} color="var(--primary)" />
            </div>
          </div>
          
          <div className="swiggy-header-nav">
            <div className="swiggy-nav-item">
                <Tag size={20} />
              <span>Offers</span>
            </div>
            <button className="fd-profile-icon" onClick={(e) => { e.stopPropagation(); setCurrentView('profile'); }} title="Profile">
              <User size={20} color="var(--text-main)" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Bar (Elevated) */}
      {currentView === 'home' && (
        <div className="swiggy-search-container fd-container">
          <div className="swiggy-search-box">
            <input 
              type="text" 
              placeholder="Search for restaurant, item or more" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent' }}
            />
            <div className="swiggy-search-icons">
              <Search size={20} color="var(--text-secondary)" />
              <div className="swiggy-search-divider" style={{ background: 'var(--border-light)' }}></div>
              <Mic size={20} color="var(--primary)" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="swiggy-main-content">
        {currentView === 'home' && (
          <>
            <BannerCarousel />
            <RestaurantList searchQuery={searchQuery} onSelectRestaurant={handleSelectRestaurant} />
          </>
        )}
        
        {currentView === 'restaurant' && selectedRestaurant && (
          <RestaurantDetail 
            restaurant={selectedRestaurant} 
            onBack={handleBackToHome}
          />
        )}
      </main>
    </div>
  );
};

export default FoodDeliveryApp;
