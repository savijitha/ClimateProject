// E:\ClimateProject\mongodb\server\controllers\userController.js

const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signup = async (req, res) => {
    const { username, password, email, notificationFrequency, preferredUnits } = req.body;
    console.log("Incoming request data for signup:", req.body);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            preferences: { notificationFrequency, preferredUnits }
        });
        console.log("Registering user...");
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup failed:', error);
        res.status(500).json({ message: 'Signup failed', details: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            preferences: user.preferences
        }});
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ message: 'Login failed', details: error.message });
    }
};

exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            username: user.username,
            email: user.email,
            notificationFrequency: user.preferences.notificationFrequency,
            preferredUnits: user.preferences.preferredUnits,
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data', details: error.message });
    }
};

exports.updateUserData = async (req, res) => {
    const { username, email, notificationFrequency, preferredUnits } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                username,
                email,
                preferences: { notificationFrequency, preferredUnits },
            },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            preferences: user.preferences
        }});
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Error updating user data', details: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', details: error.message });
    }
};
