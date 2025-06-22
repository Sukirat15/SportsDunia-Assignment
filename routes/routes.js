// routes/routes.js
const express = require('express');
const { registerUser } = require('../controllers/userRegister');
const { referralEarning } = require('../controllers/referralEarnings');
const { earningDetails } = require('../controllers/earningDetails');

const router = express.Router();

// health
router.get('/health', (req, res) => res.send('HEALTH CHECK : OK'));

// user registration
router.post('/register', registerUser);

// purchase → referrals
router.post('/purchase', referralEarning);

// earnings history
router.get('/earnings/:userId', earningDetails);

module.exports = router;
