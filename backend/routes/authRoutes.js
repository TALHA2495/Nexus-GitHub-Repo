const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');

// auth middleware
const auth = require('../middleware/authMiddleware');

// auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// protected route
router.get('/me', auth, getMe);

module.exports = router;