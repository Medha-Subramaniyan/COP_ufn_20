require('dotenv').config();
// seed-posts.js
const mongoose = require('mongoose');

async function seedPosts() {
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
    
    // Define schemas inline
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
      date:       { type: Date, default: Date.now }
    });
    
    const MealSchema = new mongoose.Schema({
      user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      mealTime: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
      date:     { type: Date, required: true },
      foods:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }]
    });
    
    const PostSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      image_url: { type: String },
      description: { type: String },
      meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
      date: { type: Date, default: Date.now }
    });
    
    const User = conn.model('User', UserSchema);
    const Food = conn.model('Food', FoodSchema);
    const Meal = conn.model('Meal', MealSchema);
    const Post = conn.model('Post', PostSchema);
    
    console.log('🌱 Seeding posts...');
    
    // Clear existing posts
    const deleteResult = await Post.deleteMany({});
    console.log(`✅ Cleared ${deleteResult.deletedCount} existing posts`);
    
    // Get a user
    const user = await User.findOne({ email: 'john.doe@ucf.edu' });
    if (!user) {
      console.error('❌ No user found. Please run seed-users first.');
      return;
    }
    
    // Get or create some meals for this user
    let meals = await Meal.find({ user: user._id });
    
    if (meals.length === 0) {
      console.log('⚠️  No meals found. Creating sample meals first...');
      
      // Create some sample foods
      const sampleFoods = [
        {
          user: user._id,
          foodName: 'Grilled Chicken Breast',
          calories: 165,
          protein: 31,
          carbs: 0,
          fats: 3.6,
          portionSize: '1 breast (174g)',
          mealTime: 'lunch',
          date: new Date()
        },
        {
          user: user._id,
          foodName: 'Brown Rice',
          calories: 216,
          protein: 4.5,
          carbs: 45,
          fats: 1.8,
          portionSize: '1 cup cooked',
          mealTime: 'lunch',
          date: new Date()
        },
        {
          user: user._id,
          foodName: 'Greek Yogurt',
          calories: 130,
          protein: 22,
          carbs: 9,
          fats: 0.5,
          portionSize: '1 cup',
          mealTime: 'breakfast',
          date: new Date()
        }
      ];
      
      const foods = await Food.insertMany(sampleFoods);
      
      // Create meals
      const sampleMeals = [
        {
          user: user._id,
          mealTime: 'lunch',
          date: new Date(),
          foods: [foods[0]._id, foods[1]._id] // Chicken + Rice
        },
        {
          user: user._id,
          mealTime: 'breakfast',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          foods: [foods[2]._id] // Yogurt
        }
      ];
      
      meals = await Meal.insertMany(sampleMeals);
      console.log(`✅ Created ${meals.length} sample meals`);
    }
    
    // Create sample posts
    const samplePosts = [
      {
        user: user._id,
        meal: meals[0]._id,
        description: "Perfect protein-packed lunch! 🍗🥗 #healthy #mealprep",
        image_url: "https://res.cloudinary.com/example/image/upload/v1234567890/meals/lunch_chicken_rice.jpg",
        date: new Date()
      },
      {
        user: user._id,
        meal: meals[1]._id,
        description: "Starting the day right with some Greek yogurt! 🥛 #breakfast #protein",
        image_url: null, // No image for this post
        date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      }
    ];
    
    const posts = await Post.insertMany(samplePosts);
    console.log(`✅ Inserted ${posts.length} posts for ${user.firstName} ${user.lastName}:`);
    
    for (const post of posts) {
      const meal = meals.find(m => m._id.equals(post.meal));
      console.log(`   - ${post.description || 'No description'} (${meal?.mealTime})`);
    }
    
    console.log('🎉 Post seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding posts:', error.message);
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

// Run the seeding function
seedPosts(); 