// src/App.jsx - FIXED VERSION WITH PROPER CONTEXT HANDLING

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import AuthContext from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const authContext = useContext(AuthContext);
  
  // Handle case when context is not yet available
  if (!authContext) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const { user, loading } = authContext;

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Box sx={{ minHeight: '100vh' }}>
              <Routes>
                {/* 
                  The login page is public. Anyone can see it.
                */}
                <Route 
                  path="/login" 
                  element={user ? <Navigate to="/dashboard" /> : <LoginPage />} 
                />

                {/* 
                  The Dashboard is a private/protected page.
                  We wrap it with our ProtectedRoute component.
                */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin route */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />

                {/* 
                  The root path "/" will now simply redirect to the dashboard.
                  The ProtectedRoute component will handle the logic:
                  - If logged in, it shows the dashboard.
                  - If NOT logged in, it redirects to /login.
                */}
                <Route 
                  path="/" 
                  element={<Navigate to={user ? "/dashboard" : "/login"} />} 
                />

              </Routes>
            </Box>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;