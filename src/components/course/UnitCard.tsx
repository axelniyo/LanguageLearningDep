
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { type Unit } from '@/services/api';
import { LessonItem } from './LessonItem';

interface UnitCardProps {
  unit: Unit;
  onStartLesson: (lessonId: string) => void;
  completedLessons?: Record<string, boolean>; // <-- FIXED: added this line
}

export function UnitCard({ unit, onStartLesson, completedLessons }: UnitCardProps) { // <-- updated prop name casing
  const getDifficultyColor = (unitIndex: number) => {
    if (unitIndex <= 5) return 'bg-green-100 text-green-800';
    if (unitIndex <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyLabel = (unitIndex: number) => {
    if (unitIndex <= 5) return 'Beginner';
    if (unitIndex <= 10) return 'Intermediate';
    return 'Advanced';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{unit.name}</CardTitle>
              <p className="text-gray-600">{unit.description}</p>
            </div>
          </div>
          <Badge className={getDifficultyColor(unit.order_index)}>
            {getDifficultyLabel(unit.order_index)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {unit.lessons && unit.lessons.length > 0 ? (
            unit.lessons
              .sort((a, b) => a.order_index - b.order_index)
              .map((lesson) => (
                <LessonItem 
                  key={lesson.id} 
                  lesson={lesson} 
                  onStart={onStartLesson}
                  completed={!!(completedLessons && completedLessons[lesson.id])}
                />
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No lessons available for this unit yet</p>
              <p className="text-xs mt-1">Unit ID: {unit.id}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}