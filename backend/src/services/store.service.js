const { pool } = require('../config/db');
const { getPagination, getSorting } = require('../utils/pagination');

const getStores = async (query, userId) => {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, sortOrder } = getSorting(query, ['name', 'address', 'avg_rating', 'created_at']);

  let where = [];
  let params = [];

  if (query.search) {
    where.push('(s.name LIKE ? OR s.address LIKE ?)');
    params.push(`%${query.search}%`, `%${query.search}%`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM stores s ${whereClause}`,
    params
  );

  const orderField = sortBy === 'avg_rating' ? 'avg_rating' : `s.${sortBy}`;
  const [stores] = await pool.query(`
    SELECT s.id, s.name, s.email, s.address, s.created_at,
      ROUND(AVG(r.rating), 2) AS avg_rating,
      COUNT(r.id) AS total_ratings,
      ur.rating AS user_rating,
      ur.id AS user_rating_id
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
    ${whereClause}
    GROUP BY s.id, s.name, s.email, s.address, s.created_at, ur.rating, ur.id
    ORDER BY ${orderField} ${sortOrder}
    LIMIT ? OFFSET ?
  `, [userId, ...params, limit, offset]);

  return { stores, total, page, limit };
};

module.exports = { getStores };
