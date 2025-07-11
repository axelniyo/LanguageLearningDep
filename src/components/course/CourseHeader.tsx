
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { type Course } from '@/services/api';

interface CourseHeaderProps {
  course: Course;
  courseId: string;
  onBack: () => void;
}

export function CourseHeader({ course, courseId, onBack }: CourseHeaderProps) {
  return (
    <div className="mb-8">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{course.language.flag_emoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>
      </div>

    </div>
  );
}
