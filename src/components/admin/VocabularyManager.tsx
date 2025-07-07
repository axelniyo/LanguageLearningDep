
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example_sentence: string;
  example_translation: string;
  word_type: string;
  difficulty_level: string;
  order_index: number;
  lesson_name: string;
}

export function VocabularyManager() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    word: '',
    translation: '',
    pronunciation: '',
    example_sentence: '',
    example_translation: '',
    word_type: 'noun',
    difficulty_level: 'beginner',
    lesson_id: '',
    order_index: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    try {
      const response = await fetch('https://languagelearningdep.onrender.com/api/vocabulary');
      if (!response.ok) throw new Error('Failed to fetch vocabulary');
      const data = await response.json();
      setVocabulary(data);
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vocabulary. Make sure the backend server is running.",
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
      const response = await fetch('https://languagelearningdep.onrender.com/api/vocabulary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: formData.word,
          translation: formData.translation,
          pronunciation: formData.pronunciation,
          example_sentence: formData.example_sentence,
          example_translation: formData.example_translation,
          word_type: formData.word_type,
          difficulty_level: formData.difficulty_level,
          lesson_id: formData.lesson_id ? parseInt(formData.lesson_id) : null,
          order_index: parseInt(formData.order_index) || 0
        }),
      });

      if (!response.ok) throw new Error('Failed to add vocabulary item');

      toast({
        title: "Success!",
        description: "Vocabulary item added successfully",
      });

      setFormData({
        word: '', translation: '', pronunciation: '', example_sentence: '',
        example_translation: '', word_type: 'noun', difficulty_level: 'beginner',
        lesson_id: '', order_index: ''
      });
      setShowForm(false);
      fetchVocabulary();
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      toast({
        title: "Error",
        description: "Failed to add vocabulary item",
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
              <BookOpen className="w-5 h-5" />
              Vocabulary Management ({vocabulary.length} items)
            </CardTitle>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vocabulary
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Word</label>
                  <Input
                    value={formData.word}
                    onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                    placeholder="e.g., hola"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Translation</label>
                  <Input
                    value={formData.translation}
                    onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                    placeholder="e.g., hello"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pronunciation</label>
                  <Input
                    value={formData.pronunciation}
                    onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                    placeholder="e.g., /ˈoːla/"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Word Type</label>
                  <Select value={formData.word_type} onValueChange={(value) => setFormData({ ...formData, word_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noun">Noun</SelectItem>
                      <SelectItem value="verb">Verb</SelectItem>
                      <SelectItem value="adjective">Adjective</SelectItem>
                      <SelectItem value="adverb">Adverb</SelectItem>
                      <SelectItem value="preposition">Preposition</SelectItem>
                      <SelectItem value="conjunction">Conjunction</SelectItem>
                      <SelectItem value="interjection">Interjection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Example Sentence</label>
                <Textarea
                  value={formData.example_sentence}
                  onChange={(e) => setFormData({ ...formData, example_sentence: e.target.value })}
                  placeholder="Example sentence using this word..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Example Translation</label>
                <Textarea
                  value={formData.example_translation}
                  onChange={(e) => setFormData({ ...formData, example_translation: e.target.value })}
                  placeholder="Translation of the example sentence..."
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
                  Add Vocabulary
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {vocabulary.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Translation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Lesson</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vocabulary.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.word}</TableCell>
                    <TableCell>{item.translation}</TableCell>
                    <TableCell>{item.word_type}</TableCell>
                    <TableCell>{item.difficulty_level}</TableCell>
                    <TableCell>{item.lesson_name || 'No lesson'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No vocabulary items found. Add your first word above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
