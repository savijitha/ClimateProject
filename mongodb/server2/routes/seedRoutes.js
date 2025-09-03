// E:\ClimateProject\mongodb\server\routes\seedRoutes.js

const express = require('express');
const multer = require('multer');
const seedController = require('../controllers/seedController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

router.post('/register', upload.single('image'), seedController.registerSeed);
router.get('/all', seedController.getAllSeeds);
router.get('/owner/:id', seedController.getSeedsByOwner);
router.get('/:id', seedController.getSeedById);
router.put('/:id', seedController.updateSeed);
router.delete('/:id', seedController.deleteSeed);

module.exports = router;
