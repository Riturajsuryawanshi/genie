import React, { useState } from 'react';
import { Phone, Brain, BarChart3, MessageSquare, Shield, Star, User, HelpCircle, ArrowRight, Mail } from 'lucide-react';

const TRIAL_DURATION_DAYS = 7;

const features = [
  {
    icon: <Brain className="h-6 w-6 text-indigo-500" />,
    title: 'AI-Powered Call Handling',
    description: 'Let Call Genie answer, route, and respond to calls with advanced AI.'
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-indigo-500" />,
    title: 'Smart Responses',
    description: 'Context-aware, natural replies for every caller.'
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-indigo-500" />,
    title: 'Analytics Dashboard',
    description: 'Track call stats, response rates, and more.'
  },
  {
    icon: <Shield className="h-6 w-6 text-indigo-500" />,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security and 99.9% uptime.'
  },
  {
    icon: <Star className="h-6 w-6 text-indigo-500" />,
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
  const [callGenieTrial, setCallGenieTrial] = useState(() => {
    const stored = localStorage.getItem('callGenieTrial');
    return stored ? JSON.parse(stored) : null;
  });
  const [showDemo, setShowDemo] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Personalization (placeholder)
  const userName = 'User'; // Replace with real user name if available

  const startTrial = () => {
    const start = Date.now();
    const end = start + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;
    const trial = { start, end };
    setCallGenieTrial(trial);
    localStorage.setItem('callGenieTrial', JSON.stringify(trial));
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="w-full h-full bg-white/70 rounded-none shadow-none p-0 flex flex-col items-center justify-center">
        {/* Personalization */}
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2 mt-8"><Phone className="h-7 w-7 text-indigo-500" /> Call Genie</h2>
        <div className="mb-4 text-indigo-900 text-lg">Welcome{userName ? `, ${userName}` : ''}!</div>
        {/* Trial Progress Bar */}
        {trialActive && (
          <div className="mb-4 w-full max-w-xl mx-auto">
            <div className="w-full bg-indigo-100 rounded-full h-3 mb-2">
              <div
                className="bg-indigo-500 h-3 rounded-full transition-all"
                style={{ width: `${trialProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-neutral-700">Trial ends in {formatTimeLeft(trialTimeLeft)}</div>
          </div>
        )}
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
        {/* Trial Start/Expired UI */}
        {!trialActive && !trialExpired && (
          <>
            <p className="mb-6">Start your free 7-day trial to unlock Call Genie features!</p>
            <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold shadow hover:bg-indigo-600" onClick={startTrial}>Start Free Trial</button>
          </>
        )}
        {trialExpired && (
          <>
            <p className="mb-6 text-red-700">Your free trial has expired.</p>
            <button className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold shadow cursor-not-allowed" disabled>Trial Expired</button>
            <div className="mt-4 text-xs text-neutral-500">Contact support to upgrade.</div>
          </>
        )}
      </div>
    </div>
  );
};

export default CallGenie; 