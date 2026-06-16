import React, { useState } from 'react';
import { Search, ArrowLeft, Plus, ChevronRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { supermarketCategories, supermarketSubcategories, supermarketProducts } from '../../data/supermarketData';
import '../FoodDelivery/FoodDelivery.css';
import '../FoodDelivery/PremiumOverride.css';
import './Supermarket.css';

// Custom Product Card Component to handle quantity state
const ProductCard = ({ product, handleOrder }) => {
  const [multiplier, setMultiplier] = useState(1);

  // Parse unit to create the 2x option
  let unit1 = product.unit;
  let unit2 = '';
  const match = product.unit.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (match) {
    let num = parseFloat(match[1]);
    let text = match[2];
    if (num === 500 && text === 'g') {
      unit2 = '1 kg';
    } else if (num === 250 && text === 'g') {
      unit2 = '500 g';
    } else {
      unit2 = `${num * 2} ${text}`;
    }
  } else {
    unit2 = `2x ${product.unit}`;
  }

  const currentPrice = product.price * multiplier;
  const oldPrice = product.originalPrice ? product.originalPrice * multiplier : null;

  return (
    <motion.div className="ref-product-card" whileHover={{ y: -4 }}>
      {/* Image & Overlays */}
      <div className="ref-card-image-wrapper">
        <img src={product.image} alt={product.name} className="ref-product-img" />
        {product.discount && (
          <div className="ref-discount-badge">
            ✨ {product.discount}% OFF
          </div>
        )}
        <button className="ref-favorite-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="ref-card-content">
        {/* Brand & Rating */}
        <div className="ref-brand-row">
          <span className="ref-brand-name">FreshMart Quality</span>
          <span className="ref-rating-badge">★ {product.rating}</span>
        </div>

        {/* Title */}
        <h3 className="ref-product-title">{product.name}</h3>

        {/* Trust Badges */}
        <div className="ref-trust-badges">
          <span className="trust-badge-item">
            <ShieldCheck size={12} color="#22c55e" /> FRESH
          </span>
          <span className="trust-badge-item">
            <ShieldCheck size={12} color="#22c55e" /> SECURED
          </span>
        </div>

        {/* Unit Pills with Selection State */}
        <div className="ref-unit-pills">
          <span 
            className={`ref-unit-pill ${multiplier === 1 ? 'active' : ''}`}
            onClick={() => setMultiplier(1)}
          >
            {unit1}
          </span>
          <span 
            className={`ref-unit-pill ${multiplier === 2 ? 'active' : ''}`}
            onClick={() => setMultiplier(2)}
          >
            {unit2}
          </span>
        </div>

        {/* Bottom Row: Price & Order */}
        <div className="ref-bottom-row">
          <div className="ref-price-box">
            <span className="ref-current-price">₹{currentPrice}</span>
            {oldPrice && (
              <span className="ref-old-price">₹{oldPrice}</span>
            )}
          </div>
          <button className="ref-order-btn" onClick={handleOrder}>
            Order +
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SupermarketApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentView('subcategory');
  };

  const handleSelectSubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCurrentView('products');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setCurrentView('home');
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
    setCurrentView('subcategory');
  };

  const handleOrder = () => {
    window.location.href = 'https://ecom.thiran360ai.com/';
  };

  return (
    <div className="freshmart-app-container">
      {/* ========== HEADER ========== */}
      <header className="freshmart-header">
        <div className="fd-container freshmart-header-inner">
          <div className="freshmart-logo-area">
            <div className="freshmart-logo">
              <ShoppingBag size={24} color="#22c55e" />
              <span>FreshMart</span>
            </div>
            <div className="freshmart-badge delivery-badge">
              <span className="truck-icon">🚚</span> Free delivery above ₹299
            </div>
          </div>
          <div className="freshmart-header-right">
            <div className="freshmart-badge fresh-badge">
              <ShieldCheck size={16} color="#22c55e" /> 100% Fresh
            </div>
          </div>
        </div>
      </header>

      <main className="freshmart-main">
        {/* ========== HERO BANNER — Always Visible ========== */}
        <div className="freshmart-hero">
          <div className="fd-container freshmart-hero-content">
            <div className="hero-tag">
              <span className="leaf-icon">🍃</span> SUPERMARKET & GROCERY
            </div>
            <h1 className="hero-title">
              Fresh Groceries,<br/>
              <span className="text-green">Delivered to You</span>
            </h1>
            <p className="hero-subtitle">
              Shop from 500+ products — fruits, vegetables, dairy & more.<br/>
              All fresh, all the time.
            </p>
            <div className="hero-search">
              <Search size={20} color="#9ca3af" className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for fruits, vegetables, dairy..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ========== HOME — Shop by Category ========== */}
        {currentView === 'home' && (
          <div className="fd-container section-padding">
            <div className="section-header">
              <h2>Shop by Category</h2>
              <p>Explore our wide range of fresh grocery categories</p>
            </div>
            <div className="freshmart-category-grid">
              {supermarketCategories.map(category => (
                <motion.div 
                  key={category.id}
                  className="freshmart-category-card"
                  onClick={() => handleSelectCategory(category)}
                  whileHover={{ y: -5 }}
                >
                  <div className="cat-img-wrapper">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <div className="cat-card-footer">
                    <div className="cat-info-left">
                        <span className="cat-name">{category.name}</span>
                      </div>
                    <div className="cat-info-right">
                      <span className="cat-sub-count">{category.subcategoryCount} subcategories</span>
                      <div className="cat-arrow">
                        <ChevronRight size={16} color="#22c55e" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ========== SUBCATEGORY VIEW ========== */}
        {currentView === 'subcategory' && selectedCategory && (
          <div className="fd-container section-padding">
            <div className="subcategory-header-area">
              <button className="pill-back-btn" onClick={handleBackToCategories}>
                <ArrowLeft size={16} /> Back to Categories
              </button>
              <h2 className="subcategory-main-title">
                {selectedCategory.name}
              </h2>
              <p className="subcategory-subtitle">Choose a subcategory to explore</p>
            </div>
            <div className="subcategory-grid">
              {supermarketSubcategories.filter(s => s.categoryId === selectedCategory.id).map(sub => (
                <motion.div 
                  key={sub.id} 
                  className="subcategory-card"
                  onClick={() => handleSelectSubcategory(sub)}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <img src={sub.image} alt={sub.name} className="subcategory-bg-image" />
                  <div className="subcategory-overlay">
                    <h3 className="subcategory-name">{sub.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ========== PRODUCTS VIEW ========== */}
        {currentView === 'products' && selectedSubcategory && (
          <div className="fd-container section-padding">
            {/* Menu Header Card */}
            <div className="menu-header-card">
              <div className="menu-header-left">
                <button className="menu-back-btn" onClick={handleBackToSubcategories}>
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="menu-title">{selectedSubcategory.name} Menu</h2>
                  <p className="menu-subtitle">Discover premium items</p>
                </div>
              </div>
              <div className="menu-header-right">
                <span className="item-count-pill">
                  {supermarketProducts.filter(p => p.subcategoryId === selectedSubcategory.id).length} Items
                </span>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="ref-products-grid">
              {supermarketProducts.filter(p => p.subcategoryId === selectedSubcategory.id).map(product => (
                <ProductCard key={product.id} product={product} handleOrder={handleOrder} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SupermarketApp;
