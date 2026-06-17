const adminService = require('../services/admin.service');
const { success, paginated } = require('../utils/responseHandler');

const getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboard();
    return success(res, data, 'Dashboard data fetched.');
  } catch (err) { next(err); }
};

const getUsers = async (req, res, next) => {
  try {
    const { users, total, page, limit } = await adminService.getUsers(req.query);
    return paginated(res, users, total, page, limit, 'Users fetched.');
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    return success(res, user, 'User details fetched.');
  } catch (err) { next(err); }
};

const createUser = async (req, res, next) => {
  try {
    const user = await adminService.createUser(req.body);
    return success(res, user, 'User created successfully.', 201);
  } catch (err) { next(err); }
};

const getStores = async (req, res, next) => {
  try {
    const { stores, total, page, limit } = await adminService.getStores(req.query);
    return paginated(res, stores, total, page, limit, 'Stores fetched.');
  } catch (err) { next(err); }
};

const createStore = async (req, res, next) => {
  try {
    const store = await adminService.createStore(req.body);
    return success(res, store, 'Store created successfully.', 201);
  } catch (err) { next(err); }
};

module.exports = { getDashboard, getUsers, getUserById, createUser, getStores, createStore };
