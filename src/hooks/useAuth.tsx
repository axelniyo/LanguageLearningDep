
import { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser && authService.isAuthenticated()) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const result = await authService.signUp(email, password, username);

    if (result.error) {
      toast({
        title: "Sign up failed",
        description: result.error,
        variant: "destructive",
      });
      return { error: result.error };
    } else {
      if (result.user) {
        setUser(result.user);
      }
      toast({
        title: "Success!",
        description: "Account created successfully.",
      });
      return { error: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);

    if (result.error) {
      toast({
        title: "Sign in failed",
        description: result.error,
        variant: "destructive",
      });
      return { error: result.error };
    } else {
      if (result.user) {
        setUser(result.user);
      }
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      return { error: null };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}