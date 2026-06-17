const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, authorize('user'), storeController.getStores);

module.exports = router;
