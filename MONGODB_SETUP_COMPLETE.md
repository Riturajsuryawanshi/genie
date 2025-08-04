# MongoDB Setup for CallGenie V2

## Overview
This guide covers the complete MongoDB integration for storing user data, conversation history, and user preferences.

## Database Models

### 1. User Model
- Basic user authentication data
- Email, password, name, phone
- Account status and role management
- Email verification and password reset tokens

### 2. UserProfile Model
- User preferences (voice model, AI model, response length)
- Subscription details (plan, status, Stripe integration)
- Usage statistics (calls, minutes, monthly limits)
- Business information (company, hours, custom greetings)

### 3. Conversation Model
- Call history and AI interactions
- User messages and AI responses
- Audio URLs and processing metadata
- Performance metrics (transcription time, response time)

## Setup Instructions

### 1. Install MongoDB
```bash
# Local MongoDB installation
# Download from: https://www.mongodb.com/try/download/community

# Or use MongoDB Atlas (cloud)
# Sign up at: https://www.mongodb.com/atlas
```

### 2. Configure Environment
```bash
# Copy environment file
cp backend/.env.example backend/.env

# Update MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/callgenie
# Or for Atlas: mongodb+srv://username:password@cluster.mongodb.net/callgenie
```

### 3. Initialize Database
```bash
cd backend
npm run init-db
```

### 4. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### User Management
- `GET /api/user/profile` - Get user profile
- `POST /api/user/assign-phone` - Assign phone number
- `GET /api/user/conversations` - Get conversation history
- `PUT /api/user/preferences` - Update preferences
- `GET /api/user/usage` - Check usage limits

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## Usage Examples

### Create User with Profile
```javascript
const userService = require('./src/services/userService');

const userData = {
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
  phone: '+1234567890'
};

const { user, profile } = await userService.createUser(userData);
```

### Save Conversation
```javascript
const conversationData = {
  userId: user._id,
  phoneNumber: '+1234567890',
  sessionId: 'unique-session-id',
  userMessage: 'Hello SAATHI',
  aiResponse: 'Hello! How can I help you today?',
  duration: 30,
  status: 'completed'
};

await userService.saveConversation(conversationData);
```

### Check Usage Limits
```javascript
const usage = await userService.checkUsageLimits(userId);
if (!usage.allowed) {
  console.log('Usage limit exceeded:', usage.reason);
}
```

## Database Indexes
- User email index for fast authentication
- Phone number index for call routing
- Conversation history by user and date
- Session ID for call tracking

## Subscription Plans
- **Free**: 10 calls, 30 minutes/month
- **Basic**: 100 calls, 300 minutes/month
- **Premium**: 1000 calls, 3000 minutes/month
- **Enterprise**: Unlimited usage

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure password reset flow

## Monitoring
- Usage statistics tracking
- Call duration monitoring
- Monthly usage reset
- Performance metrics collection

## Backup Strategy
```bash
# Create backup
mongodump --db callgenie --out backup/

# Restore backup
mongorestore --db callgenie backup/callgenie/
```

## Troubleshooting

### Connection Issues
1. Check MongoDB service is running
2. Verify connection string in .env
3. Check firewall settings for Atlas

### Performance Issues
1. Monitor database indexes
2. Check query performance
3. Consider connection pooling

### Data Issues
1. Validate input data
2. Check model schemas
3. Review error logs

## Next Steps
1. Set up MongoDB connection
2. Run database initialization
3. Test user registration
4. Verify conversation storage
5. Configure subscription limits