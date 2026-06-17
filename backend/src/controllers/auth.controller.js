const authService = require('../services/auth.service');
const { success, error } = require('../utils/responseHandler');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return success(res, result, 'Registration successful.', 201);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return success(res, result, 'Login successful.');
  } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    return success(res, result, 'Password changed successfully.');
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    return success(res, req.user, 'User profile fetched.');
  } catch (err) { next(err); }
};

module.exports = { register, login, changePassword, getMe };
