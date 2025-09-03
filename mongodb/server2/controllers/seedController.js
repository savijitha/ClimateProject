// E:\ClimateProject\mongodb\server\controllers\seedController.js

const Seed = require('../models/Seed');

exports.registerSeed = async (req, res) => {
    const { seedName, seedType, description, createdBy, createdByEmail } = req.body;
    const image = req.file ? req.file.path : '';

    try {
        const newSeed = new Seed({
            seedName,
            seedType,
            image,
            description,
            createdBy,
            createdByEmail
        });
        await newSeed.save();
        res.status(201).json({ message: 'Seed registered successfully', seed: newSeed });
    } catch (error) {
        console.error('Error registering seed:', error);
        res.status(500).json({ error: 'Failed to register seed', details: error.message });
    }
};

// E:\ClimateProject\mongodb\server\controllers\seedController.js

// E:\ClimateProject\mongodb\server\controllers\seedController.js

exports.getAllSeeds = async (req, res) => {
    try {
        const seeds = await Seed.find({}).select('seedName seedType image description createdBy createdByEmail'); // Ensure 'createdByEmail' is selected
        res.status(200).json(seeds);
    } catch (error) {
        console.error('Error fetching all seeds:', error);
        res.status(500).json({ error: 'Failed to fetch seeds', details: error.message });
    }
};

exports.getSeedsByOwner = async (req, res) => {
    const { id } = req.params;
    try {
        const seeds = await Seed.find({ createdBy: id });
        res.status(200).json(seeds);
    } catch (error) {
        console.error('Error fetching seeds by owner:', error);
        res.status(500).json({ error: 'Failed to fetch seeds by owner', details: error.message });
    }
};

exports.getSeedById = async (req, res) => {
    try {
        const seed = await Seed.findById(req.params.id);
        if (!seed) {
            return res.status(404).json({ error: 'Seed not found' });
        }
        res.status(200).json(seed);
    } catch (error) {
        console.error('Error fetching seed by ID:', error);
        res.status(500).json({ error: 'Failed to fetch seed', details: error.message });
    }
};

exports.updateSeed = async (req, res) => {
    try {
        const updatedSeed = await Seed.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSeed) {
            return res.status(404).json({ error: 'Seed not found' });
        }
        res.status(200).json(updatedSeed);
    } catch (error) {
        console.error('Error updating seed:', error);
        res.status(500).json({ error: 'Failed to update seed', details: error.message });
    }
};

exports.deleteSeed = async (req, res) => {
    try {
        const deletedSeed = await Seed.findByIdAndDelete(req.params.id);
        if (!deletedSeed) {
            return res.status(404).json({ error: 'Seed not found' });
        }
        res.status(200).json({ message: 'Seed deleted successfully' });
    } catch (error) {
        console.error('Error deleting seed:', error);
        res.status(500).json({ error: 'Failed to delete seed', details: error.message });
    }
};
