import { useState } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user: firebaseUser, loading } = useFirebaseAuth();

  const copyNumber = () => {
    // This function is now handled inside the Dashboard component
    // The Dashboard component will handle copying the actual assigned phone number
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Show landing page with user info if logged in
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="flex-1">
        <LandingPage user={firebaseUser} />
      </div>
    </div>
  );
};

export default Index;
