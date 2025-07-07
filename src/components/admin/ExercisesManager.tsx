
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Exercise {
  id: string;
  question: string;
  exercise_type: string;
  options: string;
  correct_answer: string;
  difficulty_level: string;
  points: number;
  order_index: number;
  lesson_name: string;
}

export function ExercisesManager() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    exercise_type: 'multiple_choice',
    options: '',
    correct_answer: '',
    difficulty_level: 'beginner',
    points: '10',
    hints: '',
    explanation: '',
    lesson_id: '',
    order_index: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch('https://languagelearningdep.onrender.com/api/exercises');
      if (!response.ok) throw new Error('Failed to fetch exercises');
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Error",
        description: "Failed to fetch exercises. Make sure the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const response = await fetch('https://languagelearningdep.onrender.com/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: formData.question,
          exercise_type: formData.exercise_type,
          options: formData.options.split('\n').filter(opt => opt.trim()),
          correct_answer: formData.correct_answer,
          difficulty_level: formData.difficulty_level,
          points: parseInt(formData.points) || 10,
          hints: formData.hints.split('\n').filter(hint => hint.trim()),
          explanation: formData.explanation,
          lesson_id: formData.lesson_id ? parseInt(formData.lesson_id) : null,
          order_index: parseInt(formData.order_index) || 0
        }),
      });

      if (!response.ok) throw new Error('Failed to add exercise');

      toast({
        title: "Success!",
        description: "Exercise added successfully",
      });

      setFormData({
        question: '', exercise_type: 'multiple_choice', options: '', correct_answer: '',
        difficulty_level: 'beginner', points: '10', hints: '', explanation: '',
        lesson_id: '', order_index: ''
      });
      setShowForm(false);
      fetchExercises();
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Exercises Management ({exercises.length} exercises)
            </CardTitle>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <Textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="What is the Spanish word for 'hello'?"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Exercise Type</label>
                  <Select value={formData.exercise_type} onValueChange={(value) => setFormData({ ...formData, exercise_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                      <SelectItem value="translation">Translation</SelectItem>
                      <SelectItem value="listening">Listening</SelectItem>
                      <SelectItem value="speaking">Speaking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Correct Answer</label>
                  <Input
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    placeholder="hola"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Options (one per line, for multiple choice)</label>
                <Textarea
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder="hola&#10;adiós&#10;por favor&#10;gracias"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hints (one per line)</label>
                <Textarea
                  value={formData.hints}
                  onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                  placeholder="This is a common greeting&#10;Used when meeting someone"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Explanation</label>
                <Textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explanation of the correct answer..."
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Points</label>
                  <Input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Lesson ID</label>
                  <Input
                    type="number"
                    value={formData.lesson_id}
                    onChange={(e) => setFormData({ ...formData, lesson_id: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order Index</label>
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={adding}>
                  {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Exercise
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {exercises.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Lesson</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell className="font-medium max-w-md truncate">{exercise.question}</TableCell>
                    <TableCell>{exercise.exercise_type}</TableCell>
                    <TableCell>{exercise.correct_answer}</TableCell>
                    <TableCell>{exercise.difficulty_level}</TableCell>
                    <TableCell>{exercise.points}</TableCell>
                    <TableCell>{exercise.lesson_name || 'No lesson'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No exercises found. Add your first exercise above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
