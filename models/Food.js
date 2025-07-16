// models/Food.js
const { Schema } = require('mongoose');
const ufnConn = require('../db');

const FoodSchema = new Schema({
  user:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  foodName:    { type: String, required: true },
  calories:    { type: Number },
  protein:     { type: Number },
  carbs:       { type: Number },
  fats:        { type: Number },
  portionSize: { type: String },
  mealTime:    { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
    default: 'breakfast'
  },
  meal: { type: require('mongoose').Schema.Types.ObjectId, ref: 'Meal' },
  date:        { type: Date },     // when they ate it
  createdAt:   { type: Date, default: Date.now }
});

// Compound index for efficient querying by user, date, and mealTime
FoodSchema.index({ user: 1, date: 1, mealTime: 1 });

module.exports = ufnConn.model('Food', FoodSchema);