// db.js
const mongoose = require('mongoose');

// Create a separate connection for UF Network
const ufnConn = mongoose.createConnection(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

ufnConn.on('connected', () => {
  console.log('✅ UF Network DB connected');
});

ufnConn.on('error', (err) => {
  console.error('❌ UF Network DB connection error:', err);
});

module.exports = ufnConn;
