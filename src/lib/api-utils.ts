/**
 * Safely parse JSON response with proper error handling
 * @param response - The fetch Response object
 * @returns Promise<any> - The parsed JSON data or throws an error
 */
export async function safeJsonParse(response: Response): Promise<any> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
  }

  const text = await response.text();
  
  // Handle empty responses
  if (!text || text.trim() === '') {
    return { success: false, error: 'Empty response from server' };
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Response text:', text);
    throw new Error('Invalid JSON response from server');
  }
}

/**
 * Enhanced fetch with automatic JSON parsing and error handling
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise<any> - The parsed JSON data
 */
export async function fetchJson(url: string, options?: RequestInit): Promise<any> {
  const response = await fetch(url, options);
  return safeJsonParse(response);
}