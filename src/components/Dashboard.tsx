<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Settings, BarChart3, MessageSquare, Copy, Mail, MapPin, LogOut, User, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CallingAgent } from './CallingAgent';

// Extend User type to include phone_number
interface ExtendedUser {
  id: string;
  email?: string;
  phone_number?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  copyNumber: () => void;
}

const TRIAL_DURATION_DAYS = 7;

export const Dashboard = ({ activeTab, setActiveTab, copyNumber }: DashboardProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [assignedPhoneNumber, setAssignedPhoneNumber] = useState<string>('');
  const [loadingPhoneNumber, setLoadingPhoneNumber] = useState(false);
  const [callGenieTrial, setCallGenieTrial] = useState(() => {
    const stored = localStorage.getItem('callGenieTrial');
    return stored ? JSON.parse(stored) : null;
  });
  const [showCallGenie, setShowCallGenie] = useState(false);
  const [showCallingAgent, setShowCallingAgent] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch user's assigned phone number
  useEffect(() => {
    const fetchUserPhoneNumber = async () => {
      if (!user?.id) return;
      
      setLoadingPhoneNumber(true);
      try {
        const response = await fetch(`/api/auth/phone/${user.id}`);
        const data = await response.json();
        
        if (data.success && data.phone_number) {
          setAssignedPhoneNumber(data.phone_number);
        } else {
          // If no phone number assigned, try to assign one
          const onboardResponse = await fetch('/api/auth/onboard', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: user.id
            }),
          });
          
          const onboardData = await onboardResponse.json();
          if (onboardData.success && onboardData.phone_number) {
            setAssignedPhoneNumber(onboardData.phone_number);
          }
        }
      } catch (error) {
        console.error('Failed to fetch phone number:', error);
      } finally {
        setLoadingPhoneNumber(false);
      }
    };

    fetchUserPhoneNumber();
  }, [user?.id]);

  const handleCopyNumber = () => {
    const phoneNumber = assignedPhoneNumber || '+1 (555) 123-4567';
    navigator.clipboard.writeText(phoneNumber);
    toast({
      title: "Number copied!",
      description: "Your CallGenie number has been copied to clipboard.",
    });
  };

  const startTrial = () => {
    const start = Date.now();
    const end = start + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;
    const trial = { start, end };
    setCallGenieTrial(trial);
    localStorage.setItem('callGenieTrial', JSON.stringify(trial));
    setShowCallGenie(true);
  };

  const trialActive = callGenieTrial && Date.now() < callGenieTrial.end;
  const trialExpired = callGenieTrial && Date.now() >= callGenieTrial.end;
  const trialTimeLeft = trialActive ? Math.max(0, callGenieTrial.end - Date.now()) : 0;

  const formatTimeLeft = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${days}d ${hours}h left`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-4 lg:px-6 h-16 flex items-center shadow-sm">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CallGenie
              </span>
              <div className="text-xs text-gray-500 -mt-1">AI Phone Assistant</div>
            </div>
          </div>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1 overflow-visible">
        {/* Welcome Banner */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-500 via-rose-400 to-purple-500 p-8 flex items-center shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <Phone className="h-12 w-12 text-white drop-shadow-lg" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!</h1>
              <p className="text-white/80 text-lg">Manage your AI phone assistant and view call analytics</p>
            </div>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none select-none">
            <Star className="h-32 w-32 text-white" />
          </div>
        </div>
        {/* Prominent Logout Button */}
        <div className="flex justify-center mb-8">
          <Button variant="destructive" size="lg" className="px-8 py-3 text-lg font-semibold flex items-center gap-2" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition-all text-lg" onClick={() => setShowCallingAgent(true)}>
            <Phone className="h-5 w-5 mr-2" /> New Call
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition-all text-lg" onClick={() => setActiveTab('analytics')}>
            <BarChart3 className="h-5 w-5 mr-2" /> View Analytics
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition-all text-lg" onClick={() => setActiveTab('premium')}>
            <Star className="h-5 w-5 mr-2" /> Upgrade
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="callgenie">Call Genie</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Horizontal Overview Cards - forced flex row, no wrap on desktop */}
            <div className="flex flex-row gap-6 w-full mb-8 overflow-x-auto md:overflow-x-visible md:flex-nowrap" style={{whiteSpace: 'nowrap'}}>
              <Card
                className="flex-shrink-0 min-w-[360px] max-w-md w-full md:w-[360px] rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white via-indigo-50 to-rose-50 cursor-pointer hover:shadow-2xl transition-shadow duration-200"
                onClick={() => navigate('/my-number')}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-bold">Your CallGenie Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-extrabold text-indigo-800 bg-white rounded-xl px-6 py-6 shadow border border-indigo-100 mb-2 text-center select-all tracking-widest" style={{letterSpacing: '0.08em'}}>
                    {loadingPhoneNumber ? (
                      <div className="flex items-center space-x-2 justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        <span className="text-gray-500 text-lg">Loading...</span>
                      </div>
                    ) : (
                      assignedPhoneNumber || '+1 (555) 123-4567'
                    )}
                  </div>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={e => { e.stopPropagation(); handleCopyNumber(); }} 
                    className="mt-2 w-full text-lg"
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    Copy Number
                  </Button>
                </CardContent>
              </Card>
              <Card className="flex-shrink-0 min-w-[220px] max-w-xs w-full md:w-[220px] rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white via-rose-50 to-indigo-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Calls Today</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>
              <Card className="flex-shrink-0 min-w-[220px] max-w-xs w-full md:w-[220px] rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white via-purple-50 to-indigo-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Response Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">98.5%</div>
                  <p className="text-xs text-muted-foreground">Excellent performance</p>
                </CardContent>
              </Card>
              <Card className="flex-shrink-0 min-w-[220px] max-w-xs w-full md:w-[220px] rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white via-yellow-50 to-rose-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Premium Status</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">Trial</div>
                  <p className="text-xs text-muted-foreground">Upgrade to unlock premium features</p>
                  <Button className="mt-2 bg-gradient-to-r from-indigo-500 to-rose-500 text-white w-full" onClick={() => setActiveTab('premium')}>View Premium</Button>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white via-indigo-50 to-rose-50">
                <CardHeader>
                  <CardTitle>Usage Summary</CardTitle>
                  <CardDescription>Overview of your recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Calls this month: 45</li>
                    <li>Minutes used: 120</li>
                    <li>AI responses: 98%</li>
                    <li>Voicemails: 3</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white via-purple-50 to-indigo-50">
                <CardHeader>
                  <CardTitle>Support</CardTitle>
                  <CardDescription>Contact our team for help</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full mb-2">Email Support</Button>
                  <Button variant="outline" className="w-full">Live Chat</Button>
                </CardContent>
              </Card>
            </div>
            {/* Tips & Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white via-yellow-50 to-rose-50">
                <CardHeader>
                  <CardTitle>Tips & Resources</CardTitle>
                  <CardDescription>Get the most out of CallGenie</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><a href="https://help.callgenie.ai/getting-started" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Getting Started Guide</a></li>
                    <li><a href="https://help.callgenie.ai/faq" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Frequently Asked Questions</a></li>
                    <li><a href="https://help.callgenie.ai/integrations" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Integrations</a></li>
                    <li><a href="https://help.callgenie.ai/contact" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Contact Support</a></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-6 rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white via-indigo-50 to-rose-50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest call interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Appointment scheduled with John Doe</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Customer inquiry handled</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Follow-up call completed</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle>Call History</CardTitle>
                <CardDescription>View and manage your recent calls</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Call history will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed insights about your call performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Analytics dashboard will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your CallGenie preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Settings panel will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="callgenie">
            <div className="flex h-full">
              <aside className="w-64 bg-white/80 border-r p-4 flex flex-col gap-6">
                <button
                  className={`w-full py-2 rounded-lg font-semibold shadow transition ${trialActive ? 'bg-indigo-500 text-white' : 'bg-[#a8edea] text-neutral-900 hover:bg-[#b6f0f2]'}`}
                  onClick={() => setActiveTab('callgenie')}
                  disabled={trialExpired}
                >
                  Call Genie
                </button>
                {trialActive && (
                  <div className="text-xs text-green-700 mt-2">Free trial active: {formatTimeLeft(trialTimeLeft)}</div>
                )}
                {trialExpired && (
                  <div className="text-xs text-red-700 mt-2">Trial expired. <button className="underline" onClick={() => alert('Contact support to upgrade!')}>Upgrade</button></div>
                )}
              </aside>
              <main className="flex-1 p-8">
                {trialActive ? (
                  <div className="max-w-xl mx-auto bg-white/70 rounded-xl shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Call Genie</h2>
                    <p className="mb-6">Welcome to your free trial of Call Genie! Here you can access premium call features for 7 days.</p>
                    <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold shadow hover:bg-indigo-600">Call Now (Demo)</button>
                    {assignedPhoneNumber && (
                      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <p className="text-indigo-700 text-sm mb-2">Your CallGenie Number:</p>
                        <p className="text-indigo-900 font-mono text-xl font-bold">
                          {assignedPhoneNumber}
                        </p>
                        <p className="text-indigo-600 text-xs mt-2">Share this number with others to receive calls</p>
                      </div>
                    )}
                    <div className="mt-4 text-xs text-neutral-500">Trial ends in {formatTimeLeft(trialTimeLeft)}</div>
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto bg-white/70 rounded-xl shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Call Genie</h2>
                    <p className="mb-6">Start your free 7-day trial to unlock Call Genie features!</p>
                    <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold shadow hover:bg-indigo-600" onClick={() => { startTrial(); navigate('/call-genie'); }}>Start Free Trial</button>
                  </div>
                )}
              </main>
            </div>
          </TabsContent>

          <TabsContent value="premium">
            <Card>
              <CardHeader>
                <CardTitle>Premium Membership</CardTitle>
                <CardDescription>Unlock all advanced features and priority support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold mb-2">Upgrade to Premium</span>
                  <ul className="list-disc list-inside text-gray-800 space-y-2 text-lg mt-2">
                    <li>Unlimited AI-powered calls</li>
                    <li>Advanced conversational AI with custom training</li>
                    <li>Dedicated account manager</li>
                    <li>Priority 24/7 support</li>
                    <li>Custom integrations (CRM, Slack, etc.)</li>
                    <li>Team collaboration tools</li>
                    <li>Detailed analytics and reporting</li>
                    <li>API access for developers</li>
                    <li>White-labeling options</li>
                    <li>SSO & advanced security features</li>
                    <li>Custom voice and persona</li>
                    <li>Service Level Agreement (SLA)</li>
                  </ul>
                </div>
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-lg font-bold px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition-all">Upgrade Now</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {showCallingAgent && (
        <CallingAgent onClose={() => setShowCallingAgent(false)} />
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-md">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CallGenie
                </span>
                <div className="text-xs text-gray-500 -mt-1">AI Phone Assistant</div>
              </div>
            </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>riturajsuryawanshi51@gmail.com</span>
              </div>
              <a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            </div>
          </div>

          <div className="border-t mt-4 pt-4 text-center">
            <p className="text-xs text-gray-500">
              © 2024 CallGenie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
>>>>>>> e1801927d793f0b28aff106328f74bf9b730f52a
