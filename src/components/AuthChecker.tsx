import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isUserAuthenticated, getCurrentUser } from '@/utils/auth';

/**
 * Component to ensure authentication state is properly synced
 */
export const AuthChecker = () => {
  const { user, setUser } = useAuth() as any;

  useEffect(() => {
    // If no Supabase user but we have custom auth, sync the state
    if (!user && isUserAuthenticated()) {
      const customUser = getCurrentUser();
      if (customUser && typeof setUser === 'function') {
        setUser(customUser);
      }
    }
  }, [user, setUser]);

  return null;
};