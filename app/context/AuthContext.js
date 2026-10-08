import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setUnauthorizedHandler } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const loggedInRef = useRef(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  // When the server rejects our saved login, clear it and show the login screen.
  useEffect(() => {
    setUnauthorizedHandler(async () => {
      if (!loggedInRef.current) return; // already logged out, nothing to do
      loggedInRef.current = false;
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      Alert.alert('Session expired', 'Please log in again.');
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedToken && storedUser) {
        loggedInRef.current = true;
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Auth load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await api.post('/auth/customer/login', { phone, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      loggedInRef.current = true;
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, phone, password) => {
    try {
      const response = await api.post('/auth/customer/register', { 
        name, phone, password 
      });
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      loggedInRef.current = true;
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    loggedInRef.current = false;
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
