// E:\ClimateProject\mongodb\server\controllers\farmController.js

const Farm = require('../models/Farm');

// Create a new farm
exports.createFarm = async (req, res) => {
    const { user_id, location, crop_type, planting_schedule, soil_type, irrigation_system, size } = req.body;
    try {
        const newFarm = new Farm({
            user_id,
            location,
            crop_type,
            planting_schedule: new Date(planting_schedule),
            soil_type,
            irrigation_system,
            size
        });
        await newFarm.save();
        res.status(201).json(newFarm);
    } catch (error) {
        console.error('Error creating farm:', error);
        res.status(500).json({ error: 'Failed to create farm', details: error.message });
    }
};

// Get all farms (or farms for a specific user if user_id is in query)
exports.getAllFarms = async (req, res) => {
    try {
        const { user_id } = req.query;
        const query = user_id ? { user_id } : {};
        const farms = await Farm.find(query);
        res.status(200).json(farms);
    } catch (error) {
        console.error('Error fetching farms:', error);
        res.status(500).json({ error: 'Failed to fetch farms', details: error.message });
    }
};

// Get a single farm by ID
exports.getFarmById = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);
        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }
        res.status(200).json(farm);
    } catch (error) {
        console.error('Error fetching farm by ID:', error);
        res.status(500).json({ error: 'Failed to fetch farm', details: error.message });
    }
};

// Update a farm by ID
exports.updateFarm = async (req, res) => {
    try {
        const updatedFarm = await Farm.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFarm) {
            return res.status(404).json({ error: 'Farm not found' });
        }
        res.status(200).json(updatedFarm);
    } catch (error) {
        console.error('Error updating farm:', error);
        res.status(500).json({ error: 'Failed to update farm', details: error.message });
    }
};

// Delete a farm by ID
exports.deleteFarm = async (req, res) => {
    try {
        const deletedFarm = await Farm.findByIdAndDelete(req.params.id);
        if (!deletedFarm) {
            return res.status(404).json({ error: 'Farm not found' });
        }
        res.status(200).json({ message: 'Farm deleted successfully' });
    } catch (error) {
        console.error('Error deleting farm:', error);
        res.status(500).json({ error: 'Failed to delete farm', details: error.message });
    }
};
