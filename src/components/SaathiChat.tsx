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
    <div className="flex w-full min-h-[80vh] bg-black">
      {/* Collapsible left sidebar: collapsed by default, expands on hover */}
      <aside
        className={`h-full transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64 min-w-[200px] max-w-[280px]' : 'w-16 min-w-[64px]'} bg-black border-r border-neutral-800 flex flex-col items-center py-6 relative`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Saathi Logo at absolute top left */}
        <div className="absolute top-4 left-1 flex items-center justify-center w-10 h-10">
          <Brain className="h-8 w-8 text-indigo-400" title="Saathi" />
        </div>
        {/* Only show content if sidebar is open */}
        {sidebarOpen && (
          <>
            <div className="mt-12" />
            {/* New Chat Button */}
            <button className="w-11/12 py-2 mb-4 rounded-lg bg-[#a8edea] text-neutral-900 font-semibold shadow hover:bg-[#b6f0f2] transition" onClick={handleNewChat}>+ New Chat</button>
            {/* Chat History */}
            <div className="w-full px-4 flex-1 overflow-y-auto hide-scrollbar">
              <h2 className="text-lg font-bold mb-2 text-neutral-200">History</h2>
              <ul className="space-y-2">
                {chatHistories.map(chat => (
                  <li key={chat.id} className={`p-2 rounded-lg cursor-pointer font-medium transition ${chat.id === activeChatId ? 'bg-[#fed6e3]/80 text-indigo-700' : 'bg-neutral-900/60 hover:bg-[#fed6e3]/60 text-neutral-200'}`} onClick={() => handleSelectChat(chat.id)}>
                    {chat.title}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </aside>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        {/* Mute/Unmute Button */}
        <button
          className="absolute top-4 right-8 z-20 bg-neutral-800 border border-neutral-700 rounded-full p-2 shadow hover:bg-neutral-700 transition"
          onClick={() => setIsMuted((m) => !m)}
          title={isMuted ? 'Unmute voice' : 'Mute voice'}
        >
          {isMuted ? <VolumeX className="w-6 h-6 text-red-400" /> : <Volume2 className="w-6 h-6 text-indigo-400" />}
        </button>
        {/* Heyy, UserName at the top of chat with animation */}
        <div className="w-full max-w-2xl text-center mt-8 mb-2">
          <span className="text-2xl font-bold text-white animate-heyy-greeting inline-block">Heyy, {getUserName()}</span>
        </div>
        {/* Chat Container */}
        <div className="w-full max-w-2xl flex flex-col h-[70vh] bg-black">
          {/* Messages with vertical scrollbar and custom black scrollbar */}
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto custom-black-scrollbar" style={{ minHeight: 0 }}>
            {messages.map((msg, idx) => (
              <div key={msg.id + idx} className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${msg.isUser ? 'bg-indigo-500/80 text-white ml-auto' : 'bg-neutral-800/80 text-neutral-100 mr-auto'} relative`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.isUser ? (
                    <User className="h-4 w-4 opacity-80" />
                  ) : (
                    <Bot className="h-4 w-4 text-indigo-400" />
                  )}
                  <span className="text-xs opacity-60">{msg.isUser ? 'You' : 'SAATHI'}</span>
                </div>
                {msg.imageUrl && (
                  <img src={`data:image/png;base64,${msg.imageUrl.split(',').pop()}`} alt="uploaded" className="rounded-lg mb-2 max-w-full max-h-60" />
                )}
                {msg.text && <div className="text-sm whitespace-pre-wrap">{msg.text}</div>}
                <span className="text-xs opacity-40 mt-2 block text-right">{msg.timestamp.toLocaleTimeString()}</span>
              </div>
            ))}
            {/* Thinking animation when loading */}
            {loading && (
              <div className="max-w-[75%] rounded-2xl px-4 py-3 shadow-md bg-neutral-800/80 text-neutral-100 mr-auto relative flex items-center gap-2">
                <Bot className="h-4 w-4 text-indigo-400" />
                <span className="text-xs opacity-60">SAATHI</span>
                <span className="ml-2 flex gap-1">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </span>
                <span className="text-xs opacity-40 mt-2 block text-right">Thinking...</span>
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
          {/* Input Area */}
          <div className="flex items-center gap-2 p-0 mt-2">
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
              className="rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 px-2 py-2 font-semibold flex items-center gap-2"
              title="Upload image"
              disabled={loading}
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`rounded-lg ${isRecording ? 'bg-indigo-400' : 'bg-neutral-800'} border border-neutral-700 text-neutral-200 px-2 py-2 font-semibold flex items-center gap-2`}
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
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 rounded-lg border border-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-neutral-800 text-neutral-200"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || (!userInput.trim() && !selectedImageBase64)}
              className="rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 font-semibold flex items-center gap-2 disabled:opacity-50"
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