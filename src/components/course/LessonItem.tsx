
import { Button } from '@/components/ui/button';
import { Star, Check } from 'lucide-react';
import { type Lesson } from '@/services/api';

interface LessonItemProps {
  lesson: Lesson;
  onStart: (lessonId: string) => void;
  completed?: boolean;
}

export function LessonItem({ lesson, onStart, completed }: LessonItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            lesson.lesson_type === 'vocabulary'
              ? 'bg-green-500'
              : lesson.lesson_type === 'phrases'
                ? 'bg-blue-500'
                : lesson.lesson_type === 'grammar'
                  ? 'bg-purple-500'
                  : 'bg-orange-500'
          }`}
        ></div>
        <div>
          <h4 className="font-medium">{lesson.name}</h4>
          <p className="text-sm text-gray-600">{lesson.description}</p>
          <p className="text-xs text-gray-500">Type: {lesson.lesson_type}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Star className="w-4 h-4 text-yellow-500" />
          {lesson.xp_reward} XP
        </div>
        {completed ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded font-semibold">
              <Check className="w-4 h-4" /> Completed
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onStart(lesson.id)}
              className="ml-1"
            >
              Review
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={() => onStart(lesson.id)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Start
          </Button>
        )}
      </div>
    </div>
  );
}