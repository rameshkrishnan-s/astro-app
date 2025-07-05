// astrology-backend/routes/astrology.js (MOCK VERSION FOR TESTING)

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const AstrologyData = require('../models/AstrologyData');

// Mock data generator for testing
const generateMockAstrologyData = (fullName, dateOfBirth, timeOfBirth, gender) => {
  const rasis = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni'];
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  
  const randomRasi = rasis[Math.floor(Math.random() * rasis.length)];
  const randomNakshatra = nakshatras[Math.floor(Math.random() * nakshatras.length)];
  
  const rasiPlanets = planets.map(planet => ({
    name: planet,
    sign: rasis[Math.floor(Math.random() * rasis.length)],
    house: Math.floor(Math.random() * 12) + 1,
  }));
  
  const navamsaPlanets = planets.map(planet => ({
    name: planet,
    sign: rasis[Math.floor(Math.random() * rasis.length)],
    house: Math.floor(Math.random() * 12) + 1,
  }));

  return {
    rasi: randomRasi,
    nakshatra: randomNakshatra,
    rasiPlanets,
    navamsaPlanets,
    rasiChartSvg: `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
      <text x="200" y="50" text-anchor="middle" font-size="20" font-weight="bold">Rasi Chart</text>
      <text x="200" y="80" text-anchor="middle" font-size="16">${randomRasi}</text>
      <text x="200" y="110" text-anchor="middle" font-size="14">${randomNakshatra}</text>
      <text x="200" y="200" text-anchor="middle" font-size="12">Generated for: ${fullName}</text>
      <text x="200" y="220" text-anchor="middle" font-size="12">Date: ${new Date(dateOfBirth).toLocaleDateString()}</text>
      <text x="200" y="240" text-anchor="middle" font-size="12">Time: ${timeOfBirth}</text>
      <text x="200" y="260" text-anchor="middle" font-size="12">Gender: ${gender === 'm' ? 'Male' : 'Female'}</text>
    </svg>`,
    navamsaChartSvg: `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#e0f0ff" stroke="#333" stroke-width="2"/>
      <text x="200" y="50" text-anchor="middle" font-size="20" font-weight="bold">Navamsa Chart</text>
      <text x="200" y="80" text-anchor="middle" font-size="16">${randomRasi}</text>
      <text x="200" y="110" text-anchor="middle" font-size="14">${randomNakshatra}</text>
      <text x="200" y="200" text-anchor="middle" font-size="12">Generated for: ${fullName}</text>
      <text x="200" y="220" text-anchor="middle" font-size="12">Date: ${new Date(dateOfBirth).toLocaleDateString()}</text>
      <text x="200" y="240" text-anchor="middle" font-size="12">Time: ${timeOfBirth}</text>
      <text x="200" y="260" text-anchor="middle" font-size="12">Gender: ${gender === 'm' ? 'Male' : 'Female'}</text>
    </svg>`
  };
};

// @desc    Calculate and save astrology data for a user (MOCK VERSION)
// @route   POST /api/astrology/calculate
// @access  Private
router.post('/calculate', protect, async (req, res) => {
    try {
        const { fullName, dateOfBirth, timeOfBirth, placeOfBirth, gender } = req.body;
        
        console.log('Received astrology calculation request:', {
            fullName,
            dateOfBirth,
            timeOfBirth,
            placeOfBirth,
            gender,
            userId: req.user.id
        });
        
        // Validate required fields
        if (!fullName || !dateOfBirth || !timeOfBirth || !placeOfBirth || !gender) {
            return res.status(400).json({ 
                msg: 'All fields are required: fullName, dateOfBirth, timeOfBirth, placeOfBirth, gender' 
            });
        }

        // Validate gender
        if (!['m', 'f'].includes(gender)) {
            return res.status(400).json({ msg: 'Gender must be either "m" or "f"' });
        }

        // Generate mock astrology data
        const mockData = generateMockAstrologyData(fullName, dateOfBirth, timeOfBirth, gender);
        
        console.log('Generated mock data:', mockData);
        
        // Save to our database
        const newAstrologyEntry = new AstrologyData({
            user: req.user.id,
            fullName, 
            dateOfBirth, 
            timeOfBirth, 
            placeOfBirth, 
            gender,
            rasi: mockData.rasi,
            nakshatra: mockData.nakshatra,
            rasiPlanets: mockData.rasiPlanets,
            navamsaPlanets: mockData.navamsaPlanets,
            rasiChartSvg: mockData.rasiChartSvg,
            navamsaChartSvg: mockData.navamsaChartSvg,
            prokeralaApiResponse: {
                rasi: { message: 'Mock data generated for testing' },
                navamsa: { message: 'Mock data generated for testing' }
            },
        });

        const savedData = await newAstrologyEntry.save();
        console.log('Saved astrology data to database:', savedData._id);
        
        // Return a clean response to the frontend
        res.status(201).json({
            success: true,
            data: {
                id: savedData._id,
                fullName: savedData.fullName,
                rasi: savedData.rasi,
                nakshatra: savedData.nakshatra,
                rasiPlanets: savedData.rasiPlanets,
                navamsaPlanets: savedData.navamsaPlanets,
                rasiChartSvg: savedData.rasiChartSvg,
                navamsaChartSvg: savedData.navamsaChartSvg,
            }
        });

    } catch (err) {
        console.error('Astrology calculation error:', err);
        
        res.status(500).json({ 
            msg: 'Server Error', 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

module.exports = router;