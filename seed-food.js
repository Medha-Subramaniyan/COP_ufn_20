// seed-food.js
require('dotenv').config();
const mongoose = require('mongoose');

const sampleFoods = [
  {
    foodName: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    portionSize: '1 breast (174g)',
    mealTime: 'lunch',
    date: new Date('2024-01-15')
  },
  {
    foodName: 'Brown Rice',
    calories: 216,
    protein: 4.5,
    carbs: 45,
    fats: 1.8,
    portionSize: '1 cup cooked',
    mealTime: 'lunch',
    date: new Date('2024-01-15')
  },
  {
    foodName: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fats: 0.6,
    portionSize: '1 cup chopped',
    mealTime: 'lunch',
    date: new Date('2024-01-15')
  },
  {
    foodName: 'Salmon Fillet',
    calories: 208,
    protein: 25,
    carbs: 0,
    fats: 12,
    portionSize: '1 fillet (154g)',
    mealTime: 'dinner',
    date: new Date('2024-01-16')
  },
  {
    foodName: 'Quinoa',
    calories: 222,
    protein: 8.1,
    carbs: 39.4,
    fats: 3.6,
    portionSize: '1 cup cooked',
    mealTime: 'dinner',
    date: new Date('2024-01-16')
  },
  {
    foodName: 'Greek Yogurt',
    calories: 130,
    protein: 22,
    carbs: 9,
    fats: 0.5,
    portionSize: '1 cup',
    mealTime: 'breakfast',
    date: new Date('2024-01-17')
  },
  {
    foodName: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fats: 0.4,
    portionSize: '1 medium',
    mealTime: 'breakfast',
    date: new Date('2024-01-17')
  },
  {
    foodName: 'Oatmeal',
    calories: 154,
    protein: 5.3,
    carbs: 28,
    fats: 3.2,
    portionSize: '1 cup cooked',
    mealTime: 'breakfast',
    date: new Date('2024-01-18')
  },
  {
    foodName: 'Turkey Sandwich',
    calories: 320,
    protein: 25,
    carbs: 28,
    fats: 12,
    portionSize: '1 sandwich',
    mealTime: 'lunch',
    date: new Date('2024-01-18')
  },
  {
    foodName: 'Mixed Nuts',
    calories: 180,
    protein: 6,
    carbs: 5,
    fats: 16,
    portionSize: '1 oz',
    mealTime: 'snack',
    date: new Date('2024-01-18')
  },
  {
    foodName: 'Pasta with Marinara',
    calories: 280,
    protein: 12,
    carbs: 54,
    fats: 2.5,
    portionSize: '1 cup',
    mealTime: 'dinner',
    date: new Date('2024-01-19')
  },
  {
    foodName: 'Apple',
    calories: 80,
    protein: 0.4,
    carbs: 21,
    fats: 0.3,
    portionSize: '1 medium',
    mealTime: 'snack',
    date: new Date('2024-01-19')
  }
];

async function seedFood() {
  let conn;
  
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Ensure we have a MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    // Create a fresh connection
    conn = mongoose.createConnection(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    // Wait for connection
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);
      
      conn.once('connected', () => {
        clearTimeout(timeout);
        resolve();
      });
      
      conn.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Define models inline
    const UserSchema = new mongoose.Schema({
      firstName:  { type: String, required: true },
      lastName:   { type: String, required: true },
      email:      { type: String, required: true, unique: true },
      password:   { type: String, required: true },
      profilePic: { type: String },
      bio:        { type: String },
      createdAt:  { type: Date,   default: Date.now }
    });
    
    const FoodSchema = new mongoose.Schema({
      user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      foodName:   { type: String, required: true },
      calories:   { type: Number, required: true },
      protein:    { type: Number, required: true },
      carbs:      { type: Number, required: true },
      fats:       { type: Number, required: true },
      portionSize: { type: String, required: true },
      mealTime:   { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
      meal:       { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },  // NEW: Meal reference
      date:       { type: Date, default: Date.now }
    });
    
    const User = conn.model('User', UserSchema);
    const Food = conn.model('Food', FoodSchema);
    
    console.log('🌱 Seeding food records...');
    
    // Get a user to associate food with
    const user = await User.findOne({ email: 'john.doe@ucf.edu' });
    if (!user) {
      console.error('❌ No user found. Please run seed-users first.');
      process.exit(1);
    }
    
    // Clear existing food records for this user
    const deleteResult = await Food.deleteMany({ user: user._id });
    console.log(`✅ Cleared ${deleteResult.deletedCount} existing food records`);
    
    // Insert new food records
    const foodRecords = sampleFoods.map(food => ({
      ...food,
      user: user._id
    }));
    
    const foods = await Food.insertMany(foodRecords);
    console.log(`✅ Inserted ${foods.length} food records for ${user.firstName} ${user.lastName}:`);
    
    foods.forEach(food => {
      console.log(`   - ${food.foodName} (${food.calories} cal) - ${food.mealTime} - ${food.date.toDateString()}`);
    });
    
    console.log('🎉 Food seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding food:', error.message);
    console.error('Full error:', error);
  } finally {
    // Always close the connection
    if (conn && conn.readyState === 1) {
      await conn.close();
      console.log('🔒 Database connection closed');
    }
    process.exit(0);
  }
}

seedFood(); 