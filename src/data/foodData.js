export const categories = [
  { id: 'c1', name: 'Biryani', icon: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60' },
  { id: 'c2', name: 'Pizzas', icon: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60' },
  { id: 'c3', name: 'Burgers', icon: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60' },
  { id: 'c4', name: 'North Indian', icon: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60' },
  { id: 'c5', name: 'Chinese', icon: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60' },
  { id: 'c6', name: 'Desserts', icon: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60' }
];

export const restaurants = [
  {
    id: 'r1',
    name: 'A2B - Adyar Ananda Bhavan',
    rating: 4.5,
    deliveryTime: '25-30 mins',
    costForTwo: '₹400 for two',
    cuisines: ['South Indian', 'Sweets', 'Snacks'],
    offer: '50% OFF up to ₹100',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    isPromoted: true
  },
  {
    id: 'r2',
    name: 'KFC',
    rating: 4.1,
    deliveryTime: '30-40 mins',
    costForTwo: '₹500 for two',
    cuisines: ['Burger', 'Fast Food'],
    offer: 'Flat ₹50 OFF',
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 'r3',
    name: 'Buhari Hotel',
    rating: 4.3,
    deliveryTime: '35-45 mins',
    costForTwo: '₹600 for two',
    cuisines: ['Biryani', 'South Indian', 'Mughlai'],
    offer: '20% OFF',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 'r4',
    name: 'Domino\'s Pizza',
    rating: 4.2,
    deliveryTime: '20-30 mins',
    costForTwo: '₹400 for two',
    cuisines: ['Pizza', 'Italian', 'Fast Food'],
    offer: '60% OFF up to ₹120',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 'r5',
    name: 'Mainland China',
    rating: 4.4,
    deliveryTime: '45-55 mins',
    costForTwo: '₹1000 for two',
    cuisines: ['Chinese', 'Asian'],
    offer: 'Free Delivery',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 'r6',
    name: 'Sangeetha Veg Restaurant',
    rating: 4.6,
    deliveryTime: '20-30 mins',
    costForTwo: '₹300 for two',
    cuisines: ['South Indian', 'North Indian', 'Chinese'],
    offer: '30% OFF',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  }
];

// Map of restaurant ID to their menu items
export const menuData = {
  'r1': [
    { id: 'm1', name: 'Mini Tiffin', price: 120, type: 'veg', description: 'Idli, Pongal, Vada, Sweet, Mini Dosa', image: 'https://images.unsplash.com/photo-1626779878235-866412eecbb5?auto=format&fit=crop&w=200&q=60', category: 'Recommended' },
    { id: 'm2', name: 'Ghee Roast Dosa', price: 90, type: 'veg', description: 'Crispy dosa roasted in pure ghee', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=60', category: 'Recommended' },
    { id: 'm3', name: 'Idli (2 Pcs)', price: 40, type: 'veg', description: 'Soft steamed rice cakes', image: null, category: 'South Indian' }
  ],
  'r2': [
    { id: 'm4', name: 'Zinger Burger', price: 180, type: 'non-veg', description: 'Signature chicken burger', image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=200&q=60', category: 'Recommended' },
    { id: 'm5', name: 'Hot Wings (4 Pcs)', price: 150, type: 'non-veg', description: 'Spicy chicken wings', image: null, category: 'Snacks' }
  ],
  'r3': [
    { id: 'm6', name: 'Chicken Biryani', price: 250, type: 'non-veg', description: 'Authentic Chennai style biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=60', category: 'Recommended' },
    { id: 'm7', name: 'Mutton Biryani', price: 320, type: 'non-veg', description: 'Flavorful basmati rice cooked with tender mutton', image: null, category: 'Recommended' },
    { id: 'm8', name: 'Chicken 65', price: 180, type: 'non-veg', description: 'Spicy fried chicken pieces', image: null, category: 'Starters' }
  ],
  'r4': [
    { id: 'm9', name: 'Margherita Pizza', price: 199, type: 'veg', description: 'Classic cheese pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=60', category: 'Recommended' },
    { id: 'm10', name: 'Pepperoni Pizza', price: 299, type: 'non-veg', description: 'Pork pepperoni, mozzarella cheese', image: null, category: 'Non-Veg Pizzas' }
  ],
  'r5': [
    { id: 'm11', name: 'Hakka Noodles', price: 220, type: 'veg', description: 'Wok tossed noodles', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=60', category: 'Recommended' },
    { id: 'm12', name: 'Chilli Chicken', price: 280, type: 'non-veg', description: 'Spicy chicken tossed in soy sauce', image: null, category: 'Starters' }
  ],
  'r6': [
    { id: 'm13', name: 'Meals', price: 150, type: 'veg', description: 'Rice, Sambar, Rasam, Kootu, Poriyal, Curd, Appalam', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=200&q=60', category: 'Recommended' },
    { id: 'm14', name: 'Filter Coffee', price: 45, type: 'veg', description: 'Authentic South Indian filter coffee', image: null, category: 'Beverages' }
  ]
};
