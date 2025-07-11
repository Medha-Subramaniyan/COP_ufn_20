// db.js
const mongoose = require('mongoose');

// Create a separate connection for UF Network
const ufnConn = mongoose.createConnection(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

ufnConn.on('connected', () => {
  console.log('✅ UF Network DB connected');
});

ufnConn.on('error', (err) => {
  console.error('❌ UF Network DB connection error:', err);
});

ufnConn.on('disconnected', () => {
  console.log('🔌 UF Network DB disconnected');
});

module.exports = ufnConn;
