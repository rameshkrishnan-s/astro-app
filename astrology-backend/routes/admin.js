// routes/admin.js

const express = require('express');
const router = express.Router();
const AstrologyData = require('../models/AstrologyData');

// @desc    Get all user astrology data with filtering
// @route   GET /api/admin/all-data
// @access  Admin Only
router.get('/all-data', async (req, res) => {
  try {
    // Build the filter object based on query parameters
    const filter = {};
    const { rasi, nakshatra, gender } = req.query;

    if (rasi) {
      filter.rasi = rasi;
    }
    if (nakshatra) {
      filter.nakshatra = nakshatra;
    }
    if (gender) {
      filter.gender = gender;
    }

    // Query the database with the filter
    // .populate() will fetch the referenced user's details
    const data = await AstrologyData.find(filter)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!data) {
      return res.status(404).json({ msg: 'No data found' });
    }

    // Add some statistics
    const stats = {
      total: data.length,
      byGender: {
        male: data.filter(item => item.gender === 'm').length,
        female: data.filter(item => item.gender === 'f').length,
        other: data.filter(item => item.gender === 'o').length
      },
      byRasi: {},
      byNakshatra: {}
    };

    // Count by rasi
    data.forEach(item => {
      if (item.rasi) {
        stats.byRasi[item.rasi] = (stats.byRasi[item.rasi] || 0) + 1;
      }
      if (item.nakshatra) {
        stats.byNakshatra[item.nakshatra] = (stats.byNakshatra[item.nakshatra] || 0) + 1;
      }
    });

    res.json({
      data,
      stats,
      filters: { rasi, nakshatra, gender }
    });
  } catch (err) {
    console.error('Admin data fetch error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Admin Only
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await AstrologyData.countDocuments();
    const totalUsersToday = await AstrologyData.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    const genderStats = await AstrologyData.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    const rasiStats = await AstrologyData.aggregate([
      {
        $group: {
          _id: '$rasi',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const nakshatraStats = await AstrologyData.aggregate([
      {
        $group: {
          _id: '$nakshatra',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalUsersToday,
      genderStats,
      rasiStats,
      nakshatraStats
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;