require('dotenv').config();
const { generateGeminiResponse } = require('./src/services/gemini');

async function testGemini() {
  console.log('Testing Gemini AI integration...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
  
  try {
    const result = await generateGeminiResponse('Hello, how are you?', null, {
      conversationHistory: [],
      voiceMode: 'text'
    });
    
    console.log('Result:', result);
    
    if (result.success) {
      console.log('✅ Gemini integration working!');
      console.log('Response:', result.response);
    } else {
      console.log('❌ Gemini integration failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGemini();