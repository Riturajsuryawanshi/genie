import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  text?: string;
  imageUrl?: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export const chatHistoryService = {
  // Save a conversation to database
  async saveConversation(userId: string, userMessage: string, aiResponse: string) {
    try {
      const { error } = await supabase
        .from('conversation_logs')
        .insert({
          user_id: userId,
          user_message: userMessage,
          ai_response: aiResponse,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  },

  // Get user's chat history
  async getChatHistory(userId: string): Promise<ChatHistory[]> {
    try {
      const { data, error } = await supabase
        .from('conversation_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Group conversations by date
      const groupedChats: { [key: string]: ChatHistory } = {};
      
      data?.forEach((log) => {
        const date = new Date(log.created_at).toDateString();
        const chatId = date;
        
        if (!groupedChats[chatId]) {
          groupedChats[chatId] = {
            id: chatId,
            title: `Chat - ${new Date(log.created_at).toLocaleDateString()}`,
            messages: [],
            created_at: log.created_at,
            updated_at: log.created_at,
          };
        }

        // Add user message
        groupedChats[chatId].messages.push({
          id: `${log.id}-user`,
          text: log.user_message,
          isUser: true,
          timestamp: new Date(log.created_at),
        });

        // Add AI response
        groupedChats[chatId].messages.push({
          id: `${log.id}-ai`,
          text: log.ai_response,
          isUser: false,
          timestamp: new Date(log.created_at),
        });
      });

      return Object.values(groupedChats);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  },
};