// models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  image_url: { type: String },  // Optional picture
  description: { type: String }, // Optional description
  meal: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema); 