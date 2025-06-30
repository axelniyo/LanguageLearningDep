import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Volume2, Star, BookOpen, MessageSquare, Brain, PenTool } from 'lucide-react';
import { LanguagePreferenceDialog } from './LanguagePreferenceDialog';
import { translationService } from '@/services/translationService';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

interface Lesson {
  id: string;
  name: string;
  description: string;
  lesson_type: string;
  xp_reward: number;
  unit_name?: string;
  course_name?: string;
}

interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  example_sentence?: string;
  example_translation?: string;
  word_type?: string;
}

interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  pronunciation?: string;
  context?: string;
}

interface GrammarRule {
  id: string;
  title: string;
  explanation: string;
  examples: Array<{ original: string; translation: string }>;
}

interface Exercise {
  id: string;
  exercise_type: string;
  question: string;
  correct_answer: string;
  options?: string[];
  explanation?: string;
}

const BASE_URL = 'http://localhost:3001/api';

// Utility functions for lesson styling
const getLessonColor = (lessonType: string) => {
  switch (lessonType) {
    case 'vocabulary':
      return 'bg-blue-100 text-blue-800';
    case 'phrases':
      return 'bg-green-100 text-green-800';
    case 'grammar':
      return 'bg-purple-100 text-purple-800';
    case 'exercises':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getLessonIcon = (lessonType: string) => {
  switch (lessonType) {
    case 'vocabulary':
      return <BookOpen className="w-4 h-4 mr-1" />;
    case 'phrases':
      return <MessageSquare className="w-4 h-4 mr-1" />;
    case 'grammar':
      return <Brain className="w-4 h-4 mr-1" />;
    case 'exercises':
      return <PenTool className="w-4 h-4 mr-1" />;
    default:
      return <Star className="w-4 h-4 mr-1" />;
  }
};

export function LessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [grammar, setGrammar] = useState<GrammarRule[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Fetch lesson, language, and handle language preference
  useEffect(() => {
    // Load stored language preference
    translationService.loadStoredLanguage();
    const stored = localStorage.getItem('preferredLanguage');
    
    if (lessonId) {
      if (!stored) {
        setShowLanguageDialog(true);
      } else {
        setHasSelectedLanguage(true);
        loadLessonData();
      }
    }
  }, [lessonId]);

  // Fetch lesson completion status from backend (with debug)
  useEffect(() => {
    if (user && lessonId && hasSelectedLanguage) {
      console.log('[LessonView] Calling fetchLessonCompletion with:', { userId: user.id, lessonId });
      fetchLessonCompletion();
    } else {
      console.log('[LessonView] Skipped fetchLessonCompletion. user:', user, 'lessonId:', lessonId, 'hasSelectedLanguage:', hasSelectedLanguage);
    }
    // Only run when all 3 dependencies are ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, lessonId, hasSelectedLanguage]);

  const handleLanguageSelect = (languageCode: string, languageName: string) => {
    translationService.setLanguage(languageCode, languageName);
    setHasSelectedLanguage(true);
    setShowLanguageDialog(false);
    
    toast({
      title: "Language Set",
      description: `Content will be translated to ${languageName}`,
    });
    
    loadLessonData();
  };

  const loadLessonData = async () => {
    try {
      console.log('Loading lesson data for lessonId:', lessonId);
      
      // Load lesson details
      const lessonResponse = await fetch(`${BASE_URL}/lessons/${lessonId}`);
      if (!lessonResponse.ok) {
        if (lessonResponse.status === 404) {
          setLesson(null);
          setLoading(false);
          return;
        }
        throw new Error(`HTTP error! status: ${lessonResponse.status}`);
      }
      
      const lessonData = await lessonResponse.json();
      console.log('Loaded lesson:', lessonData);
      setLesson(lessonData);

      // Load content based on lesson type - REMOVED strict filtering to test
      if (lessonData.lesson_type === 'vocabulary') {
        try {
          const response = await fetch(`${BASE_URL}/vocabulary?lesson_id=${lessonId}`);
          if (response.ok) {
            let data = await response.json();
            console.log('Raw vocabulary data:', data);
            // More lenient filtering - check both string and number IDs
            data = (data || []).filter((v: any) => 
              String(v.lesson_id) === String(lessonId) || 
              Number(v.lesson_id) === Number(lessonId)
            );
            console.log('Filtered vocabulary data:', data);
            const translatedData = await translationService.translateLessonContent(data);
            setVocabulary(translatedData);
          }
        } catch (error) {
          console.error('Error loading vocabulary:', error);
          setVocabulary([]);
        }
      }

      if (lessonData.lesson_type === 'phrases') {
        try {
          const response = await fetch(`${BASE_URL}/phrases?lesson_id=${lessonId}`);
          if (response.ok) {
            let data = await response.json();
            console.log('Raw phrases data:', data);
            data = (data || []).filter((v: any) => 
              String(v.lesson_id) === String(lessonId) || 
              Number(v.lesson_id) === Number(lessonId)
            );
            console.log('Filtered phrases data:', data);
            const translatedData = await translationService.translateLessonContent(data);
            setPhrases(translatedData);
          }
        } catch (error) {
          console.error('Error loading phrases:', error);
          setPhrases([]);
        }
      }

      if (lessonData.lesson_type === 'grammar') {
        try {
          const response = await fetch(`${BASE_URL}/grammar?lesson_id=${lessonId}`);
          if (response.ok) {
            let data = await response.json();
            console.log('Raw grammar data:', data);
            data = (data || []).filter((v: any) => 
              String(v.lesson_id) === String(lessonId) || 
              Number(v.lesson_id) === Number(lessonId)
            );
            console.log('Filtered grammar data:', data);
            const convertedGrammar = data.map(item => ({
              ...item,
              examples: Array.isArray(item.examples) 
                ? item.examples
                : typeof item.examples === 'string' 
                  ? JSON.parse(item.examples) 
                  : []
            }));
            const translatedData = await translationService.translateLessonContent(convertedGrammar);
            setGrammar(translatedData);
          }
        } catch (error) {
          console.error('Error loading grammar:', error);
          setGrammar([]);
        }
      }

      if (lessonData.lesson_type === 'exercises') {
        try {
          const response = await fetch(`${BASE_URL}/exercises?lesson_id=${lessonId}`);
          if (response.ok) {
            let data = await response.json();
            // ---- DEBUG LOGGING ----
            console.log('[LessonView][DEBUG] lessonId:', lessonId);
            console.log('[LessonView][DEBUG] /api/exercises response:', data);
            const filteredData = (data || []).filter((v: any) =>
              String(v.lesson_id) === String(lessonId) ||
              Number(v.lesson_id) === Number(lessonId)
            );
            console.log('[LessonView][DEBUG] Filtered exercises:', filteredData);
            // ---- END DEBUG LOGGING ----
            data = filteredData;
            const convertedExercises = data.map(item => ({
              ...item,
              options: Array.isArray(item.options) 
                ? item.options
                : typeof item.options === 'string'
                  ? JSON.parse(item.options)
                  : undefined
            }));
            const translatedData = await translationService.translateLessonContent(convertedExercises);
            setExercises(translatedData);
          }
        } catch (error) {
          console.error('Error loading exercises:', error);
          setExercises([]);
        }
      }
    } catch (error) {
      console.error('Error loading lesson data:', error);
      toast({
        title: "Error",
        description: "Failed to load lesson content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonCompletion = async () => {
    if (!user || !lessonId) return;
    try {
      // Query user_progress for this lesson — use the NEW endpoint
      const res = await fetch(`http://localhost:3001/api/lessons/progress/lesson/${user.id}/${lessonId}`);
      if (res.ok) {
        const d = await res.json();
        setCompleted(Boolean(d.completed));
      } else {
        setCompleted(false);
      }
    } catch (err) {
      setCompleted(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!user || !lessonId) return;
    try {
      await api.markLessonCompleted(lessonId, user.id);
      setCompleted(true);
      toast({
        title: "Lesson Completed!",
        description: "This lesson has been marked as completed for your progress.",
      });
    } catch (err:any) {
      toast({
        title: "Error",
        description: err.message || "Could not mark lesson as completed.",
        variant: "destructive",
      });
    }
  };

  // Utility to check if this is an English course
  const isEnglishCourse =
    lesson &&
    (
      lesson.course_name?.toLowerCase().includes("english") ||
      lesson.unit_name?.toLowerCase().includes("english") ||
      lesson.name?.toLowerCase().includes("english")
    );

  const isEnglish = translationService.getCurrentLanguage().code === 'en';

  if (!hasSelectedLanguage) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing lesson...</p>
          </div>
        </div>
        <LanguagePreferenceDialog
          isOpen={showLanguageDialog}
          onLanguageSelect={handleLanguageSelect}
          onClose={() => setShowLanguageDialog(false)}
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson not found</h2>
          <Button onClick={() => navigate('/')} className="bg-green-500 hover:bg-green-600 text-white">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </div>
            <div>
              <Badge className={getLessonColor(lesson.lesson_type)}>
                {getLessonIcon(lesson.lesson_type)}
                {lesson.lesson_type}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.name}</h1>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Vocabulary Content */}
          {lesson.lesson_type === 'vocabulary' && (
            vocabulary.length > 0 ? (
              <div className="space-y-4">
                {vocabulary.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{item.word}</h3>
                          {!isEnglishCourse && item.translation && (
                            <p className="text-md text-gray-600 italic">{item.translation}</p>
                          )}
                          {item.pronunciation && (
                            <p className="text-sm text-gray-500">/{item.pronunciation}/</p>
                          )}
                          {item.word_type && (
                            <Badge variant="outline">
                              {item.word_type}
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {item.example_sentence && (
                        <div>
                          <p className="text-gray-700">{item.example_sentence}</p>
                          {!isEnglishCourse && item.example_translation && (
                            <p className="text-gray-600 italic">{item.example_translation}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className={`p-4 rounded-full mx-auto mb-4 w-fit ${getLessonColor(lesson.lesson_type)}`}>
                    {getLessonIcon(lesson.lesson_type)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {translationService.translate('Content coming soon!')}
                  </h3>
                  <p className="text-gray-600">
                    This {lesson.lesson_type} lesson will have content added soon. Check back later!
                  </p>
                </CardContent>
              </Card>
            )
          )}

          {/* Phrases Content */}
          {lesson.lesson_type === 'phrases' && (
            phrases.length > 0 ? (
              <div className="space-y-4">
                {phrases.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{item.phrase}</h3>
                          {!isEnglishCourse && item.translation && (
                            <p className="text-md text-gray-600 italic">{item.translation}</p>
                          )}
                          {item.pronunciation && (
                            <p className="text-sm text-gray-500">/{item.pronunciation}/</p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {item.context && (
                        <Badge variant="outline">
                          {item.context}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className={`p-4 rounded-full mx-auto mb-4 w-fit ${getLessonColor(lesson.lesson_type)}`}>
                    {getLessonIcon(lesson.lesson_type)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {translationService.translate('Content coming soon!')}
                  </h3>
                  <p className="text-gray-600">
                    This {lesson.lesson_type} lesson will have content added soon. Check back later!
                  </p>
                </CardContent>
              </Card>
            )
          )}

          {/* Grammar Content */}
          {lesson.lesson_type === 'grammar' && (
            grammar.length > 0 ? (
              <div className="space-y-4">
                {grammar.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{item.explanation}</p>
                      {item.examples && item.examples.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">
                            {translationService.translate('Examples:')}
                          </h4>
                          {item.examples.map((example, idx) => (
                            <div key={idx} className="border-l-4 border-purple-500 pl-4">
                              <p className="font-medium text-gray-900">{example.original}</p>
                              {!isEnglishCourse && (
                                <p className="text-gray-600 italic">{example.translation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className={`p-4 rounded-full mx-auto mb-4 w-fit ${getLessonColor(lesson.lesson_type)}`}>
                    {getLessonIcon(lesson.lesson_type)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {translationService.translate('Content coming soon!')}
                  </h3>
                  <p className="text-gray-600">
                    This {lesson.lesson_type} lesson will have content added soon. Check back later!
                  </p>
                </CardContent>
              </Card>
            )
          )}

          {/* Exercises Content */}
          {lesson.lesson_type === 'exercises' && (
            exercises.length > 0 ? (
              <div className="space-y-4">
                {exercises.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        {item.correct_answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className={`p-4 rounded-full mx-auto mb-4 w-fit ${getLessonColor(lesson.lesson_type)}`}>
                    {getLessonIcon(lesson.lesson_type)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {translationService.translate('Content coming soon!')}
                  </h3>
                  <p className="text-gray-600">
                    This {lesson.lesson_type} lesson will have content added soon. Check back later!
                  </p>
                </CardContent>
              </Card>
            )
          )}

          {/* Complete Lesson Button/Banner */}
          { !user ? null :
            <div className="text-center mt-8">
              {!completed ? (
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3 font-bold"
                  onClick={handleCompleteLesson}
                >
                  Complete Lesson
                </Button>
              ) : (
                <span className="inline-block bg-green-100 text-green-700 rounded px-4 py-2 font-semibold">
                  Lesson marked as completed 🎉
                </span>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default LessonView;