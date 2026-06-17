const { body } = require('express-validator');

const storeValidator = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters.'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address.'),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),
  body('owner_id').optional().isInt({ min: 1 }).withMessage('Owner ID must be a positive integer.'),
];

module.exports = { storeValidator };
