// E:\ClimateProject\mongodb\server\controllers\purchaseController.js

const Purchase = require('../models/Purchase');

// Create a new purchase record
exports.createPurchase = async (req, res) => {
    const { seedName, quantity, buyerName } = req.body;
    try {
        const newPurchase = new Purchase({
            seedName,
            quantity,
            buyerName
        });
        await newPurchase.save();
        res.status(201).json({ message: 'Seed purchased successfully', purchase: newPurchase });
    } catch (error) {
        console.error('Error creating purchase:', error);
        res.status(500).json({ error: 'Failed to create purchase', details: error.message });
    }
};

// Get all purchase records
exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({});
        res.status(200).json(purchases);
    } catch (error) {
        console.error('Error fetching all purchases:', error);
        res.status(500).json({ error: 'Failed to fetch purchases', details: error.message });
    }
};

// Get a single purchase record by ID
exports.getPurchaseById = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        res.status(200).json(purchase);
    } catch (error) {
        console.error('Error fetching purchase by ID:', error);
        res.status(500).json({ error: 'Failed to fetch purchase', details: error.message });
    }
};

// Update a purchase record by ID
exports.updatePurchase = async (req, res) => {
    try {
        const updatedPurchase = await Purchase.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPurchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        res.status(200).json(updatedPurchase);
    } catch (error) {
        console.error('Error updating purchase:', error);
        res.status(500).json({ error: 'Failed to update purchase', details: error.message });
    }
};

// Delete a purchase record by ID
exports.deletePurchase = async (req, res) => {
    try {
        const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);
        if (!deletedPurchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        res.status(200).json({ message: 'Purchase deleted successfully' });
    } catch (error) {
        console.error('Error deleting purchase:', error);
        res.status(500).json({ error: 'Failed to delete purchase', details: error.message });
    }
};
