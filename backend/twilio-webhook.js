const express = require('express');
const router = express.Router();
const { transcribeFromUrl } = require('./src/services/whisper');
const { generateResponse } = require('./src/services/gpt');
const { generateSpeech } = require('./src/services/tts');

/**
 * POST /twilio/webhook - Handle incoming calls from Twilio
 * Expected payload from Twilio:
 * {
 *   "CallSid": "CA1234567890",
 *   "From": "+1234567890",
 *   "To": "+1-234-567-8900",
 *   "RecordingUrl": "https://api.twilio.com/2010-04-01/Accounts/AC.../Recordings/RE...",
 *   "RecordingDuration": "30",
 *   "CallStatus": "completed"
 * }
 */
router.post('/webhook', async (req, res) => {
  try {
    console.log('📞 Received Twilio webhook:', req.body);
    
    const {
      CallSid,
      From: callerNumber,
      To: calledNumber,
      RecordingUrl,
      RecordingDuration,
      CallStatus
    } = req.body;

    // Validate required fields
    if (!CallSid || !callerNumber || !RecordingUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: CallSid, From, or RecordingUrl'
      });
    }

    // Only process completed calls
    if (CallStatus !== 'completed') {
      return res.status(200).json({
        success: true,
        message: 'Call not completed, skipping processing'
      });
    }

    console.log('🎯 Processing Twilio call:', {
      callId: CallSid,
      caller: callerNumber,
      called: calledNumber,
      recordingUrl: RecordingUrl,
      duration: RecordingDuration
    });

    // Step 1: Download and transcribe audio
    console.log('🔊 Step 1: Transcribing audio...');
    const transcriptionResult = await transcribeFromUrl(RecordingUrl, `./uploads/twilio_${CallSid}.mp3`);
    
    if (!transcriptionResult.success) {
      console.error('❌ Transcription failed:', transcriptionResult.error);
      return res.status(500).json({
        success: false,
        error: 'Audio transcription failed',
        details: transcriptionResult.error
      });
    }

    const userMessage = transcriptionResult.text;
    console.log('📝 Transcribed text:', userMessage);

    // Step 2: Generate AI response
    console.log('🤖 Step 2: Generating AI response...');
    const gptResult = await generateResponse(userMessage, callerNumber);
    
    if (!gptResult.success) {
      console.error('❌ GPT response failed:', gptResult.error);
      return res.status(500).json({
        success: false,
        error: 'AI response generation failed',
        details: gptResult.error
      });
    }

    const aiResponse = gptResult.response;
    console.log('💬 AI Response:', aiResponse);

    // Step 3: Convert response to speech
    console.log('🔊 Step 3: Converting to speech...');
    const ttsResult = await generateSpeech(aiResponse, `./uploads/tts_${CallSid}.mp3`, 'nova');
    
    if (!ttsResult.success) {
      console.error('❌ TTS failed:', ttsResult.error);
      return res.status(500).json({
        success: false,
        error: 'Text-to-speech conversion failed',
        details: ttsResult.error
      });
    }

    // Return success response
    const response = {
      success: true,
      callId: CallSid,
      caller: callerNumber,
      called: calledNumber,
      transcription: userMessage,
      aiResponse: aiResponse,
      audioFile: ttsResult.filePath,
      duration: ttsResult.duration,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Twilio webhook processing completed successfully');
    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Twilio webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /twilio/health - Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SAATHI Twilio webhook service is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /twilio/test - Test endpoint for development
 */
router.post('/test', async (req, res) => {
  try {
    const { message, phoneNumber } = req.body;
    
    if (!message || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing message or phoneNumber'
      });
    }

    console.log('🧪 Test Twilio webhook:', { message, phoneNumber });

    // Generate AI response
    const gptResult = await generateResponse(message, phoneNumber);
    
    if (!gptResult.success) {
      return res.status(500).json({
        success: false,
        error: gptResult.error
      });
    }

    // Generate speech
    const timestamp = Date.now();
    const ttsPath = `./uploads/test_twilio_tts_${timestamp}.mp3`;
    const ttsResult = await generateSpeech(gptResult.response, ttsPath);

    if (!ttsResult.success) {
      return res.status(500).json({
        success: false,
        error: ttsResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: `AI response to: "${message}"`,
      caller: phoneNumber,
      aiResponse: gptResult.response,
      audioFile: ttsPath,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Test webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      details: error.message
    });
  }
});

module.exports = router; 