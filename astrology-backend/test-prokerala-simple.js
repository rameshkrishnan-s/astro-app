// test-prokerala-simple.js - Simple test for Prokerala API

require('dotenv').config();
const axios = require('axios');

async function testProkeralaAPI() {
  try {
    console.log('Testing Prokerala API connection...');
    
    // Check if API key is configured
    if (!process.env.PROKERALA_API_KEY) {
      console.error('❌ PROKERALA_API_KEY not found in environment variables');
      return;
    }

    console.log('✅ API Key found:', process.env.PROKERALA_API_KEY.substring(0, 10) + '...');

    // Test with a simple request
    const testData = {
      dateOfBirth: '1990-01-15',
      timeOfBirth: '14:30',
      coordinates: '13.0827,80.2707', // Chennai, India
      ayanamsa: 1
    };

    // Format datetime
    const date = new Date(testData.dateOfBirth);
    const [hours, minutes] = testData.timeOfBirth.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const datetime = encodeURIComponent(date.toISOString());

    console.log('Test datetime:', datetime);

    // Test basic horoscope endpoint
    const params = new URLSearchParams({
      ayanamsa: testData.ayanamsa,
      coordinates: testData.coordinates,
      datetime: datetime,
      la: 'en'
    });

    const url = `https://api.prokerala.com/v2/astrology/basic-horoscope?${params}`;
    console.log('Request URL:', url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${process.env.PROKERALA_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', error.response?.data);
    console.error('Request URL:', error.config?.url);
    console.error('Error Message:', error.message);
  }
}

testProkeralaAPI(); 