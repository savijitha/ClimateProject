// E:\ClimateProject\mongodb\server\controllers\cropController.js

const axios = require('axios');
const CropPredict = require('../models/CropPredict');

exports.predictCrop = async (req, res) => {
    const { N, P, K, temperature, humidity, ph, rainfall, user_id } = req.body;
    console.log("Received data for crop prediction:", req.body);

    try {
        const requiredParams = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
        for (const param of requiredParams) {
            if (typeof req.body[param] === 'undefined' || req.body[param] === null || isNaN(parseFloat(req.body[param]))) {
                return res.status(400).json({ message: `Missing or invalid parameter: ${param}` });
            }
        }
        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required for saving prediction.' });
        }

        const response = await axios.post('http://127.0.0.1:4000/predict', {
            N: parseFloat(N),
            P: parseFloat(P),
            K: parseFloat(K),
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
            ph: parseFloat(ph),
            rainfall: parseFloat(rainfall)
        });
        console.log("Prediction service response:", response.data);

        const crop = response.data.predicted_crop;
        const price = response.data.predicted_price;

        const newPrediction = new CropPredict({
            user_id,
            N: parseFloat(N),
            P: parseFloat(P),
            K: parseFloat(K),
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
            ph: parseFloat(ph),
            rainfall: parseFloat(rainfall),
            predictedCrop: crop,
            predictedPrice: price
        });
        await newPrediction.save();
        res.json({ predictedCrop: crop, predictedPrice: price });
    } catch (error) {
        console.error('Error in crop prediction process:', error.message);
        if (error.response) {
            console.error('Flask API Error Details:', error.response.data);
            res.status(error.response.status || 500).json({
                message: 'Crop prediction failed from ML service.',
                error: error.response.data
            });
        } else if (error.request) {
            res.status(500).json({
                message: 'Crop prediction service is unreachable. Please ensure the Flask API is running.',
                error: error.message
            });
        } else {
            res.status(500).json({ message: 'Crop prediction failed.', error: error.message });
        }
    }
};
