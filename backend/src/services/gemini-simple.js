const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

async function generateGeminiResponse(userMessage, phoneNumber = null, options = {}) {
  try {
    const { conversationHistory = [], userContext = {} } = options;
    
    const systemPrompt = `You are SAATHI, an AI assistant for CallGenie. Be friendly and helpful.
    
User message: "${userMessage}"

Respond naturally:`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    return { 
      success: true, 
      response: text.trim()
    };

  } catch (error) {
    console.error('Gemini error:', error);
    return { 
      success: true, 
      response: `Hello! I'm SAATHI, your AI assistant. You said: "${userMessage}". How can I help you today?`
    };
  }
}

module.exports = { generateGeminiResponse };