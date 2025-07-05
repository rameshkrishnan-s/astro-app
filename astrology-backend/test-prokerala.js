// test-prokerala.js - Test script for Prokerala API integration

require('dotenv').config();
const axios = require('axios');

// Prokerala API configuration
const PROKERALA_BASE_URL = 'https://api.prokerala.com/v2/astrology';

// Helper function to format datetime for Prokerala API
const formatDateTimeForAPI = (dateOfBirth, timeOfBirth) => {
  const date = new Date(dateOfBirth);
  const [hours, minutes] = timeOfBirth.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  // Convert to ISO string and encode for URL
  const isoString = date.toISOString();
  return encodeURIComponent(isoString);
};

// Test function
async function testProkeralaAPI() {
  try {
    console.log('Testing Prokerala API integration...');
    
    // Check if API key is configured
    if (!process.env.PROKERALA_API_KEY) {
      console.error('❌ PROKERALA_API_KEY not found in environment variables');
      console.log('Please add your Prokerala API key to the .env file');
      return;
    }

    // Test data (Chennai, India - 13.0827° N, 80.2707° E)
    const testData = {
      dateOfBirth: '1990-01-15',
      timeOfBirth: '14:30',
      coordinates: { lat: 13.0827, lon: 80.2707 },
      placeOfBirth: 'Chennai, India'
    };

    console.log('Test data:', testData);

    const datetime = formatDateTimeForAPI(testData.dateOfBirth, testData.timeOfBirth);
    const coords = `${testData.coordinates.lat},${testData.coordinates.lon}`;

    console.log('Formatted datetime:', datetime);
    console.log('Formatted coordinates:', coords);

    // Test basic horoscope API
    console.log('\n1. Testing basic horoscope API...');
    const basicParams = new URLSearchParams({
      ayanamsa: 1,
      coordinates: coords,
      datetime: datetime,
      la: 'en'
    });

    const basicResponse = await axios.get(`${PROKERALA_BASE_URL}/basic-horoscope?${basicParams}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PROKERALA_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    console.log('✅ Basic horoscope API response:', {
      rasi: basicResponse.data.rasi?.name,
      nakshatra: basicResponse.data.nakshatra?.name,
      ascendant: basicResponse.data.ascendant?.sign
    });

    // Test planet position API
    console.log('\n2. Testing planet position API...');
    const planetParams = new URLSearchParams({
      ayanamsa: 1,
      coordinates: coords,
      datetime: datetime,
      chart_type: 'rasi',
      chart_style: 'south-indian',
      format: 'json',
      la: 'en'
    });

    const planetResponse = await axios.get(`${PROKERALA_BASE_URL}/planet-position?${planetParams}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PROKERALA_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    console.log('✅ Planet position API response:', {
      planetsCount: planetResponse.data.planets?.length || 0,
      firstPlanet: planetResponse.data.planets?.[0]?.name
    });

    // Test chart generation API
    console.log('\n3. Testing chart generation API...');
    const chartParams = new URLSearchParams({
      ayanamsa: 1,
      coordinates: coords,
      datetime: datetime,
      chart_type: 'rasi',
      chart_style: 'south-indian',
      format: 'svg',
      la: 'en'
    });

    const chartResponse = await axios.get(`${PROKERALA_BASE_URL}/chart?${chartParams}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PROKERALA_API_KEY}`,
        'Accept': 'application/xml'
      }
    });

    console.log('✅ Chart generation API response:', {
      svgLength: chartResponse.data.length,
      containsSvg: chartResponse.data.includes('<svg'),
      containsPlanets: chartResponse.data.includes('Su') || chartResponse.data.includes('Mo')
    });

    console.log('\n🎉 All API tests passed! Prokerala integration is working correctly.');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.error('Authentication failed. Please check your API key.');
    } else if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please wait before trying again.');
    } else if (error.response?.status === 400) {
      console.error('Bad request. Please check the parameters.');
    }
  }
}

// Run the test
testProkeralaAPI(); 