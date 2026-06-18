const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { registerValidator, updateUserValidator } = require('../validators/auth.validator');
const { storeValidator, updateStoreValidator } = require('../validators/store.validator');
const { validate } = require('../middleware/error.middleware');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', registerValidator, validate, adminController.createUser);
router.put('/users/:id', updateUserValidator, validate, adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/stores', adminController.getStores);
router.post('/stores', storeValidator, validate, adminController.createStore);
router.put('/stores/:id', updateStoreValidator, validate, adminController.updateStore);
router.delete('/stores/:id', adminController.deleteStore);

module.exports = router;
