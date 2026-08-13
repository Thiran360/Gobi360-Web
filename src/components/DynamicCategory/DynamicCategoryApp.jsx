import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Star, Heart, MapPin, ChevronDown, User, Tag, Mic, Search, ShoppingCart, X, CheckCircle, ArrowLeft, ShieldCheck, Phone, Edit2, Trash2, AlertCircle, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import '../FoodDelivery/FoodDelivery.css';
import '../FoodDelivery/PremiumOverride.css';
import BannerCarousel from '../FoodDelivery/BannerCarousel';
import CategoryHero from './CategoryHero';

const DynamicCategoryApp = ({ categoryId, initialShopId, onBack }) => {
  const { t } = useLanguage();
  const { addMockOrder } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState(null);
  const [shops, setShops] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productVariations, setProductVariations] = useState([]);

  const [activeShopId, setActiveShopId] = useState(initialShopId || null);
  const [activeProductCategoryId, setActiveProductCategoryId] = useState(null);
  const [activeVariations, setActiveVariations] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorToast, setErrorToast] = useState("");
  const showError = (msg) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(""), 3500);
  };
  const [view, setView] = useState('browse'); // 'browse' | 'checkout'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState({
    id: null,
    fullName: '',
    phone: '',
    doorNo: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pin: '',
    landmark: 'Not provided',
    isDefault: true
  });
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);
  const [addressView, setAddressView] = useState('selected'); // 'selected', 'list', 'form'
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [pointsData, setPointsData] = useState([]);
  const [paymentOption, setPaymentOption] = useState('cod');
  const [usePointsMap, setUsePointsMap] = useState({});
  const [cartShopsMeta, setCartShopsMeta] = useState({});
  const [rewardSettingsMap, setRewardSettingsMap] = useState({});
  const fetchedRewardShopsRef = useRef(new Set());

  useEffect(() => {
    // Get unique shop IDs from the cart, falling back to activeShopId if cart is empty
    const shopIds = cartItems.length > 0
      ? [...new Set(cartItems.map(item => item.shopId || item.shop_id).filter(Boolean))]
      : (activeShopId ? [activeShopId] : []);

    // Fetch reward settings for all unique shops in parallel
    shopIds.forEach(shopId => {
      if (fetchedRewardShopsRef.current.has(shopId)) return;
      fetchedRewardShopsRef.current.add(shopId);

      // Avoid fetching if the shop doesn't exist in our global shops list
      // (This prevents 404s for ghost shops)
      if (String(shopId) === '3') return; // The user requested to ignore this ghost ID to avoid 404 logs

      fetch(`https://api.codingboss.in/gobi360/reward-setting/${shopId}/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(async r => {
          if (!r.ok) return null;
          return r.json();
        })
        .then(data => {
          if (data && data.status) {
            setRewardSettingsMap(prev => ({
              ...prev,
              [shopId]: {
                purchase_amount: parseFloat(data.purchase_amount) || 10,
                reward_points: data.reward_points || 1,
                redeem_points: data.redeem_points || 10,
                redeem_amount: parseFloat(data.redeem_amount) || 1,
                minimum_redeem_points: data.minimum_redeem_points || 10,
                message: data.message || null
              }
            }));
          } else {
            setRewardSettingsMap(prev => {
              const newMap = { ...prev };
              delete newMap[shopId];
              return newMap;
            });
          }
        }).catch(() => { });
    });
  }, [cartItems.length, activeShopId, shops]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('hide-ai-assistant');
    } else {
      document.body.classList.remove('hide-ai-assistant');
    }
    return () => document.body.classList.remove('hide-ai-assistant');
  }, [isCartOpen]);

  const getUserId = () => {
    const savedUserStr = localStorage.getItem('user');
    if (savedUserStr && savedUserStr !== 'undefined') {
      try {
        const savedUser = JSON.parse(savedUserStr);
        return savedUser.id || savedUser.user_id || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const isUserLoggedIn = () => {
    const savedUserStr = localStorage.getItem('user');
    if (savedUserStr && savedUserStr !== 'undefined') {
      try {
        const savedUser = JSON.parse(savedUserStr);
        return !!(savedUser.id || savedUser.user_id);
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  const fetchCartItems = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        const local = localStorage.getItem('localCart');
        if (local) {
          try { setCartItems(JSON.parse(local)); } catch (e) { }
        } else {
          setCartItems([]);
        }
        return;
      }
      const response = await fetch(`https://api.codingboss.in/gobi360/cart/?user_id=${userId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();

      let backendItems = [];
      if (data.status && data.shops && Array.isArray(data.shops)) {
        const shopsMeta = {};
        data.shops.forEach(shop => {
          shopsMeta[shop.shop_id || shop.id] = {
            available_points: shop.available_points,
            minimum_redeem_points: shop.minimum_redeem_points
          };
          if (shop.products && Array.isArray(shop.products)) {
            const enriched = shop.products.map(p => ({ ...p, shopId: shop.shop_id || shop.id }));
            backendItems = backendItems.concat(enriched);
          }
        });
        setCartShopsMeta(shopsMeta);
      } else if (data.status && data.cart_items) {
        // Fallback for old API structure just in case
        backendItems = data.cart_items;
      }

      if (data.status) {
        if (backendItems.length > 0) {
          const safeItems = backendItems.map(item => {
            const prodId = item.product_id || item.product;
            const localProd = products.find(p => p.id === prodId);
            return {
              ...item,
              id: item.cart_item_id || item.id,
              productId: prodId,
              shopId: (localProd && localProd.shop_id) ? localProd.shop_id : (item.shop_id || item.shopId || activeShopId),
              variationId: item.variation_id || item.variation?.id || null,
              name: item.product_name || item.name || (localProd ? (localProd.name || localProd.product_name) : `Item #${prodId || ''}`),
              image: item.image || (localProd ? (localProd.image_url || localProd.product_image) : null),
              variationName: item.variation?.value || item.variationName || (item.variation ? `Var ${item.variation}` : ''),
              price: parseFloat(item.price || 0),
              quantity: parseInt(item.quantity || 1, 10)
            };
          });
          setCartItems(safeItems);
          localStorage.setItem('localCart', JSON.stringify(safeItems)); // Sync local cache with backend truth
          window.dispatchEvent(new Event('cartUpdated'));
        } else {
          // Backend returned empty cart successfully. Clear local cache.
          setCartItems([]);
          localStorage.setItem('localCart', JSON.stringify([]));
          window.dispatchEvent(new Event('cartUpdated'));
        }
      } else {
        // API returned status: false (or error). 
        // Do NOT fallback to local storage when logged in, to prevent showing previous user's cart.
        setCartItems([]);
        localStorage.setItem('localCart', JSON.stringify([]));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Only fallback to local cart on actual network failure, but if we have a userId, 
      // we should be careful not to show another user's cart. 
      // Safest is to just show empty if there's an error while logged in, 
      // but to preserve offline capability, we clear it if userId is present.
      if (getUserId()) {
        setCartItems([]);
      } else {
        const local = localStorage.getItem('localCart');
        if (local) {
          try { setCartItems(JSON.parse(local)); } catch (e) { }
        }
      }
    }
  };

  useEffect(() => {
    fetchCartItems();

    if (isUserLoggedIn()) {
      // Points fetching removed to prevent 404 errors globally.
      // Points should only be fetched in specific customer views.
    }
  }, []);

  useEffect(() => {
    const handleOpenCart = () => {
      setIsCartOpen(true);
    };

    // Check if we arrived with #cart or #checkout
    if (window.location.hash === '#cart' || window.location.hash === '#checkout') {
      const isCheckout = window.location.hash === '#checkout';
      setTimeout(() => {
        if (isCheckout) {
          setView('checkout');
          setIsCartOpen(false);
        } else {
          handleOpenCart();
        }
        // Also auto-select shop from ?shop= query param if present
        const urlParams = new URLSearchParams(window.location.search);
        const shopParam = urlParams.get('shop');
        if (shopParam) {
          setActiveShopId(Number(shopParam) || shopParam);
        }
        // Clean up hash so it doesn't reopen on reload
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }, 0);
    }

    const handleTriggerCheckout = () => {
      setView('checkout');
      setIsCartOpen(false);
    };

    window.addEventListener('openGlobalCart', handleOpenCart);
    window.addEventListener('triggerCheckout', handleTriggerCheckout);
    return () => {
      window.removeEventListener('openGlobalCart', handleOpenCart);
      window.removeEventListener('triggerCheckout', handleTriggerCheckout);
    };
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      window.dispatchEvent(new CustomEvent('cartVisibilityChanged', { detail: { isVisible: true } }));
    } else {
      window.dispatchEvent(new CustomEvent('cartVisibilityChanged', { detail: { isVisible: false } }));
    }
  }, [isCartOpen]);

  // Enrich cart items when products/variations finish loading
  useEffect(() => {
    if (products.length > 0 && cartItems.length > 0) {
      setCartItems(prev => prev.map(item => {
        let updatedItem = { ...item };
        const localProd = products.find(p => p.id === item.productId || p.id === item.product || p.id === item.product_id);
        if (localProd) {
          if (!updatedItem.name || updatedItem.name.startsWith('Item #')) {
            updatedItem.name = localProd.name || localProd.product_name;
          }
          if (!updatedItem.image || updatedItem.image === '' || updatedItem.image === null) {
            updatedItem.image = localProd.image_url || localProd.product_image;
          }
        }
        if (productVariations.length > 0 && item.variationId) {
          const localVar = productVariations.find(v => v.id === item.variationId || v.id === item.variation || v.id === item.variation_id);
          if (localVar && (!updatedItem.variationName || updatedItem.variationName.startsWith('Var '))) {
            updatedItem.variationName = localVar.variation_value || localVar.variation_name || localVar.name;
          }
        }
        return updatedItem;
      }));
    }
  }, [products, productVariations]);

  const handleAddToCart = async (product, variation, price) => {
    if (!isUserLoggedIn()) {
      sessionStorage.setItem('pendingCartItem', JSON.stringify({ product, variation, price, shopId: activeShopId }));
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }

    let newTotalQty = 1;
    // 1. Optimistic UI update to keep rich data (name, image)
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.productId === product.id && item.variationId === (variation?.id || null));
      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        newTotalQty = newCart[existingItemIndex].quantity;
        localStorage.setItem('localCart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
        return newCart;
      } else {
        const newCart = [...prev, {
          productId: product.id,
          variationId: variation?.id || null,
          name: product.name || product.product_name,
          variationName: variation ? (variation.variation_value || variation.variation_name || variation.name) : '',
          price: parseFloat(price || 0),
          image: product.image_url || product.product_image,
          quantity: 1,
          shopId: product.shop_id || activeShopId
        }];
        localStorage.setItem('localCart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
        return newCart;
      }
    });
    setIsCartOpen(true);

    // 2. API call in background
    try {
      const userId = getUserId();
      if (!userId) return; // Skip backend sync if not logged in
      const res = await fetch('https://api.codingboss.in/gobi360/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.id,
          variation_id: variation ? variation.id : null,
          quantity: newTotalQty
        })
      });
      const data = await res.json();
      // Refresh cart to get the backend `id` for new items only if API succeeded
      if (res.ok && data.status !== false) {
        fetchCartItems();
      } else {
        console.warn('Backend cart update failed, relying on local optimistic state:', data.message);
      }
    } catch (error) {
      console.error('Error adding to cart API:', error);
    }
  };

  const handleUpdateQuantity = async (index, delta) => {
    const item = cartItems[index];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }

    setCartItems(prev => {
      const newCart = [...prev];
      newCart[index].quantity = newQty;
      localStorage.setItem('localCart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('cartUpdated'));
      return newCart;
    });

    if (item.id) {
      try {
        await fetch(`https://api.codingboss.in/gobi360/cart/item/${item.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ quantity: newQty })
        });
      } catch (error) {
        console.error('Error updating quantity API:', error);
      }
    }
  };

  useEffect(() => {
    if (isUserLoggedIn()) {
      const pendingStr = sessionStorage.getItem('pendingCartItem');
      if (pendingStr) {
        try {
          const pending = JSON.parse(pendingStr);
          sessionStorage.removeItem('pendingCartItem');
          if (pending.shopId) {
            setActiveShopId(pending.shopId);
          }
          handleAddToCart(pending.product, pending.variation, pending.price);
        } catch (e) {
          console.error("Error processing pending cart item", e);
        }
      }
    }
  }, []); // Run once on mount

  const handleRemoveItem = async (index) => {
    const item = cartItems[index];
    setCartItems(prev => {
      const newCart = prev.filter((_, i) => i !== index);
      localStorage.setItem('localCart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('cartUpdated'));
      return newCart;
    });

    if (item.id) {
      try {
        await fetch(`https://api.codingboss.in/gobi360/cart/item/${item.id}/`, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
      } catch (error) {
        console.error('Error removing item API:', error);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.id) {
      showError("Please save your delivery address first.");
      return;
    }

    // Prevent checkout with a local timestamp ID (which causes 400 Bad Request)
    if (String(formData.id).length > 10) {
      showError("Your address hasn't been saved to the server yet. Please edit and save it properly.");
      return;
    }

    try {
      const userId = getUserId();
      const response = await fetch('https://api.codingboss.in/gobi360/checkout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          user_id: Number(userId),
          address_id: Number(formData.id),
          payment_method: 'COD',
          shop_id: cartItems.length > 0 ? (cartItems[0].shopId || cartItems[0].shop_id || activeShopId) : activeShopId,
          use_points: Object.values(usePointsMap).some(v => v),
          redeem: Object.keys(usePointsMap).filter(k => usePointsMap[k]).map(shopId => {
            const shopPointObj = pointsData.find(p => String(p.shop_id) === String(shopId));
            let availablePoints = shopPointObj ? Number(shopPointObj.available_points || shopPointObj.points || 0) : 0;
            if (cartShopsMeta[shopId] && cartShopsMeta[shopId].available_points !== undefined) {
              availablePoints = Math.max(availablePoints, Number(cartShopsMeta[shopId].available_points));
            }
            const srs = rewardSettingsMap[shopId] || {
              purchase_amount: 100, reward_points: 1, redeem_points: 10, redeem_amount: 1,
              minimum_redeem_points: (cartShopsMeta[shopId] ? cartShopsMeta[shopId].minimum_redeem_points : 10)
            };
            const usablePoints = (srs && availablePoints >= srs.minimum_redeem_points) ? Math.floor(availablePoints / srs.redeem_points) * srs.redeem_points : 0;
            return {
              shop_id: Number(shopId),
              points: usablePoints
            };
          })
        })
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Server returned non-JSON:", text);
        if (!response.ok) {
          showError(`Server Error (${response.status}): The backend encountered a problem.`);
          return;
        }
      }

      console.log('[Checkout] API response:', data);

      if (data.status || response.ok) {
        // Find shop name
        const shop = shops.find(s => s.id === activeShopId);
        const shopName = shop ? (shop.name || shop.shop_name) : 'Bannari Amman';
        const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Add detailed mock order
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pin}`;
        addMockOrder(totalAmount, shopName, cartItems, fullAddress);

        // Refetch points to update the balance after using them
        // Points fetch removed to prevent global 404 errors.

        setOrderSuccess(true);
        setTimeout(() => {
          setOrderSuccess(false);
          setCartItems([]);
          setUsePointsMap({}); // Reset use points toggle
          localStorage.setItem('localCart', JSON.stringify([]));
          window.dispatchEvent(new Event('cartUpdated'));
          setIsCartOpen(false);
          setView('browse');
          navigate('/');
        }, 3000);
      } else {
        const msg = String(data.error || data.message || '');
        console.error('[Checkout] failed:', msg);
        // Detect backend DB migration error (deliveryman_id column missing)
        if (msg.includes('deliveryman_id') || msg.includes('Unknown column')) {
          showError("Order could not be placed due to a server issue. Please contact support or try again later.");
        } else {
          showError(msg || "Checkout failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      showError("Network error placing order. Please try again.");
    }
  };

  const fetchAddress = async () => {
    try {
      const userId = getUserId();
      if (!userId) return; // Do not fetch address if not logged in
      const response = await fetch(`https://api.codingboss.in/gobi360/address/?user_id=${userId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.status && data.addresses && data.addresses.length > 0) {
        setAllAddresses(data.addresses);
        // Find the most recent or default address
        const addr = data.addresses[data.addresses.length - 1];
        setFormData({
          id: addr.id || null,
          fullName: addr.full_name || addr.name || '',
          phone: addr.mobile || addr.phone || '',
          address: addr.address_line || addr.address || '',
          city: addr.city || '',
          state: addr.state || 'Tamil Nadu',
          pin: addr.pincode || '',
          landmark: addr.landmark || 'Not provided',
          isDefault: addr.is_default !== undefined ? addr.is_default : true
        });
        setIsAddressSaved(true);
        setAddressView('selected');
      } else {
        setAllAddresses([]);

        let defaultName = '';
        let defaultPhone = '';
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const u = JSON.parse(storedUser);
            defaultName = u.name || u.full_name || '';
            defaultPhone = u.phone || u.mobile || '';
          }
        } catch (e) { }

        setFormData(prev => ({
          ...prev,
          fullName: defaultName,
          phone: defaultPhone
        }));

        setAddressView('form');
        setIsAddressSaved(false);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAllAddresses([]);
      setAddressView('form');
      setIsAddressSaved(false);
    }
  };

  const handleDeleteAddress = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await fetch(`https://api.codingboss.in/gobi360/address/${id}/`, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        if (!response.ok) {
          alert('Failed to delete address on the server.');
          return;
        }

        await fetchAddress();
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Network error deleting address.');
      }
    }
  };

  const handleEditAddress = (addr, e) => {
    e.stopPropagation();
    setFormData({
      id: addr.id,
      fullName: addr.full_name || '',
      phone: addr.mobile || '',
      address: addr.address_line || '',
      city: addr.city || '',
      state: addr.state || 'Tamil Nadu',
      pin: addr.pincode || '',
      landmark: addr.landmark || 'Not provided',
      isDefault: addr.is_default !== undefined ? addr.is_default : true
    });
    setAddressView('form');
  };

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();

        if (data && data.address) {
          const addr = data.address;
          const street = addr.road || addr.suburb || addr.neighbourhood || '';
          const city = addr.city || addr.town || addr.county || '';
          const state = addr.state || 'Tamil Nadu';
          const pin = addr.postcode || '';
          const fullAddress = `${street ? street + ', ' : ''}${addr.suburb ? addr.suburb : ''}`.trim();

          setFormData(prev => ({
            ...prev,
            address: fullAddress || data.display_name || '',
            city: city,
            state: state,
            pin: pin
          }));
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        alert("Failed to get address from location. Please enter manually.");
      } finally {
        setIsFetchingLocation(false);
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      alert("Please allow location access to use this feature, or enter manually.");
      setIsFetchingLocation(false);
    });
  };

  const handleSaveAddress = async () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pin) {
      alert("Please fill all required address fields");
      return;
    }
    try {
      const userId = getUserId();
      const isLocalId = formData.id ? String(formData.id).length > 10 : false;

      const url = (formData.id && !isLocalId)
        ? `https://api.codingboss.in/gobi360/address/${formData.id}/`
        : 'https://api.codingboss.in/gobi360/address/';
      const method = (formData.id && !isLocalId) ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          user_id: userId,
          user: userId, // Sending both in case backend expects one or the other
          address_type: 'home',
          full_name: formData.fullName,
          mobile: formData.phone,
          address_line: formData.doorNo ? `${formData.doorNo}, ${formData.address}` : formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pin,
          landmark: formData.landmark,
          is_default: formData.isDefault
        })
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) {
          alert("Failed to save address. Server error.");
          return;
        }
      }

      if (response.ok && data.status !== false) {
        if (data.data && data.data.id) {
          setFormData(prev => ({ ...prev, id: data.data.id }));
        }
        setIsAddressSaved(true);
        await fetchAddress(); // Refresh list and switch to list/selected view
        setAddressView('list');
      } else {
        alert(data.message || data.error || "Failed to save address to the server. Please check your details.");
        return;
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert("Network error while saving address.");
    }
  };

  useEffect(() => {
    if (view === 'checkout') {
      fetchAddress();
    }
  }, [view]);

  const handleVariationClick = (productId, variationId) => {
    setActiveVariations(prev => ({ ...prev, [productId]: variationId }));
  };

  useEffect(() => {
    fetch('https://api.codingboss.in/gobi360/categories/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        const cat = data.find(c => c.id === categoryId);
        if (cat) setCategory(cat);
      })
      .catch(console.error);

    fetch('https://api.codingboss.in/gobi360/shops/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setShops(Array.isArray(data) ? data : data.results || []))
      .catch(console.error);

    fetch('https://api.codingboss.in/gobi360/product-categories/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setProductCategories(Array.isArray(data) ? data : data.results || []))
      .catch(console.error);

    fetch('https://api.codingboss.in/gobi360/products/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : data.results || []))
      .catch(console.error);

    fetch('https://api.codingboss.in/gobi360/product-variations/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => setProductVariations(Array.isArray(data) ? data : data.results || []))
      .catch(console.error);
  }, [categoryId]);

  const handleShopClick = (shopId) => {
    setActiveShopId(activeShopId === shopId ? null : shopId);
    setActiveProductCategoryId(null);
  };

  const handleProductCategoryClick = (pcId) => {
    setActiveProductCategoryId(activeProductCategoryId === pcId ? null : pcId);
  };

  const filteredShops = shops.filter(shop => shop.category === categoryId || shop.category_id === categoryId || (category && shop.category === category.name));
  const filteredProductCategories = productCategories.filter(pc => pc.shop === activeShopId || pc.shop_id === activeShopId);
  const filteredProducts = products.filter(p => p.category === activeProductCategoryId || p.category_id === activeProductCategoryId || p.product_category === activeProductCategoryId);

  const activeShop = shops.find(s => s.id === activeShopId);
  const activeProductCategory = productCategories.find(pc => pc.id === activeProductCategoryId);

  // Dynamic Banners based on Category
  const getBanners = () => {
    const catName = category ? (category.name || category.category_name).toLowerCase() : '';
    const baseBanner = { brand: '★ 4.9', highlight: 'Explore services in this category.', buttonText: 'View Details' };

    if (catName.includes('grocery') || catName.includes('supermarket')) {
      return [
        { ...baseBanner, id: 1, title: 'Supermarket / Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80', accentColor: '#fbbf24' },
        { ...baseBanner, id: 2, title: 'Fresh Produce', image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1400&q=80', accentColor: '#4ade80' },
        { ...baseBanner, id: 3, title: 'Daily Essentials', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1400&q=80', accentColor: '#f87171' },
        { ...baseBanner, id: 4, title: 'Super Deals', image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1400&q=80', accentColor: '#60a5fa' },
        { ...baseBanner, id: 5, title: 'Organic Veggies', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=1400&q=80', accentColor: '#a78bfa' },
        { ...baseBanner, id: 6, title: 'Dairy & Staples', image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=1400&q=80', accentColor: '#f472b6' },
        { ...baseBanner, id: 7, title: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1400&q=80', accentColor: '#2dd4bf' }
      ];
    } else if (catName.includes('electronic') || catName.includes('wood')) {
      return [
        { ...baseBanner, id: 1, title: 'Electronics / Woods', image: '/electronics_wood.png', accentColor: '#3b82f6' },
        { ...baseBanner, id: 2, title: 'Latest Gadgets', image: '/latest_gadgets.png', accentColor: '#fbbf24' },
        { ...baseBanner, id: 3, title: 'Smart Home', image: '/smart_home.png', accentColor: '#10b981' },
        { ...baseBanner, id: 4, title: 'Premium Tech', image: '/premium_tech.png', accentColor: '#f43f5e' },
        { ...baseBanner, id: 5, title: 'Connected Devices', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1400&q=80', accentColor: '#8b5cf6' },
        { ...baseBanner, id: 6, title: 'Wood Crafting', image: '/wood_crafting.png', accentColor: '#f97316' },
        { ...baseBanner, id: 7, title: 'Audio & Wearables', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=80', accentColor: '#ec4899' }
      ];
    } else if (catName.includes('organic')) {
      return [
        { ...baseBanner, id: 1, title: 'Organic Items', image: '/organic_items.png', accentColor: '#65a30d' },
        { ...baseBanner, id: 2, title: 'Farm Fresh', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1400&q=80', accentColor: '#16a34a' },
        { ...baseBanner, id: 3, title: 'Pure Ingredients', image: '/pure_ingredients.png', accentColor: '#d97706' },
        { ...baseBanner, id: 4, title: 'Natural Remedies', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=1400&q=80', accentColor: '#059669' },
        { ...baseBanner, id: 5, title: 'Healthy Diet', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=80', accentColor: '#0ea5e9' },
        { ...baseBanner, id: 6, title: 'Organic Farming', image: '/organic_farming.png', accentColor: '#84cc16' },
        { ...baseBanner, id: 7, title: 'Herbal Essentials', image: '/herbal_essentials.png', accentColor: '#2dd4bf' }
      ];
    } else if (catName.includes('clothes') || catName.includes('optical')) {
      return [
        { ...baseBanner, id: 1, title: 'Clothes / Opticals', image: '/clothes_opticals.png', accentColor: '#db2777' },
        { ...baseBanner, id: 2, title: 'Trendy Fashion', image: '/trendy_fashion.png', accentColor: '#c026d3' },
        { ...baseBanner, id: 3, title: 'Designer Eyewear', image: '/designer_eyewear.png', accentColor: '#4f46e5' },
        { ...baseBanner, id: 4, title: 'Summer Collection', image: '/summer_collection.png', accentColor: '#e11d48' },
        { ...baseBanner, id: 5, title: 'Casual Wear', image: '/casual_wear.png', accentColor: '#f59e0b' },
        { ...baseBanner, id: 6, title: 'Boutique Styles', image: '/boutique_styles.png', accentColor: '#10b981' },
        { ...baseBanner, id: 7, title: 'Shoes & Accessories', image: '/shoes_accessories.png', accentColor: '#0284c7' }
      ];
    } else if (catName.includes('animal') || catName.includes('feed')) {
      return [
        { ...baseBanner, id: 1, title: 'Animals Feeds', image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1400&q=80', accentColor: '#b45309' },
        { ...baseBanner, id: 2, title: 'Pet Care', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2892523?w=1400&q=80', accentColor: '#fb923c' },
        { ...baseBanner, id: 3, title: 'Premium Nutrition', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1400&q=80', accentColor: '#14b8a6' },
        { ...baseBanner, id: 4, title: 'Healthy Pets', image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=1400&q=80', accentColor: '#a855f7' },
        { ...baseBanner, id: 5, title: 'Farm Livestock', image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=1400&q=80', accentColor: '#65a30d' },
        { ...baseBanner, id: 6, title: 'Pet Supplies', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1400&q=80', accentColor: '#ec4899' },
        { ...baseBanner, id: 7, title: 'Puppy Love', image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=1400&q=80', accentColor: '#3b82f6' }
      ];
    }

    // Default (Food)
    return [
      { ...baseBanner, id: 1, title: 'Restaurants / Food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400&q=80', accentColor: '#fbbf24' },
      { ...baseBanner, id: 2, title: 'Woodfire Pizzas', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=80', accentColor: '#f97316' },
      { ...baseBanner, id: 3, title: 'Fresh Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1400&q=80', accentColor: '#a78bfa' },
      { ...baseBanner, id: 4, title: 'Prime Steak', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1400&q=80', accentColor: '#ef4444' },
      { ...baseBanner, id: 5, title: 'Truffle Pasta', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1400&q=80', accentColor: '#fde047' },
      { ...baseBanner, id: 6, title: 'Rich Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1400&q=80', accentColor: '#fbcfe8' },
      { ...baseBanner, id: 7, title: 'Ramen & Noodles', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1400&q=80', accentColor: '#38bdf8' }
    ];
  };

  return (
    <div className="swiggy-app-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>


      {/* Full Width Hero Section */}
      {view !== 'checkout' && view !== 'cart' && (
        <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginBottom: '2rem' }}>
          {(() => {
            const customBanners = getBanners();
            return <BannerCarousel customBanners={customBanners} />;
          })()}
        </div>
      )}

      <main className="swiggy-main-content" style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '0 0.5rem 2rem 0.5rem' : '0 2rem 2rem 2rem', width: isMobile ? '100%' : '96%' }}>

        {view === 'checkout' ? (
          <div style={{ padding: isMobile ? '1rem 0' : '2rem 0', display: 'flex', gap: '2rem', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Left Panel: Form */}
            <div style={{ flex: '1 1 500px', background: 'white', borderRadius: '1rem', padding: isMobile ? '1.25rem' : '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Secure Checkout</h2>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '0.5rem' }}>
                <p style={{ color: '#64748b', margin: 0, fontSize: isMobile ? '0.75rem' : '0.85rem', flex: 1 }}>Please select or enter your shipping details.</p>
                {addressView === 'selected' && isAddressSaved && (
                  <button onClick={() => setAddressView('list')} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #2563eb', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Change Address</button>
                )}
                {addressView === 'list' && (
                  <button onClick={() => {
                    let defaultName = '';
                    let defaultPhone = '';
                    try {
                      const storedUser = localStorage.getItem('user');
                      if (storedUser) {
                        const u = JSON.parse(storedUser);
                        defaultName = u.name || u.full_name || '';
                        defaultPhone = u.phone || u.mobile || '';
                      }
                    } catch (e) { }
                    setFormData({ id: null, fullName: defaultName, phone: defaultPhone, doorNo: '', address: '', city: '', state: 'Tamil Nadu', pin: '', landmark: 'Not provided', isDefault: true });
                    setAddressView('form');
                  }} style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #059669', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>+ Add New Address</button>
                )}
              </div>

              {addressView === 'form' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <CheckCircle size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="Full Name" style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #2563eb', outline: 'none', fontSize: '0.85rem', color: '#0f172a', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="tel" value={formData.phone} maxLength={10} onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="9876543210" style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #2563eb', outline: 'none', fontSize: '0.85rem', color: '#0f172a', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>Door No. / Flat No.</label>
                    <div style={{ position: 'relative' }}>
                      <Home size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" value={formData.doorNo || ''} onChange={e => setFormData({ ...formData, doorNo: e.target.value })} placeholder="Door No. / Flat No." style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #2563eb', outline: 'none', fontSize: '0.85rem', color: '#0f172a', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', margin: 0 }}>Delivery Address</label>
                      <button
                        type="button"
                        onClick={handleGetLiveLocation}
                        disabled={isFetchingLocation}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#ecfdf5', color: '#059669', border: '1px solid #059669', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 700, cursor: isFetchingLocation ? 'not-allowed' : 'pointer', opacity: isFetchingLocation ? 0.7 : 1 }}
                      >
                        <MapPin size={14} />
                        {isFetchingLocation ? 'Fetching...' : 'Use Live Location'}
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                      <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Address" rows="3" style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '0.5rem', border: '1px solid #2563eb', outline: 'none', fontSize: '0.85rem', color: '#0f172a', resize: 'vertical', boxSizing: 'border-box' }}></textarea>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>City</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="City" style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #2563eb', outline: 'none', fontSize: '0.85rem', color: '#0f172a', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>State</label>
                      <div style={{ position: 'relative' }}>
                        <select value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a', appearance: 'none', boxSizing: 'border-box', background: 'white' }}>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Karnataka">Karnataka</option>
                        </select>
                        <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ width: 'calc(50% - 0.5rem)' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>PIN Code</label>
                    <input type="text" value={formData.pin} onChange={e => setFormData({ ...formData, pin: e.target.value })} placeholder="PIN Code" style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #2563eb', outline: 'none', fontSize: '0.85rem', color: '#0f172a', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    {allAddresses.length > 0 && (
                      <button onClick={() => setAddressView('list')} style={{ flex: 1, background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', padding: '0.8rem', borderRadius: '0.5rem', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    )}
                    <button onClick={handleSaveAddress} style={{ flex: 2, background: '#2563eb', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '0.5rem', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}>
                      Save Address
                    </button>
                  </div>
                </div>
              )}

              {addressView === 'list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {allAddresses.map((addr) => (
                    <div key={addr.id}
                      onClick={() => {
                        setFormData({
                          id: addr.id,
                          fullName: addr.full_name || addr.name || '',
                          phone: addr.phone || addr.mobile || '',
                          address: addr.address_line || addr.address || '',
                          city: addr.city || '',
                          state: addr.state || 'Tamil Nadu',
                          pin: addr.pincode || '',
                          landmark: addr.landmark || 'Not provided',
                          isDefault: addr.is_default !== undefined ? addr.is_default : true
                        });
                      }}
                      style={{ border: formData.id === addr.id ? '2px solid #059669' : '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem', background: formData.id === addr.id ? '#ecfdf5' : '#ffffff', cursor: 'pointer', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{addr.full_name || 'User'}</span>
                        {formData.id === addr.id && <CheckCircle size={18} color="#059669" />}
                      </div>
                      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <Edit2 size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={(e) => handleEditAddress(addr, e)} />
                        <Trash2 size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={(e) => handleDeleteAddress(addr.id, e)} />
                      </div>
                      <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.8rem', fontSize: '0.9rem' }}>{addr.mobile}</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
                        {addr.address_line}<br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setAddressView('selected')} style={{ width: 'fit-content', background: 'transparent', color: '#0f172a', border: '1px solid #0f172a', padding: '0.6rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={16} /> Back to checkout
                  </button>
                </div>
              )}

              {addressView === 'selected' && (
                <div style={{ border: '1px solid #2563eb', borderRadius: '0.5rem', padding: '1.5rem', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{formData.fullName || 'User'}</span>
                    <CheckCircle size={18} color="#2563eb" />
                  </div>
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.8rem', fontSize: '0.9rem' }}>{formData.phone || 'Phone Number'}</div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {formData.address || 'Address Line'}<br />
                    {formData.city || 'City'}, {formData.state || 'State'} - {formData.pin || 'PIN'}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel: Summary */}
            <div style={{ flex: '1 1 350px', background: 'white', borderRadius: '1rem', padding: isMobile ? '1.25rem' : '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>Order Summary</h3>

              {(() => {
                const groupedItems = cartItems.reduce((acc, item) => {
                  const shopId = item.shopId || item.shop_id || activeShopId;
                  if (!acc[shopId]) acc[shopId] = [];
                  acc[shopId].push(item);
                  return acc;
                }, {});

                const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                let totalDiscount = 0;
                Object.entries(groupedItems).forEach(([shopId, items]) => {
                  if (usePointsMap[shopId]) {
                    const shopMeta = cartShopsMeta[shopId];
                    let availablePoints = 0;
                    if (shopMeta && shopMeta.available_points !== undefined) {
                      availablePoints = Number(shopMeta.available_points);
                    } else {
                      const shopPointObj = pointsData.find(p => String(p.shop_id) === String(shopId));
                      availablePoints = shopPointObj ? Number(shopPointObj.available_points || shopPointObj.points || 0) : 0;
                    }
                    const shopRewardSetting = rewardSettingsMap[shopId];
                    if (shopRewardSetting && availablePoints >= shopRewardSetting.minimum_redeem_points) {
                      const usablePoints = Math.floor(availablePoints / shopRewardSetting.redeem_points) * shopRewardSetting.redeem_points;
                      let shopDiscount = (usablePoints / shopRewardSetting.redeem_points) * shopRewardSetting.redeem_amount;

                      const shopSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                      if (shopDiscount > shopSubtotal) {
                        shopDiscount = shopSubtotal;
                      }

                      totalDiscount += shopDiscount;
                    }
                  }
                });

                const finalTotal = Math.max(0, subtotal - totalDiscount);

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {Object.entries(groupedItems).map(([shopId, items], groupIdx) => {
                      const shop = shops.find(s => String(s.id) === String(shopId) || String(s.shop_id) === String(shopId));
                      const shopName = shop ? (shop.name || shop.shop_name) : 'Shop';

                      const shopMeta = cartShopsMeta[shopId];
                      let availablePoints = 0;
                      if (shopMeta && shopMeta.available_points !== undefined) {
                        availablePoints = Number(shopMeta.available_points);
                      } else {
                        const shopPointObj = pointsData.find(p => String(p.shop_id) === String(shopId));
                        availablePoints = shopPointObj ? Number(shopPointObj.available_points || shopPointObj.points || 0) : 0;
                      }
                      const shopRewardSetting = rewardSettingsMap[shopId];

                      return (
                        <div key={shopId} style={{ background: '#f8fafc', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                          {/* Shop Header */}
                          <div style={{ padding: '1rem 1.2rem', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{shopName}</h3>
                            {availablePoints > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', color: '#059669', fontSize: '0.85rem', fontWeight: 700 }}>
                                <Star size={14} fill="#059669" color="#059669" />
                                <span>{availablePoints} Points Available</span>
                              </div>
                            )}
                          </div>

                          {/* Items */}
                          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {items.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: 'white' }}>
                                  {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} />}
                                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#64748b', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, border: '2px solid white' }}>
                                    {item.quantity}
                                  </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.name}</h4>
                                  {item.variationName && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.variationName}</span>}
                                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155', marginTop: '4px' }}>₹{item.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Loyalty Card for this shop */}
                          {(() => {
                            const shopMeta = cartShopsMeta[shopId] || {};
                            const minRedeem = shopMeta.minimum_redeem_points !== undefined ? Number(shopMeta.minimum_redeem_points) : 10;
                            const srs = rewardSettingsMap[shopId] || {
                              purchase_amount: 100, reward_points: 1, redeem_points: 10, redeem_amount: 1, minimum_redeem_points: minRedeem
                            };
                            return (
                              <div style={{ padding: '1rem', background: 'white', borderTop: '1px dashed #e2e8f0' }}>
                                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <div>
                                    <h4 style={{ margin: '0 0 0.2rem', color: '#1e3a8a', fontSize: '1.05rem', fontWeight: 800 }}>Shop Loyalty Points</h4>
                                    <p style={{ margin: 0, color: availablePoints > 0 ? '#2563eb' : '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Balance: {availablePoints} pts</p>
                                  </div>
                                  <div style={{ background: '#bfdbfe', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Star size={18} fill="#3b82f6" color="#3b82f6" />
                                  </div>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '0.75rem' }}>
                                  <div style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, flex: 1 }}>
                                    <p style={{ margin: '0 0 0.3rem', color: '#0f172a', fontWeight: 700 }}>• {srs.message?.earn || `Spend ₹${Number(srs.purchase_amount).toFixed(0)} → Earn ${srs.reward_points} point${srs.reward_points !== 1 ? 's' : ''}.`}</p>
                                    <p style={{ margin: '0 0 0.3rem' }}>• {srs.message?.redeem || `Redeem ${srs.redeem_points} points = ₹${Number(srs.redeem_amount).toFixed(0)} discount.`}</p>
                                    {availablePoints === 0 ? (
                                      <p style={{ margin: 0, color: '#f97316', fontWeight: 600 }}>• {srs.message?.minimum || 'Purchase to earn your first loyalty points!'}</p>
                                    ) : availablePoints < srs.minimum_redeem_points ? (
                                      <p style={{ margin: 0, color: '#ef4444', fontWeight: 600 }}>• {srs.message?.minimum || `Need ${srs.minimum_redeem_points - availablePoints} more points to redeem (spend ₹${Math.ceil(((srs.minimum_redeem_points - availablePoints) / srs.reward_points) * srs.purchase_amount)} more).`}</p>
                                    ) : (
                                      <p style={{ margin: 0, color: '#16a34a', fontWeight: 600 }}>• You have enough points to redeem!</p>
                                    )}
                                  </div>
                                  {availablePoints > 0 && availablePoints >= srs.minimum_redeem_points && (
                                    <div style={{ flexShrink: 0, marginLeft: 'auto', alignSelf: 'center' }}>
                                      <button
                                        onClick={() => setUsePointsMap(prev => ({ ...prev, [shopId]: !prev[shopId] }))}
                                        style={{
                                          background: 'transparent',
                                          color: '#2563eb',
                                          border: 'none',
                                          padding: '0.5rem 1rem',
                                          fontWeight: 800,
                                          fontSize: '1rem',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {usePointsMap[shopId] ? 'REMOVE' : 'APPLY'}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {totalDiscount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#16a34a', fontWeight: 700, marginBottom: '0.5rem' }}>
                          <span>Points Redeemed</span>
                          <span>- ₹{totalDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div style={{ borderTop: '1px dashed #cbd5e1', margin: '1rem 0' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', color: '#0f172a', fontWeight: 900 }}>
                        <span>Total</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={handlePlaceOrder}
                style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '1rem', borderRadius: '1rem', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', marginTop: '1.5rem', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}
              >
                Place Order securely
              </button>



            </div>
          </div>
        ) : view === 'cart' ? (
          <div className="cart-container" style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <style>
              {`
                .cart-grid {
                  display: grid;
                  grid-template-columns: 3fr 1fr 1fr;
                  align-items: center;
                  gap: 1rem;
                }
                .cart-header {
                  border-bottom: 1px solid #e2e8f0;
                  padding-bottom: 1rem;
                  margin-bottom: 1.5rem;
                  font-size: 0.8rem;
                  font-weight: 800;
                  color: #64748b;
                  letter-spacing: 1px;
                }
                @media (max-width: 768px) {
                  .cart-container {
                    padding: 0 !important;
                  }
                  .cart-title {
                    font-size: 1.6rem !important;
                    white-space: nowrap;
                    margin-bottom: 0.2rem !important;
                  }
                  .cart-items-wrapper {
                    padding: 0 !important;
                    background: transparent !important;
                    box-shadow: none !important;
                  }
                  .cart-grid {
                    display: block;
                    background: white;
                    border-radius: 12px;
                    padding: 1rem !important;
                    margin-bottom: 1rem;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                  }
                  .cart-header {
                    display: none;
                  }
                  .product-col {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: flex-start !important;
                    text-align: left !important;
                    gap: 1rem !important;
                    border-bottom: 1px dashed #e2e8f0;
                    padding-bottom: 1rem;
                    margin-bottom: 1rem;
                  }
                  .product-col-image {
                    width: 64px !important;
                    height: 64px !important;
                    border-radius: 8px !important;
                    margin: 0 !important;
                  }
                  .product-title {
                    font-size: 1rem !important;
                    margin-bottom: 0.2rem !important;
                    line-height: 1.2 !important;
                  }
                  .qty-col {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    width: 100%;
                  }
                  .qty-controls {
                    background: white !important;
                    border-radius: 6px !important;
                    padding: 2px !important;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                  }
                  .qty-btn {
                    border-radius: 4px !important;
                  }
                  .total-col {
                    display: block !important;
                    text-align: right !important;
                    font-size: 1.1rem !important;
                    color: #0f172a !important;
                  }
                  .order-summary-card {
                    padding: 1.5rem !important;
                    border-radius: 1rem !important;
                    border: 1px solid #e2e8f0 !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
                    margin-top: 0.5rem !important;
                    position: relative !important;
                    top: 0 !important;
                  }
                  .summary-divider {
                    margin: 0 -1.5rem 1.5rem -1.5rem !important;
                  }
                  .checkout-btn {
                    border-radius: 12px !important;
                    padding: 1rem !important;
                    font-size: 1.05rem !important;
                    background: #2563eb !important;
                    box-shadow: 0 4px 15px rgba(37,99,235,0.25) !important;
                    white-space: nowrap !important;
                  }
                }
              `}
            </style>
            <div style={{ marginBottom: '2rem' }}>
              <h2 className="cart-title" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-1px' }}>Shopping Cart</h2>
              <p style={{ color: '#64748b', margin: 0, fontWeight: 500 }}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} items in your cart</p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Left side cart items */}
              <div className="cart-items-wrapper" style={{ flex: '1 1 600px', background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', height: 'fit-content' }}>

                <div className="cart-grid cart-header">
                  <div>PRODUCT</div>
                  <div style={{ textAlign: 'center' }}>QUANTITY</div>
                  <div style={{ textAlign: 'right' }}>TOTAL</div>
                </div>

                {(() => {
                  const groupedItems = cartItems.reduce((acc, item) => {
                    const shopId = item.shopId || item.shop_id || activeShopId;
                    if (!acc[shopId]) acc[shopId] = [];
                    acc[shopId].push(item);
                    return acc;
                  }, {});

                  return Object.entries(groupedItems).map(([shopId, items], groupIdx) => {
                    const shop = shops.find(s => String(s.id) === String(shopId) || String(s.shop_id) === String(shopId));
                    const shopName = shop ? (shop.name || shop.shop_name) : 'Shop';

                    const shopPointObj = pointsData.find(p => String(p.shop_id) === String(shopId));
                    const availablePoints = shopPointObj ? Number(shopPointObj.available_points || shopPointObj.points || 0) : 0;
                    const shopRewardSetting = rewardSettingsMap[shopId];

                    return (
                      <div key={shopId} style={{ marginBottom: '2rem', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', background: '#fafaf9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{shopName}</h3>
                          {availablePoints > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontSize: '0.9rem', fontWeight: 700, background: '#d1fae5', padding: '0.3rem 0.8rem', borderRadius: '2rem' }}>
                              <Star size={16} fill="#059669" color="#059669" />
                              <span>{availablePoints} Points Available</span>
                            </div>
                          )}
                        </div>

                        {items.map((item, idx) => {
                          const originalIdx = cartItems.findIndex(ci => ci === item);
                          return (
                            <div key={originalIdx} className="cart-grid" style={{ borderBottom: idx < items.length - 1 ? '1px solid #f1f5f9' : 'none', padding: '1.5rem 0' }}>
                              {/* Product Column */}
                              <div className="product-col" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div className="product-col-image" style={{ width: '80px', height: '80px', borderRadius: '1rem', background: '#f8fafc', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                                  {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <h4 className="product-title" style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{item.name}</h4>
                                  <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>₹{parseFloat(item.price).toFixed(0)}</div>
                                  {item.variationName && <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.3rem', background: '#f1f5f9', display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '0.5rem' }}>{item.variationName}</div>}
                                </div>
                              </div>

                              {/* Quantity Column */}
                              <div className="qty-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                                <div className="qty-controls" style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '2rem', padding: '4px', border: '1px solid #e2e8f0' }}>
                                  <button className="qty-btn" onClick={() => handleUpdateQuantity(originalIdx, -1)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>-</button>
                                  <span style={{ width: '40px', textAlign: 'center', fontWeight: 900, color: '#0f172a', fontSize: '1rem' }}>{item.quantity}</span>
                                  <button className="qty-btn" onClick={() => handleUpdateQuantity(originalIdx, 1)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>+</button>
                                </div>
                                <button onClick={() => handleRemoveItem(originalIdx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                  <Trash2 size={14} /> Remove
                                </button>
                              </div>

                              {/* Total Column */}
                              <div className="total-col" style={{ textAlign: 'right', fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
                                ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          );
                        })}

                        {/* Loyalty Points for this shop */}
                        {(() => {
                          const shopMeta = cartShopsMeta[shopId] || {};
                          const minRedeem = shopMeta.minimum_redeem_points !== undefined ? Number(shopMeta.minimum_redeem_points) : 10;
                          const srs = rewardSettingsMap[shopId] || {
                            purchase_amount: 100, reward_points: 1, redeem_points: 10, redeem_amount: 1, minimum_redeem_points: minRedeem
                          };
                          return (
                            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '1rem', padding: '1.5rem', marginTop: '1rem' }}>
                              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                  <h4 style={{ margin: '0 0 0.2rem', color: '#1e3a8a', fontSize: '1.1rem', fontWeight: 800 }}>Shop Loyalty Points</h4>
                                  <p style={{ margin: 0, color: availablePoints > 0 ? '#2563eb' : '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>Balance: {availablePoints} pts</p>
                                </div>
                                <div style={{ background: '#bfdbfe', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Star size={20} fill="#3b82f6" color="#3b82f6" />
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>
                                  <p style={{ margin: '0 0 0.3rem', color: '#0f172a', fontWeight: 700 }}>• {srs.message?.earn || `Spend ₹${Number(srs.purchase_amount).toFixed(0)} → Earn ${srs.reward_points} point${srs.reward_points !== 1 ? 's' : ''}.`}</p>
                                  <p style={{ margin: '0 0 0.3rem' }}>• {srs.message?.redeem || `Redeem ${srs.redeem_points} points = ₹${Number(srs.redeem_amount).toFixed(0)} discount.`}</p>
                                  {availablePoints === 0 ? (
                                    <p style={{ margin: 0, color: '#f97316', fontWeight: 600 }}>• {srs.message?.minimum || 'Purchase to earn your first loyalty points!'}</p>
                                  ) : availablePoints < srs.minimum_redeem_points ? (
                                    <p style={{ margin: 0, color: '#ef4444', fontWeight: 600 }}>• {srs.message?.minimum || `Need ${srs.minimum_redeem_points - availablePoints} more points to redeem (spend ₹${Math.ceil(((srs.minimum_redeem_points - availablePoints) / srs.reward_points) * srs.purchase_amount)} more).`}</p>
                                  ) : (
                                    <p style={{ margin: 0, color: '#16a34a', fontWeight: 600 }}>• You have enough points to redeem!</p>
                                  )}
                                </div>
                                {availablePoints > 0 && availablePoints >= srs.minimum_redeem_points && (
                                  <div style={{ flexShrink: 0, marginLeft: 'auto', alignSelf: 'center' }}>
                                    <button
                                      onClick={() => setUsePointsMap(prev => ({ ...prev, [shopId]: !prev[shopId] }))}
                                      style={{
                                        background: 'transparent',
                                        color: '#2563eb',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {usePointsMap[shopId] ? 'REMOVE' : 'APPLY'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                          <button onClick={() => { setView('home'); window.scrollTo(0, 0); }} style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#f97316', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> Add more items
                          </button>
                        </div>

                      </div>
                    );
                  });
                })()}
                {cartItems.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
                    <p>Your cart is empty.</p>
                  </div>
                )}
              </div>

              {/* Right side summary */}
              <div style={{ flex: '1 1 350px' }}>
                <div className="order-summary-card" style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', position: 'sticky', top: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1.5rem 0' }}>Order Summary</h3>
                  {(() => {
                    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                    let totalDiscount = 0;
                    const groupedItems = cartItems.reduce((acc, item) => {
                      const shopId = item.shopId || item.shop_id || activeShopId;
                      if (!acc[shopId]) acc[shopId] = [];
                      acc[shopId].push(item);
                      return acc;
                    }, {});

                    Object.entries(groupedItems).forEach(([shopId, items]) => {
                      if (usePointsMap[shopId]) {
                        const shopPointObj = pointsData.find(p => String(p.shop_id) === String(shopId));
                        let availablePoints = shopPointObj ? Number(shopPointObj.available_points || shopPointObj.points || 0) : 0;
                        if (cartShopsMeta[shopId] && cartShopsMeta[shopId].available_points !== undefined) {
                          availablePoints = Math.max(availablePoints, Number(cartShopsMeta[shopId].available_points));
                        }
                        const srs = rewardSettingsMap[shopId] || {
                          purchase_amount: 100, reward_points: 1, redeem_points: 10, redeem_amount: 1,
                          minimum_redeem_points: (cartShopsMeta[shopId] ? cartShopsMeta[shopId].minimum_redeem_points : 10)
                        };
                        if (srs && availablePoints >= srs.minimum_redeem_points) {
                          const usablePoints = Math.floor(availablePoints / srs.redeem_points) * srs.redeem_points;
                          totalDiscount += (usablePoints / srs.redeem_points) * srs.redeem_amount;
                        }
                      }
                    });

                    const total = Math.max(0, subtotal - totalDiscount);

                    return (
                      <>

                        <div className="summary-divider" style={{ borderTop: '1px dashed #cbd5e1', margin: '0 -2rem 1.5rem -2rem' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', color: '#64748b', fontWeight: 700, marginBottom: '0.8rem' }}>
                          <span>Subtotal</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>

                        {totalDiscount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', color: '#16a34a', fontWeight: 700, marginBottom: '1.2rem' }}>
                            <span>Points Redeemed</span>
                            <span>- ₹{totalDiscount.toFixed(2)}</span>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Estimated Total</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>₹{total.toFixed(2)}</span>
                        </div>

                        <button
                          className="checkout-btn"
                          disabled={cartItems.length === 0}
                          onClick={() => {
                            if (!isUserLoggedIn()) {
                              navigate('/login', { state: { from: location.pathname + location.search } });
                              return;
                            }
                            setView('checkout');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '1.2rem', borderRadius: '2rem', fontWeight: 800, fontSize: '1.1rem', cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer', opacity: cartItems.length === 0 ? 0.6 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 20px rgba(37,99,235,0.3)', transition: 'all 0.3s ease', whiteSpace: 'nowrap' }}
                        >
                          Proceed to Checkout <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                          <ShieldCheck size={14} color="#f59e0b" /> Secure checkout guarantee
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '2.5rem 0 1.5rem 0', borderBottom: '2px solid #e2e8f0', marginBottom: '2.5rem', gap: '1rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                  {category ? (category.name || category.category_name) : 'CATEGORY'}
                </span>
                <span style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '1.4rem' }}>/</span>
                <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.1rem', background: '#eff6ff', padding: '6px 12px', borderRadius: '12px', border: '1px solid #bfdbfe', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  Explore
                </span>
              </div>
              <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', padding: '0.7rem 1.5rem', borderRadius: '999px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', color: '#334155', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)' }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)' }}>
                <ChevronLeft size={18} /> Back to Categories
              </button>
            </div>

            {/* Shops Section */}
            <div style={{ marginBottom: '3rem' }}>


              <div className="swiggy-horizontal-scroll" style={{ paddingBottom: '1rem', display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                {filteredShops.length > 0 ? filteredShops.map((shop, index) => (
                  <motion.div
                    key={shop.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleShopClick(shop.id)}
                    style={{
                      cursor: 'pointer',
                      minWidth: '180px',
                      maxWidth: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1.5rem 1.2rem 2rem',
                      gap: '1rem',
                      background: 'white',
                      borderRadius: '24px',
                      boxShadow: activeShopId === shop.id ? '0 15px 35px rgba(59, 130, 246, 0.2)' : '0 4px 15px rgba(0,0,0,0.03)',
                      border: activeShopId === shop.id ? '2px solid #3b82f6' : '1px solid #f1f5f9',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                    onMouseOver={e => { if (activeShopId !== shop.id) e.currentTarget.style.transform = 'translateY(-5px)'; }}
                    onMouseOut={e => { if (activeShopId !== shop.id) e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', boxShadow: activeShopId === shop.id ? '0 0 0 4px #3b82f6' : '0 10px 25px rgba(0,0,0,0.08)', background: '#f8fafc', transition: 'all 0.3s ease', marginTop: '0.5rem' }}>
                      {shop.image_url || shop.shop_image ? (
                        <img src={shop.image_url || shop.shop_image} alt={shop.name || shop.shop_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : null}
                    </div>
                    <span style={{ fontWeight: 900, textAlign: 'center', fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.2 }}>
                      {shop.name || shop.shop_name}
                    </span>
                  </motion.div>
                )) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No shops available in this category yet.</p>
                )}
              </div>
            </div>

            {/* Product Categories Section */}
            <AnimatePresence>
              {activeShopId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ marginBottom: '3rem', overflow: 'hidden' }}
                >
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem', letterSpacing: '-0.5px', borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>
                    Refine within {activeShop ? (activeShop.name || activeShop.shop_name) : ''}
                  </h3>

                  <div className="swiggy-horizontal-scroll" style={{ paddingBottom: '1.5rem', display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                    {filteredProductCategories.length > 0 ? filteredProductCategories.map((subcat, index) => (
                      <motion.div
                        key={subcat.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onClick={() => handleProductCategoryClick(subcat.id)}
                        style={{
                          cursor: 'pointer',
                          minWidth: '180px',
                          maxWidth: '180px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '2rem 1.2rem',
                          gap: '1.5rem',
                          background: 'white',
                          borderRadius: '24px',
                          boxShadow: activeProductCategoryId === subcat.id ? '0 15px 35px rgba(59, 130, 246, 0.2)' : '0 4px 15px rgba(0,0,0,0.03)',
                          border: activeProductCategoryId === subcat.id ? '2px solid #3b82f6' : '1px solid #f1f5f9',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          flexShrink: 0
                        }}
                        onMouseOver={e => { if (activeProductCategoryId !== subcat.id) e.currentTarget.style.transform = 'translateY(-5px)'; }}
                        onMouseOut={e => { if (activeProductCategoryId !== subcat.id) e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <div style={{ width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', boxShadow: activeProductCategoryId === subcat.id ? '0 0 0 4px #3b82f6' : '0 10px 25px rgba(0,0,0,0.08)', background: '#f8fafc', transition: 'all 0.3s ease' }}>
                          {subcat.image_url || subcat.category_image ? (
                            <img src={subcat.image_url || subcat.category_image} alt={subcat.name || subcat.category_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : null}
                        </div>
                        <span style={{ fontWeight: 900, textAlign: 'center', fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.2 }}>
                          {subcat.name || subcat.category_name}
                        </span>
                      </motion.div>
                    )) : (
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No product categories available.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Section */}
            <AnimatePresence>
              {activeProductCategoryId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  style={{ paddingTop: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '1.5rem 2rem', borderRadius: '2rem', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: '#0f172a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '16px', height: '16px', border: '2px solid #60a5fa', borderRadius: '4px' }} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', textTransform: 'uppercase' }}>
                          {activeProductCategory ? (activeProductCategory.name || activeProductCategory.category_name) : 'PRODUCTS'}
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Showing items</p>
                      </div>
                    </div>
                    <div style={{ background: '#0f172a', color: '#60a5fa', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 800, fontSize: '0.8rem' }}>
                      {filteredProducts.length} Items Available
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filteredProducts.length > 0 ? filteredProducts.map((product, idx) => {
                      const pVariations = productVariations.filter(v => v.product === product.id || v.product_id === product.id);
                      const selectedVariationId = activeVariations[product.id] || (pVariations.length > 0 ? pVariations[0].id : null);
                      const selectedVariation = pVariations.find(v => v.id === selectedVariationId);

                      // Compute price
                      const price = selectedVariation ? parseFloat(selectedVariation.price) : parseFloat(product.price || product.product_price || 0);
                      const originalPrice = price + (price * 0.25); // Fake 25% original price for UI

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          style={{ background: 'white', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}
                        >
                          {/* Top Image Cover */}
                          <div style={{ width: '100%', height: '180px', position: 'relative', background: '#f8fafc' }}>
                            {product.image_url || product.product_image ? (
                              <img src={product.image_url || product.product_image} alt={product.name || product.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : null}

                            {/* Heart Icon */}
                            <button style={{ position: 'absolute', top: '1rem', right: '1rem', width: '36px', height: '36px', borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                              <Heart size={18} color="#64748b" />
                            </button>

                            {/* Discount Badge */}
                            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(15,23,42,0.8)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
                              <span style={{ color: '#60a5fa' }}>🏷️</span> 25% OFF
                            </div>
                          </div>

                          {/* Content Area */}
                          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

                            {/* Title & Rating */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                                {product.name || product.product_name}
                              </h3>
                              <div style={{ border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={14} fill="#2563eb" color="#2563eb" /> 4.5
                              </div>
                            </div>

                            {/* Description */}
                            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.2rem', fontWeight: 500 }}>
                              Premium quality {product.name || product.product_name}. Highly rated and highly recommended by our users.
                            </p>

                            {/* Variation Pill */}
                            {pVariations.length > 0 ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {pVariations.map(variation => {
                                  const isActive = selectedVariationId === variation.id;
                                  return (
                                    <button
                                      key={variation.id}
                                      onClick={() => handleVariationClick(product.id, variation.id)}
                                      style={{
                                        background: isActive ? '#0f172a' : 'white',
                                        color: isActive ? 'white' : '#0f172a',
                                        padding: '0.5rem 1.2rem',
                                        borderRadius: '0.5rem',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      {variation.variation_value || variation.variation_name || variation.name}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div style={{ marginBottom: '1.5rem' }}>
                                <button style={{ background: '#0f172a', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', fontWeight: 800, fontSize: '0.85rem', border: '1px solid #0f172a', cursor: 'default' }}>
                                  Regular
                                </button>
                              </div>
                            )}

                            {/* Divider */}
                            <div style={{ borderTop: '1px dashed #e2e8f0', margin: '0 -1.5rem', marginBottom: '1.2rem' }}></div>

                            {/* Bottom Row: Price & Add Button */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>PRICE</span>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>₹{price.toFixed(0)}</span>
                                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#cbd5e1', textDecoration: 'line-through' }}>₹{originalPrice.toFixed(0)}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddToCart(product, selectedVariation, price)}
                                style={{ background: 'white', color: '#2563eb', border: '2px solid #2563eb', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                                onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; }}
                                onMouseOut={e => { e.currentTarget.style.background = 'white'; }}
                              >
                                ADD
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      );
                    }) : (
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>No products available in this category.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </>
        )}
      </main>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
              zIndex: 1000, display: 'flex', justifyContent: 'flex-end'
            }}
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{
                width: '100%', maxWidth: '400px', background: 'white',
                height: '100%', display: 'flex', flexDirection: 'column',
                boxShadow: '-10px 0 40px rgba(0,0,0,0.1)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: isMobile ? '1rem' : '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <ShoppingCart size={24} color="#0f172a" />
                  <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Your Cart</h2>
                  <span style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(37,99,235,0.3)' }}>
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button onClick={() => setIsCartOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#64748b', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }} onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '1rem' : '1.5rem', background: '#fbfcfd' }}>
                {cartItems.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100px', height: '100px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      <ShoppingCart size={48} color="#cbd5e1" />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: '#475569', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is empty</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Looks like you haven't added anything yet.</p>
                    {!isUserLoggedIn() ? (
                      <button
                        onClick={() => { setIsCartOpen(false); window.location.href = '/login'; }}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        🔐 Login to Shop
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsCartOpen(false)}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        Continue Shopping
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {(() => {
                      const groupedItems = cartItems.reduce((acc, item) => {
                        const shopId = item.shopId || item.shop_id || activeShopId;
                        if (!acc[shopId]) acc[shopId] = [];
                        acc[shopId].push(item);
                        return acc;
                      }, {});

                      return Object.entries(groupedItems).map(([shopId, items], groupIdx) => {
                        const shop = shops.find(s => String(s.id) === String(shopId) || String(s.shop_id) === String(shopId));
                        const shopName = shop ? (shop.name || shop.shop_name) : 'Shop';

                        const shopMeta = cartShopsMeta[shopId];
                        let availablePoints = 0;
                        if (shopMeta && shopMeta.available_points !== undefined) {
                          availablePoints = Number(shopMeta.available_points);
                        } else {
                          const shopPointObj = pointsData.find(p => String(p.shop_id) === String(shopId));
                          availablePoints = shopPointObj ? Number(shopPointObj.available_points || shopPointObj.points || 0) : 0;
                        }
                        const shopRewardSetting = rewardSettingsMap[shopId];

                        return (
                          <div key={shopId} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.8rem' : '1.2rem', background: '#f8fafc', padding: isMobile ? '0.75rem' : '1rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <div style={{ padding: '0 0.5rem' }}>
                              <h3 style={{ margin: 0, fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 900, color: '#0f172a' }}>{shopName}</h3>
                              {availablePoints > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', color: '#059669', fontSize: '0.85rem', fontWeight: 700 }}>
                                  <Star size={14} fill="#059669" color="#059669" />
                                  <span>{availablePoints} Points Available</span>
                                </div>
                              )}
                            </div>

                            {items.map((item, idx) => {
                              const originalIdx = cartItems.findIndex(ci => ci === item);
                              return (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  key={originalIdx}
                                  style={{ display: 'flex', gap: isMobile ? '0.5rem' : '0.8rem', background: 'white', padding: isMobile ? '0.5rem' : '0.8rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', position: 'relative' }}
                                >
                                  <div style={{ width: isMobile ? '65px' : '85px', height: isMobile ? '65px' : '85px', borderRadius: '12px', background: '#f8fafc', overflow: 'hidden', flexShrink: 0, boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
                                    {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                  </div>
                                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ margin: '0 0 0.2rem 0', fontWeight: 800, color: '#1e293b', fontSize: isMobile ? '0.95rem' : '1.1rem', lineHeight: 1.2 }}>{item.name}</h4>
                                        <button onClick={() => handleRemoveItem(originalIdx)} style={{ background: '#fef2f2', border: 'none', cursor: 'pointer', color: '#ef4444', width: isMobile ? '24px' : '28px', height: isMobile ? '24px' : '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }} title="Remove item">
                                          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "12" : "14"} height={isMobile ? "12" : "14"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                      </div>
                                      {item.variationName && <span style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#64748b', display: 'inline-block', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '1rem', marginTop: '0.3rem', fontWeight: 600 }}>{item.variationName}</span>}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                                      <span style={{ fontWeight: 900, color: '#0f172a', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>₹{item.price.toFixed(0)}</span>

                                      <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2px' }}>
                                        <button onClick={() => handleUpdateQuantity(originalIdx, -1)} style={{ width: isMobile ? '24px' : '28px', height: isMobile ? '24px' : '28px', background: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontWeight: 800 }}>-</button>
                                        <span style={{ width: isMobile ? '24px' : '32px', textAlign: 'center', fontSize: isMobile ? '0.85rem' : '0.95rem', fontWeight: 800, color: '#0f172a' }}>{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(originalIdx, 1)} style={{ width: isMobile ? '24px' : '28px', height: isMobile ? '24px' : '28px', background: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontWeight: 800 }}>+</button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}

                            {(() => {
                              const shopMeta = cartShopsMeta[shopId] || {};
                              const minRedeem = shopMeta.minimum_redeem_points !== undefined ? Number(shopMeta.minimum_redeem_points) : 10;
                              const srs = rewardSettingsMap[shopId] || {
                                purchase_amount: 100, reward_points: 1, redeem_points: 10, redeem_amount: 1, minimum_redeem_points: minRedeem
                              };
                              return (
                                srs && (
                                  <div style={{ background: 'white', border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '1rem', marginTop: '0.5rem' }}>
                                    <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <div>
                                        <h4 style={{ margin: '0 0 0.2rem', color: '#1e3a8a', fontSize: '1.05rem', fontWeight: 800 }}>Shop Loyalty Points</h4>
                                        <p style={{ margin: 0, color: availablePoints > 0 ? '#2563eb' : '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Balance: {availablePoints} pts</p>
                                      </div>
                                      <div style={{ background: '#bfdbfe', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Star size={16} fill="#3b82f6" color="#3b82f6" />
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '0.75rem' }}>
                                      <div style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.6, flex: 1 }}>
                                        <p style={{ margin: '0 0 0.3rem', color: '#0f172a', fontWeight: 700 }}>• {srs.message?.earn || `Spend ₹${Number(srs.purchase_amount).toFixed(0)} → Earn ${srs.reward_points} point${srs.reward_points !== 1 ? 's' : ''}.`}</p>
                                        <p style={{ margin: '0 0 0.3rem' }}>• {srs.message?.redeem || `Redeem ${srs.redeem_points} points = ₹${Number(srs.redeem_amount).toFixed(0)} discount.`}</p>
                                        {availablePoints === 0 ? (
                                          <p style={{ margin: 0, color: '#f97316', fontWeight: 600 }}>• {srs.message?.minimum || 'Purchase to earn your first loyalty points!'}</p>
                                        ) : availablePoints < srs.minimum_redeem_points ? (
                                          <p style={{ margin: 0, color: '#ef4444', fontWeight: 600 }}>• {srs.message?.minimum || `Need ${srs.minimum_redeem_points - availablePoints} more points to redeem (spend ₹${Math.ceil(((srs.minimum_redeem_points - availablePoints) / srs.reward_points) * srs.purchase_amount)} more).`}</p>
                                        ) : (
                                          <p style={{ margin: 0, color: '#16a34a', fontWeight: 600 }}>• You have enough points to redeem!</p>
                                        )}
                                      </div>
                                      {availablePoints > 0 && availablePoints >= srs.minimum_redeem_points && (
                                        <div style={{ flexShrink: 0, marginLeft: 'auto', alignSelf: 'center' }}>
                                          <button
                                            onClick={() => setUsePointsMap(prev => ({ ...prev, [shopId]: !prev[shopId] }))}
                                            style={{
                                              background: usePointsMap[shopId] ? '#ef4444' : '#2563eb',
                                              color: 'white',
                                              border: 'none',
                                              padding: '0.5rem 1rem',
                                              borderRadius: '0.5rem',
                                              fontWeight: 800,
                                              fontSize: '0.85rem',
                                              cursor: 'pointer'
                                            }}
                                          >
                                            {usePointsMap[shopId] ? 'REMOVE' : 'APPLY'}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              );
                            })()}

                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                (() => {
                  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                  let totalDiscount = 0;
                  const groupedItems = cartItems.reduce((acc, item) => {
                    const shopId = item.shopId || item.shop_id || activeShopId;
                    if (!acc[shopId]) acc[shopId] = [];
                    acc[shopId].push(item);
                    return acc;
                  }, {});

                  Object.entries(groupedItems).forEach(([shopId, items]) => {
                    if (usePointsMap[shopId]) {
                      const shopMeta = cartShopsMeta[shopId];
                      let availablePoints = 0;
                      if (shopMeta && shopMeta.available_points !== undefined) {
                        availablePoints = Number(shopMeta.available_points);
                      } else {
                        const shopPointObj = pointsData.find(p => String(p.shop_id) === String(shopId));
                        availablePoints = shopPointObj ? Number(shopPointObj.available_points || shopPointObj.points || 0) : 0;
                      }
                      const shopRewardSetting = rewardSettingsMap[shopId] || {
                        purchase_amount: 100, reward_points: 1, redeem_points: 10, redeem_amount: 1,
                        minimum_redeem_points: (cartShopsMeta[shopId] ? cartShopsMeta[shopId].minimum_redeem_points : 10)
                      };
                      if (shopRewardSetting && availablePoints >= shopRewardSetting.minimum_redeem_points) {
                        const usablePoints = Math.floor(availablePoints / shopRewardSetting.redeem_points) * shopRewardSetting.redeem_points;
                        let shopDiscount = (usablePoints / shopRewardSetting.redeem_points) * shopRewardSetting.redeem_amount;

                        const shopSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                        if (shopDiscount > shopSubtotal) {
                          shopDiscount = shopSubtotal;
                        }

                        totalDiscount += shopDiscount;
                      }
                    }
                  });

                  const finalTotal = Math.max(0, subtotal - totalDiscount);

                  return (
                    <div style={{ padding: '1.5rem', background: 'white', borderTop: '1px solid rgba(226, 232, 240, 0.5)', boxShadow: '0 -10px 30px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'flex-end' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b' }}>Subtotal</span>
                        <span style={{ color: '#64748b', fontWeight: 700, fontSize: '1rem' }}>₹{subtotal.toFixed(2)}</span>
                      </div>

                      {totalDiscount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'flex-end', color: '#16a34a' }}>
                          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Points Redeemed</span>
                          <span style={{ fontWeight: 700, fontSize: '1rem' }}>- ₹{totalDiscount.toFixed(2)}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#0f172a' }}>Total</span>
                        <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>₹{finalTotal.toFixed(2)}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem', fontWeight: 500 }}>Taxes and shipping calculated at checkout.</p>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          onClick={() => { setView('cart'); setIsCartOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          style={{ flex: 1, background: '#f1f5f9', color: '#334155', padding: '0.85rem 0.5rem', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap' }}
                          onMouseOver={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                          onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
                        >
                          View Cart
                        </button>
                        <button
                          onClick={() => {
                            if (!isUserLoggedIn()) {
                              navigate('/login', { state: { from: location.pathname + location.search } });
                              return;
                            }
                            setView('checkout');
                            setIsCartOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{ flex: 1.5, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '0.85rem 0.5rem', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 8px 20px rgba(37,99,235,0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          Checkout <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup (Celebration) */}
      <AnimatePresence>
        {orderSuccess && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: 'white',
                padding: '2.5rem 2rem', borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
                width: '90%', maxWidth: '380px', textAlign: 'center'
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1, damping: 15 }}
                style={{ width: '72px', height: '72px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <CheckCircle color="#10b981" size={40} />
              </motion.div>
              <div>
                <h3 style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.6rem', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>Order Confirmed!</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, margin: 0, lineHeight: '1.5' }}>
                  Thank you! Your order has been placed successfully and will be delivered soon.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Error Popup */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            style={{
              position: 'fixed', bottom: '100px', left: '50%',
              background: '#ef4444', padding: '1rem 1.5rem', borderRadius: '2rem',
              boxShadow: '0 10px 40px rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              zIndex: 9999, border: '2px solid #dc2626',
              width: 'max-content', maxWidth: '90%',
              textAlign: 'center'
            }}
          >
            <AlertCircle color="white" size={20} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem', lineHeight: '1.2' }}>{errorToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DynamicCategoryApp;
