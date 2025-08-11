import { useAuth } from '@/contexts/AuthContext';
import { isUserAuthenticated, getCurrentUser } from '@/utils/auth';
import { isProduction } from '@/utils/config';

export const AuthDebug = () => {
  const { user, session, loading } = useAuth();
  
  // Only show in development
  if (isProduction()) {
    return null;
  }

  const customUser = getCurrentUser();
  const isAuth = isUserAuthenticated();

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div className="space-y-1">
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>Supabase User: {user ? 'Yes' : 'No'}</div>
        <div>Session: {session ? 'Yes' : 'No'}</div>
        <div>Custom Auth: {isAuth ? 'Yes' : 'No'}</div>
        <div>Custom User: {customUser ? 'Yes' : 'No'}</div>
        <div>Auth Token: {localStorage.getItem('authToken') ? 'Yes' : 'No'}</div>
        <div>Environment: {isProduction() ? 'Production' : 'Development'}</div>
      </div>
    </div>
  );
};