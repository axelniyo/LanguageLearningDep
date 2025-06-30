
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { useParams } from "react-router-dom";

export function ProgressOverview() {
  const { user } = useAuth();
  const { courseId } = useParams();
  const [progress, setProgress] = useState<{ total:number, completed:number, xp:number }>({ total: 0, completed: 0, xp: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user && courseId) {
        setLoading(true);
        try {
          console.log('[ProgressOverview] Fetching progress for:', { userId: user.id, courseId });
          const data = await api.getCourseProgress(user.id, courseId);
          console.log('[ProgressOverview] Data received:', data);
          setProgress(data);
        } catch (e) {
          setProgress({ total: 0, completed: 0, xp: 0 });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProgress();
  }, [user?.id, courseId]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {loading ? "..." : progress.completed}
            </p>
            <p className="text-sm text-gray-600">Lessons Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {loading ? "..." : progress.xp}
            </p>
            <p className="text-sm text-gray-600">XP Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {loading || progress.total === 0
                ? "..."
                : `${Math.round((progress.completed / progress.total) * 100)}%`}
            </p>
            <p className="text-sm text-gray-600">Course Progress</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}