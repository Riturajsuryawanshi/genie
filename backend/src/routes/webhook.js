const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const whisperService = require('../services/whisper');
const gptService = require('../services/gpt');
const ttsService = require('../services/tts');

const router = express.Router();

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../../uploads');
const audioDir = path.join(uploadDir, 'audio');
const processedDir = path.join(uploadDir, 'processed');

fs.ensureDirSync(audioDir);
fs.ensureDirSync(processedDir);

// Main webhook handler for Exotel
router.post('/webhook', async (req, res) => {
  try {
    console.log('📞 Webhook received:', req.body);
    
    const { RecordingUrl, From, CallSid } = req.body;
    
    if (!RecordingUrl || !From) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: RecordingUrl or From'
      });
    }

    // Process the call
    const result = await processVoiceCall(RecordingUrl, From, CallSid);
    
    res.json({
      success: true,
      message: 'Call processed successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook',
      message: error.message
    });
  }
});

// Test endpoint for development
router.post('/test', async (req, res) => {
  try {
    const { message, phoneNumber } = req.body;
    
    if (!message || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing message or phoneNumber'
      });
    }

    console.log('🧪 Test webhook:', { message, phoneNumber });

    // Generate AI response
    const aiResponse = await gptService.generateResponse(message, phoneNumber);
    
    // Generate TTS audio
    const audioBuffer = await ttsService.generateSpeech(aiResponse);
    
    res.json({
      success: true,
      message: 'Test processed successfully',
      data: {
        userMessage: message,
        aiResponse,
        audioGenerated: !!audioBuffer
      }
    });

  } catch (error) {
    console.error('❌ Test webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Webhook service is healthy',
    timestamp: new Date().toISOString()
  });
});

// Main voice processing pipeline
async function processVoiceCall(recordingUrl, phoneNumber, callSid) {
  const sessionId = uuidv4();
  console.log(`🎯 Processing call ${sessionId} from ${phoneNumber}`);

  try {
    // Step 1: Download audio
    const audioPath = await downloadAudio(recordingUrl, sessionId);
    console.log('✅ Audio downloaded');

    // Step 2: Transcribe with Whisper
    const transcript = await whisperService.transcribeAudio(audioPath);
    console.log('✅ Audio transcribed:', transcript);

    // Step 3: Generate AI response
    const aiResponse = await gptService.generateResponse(transcript, phoneNumber);
    console.log('✅ AI response generated');

    // Step 4: Generate TTS
    const audioBuffer = await ttsService.generateSpeech(aiResponse);
    console.log('✅ TTS audio generated');

    // Step 5: Save processed audio
    const processedPath = path.join(processedDir, `${sessionId}_response.mp3`);
    await fs.writeFile(processedPath, audioBuffer);

    // Step 6: Cleanup
    await fs.remove(audioPath);
    console.log('✅ Cleanup completed');

    return {
      sessionId,
      transcript,
      aiResponse,
      processedAudioPath: processedPath
    };

  } catch (error) {
    console.error(`❌ Processing failed for ${sessionId}:`, error);
    throw error;
  }
}

// Download audio from URL
async function downloadAudio(url, sessionId) {
  const audioPath = path.join(audioDir, `${sessionId}_input.wav`);
  
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(audioPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(audioPath));
    writer.on('error', reject);
  });
}

module.exports = router;