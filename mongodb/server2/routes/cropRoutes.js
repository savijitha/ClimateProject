// E:\ClimateProject\mongodb\server2\routes\cropRoutes.js

const express = require('express');
const cropController = require('../controllers/cropController');
const router = express.Router();

// Route for crop and price prediction (POST /api/crops/predict)
router.post('/predict', cropController.predictCrop);

module.exports = router;
