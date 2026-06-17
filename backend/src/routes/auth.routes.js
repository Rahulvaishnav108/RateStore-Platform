const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { registerValidator, loginValidator, changePasswordValidator } = require('../validators/auth.validator');
const { validate } = require('../middleware/error.middleware');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.put('/change-password', authenticate, changePasswordValidator, validate, authController.changePassword);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
