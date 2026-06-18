const ratingService = require('../services/rating.service');
const { success } = require('../utils/responseHandler');

const submitRating = async (req, res, next) => {
  try {
    const rating = await ratingService.submitRating(req.user.id, req.body);
    return success(res, rating, 'Rating submitted successfully.', 201);
  } catch (err) { next(err); }
};

const updateRating = async (req, res, next) => {
  try {
    const rating = await ratingService.updateRating(req.params.id, req.user.id, req.body);
    return success(res, rating, 'Rating updated successfully.');
  } catch (err) { next(err); }
};

const deleteRating = async (req, res, next) => {
  try {
    await ratingService.deleteRating(req.params.id, req.user.id);
    return success(res, null, 'Rating deleted successfully.');
  } catch (err) { next(err); }
};

module.exports = { submitRating, updateRating, deleteRating };
