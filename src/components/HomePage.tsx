import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Globe, Users, Award } from 'lucide-react';
import { api, type Course, type Language } from '@/services/api';
import { LanguagePreferenceDialog } from '@/components/LanguagePreferenceDialog';
import { translationService } from '@/services/translationService';

interface HomePageProps {
  openAuthModal?: (mode: 'signin' | 'signup') => void;
}

export function HomePage({ openAuthModal }: HomePageProps) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLangDialog, setShowLangDialog] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // load stored preferred language if there is any
    translationService.loadStoredLanguage();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, languagesData] = await Promise.all([
        api.getCourses(),
        api.getLanguages()
      ]);
      
      setCourses(coursesData);
      setLanguages(languagesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = (courseId: string) => {
    // If language is already set, navigate directly, else open dialog
    const lang = translationService.getCurrentLanguage();
    if (lang && lang.code) {
      navigate(`/course/${courseId}`);
    } else {
      setPendingCourseId(courseId);
      setShowLangDialog(true);
    }
  };

  const handleLanguageSelect = (languageCode: string, languageName: string) => {
    translationService.setLanguage(languageCode, languageName);
    setShowLangDialog(false);
    if (pendingCourseId) {
      navigate(`/course/${pendingCourseId}`);
      setPendingCourseId(null);
    }
  };

  const handleLangDialogClose = () => {
    setShowLangDialog(false);
    setPendingCourseId(null);
  };

  const handleChangeLanguage = () => {
    setShowLangDialog(true);
    setPendingCourseId(null); // Not tied to a specific course
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">

        </div>

        {/* NEW: Change Language Button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="duolingoSecondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleChangeLanguage}
          >
            <Globe className="w-4 h-4" />
            Change Language
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="flex items-center p-6">
              <Globe className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{languages.length}</p>
                <p className="text-gray-600">Languages</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <BookOpen className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                <p className="text-gray-600">Courses</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Students</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Award className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Badge Level</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Courses */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{course.language.flag_emoji}</span>
                    <div>
                      <CardTitle className="text-lg">{course.language.name}</CardTitle>
                      <p className="text-sm text-gray-600">{course.language.code.toUpperCase()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <Button 
                    onClick={() => handleStartCourse(course.id)} 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Next Steps */}

      </div>
      {/* Language Preference Popup */}
      <LanguagePreferenceDialog 
        isOpen={showLangDialog}
        onLanguageSelect={handleLanguageSelect}
        onClose={handleLangDialogClose}
      />

    </div>
  );
}