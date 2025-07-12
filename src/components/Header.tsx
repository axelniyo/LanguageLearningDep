import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Trophy, Flame } from 'lucide-react';

interface HeaderProps {
  openAuthModal?: (mode: 'signin' | 'signup') => void;
}

export function Header({ openAuthModal }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-green-600">Language Mentor</h1>
          
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-orange-100 px-3 py-1 rounded-full">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-700">
                    {user.streak_count || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-1 bg-blue-100 px-3 py-1 rounded-full">
                  <Trophy className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">
                    {user.xp || 0} XP
                  </span>
                </div>
                <div className="flex items-center space-x-1 bg-purple-100 px-3 py-1 rounded-full">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-700">
                    Lvl {user.level || 1}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            openAuthModal && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => openAuthModal('signin')}>
                  Sign In
                </Button>
                <Button variant="duolingo" onClick={() => openAuthModal('signup')}>
                  Sign Up
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
