import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

interface Login1Props {
  heading?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  loginText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
  onSuccess?: () => void;
}

const Login1 = ({
  heading = "Welcome back to CallGenie",
  logo = {
    url: "/",
    src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=100&fit=crop&crop=center",
    alt: "CallGenie Logo",
    title: "CallGenie",
  },
  googleText = "Sign in with Google",
  loginText = "Sign in to your account",
  signupText = "Don't have an account?",
  signupUrl = "/signup",
  onSuccess,
}: Login1Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      toast({
        title: 'Login successful!',
        description: 'Welcome back to CallGenie.',
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error?.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <a href={logo.url}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-10 dark:invert"
                />
              </a>
            </div>
            {heading && <h1 className="text-3xl font-semibold">{heading}</h1>}
          </div>
          <form onSubmit={handleEmailLogin} className="w-full flex flex-col gap-4">
            <label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <Input
              id="login-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all bg-white/80 dark:bg-black/40 text-gray-900 dark:text-white shadow-sm"
              aria-label="Email"
            />
            <label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-2">Password</label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all bg-white/80 dark:bg-black/40 text-gray-900 dark:text-white shadow-sm pr-10"
                aria-label="Password"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button type="submit" className="mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg py-2" disabled={isLoading}>
              {isLoading ? "Signing in..." : loginText}
            </Button>
            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
              <span className="mx-2 text-gray-500 text-xs">or</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            </div>
            <Button 
              type="button"
              variant="outline" 
              className="w-full rounded-lg flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-black/30 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white shadow"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 size-5" />
              {isLoading ? "Signing in..." : googleText}
            </Button>
          </form>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm mt-4">
            <p>{signupText}</p>
            <a
              href={signupUrl}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login1 }; 