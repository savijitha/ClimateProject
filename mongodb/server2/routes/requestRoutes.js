// E:\ClimateProject\mongodb\server\routes\requestRoutes.js

const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/', requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id/status', requestController.updateRequestStatus);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;
