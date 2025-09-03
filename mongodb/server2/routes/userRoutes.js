// E:\ClimateProject\mongodb\server\routes\userRoutes.js

const express = require('express');
const { check, validationResult } = require('express-validator');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', [
    check('email').isEmail().withMessage('Please enter a valid email address.'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    check('username').not().isEmpty().withMessage('Username is required.')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    userController.signup(req, res, next);
});

router.post('/login', userController.login);
router.get('/:id', userController.getUserData);
router.put('/:id/preferences', userController.updateUserData);
router.put('/:id/change-password', userController.changePassword);

module.exports = router;
