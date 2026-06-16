import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'https://api.codingboss.in/onetouch';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    // Only check for savedUser, as the backend does not return an auth token
    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Failed to parse saved user:", err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const extractUserData = (data) => {
    let extracted = {};
    let token = null;
    
    // Deep search to find user details no matter how nested they are or if they are inside arrays
    const search = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach(search);
        return;
      }
      if (obj.token && typeof obj.token === 'string') {
        token = obj.token;
      }
      // If object contains common user fields, merge it
      if (obj.name || obj.email || obj.phone || obj.mobile || obj.username || obj.contact) {
        extracted = { ...extracted, ...obj };
      }
      // Continue traversing down
      Object.values(obj).forEach(val => {
        if (val && typeof val === 'object') {
          search(val);
        }
      });
    };
    
    search(data);
    return { extracted, token };
  };

  const getProfile = async (currentToken) => {
    const token = currentToken || localStorage.getItem('token');
    if (!token) return;

    // Try multiple possible profile endpoints since we don't know the exact one
    const endpoints = [
      `${API_BASE_URL}/profile/`,
      `${API_BASE_URL}/user/`,
      `${API_BASE_URL}/me/`,
      `${API_BASE_URL}/user_profile/`
    ];

    for (let endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const text = await response.text();
        if (response.ok && text) {
          const data = JSON.parse(text);
          console.log(`API RAW DATA (${endpoint}):`, data);
          
          const { extracted } = extractUserData(data);
          
          if (extracted && (extracted.name || extracted.email || extracted.phone)) {
            delete extracted.token;
            delete extracted.password;
            
            setUser(prev => {
              const updated = { ...prev, ...extracted };
              localStorage.setItem('user', JSON.stringify(updated));
              return updated;
            });
            return; // Success, stop trying other endpoints
          }
        }
      } catch (err) {
        // Silently continue to the next endpoint if this one fails or 404s
      }
    }
  };

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile: identifier, 
          password 
        }),
      });

      const text = await response.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); } catch(e) {}
      }
      console.log("API RAW DATA (Login):", data);

      if (!response.ok || data.error) {
        throw new Error(data.error || data.message || 'Login failed. Please check your credentials.');
      }

      // The backend returns: {"message":"Login successful","user":{"id":...,"full_name":"...","mobile":"...","email":"..."}}
      const userPayload = data.user || data;

      const cleanedUser = {
        id: userPayload.id,
        email: userPayload.email || '',
        phone: userPayload.mobile || identifier,
        name: userPayload.full_name || 'User' 
      };

      setUser(cleanedUser);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(cleanedUser));

      return { success: true };
    } catch (err) {
      console.error("Login Catch Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { name, email, phone, password, contact } = formData;
      
      // The backend explicitly requires full_name, mobile, password, and confirm_password
      const payload = {
        full_name: name,
        email: email,
        mobile: phone || contact,
        password: password,
        confirm_password: password 
      };

      const response = await fetch(`${API_BASE_URL}/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); } catch (e) {}
      }
      
      console.log("API RAW DATA (Signup):", { status: response.status, data });

      // The backend returns 200 OK even for validation errors (e.g. {"full_name":["This field is required."]})
      // If the response contains an array of errors for a key, or an 'error' key, it failed.
      if (!response.ok || data.error || (typeof data === 'object' && Object.values(data).some(val => Array.isArray(val)))) {
        const errorMsg = data.error || (Array.isArray(Object.values(data)[0]) ? Object.values(data)[0][0] : 'Signup failed');
        throw new Error(errorMsg);
      }

      // Signup was successful. 
      const cleanedUser = {
        email: email,
        phone: phone || contact,
        name: name
      };
      
      setUser(cleanedUser);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(cleanedUser));

      return { success: true };
    } catch (err) {
      console.error("Signup Catch Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (newUserData) => {
    setUser(prev => {
      const updated = { ...prev, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, error, login, logout, signup, getProfile, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
