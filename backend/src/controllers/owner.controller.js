const ownerService = require('../services/owner.service');
const { success } = require('../utils/responseHandler');

const getDashboard = async (req, res, next) => {
  try {
    const data = await ownerService.getOwnerDashboard(req.user.id);
    return success(res, data, 'Owner dashboard fetched.');
  } catch (err) { next(err); }
};

module.exports = { getDashboard };
