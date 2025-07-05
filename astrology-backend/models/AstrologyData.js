// models/AstrologyData.js (SIMPLIFIED VERSION WITHOUT COORDINATES)

const mongoose = require('mongoose');

const AstrologyDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  timeOfBirth: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  gender: { type: String, enum: ['m', 'f', 'o'], required: true },

  // Basic astrological data
  rasi: { type: String, required: true, index: true },
  nakshatra: { type: String, required: true, index: true },
  ascendant: { type: String, required: true, index: true },
  
  // Enhanced planet positions for both charts
  rasiPlanets: [{ 
    name: String, 
    sign: String, 
    house: Number,
    degree: Number,
    longitude: Number,
    latitude: Number,
    speed: Number,
    isRetrograde: { type: Boolean, default: false }
  }],
  navamsaPlanets: [{ 
    name: String, 
    sign: String, 
    house: Number,
    degree: Number,
    longitude: Number,
    latitude: Number,
    speed: Number,
    isRetrograde: { type: Boolean, default: false }
  }],

  // Store the full API response for debugging and future use
  prokeralaApiResponse: {
    basicData: Object,
    planetData: Object,
    location: String,
    ayanamsa: { type: Number, default: 1 }, // 1 for Lahiri
    chartStyle: { type: String, default: 'south-indian' }
  },

  // SVG charts from Prokerala API
  rasiChartSvg: { type: String },
  navamsaChartSvg: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('AstrologyData', AstrologyDataSchema);