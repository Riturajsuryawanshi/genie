import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  customUser: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [customUser, setCustomUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check for custom auth token
      const customUserData = localStorage.getItem('user');
      const authToken = localStorage.getItem('authToken');
      if (customUserData && authToken) {
        try {
          const userData = JSON.parse(customUserData);
          setCustomUser(userData);
          // Set as main user if no Supabase user
          if (!session?.user) {
            setUser(userData as any);
          }
        } catch (error) {
          console.error('Error parsing custom user data:', error);
          // Clear invalid data
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        }
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Fast user onboarding
          const onboardUser = async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/auth/onboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: session.user.id,
                  email: session.user.email,
                  fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
                })
              });
              
              if (response.ok) {
                const data = await response.json();
                console.log('User onboarded:', data);
              }
            } catch (error) {
              console.error('Onboarding error:', error);
            }
          };
          
          onboardUser();
          
          toast({
            title: "Welcome to CallGenie!",
            description: `Successfully signed in as ${session.user.email}`,
          });
        } else if (event === 'SIGNED_OUT') {
          // Clear all auth data on sign out
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setCustomUser(null);
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Sign in failed",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      // Clear custom auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setCustomUser(null);
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    customUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 