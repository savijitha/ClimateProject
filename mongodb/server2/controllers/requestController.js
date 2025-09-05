// E:\ClimateProject\mongodb\server\controllers\requestController.js

const Request = require('../models/Request');
const Seed = require('../models/Seed'); // <-- You need to import the Seed model
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../config.env' });

// Define the transporter once at the top of the file for efficiency
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.createRequest = async (req, res) => {
    const { requesterId, requesterEmail, seedId, seedOwnerEmail, status } = req.body;
    try {
        if (!requesterId || !requesterEmail || !seedId || !seedOwnerEmail) {
            return res.status(400).json({ message: 'Missing required fields: requesterId, requesterEmail, seedId, seedOwnerEmail.' });
        }
        
        // Add this line to validate the ObjectId format
        if (!mongoose.Types.ObjectId.isValid(seedId)) {
            return res.status(400).json({ message: 'Invalid seed ID format.' });
        }

        const seed = await Seed.findById(seedId);
        if (!seed) {
            return res.status(404).json({ message: 'Seed not found.' });
        }


        const newRequest = new Request({
            requesterId,
            requesterEmail,
            seedId,
            seedOwnerEmail,
            status: status || 'pending',
        });

        await newRequest.save();

        // 2. Send email to the seed owner
        const mailOptionsToOwner = {
            from: process.env.EMAIL_USER,
            to: seedOwnerEmail,
            subject: `New Request for Your Seed: ${seed.seedName}`,
            text: `Hello,\n\nA new request has been made for your seed listing, "${seed.seedName}".\n\nThe requester's email is: ${requesterEmail}.\n\nPlease log in to your dashboard to view and manage this request.\n\nThank you,\nClimate-Smart Agriculture Platform`
        };
        await transporter.sendMail(mailOptionsToOwner);
        console.log(`Notification email sent to seed owner ${seedOwnerEmail} for new request.`);

        res.status(201).json({ message: 'Request created successfully and owner has been notified.', request: newRequest });
    } catch (error) {
        console.error('Error creating request or sending email:', error);
        res.status(500).json({ error: 'Failed to create request', details: error.message });
    }
};

// ... the rest of your controller functions (getAllRequests, getRequestById, etc.)

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
            .populate('requesterId', 'username email');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        let subject, text;
        if (status === 'granted') {
            subject = 'Your Seed Request Has Been Granted!';
            text = `Dear ${request.requesterId.username},\n\nYour request for the seed "${request.seedId.seedName}" has been granted! Please contact the seed owner (${request.seedOwnerEmail}) for further arrangements.\n\nRequest ID: ${request._id}\n\nBest regards,\nClimate-Smart Agriculture Platform`;
        } else if (status === 'declined') {
            subject = 'Your Seed Request Status';
            text = `Dear ${request.requesterId.username},\n\nYour request for the seed "${request.seedId.seedName}" has been declined. \n\nRequest ID: ${request._id}\n\nBest regards,\nClimate-Smart Agriculture Platform`;
        }

        if (subject && text) {
            const mailOptionsToRequester = {
                from: process.env.EMAIL_USER,
                to: request.requesterId.email,
                subject: subject,
                text: text
            };
            await transporter.sendMail(mailOptionsToRequester);
            console.log(`Email sent to ${request.requesterId.email} for status update on request ${request._id}`);
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
