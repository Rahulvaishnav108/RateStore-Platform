const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { getPagination, getSorting } = require('../utils/pagination');

const getDashboard = async () => {
  const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role != 'admin'");
  const [[{ totalAdmins }]] = await pool.query("SELECT COUNT(*) AS totalAdmins FROM users WHERE role = 'admin'");
  const [[{ totalStores }]] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
  const [[{ totalRatings }]] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');
  const [[{ avgRating }]] = await pool.query('SELECT ROUND(AVG(rating), 2) AS avgRating FROM ratings');
  return { totalUsers, totalAdmins, totalStores, totalRatings, avgRating: avgRating || 0 };
};

const getUsers = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, sortOrder } = getSorting(query, ['name', 'email', 'address', 'role', 'created_at']);

  let where = [];
  let params = [];

  if (query.name) { where.push('u.name LIKE ?'); params.push(`%${query.name}%`); }
  if (query.email) { where.push('u.email LIKE ?'); params.push(`%${query.email}%`); }
  if (query.address) { where.push('u.address LIKE ?'); params.push(`%${query.address}%`); }
  if (query.role) { where.push('u.role = ?'); params.push(query.role); }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) AS total FROM users u ${whereClause}`;
  const [[{ total }]] = await pool.query(countQuery, params);

  const dataQuery = `
    SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
      s.id AS store_id, s.name AS store_name,
      ROUND(AVG(r.rating), 2) AS avg_rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    ${whereClause}
    GROUP BY u.id, u.name, u.email, u.address, u.role, u.created_at, s.id, s.name
    ORDER BY u.${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;
  const [users] = await pool.query(dataQuery, [...params, limit, offset]);
  return { users, total, page, limit };
};

const getUserById = async (id) => {
  const [users] = await pool.query(`
    SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
      s.id AS store_id, s.name AS store_name,
      ROUND(AVG(r.rating), 2) AS avg_rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE u.id = ?
    GROUP BY u.id, u.name, u.email, u.address, u.role, u.created_at, s.id, s.name
  `, [id]);
  if (users.length === 0) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  return users[0];
};

const createUser = async ({ name, email, password, address, role }) => {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    const err = new Error('Email already registered.');
    err.statusCode = 409;
    throw err;
  }
  const password_hash = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, password_hash, address, role || 'user']
  );
  const [users] = await pool.query(
    'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
    [result.insertId]
  );
  return users[0];
};

const getStores = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, sortOrder } = getSorting(query, ['name', 'email', 'address', 'created_at', 'avg_rating']);

  let where = [];
  let params = [];

  if (query.name) { where.push('s.name LIKE ?'); params.push(`%${query.name}%`); }
  if (query.email) { where.push('s.email LIKE ?'); params.push(`%${query.email}%`); }
  if (query.address) { where.push('s.address LIKE ?'); params.push(`%${query.address}%`); }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) AS total FROM stores s ${whereClause}`;
  const [[{ total }]] = await pool.query(countQuery, params);

  const orderField = sortBy === 'avg_rating' ? 'avg_rating' : `s.${sortBy}`;
  const dataQuery = `
    SELECT s.id, s.name, s.email, s.address, s.created_at,
      u.id AS owner_id, u.name AS owner_name, u.email AS owner_email,
      ROUND(AVG(r.rating), 2) AS avg_rating,
      COUNT(r.id) AS total_ratings
    FROM stores s
    LEFT JOIN users u ON u.id = s.owner_id
    LEFT JOIN ratings r ON r.store_id = s.id
    ${whereClause}
    GROUP BY s.id, s.name, s.email, s.address, s.created_at, u.id, u.name, u.email
    ORDER BY ${orderField} ${sortOrder}
    LIMIT ? OFFSET ?
  `;
  const [stores] = await pool.query(dataQuery, [...params, limit, offset]);
  return { stores, total, page, limit };
};

const createStore = async ({ name, email, address, owner_id }) => {
  if (owner_id) {
    const [owners] = await pool.query("SELECT id FROM users WHERE id = ? AND role = 'store_owner'", [owner_id]);
    if (owners.length === 0) {
      const err = new Error('Owner not found or is not a store owner.');
      err.statusCode = 400;
      throw err;
    }
  }
  const [result] = await pool.query(
    'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
    [name, email, address, owner_id || null]
  );
  const [stores] = await pool.query('SELECT * FROM stores WHERE id = ?', [result.insertId]);
  return stores[0];
};

module.exports = { getDashboard, getUsers, getUserById, createUser, getStores, createStore };
