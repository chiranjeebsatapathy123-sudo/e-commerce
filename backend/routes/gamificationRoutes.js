const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { protect } = require('../middleware/auth');

router.get('/status', protect, gamificationController.getUserStatus);

module.exports = router;
