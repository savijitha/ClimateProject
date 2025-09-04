const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/request', requestController.createRequest); 
router.get('/all', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id', requestController.updateRequestStatus);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;
