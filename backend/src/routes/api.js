const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryController');
const { apiKeyAuth } = require('../middleware/auth'); // Import the middleware
router.use(apiKeyAuth);

router.post('/items', apiKeyAuth, controller.addItem);
router.get('/items', controller.getAllItems);
router.post('/consumption', controller.logConsumption);
router.get('/restock-alerts', controller.getRestockAlerts);

module.exports = router;