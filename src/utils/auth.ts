/**
 * Check if user is authenticated from multiple sources
 */
export const isUserAuthenticated = (): boolean => {
  // Check localStorage for custom auth
  const authToken = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  
  if (authToken && userData) {
    try {
      JSON.parse(userData); // Validate JSON
      return true;
    } catch {
      // Clear invalid data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return false;
    }
  }
  
  return false;
};

/**
 * Get current user data from localStorage
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      return null;
    }
  }
  return null;
};