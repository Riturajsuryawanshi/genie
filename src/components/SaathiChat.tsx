import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Send, User, Bot, Loader2, Image as ImageIcon, Brain, Sparkles, MessageCircle } from 'lucide-react';
import { chatHistoryService } from '@/services/chatHistory';
import { geminiService } from '@/services/geminiService';
import './SaathiChat.css';



interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export const SaathiChat: React.FC = () => {
  const { user } = useAuth();
  const [userInput, setUserInput] = useState('');
  // Chat history state
  const [chatHistories, setChatHistories] = useState<{id: string, title: string, messages: Message[]}[]>([]);
  const [activeChatId, setActiveChatId] = useState('current');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', text: 'Hello! I\'m SAATHI, powered by Gemini AI. How can I help you today?', isUser: false, timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [messageBox, setMessageBox] = useState<{ show: boolean; title: string; content: string }>({ show: false, title: '', content: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user?.id) {
        const history = await chatHistoryService.getChatHistory(user.id);
        setChatHistories(history);
      }
    };
    loadChatHistory();
  }, [user]);

  // When activeChatId changes, update messages
  useEffect(() => {
    if (activeChatId === 'current') {
      setMessages([{ id: 'init', text: 'Hello! I\'m SAATHI, powered by Gemini AI. How can I help you today?', isUser: false, timestamp: new Date() }]);
    } else {
      const chat = chatHistories.find(c => c.id === activeChatId);
      setMessages(chat ? chat.messages : []);
    }
  }, [activeChatId, chatHistories]);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // New chat handler
  const handleNewChat = () => {
    setActiveChatId('current');
    setMessages([{ id: 'init', text: 'Hello! I\'m SAATHI, powered by Gemini AI. How can I help you today?', isUser: false, timestamp: new Date() }]);
  };

  // Select chat from history
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    if (id === 'current') {
      setMessages([{ id: 'init', text: 'Hello! I\'m SAATHI, powered by Gemini AI. How can I help you today?', isUser: false, timestamp: new Date() }]);
    }
  };

  // Helper: user info
  const getUserName = () => {
    if (!user) return 'User';
    if (user.user_metadata && user.user_metadata.full_name) return user.user_metadata.full_name;
    if (user.user_metadata && user.user_metadata.name) return user.user_metadata.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };
  const getAvatarUrl = () => {
    if (user && user.user_metadata && user.user_metadata.avatar_url) return user.user_metadata.avatar_url;
    return null;
  };
  const getInitials = () => {
    const name = getUserName();
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Show custom message box
  const showMessageBox = (title: string, content: string) => {
    setMessageBox({ show: true, title, content });
  };
  const closeMessageBox = () => {
    setMessageBox({ show: false, title: '', content: '' });
  };



  // Handle image file selection
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImageBase64((e.target?.result as string)?.split(',')[1]);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImageBase64(null);
    }
  };
  const clearImage = () => {
    setSelectedImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };



  // Send message to backend API
  const sendMessage = async () => {
    const prompt = userInput.trim();
    if (!prompt) {
      showMessageBox('Input Required', 'Please enter a message.');
      return;
    }
    
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: prompt, isUser: true, timestamp: new Date() }
    ]);
    setUserInput('');
    setLoading(true);
    
    try {
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text || ''
      }));

      // Use Gemini service
      const result = await geminiService.sendMessage(prompt, conversationHistory);
      
      if (result.success && result.response) {
        const assistantText = result.response;
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), text: assistantText, isUser: false, timestamp: new Date() }
        ]);
        
        // Save conversation to database
        if (user?.id) {
          await chatHistoryService.saveConversation(user.id, prompt, assistantText);
          const history = await chatHistoryService.getChatHistory(user.id);
          setChatHistories(history);
        }
      } else {
        throw new Error(result.error || 'Invalid response from AI');
      }
    } catch (error) {
      let errorMsg = 'I\'m having trouble connecting right now. ';
      if (error.message.includes('Backend server not running') || error.message.includes('fetch')) {
        errorMsg = 'Backend server is offline. Please start it by running: cd backend && npm start';
      } else if (error.message.includes('429') || error.message.includes('quota')) {
        errorMsg = 'Gemini AI service temporarily unavailable due to high usage. Please try again later.';
      } else if (error.message.includes('API key')) {
        errorMsg = 'Gemini API configuration issue. Please check the API key.';
      } else {
        errorMsg += 'Please check your connection and try again.';
      }
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: errorMsg, isUser: false, timestamp: new Date() }
      ]);
      console.error('Gemini AI Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };



  return (
    <div className="flex w-full min-h-screen bg-black">
      {/* Enhanced Sidebar */}
      <aside className="w-16 hover:w-72 transition-all duration-300 bg-black border-r border-purple-500/30 flex flex-col py-6 group">
        {/* Enhanced Profile Section */}
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-purple-600 p-3 rounded-xl shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-purple-400">SAATHI</span>
              <span className="text-xs text-slate-400">AI Assistant</span>
            </div>
          </div>
        </div>
        
        <div className="px-3 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
            onClick={handleNewChat}
          >
            <MessageCircle className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 px-3 overflow-y-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="space-y-2">
            {/* Current Chat */}
            <div 
              className={`p-3 rounded-xl cursor-pointer text-sm transition-all duration-200 ${
                activeChatId === 'current' 
                  ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 border border-purple-500/50 shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-800/50 hover:border border-purple-500/30'
              }`} 
              onClick={() => handleSelectChat('current')}
            >
              <span className="truncate block font-medium">Current Chat</span>
              <span className="text-xs text-slate-400 mt-1 block">{messages.length} messages</span>
            </div>
            
            {/* Chat History */}
            {chatHistories.map((chat) => (
              <div 
                key={chat.id} 
                className={`p-3 rounded-xl cursor-pointer text-sm transition-all duration-200 ${
                  chat.id === activeChatId 
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 border border-purple-500/50 shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-800/50 hover:border border-purple-500/30'
                }`} 
                onClick={() => handleSelectChat(chat.id)}
              >
                <span className="truncate block font-medium">{chat.title}</span>
                <span className="text-xs text-slate-400 mt-1 block">{chat.messages.length} messages</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Enhanced Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Enhanced Greeting */}
        <div className="w-full text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              <span className="text-5xl font-bold text-purple-400">
                Hello, {getUserName()}
              </span>
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <p className="text-purple-300/60 text-lg font-light">How can I assist you today?</p>
          </div>
        </div>
        {/* Enhanced Chat Messages Area */}
        {messages.length > 1 && (
          <div className="w-full max-w-5xl flex flex-col max-h-[60vh] mb-8 overflow-hidden">
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
              {messages.slice(1).map((msg, idx) => (
                <div key={msg.id + idx} className={`max-w-[85%] rounded-3xl px-6 py-4 shadow-lg ${
                  msg.isUser 
                    ? 'bg-purple-600 text-white ml-auto shadow-purple-500/25' 
                    : 'bg-purple-900/30 text-purple-100 mr-auto border border-purple-500/20'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full shadow-lg ${
                      msg.isUser 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {msg.isUser ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-semibold">{msg.isUser ? 'You' : 'SAATHI'}</span>
                  </div>
                  {msg.imageUrl && (
                    <img src={`data:image/png;base64,${msg.imageUrl.split(',').pop()}`} alt="uploaded" className="rounded-2xl mb-3 max-w-full max-h-64 shadow-lg" />
                  )}
                  {msg.text && <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>}
                  <span className="text-xs opacity-70 mt-3 block text-right">{msg.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
              {/* Enhanced Loading indicator */}
              {loading && (
                <div className="max-w-[85%] rounded-3xl px-6 py-4 bg-slate-800/80 text-slate-100 mr-auto border border-purple-500/20 shadow-lg shadow-slate-900/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold">SAATHI</span>
                    <div className="flex gap-1 ml-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-slate-400 ml-auto">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Enhanced Input Area */}
        <div className="w-full max-w-4xl px-6">
          {/* Enhanced Image Preview */}
          {selectedImageBase64 && (
            <div className="mb-6 p-4 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-purple-500/30 shadow-lg">
              <div className="flex items-center gap-4">
                <span className="text-purple-300 font-semibold">Image Preview:</span>
                <img src={`data:image/png;base64,${selectedImageBase64}`} alt="Image Preview" className="rounded-xl max-w-[120px] max-h-[120px] object-contain shadow-lg" />
                <button onClick={clearImage} className="text-red-400 hover:text-red-300 ml-2 text-xl font-bold transition-colors">&times;</button>
              </div>
            </div>
          )}
          
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-3xl p-5 shadow-2xl shadow-purple-900/20">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask SAATHI anything..."
                disabled={loading}
                className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg font-light"
              />
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-purple-400 hover:text-white hover:bg-purple-600/20 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
                  title="Upload image"
                  disabled={loading}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                {(userInput.trim() || selectedImageBase64) && (
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={loading}
                    className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-purple-500/25"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Message Box Modal */}
        {messageBox.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-800/90 backdrop-blur-xl border border-purple-500/50 rounded-3xl shadow-2xl shadow-purple-900/30 p-8 max-w-md w-full mx-4 text-center">
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{messageBox.title}</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">{messageBox.content}</p>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 w-full transition-all duration-200 shadow-lg hover:shadow-purple-500/25" onClick={closeMessageBox}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};