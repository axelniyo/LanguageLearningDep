
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Plus, BookOpen, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface NewCourse {
  name: string;
  description: string;
  language_id: string;
  cefr_level: string;
  level_requirement: number;
}

const CEFR_LEVELS = [
  { value: 'A1', label: 'A1 - Beginner' },
  { value: 'A2', label: 'A2 - Elementary' },
  { value: 'B1', label: 'B1 - Intermediate' },
  { value: 'B2', label: 'B2 - Upper Intermediate' },
  { value: 'C1', label: 'C1 - Advanced' },
  { value: 'C2', label: 'C2 - Proficient' },
];

export function CourseManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<NewCourse>({
    name: '',
    description: '',
    language_id: '',
    cefr_level: '',
    level_requirement: 1
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: api.getLanguages,
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: api.getCourses,
  });

  const addCourseMutation = useMutation({
    mutationFn: async (course: NewCourse) => {
      console.log('Frontend: Sending course data:', course);
      const response = await fetch('https://languagelearningdep.onrender.com/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      console.log('Frontend: Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Frontend: Error response:', errorData);
        throw new Error(errorData.message || 'Failed to add course');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsDialogOpen(false);
      setNewCourse({ name: '', description: '', language_id: '', cefr_level: '', level_requirement: 1 });
      toast({
        title: "Success!",
        description: "Course added successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Frontend: Mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add course",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Frontend: Form submitted with data:', newCourse);
    if (!newCourse.name || !newCourse.language_id || !newCourse.cefr_level) {
      toast({
        title: "Error",
        description: "Name, language, and CEFR level are required",
        variant: "destructive",
      });
      return;
    }
    addCourseMutation.mutate(newCourse);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Management
            </CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>
                  Create a new language course with specific CEFR level.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course-name">Course Name *</Label>
                  <Input
                    id="course-name"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    placeholder="e.g., Spanish for Beginners"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language *</Label>
                  <Select value={newCourse.language_id} onValueChange={(value) => setNewCourse({ ...newCourse, language_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages?.map((language) => (
                        <SelectItem key={language.id} value={language.id}>
                          {language.flag_emoji} {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cefr-level">CEFR Level *</Label>
                  <Select value={newCourse.cefr_level} onValueChange={(value) => setNewCourse({ ...newCourse, cefr_level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CEFR level" />
                    </SelectTrigger>
                    <SelectContent>
                      {CEFR_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    placeholder="Course description and objectives"
                  />
                </div>
                <Button type="submit" disabled={addCourseMutation.isPending} className="w-full">
                  {addCourseMutation.isPending ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Course
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading courses...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>CEFR Level</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses?.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>
                      {course.language.flag_emoji} {course.language.name}
                    </TableCell>
                    <TableCell>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        A1-C2
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{course.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
