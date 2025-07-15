# Meal Tracking System Integration
 Meal tracking has been integrated. The original server.js has been enhanced with comprehensive meal tracking functionality while preserving the existing API structure.

## Changes Made

### 1. Server.js Integration
- **Original server.js backed up** as `server.js.backup`
- **New integrated server.js** includes:
  - Complete meal tracking system
  - Profile picture management
  - Enhanced user management
  - Social networking features
  - Cloudinary integration

### 2. New Models Added
- **Meal.js** - Meal collection that combines foods and their data
- **Enhanced User.js** - Added profile picture and bio support
- **Enhanced Food.js** - Added mealTime field and meal references

### 3. New Dependencies Added
- `cloudinary` - For image storage and management
- `multer` - For file upload handling
- `multer-storage-cloudinary` - For Cloudinary integration

### 4. New API Endpoints

#### Meal Management
- `POST /api/meal` - Create a new meal with multiple foods
- `GET /api/meals/:userId` - Get all meals for a user
- `GET /api/meals/:userId?date=YYYY-MM-DD` - Get meals by date
- `GET /api/meal/:mealId` - Get specific meal with populated foods

#### Food Management
- `POST /api/food` - Create individual food entries
- `GET /api/food/:userId` - Get all foods for a user
- `GET /api/food/:userId/meal/:mealTime` - Get foods by meal time
- `GET /api/food/:userId/daily-summary` - Get daily nutritional summary

#### Profile Management
- `POST /api/upload-profile-pic/:userId` - Upload profile picture
- `DELETE /api/delete-profile-pic/:userId` - Delete profile picture
- `GET /api/user/:userId` - Get user profile
- `PUT /api/user/:userId` - Update user profile

#### Social Features
- `POST /api/follow` - Follow a user
- `DELETE /api/follow` - Unfollow a user
- `GET /api/followers/:userId` - Get user's followers
- `GET /api/following/:userId` - Get users being followed

#### Testing Endpoints
- `GET /api/test-users` - Get users with profile pictures
- `GET /api/test-cloudinary` - Test Cloudinary configuration

## Schema Changes

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  profilePic: String,  // NEW: Cloudinary URL
  bio: String,         // NEW: User bio
  createdAt: Date
}
```

### Food Schema
```javascript
{
  user: ObjectId,
  foodName: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  portionSize: String,
  mealTime: String,    // NEW: breakfast/lunch/dinner/snack
  date: Date
}
```

### Meal Schema (NEW)
```javascript
{
  user: ObjectId,
  mealTime: String,    // breakfast/lunch/dinner/snack
  date: Date,
  foods: [ObjectId]    // Array of Food references
}
```

## Environment Variables Required
Add these to your `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Installation
1. Install new dependencies:
   ```bash
   cd server
   npm install
   ```

2. Set up environment variables in `.env`

3. Start the server:
   ```bash
   npm start
   ```

## Testing
The server includes comprehensive test endpoints to verify functionality:
- Test user data: `GET /api/test-users`
- Test Cloudinary: `GET /api/test-cloudinary`

## Migration Notes
- Original API endpoints are preserved in `api.js` and `api-legacy.js`
- New meal tracking system runs alongside existing functionality
- Database schemas are backward compatible
- All new features are optional and don't break existing functionality

## Files Added/Modified
- `server.js` - Integrated meal tracking system
- `server.js.backup` - Original server backup
- `models/Meal.js` - New meal model
- `config/cloudinary.js` - Cloudinary configuration
- `utils/apiUtils.js` - API utility functions
- `package.json` - Updated dependencies
- `MEAL_TRACKING_INTEGRATION.md` - This documentation 