const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/dashboard', authenticate, authorize('store_owner'), ownerController.getDashboard);

module.exports = router;
