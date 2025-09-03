// E:\ClimateProject\mongodb\server\models\Request.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const requestSchema = new Schema({
    requestId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    requesterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    requesterEmail: {
        type: String,
        required: true,
    },
    seedId: {
        type: Schema.Types.ObjectId,
        ref: 'Seed',
        required: true,
    },
    seedOwnerEmail: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'granted', 'declined'],
        default: 'pending',
    },
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
