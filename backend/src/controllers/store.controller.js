const storeService = require('../services/store.service');
const { paginated } = require('../utils/responseHandler');

const getStores = async (req, res, next) => {
  try {
    const { stores, total, page, limit } = await storeService.getStores(req.query, req.user.id);
    return paginated(res, stores, total, page, limit, 'Stores fetched.');
  } catch (err) { next(err); }
};

module.exports = { getStores };
