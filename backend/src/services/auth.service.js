const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { generateToken } = require('../utils/generateToken');

const register = async ({ name, email, password, address }) => {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    const err = new Error('Email already registered.');
    err.statusCode = 409;
    throw err;
  }
  const password_hash = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, password_hash, address, 'user']
  );
  const [users] = await pool.query(
    'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
    [result.insertId]
  );
  const user = users[0];
  const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  return { user, token };
};

const login = async ({ email, password }) => {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }
  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }
  const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token };
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
  if (users.length === 0) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  const user = users[0];
  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isMatch) {
    const err = new Error('Current password is incorrect.');
    err.statusCode = 400;
    throw err;
  }
  const newHash = await bcrypt.hash(newPassword, 12);
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);
  return { message: 'Password updated successfully.' };
};

module.exports = { register, login, changePassword };
