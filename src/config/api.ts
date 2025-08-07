// API configuration for different environments
const getApiBaseUrl = () => {
  // In production, use environment variable or relative path
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || '/api';
  }
  
  // In development, use localhost
  return 'http://localhost:4000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Enhanced fetch with better error handling
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Check if response is HTML (likely a 404 page)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('API endpoint not found. Please check your backend deployment.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : { success: false };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server.');
    }
    throw error;
  }
};

export { API_BASE_URL };