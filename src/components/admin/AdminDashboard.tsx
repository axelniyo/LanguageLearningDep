import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Languages, BookOpen, FileText, MessageSquare, PenTool, Plus } from 'lucide-react';
import { LanguageManager } from '@/components/admin/LanguageManager';
import { CourseManager } from '@/components/admin/CourseManager';
import { UnitManager } from '@/components/admin/UnitManager';
import { VocabularyManager } from '@/components/admin/VocabularyManager';
import { GrammarManager } from '@/components/admin/GrammarManager';
import { PhrasesManager } from '@/components/admin/PhrasesManager';
import { ExercisesManager } from '@/components/admin/ExercisesManager';
import { AdminStats } from '@/components/admin/AdminStats';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Language Learning Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage languages, courses, units, vocabulary, grammar, phrases, and exercises
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="languages" className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">Languages</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="units" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Units</span>
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Vocabulary</span>
            </TabsTrigger>
            <TabsTrigger value="grammar" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">Grammar</span>
            </TabsTrigger>
            <TabsTrigger value="phrases" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Phrases</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Exercises</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('languages')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Languages</CardTitle>
                  <Languages className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">30</div>
                  <p className="text-xs text-muted-foreground">Supported languages</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('courses')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">90+</div>
                  <p className="text-xs text-muted-foreground">Language courses</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('units')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Units</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">450+</div>
                  <p className="text-xs text-muted-foreground">Learning units</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('vocabulary')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vocabulary</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.8k+</div>
                  <p className="text-xs text-muted-foreground">Vocabulary items</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="languages">
            <LanguageManager />
          </TabsContent>

          <TabsContent value="courses">
            <CourseManager />
          </TabsContent>

          <TabsContent value="units">
            <UnitManager />
          </TabsContent>

          <TabsContent value="vocabulary">
            <VocabularyManager />
          </TabsContent>

          <TabsContent value="grammar">
            <GrammarManager />
          </TabsContent>

          <TabsContent value="phrases">
            <PhrasesManager />
          </TabsContent>

          <TabsContent value="exercises">
            <ExercisesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
