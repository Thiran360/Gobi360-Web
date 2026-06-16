export const supermarketCategories = [
  {
    id: 'fruits',
    name: 'Fruits',
    emoji: '🍎',
    subcategoryCount: 5,
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    emoji: '🥦',
    subcategoryCount: 5,
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'dairy-eggs',
    name: 'Dairy / Eggs',
    emoji: '🥛',
    subcategoryCount: 5,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'bakery',
    name: 'Bakery',
    emoji: '🥖',
    subcategoryCount: 4,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    emoji: '🥤',
    subcategoryCount: 5,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'snacks',
    name: 'Snacks',
    emoji: '🍿',
    subcategoryCount: 3,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800',
  }
];

export const supermarketSubcategories = [
  // Fruits
  { id: 'sub_apples', categoryId: 'fruits', name: 'Apples', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_bananas', categoryId: 'fruits', name: 'Bananas', image: 'https://images.unsplash.com/photo-1571501443899-ea32dc48a474?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_citrus', categoryId: 'fruits', name: 'Citrus', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_tropical', categoryId: 'fruits', name: 'Tropical', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_berries', categoryId: 'fruits', name: 'Berries', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800' },
  // Vegetables
  { id: 'sub_onions', categoryId: 'vegetables', name: 'Onions', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_tomatoes', categoryId: 'vegetables', name: 'Tomatoes', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_root', categoryId: 'vegetables', name: 'Root Vegetables', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_leafy', categoryId: 'vegetables', name: 'Leafy Greens', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_gourds', categoryId: 'vegetables', name: 'Gourds', image: 'https://images.unsplash.com/photo-1566486901817-73bc5e8c2e2a?auto=format&fit=crop&q=80&w=800' },
  // Dairy & Eggs
  { id: 'sub_eggs', categoryId: 'dairy-eggs', name: 'Eggs', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980bfc?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_milk', categoryId: 'dairy-eggs', name: 'Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_cheese', categoryId: 'dairy-eggs', name: 'Paneer & Cheese', image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_butter', categoryId: 'dairy-eggs', name: 'Butter & Ghee', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_curd', categoryId: 'dairy-eggs', name: 'Curd & Yogurt', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800' },
  // Bakery
  { id: 'sub_bread', categoryId: 'bakery', name: 'Breads', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_pastry', categoryId: 'bakery', name: 'Pastries', image: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88f3?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_cakes', categoryId: 'bakery', name: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_cookies', categoryId: 'bakery', name: 'Cookies', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800' },
  // Beverages
  { id: 'sub_juice', categoryId: 'beverages', name: 'Juices', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_coffee', categoryId: 'beverages', name: 'Coffee & Tea', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_softdrinks', categoryId: 'beverages', name: 'Soft Drinks', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_water', categoryId: 'beverages', name: 'Water', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_milkshakes', categoryId: 'beverages', name: 'Milkshakes', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800' },
  // Snacks
  { id: 'sub_chips', categoryId: 'snacks', name: 'Chips & Crisps', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_namkeen', categoryId: 'snacks', name: 'Namkeen & Mixtures', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800' },
  { id: 'sub_nuts', categoryId: 'snacks', name: 'Dry Fruits & Nuts', image: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&q=80&w=800' },
];

export const supermarketProducts = [
  // ===== FRUITS - Apples (matching reference image 2) =====
  {
    id: 'p1', categoryId: 'fruits', subcategoryId: 'sub_apples',
    name: 'Royal Gala Apples', price: 149, originalPrice: 180, discount: 17,
    unit: '1 kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=800',
    rating: 4.7, description: 'Sweet and crunchy Royal Gala apples, perfect for snacking.',
  },
  {
    id: 'p1b', categoryId: 'fruits', subcategoryId: 'sub_apples',
    name: 'Shimla Red Apples', price: 129, originalPrice: 160, discount: 19,
    unit: '1 kg', image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&q=80&w=800',
    rating: 4.3, description: 'Fresh red apples from the hills of Shimla, bursting with flavor.',
  },
  {
    id: 'p1c', categoryId: 'fruits', subcategoryId: 'sub_apples',
    name: 'Green Granny Smith', price: 89, originalPrice: 110, discount: 19,
    unit: '500 g', image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=800',
    rating: 4.2, description: 'Tart and crispy green apples, great for salads and baking.',
  },

  // ===== FRUITS - Bananas =====
  {
    id: 'p2', categoryId: 'fruits', subcategoryId: 'sub_bananas',
    name: 'Robusta Bananas', price: 49, originalPrice: 60, discount: 18,
    unit: '1 kg', image: 'https://images.unsplash.com/photo-1571501443899-ea32dc48a474?auto=format&fit=crop&q=80&w=800',
    rating: 4.5, description: 'Fresh and naturally ripened robusta bananas.',
  },
  {
    id: 'p2b', categoryId: 'fruits', subcategoryId: 'sub_bananas',
    name: 'Elaichi Bananas', price: 65, originalPrice: 80, discount: 19,
    unit: '500 g', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, description: 'Small, sweet elaichi bananas — perfect for kids.',
  },

  // ===== FRUITS - Citrus =====
  {
    id: 'p3', categoryId: 'fruits', subcategoryId: 'sub_citrus',
    name: 'Nagpur Oranges', price: 99, originalPrice: 120, discount: 17,
    unit: '1 kg', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, description: 'Juicy and tangy Nagpur oranges packed with Vitamin C.',
  },
  {
    id: 'p3b', categoryId: 'fruits', subcategoryId: 'sub_citrus',
    name: 'Fresh Lemons', price: 39, originalPrice: 50, discount: 22,
    unit: '500 g', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&q=80&w=800',
    rating: 4.4, description: 'Zesty fresh lemons for cooking, drinks, and garnishing.',
  },

  // ===== FRUITS - Tropical =====
  {
    id: 'p3c', categoryId: 'fruits', subcategoryId: 'sub_tropical',
    name: 'Alphonso Mango', price: 299, originalPrice: 350, discount: 15,
    unit: '1 kg', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
    rating: 4.9, description: 'King of mangoes — sweet, aromatic Alphonso.',
  },

  // ===== FRUITS - Berries =====
  {
    id: 'p3d', categoryId: 'fruits', subcategoryId: 'sub_berries',
    name: 'Fresh Strawberries', price: 129, originalPrice: 160, discount: 19,
    unit: '250 g', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800',
    rating: 4.7, description: 'Juicy, sweet strawberries — perfect for desserts.',
  },
  {
    id: 'p3e', categoryId: 'fruits', subcategoryId: 'sub_berries',
    name: 'Blueberries', price: 199, originalPrice: 250, discount: 20,
    unit: '125 g', image: 'https://images.unsplash.com/photo-1498159332174-7b3854f1d6fa?auto=format&fit=crop&q=80&w=800',
    rating: 4.5, description: 'Premium imported blueberries, rich in antioxidants.',
  },

  // ===== VEGETABLES =====
  {
    id: 'p4', categoryId: 'vegetables', subcategoryId: 'sub_onions',
    name: 'Red Onion', price: 39, originalPrice: 50, discount: 22,
    unit: '1 kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800',
    rating: 4.9, description: 'Farm fresh red onions. Essential for Indian cooking.',
  },
  {
    id: 'p5', categoryId: 'vegetables', subcategoryId: 'sub_tomatoes',
    name: 'Tomato (Local)', price: 29, originalPrice: 40, discount: 27,
    unit: '1 kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    rating: 4.7, description: 'Fresh local tomatoes, perfect for curries and salads.',
  },
  {
    id: 'p6', categoryId: 'vegetables', subcategoryId: 'sub_root',
    name: 'Fresh Carrot', price: 49, originalPrice: 65, discount: 25,
    unit: '500 g', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, description: 'Crunchy orange carrots, rich in Vitamin A.',
  },
  {
    id: 'p6b', categoryId: 'vegetables', subcategoryId: 'sub_leafy',
    name: 'Fresh Spinach', price: 25, originalPrice: 35, discount: 29,
    unit: '250 g', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, description: 'Iron-rich fresh spinach leaves.',
  },
  {
    id: 'p6c', categoryId: 'vegetables', subcategoryId: 'sub_gourds',
    name: 'Bottle Gourd', price: 35, originalPrice: 45, discount: 22,
    unit: '1 piece', image: 'https://images.unsplash.com/photo-1566486901817-73bc5e8c2e2a?auto=format&fit=crop&q=80&w=800',
    rating: 4.3, description: 'Fresh bottle gourd, perfect for healthy soups and curries.',
  },

  // ===== DAIRY & EGGS =====
  {
    id: 'p7', categoryId: 'dairy-eggs', subcategoryId: 'sub_eggs',
    name: 'Farm Fresh Eggs', price: 65, originalPrice: 80, discount: 19,
    unit: '10 pcs', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980bfc?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, description: 'High-quality protein-rich eggs from country hens.',
  },
  {
    id: 'p8', categoryId: 'dairy-eggs', subcategoryId: 'sub_milk',
    name: 'Full Cream Milk', price: 32, originalPrice: 40, discount: 20,
    unit: '500 ml', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
    rating: 4.9, description: 'Pasteurized full cream milk for daily use.',
  },
  {
    id: 'p9', categoryId: 'dairy-eggs', subcategoryId: 'sub_cheese',
    name: 'Fresh Paneer', price: 79, originalPrice: 100, discount: 21,
    unit: '200 g', image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=800',
    rating: 4.7, description: 'Soft and fresh malai paneer for delicious curries.',
  },
  {
    id: 'p9b', categoryId: 'dairy-eggs', subcategoryId: 'sub_butter',
    name: 'Amul Butter', price: 55, originalPrice: 65, discount: 15,
    unit: '200 g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, description: 'Classic Amul salted butter for everyday use.',
  },
  {
    id: 'p9c', categoryId: 'dairy-eggs', subcategoryId: 'sub_curd',
    name: 'Fresh Curd', price: 40, originalPrice: 50, discount: 20,
    unit: '400 g', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, description: 'Thick, creamy fresh curd made from pure milk.',
  },

  // ===== BAKERY =====
  {
    id: 'p10', categoryId: 'bakery', subcategoryId: 'sub_bread',
    name: 'Whole Wheat Bread', price: 42, originalPrice: 55, discount: 24,
    unit: '1 pack', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, description: 'Freshly baked 100% whole wheat bread.',
  },
  {
    id: 'p11', categoryId: 'bakery', subcategoryId: 'sub_pastry',
    name: 'Butter Croissant', price: 69, originalPrice: 85, discount: 19,
    unit: '2 pcs', image: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88f3?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, description: 'Flaky, buttery, authentic French-style croissants.',
  },
  {
    id: 'p11b', categoryId: 'bakery', subcategoryId: 'sub_cakes',
    name: 'Chocolate Cake', price: 349, originalPrice: 450, discount: 22,
    unit: '500 g', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    rating: 4.9, description: 'Rich, moist chocolate cake with ganache topping.',
  },
  {
    id: 'p11c', categoryId: 'bakery', subcategoryId: 'sub_cookies',
    name: 'Butter Cookies', price: 89, originalPrice: 110, discount: 19,
    unit: '200 g', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
    rating: 4.5, description: 'Crunchy homemade butter cookies.',
  },

  // ===== BEVERAGES =====
  {
    id: 'p12', categoryId: 'beverages', subcategoryId: 'sub_juice',
    name: '100% Apple Juice', price: 99, originalPrice: 120, discount: 17,
    unit: '1 L', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800',
    rating: 4.5, description: 'Pure apple juice with no added sugar.',
  },
  {
    id: 'p13', categoryId: 'beverages', subcategoryId: 'sub_coffee',
    name: 'Filter Coffee Powder', price: 129, originalPrice: 160, discount: 19,
    unit: '250 g', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800',
    rating: 4.9, description: 'Premium blend for the perfect South Indian filter coffee.',
  },
  {
    id: 'p13b', categoryId: 'beverages', subcategoryId: 'sub_softdrinks',
    name: 'Cola 750ml', price: 38, originalPrice: 45, discount: 16,
    unit: '750 ml', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=800',
    rating: 4.2, description: 'Chilled carbonated cola drink.',
  },
  {
    id: 'p13c', categoryId: 'beverages', subcategoryId: 'sub_water',
    name: 'Mineral Water', price: 20, originalPrice: 25, discount: 20,
    unit: '1 L', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800',
    rating: 4.4, description: 'Pure mineral water.',
  },
  {
    id: 'p13d', categoryId: 'beverages', subcategoryId: 'sub_milkshakes',
    name: 'Chocolate Milkshake', price: 79, originalPrice: 99, discount: 20,
    unit: '300 ml', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    rating: 4.7, description: 'Thick, creamy chocolate milkshake.',
  },

  // ===== SNACKS =====
  {
    id: 'p14', categoryId: 'snacks', subcategoryId: 'sub_chips',
    name: 'Classic Salted Chips', price: 30, originalPrice: 40, discount: 25,
    unit: '150 g', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800',
    rating: 4.3, description: 'Crispy salted potato chips.',
  },
  {
    id: 'p14b', categoryId: 'snacks', subcategoryId: 'sub_namkeen',
    name: 'Bhujia Sev', price: 55, originalPrice: 70, discount: 21,
    unit: '200 g', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, description: 'Crunchy, spicy bhujia sev — classic Indian namkeen.',
  },
  {
    id: 'p14c', categoryId: 'snacks', subcategoryId: 'sub_nuts',
    name: 'Premium Cashews', price: 249, originalPrice: 320, discount: 22,
    unit: '250 g', image: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, description: 'Whole, roasted premium cashew nuts.',
  },
];
