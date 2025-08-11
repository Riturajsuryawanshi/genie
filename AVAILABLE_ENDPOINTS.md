# Available Backend Endpoints

## Base URL: https://genie-0rwj.onrender.com

## Health Check
- `GET /health` - System health check

## Authentication Routes (/api/auth)
- `GET /api/auth/health` - Auth service health
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/onboard` - Legacy onboarding
- `GET /api/auth/user/:userId` - Get user profile
- `GET /api/auth/usage/:userId` - Get user usage stats
- `GET /api/auth/activity/:userId` - Get user activity
- `GET /api/auth/plan/:userId` - Get user plan
- `POST /api/auth/verify-token` - Verify JWT token
- `GET /api/auth/users` - Get all users (admin)

## Contact Routes (/api/contact)
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact messages (admin)
- `PUT /api/contact/:id/status` - Update message status

## Webhook Routes (/api/webhook)
- `POST /api/webhook/webhook` - Main Exotel webhook
- `POST /api/webhook/test` - Test webhook endpoint
- `GET /api/webhook/health` - Webhook service health

## User Routes (/api/user)
- Available but need to check implementation

## GPT Routes (/api/gpt)
- Available but need to check implementation

## STT Routes (/api/stt)
- Available but need to check implementation

## Call Routes (/api/call)
- Available but need to check implementation

## Missing Endpoints (causing 404 errors)
- `/api/auth/phone/:userId` - Not implemented (used in Dashboard)

## Frontend API Calls to Check
1. Dashboard tries to call `/api/auth/phone/${user.id}` - MISSING
2. AuthContext calls `/api/auth/onboard` - EXISTS
3. Contact form calls `/api/contact` - EXISTS