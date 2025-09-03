const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Define a POST route to fetch weather data
// It expects a zip code and the desired temperature unit in the request body
router.post('/', weatherController.getWeather);

module.exports = router;
