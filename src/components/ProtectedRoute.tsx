import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user: firebaseUser, loading } = useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      navigate('/login');
    }
  }, [firebaseUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!firebaseUser) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};