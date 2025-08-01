import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Brain, MessageSquare, BarChart3, Settings, Copy, CheckCircle } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [assignedPhoneNumber, setAssignedPhoneNumber] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([{id: 1, text: 'Hello! How can I help you today?', sender: 'support', time: new Date()}]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchUserPhoneNumber = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/auth/phone/${user.id}`);
        const data = await response.json();
        if (data.success && data.phone_number) {
          setAssignedPhoneNumber(data.phone_number);
        } else {
          const onboardResponse = await fetch('/api/auth/onboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id })
          });
          const onboardData = await onboardResponse.json();
          if (onboardData.success && onboardData.phone_number) {
            setAssignedPhoneNumber(onboardData.phone_number);
          }
        }
      } catch (error) {
        console.error('Error fetching phone number:', error);
      }
    };
    if (user) fetchUserPhoneNumber();
  }, [user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(assignedPhoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              CallGenie
            </span>
          </h1>
          <p className="text-purple-100/70">Your AI calling assistant is ready to serve</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Phone Number Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-3 rounded-xl mr-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Your AI Phone Number</h2>
                <p className="text-purple-100/70">Share this number to receive AI-powered calls</p>
              </div>
            </div>
            
            {assignedPhoneNumber ? (
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-mono font-bold text-white">
                    {assignedPhoneNumber}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <div className="text-purple-100/70">Loading your phone number...</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-500/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-purple-100/70">Always Available</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">0</div>
                <div className="text-sm text-purple-100/70">Calls Received</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">Active</div>
                <div className="text-sm text-purple-100/70">Status</div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-semibold text-white">Call Received</div>
                  <div className="text-sm text-purple-100/70">AI answers instantly</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-semibold text-white">Voice Recognition</div>
                  <div className="text-sm text-purple-100/70">Understands natural speech</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-semibold text-white">AI Response</div>
                  <div className="text-sm text-purple-100/70">Provides intelligent answers</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <div className="font-semibold text-white">Voice Synthesis</div>
                  <div className="text-sm text-purple-100/70">Speaks naturally back</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Free Trial</h3>
                <div className="text-3xl font-bold text-purple-400 mb-2">₹0</div>
                <div className="text-purple-100/70 text-sm">7 days free</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  50 calls included
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Basic AI responses
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Email support
                </li>
              </ul>
              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm text-center">
                Current Plan
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border-2 border-purple-500/50 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                <div className="text-3xl font-bold text-purple-400 mb-2">₹2,499</div>
                <div className="text-purple-100/70 text-sm">/month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  500 calls/month
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Advanced AI responses
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Priority support
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Custom integrations
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Analytics dashboard
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all">
                Upgrade Now
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-purple-400 mb-2">₹4,999</div>
                <div className="text-purple-100/70 text-sm">/month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Unlimited calls
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Custom AI training
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  24/7 support
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Advanced analytics
                </li>
                <li className="flex items-center text-purple-100/80">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  API access
                </li>
              </ul>
              <button className="w-full border-2 border-purple-500/50 text-purple-200 py-3 rounded-xl font-semibold hover:bg-purple-500/10 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6">
            <Brain className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI Intelligence</h3>
            <p className="text-purple-100/70">Advanced AI that understands context and provides meaningful responses</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6">
            <MessageSquare className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Natural Conversations</h3>
            <p className="text-purple-100/70">Engage in human-like conversations with perfect voice synthesis</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6">
            <BarChart3 className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
            <p className="text-purple-100/70">Track call performance and gain insights into customer interactions</p>
          </div>
        </div>

        {/* Premium Features */}
        <div className="mt-12 bg-gradient-to-br from-purple-600/10 to-violet-600/10 rounded-3xl p-8 border border-purple-500/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Premium Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600 p-3 rounded-xl w-fit mx-auto mb-3">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Custom Training</h4>
              <p className="text-purple-100/70 text-sm">Train AI with your business data</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 p-3 rounded-xl w-fit mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Advanced Analytics</h4>
              <p className="text-purple-100/70 text-sm">Detailed call insights & reports</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 p-3 rounded-xl w-fit mx-auto mb-3">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Multiple Numbers</h4>
              <p className="text-purple-100/70 text-sm">Get additional phone numbers</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 p-3 rounded-xl w-fit mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">API Integration</h4>
              <p className="text-purple-100/70 text-sm">Connect with your systems</p>
            </div>
          </div>
        </div>

        {/* Call History */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            Recent{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Calls
            </span>
          </h3>
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6">
            <div className="text-center py-12">
              <Phone className="h-16 w-16 text-purple-400/50 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">No calls yet</h4>
              <p className="text-purple-100/70 mb-6">Share your AI phone number to start receiving calls</p>
              <div className="bg-purple-500/10 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-purple-100/80 text-sm mb-2">Your CallGenie Number:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-lg font-bold text-white">{assignedPhoneNumber || 'Loading...'}</span>
                  {assignedPhoneNumber && (
                    <button onClick={copyToClipboard} className="text-purple-400 hover:text-purple-300">
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-white mb-4">Quick Setup</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                <span className="text-purple-100/80">✅ Account created</span>
                <span className="text-green-400 text-sm">Complete</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                <span className="text-purple-100/80">✅ Phone number assigned</span>
                <span className="text-green-400 text-sm">Complete</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <span className="text-purple-100/60">⏳ Customize AI responses</span>
                <button className="text-purple-400 text-sm hover:text-purple-300">Setup</button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-white mb-4">Support & Resources</h4>
            <div className="space-y-3">
              <button onClick={() => setShowModal('docs')} className="block w-full text-left p-3 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
                <div className="font-semibold text-white">📚 Documentation</div>
                <div className="text-purple-100/70 text-sm">Learn how to use CallGenie</div>
              </button>
              <button onClick={() => setShowModal('chat')} className="block w-full text-left p-3 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
                <div className="font-semibold text-white">💬 Live Chat</div>
                <div className="text-purple-100/70 text-sm">Get instant help from our team</div>
              </button>
              <button onClick={() => setShowModal('videos')} className="block w-full text-left p-3 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors">
                <div className="font-semibold text-white">🎥 Video Tutorials</div>
                <div className="text-purple-100/70 text-sm">Watch step-by-step guides</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900/90 to-violet-900/90 border border-purple-500/30 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {showModal === 'docs' && '📚 Documentation'}
                {showModal === 'chat' && '💬 Live Chat Support'}
                {showModal === 'videos' && '🎥 Video Tutorials'}
              </h3>
              <button onClick={() => setShowModal(null)} className="text-purple-300 hover:text-white">
                ✕
              </button>
            </div>
            
            {showModal === 'docs' && (
              <div className="space-y-4">
                <div className="bg-purple-500/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Getting Started</h4>
                  <p className="text-purple-100/80 text-sm mb-2">1. Your AI phone number is automatically assigned</p>
                  <p className="text-purple-100/80 text-sm mb-2">2. Share your number with customers</p>
                  <p className="text-purple-100/80 text-sm">3. AI handles calls 24/7 automatically</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Customization</h4>
                  <p className="text-purple-100/80 text-sm mb-2">• Train AI with your business information</p>
                  <p className="text-purple-100/80 text-sm mb-2">• Set custom greetings and responses</p>
                  <p className="text-purple-100/80 text-sm">• Configure call routing rules</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Analytics</h4>
                  <p className="text-purple-100/80 text-sm">Track call performance, customer satisfaction, and AI response accuracy in your dashboard.</p>
                </div>
              </div>
            )}
            
            {showModal === 'chat' && (
              <div className="space-y-4">
                <div className="bg-purple-500/10 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h4 className="font-semibold text-white mb-2">Live Chat Support</h4>
                  <p className="text-purple-100/80 mb-4">Our support team is available 24/7 to help you with any questions.</p>
                  <div className="space-y-2">
                    <p className="text-purple-100/70 text-sm">📧 Email: support@callgenie.ai</p>
                    <p className="text-purple-100/70 text-sm">📞 Phone: +91-7089956401</p>
                    <p className="text-purple-100/70 text-sm">⏰ Available: 24/7</p>
                  </div>
                  <button 
                    onClick={() => {setShowModal(null); setShowChat(true);}} 
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:scale-105 transition-all"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            )}
            
            {showModal === 'videos' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-500/10 rounded-lg p-4">
                    <div className="aspect-video bg-purple-600/20 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-4xl">▶️</div>
                    </div>
                    <h4 className="font-semibold text-white mb-1">Quick Setup Guide</h4>
                    <p className="text-purple-100/70 text-sm">5 min tutorial</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4">
                    <div className="aspect-video bg-purple-600/20 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-4xl">▶️</div>
                    </div>
                    <h4 className="font-semibold text-white mb-1">AI Customization</h4>
                    <p className="text-purple-100/70 text-sm">8 min tutorial</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4">
                    <div className="aspect-video bg-purple-600/20 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-4xl">▶️</div>
                    </div>
                    <h4 className="font-semibold text-white mb-1">Analytics Dashboard</h4>
                    <p className="text-purple-100/70 text-sm">6 min tutorial</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4">
                    <div className="aspect-video bg-purple-600/20 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-4xl">▶️</div>
                    </div>
                    <h4 className="font-semibold text-white mb-1">Advanced Features</h4>
                    <p className="text-purple-100/70 text-sm">12 min tutorial</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Widget */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-gradient-to-br from-purple-900/95 to-violet-900/95 border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-sm z-50">
          <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-white font-semibold">Support Chat</span>
            </div>
            <button onClick={() => setShowChat(false)} className="text-purple-300 hover:text-white">
              ✕
            </button>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-500/20 text-purple-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-purple-500/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    if (newMessage.trim()) {
                      setMessages([...messages, {id: Date.now(), text: newMessage, sender: 'user', time: new Date()}]);
                      setNewMessage('');
                      setTimeout(() => {
                        setMessages(prev => [...prev, {id: Date.now() + 1, text: 'Thanks for your message! Our team will respond shortly.', sender: 'support', time: new Date()}]);
                      }, 1000);
                    }
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button 
                onClick={() => {
                  if (newMessage.trim()) {
                    setMessages([...messages, {id: Date.now(), text: newMessage, sender: 'user', time: new Date()}]);
                    setNewMessage('');
                    setTimeout(() => {
                      setMessages(prev => [...prev, {id: Date.now() + 1, text: 'Thanks for your message! Our team will respond shortly.', sender: 'support', time: new Date()}]);
                    }, 1000);
                  }
                }}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};