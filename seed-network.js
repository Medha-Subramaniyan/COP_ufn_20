// seed-network.js
require('dotenv').config();
const User = require('./models/User');
const Network = require('./models/Network');

async function seedNetwork() {
  try {
    console.log('🌱 Seeding network relationships...');
    
    // Get all users
    const users = await User.find({});
    if (users.length < 2) {
      console.error('❌ Need at least 2 users. Please run seed-users first.');
      process.exit(1);
    }
    
    // Clear existing network relationships
    await Network.deleteMany({});
    console.log('✅ Cleared existing network relationships');
    
    // Create some sample relationships
    const relationships = [
      // John follows Jane and Mike
      { followerId: users[0]._id, followingId: users[1]._id }, // John -> Jane
      { followerId: users[0]._id, followingId: users[2]._id }, // John -> Mike
      
      // Jane follows John and Sarah
      { followerId: users[1]._id, followingId: users[0]._id }, // Jane -> John
      { followerId: users[1]._id, followingId: users[3]._id }, // Jane -> Sarah
      
      // Mike follows John and Jane
      { followerId: users[2]._id, followingId: users[0]._id }, // Mike -> John
      { followerId: users[2]._id, followingId: users[1]._id }, // Mike -> Jane
      
      // Sarah follows Jane
      { followerId: users[3]._id, followingId: users[1]._id }, // Sarah -> Jane
    ];
    
    const networkRecords = await Network.insertMany(relationships);
    console.log(`✅ Inserted ${networkRecords.length} network relationships:`);
    
    // Display the relationships
    for (const record of networkRecords) {
      const follower = users.find(u => u._id.toString() === record.followerId.toString());
      const following = users.find(u => u._id.toString() === record.followingId.toString());
      console.log(`   - ${follower.firstName} ${follower.lastName} follows ${following.firstName} ${following.lastName}`);
    }
    
    console.log('🎉 Network seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding network:', error);
    process.exit(1);
  }
}

seedNetwork(); 