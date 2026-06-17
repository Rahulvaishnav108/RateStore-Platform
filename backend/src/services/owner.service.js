const { pool } = require('../config/db');

const getOwnerDashboard = async (ownerId) => {
  const [stores] = await pool.query('SELECT id, name, email, address FROM stores WHERE owner_id = ?', [ownerId]);
  if (stores.length === 0) {
    const err = new Error('No store found for this owner.');
    err.statusCode = 404;
    throw err;
  }
  const store = stores[0];

  const [[{ avg_rating, total_ratings }]] = await pool.query(`
    SELECT ROUND(AVG(rating), 2) AS avg_rating, COUNT(*) AS total_ratings
    FROM ratings WHERE store_id = ?
  `, [store.id]);

  const [distribution] = await pool.query(`
    SELECT rating, COUNT(*) AS count
    FROM ratings WHERE store_id = ?
    GROUP BY rating
    ORDER BY rating DESC
  `, [store.id]);

  const dist = {};
  for (let i = 1; i <= 5; i++) dist[i] = 0;
  distribution.forEach(d => { dist[d.rating] = d.count; });

  const [raters] = await pool.query(`
    SELECT u.id, u.name, u.email, r.rating, r.created_at, r.updated_at
    FROM ratings r
    JOIN users u ON u.id = r.user_id
    WHERE r.store_id = ?
    ORDER BY r.updated_at DESC
  `, [store.id]);

  return {
    store,
    avg_rating: avg_rating || 0,
    total_ratings: total_ratings || 0,
    distribution: dist,
    raters,
  };
};

module.exports = { getOwnerDashboard };
