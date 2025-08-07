# Hostinger Deployment Guide for CallGenie V2

## Pre-Deployment Checklist

### 1. Run Production Readiness Check
```bash
npm run check:production
```

### 2. Test All API Endpoints
```bash
npm run test:api
```

### 3. Complete Deployment Check
```bash
npm run deploy:check
```

## Hostinger Setup Steps

### 1. Choose Hosting Plan
- Select **Node.js Hosting** plan (not shared hosting)
- Ensure Node.js 18+ is supported

### 2. Upload Your Code
1. Compress your backend folder (excluding node_modules)
2. Upload to Hostinger File Manager
3. Extract in your domain's root directory (usually `public_html`)

### 3. Install Dependencies
```bash
npm install --production
```

### 4. Configure Environment Variables
In Hostinger Control Panel → Node.js → Environment Variables:

```bash
# Required Variables
MONGODB_URL=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-database
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long
OPENAI_API_KEY=sk-proj-your-openai-api-key
NODE_ENV=production
PORT=3000

# Optional Variables
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 5. Set Startup File
- In Hostinger Control Panel → Node.js
- Set **Startup File**: `src/index.js`
- Set **Node.js Version**: 18 or higher

### 6. Configure Domain
- Point your domain to the Node.js application
- Enable SSL certificate

## API Endpoints Overview

Your deployed API will have these endpoints:

### Health & Status
- `GET /health` - System health check
- `GET /api/auth/health` - Auth service health
- `GET /api/webhook/health` - Webhook service health

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/onboard` - Legacy onboarding
- `GET /api/auth/user/:userId` - Get user profile
- `GET /api/auth/users` - Get all users (admin)

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact messages (admin)
- `PUT /api/contact/:id/status` - Update message status

### Voice & AI
- `POST /api/webhook/webhook` - Main Exotel webhook
- `POST /api/webhook/test` - Test webhook endpoint

### User Management
- `GET /api/user/profile` - Get user profile
- `POST /api/user/assign-phone` - Assign phone number
- `GET /api/user/conversations` - Get conversation history
- `PUT /api/user/preferences` - Update preferences
- `GET /api/user/usage` - Check usage limits

## Testing Your Deployed API

### 1. Test Health Endpoint
```bash
curl https://yourdomain.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "SAATHI Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "auth": "active",
    "webhook": "active",
    "whisper": "active",
    "gpt": "active",
    "tts": "active"
  }
}
```

### 2. Test Authentication
```bash
curl -X POST https://yourdomain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }'
```

### 3. Test Contact Form
```bash
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "general",
    "message": "Test message"
  }'
```

## Common Issues & Solutions

### 1. "Cannot find module" Error
- Run `npm install` in the correct directory
- Check that all dependencies are in package.json

### 2. MongoDB Connection Failed
- Verify MONGODB_URL is correct
- Ensure MongoDB Atlas allows connections from Hostinger IPs
- Check username/password in connection string

### 3. OpenAI API Errors
- Verify OPENAI_API_KEY is correct and active
- Check API key has sufficient credits
- Ensure key starts with 'sk-'

### 4. Port Issues
- Hostinger assigns ports automatically
- Always use `process.env.PORT` in your code
- Don't hardcode port numbers

### 5. CORS Issues
- Ensure CORS is enabled in your Express app
- Configure allowed origins for production

## Security Checklist

- ✅ Environment variables are set securely
- ✅ JWT secret is strong and unique
- ✅ MongoDB connection uses authentication
- ✅ API keys are not exposed in code
- ✅ Rate limiting is enabled
- ✅ CORS is properly configured
- ✅ Error messages don't expose sensitive info

## Monitoring & Maintenance

### 1. Check Application Logs
- Use Hostinger Control Panel → Node.js → Logs
- Monitor for errors and performance issues

### 2. Monitor API Usage
- Track OpenAI API usage and costs
- Monitor MongoDB connection limits
- Watch for rate limit violations

### 3. Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update API keys as needed

## Support

If you encounter issues:

1. Check Hostinger documentation
2. Review application logs
3. Test endpoints locally first
4. Verify environment variables
5. Contact Hostinger support for hosting issues

## Performance Optimization

### 1. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Request Logging
```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

### 3. Implement Caching
- Use Redis for session storage
- Cache frequently accessed data
- Implement response caching

---

**Note**: This guide assumes you're using Hostinger's Node.js hosting. For shared hosting, you'll need to use different deployment methods.