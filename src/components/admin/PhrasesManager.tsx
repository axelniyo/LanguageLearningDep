
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  pronunciation: string;
  context: string;
  difficulty_level: string;
  order_index: number;
  lesson_name: string;
}

export function PhrasesManager() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    phrase: '',
    translation: '',
    pronunciation: '',
    context: '',
    difficulty_level: 'beginner',
    lesson_id: '',
    order_index: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPhrases();
  }, []);

  const fetchPhrases = async () => {
    try {
      const response = await fetch('https://languagelearningdep.onrender.com/api/phrases');
      if (!response.ok) throw new Error('Failed to fetch phrases');
      const data = await response.json();
      setPhrases(data);
    } catch (error) {
      console.error('Error fetching phrases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch phrases. Make sure the backend server is running.",
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
      const response = await fetch('https://languagelearningdep.onrender.com/api/phrases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phrase: formData.phrase,
          translation: formData.translation,
          pronunciation: formData.pronunciation,
          context: formData.context,
          difficulty_level: formData.difficulty_level,
          lesson_id: formData.lesson_id ? parseInt(formData.lesson_id) : null,
          order_index: parseInt(formData.order_index) || 0
        }),
      });

      if (!response.ok) throw new Error('Failed to add phrase');

      toast({
        title: "Success!",
        description: "Phrase added successfully",
      });

      setFormData({
        phrase: '', translation: '', pronunciation: '', context: '',
        difficulty_level: 'beginner', lesson_id: '', order_index: ''
      });
      setShowForm(false);
      fetchPhrases();
    } catch (error) {
      console.error('Error adding phrase:', error);
      toast({
        title: "Error",
        description: "Failed to add phrase",
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
              <MessageSquare className="w-5 h-5" />
              Phrases & Dialogues Management ({phrases.length} phrases)
            </CardTitle>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Phrase
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phrase</label>
                  <Input
                    value={formData.phrase}
                    onChange={(e) => setFormData({ ...formData, phrase: e.target.value })}
                    placeholder="e.g., ¿Cómo estás?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Translation</label>
                  <Input
                    value={formData.translation}
                    onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                    placeholder="e.g., How are you?"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pronunciation</label>
                <Input
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  placeholder="e.g., /ˈkoːmo esˈtas/"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Context</label>
                <Textarea
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="When and how to use this phrase..."
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
                  Add Phrase
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {phrases.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phrase</TableHead>
                  <TableHead>Translation</TableHead>
                  <TableHead>Context</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Lesson</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phrases.map((phrase) => (
                  <TableRow key={phrase.id}>
                    <TableCell className="font-medium">{phrase.phrase}</TableCell>
                    <TableCell>{phrase.translation}</TableCell>
                    <TableCell className="max-w-md truncate">{phrase.context}</TableCell>
                    <TableCell>{phrase.difficulty_level}</TableCell>
                    <TableCell>{phrase.lesson_name || 'No lesson'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No phrases found. Add your first phrase above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
