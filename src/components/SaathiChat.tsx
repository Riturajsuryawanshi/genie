import React, { useState, useRef, useEffect } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const result = await response.json();
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
    <div className="flex w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 relative overflow-hidden">

      {/* Fixed Header with SAATHI text and New Chat button */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SAATHI
            </span>
            <div className="text-xs text-purple-300/60 -mt-1">AI Voice Assistant</div>
          </div>
        </div>
        <button 
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg text-sm"
          onClick={handleNewChat}
        >
          + New Chat
        </button>
      </div>
      
      {/* Collapsible left sidebar: collapsed by default, expands on hover */}
      <aside
        className={`h-screen ${sidebarOpen ? 'w-72 min-w-[288px]' : 'w-16 min-w-[64px]'} bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 relative mt-20 shadow-2xl`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Only show content if sidebar is open */}
        {sidebarOpen && (
          <>
            {/* Chat History */}
            <div className="w-full px-4 flex-1 overflow-y-auto hide-scrollbar">
              <h2 className="text-xl font-bold mb-4 text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Chat History</h2>
              <ul className="space-y-3">
                {chatHistories.map((chat, index) => (
                  <li 
                    key={chat.id} 
                    className={`p-4 rounded-xl cursor-pointer font-medium ${
                      chat.id === activeChatId 
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-400/30 shadow-lg shadow-indigo-500/20' 
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-transparent hover:border-white/20'
                    }`} 
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        chat.id === activeChatId ? 'bg-indigo-400' : 'bg-gray-500'
                      }`}></div>
                      <span className="truncate">{chat.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </aside>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full mt-20">
        {/* Mute/Unmute Button */}
        <button
          className="absolute top-6 right-8 z-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-3 shadow-lg hover:bg-white/20"
          onClick={() => setIsMuted((m) => !m)}
          title={isMuted ? 'Unmute voice' : 'Mute voice'}
        >
          {isMuted ? <VolumeX className="w-6 h-6 text-red-400" /> : <Volume2 className="w-6 h-6 text-indigo-400" />}
        </button>
        {/* Enhanced greeting with animation */}
        <div className="w-full max-w-4xl text-center mt-8 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Hello, {getUserName()}! 👋
              </span>
              <p className="text-purple-300/80 mt-2">How can I assist you today?</p>
            </div>
          </div>
        </div>
        {/* Chat Container */}
        <div className="w-full max-w-4xl flex flex-col h-[65vh] bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Messages with enhanced styling */}
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto" style={{ minHeight: 0, scrollbarWidth: 'thin', scrollbarColor: '#6366f1 transparent' }}>
            {messages.map((msg, idx) => (
              <div key={msg.id + idx} className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-lg ${
                msg.isUser 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white ml-auto shadow-indigo-500/30' 
                  : 'bg-white/10 backdrop-blur-xl text-white mr-auto border border-white/20 shadow-purple-500/20'
              } relative overflow-hidden`}>
                {/* Message glow effect */}
                <div className={`absolute inset-0 opacity-20 ${
                  msg.isUser 
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
                    : 'bg-gradient-to-r from-purple-400 to-pink-400'
                } blur-xl`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${
                      msg.isUser 
                        ? 'bg-white/20' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
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
                    <img src={`data:image/png;base64,${msg.imageUrl.split(',').pop()}`} alt="uploaded" className="rounded-xl mb-3 max-w-full max-h-60 shadow-lg" />
                  )}
                  {msg.text && <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>}
                  <span className="text-xs opacity-60 mt-3 block text-right">{msg.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            {/* Enhanced thinking animation when loading */}
            {loading && (
              <div className="max-w-[80%] rounded-2xl px-6 py-4 shadow-lg bg-white/10 backdrop-blur-xl text-white mr-auto border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl opacity-50"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold">SAATHI</span>
                  <div className="flex gap-1 ml-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"></div>
                  </div>
                  <span className="text-xs opacity-60 ml-auto">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Image Preview */}
          {selectedImageBase64 && (
            <div className="bg-neutral-800 p-4 flex items-center gap-4 border-t border-neutral-700">
              <span className="text-neutral-200 font-medium">Image Preview:</span>
              <img src={`data:image/png;base64,${selectedImageBase64}`} alt="Image Preview" className="rounded-lg max-w-[100px] max-h-[100px] object-contain" />
              <button onClick={clearImage} className="text-red-400 hover:text-red-600 ml-2 text-lg font-bold">&times;</button>
            </div>
          )}
          {/* Enhanced Input Area */}
          <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-xl border-t border-white/10">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 font-semibold flex items-center gap-2 shadow-lg"
              title="Upload image"
              disabled={loading}
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`rounded-xl border border-white/20 text-white p-3 font-semibold flex items-center gap-2 shadow-lg ${
                isRecording 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              title="Speak"
              disabled={isRecording || loading}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to SAATHI..."
              disabled={loading}
              className="flex-1 rounded-xl border border-white/20 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/50 hover:bg-white/15"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || (!userInput.trim() && !selectedImageBase64)}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 font-semibold flex items-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {/* Custom Message Box Modal */}
        {messageBox.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
              <h3 className="text-xl font-bold mb-2 text-neutral-900">{messageBox.title}</h3>
              <p className="text-neutral-700 mb-4">{messageBox.content}</p>
              <button className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition-all w-full" onClick={closeMessageBox}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};