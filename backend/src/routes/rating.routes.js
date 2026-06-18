const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { ratingValidator, updateRatingValidator } = require('../validators/rating.validator');
const { validate } = require('../middleware/error.middleware');

router.post('/', authenticate, authorize('user'), ratingValidator, validate, ratingController.submitRating);
router.put('/:id', authenticate, authorize('user'), updateRatingValidator, validate, ratingController.updateRating);
router.delete('/:id', authenticate, authorize('user'), ratingController.deleteRating);

module.exports = router;
