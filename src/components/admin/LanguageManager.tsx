import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Plus, Edit, Save, Languages } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface NewLanguage {
  name: string;
  code: string;
  flag_emoji: string;
  description: string;
}

export function LanguageManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLanguage, setNewLanguage] = useState<NewLanguage>({
    name: '',
    code: '',
    flag_emoji: '',
    description: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: languages, isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: api.getLanguages,
  });

  const addLanguageMutation = useMutation({
    mutationFn: async (language: NewLanguage) => {
      const response = await fetch('https://languagelearningdep.onrender.com/api/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(language),
      });
      if (!response.ok) throw new Error('Failed to add language');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      setIsDialogOpen(false);
      setNewLanguage({ name: '', code: '', flag_emoji: '', description: '' });
      toast({
        title: "Success!",
        description: "Language added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add language",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLanguage.name || !newLanguage.code) {
      toast({
        title: "Error",
        description: "Name and code are required",
        variant: "destructive",
      });
      return;
    }
    addLanguageMutation.mutate(newLanguage);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Language Management
            </CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Language</DialogTitle>
                <DialogDescription>
                  Add a new language to the system with all required information.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Language Name *</Label>
                  <Input
                    id="name"
                    value={newLanguage.name}
                    onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                    placeholder="e.g., Spanish, French, German"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Language Code *</Label>
                  <Input
                    id="code"
                    value={newLanguage.code}
                    onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value.toLowerCase() })}
                    placeholder="e.g., es, fr, de"
                    maxLength={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flag">Flag Emoji</Label>
                  <Input
                    id="flag"
                    value={newLanguage.flag_emoji}
                    onChange={(e) => setNewLanguage({ ...newLanguage, flag_emoji: e.target.value })}
                    placeholder="e.g., 🇪🇸, 🇫🇷, 🇩🇪"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newLanguage.description}
                    onChange={(e) => setNewLanguage({ ...newLanguage, description: e.target.value })}
                    placeholder="Brief description of the language"
                  />
                </div>
                <Button type="submit" disabled={addLanguageMutation.isPending} className="w-full">
                  {addLanguageMutation.isPending ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Language
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading languages...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flag</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages?.map((language) => (
                  <TableRow key={language.id}>
                    <TableCell className="text-2xl">{language.flag_emoji}</TableCell>
                    <TableCell className="font-medium">{language.name}</TableCell>
                    <TableCell className="font-mono text-sm">{language.code}</TableCell>
                    <TableCell className="max-w-xs truncate">{language.description}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
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
