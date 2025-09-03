// E:\ClimateProject\mongodb\server\controllers\requestController.js

const Request = require('../models/Request');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../../config.env' });

exports.createRequest = async (req, res) => {
    const { requesterId, requesterEmail, seedId, seedOwnerEmail, status } = req.body;
    try {
        if (!requesterId || !requesterEmail || !seedId || !seedOwnerEmail) {
            return res.status(400).json({ message: 'Missing required fields: requesterId, requesterEmail, seedId, seedOwnerEmail.' });
        }

        const newRequest = new Request({
            requesterId,
            requesterEmail,
            seedId,
            seedOwnerEmail,
            status: status || 'pending',
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request created successfully', request: newRequest });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Failed to create request', details: error.message });
    }
};

exports.getAllRequests = async (req, res) => {
    const { ownerEmail } = req.query;
    try {
        let requests;
        if (ownerEmail) {
            requests = await Request.find({ seedOwnerEmail: ownerEmail })
                                    .populate('seedId', 'seedName seedType image description')
                                    .populate('requesterId', 'username email');
        } else {
            requests = await Request.find({})
                                    .populate('seedId', 'seedName seedType image description')
                                    .populate('requesterId', 'username email');
        }
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests', details: error.message });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
                                    .populate('seedId', 'seedName seedType image description')
                                    .populate('requesterId', 'username email');
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(200).json(request);
    } catch (error) {
        console.error('Error fetching request by ID:', error);
        res.status(500).json({ error: 'Failed to fetch request', details: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        const request = await Request.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        )
        .populate('seedId', 'seedName seedType')
        .populate('requesterId', 'username email'); // This line is crucial for populating the data

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // The rest of your code remains the same.
        // It can now correctly access request.requesterId.email
        // and other populated properties.

        if (status === 'granted') {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: request.requesterId.email, // Use the populated email
                subject: 'Your Seed Request Has Been Granted!',
                text: `Dear ${request.requesterId.username},\n\nYour request for the seed (ID: ${request.seedId._id}) has been granted! Please contact the seed owner (${request.seedOwnerEmail}) for further arrangements.\n\nRequest ID: ${request._id}\n\nBest regards,\nClimate-Smart Agriculture Platform`
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${request.requesterId.email} for granted request ${request._id}`);
        } else if (status === 'declined') {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: request.requesterId.email, // Use the populated email
                subject: 'Your Seed Request Status',
                text: `Dear ${request.requesterId.username},\n\nYour request for the seed (ID: ${request.seedId._id}) has been declined. \n\nRequest ID: ${request._id}\n\nBest regards,\nClimate-Smart Agriculture Platform`
            };
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${request.requesterId.email} for declined request ${request._id}`);
        }

        res.status(200).json({ message: `Request status updated to ${status}`, request });
    } catch (error) {
        console.error('Error updating request status or sending email:', error);
        res.status(500).json({ error: 'Failed to update request status or send email', details: error.message });
    }
};
exports.deleteRequest = async (req, res) => {
    try {
        const deletedRequest = await Request.findByIdAndDelete(req.params.id);
        if (!deletedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(200).json({ message: 'Request deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ error: 'Failed to delete request', details: error.message });
    }
};
