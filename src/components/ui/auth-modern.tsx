import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthModernProps {
  onSuccess?: () => void;
}

const AuthModern = ({ onSuccess }: AuthModernProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        toast({
          title: 'Welcome to CallGenie!',
          description: 'Your account has been created successfully.',
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Welcome back!',
          description: 'You have been logged in successfully.',
        });
        window.location.href = '/';
      }
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' ? 'No account found with this email.' :
                          error.code === 'auth/wrong-password' ? 'Incorrect password.' :
                          error.code === 'auth/email-already-in-use' ? 'Email already in use.' :
                          error.code === 'auth/weak-password' ? 'Password should be at least 6 characters.' :
                          error.message || 'Authentication failed.';
      
      setFormError(errorMessage);
      toast({
        title: `${isSignUp ? 'Signup' : 'Login'} failed`,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Welcome!',
        description: `Successfully ${isSignUp ? 'signed up' : 'signed in'} with Google.`,
      });
      
      if (isSignUp) {
        await firebaseSignOut(auth);
        localStorage.clear();
        toast({
          title: 'Welcome to CallGenie!',
          description: 'Successfully signed up with Google.',
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        window.location.href = '/';
      }
    } catch (error: any) {
      toast({
        title: `Google ${isSignUp ? 'signup' : 'login'} failed`,
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-violet-900 flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-4 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 animate-bounce">Welcome to CallGenie!</h1>
          <p className="text-xl text-white/80 mb-8">Your account has been created successfully</p>
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
        
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full min-h-screen relative">
        {/* Left Side - Dynamic Content with Curved Design */}
        <div className={`relative w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen transition-all duration-1000 ease-in-out overflow-hidden ${
          isSignUp 
            ? 'bg-gradient-to-br from-pink-500 via-red-500 to-purple-600' 
            : 'bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800'
        }`}>
          {/* Curved Shape */}
          <div className="absolute inset-0">
            <svg 
              className="absolute right-0 top-0 h-full w-32" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <path 
                d={isSignUp ? "M0,0 Q50,50 0,100 L100,100 L100,0 Z" : "M0,0 Q50,50 0,100 L100,100 L100,0 Z"}
                fill="white" 
                className="transition-all duration-1000"
              />
            </svg>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
            <div className={`text-center text-white transform transition-all duration-1000 ${
              isSignUp ? 'translate-x-0 opacity-100' : 'translate-x-0 opacity-100'
            }`}>
              {!isSignUp ? (
                // Sign In Left Side
                <div className="space-y-6">
                  <h2 className="text-2xl lg:text-4xl font-bold mb-4">New here?</h2>
                  <p className="text-lg text-white/90 mb-8 max-w-md">
                    Join CallGenie and transform your business communication with AI-powered voice assistance.
                  </p>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    SIGN UP
                  </button>
                  
                  {/* Rocket Illustration */}
                  <div className="mt-12 relative">
                    <div className="w-64 h-64 mx-auto relative">
                      {/* Rocket */}
                      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                        <div className="w-12 h-20 bg-gradient-to-t from-gray-300 to-white rounded-t-full relative">
                          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full"></div>
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-orange-500 rounded-b-full animate-pulse"></div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-red-500 rounded-b-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* Person sitting */}
                      <div className="absolute bottom-0 right-12">
                        <div className="w-16 h-16 relative">
                          {/* Head */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-full"></div>
                          {/* Body */}
                          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-10 h-8 bg-orange-600 rounded-t-lg"></div>
                          {/* Legs */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-blue-600 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Network nodes */}
                      <div className="absolute top-8 right-8">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                        <div className="absolute -top-2 left-6 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Floating elements */}
                      <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute bottom-8 left-8 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ) : (
                // Sign Up Left Side
                <div className="space-y-6">
                  <h2 className="text-2xl lg:text-4xl font-bold mb-4">One of us?</h2>
                  <p className="text-lg text-white/90 mb-8 max-w-md">
                    Welcome back! Continue managing your AI voice assistant and business calls.
                  </p>
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-pink-600 transition-all duration-300 transform hover:scale-105"
                  >
                    SIGN IN
                  </button>
                  
                  {/* Desk Illustration */}
                  <div className="mt-12 relative">
                    <div className="w-64 h-64 mx-auto relative">
                      {/* Desk */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gray-700 rounded-lg">
                        {/* Laptop */}
                        <div className="absolute top-2 left-4 w-16 h-10 bg-gray-800 rounded-t-lg">
                          <div className="w-14 h-8 bg-blue-500 rounded m-1 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        
                        {/* Plant */}
                        <div className="absolute top-2 right-4 w-4 h-8 bg-green-500 rounded-t-full">
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-orange-600 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Person */}
                      <div className="absolute bottom-16 right-8">
                        <div className="w-16 h-16 relative">
                          {/* Head */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-full"></div>
                          {/* Body */}
                          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-10 h-8 bg-blue-600 rounded-t-lg"></div>
                          {/* Legs */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-purple-600 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Trophy */}
                      <div className="absolute top-8 left-8">
                        <div className="w-6 h-8 bg-yellow-400 rounded-t-full relative">
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-yellow-600 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Floating elements */}
                      <div className="absolute top-4 right-8 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
                      <div className="absolute bottom-8 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white relative">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-4xl font-bold mb-2" style={{color: isSignUp ? '#8B5CF6' : '#6366F1'}}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </h1>
            </div>

            {/* Error Display */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6" role="alert">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFormError(null); }}
                    required
                    disabled={isLoading}
                    className="w-full h-14 bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              )}

              {isSignUp && (
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFormError(null); }}
                    required
                    disabled={isLoading}
                    className="w-full h-14 bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFormError(null); }}
                    required
                    disabled={isLoading}
                    className="w-full h-14 bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormError(null); }}
                  required
                  disabled={isLoading}
                  className="w-full h-14 bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-14 text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSignUp 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800' 
                    : 'bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800'
                }`}
              >
                {isLoading ? (isSignUp ? "SIGN UP" : "LOGIN") : (isSignUp ? "SIGN UP" : "LOGIN")}
              </button>

              <div className="text-center text-gray-500 text-sm my-6">
                Or {isSignUp ? 'Sign up' : 'Sign in'} with Google
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-14 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isLoading ? "Signing in..." : `${isSignUp ? 'Sign up' : 'Sign in'} with Google`}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AuthModern };