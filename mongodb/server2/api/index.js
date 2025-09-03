// E:\ClimateProject\mongodb\server2\api\index.js

const express = require('express');
const router = express.Router();
const WeatherClass = require("./weather");
const cropController = require('../controllers/cropController');

router.post("/weatherMongo", async(req, res) => {
    const {zipCode, tempMetric} = req.body;
    let weather = new WeatherClass();

    try {
        const coordinates = await weather.getCoordinatesFromPincode(zipCode);
        let weatherData = await weather.getWeatherData(coordinates, tempMetric);
        await weather.saveWeatherDataToMongo(zipCode, weatherData);
        res.header("Content-Type",'application/json');
        res.send(JSON.stringify(weatherData, null, 4));
    } catch (error) {
        console.error("Error in /weatherMongo route:", error);
        res.status(500).json({ error: "Failed to process weather request.", details: error.message });
    }
});

router.get("/weatherMongo", async(req, res) => {
    const {zipCode} = req.query;
    let weather = new WeatherClass();

    try {
        let weatherData = await weather.getWeatherDataFromMongo(zipCode);
        if (!weatherData) {
            return res.status(404).json({ message: "Weather data not found for this zip code in MongoDB." });
        }
        res.header("Content-Type",'application/json');
        res.send(JSON.stringify(weatherData.data, null, 4));
    } catch (error) {
        console.error("Error in GET /weatherMongo route:", error);
        res.status(500).json({ error: "Failed to retrieve weather data from MongoDB.", details: error.message });
    }
});

router.post("/predict-crop-price", cropController.predictCrop);

module.exports = router;
