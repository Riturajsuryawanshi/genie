# Real Phone Number Setup for CallGenie

This guide will help you set up a real phone number so users can actually call and talk to the AI assistant.

## 🎯 Overview

Currently, CallGenie is in demo mode. To enable real phone calls, you need to:
1. Get a real phone number from Exotel
2. Configure webhook endpoints
3. Update the backend to handle real calls
4. Test the complete flow

## 📞 Step 1: Get Real Phone Number from Exotel

### 1.1 Sign Up for Exotel Account
- Visit [Exotel](https://exotel.com/)
- Create an account
- Complete verification process

### 1.2 Purchase Phone Number
- Go to Exotel Dashboard
- Navigate to "Phone Numbers"
- Purchase a number (e.g., +1-555-CALLGENIE)
- Note down the phone number

### 1.3 Get API Credentials
From Exotel dashboard, get:
```bash
EXOTEL_API_KEY=your_exotel_api_key
EXOTEL_API_SECRET=your_exotel_api_secret
EXOTEL_SID=your_exotel_sid
```

## 🔧 Step 2: Configure Environment Variables

Update your `backend/.env` file:

```bash
# Exotel Configuration (Replace with your real credentials)
EXOTEL_API_KEY=your_real_exotel_api_key
EXOTEL_API_SECRET=your_real_exotel_api_secret
EXOTEL_SID=your_real_exotel_sid

# Webhook URL (Your server URL)
WEBHOOK_BASE_URL=https://your-domain.com
WEBHOOK_SECRET=your_webhook_secret

# Phone Number (Your purchased number)
CALLGENIE_PHONE_NUMBER=+1-555-CALLGENIE
```

## 🌐 Step 3: Deploy Backend to Production

### 3.1 Deploy to Vercel/Heroku/Railway
```bash
# Example for Railway
railway login
railway init
railway up
```

### 3.2 Get Production URL
Your backend will be available at:
```
https://your-app-name.railway.app
```

## 🔗 Step 4: Configure Exotel Webhook

### 4.1 Set Webhook URL in Exotel Dashboard
1. Go to Exotel Dashboard
2. Navigate to "Webhooks" or "Call Settings"
3. Set webhook URL to:
```
https://your-app-name.railway.app/api/webhook/webhook
```

### 4.2 Configure Call Flow
In Exotel dashboard:
1. Go to "Call Flow" or "IVR"
2. Set up call flow to forward to your webhook
3. Enable recording for calls
4. Set webhook to trigger on call completion

## 📱 Step 5: Update Frontend Phone Number

### 5.1 Update Database with Real Number
```sql
-- Update phone pool with real number
INSERT INTO phone_pool (number, assigned, assigned_to) 
VALUES ('+1-555-CALLGENIE', true, 'your-user-id');
```

### 5.2 Update Backend Response
Modify `backend/test-server.js` to return real number:

```javascript
// Replace mock phone number with real one
res.end(JSON.stringify({
  success: true,
  phone_number: process.env.CALLGENIE_PHONE_NUMBER || '+1-555-CALLGENIE',
  message: 'Real CallGenie number'
}));
```

## 🧪 Step 6: Test Real Call Flow

### 6.1 Test Webhook Endpoint
```bash
curl -X POST https://your-app-name.railway.app/api/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello SAATHI",
    "phoneNumber": "+1234567890"
  }'
```

### 6.2 Test Complete Flow
1. Call the real number: `+1-555-CALLGENIE`
2. Speak to the AI
3. AI should respond via phone call

## 🔄 Step 7: Real Call Processing Flow

### 7.1 When User Calls Real Number:
```javascript
// 1. User dials: +1-555-CALLGENIE
// 2. Exotel receives call
// 3. Exotel records conversation
// 4. Exotel sends webhook to our backend:

POST /api/webhook/webhook
{
  "CallSid": "CA1234567890",
  "From": "+1234567890",        // Caller's number
  "To": "+1-555-CALLGENIE",     // Our number
  "RecordingUrl": "https://exotel.com/recording.mp3",
  "RecordingDuration": "30",
  "CallStatus": "completed"
}
```

### 7.2 Backend Processing:
```javascript
// 1. Download audio from Exotel
// 2. Transcribe with OpenAI Whisper
// 3. Generate response with GPT
// 4. Convert to speech with TTS
// 5. Return audio to caller
```

## 🚀 Step 8: Production Deployment Checklist

### ✅ Backend Deployment:
- [ ] Deploy to production server
- [ ] Set environment variables
- [ ] Test webhook endpoints
- [ ] Configure SSL certificate

### ✅ Exotel Configuration:
- [ ] Purchase phone number
- [ ] Set webhook URL
- [ ] Configure call flow
- [ ] Enable recording

### ✅ Database Setup:
- [ ] Update phone pool with real number
- [ ] Test phone number assignment
- [ ] Verify user onboarding

### ✅ Frontend Updates:
- [ ] Update to show real phone number
- [ ] Test "Call Now" button
- [ ] Verify voice interface

## 🐛 Troubleshooting

### Common Issues:

1. **Webhook not receiving calls**
   - Check webhook URL in Exotel dashboard
   - Verify server is accessible
   - Check SSL certificate

2. **Audio processing fails**
   - Verify OpenAI API key
   - Check file permissions for uploads
   - Monitor server logs

3. **Phone number not assigned**
   - Check database connection
   - Verify phone pool configuration
   - Test onboarding endpoint

### Debug Commands:
```bash
# Test webhook locally
curl -X POST http://localhost:4000/api/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "phoneNumber": "+1234567890"}'

# Check server logs
railway logs

# Test phone number endpoint
curl http://localhost:4000/api/auth/phone/your-user-id
```

## 📊 Monitoring

### Set up monitoring for:
- Webhook call frequency
- Audio processing success rate
- AI response quality
- Call duration metrics
- Error rates

### Log important events:
- Incoming calls
- Transcription success/failure
- AI response generation
- TTS processing
- Call completion

## 🔒 Security Considerations

1. **Webhook Validation**
   - Verify Exotel signatures
   - Validate request payload
   - Rate limit webhook calls

2. **Audio Security**
   - Secure file storage
   - Automatic cleanup
   - Encryption for sensitive data

3. **API Security**
   - Use environment variables
   - Implement rate limiting
   - Monitor API usage

## 🎉 Success Indicators

When everything is working:
- ✅ Users can call real number
- ✅ AI responds via phone call
- ✅ Conversation is natural
- ✅ Call quality is good
- ✅ Webhook processes reliably

## 📞 Next Steps

After setup:
1. Monitor call quality
2. Optimize AI responses
3. Add more phone numbers
4. Implement call analytics
5. Scale for multiple users

---

**Need Help?**
- Check Exotel documentation
- Review server logs
- Test webhook endpoints
- Verify environment variables 