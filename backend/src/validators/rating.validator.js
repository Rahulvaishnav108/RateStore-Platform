const { body } = require('express-validator');

const ratingValidator = [
  body('store_id').isInt({ min: 1 }).withMessage('Valid store ID is required.'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.'),
];

const updateRatingValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.'),
];

module.exports = { ratingValidator, updateRatingValidator };
