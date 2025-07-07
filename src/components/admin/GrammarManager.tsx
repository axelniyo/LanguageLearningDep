
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, PenTool, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GrammarRule {
  id: string;
  title: string;
  explanation: string;
  examples: string;
  difficulty_level: string;
  order_index: number;
  lesson_name: string;
}

export function GrammarManager() {
  const [grammarRules, setGrammarRules] = useState<GrammarRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    explanation: '',
    examples: '',
    difficulty_level: 'beginner',
    lesson_id: '',
    order_index: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGrammarRules();
  }, []);

  const fetchGrammarRules = async () => {
    try {
      const response = await fetch('https://languagelearningdep.onrender.com/api/grammar');
      if (!response.ok) throw new Error('Failed to fetch grammar rules');
      const data = await response.json();
      setGrammarRules(data);
    } catch (error) {
      console.error('Error fetching grammar rules:', error);
      toast({
        title: "Error",
        description: "Failed to fetch grammar rules. Make sure the backend server is running.",
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
      const response = await fetch('https://languagelearningdep.onrender.com//api/grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          explanation: formData.explanation,
          examples: formData.examples.split('\n').filter(ex => ex.trim()),
          difficulty_level: formData.difficulty_level,
          lesson_id: formData.lesson_id ? parseInt(formData.lesson_id) : null,
          order_index: parseInt(formData.order_index) || 0
        }),
      });

      if (!response.ok) throw new Error('Failed to add grammar rule');

      toast({
        title: "Success!",
        description: "Grammar rule added successfully",
      });

      setFormData({
        title: '', explanation: '', examples: '', difficulty_level: 'beginner',
        lesson_id: '', order_index: ''
      });
      setShowForm(false);
      fetchGrammarRules();
    } catch (error) {
      console.error('Error adding grammar rule:', error);
      toast({
        title: "Error",
        description: "Failed to add grammar rule",
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
              <PenTool className="w-5 h-5" />
              Grammar Management ({grammarRules.length} rules)
            </CardTitle>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Grammar Rule
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Present Tense - Regular Verbs"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Explanation</label>
                <Textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Detailed explanation of the grammar rule..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Examples (one per line)</label>
                <Textarea
                  value={formData.examples}
                  onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                  placeholder="I walk to school every day.&#10;She walks her dog in the morning.&#10;We walk together on weekends."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                  Add Grammar Rule
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {grammarRules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Explanation</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Lesson</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grammarRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.title}</TableCell>
                    <TableCell className="max-w-md truncate">{rule.explanation}</TableCell>
                    <TableCell>{rule.difficulty_level}</TableCell>
                    <TableCell>{rule.lesson_name || 'No lesson'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <PenTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No grammar rules found. Add your first rule above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
