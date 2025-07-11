// seed-users.js
require('dotenv').config();
const mongoose = require('mongoose');

const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@ucf.edu',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Math Student!'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@ucf.edu',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Biology student.'
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@ucf.edu',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Engineering student'
  },
  {
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@ucf.edu',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Psychology student'
  }
];

async function seedUsers() {
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
    
    // Define User model inline
    const UserSchema = new mongoose.Schema({
      firstName:  { type: String, required: true },
      lastName:   { type: String, required: true },
      email:      { type: String, required: true, unique: true },
      password:   { type: String, required: true },
      profilePic: { type: String },
      bio:        { type: String },
      createdAt:  { type: Date,   default: Date.now }
    });
    
    const User = conn.model('User', UserSchema);
    
    console.log('🌱 Seeding users...');
    
    // Clear existing users
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Cleared ${deleteResult.deletedCount} existing users`);
    
    // Insert new users
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${users.length} users:`);
    
    users.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
    });
    
    console.log('🎉 User seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
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

seedUsers(); 