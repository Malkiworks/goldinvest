import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize auth state
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          setLoading(true);
          
          // Set auth token header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const res = await axios.get('/api/auth/me');
          
          setUser(res.data.data);
          setError(null);
        } catch (err) {
          console.error('Error loading user:', err);
          logout();
          setError('Authentication failed. Please login again.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [token]);
  
  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/auth/register', userData);
      
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        
        // Store token in localStorage
        localStorage.setItem('token', res.data.token);
        
        // Set auth token header
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      }
      
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/auth/login', { email, password });
      
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        
        // Store token in localStorage
        localStorage.setItem('token', res.data.token);
        
        // Set auth token header
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      }
      
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth token header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    setToken(null);
    setUser(null);
  };
  
  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put('/api/users/profile', profileData);
      
      if (res.data.success) {
        setUser({ ...user, ...profileData });
      }
      
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || 'Profile update failed. Please try again.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 