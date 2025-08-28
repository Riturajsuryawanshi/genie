import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Copy, CheckCircle, Loader2, Sparkles, Star, Shield, Headphones, MessageCircle, Play, ArrowRight, Users, Clock, Bot, Zap, HelpCircle, Settings, BarChart3, Send, Minimize2, Maximize2, Video, FileText, Download, TrendingUp, Calendar, Globe, Brain, Mic, UserCircle, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getCallGenieNumber } from '@/utils/config';

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  copyNumber: () => void;
}

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const Dashboard = ({ activeTab, setActiveTab, copyNumber }: DashboardProps) => {
  const [showCallGenie, setShowCallGenie] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(0);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, text: "👋 Hi! I'm here to help you with CallGenie. Ask me anything about our AI calling assistant!", isUser: false, timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: '', email: '', phoneNumber: '' });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const smartResponses: { [key: string]: string } = {
    'hello': "Hello! I'm here to help you with CallGenie. What would you like to know?",
    'hi': "Hi there! How can I assist you with CallGenie today?",
    'how does it work': "CallGenie works by giving you a phone number that people can call. Our AI answers and can have natural conversations about any topic over the phone!",
    'what is callgenie': "CallGenie is an AI calling assistant powered by advanced language models. People can call your number and have conversations with AI about anything - questions, help, information, or just chat!",
    'pricing': "We offer flexible pricing plans starting from $29/month. You get unlimited calls, advanced AI responses, and detailed analytics. Would you like to try our free trial?",
    'free trial': "Yes! We offer a 7-day free trial with full access to all features. No credit card required. Would you like me to help you get started?",
    'setup': "Setting up CallGenie is super easy! Just click 'Try CallGenie Now' and you'll get your phone number in under 60 seconds. The AI is ready to take calls immediately!",
    'languages': "CallGenie supports 50+ languages and can automatically detect the caller's language. It works great for international users!",
    'accuracy': "Our AI has a 98.7% accuracy rate and uses the latest language models. It can handle complex questions, provide detailed answers, and maintain natural conversations.",
    'support': "I'm here to help! You can also email us at support@callgenie.com or schedule a demo call. What specific question do you have?",
    'demo': "Great! You can try CallGenie right now by clicking the 'Try CallGenie Now' button. You'll get a phone number instantly and can test it yourself!",
    'features': "CallGenie offers: 🎯 Natural AI conversations, 🌍 50+ languages, 📊 Call analytics, 🔒 Enterprise security, ⚡ Instant setup, 📱 Mobile-friendly dashboard, and much more!",
    'cost': "CallGenie starts at $29/month with unlimited calls and full features. We also offer a free 7-day trial to test everything out!",
    'phone number': "You get a dedicated phone number that anyone can call to talk with AI. The number is yours to keep and share!",
    'ai': "Our AI is powered by advanced language models and can discuss virtually any topic, answer questions, and help with various tasks.",
    'default': "That's a great question! CallGenie is designed to handle any type of conversation - from simple questions to complex discussions. Our AI can talk about virtually any topic over the phone. What specific use case are you thinking about?"
  };

  const getSmartResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(smartResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return smartResponses.default;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('callgenie_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    // Simulate realistic typing delay
    setTimeout(() => {
      const response = getSmartResponse(currentMessage);
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Removed auth check since user is already on dashboard

  const handleTryCallGenie = async () => {
    // Always proceed with CallGenie setup since user is on dashboard
    console.log('Starting CallGenie setup from dashboard');
    
    setShowCallGenie(true);
    setLoading(true);
    setStep(0);

    const steps = [
      { text: "Initializing AI Assistant...", delay: 1000 },
      { text: "Generating your unique number...", delay: 1500 },
      { text: "Setting up voice recognition...", delay: 1200 },
      { text: "Configuring smart responses...", delay: 1000 },
      { text: "Ready to receive calls!", delay: 800 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].delay));
      setStep(i + 1);
    }

    // Set phone number based on environment
    setPhoneNumber(getCallGenieNumber());
    
    setLoading(false);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    toast({
      title: "Number copied!",
      description: "Your CallGenie number has been copied to clipboard.",
    });
  };

  if (!showCallGenie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-sm border-b border-purple-500/20 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl flex items-center justify-center">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CallGenie</h1>
                <p className="text-xs text-purple-300">AI Calling Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
                <Video className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
              <Button 
                onClick={() => setShowLiveChat(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Live Support
              </Button>
              
              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-violet-800 transition-all">
                  <UserCircle className="h-5 w-5 text-white" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-12 w-56 bg-black/95 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-purple-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center">
                        <UserCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{userProfile.name || 'User'}</p>
                        <p className="text-purple-300 text-xs">{userProfile.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => navigate('/account-settings')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-purple-300 hover:text-white hover:bg-purple-500/20 rounded transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-purple-300 hover:text-white hover:bg-purple-500/20 rounded transition-colors">
                      <BarChart3 className="h-4 w-4" />
                      Usage Stats
                    </button>
                    <div className="border-t border-purple-500/20 my-1"></div>
                    <button 
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6 space-y-12">
          {/* Hero Section */}
          <div className="text-center py-12">
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 mb-4">
              🤖 Powered by Advanced AI Language Models
            </Badge>
            <h2 className="text-5xl font-bold text-white mb-6">AI That Answers Phone Calls</h2>
            <p className="text-xl text-purple-300 mb-8 max-w-3xl mx-auto">Get a phone number that people can call to talk with AI. Ask questions, get help, have conversations - our AI can discuss any topic!</p>
            


            <div className="flex justify-center space-x-4 mb-12">
              <Card className="max-w-md bg-black/80 border-purple-500/30 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">Try CallGenie Now</CardTitle>
                  <CardDescription className="text-purple-300">
                    Get your AI phone assistant in 60 seconds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-purple-300">
                      <Brain className="h-4 w-4" />
                      <span>Advanced AI</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-300">
                      <Mic className="h-4 w-4" />
                      <span>Voice Conversations</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-300">
                      <Globe className="h-4 w-4" />
                      <span>Any Topic</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-300">
                      <Clock className="h-4 w-4" />
                      <span>24/7 Available</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleTryCallGenie}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-3"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try CallGenie Now - Free
                  </Button>
                  <p className="text-xs text-purple-400 text-center">No credit card required • 7-day free trial</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What CallGenie Can Do */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">What Can People Ask CallGenie?</h3>
              <p className="text-purple-300 text-lg">Literally anything! Our AI can discuss any topic over the phone</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">General Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm mb-3">Ask about anything:</p>
                  <ul className="text-purple-300 text-sm space-y-1">
                    <li>• "What's the weather like?"</li>
                    <li>• "Explain quantum physics"</li>
                    <li>• "Help me with math problems"</li>
                    <li>• "Tell me a joke"</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Learning & Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm mb-3">Get help with:</p>
                  <ul className="text-purple-300 text-sm space-y-1">
                    <li>• Homework assistance</li>
                    <li>• Language learning</li>
                    <li>• Coding problems</li>
                    <li>• Research topics</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm mb-3">Just chat about:</p>
                  <ul className="text-purple-300 text-sm space-y-1">
                    <li>• Current events</li>
                    <li>• Personal advice</li>
                    <li>• Creative writing</li>
                    <li>• Brainstorming ideas</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">How CallGenie Works</h3>
              <p className="text-purple-300 text-lg">Simple as 1-2-3</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <CardTitle className="text-white">Get Your Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm">Sign up and get your unique CallGenie phone number instantly</p>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <CardTitle className="text-white">People Call</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm">Anyone can call your number and start talking with AI immediately</p>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <CardTitle className="text-white">AI Responds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm">Advanced AI has natural conversations about any topic they want</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Powerful AI Features</h3>
              <p className="text-purple-300 text-lg">Everything you need for intelligent phone conversations</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm hover:bg-black/80 transition-all">
                <CardHeader>
                  <Brain className="h-8 w-8 text-purple-400 mb-2" />
                  <CardTitle className="text-white text-lg">Advanced AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm">Powered by advanced language models for intelligent responses</p>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm hover:bg-black/80 transition-all">
                <CardHeader>
                  <Globe className="h-8 w-8 text-purple-400 mb-2" />
                  <CardTitle className="text-white text-lg">50+ Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm">Automatic language detection and natural conversations worldwide</p>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm hover:bg-black/80 transition-all">
                <CardHeader>
                  <Clock className="h-8 w-8 text-purple-400 mb-2" />
                  <CardTitle className="text-white text-lg">24/7 Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm">AI never sleeps - available for calls anytime, anywhere</p>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm hover:bg-black/80 transition-all">
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
                  <CardTitle className="text-white text-lg">Call Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-300 text-sm">See what people are asking and how AI is responding</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enterprise Security Section */}
          <div className="bg-gradient-to-r from-black/80 to-purple-900/40 border-2 border-purple-400/50 rounded-2xl p-16 backdrop-blur-sm text-center shadow-2xl">
            <h3 className="text-6xl font-bold leading-tight">
              <span className="text-white">With </span>
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">enterprise-grade security</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">and privacy</span>
              <span className="text-white">, you can ship your</span>
              <br />
              <span className="text-white">best work with confidence.</span>
            </h3>
          </div>

          {/* Stats */}
          <div className="bg-black/60 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Trusted by Thousands</h3>
              <p className="text-purple-300">Real performance metrics from our AI assistant</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
                <div className="text-purple-300">Conversations Monthly</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">98.7%</div>
                <div className="text-purple-300">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">0.8s</div>
                <div className="text-purple-300">Response Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-purple-300">Always Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* User History Section */}
        <div className="bg-black/60 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm mt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Your CallGenie Usage</h3>
            <p className="text-purple-300">Track how people are using your AI assistant</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">0</div>
              <div className="text-purple-300">Total Calls Received</div>
              <div className="text-xs text-purple-400 mt-1">No calls yet</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">0h</div>
              <div className="text-purple-300">Total Talk Time</div>
              <div className="text-xs text-purple-400 mt-1">Start receiving calls</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">--</div>
              <div className="text-purple-300">Questions Answered</div>
              <div className="text-xs text-purple-400 mt-1">Waiting for calls</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">--</div>
              <div className="text-purple-300">User Satisfaction</div>
              <div className="text-xs text-purple-400 mt-1">No feedback yet</div>
            </div>
          </div>
          
          <div className="mt-8 bg-black/40 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4">Recent Activity</h4>
            <div className="text-center py-8">
              <Phone className="h-12 w-12 mx-auto mb-4 text-purple-400 opacity-50" />
              <p className="text-purple-300">No calls received yet</p>
              <p className="text-sm text-purple-400 mt-2">Share your CallGenie number to start seeing activity here</p>
            </div>
          </div>
        </div>

        {/* Enhanced Live Chat Widget */}
        {showLiveChat && (
          <div className="fixed bottom-4 right-4 bg-black border border-gray-600 rounded z-50 w-80 h-96">
            <div className="flex items-center justify-between p-4 border-b border-gray-600 bg-black">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm">CallGenie Support</span>
                  </div>
                  <p className="text-xs text-gray-400">Ask me anything!</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowLiveChat(false)}
                className="text-gray-400 p-1"
              >
                ×
              </Button>
            </div>
            
            <>
                <div className="p-4 h-64 overflow-y-auto space-y-3 bg-black">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs rounded p-2 ${
                        message.isUser 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 rounded p-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                <div className="p-4 border-t border-gray-600 bg-black">
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything about CallGenie..." 
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isTyping}
                      className="bg-purple-600 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
            </>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-6">

      
      <Card className="w-full max-w-lg bg-black/80 border-purple-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
            {loading ? (
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            ) : (
              <CheckCircle className="h-10 w-10 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {loading ? "Setting Up CallGenie" : "CallGenie Ready!"}
          </CardTitle>
          <CardDescription className="text-purple-300">
            {loading ? "Please wait while we prepare your AI assistant" : "Your AI calling assistant is now active"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  "Initializing AI Assistant...",
                  "Generating your unique number...",
                  "Setting up voice recognition...",
                  "Configuring smart responses...",
                  "Ready to receive calls!"
                ].map((text, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      step > index ? 'bg-purple-500' : 
                      step === index ? 'bg-purple-400 animate-pulse' : 
                      'bg-gray-600'
                    }`} />
                    <span className={`text-sm ${
                      step > index ? 'text-purple-300' : 
                      step === index ? 'text-white' : 
                      'text-gray-500'
                    }`}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="bg-purple-900/30 rounded-lg p-4">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-purple-300 mt-2 text-center">
                  {Math.round((step / 5) * 100)}% Complete
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-purple-900/30 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Your CallGenie Number</h3>
                <div className="text-3xl font-mono text-purple-300 mb-4">{phoneNumber}</div>
                <Button 
                  onClick={handleCopyNumber}
                  variant="outline" 
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Number
                </Button>
              </div>
              
              <div className="bg-black/40 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">What happens next:</h4>
                <ul className="space-y-2 text-sm text-purple-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span>Share this number with anyone</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span>They can call and ask AI anything</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span>AI responds intelligently over phone</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span>View all conversations in dashboard</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white"
                onClick={() => setShowCallGenie(false)}
              >
                <Phone className="mr-2 h-4 w-4" />
                Start Receiving Calls
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};