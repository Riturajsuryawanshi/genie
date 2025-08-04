import { useAuth } from '@/contexts/AuthContext';
import { SaathiChat } from './SaathiChat';
import { useState } from 'react';

// Add some beautiful illustrated face avatar URLs
const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Olivia',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Ethan',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Zara',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Max',
];

export const SaathiPage = () => {
  const { user } = useAuth();
  const [profileHovered, setProfileHovered] = useState(false);
  const [hoverOnCard, setHoverOnCard] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    // Use user's avatar if available, else default to first option
    if (user && user.user_metadata && user.user_metadata.avatar_url) return user.user_metadata.avatar_url;
    return AVATAR_OPTIONS[0];
  });

  // Helper functions for user info
  const getUserName = () => {
    if (!user) return 'User';
    if (user.user_metadata && user.user_metadata.full_name) return user.user_metadata.full_name;
    if (user.user_metadata && user.user_metadata.name) return user.user_metadata.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };
  const getAvatarUrl = () => {
    return selectedAvatar;
  };
  const getInitials = () => {
    const name = getUserName();
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-black flex flex-row w-full relative">
      {/* Center: SaathiChat (no outer box) */}
      <div className="flex-1 flex justify-center items-center">
        <SaathiChat />
      </div>
      {/* Profile: Fixed at top right */}
      <div className="fixed top-6 right-8 z-50 flex flex-col items-end">
        <div
          className="flex flex-col items-center cursor-pointer"
          onMouseEnter={() => setProfileHovered(true)}
          onMouseLeave={() => { if (!hoverOnCard) setProfileHovered(false); }}
        >
          {getAvatarUrl() ? (
            <img src={getAvatarUrl()} alt="avatar" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-lg" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-700 flex items-center justify-center text-white text-2xl font-bold border-2 border-indigo-500 shadow-lg">
              {getInitials()}
            </div>
          )}
        </div>
        {/* Hover Card */}
        {profileHovered && (
          <div
            className="mt-2 bg-gray-100 rounded-xl shadow-2xl p-6 min-w-[220px] border border-neutral-200 animate-fade-in"
            onMouseEnter={() => { setHoverOnCard(true); setProfileHovered(true); }}
            onMouseLeave={() => { setHoverOnCard(false); setProfileHovered(false); }}
          >
            <div className="flex flex-col items-center">
              {getAvatarUrl() ? (
                <img src={getAvatarUrl()} alt="avatar" className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 mb-2" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xl font-bold border-2 border-indigo-500 mb-2">
                  {getInitials()}
                </div>
              )}
              <div className="font-bold text-lg text-neutral-900">{getUserName()}</div>
              <div className="text-sm text-neutral-500 mt-1">{user?.email || 'No email'}</div>
              {/* Avatar selection row */}
              <div className="flex gap-2 mt-4">
                {AVATAR_OPTIONS.map((url) => (
                  <button
                    key={url}
                    onClick={() => setSelectedAvatar(url)}
                    className={`rounded-full border-2 transition-all duration-200 ${selectedAvatar === url ? 'border-indigo-500' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:scale-125 hover:shadow-lg`}
                    style={{ padding: 0 }}
                  >
                    <img src={url} alt="avatar option" className="w-10 h-10 rounded-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="text-xs text-neutral-400 mt-2">Select your avatar</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 