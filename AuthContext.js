// AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef, navigate } from './navigationRef'; // Import the navigationRef

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check AsyncStorage for user authentication token
    const checkUserToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    };

    checkUserToken();
  }, []);

  const signIn = (token) => {
    setUserToken(token);
  };

  const signOut = async () => {
    try {
      // Clear user authentication token from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);

      // Navigate to the LoginScreen using the navigate function
      navigate('LoginScreen');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
