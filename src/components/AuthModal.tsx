
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, mode: initialMode }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp } = useAuth();

  console.log('AuthModal rendered with mode:', mode, 'isOpen:', isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (!error) {
          onClose();
        }
      } else {
        const { error } = await signUp(email, password, username);
        if (!error) {
          onClose();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    console.log('Forgot password clicked');
    setShowForgotPassword(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>
            <button onClick={onClose} className="p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              variant="duolingo" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {mode === 'signin' ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
}