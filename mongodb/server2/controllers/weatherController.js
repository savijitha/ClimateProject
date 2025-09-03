const axios = require('axios');

// It's a good practice to put API keys in a .env file for security
const OPENWEATHER_API_KEY = process.env.WEATHER_KEY;
const API_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

// Controller function to get weather data
exports.getWeather = async (req, res) => {
    // Destructure the required data from the request body
    const { zipCode, tempMetric } = req.body;

    // Basic validation to ensure all necessary data is present
    if (!zipCode || !tempMetric) {
        return res.status(400).json({ message: 'Zip code and temperature unit are required.' });
    }

    try {
        // Construct the API URL with the provided parameters
        const apiUrl = `${API_BASE_URL}?zip=${zipCode}&units=${tempMetric}&appid=${OPENWEATHER_API_KEY}`;
        
        // Make the GET request to the external weather API
        const response = await axios.get(apiUrl);
        
        // If successful, send the weather data back to the client
        res.status(200).json(response.data);

    } catch (error) {
        // Log the error for server-side debugging
        console.error('Error fetching weather data:', error.response?.data?.message || error.message);
        
        // Respond to the client with a meaningful error message
        res.status(error.response?.status || 500).json({ 
            message: 'Failed to fetch weather data.', 
            details: error.response?.data?.message || 'Internal server error.' 
        });
    }
};
