
export interface User {
  id: string;
  email: string;
  username: string;
  xp: number;
  level: number;
  streak_count: number;
  created_at: string;
}

export interface AuthResponse {
  user?: User;
  error?: string;
}

const API_BASE_URL = 'http://localhost:3001';

class AuthService {
  async signUp(email: string, password: string, username: string): Promise<AuthResponse> {
    try {
      console.log('Auth: Attempting signup at:', `${API_BASE_URL}/api/auth/signup`);
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      console.log('Auth Response status:', response.status);
      const data = await response.json();
      console.log('Auth Response data:', data);

      if (!response.ok) {
        return { error: data.message || 'Sign up failed' };
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      return { user: data.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An unexpected error occurred during sign up' };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Auth: Attempting signin at:', `${API_BASE_URL}/api/auth/signin`);
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Auth Response status:', response.status);
      const data = await response.json();
      console.log('Auth Response data:', data);

      if (!response.ok) {
        return { error: data.message || 'Sign in failed' };
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      return { user: data.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An unexpected error occurred during sign in' };
    }
  }

  async signOut(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/auth/signout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  }

  getCurrentUser(): User | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        xp: payload.xp || 0,
        level: payload.level || 1,
        streak_count: payload.streak_count || 0,
        created_at: payload.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('auth_token');
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      localStorage.removeItem('auth_token');
      return false;
    }
  }
}

export const authService = new AuthService();