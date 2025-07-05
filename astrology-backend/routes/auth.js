// routes/auth.js (ADD THIS NEW ROUTE)

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library'); // <-- ADD THIS
const User = require('../models/User'); // <-- ADD THIS

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // <-- ADD THIS

// ... (your existing /google and /google/callback routes are still here, that's fine)

// @desc    Login user via Google token from frontend
// @route   POST /api/auth/google-login
// @access  Public
router.post('/google-login', async (req, res) => {
  const { credential } = req.body; // This is the token from the React app

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub } = ticket.getPayload();
    const googleId = sub;

    let user = await User.findOne({ googleId });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        googleId,
        email,
        name,
        avatar: picture,
        role: 'user', // Default role for new sign-ups
      });
      await user.save();
    }

    // At this point, we have a verified user (either existing or new)
    // Now, create our OWN JWT to send back to the frontend
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token: 'Bearer ' + token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ success: false, msg: 'Invalid Google token' });
  }
});


module.exports = router;