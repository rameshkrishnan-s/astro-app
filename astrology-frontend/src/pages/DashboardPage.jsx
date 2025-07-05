// src/pages/DashboardPage.jsx - CLEAN VERSION

import React, { useState, useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  AppBar, 
  Toolbar, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { 
  AccountCircle, 
  Logout, 
  Person, 
  Calculate, 
  Star,
  Menu as MenuIcon,
  Close,
  AdminPanelSettings,
  Refresh,
  CheckCircle,
  Edit
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AstrologyForm from '../components/AstrologyForm';
import ChartDisplay from '../components/ChartDisplay';

const DashboardPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

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
    setMobileDrawerOpen(false);
  };

  const handleChartGenerated = (data) => {
    setChartData(data);
    setIsRegenerating(false);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
  };

  const handleCancelRegeneration = () => {
    setIsRegenerating(false);
  };

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
          Astrology
        </Typography>
        <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>
      
      <List sx={{ mt: 2 }}>
        <ListItem sx={{ 
          backgroundColor: 'rgba(255,255,255,0.1)',
          mb: 1
        }}>
          <ListItemIcon sx={{ color: 'white' }}>
            <Person />
          </ListItemIcon>
          <ListItemText primary={user?.name} secondary="Dashboard" />
        </ListItem>
        
        {user?.role === 'admin' && (
          <ListItem button onClick={handleAdminClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <AdminPanelSettings />
            </ListItemIcon>
            <ListItemText primary="Admin Panel" />
          </ListItem>
        )}
      </List>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 2 }} />
      
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'white' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );

  const renderChartVerification = () => (
    <Box sx={{ mt: 4 }}>
      <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
        <CheckCircle sx={{ mr: 1 }} />
        Your Vedic astrology chart has been generated successfully! Please verify the details below.
      </Alert>

      <Card elevation={0} sx={{ 
        background: 'white',
        borderRadius: 3,
        border: '1px solid #e1e8ed',
        mb: 3
      }}>
        <CardContent sx={{ p: isMobile ? 2 : 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
            <Star sx={{ mr: 1, color: '#667eea' }} />
            Chart Details for Verification
          </Typography>

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#667eea' }}>
                Personal Information
              </Typography>
              <Box sx={{ '& > *': { mb: 1.5 } }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {chartData.fullName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(chartData.dateOfBirth).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Time of Birth</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {chartData.timeOfBirth}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Place of Birth</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {chartData.placeOfBirth}
                  </Typography>
                </Box>
                {chartData.coordinates && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Coordinates</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {chartData.coordinates.lat.toFixed(4)}, {chartData.coordinates.lon.toFixed(4)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Astrological Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#667eea' }}>
                Astrological Information
              </Typography>
              <Box sx={{ '& > *': { mb: 1.5 } }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Rasi (Moon Sign)</Typography>
                  <Chip 
                    label={chartData.rasi} 
                    sx={{ 
                      backgroundColor: '#667eea',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Nakshatra</Typography>
                  <Chip 
                    label={chartData.nakshatra} 
                    sx={{ 
                      backgroundColor: '#764ba2',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Planets Analyzed</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {chartData.rasiPlanets?.length || 0} planets
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Chart Generated</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(chartData.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleRegenerate}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#5a6fd8',
                  backgroundColor: 'rgba(102, 126, 234, 0.04)'
                }
              }}
            >
              Regenerate Chart
            </Button>
            <Button
              variant="contained"
              startIcon={<Calculate />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              View Detailed Charts
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Chart Display */}
      <Card elevation={0} sx={{ 
        background: 'white',
        borderRadius: 3,
        border: '1px solid #e1e8ed'
      }}>
        <CardContent sx={{ p: isMobile ? 2 : 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#667eea' }}>
            Your Astrological Charts
          </Typography>
          <ChartDisplay astrologyResult={chartData} />
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#f8fafc' }}>
      {/* App Bar */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ px: isMobile ? 2 : 3 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Star sx={{ mr: 1.5, fontSize: isMobile ? 24 : 28 }} />
            {isMobile ? 'Astrology' : 'Vedic Astrology Dashboard'}
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, alignSelf: 'center' }}>
                Welcome, {user?.name}
              </Typography>
              {user?.role === 'admin' && (
                <Button
                  color="inherit"
                  onClick={handleAdminClick}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Admin
                </Button>
              )}
            </Box>
          )}
          
          <IconButton
            size="large"
            onClick={handleMenuClick}
            color="inherit"
          >
            <Avatar sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40
            }}>
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
            <MenuItem>
              <Person sx={{ mr: 1 }} />
              {user?.name}
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

      {/* Mobile Drawer */}
      {renderMobileDrawer()}

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 4,
          mb: 4,
          px: isMobile ? 2 : 3
        }}
      >
        {!chartData || isRegenerating ? (
          <Box>
            {/* Welcome Message */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                {isRegenerating ? 'Regenerate Your Chart ✨' : 'Generate Your Vedic Astrology Chart ✨'}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
              >
                {isRegenerating 
                  ? 'Review and update your birth details to regenerate your chart with corrected information.'
                  : 'Enter your birth details to generate your personalized Rasi and Navamsa charts with detailed planetary positions.'
                }
              </Typography>
            </Box>

            {/* Astrology Form */}
            <AstrologyForm 
              onSuccess={handleChartGenerated} 
              initialData={chartData}
              isRegenerating={isRegenerating}
            />
            
            {/* Cancel Button for Regeneration */}
            {isRegenerating && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancelRegeneration}
                  sx={{
                    borderColor: '#999',
                    color: '#666',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#666',
                      backgroundColor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  Cancel Regeneration
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          renderChartVerification()
        )}
      </Container>
    </Box>
  );
};

export default DashboardPage;