// E:\ClimateProject\mongodb\server\models\Seed.js

const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema({
    seedName: {
        type: String,
        required: true,
    },
    seedType: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdByEmail: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Seed = mongoose.model('Seed', seedSchema);
module.exports = Seed;
