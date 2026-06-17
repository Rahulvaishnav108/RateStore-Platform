require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool, initDB } = require('./src/config/db');

const seed = async () => {
  await initDB();

  console.log('🌱 Seeding database...');

  const adminHash = await bcrypt.hash('Admin@123', 12);
  const userHash = await bcrypt.hash('User@1234', 12);
  const ownerHash = await bcrypt.hash('Owner@123', 12);

  await pool.query('DELETE FROM ratings');
  await pool.query('DELETE FROM stores');
  await pool.query('DELETE FROM users');
  await pool.query('ALTER TABLE ratings AUTO_INCREMENT = 1');
  await pool.query('ALTER TABLE stores AUTO_INCREMENT = 1');
  await pool.query('ALTER TABLE users AUTO_INCREMENT = 1');

  // Admin
  await pool.query(
    'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
    ['System Administrator Account', 'admin@storerating.com', adminHash, '123 Admin Street, New Delhi, India', 'admin']
  );

  // Store owners
  const owners = [
    ['Rajesh Kumar Sharma Enterprises Owner', 'rajesh.owner@gmail.com', ownerHash, 'MG Road, Bengaluru, Karnataka 560001', 'store_owner'],
    ['Priya Mehta Boutique Store Owner', 'priya.owner@gmail.com', ownerHash, 'Linking Road, Bandra, Mumbai 400050', 'store_owner'],
    ['Vikram Singh Electronics Owner', 'vikram.owner@gmail.com', ownerHash, 'Connaught Place, New Delhi 110001', 'store_owner'],
  ];
  for (const o of owners) {
    await pool.query('INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)', o);
  }

  // Normal users
  const users = [
    ['Ankit Verma Software Developer User', 'ankit@gmail.com', userHash, 'Sector 15, Noida, UP 201301', 'user'],
    ['Sneha Patel Marketing Manager User', 'sneha@gmail.com', userHash, 'Vastrapur, Ahmedabad, Gujarat 380015', 'user'],
    ['Arjun Nair Freelance Designer User', 'arjun@gmail.com', userHash, 'Koramangala, Bengaluru, Karnataka', 'user'],
    ['Kavita Singh Data Analyst Professional', 'kavita@gmail.com', userHash, 'Powai, Mumbai, Maharashtra 400076', 'user'],
    ['Rohit Gupta Business Analyst Senior', 'rohit@gmail.com', userHash, 'Rajouri Garden, New Delhi 110027', 'user'],
  ];
  for (const u of users) {
    await pool.query('INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)', u);
  }

  // Stores
  const [[{ id: ownerId1 }]] = await pool.query('SELECT id FROM users WHERE email = ?', ['rajesh.owner@gmail.com']);
  const [[{ id: ownerId2 }]] = await pool.query('SELECT id FROM users WHERE email = ?', ['priya.owner@gmail.com']);
  const [[{ id: ownerId3 }]] = await pool.query('SELECT id FROM users WHERE email = ?', ['vikram.owner@gmail.com']);

  const stores = [
    ['Rajesh Kumar General Store Bengaluru', 'rajesh.store@gmail.com', 'MG Road, Bengaluru, Karnataka 560001', ownerId1],
    ['Priya Mehta Fashion Boutique Mumbai', 'priya.store@gmail.com', 'Linking Road, Bandra, Mumbai 400050', ownerId2],
    ['Vikram Singh Electronics Delhi Store', 'vikram.store@gmail.com', 'Connaught Place, New Delhi 110001', ownerId3],
    ['Sunrise Grocery Supermarket Hyderabad', 'sunrise@gmail.com', 'Banjara Hills, Hyderabad, Telangana 500034', null],
    ['Mountain Fresh Organic Store Pune', 'mountainfresh@gmail.com', 'Koregaon Park, Pune, Maharashtra 411001', null],
  ];
  for (const s of stores) {
    await pool.query('INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)', s);
  }

  // Sample ratings
  const [userRows] = await pool.query("SELECT id FROM users WHERE role = 'user' ORDER BY id");
  const [storeRows] = await pool.query('SELECT id FROM stores ORDER BY id');

  const ratingData = [
    [userRows[0].id, storeRows[0].id, 5],
    [userRows[1].id, storeRows[0].id, 4],
    [userRows[2].id, storeRows[0].id, 4],
    [userRows[3].id, storeRows[0].id, 3],
    [userRows[4].id, storeRows[0].id, 5],
    [userRows[0].id, storeRows[1].id, 4],
    [userRows[1].id, storeRows[1].id, 5],
    [userRows[2].id, storeRows[1].id, 3],
    [userRows[0].id, storeRows[2].id, 2],
    [userRows[1].id, storeRows[2].id, 3],
    [userRows[2].id, storeRows[3].id, 5],
    [userRows[3].id, storeRows[3].id, 4],
    [userRows[4].id, storeRows[4].id, 5],
  ];
  for (const [uid, sid, rating] of ratingData) {
    await pool.query('INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)', [uid, sid, rating]);
  }

  console.log('✅ Seed complete!');
  console.log('\n📋 Test Credentials:');
  console.log('  Admin:       admin@storerating.com  /  Admin@123');
  console.log('  User:        ankit@gmail.com        /  User@1234');
  console.log('  Store Owner: rajesh.owner@gmail.com /  Owner@123');

  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
