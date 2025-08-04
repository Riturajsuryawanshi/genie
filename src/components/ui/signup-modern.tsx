import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from 'lucide-react';

interface SignupModernProps {
  heading?: string;
  subtitle?: string;
  googleText?: string;
  onSuccess?: () => void;
}

const SignupModern = ({
  heading = "Create Account",
  subtitle = "Join CallGenie and get started today",
  googleText = "Sign up with Google",
  onSuccess,
}: SignupModernProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          phone
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }
      const text = await response.text();
      const data = text ? JSON.parse(text) : { success: false };

      if (!data.success) {
        setFormError(data.error || 'Signup failed');
        throw new Error(data.error || 'Signup failed');
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      toast({
        title: 'Account created!',
        description: 'You have been signed up successfully.',
      });
      
      onSuccess?.();
    } catch (error: unknown) {
      if (!formError) {
        setFormError(error instanceof Error ? error.message : 'Please try again with valid credentials.');
      }
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'Please try again with valid credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Google signup failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-violet-900 relative overflow-hidden">
      <div className="flex w-full h-full items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-2xl font-bold text-white">C</span>
              </div>
            </div>
            
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-semibold text-white">
                {heading}
              </h1>
              <p className="text-white/70 text-sm">
                {subtitle}
              </p>
            </div>
            
            {/* Error Display */}
            {formError && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg text-sm" role="alert">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleEmailSignup} className="space-y-4">
              {/* Full Name Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFormError(null); }}
                  required
                  disabled={isLoading}
                  className="w-full h-14 bg-white/10 border border-white/20 rounded-lg px-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-200"
                />
              </div>
              
              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFormError(null); }}
                  required
                  disabled={isLoading}
                  className="w-full h-14 bg-white/10 border border-white/20 rounded-lg px-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-200"
                />
              </div>
              
              {/* Phone Input */}
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setFormError(null); }}
                  disabled={isLoading}
                  className="w-full h-14 bg-white/10 border border-white/20 rounded-lg px-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-200"
                />
              </div>
              
              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormError(null); }}
                  required
                  disabled={isLoading}
                  className="w-full h-14 bg-white/10 border border-white/20 rounded-lg px-4 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-white hover:bg-white/90 text-purple-900 font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                <span>{isLoading ? "Creating account..." : "Create Account"}</span>
              </button>
              
              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-white/20" />
                <span className="mx-4 text-white/50 text-sm">or</span>
                <div className="flex-grow border-t border-white/20" />
              </div>
              
              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isLoading ? "Creating account..." : googleText}</span>
              </button>
            </form>
            
            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-white/60 text-sm">Already have an account? </span>
              <a
                href="/login"
                className="text-white font-medium hover:underline transition-colors text-sm"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { SignupModern };