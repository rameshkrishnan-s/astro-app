// src/components/AstrologyForm.jsx - SIMPLIFIED VERSION WITHOUT COORDINATES

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { API_ENDPOINTS, LOCATION_API } from '../config/api';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Autocomplete,
  useTheme,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Collapse
} from '@mui/material';
import {
  LocationOn,
  Person,
  Event,
  Schedule,
  Wc,
  Calculate,
  Star,
  MyLocation,
  Clear,
  ExpandMore,
  ExpandLess,
  Refresh
} from '@mui/icons-material';

const AstrologyForm = ({ onSuccess, initialData = null, isRegenerating = false }) => {
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    gender: 'm',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { fullName, dateOfBirth, timeOfBirth, placeOfBirth, gender } = formData;

  // Initialize form with existing data if regenerating
  useEffect(() => {
    if (initialData && isRegenerating) {
      setFormData({
        fullName: initialData.fullName || '',
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
        timeOfBirth: initialData.timeOfBirth || '',
        placeOfBirth: initialData.placeOfBirth || '',
        gender: initialData.gender || 'm',
      });
    }
  }, [initialData, isRegenerating]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Location API integration using OpenStreetMap Nominatim
  const searchLocations = async (query) => {
    if (!query || query.length < 3) {
      setLocationOptions([]);
      return;
    }

    try {
      setLocationLoading(true);
      const response = await axios.get(
        `${LOCATION_API.SEARCH}?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1&countrycodes=in,us,gb,ca,au`
      );
      
      const locations = response.data.map(item => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type,
        importance: item.importance
      }));
      
      setLocationOptions(locations);
    } catch (error) {
      console.error('Location search error:', error);
      setLocationOptions([]);
    } finally {
      setLocationLoading(false);
    }
  };

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get location name
          const response = await axios.get(
            `${LOCATION_API.REVERSE}?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          
          const locationName = response.data.display_name;
          setFormData(prev => ({ ...prev, placeOfBirth: locationName }));
          setLocationOptions([]);
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setError('Could not get location name from coordinates');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Could not get your current location. Please enter manually.');
        setLocationLoading(false);
      }
    );
  };

  const handleLocationSelect = (location) => {
    if (location) {
      setFormData(prev => ({ 
        ...prev, 
        placeOfBirth: location.display_name 
      }));
      setLocationOptions([]);
    }
  };

  const clearLocation = () => {
    setFormData(prev => ({ ...prev, placeOfBirth: '' }));
    setLocationOptions([]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!fullName || !dateOfBirth || !timeOfBirth || !placeOfBirth || !gender) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    console.log('Submitting form with data:', {
      formData,
      token: token ? 'Present' : 'Missing'
    });

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      };
      
      const body = JSON.stringify(formData);
      
      console.log('Making API call to:', API_ENDPOINTS.ASTROLOGY.CALCULATE);
      console.log('Request body:', body);
      
      const res = await axios.post(API_ENDPOINTS.ASTROLOGY.CALCULATE, body, config);
      
      console.log('API response:', res.data);
      
      if (res.data.success) {
        setSuccess('Your Vedic astrology chart has been generated successfully!');
        setTimeout(() => {
          onSuccess(res.data.data);
        }, 1500);
      } else {
        setError('Failed to generate horoscope. Please try again.');
      }

    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      console.error('Error response data:', err.response?.data);
      
      let errorMessage = 'An error occurred during calculation.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.msg || 'Invalid data provided. Please check your input.';
        console.error('400 Error details:', err.response.data);
      } else if (err.response?.status === 500) {
        errorMessage = err.response.data?.msg || 'Server error. Please try again later.';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {/* Form Header */}
      <Box sx={{ textAlign: 'center', mb: isMobile ? 3 : 4 }}>
        <Star sx={{ fontSize: isMobile ? 36 : 48, color: '#667eea', mb: 2 }} />
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
          {isRegenerating ? 'Regenerate Your Chart' : 'Vedic Astrology Analysis'}
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
            : 'Enter your birth details to generate your personalized Vedic astrology chart with detailed planetary positions and interpretations.'
          }
        </Typography>
      </Box>

      {/* Form */}
      <Paper elevation={0} sx={{ 
        p: isMobile ? 2 : 4, 
        maxWidth: '800px', 
        mx: 'auto',
        background: 'white',
        borderRadius: 3,
        border: '1px solid #e1e8ed'
      }}>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={isMobile ? 2 : 3}>
            {/* Full Name */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <Person sx={{ color: '#667eea', mb: 1.5 }} />
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={fullName}
                  onChange={onChange}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Date and Time of Birth */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <Event sx={{ color: '#667eea', mb: 1.5 }} />
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={onChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <Schedule sx={{ color: '#667eea', mb: 1.5 }} />
                <TextField
                  fullWidth
                  type="time"
                  label="Time of Birth"
                  name="timeOfBirth"
                  value={timeOfBirth}
                  onChange={onChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Place of Birth with Location API */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <LocationOn sx={{ color: '#667eea', mb: 1.5 }} />
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={locationOptions || []}
                  getOptionLabel={(option) => 
                    typeof option === 'string' ? option : option.display_name
                  }
                  inputValue={placeOfBirth}
                  onInputChange={(event, newInputValue) => {
                    setFormData(prev => ({ ...prev, placeOfBirth: newInputValue }));
                    searchLocations(newInputValue);
                  }}
                  onChange={(event, newValue) => handleLocationSelect(newValue)}
                  loading={locationLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Place of Birth"
                      required
                      placeholder="Start typing to search locations..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            {locationLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={getCurrentLocation}
                                  sx={{ color: '#667eea' }}
                                >
                                  <MyLocation />
                                </IconButton>
                                {placeOfBirth && (
                                  <IconButton
                                    size="small"
                                    onClick={clearLocation}
                                    sx={{ color: '#999' }}
                                  >
                                    <Clear />
                                  </IconButton>
                                )}
                              </Box>
                            )}
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <Box component="li" key={option.place_id} {...otherProps}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {option.display_name.split(',')[0]}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.display_name}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }}
                />
              </Box>
            </Grid>

            {/* Gender */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <Wc sx={{ color: '#667eea', mb: 1.5 }} />
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={gender}
                    label="Gender"
                    onChange={onChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        '&:hover': {
                          borderColor: '#667eea',
                        },
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                    }}
                  >
                    <MenuItem value="m">Male</MenuItem>
                    <MenuItem value="f">Female</MenuItem>
                    <MenuItem value="o">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Advanced Options Toggle */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setShowAdvanced(!showAdvanced)}
                endIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
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
                Advanced Options
              </Button>
            </Grid>

            {/* Advanced Options */}
            <Grid size={{ xs: 12 }}>
              <Collapse in={showAdvanced}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 2, 
                  border: '1px solid #e1e8ed',
                  mt: 1
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Additional options for more precise calculations (optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use the location search above or GPS button to set your birth place accurately.
                  </Typography>
                </Box>
              </Collapse>
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : (isRegenerating ? <Refresh /> : <Calculate />)}
                sx={{
                  mt: 2,
                  py: isMobile ? 1.5 : 2,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
                }}
              >
                {isLoading 
                  ? (isRegenerating ? 'Regenerating Your Chart...' : 'Generating Your Chart...') 
                  : (isRegenerating ? 'Regenerate Vedic Astrology Chart' : 'Generate Vedic Astrology Chart')
                }
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default AstrologyForm;