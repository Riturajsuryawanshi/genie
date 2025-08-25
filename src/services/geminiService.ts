interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiResponse {
  success: boolean;
  response?: string;
  error?: string;
  conversationId?: string;
}

export const geminiService = {
  async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[] = [],
    phoneNumber?: string
  ): Promise<GeminiResponse> {
    try {
      const response = await fetch('http://localhost:4002/api/gpt/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
          phoneNumber
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Gemini service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};