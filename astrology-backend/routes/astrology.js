// astrology-backend/routes/astrology.js (API KEY AUTHENTICATION)

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const AstrologyData = require('../models/AstrologyData');
const axios = require('axios');

// Prokerala API configuration
const PROKERALA_BASE_URL = 'https://api.prokerala.com/v2/astrology';

// Helper function to format datetime for Prokerala API (ISO 8601 with timezone)
const formatDateTimeForAPI = (dateOfBirth, timeOfBirth) => {
  const date = new Date(dateOfBirth);
  const [hours, minutes] = timeOfBirth.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  // Convert to ISO 8601 format with timezone (IST: +05:30)
  const isoString = date.toISOString().replace('Z', '+05:30');
  return encodeURIComponent(isoString);
};

// Helper to call Prokerala API with API key authentication
const callProkeralaAPI = async (endpoint, params) => {
  const url = `${PROKERALA_BASE_URL}/${endpoint}?${params}`;
  console.log('Making API request to:', url); // Debug log
  
  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${process.env.PROKERALA_API_KEY}`,
      'Accept': 'application/json'
    }
  });
  return response.data;
};

// Helper to get planet positions for a specific chart type
const getPlanetPositions = async (dateOfBirth, timeOfBirth, chartType = 'rasi', ayanamsa = 1) => {
  const coords = '13.0827,80.2707'; // Default to Chennai, India
  const datetime = formatDateTimeForAPI(dateOfBirth, timeOfBirth);
  const params = new URLSearchParams({
    ayanamsa: ayanamsa.toString(),
    coordinates: coords,
    datetime: datetime,
    chart_type: chartType,
    chart_style: 'south-indian',
    format: 'svg',
    la: 'en'
  });
  
  return await callProkeralaAPI('planet-position', params);
};

// Helper to get chart SVG from Prokerala
const getChartSVG = async (dateOfBirth, timeOfBirth, chartType = 'rasi', ayanamsa = 1) => {
  const coords = '13.0827,80.2707'; // Use real coordinates if available
  const date = new Date(dateOfBirth);
  const [hours, minutes] = timeOfBirth.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  const datetime = encodeURIComponent(date.toISOString());
  const params = new URLSearchParams({
    ayanamsa: ayanamsa.toString(),
    coordinates: coords,
    datetime,
    chart_type: chartType,
    chart_style: 'south-indian',
    format: 'svg',
    la: 'en'
  });
  const url = `https://api.prokerala.com/v2/astrology/chart?${params}`;
  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${process.env.PROKERALA_API_KEY}`,
      'Accept': 'application/xml'
    }
  });
  return response.data; // SVG string
};

// Helper to get basic horoscope information (using planet-position with rasi chart)
const getBasicHoroscope = async (dateOfBirth, timeOfBirth, ayanamsa = 1) => {
  try {
    // Get planet positions for rasi chart to extract basic info
    const planetData = await getPlanetPositions(dateOfBirth, timeOfBirth, 'rasi', ayanamsa);
    
    // Extract basic information from planet positions
    const ascendant = planetData.ascendant?.sign || 'Unknown';
    const rasi = planetData.rasi?.name || 'Unknown';
    const nakshatra = planetData.nakshatra?.name || 'Unknown';
    
    return {
      rasi,
      nakshatra,
      ascendant,
      planets: planetData.planets || []
    };
  } catch (error) {
    console.error('Error getting basic horoscope:', error);
    throw error;
  }
};

// @desc    Calculate and save astrology data using Prokerala API
// @route   POST /api/astrology/calculate
// @access  Private
router.post('/calculate', protect, async (req, res) => {
  try {
    const { fullName, dateOfBirth, timeOfBirth, placeOfBirth, gender } = req.body;

    // Validate required fields
    if (!fullName || !dateOfBirth || !timeOfBirth || !gender) {
      return res.status(400).json({
        msg: 'Required fields missing: fullName, dateOfBirth, timeOfBirth, gender'
      });
    }
    if (!['m', 'f', 'o'].includes(gender)) {
      return res.status(400).json({ msg: 'Gender must be either "m", "f", or "o"' });
    }
    if (!process.env.PROKERALA_API_KEY) {
      return res.status(500).json({
        msg: 'Prokerala API is not configured. Please set PROKERALA_API_KEY in environment variables.'
      });
    }

    // Get SVG charts from Prokerala
    const rasiChartSvg = await getChartSVG(dateOfBirth, timeOfBirth, 'rasi');
    const navamsaChartSvg = await getChartSVG(dateOfBirth, timeOfBirth, 'navamsa');

    // You can add logic here to get rasi/nakshatra from another Prokerala endpoint if needed
    // For now, use placeholders or parse from the SVG if possible
    const rasi = 'கன்னி'; // Placeholder, replace with real value if available
    const nakshatra = 'ஹஸ்தம்'; // Placeholder, replace with real value if available

    // Save to database
    const newAstrologyEntry = new AstrologyData({
      user: req.user.id,
      fullName,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth: placeOfBirth || 'Chennai, India',
      gender,
      rasi,
      nakshatra,
      rasiChartSvg,
      navamsaChartSvg
    });

    const savedData = await newAstrologyEntry.save();

    // Return response matching your API documentation
    res.status(201).json({
      success: true,
      data: {
        _id: savedData._id,
        user: savedData.user,
        fullName: savedData.fullName,
        dateOfBirth: savedData.dateOfBirth,
        timeOfBirth: savedData.timeOfBirth,
        placeOfBirth: savedData.placeOfBirth,
        gender: savedData.gender,
        rasiChartSvg: savedData.rasiChartSvg,
        navamsaChartSvg: savedData.navamsaChartSvg,
        rasi: savedData.rasi,
        nakshatra: savedData.nakshatra,
        createdAt: savedData.createdAt,
        updatedAt: savedData.updatedAt,
        __v: savedData.__v
      }
    });

  } catch (err) {
    console.error('Astrology calculation error:', err);
    res.status(500).json({
      msg: 'Server Error',
      error: err.message
    });
  }
});

module.exports = router;