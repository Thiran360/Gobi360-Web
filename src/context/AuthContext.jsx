import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, API_HEADERS } from '../lib/api';

const AuthContext = createContext();

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

  const getProfile = async () => {
    // Backend does not expose profile endpoints; user data comes from login response.
    return;
  };

  const login = async (identifier, password, role = 'customer') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...API_HEADERS,
        },
        body: JSON.stringify({
          mobile: identifier,
          password,
          role
        }),
      });

      const text = await response.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); } catch (e) { }
      }
      console.log("API RAW DATA (Login):", data);

      if (!response.ok || data.error) {
        // Parse and humanize the error from backend
        const rawError = data.error || data.message || data.detail || '';
        const rawLower = rawError.toLowerCase();
        let friendlyError;

        if (rawLower.includes('no active account') || rawLower.includes('not found') || rawLower.includes('does not exist') || rawLower.includes('invalid mobile') || rawLower.includes('user not found')) {
          friendlyError = 'No account found with this mobile number. Please check the number or create a new account.';
        } else if (rawLower.includes('wrong password') || rawLower.includes('incorrect password') || rawLower.includes('invalid password') || rawLower.includes('invalid credentials') || rawLower.includes('incorrect credentials') || rawLower.includes('password is wrong')) {
          friendlyError = 'Incorrect password. Please try again or reset your password.';
        } else if (rawLower.includes('account is disabled') || rawLower.includes('account has been disabled') || rawLower.includes('suspended') || rawLower.includes('deactivated') || rawLower.includes('blocked')) {
          friendlyError = 'Your account has been disabled. Please contact support for assistance.';
        } else if (rawLower.includes('too many') || rawLower.includes('rate limit') || rawLower.includes('throttled')) {
          friendlyError = 'Too many login attempts. Please wait a few minutes and try again.';
        } else if (rawError) {
          friendlyError = rawError;
        } else {
          friendlyError = 'Login failed. Please check your credentials and try again.';
        }

        throw new Error(friendlyError);
      }

      // The backend returns: {"message":"Login successful","user":{"id":...,"full_name":"...","mobile":"...","email":"..."}}
      const userPayload = data.user || data;

      const cleanedUser = {
        id: userPayload.id || userPayload.deliveryman_id || userPayload.shopkeeper_id || userPayload.user_id || userPayload.expert_id,
        email: userPayload.email || '',
        phone: userPayload.mobile || identifier,
        name: userPayload.full_name || userPayload.name || 'User',
        shopName: userPayload.shop_name || userPayload.shopName || 'My Shop',
        expert_id: userPayload.expert_id || null,
        deliveryman_id: userPayload.deliveryman_id || null,
        role: role
      };

      setUser(cleanedUser);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(cleanedUser));
      localStorage.removeItem('localCart');

      return { success: true, user: cleanedUser, roleUsed: role };
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
        headers: { 'Content-Type': 'application/json', ...API_HEADERS },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); } catch (e) { }
      }

      console.log("API RAW DATA (Signup):", { status: response.status, data });

      // The backend returns 200 OK even for validation errors (e.g. {"full_name":["This field is required."]})
      // If the response contains an array of errors for a key, or an 'error' key, it failed.
      if (!response.ok || data.error || data.message || (typeof data === 'object' && Object.values(data).some(val => Array.isArray(val)))) {
        // Extract the raw error message handling various API structures
        const rawError = data.error || data.message || data.detail || 
                         (Array.isArray(Object.values(data)[0]) ? Object.values(data)[0][0] : 
                         (typeof Object.values(data)[0] === 'string' ? Object.values(data)[0] : ''));
        
        const rawLower = (rawError || '').toLowerCase();
        const fieldKey = Object.keys(data)[0] || '';
        let friendlyError;

        // Force a success exit if the API actually says it's successful in the message
        if (rawLower.includes('successful') || rawLower === 'ok') {
            // Ignore this "error" condition because it's actually a success
        } else {
            if (rawLower.includes('mobile') || rawLower.includes('phone') || fieldKey === 'mobile' || fieldKey === 'phone') {
              if (rawLower.includes('exist') || rawLower.includes('already') || rawLower.includes('taken') || rawLower.includes('register')) {
                friendlyError = 'This mobile number is already registered. Please login or use a different number.';
              } else {
                friendlyError = rawError || 'Please enter a valid mobile number.';
              }
            } else if (rawLower.includes('email') || fieldKey === 'email') {
              if (rawLower.includes('exist') || rawLower.includes('already') || rawLower.includes('taken') || rawLower.includes('register')) {
                friendlyError = 'This email address is already registered. Please login or use a different email.';
              } else {
                friendlyError = rawError || 'Please enter a valid email address.';
              }
            } else if (rawLower.includes('password') && (rawLower.includes('short') || rawLower.includes('weak') || rawLower.includes('common') || rawLower.includes('numeric') || rawLower.includes('minimum'))) {
              friendlyError = 'Password is too weak. Use at least 8 characters with a mix of letters and numbers.';
            } else if (rawLower.includes('full_name') || rawLower.includes('name') || rawLower.includes('required')) {
              friendlyError = 'Please fill in all required fields correctly.';
            } else if (rawLower.includes('exist') || rawLower.includes('already')) {
              friendlyError = 'An account with these details already exists. Please login instead.';
            } else if (rawError) {
              friendlyError = rawError;
            } else {
              friendlyError = 'Registration failed. Please check your details and try again.';
            }

            throw new Error(friendlyError);
        }
      }

      // Signup was successful. 
      // Auto-login to fetch the proper user ID and data from the backend
      const identifier = phone || contact || email;
      const loginResult = await login(identifier, password, 'customer');

      if (loginResult.success) {
        return { success: true };
      }

      // Fallback just in case login fails after signup
      const fallbackId = data.id || data.user_id || data.user?.id || data.user?.user_id || Math.floor(Math.random() * 1000000);
      const cleanedUser = {
        id: fallbackId,
        email: email,
        phone: phone || contact,
        name: name
      };

      setUser(cleanedUser);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(cleanedUser));

      return { success: true, user: cleanedUser };
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
    localStorage.removeItem('localCart');
    window.location.href = '/';
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
