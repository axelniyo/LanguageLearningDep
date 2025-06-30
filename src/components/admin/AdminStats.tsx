import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';

export function AdminStats() {
  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ['admin-languages'],
    queryFn: api.getLanguages,
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: api.getCourses,
  });

  if (languagesLoading || coursesLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading statistics...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Statistics</CardTitle>
        <CardDescription>Current content overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{languages?.length || 0}</div>
            <div className="text-sm text-gray-600">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{courses?.length || 0}</div>
            <div className="text-sm text-gray-600">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Units</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">0</div>
            <div className="text-sm text-gray-600">Vocabulary</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
