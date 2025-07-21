# Twilio Setup for CallGenie

Complete guide to set up Twilio for real phone calls with your AI assistant.

## 🎯 Quick Start (5 Minutes)

### Step 1: Sign Up for Twilio
1. **Visit**: [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. **Create Account**: Use your email
3. **Verify Phone**: Enter your phone number
4. **Get Free Credit**: $15-20 free credit

### Step 2: Get Your Credentials
1. **Go to**: [console.twilio.com](https://console.twilio.com)
2. **Find Account SID**: Starts with `AC...`
3. **Find Auth Token**: Your auth token
4. **Buy Phone Number**: $1/month

### Step 3: Update Environment
```bash
# In backend/.env
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1-234-567-8900
```

### Step 4: Deploy Backend
```bash
# Deploy to Railway
railway login
railway init
railway up
```

### Step 5: Configure Webhook
1. **In Twilio Console**: Phone Numbers → Manage → Active numbers
2. **Click your number**
3. **Set webhook URL**: `https://your-app.railway.app/api/twilio/webhook`
4. **Set HTTP method**: POST

## 📞 Detailed Setup

### 1. Twilio Account Setup

#### 1.1 Create Account
- Visit [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
- Click "Sign up for free"
- Enter your email and password
- Verify your phone number

#### 1.2 Get Free Credit
- You'll receive $15-20 free credit
- This covers phone number and usage costs
- No credit card required for trial

### 2. Purchase Phone Number

#### 2.1 Buy Number
1. **Go to**: [console.twilio.com](https://console.twilio.com)
2. **Navigate**: Phone Numbers → Manage → Buy a number
3. **Select Country**: Choose your country
4. **Choose Number**: Pick from available numbers
5. **Complete Purchase**: $1/month per number

#### 2.2 Number Types
- **Local**: Area code specific
- **Toll-free**: Free for callers (US only)
- **National**: Country-wide

### 3. Get API Credentials

#### 3.1 Account SID
- **Location**: Twilio Console → Dashboard
- **Format**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Copy**: Your Account SID

#### 3.2 Auth Token
- **Location**: Twilio Console → Dashboard
- **Format**: Long string of characters
- **Copy**: Your Auth Token

#### 3.3 Phone Number
- **Location**: Phone Numbers → Manage → Active numbers
- **Format**: `+1-234-567-8900`
- **Note**: Your purchased number

### 4. Configure Environment Variables

#### 4.1 Update backend/.env
```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1-234-567-8900

# Server Configuration
PORT=4000
NODE_ENV=production

# OpenAI Configuration (for AI)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_TTS_MODEL=tts-1
OPENAI_WHISPER_MODEL=whisper-1
```

### 5. Deploy Backend

#### 5.1 Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### 5.2 Get Production URL
- **Your URL**: `https://your-app-name.railway.app`
- **Webhook URL**: `https://your-app-name.railway.app/api/twilio/webhook`

### 6. Configure Twilio Webhook

#### 6.1 Set Webhook URL
1. **Go to**: Twilio Console → Phone Numbers → Manage → Active numbers
2. **Click**: Your phone number
3. **Set webhook URL**: `https://your-app-name.railway.app/api/twilio/webhook`
4. **Set HTTP method**: POST
5. **Save**: Configuration

#### 6.2 Enable Recording
1. **In phone number settings**
2. **Enable**: Call recording
3. **Set**: Recording status callback URL
4. **Save**: Settings

## 🧪 Testing

### Test Webhook Locally
```bash
# Test webhook endpoint
curl -X POST http://localhost:4000/api/twilio/test \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello SAATHI",
    "phoneNumber": "+1234567890"
  }'
```

### Test Real Call
1. **Call your Twilio number**
2. **Speak**: "Hello SAATHI"
3. **Wait**: For AI response
4. **Verify**: AI responds via phone call

## 📊 Monitoring

### Check Twilio Logs
1. **Go to**: Twilio Console → Monitor → Logs
2. **Filter**: By your phone number
3. **Monitor**: Call status and webhook delivery

### Check Railway Logs
```bash
# View deployment logs
railway logs

# Check for errors
railway logs --follow
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Calls
- **Check**: Webhook URL is correct
- **Verify**: Server is accessible
- **Test**: Webhook endpoint manually

#### 2. Audio Processing Fails
- **Check**: OpenAI API key
- **Verify**: File permissions
- **Monitor**: Server logs

#### 3. Call Quality Issues
- **Check**: Twilio number configuration
- **Verify**: Recording settings
- **Test**: With different devices

### Debug Commands
```bash
# Test webhook locally
curl -X POST http://localhost:4000/api/twilio/test \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "phoneNumber": "+1234567890"}'

# Check Railway logs
railway logs

# Test phone number endpoint
curl http://localhost:4000/api/auth/phone/your-user-id
```

## 💰 Cost Breakdown

### Twilio Costs
- **Phone Number**: $1/month
- **Incoming Calls**: $0.0085/minute
- **Recording**: $0.0025/minute
- **Free Trial**: $15-20 credit

### Example Monthly Cost
- **100 calls/month**: ~$10-15
- **500 calls/month**: ~$25-35
- **1000 calls/month**: ~$45-60

## 🚀 Production Checklist

### ✅ Account Setup
- [ ] Twilio account created
- [ ] Phone number purchased
- [ ] API credentials obtained

### ✅ Backend Deployment
- [ ] Environment variables set
- [ ] Backend deployed to Railway
- [ ] Webhook URL configured

### ✅ Testing
- [ ] Webhook endpoint tested
- [ ] Real call tested
- [ ] AI response verified

### ✅ Monitoring
- [ ] Logs configured
- [ ] Error handling set up
- [ ] Performance monitored

## 🎉 Success Indicators

When everything works:
- ✅ Users can call your Twilio number
- ✅ AI responds via phone call
- ✅ Conversation is natural
- ✅ Call quality is good
- ✅ Webhook processes reliably

## 📞 Next Steps

After setup:
1. **Monitor call quality**
2. **Optimize AI responses**
3. **Add more phone numbers**
4. **Implement call analytics**
5. **Scale for multiple users**

---

**Need Help?**
- Check [Twilio Documentation](https://www.twilio.com/docs)
- Review server logs
- Test webhook endpoints
- Verify environment variables 
