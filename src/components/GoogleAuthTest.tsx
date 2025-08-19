import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const GoogleAuthTest = () => {
  const [testing, setTesting] = useState(false);
  const { signInWithGoogle, user, session } = useAuth();

  const testGoogleAuth = async () => {
    setTesting(true);
    console.log('Testing Google Auth...');
    console.log('Current user:', user);
    console.log('Current session:', session);
    console.log('Redirect URL will be:', `${window.location.origin}/dashboard`);
    
    try {
      await signInWithGoogle();
      console.log('Google auth initiated successfully');
    } catch (error) {
      console.error('Google auth test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded shadow-lg z-50">
      <h3 className="font-bold mb-2">Google Auth Test</h3>
      <div className="text-sm mb-2">
        <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
        <div>Session: {session ? 'Active' : 'None'}</div>
      </div>
      <Button 
        onClick={testGoogleAuth} 
        disabled={testing}
        size="sm"
      >
        {testing ? 'Testing...' : 'Test Google Auth'}
      </Button>
    </div>
  );
};