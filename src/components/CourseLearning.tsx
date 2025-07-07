
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { api, type Course, type Unit } from '@/services/api';
import { LoadingState } from './course/LoadingState';
import { CourseNotFound } from './course/CourseNotFound';
import { CourseHeader } from './course/CourseHeader';
import { ProgressOverview } from './course/ProgressOverview';
import { UnitCard } from './course/UnitCard';
import { EmptyState } from './course/EmptyState';
import { useAuth } from '@/hooks/useAuth';

export function CourseLearning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  useEffect(() => {
    if (user?.id && courseId) {
      loadCompletedLessons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, courseId]);

  const loadCourseData = async () => {
    if (!courseId) return;
    try {
      console.log('Loading course data for courseId:', courseId);
      const courseData = await api.getCourse(courseId);
      if (!courseData) {
        console.error('Course not found:', courseId);
        setCourse(null);
        setLoading(false);
        return;
      }
      console.log('Loaded course:', courseData);
      setCourse(courseData);

      const unitsData = await api.getCourseUnits(courseId);
      console.log('Loaded units with lessons:', unitsData);
      setUnits(unitsData || []);
    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedLessons = async () => {
    if (!user?.id || !courseId) return;
    try {
      const unitsData = await api.getCourseUnits(courseId);
      const allLessons = unitsData.flatMap((unit: Unit) => unit.lessons);
      const completedLessonsMap: Record<string, boolean> = {};
      for (const lesson of allLessons) {
        try {
          const res = await fetch(`https://languagelearningdep.onrender.com/lessons/progress/lesson/${user.id}/${lesson.id}`);
          if (res.ok) {
            const d = await res.json();
            if (d.completed) completedLessonsMap[lesson.id] = true;
          }
        } catch (e) {
          // Fail silently
        }
      }
      setCompletedLessons(completedLessonsMap);
    } catch (e) {
      setCompletedLessons({});
    }
  };

  const startLesson = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!course) {
    return <CourseNotFound courseId={courseId || ''} onReturnHome={handleReturnHome} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseHeader
          course={course}
          courseId={courseId || ''}
          onBack={handleReturnHome}
        />

        <ProgressOverview />

        {/* Display all units in a vertical list, expanded */}
        <div className="space-y-8">
          {units.length > 0 ? (
            units
              .sort((a, b) => a.order_index - b.order_index)
              .map(unit => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  onStartLesson={startLesson}
                  completedLessons={completedLessons}
                />
              ))
          ) : (
            <EmptyState courseId={courseId || ''} onReturnHome={handleReturnHome} />
          )}
        </div>
      </div>
    </div>
  );
}
