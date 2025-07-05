// models/AstrologyData.js (UPDATED VERSION)

const mongoose = require('mongoose');

const AstrologyDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  timeOfBirth: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  gender: { type: String, enum: ['m', 'f'], required: true },

  // Astrological data
  rasi: { type: String, required: true, index: true },
  nakshatra: { type: String, required: true, index: true },
  
  // Planet positions for both charts
  rasiPlanets: [{ 
    name: String, 
    sign: String, 
    house: Number 
  }],
  navamsaPlanets: [{ 
    name: String, 
    sign: String, 
    house: Number 
  }],

  // Store the full API response for debugging and future use
  prokeralaApiResponse: {
    rasi: Object,
    navamsa: Object
  },

  // SVG charts (if available from API)
  rasiChartSvg: { type: String },
  navamsaChartSvg: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('AstrologyData', AstrologyDataSchema);