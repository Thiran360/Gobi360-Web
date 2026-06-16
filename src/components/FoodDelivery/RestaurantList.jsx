import React from 'react';
import { Star, ChevronRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { restaurants, menuData } from '../../data/foodData';
import { motion, AnimatePresence } from 'framer-motion';

const RestaurantList = ({ searchQuery = '', onSelectRestaurant }) => {
  const [activeCategory, setActiveCategory] = React.useState(null);
  const [activeSubcategory, setActiveSubcategory] = React.useState(null);
  const [portionState, setPortionState] = React.useState({});

  const handleCategoryClick = (catName) => {
    setActiveCategory(activeCategory === catName ? null : catName);
    setActiveSubcategory(null);
  };

  const handleSubcategoryClick = (subcatName) => {
    setActiveSubcategory(activeSubcategory === subcatName ? null : subcatName);
  };
  
  const categories = [
    { id: 'indian', name: 'INDIAN FOOD', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&q=80' },
    { id: 'south_indian', name: 'SOUTH INDIAN', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=200&q=80' },
    { id: 'north_indian', name: 'NORTH INDIAN', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80' },
    { id: 'biryani', name: 'BIRYANI', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80' }
  ];

  const subcategoriesData = {
    'INDIAN FOOD': [
      { id: 'sc_ind_1', name: 'IDLY', image: 'https://images.unsplash.com/photo-1626779878235-866412eecbb5?auto=format&fit=crop&w=200&q=60' },
      { id: 'sc_ind_2', name: 'DOSA', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=60' },
      { id: 'sc_ind_3', name: 'MEALS', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=200&q=60' }
    ],
    'SOUTH INDIAN': [
      { id: 'sc_si_1', name: 'PONGAL', image: 'https://images.unsplash.com/photo-1626779878235-866412eecbb5?auto=format&fit=crop&w=200&q=60' },
      { id: 'sc_si_2', name: 'VADA', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=200&q=60' }
    ],
    'NORTH INDIAN': [
      { id: 'sc_ni_1', name: 'PANEER TIKKA', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=60' },
      { id: 'sc_ni_2', name: 'NAAN', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=60' }
    ],
    'BIRYANI': [
      { id: 'sc_bir_1', name: 'CHICKEN BIRYANI', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=60' },
      { id: 'sc_bir_2', name: 'MUTTON BIRYANI', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=60' }
    ]
  };

  const varietiesData = {
    'IDLY': [
      { id: 'v_idly_1', name: 'Mini Idly', restaurant: 'A2B - Adyar Ananda Bhavan', rating: '4.5', image: 'https://images.unsplash.com/photo-1626779878235-866412eecbb5?auto=format&fit=crop&w=200&q=60', offer: '20% OFF', prices: { '2': 40, '4': 70 }, originalPrices: { '2': 50, '4': 90 } },
      { id: 'v_idly_2', name: 'Thatte Idly', restaurant: 'Sangeetha Veg Restaurant', rating: '4.6', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=60', offer: '10% OFF', prices: { '2': 45, '4': 80 }, originalPrices: { '2': 50, '4': 90 } },
      { id: 'v_idly_3', name: 'Rava Idly', restaurant: 'MTR', rating: '4.3', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=200&q=60', offer: '', prices: { '2': 50, '4': 90 }, originalPrices: { '2': 50, '4': 90 } }
    ],
    'DOSA': [
      { id: 'v_dosa_1', name: 'Masala Dosa', restaurant: 'Sangeetha Veg Restaurant', rating: '4.7', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=60', offer: '15% OFF', prices: { '2': 75, '4': 140 }, originalPrices: { '2': 90, '4': 160 } },
      { id: 'v_dosa_2', name: 'Ghee Roast Dosa', restaurant: 'A2B', rating: '4.5', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=200&q=60', offer: '25% OFF', prices: { '2': 68, '4': 125 }, originalPrices: { '2': 90, '4': 160 } }
    ],
    'PONGAL': [
      { id: 'v_pgl_1', name: 'Ven Pongal', restaurant: 'A2B', rating: '4.6', image: 'https://images.unsplash.com/photo-1626779878235-866412eecbb5?auto=format&fit=crop&w=200&q=60', offer: '5% OFF', prices: { '2': 57, '4': 105 }, originalPrices: { '2': 60, '4': 110 } }
    ],
    'VADA': [
      { id: 'v_vada_1', name: 'Medu Vada', restaurant: 'Sangeetha Veg', rating: '4.5', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=200&q=60', offer: '15% OFF', prices: { '2': 42, '4': 80 }, originalPrices: { '2': 50, '4': 94 } }
    ],
    'PANEER TIKKA': [
      { id: 'v_pt_1', name: 'Paneer Tikka Masala', restaurant: 'Punjabi Dhaba', rating: '4.4', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=60', offer: '20% OFF', prices: { '2': 160, '4': 300 }, originalPrices: { '2': 200, '4': 370 } }
    ],
    'NAAN': [
      { id: 'v_naan_1', name: 'Butter Naan', restaurant: 'Tandoori Delight', rating: '5.0', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=60', offer: '17% OFF', prices: { '2': 35, '4': 65 }, originalPrices: { '2': 42, '4': 78 } },
      { id: 'v_naan_2', name: 'Garlic Naan', restaurant: 'North Indian Express', rating: '4.3', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=60', offer: '', prices: { '2': 40, '4': 75 }, originalPrices: { '2': 40, '4': 75 } }
    ],
    'CHICKEN BIRYANI': [
      { id: 'v_cb_1', name: 'Hyderabadi Chicken Biryani', restaurant: 'Buhari Hotel', rating: '4.6', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=60', offer: '30% OFF', prices: { '2': 175, '4': 330 }, originalPrices: { '2': 250, '4': 470 } },
      { id: 'v_cb_2', name: 'Ambur Chicken Biryani', restaurant: 'Star Biryani', rating: '4.2', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=60', offer: '10% OFF', prices: { '2': 135, '4': 250 }, originalPrices: { '2': 150, '4': 280 } }
    ],
    'MUTTON BIRYANI': [
      { id: 'v_mb_1', name: 'Dindigul Mutton Biryani', restaurant: 'Buhari Hotel', rating: '4.7', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=60', offer: '25% OFF', prices: { '2': 220, '4': 400 }, originalPrices: { '2': 280, '4': 520 } }
    ]
  };

  const getPortion = (id) => portionState[id] || '2';
  const setPortion = (id, val) => setPortionState(prev => ({ ...prev, [id]: val }));

  const handleOrder = (item) => {
    window.open('https://ecom.thiran360ai.com/', '_blank');
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const query = searchQuery.toLowerCase().trim();
    let matchesSearch = true;
    if (query) {
      matchesSearch = false;
      if (restaurant.name.toLowerCase().includes(query)) matchesSearch = true;
      else if (restaurant.cuisines.some(cuisine => cuisine.toLowerCase().includes(query))) matchesSearch = true;
      else {
        const menu = menuData[restaurant.id] || [];
        if (menu.some(item => 
          item.name.toLowerCase().includes(query) || 
          (item.description && item.description.toLowerCase().includes(query))
        )) matchesSearch = true;
      }
    }
    if (!matchesSearch) return false;
    
    const isIndianRestaurant = (restaurant) => {
      const indianKeywords = ['indian', 'biryani', 'mughlai', 'sweets'];
      return restaurant.cuisines.some(c => 
        indianKeywords.some(keyword => c.toLowerCase().includes(keyword))
      );
    };

    if (!isIndianRestaurant(restaurant)) return false;

    if (activeCategory) {
      const catMatch = activeCategory.toLowerCase().replace(' food', '');
      const isCuisineMatch = restaurant.cuisines.some(c => c.toLowerCase().includes(catMatch));
      const menu = menuData[restaurant.id] || [];
      const isMenuMatch = menu.some(item => 
        item.name.toLowerCase().includes(catMatch) || 
        (item.category && item.category.toLowerCase().includes(catMatch)) ||
        (item.description && item.description.toLowerCase().includes(catMatch))
      );
      
      if (!isCuisineMatch && !isMenuMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="swiggy-main-container fd-container" style={{ padding: '2rem 1rem' }}>
      
      {/* Header Section */}
      <div className="swiggy-section">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="flex-gap-md" style={{ marginBottom: '1rem' }}>
            <span className="text-h1">BROWSING RESTAURANTS</span>
          </div>
          <div className="fd-divider-thick"></div>
          
          <div className="flex-gap-md" style={{ marginBottom: '2rem' }}>
            <h3 className="text-h2">Popular Categories</h3>
          </div>
        </div>
        
        {/* Category tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="swiggy-horizontal-scroll"
          style={{ paddingBottom: '2rem' }}
        >
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleCategoryClick(cat.name)}
              className={`fd-category-pill${activeCategory === cat.name ? ' active' : ''}`}
              style={{
                cursor: 'pointer',
                minWidth: '160px',
                maxWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1.5rem 1rem',
                gap: '1.2rem',
              }}
            >
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span className={activeCategory === cat.name ? 'text-primary' : 'text-main'} style={{ fontWeight: 800, textAlign: 'center', fontSize: '0.95rem' }}>
                {cat.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Subcategories Section */}
        <AnimatePresence>
          {activeCategory && subcategoriesData[activeCategory] && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: '3rem', overflow: 'hidden' }}
            >
              <div className="flex-gap-sm" style={{ marginBottom: '1rem' }}>
                <ChevronRight color="var(--primary)" />
                <h2 className="text-h2">
                  Refine <span className="text-primary">{activeCategory.toLowerCase()}</span>
                </h2>
              </div>
              
              <div className="swiggy-horizontal-scroll" style={{ paddingBottom: '1.5rem' }}>
                {subcategoriesData[activeCategory].map((subcat, index) => (
                  <motion.div 
                    key={subcat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleSubcategoryClick(subcat.name)}
                    className="fd-subcategory-card"
                    style={{
                      cursor: 'pointer',
                      minWidth: '260px',
                      border: activeSubcategory === subcat.name ? '2px solid var(--primary)' : '2px solid transparent',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <div style={{ width: '100%', height: '160px' }}>
                      <img 
                        src={subcat.image} 
                        alt={subcat.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 100%)',
                      padding: '2rem 1rem 0.8rem 1rem',
                      color: 'white',
                      fontWeight: 800,
                      textAlign: 'center'
                    }}>
                      <span className={activeSubcategory === subcat.name ? 'text-primary' : ''}>
                        {subcat.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Varieties Section */}
        <AnimatePresence>
          {activeSubcategory && varietiesData[activeSubcategory] && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: '3rem', overflow: 'hidden' }}
            >
              <div className="flex-between" style={{ background: 'var(--surface-1)', padding: '1.5rem 2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <h3 className="text-h2" style={{ margin: '0 0 0.2rem 0' }}>{activeSubcategory} Menu</h3>
                  <p className="text-body" style={{ margin: 0 }}>Discover premium items</p>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-full)' }}>
                  <span className="text-small">{varietiesData[activeSubcategory].length} Items</span>
                </div>
              </div>

              <div className="swiggy-horizontal-scroll" style={{ paddingBottom: '1.5rem' }}>
                {varietiesData[activeSubcategory].map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="fd-menu-item-card"
                    style={{ minWidth: '320px', maxWidth: '320px' }}
                  >
                    <div className="flex-between" style={{ marginBottom: '1rem', zIndex: 2 }}>
                      {item.offer ? (
                        <div className="fd-badge-offer">✨ {item.offer}</div>
                      ) : <div></div>}
                      <Heart size={20} color="var(--text-tertiary)" style={{ cursor: 'pointer' }} />
                    </div>
                    
                    <div className="fd-menu-item-image-wrapper" style={{ height: '160px', marginBottom: '1.5rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <span className="text-small">{item.restaurant}</span>
                        <div className="fd-badge-rating">
                          <Star size={12} fill="white" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      
                      <h4 className="text-h3" style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>{item.name}</h4>
                      <div className="fd-divider"></div>
                      
                      <div className="flex-center" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div className="flex-gap-sm text-small">
                          <CheckCircle2 size={14} color="var(--success)" /> LOGISTICS
                        </div>
                        <div className="flex-gap-sm text-small">
                          <ShieldCheck size={14} color="var(--success)" /> SECURED
                        </div>
                      </div>

                      <div className="flex-center" style={{ gap: '0.8rem', marginBottom: '1.5rem' }}>
                        {['2', '4'].map(p => (
                          <div
                            key={p}
                            className={`fd-portion-pill ${getPortion(item.id) === p ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setPortion(item.id, p); }}
                          >
                            {p} pieces
                          </div>
                        ))}
                      </div>

                      <div className="flex-between" style={{ alignItems: 'flex-end' }}>
                        <div>
                          <h3 className="text-h2" style={{ margin: '0 0 0.2rem 0' }}>
                            ₹{item.prices ? item.prices[getPortion(item.id)] : '—'}
                          </h3>
                          {item.originalPrices && item.originalPrices[getPortion(item.id)] !== item.prices[getPortion(item.id)] && (
                            <span className="text-small" style={{ color: 'var(--danger)', textDecoration: 'line-through' }}>
                              ₹{item.originalPrices[getPortion(item.id)]}
                            </span>
                          )}
                        </div>
                        <button className="fd-btn-add" onClick={(e) => { e.stopPropagation(); handleOrder(item); }}>
                          Order +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RestaurantList;
