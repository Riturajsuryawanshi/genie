const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI response using Gemini with enhanced voice-to-voice features
 * @param {string} userMessage - User's message
 * @param {string} phoneNumber - User's phone number (optional)
 * @param {Object} options - Additional options for enhanced chat
 * @returns {Promise<{ success: boolean, response?: string, error?: string }>}
 */
async function generateGeminiResponse(userMessage, phoneNumber = null, options = {}) {
  try {
    const { conversationHistory = [], voiceMode = 'text', userContext = {} } = options;
    
    // Get user context from database if phone number provided
    let dbUserContext = null;
    if (phoneNumber && !userContext.name) {
      dbUserContext = await getUserContext(phoneNumber);
    }
    
    const finalUserContext = {
      name: userContext.name || dbUserContext?.name || 'User',
      phoneNumber: phoneNumber || 'Unknown',
      preferences: dbUserContext?.preferences || {}
    };

    // Build enhanced system prompt for SAATHI
    const systemPrompt = `You are SAATHI, an advanced AI assistant for CallGenie, designed for natural conversations.

User Context:
- Name: ${finalUserContext.name}
- Phone: ${finalUserContext.phoneNumber}
- Mode: ${voiceMode === 'voice' ? 'Voice Conversation' : 'Text Chat'}

Instructions:
1. Be conversational, friendly, and engaging
2. Keep responses natural and helpful
3. Use a warm, professional tone
4. Keep responses concise (50-100 words) for better readability
5. Show enthusiasm and personality in your responses
6. Ask follow-up questions when appropriate
7. If asked about CallGenie services, provide helpful information
8. Use conversational phrases naturally
9. If unsure, ask clarifying questions politely
10. Remember context from the conversation history

Previous conversation context:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current user message: "${userMessage}"

Respond naturally as SAATHI:`;

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate response
    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return { 
        success: false, 
        error: 'Failed to generate response from Gemini' 
      };
    }

    // Save conversation log if user context is available
    if (dbUserContext?.id) {
      await saveConversationLog(dbUserContext.id, userMessage, text);
    }

    return { 
      success: true, 
      response: text.trim(),
      userId: dbUserContext?.id,
      conversationId: Date.now().toString()
    };

  } catch (error) {
    console.error('Gemini response generation error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to generate response from Gemini' 
    };
  }
}

/**
 * Get user context from MongoDB
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<Object>}
 */
async function getUserContext(phoneNumber) {
  try {
    const user = await User.findOne({ phone: phoneNumber })
      .select('_id name email phone preferences');

    if (!user) {
      console.log('User not found for phone:', phoneNumber);
      return null;
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone,
      preferences: user.preferences || {}
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return null;
  }
}

/**
 * Save conversation log to MongoDB
 * @param {string} userId - User ID
 * @param {string} userMessage - User's message
 * @param {string} aiResponse - AI's response
 * @returns {Promise<boolean>}
 */
async function saveConversationLog(userId, userMessage, aiResponse) {
  try {
    const conversation = new Conversation({
      userId,
      userMessage,
      aiResponse,
      createdAt: new Date()
    });

    await conversation.save();
    return true;
  } catch (error) {
    console.error('Error saving conversation log:', error);
    return false;
  }
}

module.exports = { 
  generateGeminiResponse, 
  saveConversationLog, 
  getUserContext
};