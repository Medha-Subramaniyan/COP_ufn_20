# COP4331 Database Demo

D tracking food and social connections between users

## Features
- User registration and login
- Add and view food entries
- Follow and unfollow other users
- View followers and following lists

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB database (local or cloud)

### Installation
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=*****
   ```
4. Seed the database with demo data:
   - `npm run seed`
   - `npm run seed-users`
   - `npm run seed-food`
   - `npm run seed-network`

### Running the Server
Start the server with:
```
npm start
```
The server will run on port 5000 by default.

## API Endpoints
- `POST /api/login` - User login
- `POST /api/food` - Add food entry
- `GET /api/food/:userId` - Get food entries for a user
- `POST /api/follow` - Follow a user
- `DELETE /api/follow` - Unfollow a user
- `GET /api/followers/:userId` - Get followers
- `GET /api/following/:userId` - Get following users

## Project Structure
- `server.js` - Main server file
- `models/` - Database models
- `seed*.js` - Scripts to add demo data

# Cloudinary Profile Picture Integration

This document explains how to use the Cloudinary integration for profile picture uploads in your MERN application.

## Setup Instructions

### 1. Environment Variables

add keys to .env:



### 2. Dependencies

Install:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload middleware
- `multer-storage-cloudinary` - Cloudinary storage engine for multer

### 3. File Structure

```
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── utils/
│   └── apiUtils.js             # Frontend API utilities
├── examples/
│   └── ProfilePictureUpload.jsx # React component example
├── server.js                   # Updated with upload endpoints
└── .env                        # Environment variables
```

## API Endpoints

### Upload Profile Picture
- **URL**: `POST /api/upload-profile-pic/:userId`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `profilePic` field containing the image file
- **Response**: 
  ```json
  {
    "message": "Profile picture uploaded successfully",
    "profilePicUrl": "https://res.cloudinary.com/...",
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "profilePic": "https://res.cloudinary.com/..."
    },
    "error": ""
  }
  ```

### Delete Profile Picture
- **URL**: `DELETE /api/delete-profile-pic/:userId`
- **Response**: 
  ```json
  {
    "message": "Profile picture deleted successfully",
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "profilePic": null
    },
    "error": ""
  }
  ```

### Get User Profile
- **URL**: `GET /api/user/:userId`
- **Response**: 
  ```json
  {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "profilePic": "https://res.cloudinary.com/...",
      "bio": "User bio",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    "error": ""
  }
  ```

### Update User Profile
- **URL**: `PUT /api/user/:userId`
- **Content-Type**: `application/json`
- **Body**: 
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Updated bio"
  }
  ```

## Frontend Usage

### Using the React Component

```jsx
import ProfilePictureUpload from './examples/ProfilePictureUpload';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <div>
      <h2>User Profile</h2>
      <ProfilePictureUpload
        userId={userId}
        currentProfilePic={user?.profilePic}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}
```

### Using the API Utils Directly

```javascript
import { uploadProfilePicture, deleteProfilePicture } from './utils/apiUtils';

// Upload a file
const handleFileUpload = async (file) => {
  try {
    const result = await uploadProfilePicture(userId, file);
    console.log('Upload successful:', result.profilePicUrl);
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
};

// Delete profile picture
const handleDeletePicture = async () => {
  try {
    const result = await deleteProfilePicture(userId);
    console.log('Delete successful');
  } catch (error) {
    console.error('Delete failed:', error.message);
  }
};
```

## Image Specifications

### Automatic Transformations
- **Size**: 400x400 pixels
- **Crop**: Fill with face detection
- **Format**: Auto-optimized (WebP when supported)
- **Quality**: Auto-optimized

### File Restrictions
- **Max Size**: 5MB
- **Formats**: JPG, PNG, JPEG, GIF, WebP
- **Storage**: Cloudinary folder `profile_pictures/`

## Testing

### Method 1: Quick Cloudinary Connection Test

First, test if your Cloudinary credentials work by running the tutorial:

```bash
node cloudinary-tutorial.js
```


**If you get errors:**
- `Error: Must supply api_key` → Check your `.env` file has all Cloudinary variables
- `Error: Must supply cloud_name` → Verify your environment variables are loaded
- Network errors → Check your internet connection and API credentials

### Method 2: Test Your Server Endpoints

First, start your server:
```bash
npm start
```

#### Using Postman

1. **Upload Profile Picture**:
   - Method: POST
   - URL: `http://localhost:5000/api/upload-profile-pic/USER_ID`
   - Body: form-data with key `profilePic` and file value

2. **Delete Profile Picture**:
   - Method: DELETE
   - URL: `http://localhost:5000/api/delete-profile-pic/USER_ID`

3. **Get User Profile**:
   - Method: GET
   - URL: `http://localhost:5000/api/user/USER_ID`

#### Using curl

```bash
# Upload profile picture
curl -X POST \
  -F "profilePic=@/path/to/image.jpg" \
  http://localhost:5000/api/upload-profile-pic/USER_ID

# Delete profile picture
curl -X DELETE \
  http://localhost:5000/api/delete-profile-pic/USER_ID
```

### Method 3: Test Configuration Endpoint

Add this test endpoint to your `server.js` to verify your setup:

```javascript
app.get('/api/test-cloudinary', (req, res) => {
  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    configured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
  });
});
```

Then visit: `http://localhost:5000/api/test-cloudinary`

**Expected Response:**
```json
{
  "cloudName": "YOUR_CLOUD_NAME",
  "apiKey": "YOUR_API_KEY",
  "configured": true
}
```

## Security Considerations

1. **File Type Validation**: Only image files are accepted
2. **File Size Limits**: 5MB maximum file size
3. **Image Transformations**: Automatic resizing and optimization
4. **Access Control**: Ensure proper authentication before upload/delete operations

## Troubleshooting

### Common Issues

1. **"No file uploaded" error**: Make sure the form field is named `profilePic`
2. **"File size must be less than 5MB"**: Compress your image before uploading
3. **"Only image files are allowed"**: Ensure you're uploading a valid image format
4. **Cloudinary connection issues**: Verify your environment variables are correct

### Testing Cloudinary Connection

Add this test endpoint to your server.js to verify connection:

```javascript
app.get('/api/test-cloudinary', (req, res) => {
  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    configured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
  });
});
```
