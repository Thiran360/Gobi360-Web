import React, { createContext, useState, useContext, useEffect } from 'react';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [customerName, setCustomerName] = useState(localStorage.getItem('customerName') || 'Guest');
  const [ownerShopName, setOwnerShopName] = useState(localStorage.getItem('ownerShopName') || null);
  
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem('mockOrders')) || [
    { id: 'ORD-1234', customerName: 'Rajesh', amount: 500, date: '2026-07-20', status: 'Completed', shopName: 'Bannari Amman', items: [{name: 'Ghee Roast', price: 120, image: 'https://images.unsplash.com/photo-1627308595229-7830f5c92f9f'}] },
    { id: 'ORD-1235', customerName: 'Suresh', amount: 1200, date: '2026-07-19', status: 'Completed', shopName: 'Gobi Restaurant', items: [{name: 'Chicken Biryani', price: 250, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8'}] },
    { id: 'ORD-1236', customerName: 'Anita', amount: 800, date: '2026-07-20', status: 'Completed', shopName: 'Bannari Amman', items: [{name: 'Meals', price: 100, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950'}] },
  ]);

  const [discounts, setDiscounts] = useState(
    JSON.parse(localStorage.getItem('discounts')) || {}
  );

  useEffect(() => {
    localStorage.setItem('role', role || '');
    localStorage.setItem('customerName', customerName);
    localStorage.setItem('ownerShopName', ownerShopName || '');
    localStorage.setItem('mockOrders', JSON.stringify(orders));
  }, [role, customerName, ownerShopName, orders]);

  useEffect(() => {
    localStorage.setItem('discounts', JSON.stringify(discounts));
  }, [discounts]);

  const loginRole = (selectedRole, name = 'Customer', shopName = null) => {
    setRole(selectedRole);
    if (selectedRole === 'customer') {
      setCustomerName(name);
    } else if (selectedRole === 'owner') {
      setOwnerShopName(shopName);
    }
  };

  const logoutRole = () => {
    setRole(null);
    setCustomerName('Guest');
    setOwnerShopName(null);
  };

  const assignDiscount = (customer, percentage) => {
    setDiscounts(prev => ({
      ...prev,
      [customer]: percentage
    }));
  };

  const addMockOrder = (amount, shopName = 'Bannari Amman', cartItems = [], address = null) => {
    let orderCustomerName = customerName;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.name) orderCustomerName = u.name;
      } catch (e) {}
    }

    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      customerName: orderCustomerName,
      amount,
      shopName,
      items: cartItems,
      address: address,
      date: new Date().toISOString().split('T')[0],
      status: 'Placed'
    };
    setOrders([...orders, newOrder]);
  };

  const getMyDiscount = () => {
    if (role === 'customer' && discounts[customerName]) {
      return discounts[customerName];
    }
    return 0;
  };

  return (
    <ShopContext.Provider value={{ role, customerName, ownerShopName, orders, discounts, loginRole, logoutRole, assignDiscount, addMockOrder, getMyDiscount }}>
      {children}
    </ShopContext.Provider>
  );
};
