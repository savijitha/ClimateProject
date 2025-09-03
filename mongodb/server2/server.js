const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: '../config.env' });

// Import all route modules
const purchaseRoutes = require('./routes/purchaseRoutes');
const userRoutes = require('./routes/userRoutes');
const cropRoutes = require('./routes/cropRoutes');
const seedRoutes = require('./routes/seedRoutes');
const requestRoutes = require('./routes/requestRoutes');
const farmRoutes = require('./routes/farmRoutes');
const apiRoutes = require("./api");
const weatherRouter = require('./routes/weatherRoutes');

const app = express();
app.use(bodyParser.json());
// IMPORTANT: Change the origin to match your frontend's development port
app.use(cors({ origin: 'http://localhost:3000' }));

const mongoURI = process.env.mongodbLink;
console.log('Attempting to connect to MongoDB with URI:', mongoURI ? 'URI is defined' : 'URI is UNDEFINED');

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/disha', async (req, res) => {
res.json({ message: "url got" })
})

// REMOVED: This line was redundant because the weatherRouter below already handles this route.
// app.post('/api/weather', weatherController.getWeather);


// Define API Routes
app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/purchases', purchaseRoutes); 
app.use('/api/seeds', seedRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/weather', weatherRouter); 

if (process.env.NODE_ENV === 'production') {
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
}

// 404 Error Handler
app.use((req, res) => {
res.status(404).json({ message: 'Route not found.' });
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
console.log(`MongoDB URI: ${process.env.mongodbLink ? 'Configured' : 'NOT CONFIGURED'}`);
console.log(`OpenWeatherMap Key: ${process.env.WEATHER_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
console.log(`OpenCage Key: ${process.env.OPENCAGE_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
});