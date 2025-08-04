import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Send, User, Bot, Loader2, Image as ImageIcon, Mic, Volume2, VolumeX, Brain } from 'lucide-react';
import './SaathiChat.css';

// IMPORTANT: Replace this with your real Gemini API key from https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = "AIzaSyDj70boDeXkCkSaUVWpvn6-mza8ckSk_hw";

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
  const [chatHistories, setChatHistories] = useState<{id: string, title: string, messages: Message[]}[]>([
    { id: '1', title: 'Chat with Saathi', messages: [
      { id: 'init', text: 'Hello! How can I help you today?', isUser: false, timestamp: new Date() }
    ] }
  ]);
  const [activeChatId, setActiveChatId] = useState('1');
  const [messages, setMessages] = useState<Message[]>(chatHistories[0].messages);
  const [loading, setLoading] = useState(false);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messageBox, setMessageBox] = useState<{ show: boolean; title: string; content: string }>({ show: false, title: '', content: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  // When activeChatId changes, update messages
  useEffect(() => {
    const chat = chatHistories.find(c => c.id === activeChatId);
    setMessages(chat ? chat.messages : []);
  }, [activeChatId, chatHistories]);

  // Save messages to active chat
  useEffect(() => {
    setChatHistories(prev => prev.map(chat =>
      chat.id === activeChatId ? { ...chat, messages } : chat
    ));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // New chat handler
  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newTitle = `New Chat ${new Date().toLocaleTimeString()}`;
    setChatHistories(prev => [
      { id: newId, title: newTitle, messages: [] },
      ...prev
    ]);
    setActiveChatId(newId);
    setMessages([]);
  };

  // Select chat from history
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
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

  // Speak text using Web Speech API
  const speakText = (text: string) => {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
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

  // Handle voice input (speech-to-text)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showMessageBox('Speech Not Supported', 'Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsRecording(true);
    recognition.start();
    recognition.onresult = (event: any) => {
      setUserInput(event.results[0][0].transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => {
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  // Send message to Gemini API
  const sendMessage = async () => {
    const prompt = userInput.trim();
    const hasImage = selectedImageBase64 !== null;
    if (!prompt && !hasImage) {
      showMessageBox('Input Required', 'Please enter a message or upload an image.');
      return;
    }
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: prompt || (hasImage ? 'Image uploaded' : ''), imageUrl: hasImage ? `data:image/png;base64,${selectedImageBase64}` : undefined, isUser: true, timestamp: new Date() }
    ]);
    setUserInput('');
    setLoading(true);
    setSelectedImageBase64(null);
    try {
      // Gemini API expects a 'contents' array with parts
      const parts: any[] = [];
      if (prompt) parts.push({ text: prompt });
      if (hasImage && selectedImageBase64) {
        parts.push({
          inlineData: {
            mimeType: 'image/png',
            data: selectedImageBase64,
          },
        });
      }
      const payload = { contents: [{ role: 'user', parts }] };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      const text = await response.text();
      const result = text ? JSON.parse(text) : null;
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const assistantText = result.candidates[0].content.parts[0].text;
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), text: assistantText, isUser: false, timestamp: new Date() },
        ]);
        speakText(assistantText);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), text: 'Error: Could not get a valid response from the AI. Please try again.', isUser: false, timestamp: new Date() },
        ]);
        console.error('Unexpected API response structure:', result);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: 'Error: Failed to connect to the AI. Please check your network connection or try again later.', isUser: false, timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-black">
      {/* Collapsible Sidebar */}
      <aside className="w-16 hover:w-64 transition-all duration-300 bg-gray-900 border-r border-purple-900/50 flex flex-col py-4 group">
        {/* Profile Section with Mute Button */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between transition-opacity">
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-2 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SAATHI</span>
            </div>
            {/* Mute Button always visible */}
            <button
              className="p-2 bg-gray-800 hover:bg-gray-700 border border-purple-600/30 rounded-lg transition-colors"
              onClick={() => setIsMuted((m) => !m)}
              title={isMuted ? 'Unmute voice' : 'Mute voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
            </button>
          </div>
        </div>
        
        <div className="px-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="w-full px-3 py-2 rounded-lg bg-gray-800 hover:bg-purple-800/50 text-white text-sm transition-colors border border-purple-600/30"
            onClick={handleNewChat}
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 px-2 overflow-y-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="space-y-1">
            {chatHistories.map((chat) => (
              <div 
                key={chat.id} 
                className={`p-2 rounded-lg cursor-pointer text-sm transition-colors ${
                  chat.id === activeChatId 
                    ? 'bg-purple-800/30 text-purple-200 border border-purple-600/50' 
                    : 'text-gray-300 hover:bg-gray-800 hover:border border-purple-600/20'
                }`} 
                onClick={() => handleSelectChat(chat.id)}
              >
                <span className="truncate block">{chat.title}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Greeting without box - Purple style */}
        <div className="w-full text-center mb-16">
          <span className="text-4xl font-normal bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Hello, {getUserName()}
          </span>
        </div>
        {/* Chat Messages Area - only show when there are messages */}
        {messages.length > 1 && (
          <div className="w-full max-w-4xl flex flex-col max-h-[60vh] mb-8 overflow-hidden">
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
              {messages.slice(1).map((msg, idx) => (
                <div key={msg.id + idx} className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.isUser 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white ml-auto' 
                    : 'bg-gray-900 text-gray-100 mr-auto border border-purple-600/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-full ${
                      msg.isUser 
                        ? 'bg-white/20' 
                        : 'bg-gradient-to-r from-purple-600 to-purple-700'
                    }`}>
                      {msg.isUser ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-xs font-medium">{msg.isUser ? 'You' : 'SAATHI'}</span>
                  </div>
                  {msg.imageUrl && (
                    <img src={`data:image/png;base64,${msg.imageUrl.split(',').pop()}`} alt="uploaded" className="rounded-lg mb-2 max-w-full max-h-60" />
                  )}
                  {msg.text && <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>}
                  <span className="text-xs opacity-60 mt-2 block text-right">{msg.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
              {/* Loading indicator */}
              {loading && (
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-900 text-gray-100 mr-auto border border-purple-600/30">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium">SAATHI</span>
                    <div className="flex gap-1 ml-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <span className="text-xs text-gray-400 ml-auto">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Purple-themed Input Area */}
        <div className="w-full max-w-3xl px-4">
          {/* Image Preview */}
          {selectedImageBase64 && (
            <div className="mb-4 p-4 bg-gray-900 rounded-2xl border border-purple-600/30">
              <div className="flex items-center gap-4">
                <span className="text-purple-300 font-medium">Image Preview:</span>
                <img src={`data:image/png;base64,${selectedImageBase64}`} alt="Image Preview" className="rounded-lg max-w-[100px] max-h-[100px] object-contain" />
                <button onClick={clearImage} className="text-red-400 hover:text-red-300 ml-2 text-lg font-bold">&times;</button>
              </div>
            </div>
          )}
          
          <div className="bg-gray-900 border border-purple-600/50 rounded-3xl p-4 shadow-lg shadow-purple-900/20">
            <div className="flex items-center gap-3">
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
                onKeyPress={handleKeyPress}
                placeholder="Ask SAATHI"
                disabled={loading}
                className="flex-1 bg-transparent text-white placeholder-purple-300/60 focus:outline-none text-lg"
              />
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-purple-400 hover:text-white hover:bg-purple-800/50 rounded-lg transition-colors"
                  title="Upload image"
                  disabled={loading}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-lg transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white' 
                      : 'text-purple-400 hover:text-white hover:bg-purple-800/50'
                  }`}
                  title="Speak"
                  disabled={isRecording || loading}
                >
                  <Mic className="w-5 h-5" />
                </button>

                {(userInput.trim() || selectedImageBase64) && (
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={loading}
                    className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Purple-themed Message Box Modal */}
        {messageBox.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-gray-900 border border-purple-600/50 rounded-2xl shadow-2xl shadow-purple-900/20 p-6 max-w-sm w-full mx-4 text-center">
              <h3 className="text-lg font-semibold mb-2 text-white">{messageBox.title}</h3>
              <p className="text-purple-200 mb-4">{messageBox.content}</p>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:from-purple-700 hover:to-purple-800 w-full transition-colors" onClick={closeMessageBox}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};