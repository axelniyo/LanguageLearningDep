
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

      {/* Quick Start Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">🚀 Quick Start Mode - XAMPP Ready!</h3>
        <p className="text-sm text-blue-700">Course ID: {courseId}</p>
        <p className="text-sm text-blue-700">Course Name: {course.name}</p>
        <p className="text-xs text-blue-600 mt-2">✅ Using mock API - ready to connect to your XAMPP backend!</p>
      </div>
    </div>
  );
}
