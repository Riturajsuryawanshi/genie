# Contact Form Setup Guide

## Overview
The contact form in the "Get in Touch" section is now fully functional and connected to the backend with MongoDB storage.

## Features Implemented

### Backend Features
- **Contact Message Model**: MongoDB schema for storing contact messages
- **API Endpoints**: RESTful API for handling contact form submissions
- **Rate Limiting**: Prevents spam with 5 submissions per 15 minutes per IP
- **Input Validation**: Server-side validation for all fields
- **Message Status Tracking**: Track message status (new, read, responded, closed)

### Frontend Features
- **Real API Integration**: Form now makes actual API calls to backend
- **Enhanced Error Handling**: Better user feedback with error states
- **Success Confirmation**: Visual feedback when message is sent
- **Form Validation**: Client-side validation with required fields

## API Endpoints

### POST /api/contact
Submit a new contact message
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "subject": "demo",
  "message": "I would like to request a demo."
}
```

### GET /api/contact
Get all contact messages (admin use)
- Query parameters: `page`, `limit`, `status`
- Returns paginated results

### PUT /api/contact/:id/status
Update message status (admin use)
```json
{
  "status": "read"
}
```

## Database Schema

```javascript
{
  name: String (required, max 100 chars),
  email: String (required, valid email),
  company: String (optional, max 100 chars),
  subject: String (required, enum: ['general', 'demo', 'support', 'pricing', 'partnership']),
  message: String (required, max 2000 chars),
  status: String (enum: ['new', 'read', 'responded', 'closed'], default: 'new'),
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

### 1. Backend Setup
Make sure your backend is running:
```bash
cd backend
npm install
npm start
```

The backend should start on port 4000.

### 2. Frontend Setup
Make sure your frontend is configured to proxy API calls:
```bash
npm run dev
```

The frontend should start on port 8080 with API proxy to backend.

### 3. Database Setup
Ensure MongoDB is running and the connection string is set in your backend `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/callgenie
```

## Testing the Contact Form

### 1. Access the Contact Page
Navigate to `/contact` in your application or click "Contact" in the navigation.

### 2. Fill Out the Form
- **Name**: Required field
- **Email**: Required field (must be valid email format)
- **Company**: Optional field
- **Subject**: Required dropdown selection
- **Message**: Required field (max 2000 characters)

### 3. Submit the Form
Click "Send Message" and you should see:
- Loading state while submitting
- Success message when sent successfully
- Error message if something goes wrong
- Form resets after successful submission

### 4. View Stored Messages
You can view stored messages by accessing the admin panel at `/admin/contact-messages` or by checking your MongoDB database directly.

## Rate Limiting
The API implements rate limiting to prevent spam:
- **Limit**: 5 messages per 15 minutes per IP address
- **Response**: 429 status code with retry-after information

## Error Handling

### Frontend Errors
- Network connectivity issues
- Invalid form data
- Rate limiting exceeded
- Server errors

### Backend Errors
- Validation failures
- Database connection issues
- Rate limiting
- Internal server errors

## Security Features
- Input sanitization and validation
- Rate limiting to prevent spam
- IP address and user agent logging
- Email format validation
- Message length limits

## Admin Features
The `AdminContactMessages` component provides:
- View all contact messages
- Filter by status
- Update message status
- Pagination for large datasets
- Message details and timestamps

## File Structure
```
backend/src/
├── models/ContactMessage.js    # MongoDB schema
├── routes/contact.js          # API routes
└── index.js                   # Updated with contact routes

src/pages/
├── Contact.tsx                # Updated contact form
└── AdminContactMessages.tsx   # Admin panel (new)

vite.config.ts                 # Updated proxy configuration
```

## Testing Commands

### Test Backend Directly
```bash
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "general",
    "message": "This is a test message."
  }'
```

### Check Database
```bash
# Connect to MongoDB
mongo callgenie

# View messages
db.contactmessages.find().pretty()
```

## Troubleshooting

### Common Issues
1. **504 Gateway Timeout**: Check if backend is running on port 4000
2. **CORS Errors**: Ensure CORS is configured in backend
3. **Database Connection**: Verify MongoDB is running and connection string is correct
4. **Rate Limiting**: Wait 15 minutes or restart server to reset rate limits

### Debug Mode
Enable debug logging in the backend by adding console.log statements in the contact route.

## Next Steps
- Add email notifications when new messages are received
- Implement admin authentication for viewing messages
- Add message search and filtering capabilities
- Set up automated responses for certain message types