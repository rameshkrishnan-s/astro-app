// middleware/adminAuth.js

const isAdmin = (req, res, next) => {
  // This middleware should run AFTER the `protect` middleware,
  // so `req.user` will already be available.
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed to the next function (the controller)
  } else {
    res.status(403).json({ msg: 'Forbidden: Admin access required.' });
  }
};

module.exports = { isAdmin };