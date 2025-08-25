import { useState, useEffect } from 'react';
import { Phone, Brain, BarChart3, MessageSquare, Shield, Star, User, HelpCircle, ArrowRight, Mail, Copy, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { API_BASE_URL } from '@/config/api';
import { useNavigate } from 'react-router-dom';

const TRIAL_DURATION_DAYS = 7;

const featuresData = [
  {
    iconName: 'Brain',
    title: 'AI-Powered Call Handling',
    description: 'Let Call Genie answer, route, and respond to calls with advanced AI.'
  },
  {
    iconName: 'MessageSquare',
    title: 'Smart Responses',
    description: 'Context-aware, natural replies for every caller.'
  },
  {
    iconName: 'BarChart3',
    title: 'Analytics Dashboard',
    description: 'Track call stats, response rates, and more.'
  },
  {
    iconName: 'Shield',
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security and 99.9% uptime.'
  },
  {
    iconName: 'Star',
    title: 'Premium Support',
    description: 'Priority help during your trial.'
  }
];

const faqs = [
  { q: 'How long does the free trial last?', a: 'The free trial lasts for 7 days from activation.' },
  { q: 'Do I need a credit card to start?', a: 'No credit card is required to start your free trial.' },
  { q: 'What happens when my trial ends?', a: 'You can upgrade to a paid plan to keep using Call Genie.' },
  { q: 'Can I contact support during my trial?', a: 'Yes, premium support is included during your trial.' },
];

const testimonials = [
  { name: 'Jane Doe', company: 'Acme Corp', text: 'Call Genie transformed our customer support. The AI is amazing!' },
  { name: 'John Smith', company: 'TechFlow', text: 'We saved hours every week. Highly recommend the free trial.' },
];

const comparison = [
  { feature: 'AI Call Handling', free: true, paid: true },
  { feature: 'Analytics Dashboard', free: false, paid: true },
  { feature: 'Custom Integrations', free: false, paid: true },
  { feature: 'Premium Support', free: true, paid: true },
  { feature: 'Unlimited Calls', free: false, paid: true },
];

const CallGenie: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [callGenieTrial, setCallGenieTrial] = useState(() => {
    const stored = localStorage.getItem('callGenieTrial');
    return stored ? JSON.parse(stored) : null;
  });
  const [showDemo, setShowDemo] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  // Personalization (placeholder)
  const userName = 'User'; // Replace with real user name if available

  // Create features with icons inside component
  const features = featuresData.map(feature => {
    let IconComponent;
    switch (feature.iconName) {
      case 'Brain':
        IconComponent = Brain;
        break;
      case 'MessageSquare':
        IconComponent = MessageSquare;
        break;
      case 'BarChart3':
        IconComponent = BarChart3;
        break;
      case 'Shield':
        IconComponent = Shield;
        break;
      case 'Star':
        IconComponent = Star;
        break;
      default:
        IconComponent = Brain;
    }
    return {
      ...feature,
      icon: <IconComponent className="h-6 w-6 text-indigo-500" />
    };
  });

  // Fetch phone number when user is available
  useEffect(() => {
    if (user?.id) {
      fetchPhoneNumber();
    }
  }, [user?.id]);

  const fetchPhoneNumber = async () => {
    // Use fallback phone number since endpoint doesn't exist
    setPhoneNumber('+918035316321');
  };

  const copyPhoneNumber = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      toast({
        title: "Copied!",
        description: "Phone number copied to clipboard",
      });
    }
  };

  const startTrial = () => {
    const start = Date.now();
    const end = start + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;
    const trial = { start, end, userEmail: user?.email };
    setCallGenieTrial(trial);
    localStorage.setItem('callGenieTrial', JSON.stringify(trial));
    setShowPhoneNumber(true);
  };

  const trialActive = callGenieTrial && Date.now() < callGenieTrial.end;
  const trialExpired = callGenieTrial && Date.now() >= callGenieTrial.end;
  const trialTimeLeft = trialActive ? Math.max(0, callGenieTrial.end - Date.now()) : 0;
  const trialProgress = trialActive ? 100 - Math.floor((trialTimeLeft / (TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000)) * 100) : 0;

  const formatTimeLeft = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${days}d ${hours}h left`;
  };

  return (
    <>
      <SEO 
        title="Try CallGenie Now - AI Voice Assistant | Free 7-Day Trial"
        description="Start your AI phone assistant in 60 seconds. Get intelligent voice conversations, natural language processing, and 24/7 availability. No credit card required for free trial."
        keywords="try AI voice assistant, free trial phone automation, AI calling system, voice AI demo, automated phone system"
        url="https://callgenie.ai/call-genie"
      />
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-indigo-700 rounded-xl hover:bg-white transition-all duration-200 border border-indigo-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      <div className="w-full h-full bg-white/70 rounded-none shadow-none p-0 flex flex-col items-center justify-center">
        {/* Personalization */}
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2 mt-8"><Phone className="h-7 w-7 text-indigo-500" /> Call Genie</h2>
        <div className="mb-4 text-indigo-900 text-lg">Welcome{userName ? `, ${userName}` : ''}!</div>
        {/* Trial Progress Bar - Always show for testing */}
        <div className="mb-4 w-full max-w-xl mx-auto">
          {callGenieTrial && trialActive ? (
            <>
              <div className="w-full bg-indigo-100 rounded-full h-4 mb-3">
                <div
                  className="bg-indigo-500 h-4 rounded-full transition-all"
                  style={{ width: `${trialProgress}%` }}
                ></div>
              </div>
              <div className="text-lg text-indigo-700 font-bold text-center bg-indigo-50 p-3 rounded-lg">
                🎉 Free trial ends in {formatTimeLeft(trialTimeLeft)}
              </div>
            </>
          ) : callGenieTrial && trialExpired ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-red-700 font-semibold text-lg">⏰ Trial Expired</div>
              <div className="text-sm text-red-600">Your 7-day free trial has ended. Upgrade to continue using CallGenie.</div>
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm">No active trial</div>
          )}
        </div>
        {/* Feature List with Animation */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left w-full max-w-3xl mx-auto">
          {features.map((f, i) => (
            <div key={f.title} className={`flex items-start gap-3 bg-white/60 rounded-lg p-4 shadow transition-all duration-500 ${trialActive ? 'animate-fade-in-up' : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
              {f.icon}
              <div>
                <div className="font-semibold text-indigo-900">{f.title}</div>
                <div className="text-sm text-indigo-800/80">{f.description}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Interactive Demo */}
        {trialActive && (
          <>
            <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold shadow hover:bg-indigo-600 mb-4 flex items-center gap-2 mx-auto" onClick={() => setShowDemo(true)}>
              <User className="h-5 w-5" /> Try a Demo Call
            </button>
            {/* Demo Modal */}
            {showDemo && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowDemo(false)}>&times;</button>
                  <h3 className="text-xl font-bold mb-2">Simulated Call</h3>
                  <div className="mb-4 text-indigo-700">Hi! This is Call Genie. How can I help you today?</div>
                  <input className="w-full border rounded-lg px-3 py-2 mb-4" placeholder="Type your question..." />
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold shadow hover:bg-indigo-600">Send</button>
                  <div className="mt-4 text-xs text-neutral-500">(This is a demo. No real call is made.)</div>
                </div>
              </div>
            )}
          </>
        )}
        {/* Upgrade Prompt & Comparison Table */}
        {trialActive && (
          <div className="mb-6 mt-4 w-full max-w-2xl mx-auto">
            <div className="bg-indigo-50 rounded-lg p-4 mb-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-semibold text-indigo-900">Love Call Genie? Unlock more with a paid plan!</div>
              <button className="px-5 py-2 bg-rose-500 text-white rounded-lg font-semibold shadow hover:bg-rose-600 flex items-center gap-2">
                <ArrowRight className="h-4 w-4" /> Upgrade Now
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left mt-2 border border-indigo-100 rounded-lg">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="py-2 px-4">Feature</th>
                    <th className="py-2 px-4">Free Trial</th>
                    <th className="py-2 px-4">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map(row => (
                    <tr key={row.feature} className="border-t border-indigo-50">
                      <td className="py-2 px-4 font-medium">{row.feature}</td>
                      <td className="py-2 px-4 text-center">{row.free ? '✔️' : '—'}</td>
                      <td className="py-2 px-4 text-center">{row.paid ? '✔️' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* FAQ Section */}
        <div className="mb-8 w-full max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-indigo-500" /> FAQ</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={faq.q}>
                <button className="w-full text-left font-semibold text-indigo-900 flex items-center gap-2" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {faq.q}
                  <span className="ml-auto">{faqOpen === i ? '−' : '+'}</span>
                </button>
                {faqOpen === i && <div className="pl-4 py-2 text-indigo-800/80">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
        {/* Testimonials */}
        <div className="mb-8 w-full max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Star className="h-5 w-5 text-indigo-500" /> What Our Users Say</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white/60 rounded-lg p-4 shadow text-left">
                <div className="font-semibold text-indigo-900 mb-1">{t.name} <span className="text-xs text-indigo-700">({t.company})</span></div>
                <div className="text-indigo-800/80 text-sm">“{t.text}”</div>
              </div>
            ))}
          </div>
        </div>
        {/* Contact/Support Button */}
        <div className="mb-4">
          <a href="mailto:support@callgenie.ai" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 transition">
            <Mail className="h-5 w-5" /> Contact Support
          </a>
        </div>
        {/* Phone Number Display */}
        {phoneNumber && (
          <div className={`mb-6 p-6 rounded-xl border-2 text-center ${
            trialActive 
              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200' 
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
          }`}>
            <h3 className={`text-2xl font-bold mb-2 flex items-center justify-center gap-2 ${
              trialActive ? 'text-indigo-700' : 'text-gray-500'
            }`}>
              <Phone className="h-6 w-6" /> Your CallGenie Number
            </h3>
            <div className={`text-3xl font-mono font-bold mb-3 ${
              trialActive ? 'text-indigo-900' : 'text-gray-400'
            }`}>{phoneNumber}</div>
            <p className={`mb-4 ${
              trialActive ? 'text-indigo-700' : 'text-gray-500'
            }`}>
              {trialActive ? 'Call this number to test your AI assistant!' : 'Trial expired - Upgrade to reactivate'}
            </p>
            <button 
              onClick={copyPhoneNumber}
              disabled={!trialActive}
              className={`px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-2 mx-auto ${
                trialActive 
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Copy className="h-4 w-4" /> Copy Number
            </button>
          </div>
        )}
        
        {/* Trial Start/Expired UI */}
        {!callGenieTrial && (
          <div className="mb-6 p-6 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">Start Your Free Trial</h3>
            <p className="text-indigo-600 mb-4">Get 7 days of free access to CallGenie AI assistant!</p>
            <button 
              onClick={startTrial}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold shadow hover:bg-indigo-600"
            >
              Start 7-Day Free Trial
            </button>
          </div>
        )}
        
        {/* Trial Expired Upgrade UI */}
        {trialExpired && (
          <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
            <h3 className="text-xl font-bold text-red-700 mb-2">Trial Expired</h3>
            <p className="text-red-600 mb-4">Your 7-day free trial has ended. Upgrade to continue using CallGenie.</p>
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600">
              Upgrade Now
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default CallGenie; 