// src/components/AstrologyForm.jsx

import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
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
  Grid
} from '@mui/material';
import {
  LocationOn,
  Person,
  Event,
  Schedule,
  Wc,
  Calculate,
  Star
} from '@mui/icons-material';

const AstrologyForm = ({ onSuccess }) => {
  const { token } = useContext(AuthContext);
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

  const { fullName, dateOfBirth, timeOfBirth, placeOfBirth, gender } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      };
      
      const body = JSON.stringify(formData);
      
      const res = await axios.post(API_ENDPOINTS.ASTROLOGY.CALCULATE, body, config);
      
      if (res.data.success) {
        setSuccess('Your Vedic astrology chart has been generated successfully!');
        setTimeout(() => {
          onSuccess(res.data.data);
        }, 1500);
      } else {
        setError('Failed to generate horoscope. Please try again.');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'An error occurred during calculation.';
      setError(errorMessage);
      console.error('Astrology calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {/* Form Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Star sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          Vedic Astrology Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Enter your birth details to generate your personalized Vedic astrology chart with detailed planetary positions and interpretations.
        </Typography>
      </Box>

      {/* Form */}
      <Paper elevation={0} sx={{ 
        p: 4, 
        maxWidth: '800px', 
        mx: 'auto',
        background: 'white',
        borderRadius: 3,
        border: '1px solid #e1e8ed'
      }}>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={3}>
            {/* Full Name */}
            <Grid item xs={12}>
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
            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
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

            {/* Place of Birth and Gender */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <LocationOn sx={{ color: '#667eea', mb: 1.5 }} />
                <TextField
                  fullWidth
                  label="Place of Birth"
                  name="placeOfBirth"
                  value={placeOfBirth}
                  onChange={onChange}
                  variant="outlined"
                  required
                  placeholder="e.g., Mumbai, Maharashtra, India"
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

            <Grid item xs={12} md={4}>
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

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Calculate />}
                sx={{
                  mt: 2,
                  py: 2,
                  fontSize: '1.1rem',
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
                {isLoading ? 'Generating Your Chart...' : 'Generate Vedic Astrology Chart'}
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