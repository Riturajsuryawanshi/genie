const http = require('http');
const url = require('url');
require('dotenv').config();

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Health check
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'SAATHI Backend API is running',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Auth endpoints
  if (path.startsWith('/api/auth/phone/')) {
    const userId = path.split('/').pop();
    // Handle case when no user ID is provided or it's undefined
    if (!userId || userId === 'undefined' || userId === 'null') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      phone_number: '+18786887943',
      message: 'Real Twilio CallGenie number for unauthenticated user'
    }));
    return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      phone_number: '+18786887943',
      message: 'Real Twilio CallGenie number'
    }));
    return;
  }

  // Handle /api/auth/phone without user ID
  if (path === '/api/auth/phone') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      phone_number: '+18786887943',
      message: 'Real Twilio CallGenie number for unauthenticated user'
    }));
    return;
  }

  if (path.startsWith('/api/auth/user/')) {
    const userId = path.split('/').pop();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      user: {
        id: userId,
        email: 'test@example.com',
        full_name: 'Test User',
        account_status: 'active'
      }
    }));
    return;
  }

  if (path.startsWith('/api/auth/usage/')) {
    const userId = path.split('/').pop();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      usage: {
        calls_made: 5,
        minutes_used: 30,
        ai_response_rate: 95
      }
    }));
    return;
  }

  if (path.startsWith('/api/auth/plan/')) {
    const userId = path.split('/').pop();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      plan: {
        plan_name: 'Basic',
        status: 'active',
        features: ['voice_calls', 'ai_assistant']
      }
    }));
    return;
  }

  // GET /api/auth/activity/:userId - Get user's activity
  if (path.startsWith('/api/auth/activity/') && req.method === 'GET') {
    const userId = path.split('/').pop();
    
    // Handle undefined or invalid userId
    if (!userId || userId === 'undefined' || userId === 'null') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        activity: [],
        message: 'No user ID provided'
      }));
      return;
    }
    
    // Mock response - in real app, this would query the database
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      activity: [
        {
          id: '1',
          type: 'call',
          timestamp: new Date().toISOString(),
          duration: 120,
          phoneNumber: '+1234567890'
        },
        {
          id: '2',
          type: 'chat',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          message: 'Hello, how can I help you?'
        }
      ],
      userId: userId
    }));
    return;
  }

  // POST /api/auth/onboard - assign phone number to user
  if (path === '/api/auth/onboard' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { user_id } = JSON.parse(body);
        console.log('Onboarding user:', user_id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          phone_number: '+18786887943',
          message: 'Real Twilio phone number assigned successfully'
        }));
      } catch (error) {
        console.error('Onboard error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false, 
          error: 'Invalid request body'
        }));
      }
    });
    return;
  }

  // POST /api/gpt/chat - AI chat endpoint
  if (path === '/api/gpt/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { message, conversationHistory, voiceMode, userContext } = JSON.parse(body);
        
        // Simulate AI response
    const responses = [
      `I understand you said: "${message}". That's interesting! How can I help you with that?`,
      `You mentioned: "${message}". I'd love to help you with that. What specific information are you looking for?`,
      `Great question about: "${message}". Let me think about the best way to help you with this.`,
      `Thank you for sharing: "${message}". How can I assist you further with this topic?`,
      `I caught that you said: "${message}". This sounds important. What would you like to know more about?`
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          response: response
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid request body'
        }));
      }
    });
    return;
  }

  // POST /api/stt/transcribe - Speech to text endpoint
  if (path === '/api/stt/transcribe' && req.method === 'POST') {
    // For now, return a mock transcription
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      text: 'Hello, this is a test transcription from the voice assistant.'
    }));
    return;
  }

  // GET /api/tts/voices - Get available TTS voices
  if (path === '/api/tts/voices' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      voices: [
        { id: 'alloy', name: 'Alloy', provider: 'openai' },
        { id: 'echo', name: 'Echo', provider: 'openai' },
        { id: 'fable', name: 'Fable', provider: 'openai' },
        { id: 'onyx', name: 'Onyx', provider: 'openai' },
        { id: 'nova', name: 'Nova', provider: 'openai' },
        { id: 'shimmer', name: 'Shimmer', provider: 'openai' }
      ]
    }));
    return;
  }

  // POST /api/tts/synthesize - Text to speech endpoint
  if (path === '/api/tts/synthesize' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { text, voice, provider } = JSON.parse(body);
        
        // For now, return a mock audio response
        // In a real implementation, this would call OpenAI TTS API
        res.writeHead(200, { 
          'Content-Type': 'audio/mpeg',
          'Content-Length': '0'
        });
        res.end();
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid request body'
        }));
      }
    });
    return;
  }

  // POST /api/call - Make a call endpoint
  if (path === '/api/call' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { phoneNumber, to } = JSON.parse(body);
        const targetNumber = phoneNumber || to; // Handle both field names
        
        // Use Twilio for real calls
        try {
          const twilio = require('twilio');
          const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          
          client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml', // You can replace this with your TwiML
            to: targetNumber,
            from: '+18786887943', // Your Twilio number
            record: true
          })
          .then(call => {
            console.log('Twilio call initiated:', call.sid);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              message: `Real Twilio call initiated to ${targetNumber}`,
              sid: call.sid
            }));
          })
          .catch(error => {
            console.error('Twilio call error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: 'Failed to initiate Twilio call: ' + error.message
            }));
          });
        } catch (twilioError) {
          console.error('Twilio setup error:', twilioError);
          // Fallback to mock call if Twilio fails
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: `Mock call initiated to ${targetNumber} (Twilio not configured)`,
            sid: 'mock_call_' + Date.now()
          }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid request body'
        }));
      }
    });
    return;
  }

  // POST /api/webhook/webhook - Handle incoming calls from Exotel
  if (path === '/api/webhook/webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { CallSid, From, To, RecordingUrl, RecordingDuration, CallStatus } = JSON.parse(body);
        
        console.log('Received webhook:', { CallSid, From, To, RecordingUrl, CallStatus });
        
        // Simulate call processing
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          callId: CallSid,
          caller: From,
          called: To,
          message: 'Call processed successfully',
          aiResponse: 'Hello! This is SAATHI, your AI assistant. How can I help you today?',
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid webhook payload'
        }));
      }
    });
    return;
  }

  // POST /api/webhook/test - Test webhook endpoint
  if (path === '/api/webhook/test' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { message, phoneNumber } = JSON.parse(body);
        
        console.log('Test webhook:', { message, phoneNumber });
        
        // Simulate AI response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
      success: true, 
          message: `AI response to: "${message}"`,
          caller: phoneNumber,
          aiResponse: `Hello! I received your message: "${message}". This is SAATHI, your AI assistant. How can I help you today?`,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid test payload'
        }));
      }
    });
    return;
  }

  // POST /api/twilio/test - Test Twilio webhook endpoint
  if (path === '/api/twilio/test' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { message, phoneNumber } = JSON.parse(body);
        
        console.log('🧪 Test Twilio webhook:', { message, phoneNumber });
        
        // Simulate AI response for Twilio
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `AI response to: "${message}"`,
          caller: phoneNumber,
          aiResponse: `Hello! I received your message: "${message}". This is SAATHI, your AI assistant powered by Twilio. How can I help you today?`,
          timestamp: new Date().toISOString()
        }));
  } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
      success: false, 
          error: 'Invalid Twilio test payload'
        }));
      }
    });
    return;
  }

  // POST /api/twilio/webhook - Handle incoming calls from Twilio
  if (path === '/api/twilio/webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { CallSid, From, To, RecordingUrl, RecordingDuration, CallStatus } = JSON.parse(body);
        
        console.log('📞 Received Twilio webhook:', { CallSid, From, To, RecordingUrl, CallStatus });
        
        // Simulate call processing for Twilio
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
    success: true,
          callId: CallSid,
          caller: From,
          called: To,
          message: 'Twilio call processed successfully',
          aiResponse: 'Hello! This is SAATHI, your AI assistant powered by Twilio. How can I help you today?',
    timestamp: new Date().toISOString()
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid Twilio webhook payload'
        }));
      }
    });
    return;
  }

  // 404 for everything else
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: false,
    error: 'Endpoint not found'
  }));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 SAATHI Backend API running on port ${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
}); 