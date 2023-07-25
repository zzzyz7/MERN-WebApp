const express = require('express');
const router = express.Router();
const phoneController = require('../controllers/phoneController');

// Route to get all phones
router.get('/phones', phoneController.getPhones);

module.exports = router;