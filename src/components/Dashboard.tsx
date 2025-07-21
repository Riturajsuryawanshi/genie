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
