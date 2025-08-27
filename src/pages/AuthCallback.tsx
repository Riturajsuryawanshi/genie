import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange authorization code for an authentication token from our backend
      fetch(`/api/auth/google/callback`, { // This should be your backend endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Authentication failed');
        }
        return res.json();
      })
      .then(data => {
        // Assuming the backend returns its own JWT and user info
        // e.g., { token: 'your_jwt', user: { ... } }
        if (data.token && data.user) {
          // Store token and user data
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('authToken', data.token);
          
          // Redirect to a protected route or a success page
          navigate('/signup-success');
        } else {
          throw new Error('Invalid token or user data from server');
        }
      })
      .catch(error => {
        console.error('OAuth error:', error);
        navigate('/signup');
      });
    } else {
      navigate('/signup');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-violet-900">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Completing Google sign up...</p>
      </div>
    </div>
  );
};

export default AuthCallback;