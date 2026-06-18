const { pool } = require('../config/db');

const submitRating = async (userId, { store_id, rating }) => {
  const [stores] = await pool.query('SELECT id FROM stores WHERE id = ?', [store_id]);
  if (stores.length === 0) {
    const err = new Error('Store not found.');
    err.statusCode = 404;
    throw err;
  }

  const [existing] = await pool.query(
    'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
    [userId, store_id]
  );
  if (existing.length > 0) {
    const err = new Error('You have already rated this store. Use update instead.');
    err.statusCode = 409;
    throw err;
  }

  const [result] = await pool.query(
    'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
    [userId, store_id, rating]
  );
  const [ratings] = await pool.query('SELECT * FROM ratings WHERE id = ?', [result.insertId]);
  return ratings[0];
};

const updateRating = async (ratingId, userId, { rating }) => {
  const [ratings] = await pool.query(
    'SELECT * FROM ratings WHERE id = ? AND user_id = ?',
    [ratingId, userId]
  );
  if (ratings.length === 0) {
    const err = new Error('Rating not found or you do not have permission to update it.');
    err.statusCode = 404;
    throw err;
  }

  await pool.query('UPDATE ratings SET rating = ? WHERE id = ?', [rating, ratingId]);
  const [updated] = await pool.query('SELECT * FROM ratings WHERE id = ?', [ratingId]);
  return updated[0];
};

const deleteRating = async (ratingId, userId) => {
  const [result] = await pool.query('DELETE FROM ratings WHERE id = ? AND user_id = ?', [ratingId, userId]);
  if (result.affectedRows === 0) {
    const err = new Error('Rating not found or you do not have permission to delete it.');
    err.statusCode = 404;
    throw err;
  }
  return true;
};

module.exports = { submitRating, updateRating, deleteRating };
