// src/pages/LoginPage.jsx (FIXED VERSION)

import React, { useContext, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const LoginPage = () => {
  const { user, login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
        credential: credentialResponse.credential,
      });

      const { token, user } = res.data;
      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Failed:', error);
      const errorMessage = error.response?.data?.msg || 'Login failed. Please try again.';
      alert(errorMessage);
    }
  };

  const handleLoginError = () => {
    console.log('Login Failed');
    alert('Google login failed. Please try again.');
  };

  // If we are still checking the token, show loading
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If a user is already logged in, don't show the login page, redirect them.
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Otherwise, show the login button
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h2>Welcome to the Astrology App</h2>
      <p>Please sign in to continue</p>
      <GoogleLogin 
        onSuccess={handleLoginSuccess} 
        onError={handleLoginError}
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
      />
    </div>
  );
};

export default LoginPage;