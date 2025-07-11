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

## License
This project is for educational purposes. 