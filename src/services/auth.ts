// MongoDB-based authentication service
interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  accountStatus: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  message?: string;
}

class AuthService {
  private baseURL = 'http://localhost:4000/api/auth';

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get stored user
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Clear stored auth data
  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Sign up new user
  async signup(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : { success: false, error: 'Empty response' };

      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Login user
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : { success: false, error: 'Empty response' };

      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Verify token
  async verifyToken(): Promise<AuthResponse> {
    const token = this.getToken();
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    try {
      const response = await fetch(`${this.baseURL}/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : { success: false, error: 'Empty response' };

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        this.clearAuth();
      }

      return data;
    } catch (error) {
      this.clearAuth();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Logout
  logout(): void {
    this.clearAuth();
    // You could also call a logout endpoint here if needed
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.getToken() && this.getUser());
  }

  // Make authenticated requests
  async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getToken();
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
  }
}

export const authService = new AuthService();
export type { User, AuthResponse };