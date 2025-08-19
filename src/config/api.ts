// API configuration
const getApiBaseUrl = () => {
  // Use local backend for development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000/api';
  }
  // Use Render backend for production
  return 'https://genie-0rwj.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Enhanced fetch with better error handling
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('API Request:', url); // Debug log
  
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
      console.error('API endpoint not found:', url);
      throw new Error('API endpoint not found. Please check your backend deployment.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', url, errorText);
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : { success: false };
  } catch (error) {
    console.error('Fetch Error:', url, error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Backend is starting up. Please wait 30-60 seconds and try again.');
    }
    throw error;
  }
};

export { API_BASE_URL };