// seed-food.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Food = require('./models/Food');

const sampleFoods = [
  {
    foodName: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    portionSize: '1 breast (174g)',
    date: new Date('2024-01-15')
  },
  {
    foodName: 'Brown Rice',
    calories: 216,
    protein: 4.5,
    carbs: 45,
    fats: 1.8,
    portionSize: '1 cup cooked',
    date: new Date('2024-01-15')
  },
  {
    foodName: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fats: 0.6,
    portionSize: '1 cup chopped',
    date: new Date('2024-01-15')
  },
  {
    foodName: 'Salmon Fillet',
    calories: 208,
    protein: 25,
    carbs: 0,
    fats: 12,
    portionSize: '1 fillet (154g)',
    date: new Date('2024-01-16')
  },
  {
    foodName: 'Quinoa',
    calories: 222,
    protein: 8.1,
    carbs: 39.4,
    fats: 3.6,
    portionSize: '1 cup cooked',
    date: new Date('2024-01-16')
  },
  {
    foodName: 'Greek Yogurt',
    calories: 130,
    protein: 22,
    carbs: 9,
    fats: 0.5,
    portionSize: '1 cup',
    date: new Date('2024-01-17')
  },
  {
    foodName: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fats: 0.4,
    portionSize: '1 medium',
    date: new Date('2024-01-17')
  }
];

async function seedFood() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Ensure we have a MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    // Connect to MongoDB with explicit connection
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    console.log('✅ Connected to MongoDB');
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
      console.log(`   - ${food.foodName} (${food.calories} cal) - ${food.date.toDateString()}`);
    });
    
    console.log('🎉 Food seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding food:', error.message);
    console.error('Full error:', error);
  } finally {
    // Always close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔒 Database connection closed');
    }
    process.exit(0);
  }
}

seedFood(); 