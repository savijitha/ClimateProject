// E:\ClimateProject\mongodb\server\api\weather.js

const axios = require("axios");
const WEATHER = require("../models/Weather");
const OPENCAGE_BASE_URL = "https://api.opencagedata.com/geocode/v1/json";
const OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather";

class Weather {
    getCoordinatesFromPincode = async (pincode) => {
        const url = `${OPENCAGE_BASE_URL}?q=${pincode}&key=${process.env.OPENCAGE_API_KEY}`;
        try {
            const response = await axios.get(url);
            if (response.data.results && response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry;
                return { latitude: lat, longitude: lng };
            } else {
                throw new Error('No coordinates found for the given pincode.');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error.message);
            throw new Error('Unable to retrieve coordinates. Please try again.');
        }
    };

    getWeatherData = async (coordinates, tempMetric) => {
        const url = `${OPENWEATHER_BASE_URL}?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${process.env.WEATHER_KEY}&units=${tempMetric}`;
        try {
            return (await axios(url)).data;
        } catch (error) {
            console.error("Error fetching weather data from OpenWeatherMap:", error.message);
            throw new Error("Failed to fetch weather data from external API.");
        }
    };

    saveWeatherDataToMongo = async (zipCode, weatherApiResponse) => {
        const filter = { zip: zipCode };
        const documentToSave = {
            ...weatherApiResponse,
            zip: zipCode,
            date: new Date()
        };
        delete documentToSave._id;
        delete documentToSave.__v;
        try {
            await this.findOneReplace(filter, documentToSave);
            console.log(`Weather data for zip ${zipCode} saved/updated in MongoDB.`);
        } catch (error) {
            console.error(`Error saving weather data for zip ${zipCode} to MongoDB:`, error);
            throw new Error("Failed to save weather data to database.");
        }
    };

    findOneReplace = async (filter, replace) => {
        return WEATHER.findOneAndReplace(filter, replace, { new: true, upsert: true });
    };

    getWeatherDataFromMongo = async (zipCode) => {
        try {
            return WEATHER.findOne({ zip: zipCode });
        } catch (error) {
            console.error(`Error fetching weather data from MongoDB for zip ${zipCode}:`, error);
            throw new Error("Failed to retrieve weather data from database.");
        }
    };
}

module.exports = Weather;
