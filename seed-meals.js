// seed-meals.js
const mongoose = require('mongoose');
require('dotenv').config();

async function seedMeals() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ Missing MONGODB_URI in .env');
      process.exit(1);
    }

    const conn = await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Define schemas
    const UserSchema = new mongoose.Schema({
      firstName:  { type: String, required: true },
      lastName:   { type: String, required: true },
      email:      { type: String, required: true, unique: true },
      password:   { type: String, required: true },
      profilePic: { type: String },
      bio:        { type: String },
      createdAt:  { type: Date, default: Date.now },
      meals:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }]
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
      meal:       { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
      date:       { type: Date, default: Date.now }
    });

    const MealSchema = new mongoose.Schema({
      user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      mealTime: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
      date:     { type: Date, required: true },
      foods:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }]
    });

    const User = conn.model('User', UserSchema);
    const Food = conn.model('Food', FoodSchema);
    const Meal = conn.model('Meal', MealSchema);

    console.log('🌱 Seeding meals...');

    // Clear existing meals
    const deleteResult = await Meal.deleteMany({});
    console.log(`✅ Cleared ${deleteResult.deletedCount} existing meals`);

    // Get a user
    const user = await User.findOne({ email: 'john.doe@ucf.edu' });
    if (!user) {
      console.error('❌ No user found. Please run seed-users first.');
      return;
    }

    // Sample meal data with multiple foods per meal
    const sampleMeals = [
      {
        mealTime: 'breakfast',
        date: new Date('2024-01-15'),
        foods: [
          {
            foodName: 'Greek Yogurt',
            calories: 130,
            protein: 22,
            carbs: 9,
            fats: 0.5,
            portionSize: '1 cup',
            mealTime: 'breakfast'
          },
          {
            foodName: 'Banana',
            calories: 105,
            protein: 1.3,
            carbs: 27,
            fats: 0.4,
            portionSize: '1 medium',
            mealTime: 'breakfast'
          },
          {
            foodName: 'Granola',
            calories: 120,
            protein: 3,
            carbs: 18,
            fats: 4,
            portionSize: '1/4 cup',
            mealTime: 'breakfast'
          }
        ]
      },
      {
        mealTime: 'lunch',
        date: new Date('2024-01-15'),
        foods: [
          {
            foodName: 'Grilled Chicken Breast',
            calories: 165,
            protein: 31,
            carbs: 0,
            fats: 3.6,
            portionSize: '1 breast (174g)',
            mealTime: 'lunch'
          },
          {
            foodName: 'Brown Rice',
            calories: 216,
            protein: 4.5,
            carbs: 45,
            fats: 1.8,
            portionSize: '1 cup cooked',
            mealTime: 'lunch'
          },
          {
            foodName: 'Broccoli',
            calories: 55,
            protein: 3.7,
            carbs: 11.2,
            fats: 0.6,
            portionSize: '1 cup chopped',
            mealTime: 'lunch'
          }
        ]
      },
      {
        mealTime: 'dinner',
        date: new Date('2024-01-15'),
        foods: [
          {
            foodName: 'Salmon Fillet',
            calories: 208,
            protein: 25,
            carbs: 0,
            fats: 12,
            portionSize: '1 fillet (154g)',
            mealTime: 'dinner'
          },
          {
            foodName: 'Quinoa',
            calories: 222,
            protein: 8.1,
            carbs: 39.4,
            fats: 3.6,
            portionSize: '1 cup cooked',
            mealTime: 'dinner'
          },
          {
            foodName: 'Asparagus',
            calories: 27,
            protein: 3,
            carbs: 5,
            fats: 0.2,
            portionSize: '1 cup',
            mealTime: 'dinner'
          }
        ]
      },
      {
        mealTime: 'snack',
        date: new Date('2024-01-15'),
        foods: [
          {
            foodName: 'Mixed Nuts',
            calories: 180,
            protein: 6,
            carbs: 5,
            fats: 16,
            portionSize: '1 oz',
            mealTime: 'snack'
          },
          {
            foodName: 'Apple',
            calories: 95,
            protein: 0.5,
            carbs: 25,
            fats: 0.3,
            portionSize: '1 medium',
            mealTime: 'snack'
          }
        ]
      }
    ];

    // Create meals with their foods
    for (const mealData of sampleMeals) {
      // Create Food documents first
      const createdFoods = await Promise.all(
        mealData.foods.map(food =>
          Food.create({ ...food, user: user._id })
        )
      );

      // Create Meal document
      const meal = await Meal.create({
        user: user._id,
        mealTime: mealData.mealTime,
        date: mealData.date,
        foods: createdFoods.map(f => f._id)
      });

      // Update User and Food with meal reference
      await User.findByIdAndUpdate(user._id, { $push: { meals: meal._id } });
      await Promise.all(
        createdFoods.map(f => Food.findByIdAndUpdate(f._id, { meal: meal._id }))
      );

      console.log(`✅ Created ${mealData.mealTime} meal with ${createdFoods.length} foods`);
      createdFoods.forEach(food => {
        console.log(`   - ${food.foodName} (${food.calories} cal)`);
      });
    }

    console.log('🎉 Meal seeding completed!');

    // Test the meals
    const meals = await Meal.find({ user: user._id }).populate('foods');
    console.log(`\n📊 Summary: Created ${meals.length} meals for ${user.firstName} ${user.lastName}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error seeding meals:', error.message);
    console.error('Full error:', error);
  }
}

seedMeals(); 