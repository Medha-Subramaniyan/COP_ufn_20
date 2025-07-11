// server.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');

// Import the User food network DB connection
const ufnConn = require('./db');

// Import models (register schemas)
const User    = require('./models/User');
const Food    = require('./models/Food');
const Network = require('./models/Network');
const Card = require('./models/Card');

// Import Cloudinary configuration
const { cloudinary, upload } = require('./config/cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Connect to MongoDB
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ Missing MONGODB_URI in .env');
  process.exit(1);
}

// ─── API Endpoints 

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.json({ error: 'Invalid credentials' });

    return res.json({
      id:        user._id,
      email:     user.email,
      firstName: user.firstName,
      lastName:  user.lastName,
      error:     ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Create a new Food record
app.post('/api/food', async (req, res) => {
  try {
    const { userId, foodName, calories, protein, carbs, fats, portionSize, date } = req.body;
    const record = await Food.create({
      user:        userId,
      foodName:    foodName,
      calories:    calories,
      protein:     protein,
      carbs:       carbs,
      fats:        fats,
      portionSize: portionSize,
      date:        date || new Date()
    });
    res.json({ id: record._id, error: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save food' });
  }
});

// List all Foods for a user
app.get('/api/food/:userId', async (req, res) => {
  try {
    const foods = await Food.find({ user: req.params.userId })
                            .sort({ createdAt: -1 });
    res.json({ foods, error: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch food' });
  }
});

// Follow a user
app.post('/api/follow', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    
    // Check if already following
    const existing = await Network.findOne({ followerId, followingId });
    if (existing) {
      return res.json({ error: 'Already following this user' });
    }
    
    // Check if trying to follow self
    if (followerId === followingId) {
      return res.json({ error: 'Cannot follow yourself' });
    }
    
    await Network.create({ followerId, followingId });
    res.json({ error: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not follow user' });
  }
});

// Unfollow a user
app.delete('/api/follow', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    await Network.findOneAndDelete({ followerId, followingId });
    res.json({ error: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not unfollow user' });
  }
});

// Get followers for a user
app.get('/api/followers/:userId', async (req, res) => {
  try {
    const followers = await Network.find({ followingId: req.params.userId })
                                   .populate('followerId', 'firstName lastName email profilePic')
                                   .sort({ createdAt: -1 });
    res.json({ followers, error: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch followers' });
  }
});

// Get users being followed by a user
app.get('/api/following/:userId', async (req, res) => {
  try {
    const following = await Network.find({ followerId: req.params.userId })
                                   .populate('followingId', 'firstName lastName email profilePic')
                                   .sort({ createdAt: -1 });
    res.json({ following, error: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch following' });
  }
});

// ─── Image Upload Endpoints

// Upload profile picture
app.post('/api/upload-profile-pic/:userId', upload.single('profilePic'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Update user's profile picture URL in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: req.file.path },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicUrl: req.file.path,
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic
      },
      error: ''
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Delete profile picture
app.delete('/api/delete-profile-pic/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete from Cloudinary if exists
    if (user.profilePic) {
      const publicId = user.profilePic.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: null },
      { new: true }
    );

    res.json({
      message: 'Profile picture deleted successfully',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic
      },
      error: ''
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete profile picture' });
  }
});

// Get user profile (including profile picture)
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        createdAt: user.createdAt
      },
      error: ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch user profile' });
  }
});

// Update user profile
app.put('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, bio },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        bio: updatedUser.bio
      },
      error: ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update profile' });
  }
});

// ─── Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
