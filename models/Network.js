// models/Network.js
const { Schema } = require('mongoose');
const ufnConn = require('../db');

module.exports = ufnConn.model('Network', new Schema({
  followerId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:   { type: Date, default: Date.now }
})); 