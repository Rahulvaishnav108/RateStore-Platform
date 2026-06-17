const { validationResult } = require('express-validator');
const { error } = require('../utils/responseHandler');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return error(res, 'Validation failed', 422, formatted);
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);
  if (err.code === 'ER_DUP_ENTRY') {
    return error(res, 'A record with this email already exists.', 409);
  }
  return error(res, err.message || 'Internal Server Error', err.statusCode || 500);
};

module.exports = { validate, errorHandler };
