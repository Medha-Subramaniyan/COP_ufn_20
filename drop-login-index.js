// drop-login-index.js
require('dotenv').config();
const mongoose = require('mongoose');

async function dropLoginIndex() {
  try {
    const conn = await mongoose.createConnection(process.env.MONGODB_URI);
    const result = await conn.collection('users').dropIndex('login_1');
    console.log('✅ Dropped index:', result);
    await conn.close();
    process.exit(0);
  } catch (err) {
    if (err.codeName === 'IndexNotFound') {
      console.log('ℹ️ Index not found, nothing to drop.');
      process.exit(0);
    } else {
      console.error('❌ Error dropping index:', err);
      process.exit(1);
    }
  }
}

dropLoginIndex(); 