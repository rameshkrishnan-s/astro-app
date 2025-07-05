// src/pages/DashboardPage.jsx - FIXED VERSION

import React, { useState, useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  AppBar, 
  Toolbar, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { 
  AccountCircle, 
  Logout, 
  Person, 
  Calculate, 
  Download,
  Star,
  Home,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AstrologyForm from '../components/AstrologyForm';
import UserProfile from '../components/UserProfile';

const DashboardPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle case when context is not yet available
  if (!authContext) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const { user, logout } = authContext;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleAdminClick = () => {
    navigate('/admin');
    handleMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
            Astrology Dashboard
          </Typography>
          
          <IconButton
            size="large"
            onClick={handleMenuClick}
            color="inherit"
          >
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => setActiveSection('profile')}>
              <Person sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            {user?.role === 'admin' && (
              <MenuItem onClick={handleAdminClick}>
                <AdminPanelSettings sx={{ mr: 1 }} />
                Admin Panel
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {activeSection === 'home' && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Generate your Vedic astrology charts and explore your cosmic blueprint.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      <Calculate sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Generate Your Chart
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Enter your birth details to generate your Rasi and Navamsa charts.
                    </Typography>
                    <AstrologyForm />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Quick Stats
                    </Typography>
                    <Typography variant="body2">
                      Your astrological journey begins here. Generate your first chart to see your cosmic insights.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeSection === 'profile' && (
          <UserProfile />
        )}
      </Container>
    </Box>
  );
};

export default DashboardPage;