# COP4331 Database Demo

A comprehensive food tracking and social networking application that allows users to track their meals and connect with other users.

## Features
- User registration and login
- Add and view food entries with meal categorization (breakfast, lunch, dinner, snack)
- Daily meal summaries and nutritional totals
- Follow and unfollow other users
- View followers and following lists
- Profile picture upload and management via Cloudinary

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
   - `npm run seed-users`
   - `npm run seed-food`
   - `npm run seed-network`

### Running the Server
Start the server with:
```
npm start
```
The server will run on port 3000 by default.

## API Endpoints

### Authentication
- `POST /api/login` - User login

### Food & Meal Management
- `POST /api/food` - Add food entry (includes mealTime: breakfast, lunch, dinner, snack)
- `GET /api/food/:userId` - Get all food entries for a user
- `GET /api/food/:userId/meal/:mealTime` - Get foods by meal type with optional date filter
- `GET /api/food/:userId/daily-summary` - Get daily meal summary with nutritional totals

### Social Features
- `POST /api/follow` - Follow a user
- `DELETE /api/follow` - Unfollow a user
- `GET /api/followers/:userId` - Get followers
- `GET /api/following/:userId` - Get following users

### Profile Management
- `GET /api/user/:userId` - Get user profile
- `PUT /api/user/:userId` - Update user profile
- `POST /api/upload-profile-pic/:userId` - Upload profile picture
- `DELETE /api/delete-profile-pic/:userId` - Delete profile picture

## Project Structure
- `server.js` - Main server file
- `models/` - Database models
- `seed*.js` - Scripts to add demo data

## License
This project is for educational purposes. 