const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'super_secret_key_change_in_prod', {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_change_in_prod');
};

module.exports = { generateToken, verifyToken };
