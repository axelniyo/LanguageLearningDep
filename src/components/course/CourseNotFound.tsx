
import { Button } from '@/components/ui/button';

interface CourseNotFoundProps {
  courseId: string;
  onReturnHome: () => void;
}

export function CourseNotFound({ courseId, onReturnHome }: CourseNotFoundProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
        <p className="text-gray-600 mb-4">Course ID: {courseId}</p>
        <Button onClick={onReturnHome} variant="default">
          Return Home
        </Button>
      </div>
    </div>
  );
}
