# MongoDB Setup and Migration Guide

## Overview

This guide will help you set up MongoDB for the CallGenie application and migrate from Supabase to MongoDB for data storage.

## What's Been Updated

### 1. Full Screen Signup Page
- Updated signup component to use `fixed inset-0` classes for true full-screen coverage
- Removed dependency on Supabase for authentication
- Improved responsive design and user experience

### 2. MongoDB Integration
- Added MongoDB models for Users, Usage Stats, Activity Logs, and Plans
- Implemented JWT-based authentication
- Created new authentication endpoints with MongoDB backend
- Added password hashing with bcrypt
- Implemented proper error handling and validation

## Installation Steps

### 1. Install MongoDB

#### Option A: Local MongoDB Installation
1. Download MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017` by default

#### Option B: MongoDB Atlas (Cloud)
1. Sign up for MongoDB Atlas at [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy from .env.example
cp .env.example .env
```

Update the `.env` file with your MongoDB connection string:

```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/callgenie

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/callgenie

# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Other configurations...
PORT=4000
NODE_ENV=development
```

### 3. Start the Application

```bash
# Start the backend server
cd backend
npm start

# In another terminal, start the frontend
cd ..
npm run dev
```

## New API Endpoints

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-token` - Verify JWT token
- `GET /api/auth/user/:userId` - Get user profile
- `GET /api/auth/usage/:userId` - Get usage statistics
- `GET /api/auth/activity/:userId` - Get user activity
- `GET /api/auth/plan/:userId` - Get user plan information

### Request/Response Examples

#### Signup Request
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

#### Signup Response
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "_id": "user_id_here",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "accountStatus": "active",
    "role": "user",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  phone: String,
  accountStatus: String (enum: ['active', 'inactive', 'suspended']),
  role: String (enum: ['user', 'admin']),
  trialExpiresAt: Date,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Usage Stats Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  callsMade: Number,
  minutesUsed: Number,
  aiResponseRate: Number,
  voicemails: Number,
  lastCallDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Log Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (enum: ['call', 'signup', 'login', 'payment', 'settings', 'other']),
  description: String,
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

### Plans Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  planName: String (enum: ['free', 'basic', 'premium', 'enterprise']),
  status: String (enum: ['active', 'cancelled', 'expired']),
  renewalDate: Date,
  features: {
    maxCalls: Number,
    maxMinutes: Number,
    aiSupport: Boolean,
    voicemailTranscription: Boolean,
    analytics: Boolean
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Migration from Supabase

If you have existing data in Supabase, you'll need to:

1. Export your data from Supabase
2. Transform it to match the new MongoDB schema
3. Import it into MongoDB
4. Update any remaining Supabase references in your code

## Authentication Flow

1. User signs up with email, password, name, and phone
2. Password is hashed using bcrypt
3. User record is created in MongoDB
4. Initial usage stats and plan records are created
5. JWT token is generated and returned
6. Token is stored in localStorage on the frontend
7. Token is sent with subsequent API requests in the Authorization header

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- Error handling without exposing sensitive information
- Secure password requirements

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file
   - For Atlas, ensure IP whitelist includes your IP

2. **JWT Token Invalid**
   - Check JWT_SECRET in .env file
   - Ensure token is being sent in Authorization header

3. **User Already Exists**
   - Email addresses must be unique
   - Check if user already registered

### Environment Setup
Make sure your `.env` file has all required variables:
```bash
MONGODB_URI=mongodb://localhost:27017/callgenie
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4000
NODE_ENV=development
```

## Next Steps

1. Test the new authentication system
2. Update any remaining frontend components to use the new auth service
3. Implement password reset functionality if needed
4. Add email verification if required
5. Set up proper logging and monitoring

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify your MongoDB connection
3. Ensure all environment variables are set correctly
4. Test API endpoints using a tool like Postman or curl