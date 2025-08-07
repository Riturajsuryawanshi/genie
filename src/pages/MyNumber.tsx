import { useEffect, useState } from 'react';
import { Phone, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { API_BASE_URL } from '@/config/api';

const freeFeatures = [
  'Up to 10 free AI-powered calls',
  'Natural language understanding',
  '24/7 availability',
  'Instant responses',
  'Call recording and transcripts',
  'Multi-language support',
  'Personalized greetings',
  'Smart call routing',
  'Voicemail to text',
  'Caller analytics dashboard',
  'Easy integration with your workflow',
  'Priority email support during trial',
];

const premiumFeatures = [
  'Unlimited AI-powered calls',
  'Advanced conversational AI with custom training',
  'Dedicated account manager',
  'Priority 24/7 support',
  'Custom integrations (CRM, Slack, etc.)',
  'Team collaboration tools',
  'Detailed analytics and reporting',
  'API access for developers',
  'White-labeling options',
  'SSO & advanced security features',
  'Custom voice and persona',
  'Service Level Agreement (SLA)',
];

export default function MyNumber() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [usage, setUsage] = useState(null);
  const [activity, setActivity] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setError('You must be logged in to view your dashboard.');
      return;
    }
    setLoading(true);
    setError('');
    Promise.all([
      fetch(`${API_BASE_URL}/auth/user/${user.id}`).then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      }),
      fetch(`${API_BASE_URL}/auth/usage/${user.id}`).then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      }),
      fetch(`${API_BASE_URL}/auth/activity/${user.id}`).then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      }),
      fetch(`${API_BASE_URL}/auth/plan/${user.id}`).then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      }),
    ])
      .then(([userRes, usageRes, activityRes, planRes]) => {
        if (userRes.success && userRes.user) setProfile(userRes.user);
        if (usageRes.success && usageRes.usage) setUsage(usageRes.usage);
        if (activityRes.success && activityRes.activity) setActivity(activityRes.activity);
        if (planRes.success && planRes.plan) setPlan(planRes.plan);
        if (!userRes.success) setError(userRes.error || 'Could not fetch your profile.');
        if (!usageRes.success) setError(usageRes.error || 'Could not fetch your usage stats.');
        if (!planRes.success) setError(planRes.error || 'Could not fetch your plan info.');
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <>
      <SEO 
        title="My CallGenie Dashboard - AI Voice Assistant Management"
        description="Manage your AI voice assistant, view call analytics, and access premium features. Track conversations, usage stats, and customize your CallGenie experience."
        keywords="AI voice assistant dashboard, call analytics, voice AI management, phone automation dashboard"
        url="https://callgenie.ai/my-number"
      />
      <div className="min-h-screen w-full bg-gradient-to-br from-yellow-100 via-indigo-100 to-rose-100 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border-4 border-indigo-200 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-8 py-2 rounded-full text-xl font-bold shadow-lg animate-bounce">This is your dedicated CallGenie User Portal</div>
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 mt-12 text-center drop-shadow-lg">CallGenie Dashboard</h1>
        <Phone className="w-20 h-20 text-indigo-500 mb-4 animate-pulse" />
        {authLoading || loading ? (
          <div className="text-2xl text-gray-500 my-8">Loading your info...</div>
        ) : error ? (
          <div className="text-xl text-red-600 my-8">{error}</div>
        ) : (
          <>
            {/* User Profile Info */}
            {profile && (
              <div className="w-full mb-8 p-6 rounded-2xl bg-indigo-50 border border-indigo-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xl font-bold text-indigo-800">{profile.full_name || profile.name || 'User'}</div>
                    <div className="text-lg text-gray-700">{profile.email}</div>
                  </div>
                  <div className="text-lg text-indigo-700 font-semibold">Status: {profile.account_status || 'Active'}</div>
                  {profile.trial_expires_at && (
                    <div className="text-md text-rose-600">Trial expires: {new Date(profile.trial_expires_at).toLocaleDateString()}</div>
                  )}
                </div>
                {profile.phone_number && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 text-center">
                    <div className="text-lg font-semibold text-green-800 mb-2 flex items-center justify-center gap-2">
                      <Phone className="h-5 w-5" /> Your CallGenie Number
                    </div>
                    <div className="text-2xl font-mono font-bold text-green-900 mb-2">{profile.phone_number}</div>
                    <div className="text-sm text-green-700">Call this number to test your AI assistant!</div>
                  </div>
                )}
              </div>
            )}
            {/* Usage Stats */}
            {usage && (
              <div className="w-full mb-8 p-6 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-lg text-purple-800 font-semibold">Calls this month: <span className="font-bold">{usage.calls_made}</span></div>
                <div className="text-lg text-purple-800 font-semibold">Minutes used: <span className="font-bold">{usage.minutes_used}</span></div>
                <div className="text-lg text-purple-800 font-semibold">AI response rate: <span className="font-bold">{usage.ai_response_rate}%</span></div>
                <div className="text-lg text-purple-800 font-semibold">Voicemails: <span className="font-bold">{usage.voicemails}</span></div>
              </div>
            )}
            {/* Plan Info */}
            {plan && (
              <div className="w-full mb-8 p-6 rounded-2xl bg-yellow-50 border border-yellow-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-lg text-yellow-800 font-semibold">Plan: <span className="font-bold">{plan.plan_name}</span></div>
                <div className="text-lg text-yellow-800 font-semibold">Status: <span className="font-bold">{plan.status}</span></div>
                {plan.renewal_date && (
                  <div className="text-md text-yellow-700">Renews: {new Date(plan.renewal_date).toLocaleDateString()}</div>
                )}
                {plan.features && (
                  <div className="text-md text-yellow-700">Features: {plan.features}</div>
                )}
              </div>
            )}
            {/* Recent Activity */}
            {activity && activity.length > 0 && (
              <div className="w-full mb-8 p-6 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="text-xl font-bold text-rose-700 mb-2">Recent Activity</div>
                <ul className="space-y-2">
                  {activity.map(act => (
                    <li key={act.id} className="text-gray-800 text-lg flex items-center gap-2">
                      <span className="text-rose-500">•</span> <span>{act.description}</span> <span className="text-xs text-gray-500">({new Date(act.created_at).toLocaleString()})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        {/* Features Section */}
        <div className="w-full mb-10">
          <div className="text-3xl font-semibold text-indigo-700 mb-4 flex items-center"><Check className="w-7 h-7 mr-2 text-green-500" />Free Trial Features</div>
          <ul className="list-disc list-inside text-gray-800 space-y-3 text-xl pl-4">
            {freeFeatures.map(f => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div className="w-full">
          <div className="text-3xl font-semibold text-yellow-700 mb-4 flex items-center"><Star className="w-7 h-7 mr-2 text-yellow-500" />Premium Member Features</div>
          <ul className="list-disc list-inside text-gray-800 space-y-3 text-xl pl-4">
            {premiumFeatures.map(f => <li key={f}>{f}</li>)}
          </ul>
        </div>
          <Button variant="outline" className="mt-12 w-full text-lg" onClick={() => navigate(-1)}>Back to Dashboard</Button>
        </div>
      </div>
      <style>{`
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          0% { box-shadow: 0 0 0px #6366f1, 0 0 0px #f43f5e; }
          100% { box-shadow: 0 0 32px #6366f1, 0 0 32px #f43f5e; }
        }
      `}</style>
    </>
  );
}