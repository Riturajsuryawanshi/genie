import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export const DirectGoogleAuth = ({ onSuccess }: { onSuccess: (user: any) => void }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    onSuccess(user);
  };

  return <div id="google-signin-button"></div>;
};