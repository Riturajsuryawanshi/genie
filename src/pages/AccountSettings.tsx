import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Moon, Sun, Save, Mail, Phone, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
}

export const AccountSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    // Load saved data from localStorage
    const savedProfile = localStorage.getItem('callgenie_profile');
    const savedTheme = localStorage.getItem('callgenie_theme');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Set default email if no profile exists
      setProfile(prev => ({ ...prev, email: 'user@example.com' }));
    }
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('callgenie_theme', newTheme ? 'dark' : 'light');
    
    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme ? 'dark' : 'light'} mode`,
    });
  };

  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem('callgenie_profile', JSON.stringify(profile));
    
    toast({
      title: "Profile saved",
      description: "Your profile has been updated successfully",
    });
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-purple-500/20 bg-black/90 backdrop-blur-sm">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center justify-center mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-2 rounded-xl shadow-lg shadow-purple-500/25">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                CallGenie
              </span>
              <div className="text-xs text-purple-300/60 -mt-1">Account Settings</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-purple-300">Manage your profile and preferences</p>
          </div>

          {/* Current User Info */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center">
                  <UserCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    {profile.name || 'User'}
                  </CardTitle>
                  <CardDescription className="text-purple-300">
                    {profile.email || 'user@example.com'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme Settings */}
            <motion.div
              variants={fadeUpVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm h-fit">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    Theme Settings
                  </CardTitle>
                  <CardDescription className="text-purple-300">
                    Choose your preferred theme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/[0.05] rounded-xl border border-white/[0.1]">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <Moon className="h-5 w-5 text-purple-400" />
                      ) : (
                        <Sun className="h-5 w-5 text-yellow-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">
                          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </p>
                        <p className="text-purple-300 text-sm">
                          {isDarkMode ? 'Dark theme is active' : 'Light theme is active'}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleThemeToggle}
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                    >
                      {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-purple-400 bg-purple-500/10 p-3 rounded-lg">
                    💡 Theme preference is saved locally and will persist across sessions
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Settings */}
            <motion.div
              variants={fadeUpVariants}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription className="text-purple-300">
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleProfileUpdate('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/50 focus:border-purple-500/50"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileUpdate('email', e.target.value)}
                        placeholder="Enter your email"
                        className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/50 focus:border-purple-500/50"
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phoneNumber}
                        onChange={(e) => handleProfileUpdate('phoneNumber', e.target.value)}
                        placeholder="Enter your phone number"
                        className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/50 focus:border-purple-500/50"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>

                  <div className="text-xs text-purple-400 bg-purple-500/10 p-3 rounded-lg">
                    🔒 Your data is stored locally and never shared with third parties
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};