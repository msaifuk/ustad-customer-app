import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setUnauthorizedHandler } from '../utils/api';
import { registerForPush, unregisterPush } from '../utils/notifications';

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
        registerForPush(); // refresh the push token for an already logged-in user
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
      registerForPush();
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
      registerForPush();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    // Tell the server to stop sending alerts to this phone (but never block logout for long).
    await Promise.race([unregisterPush(), new Promise((r) => setTimeout(r, 3000))]);
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
