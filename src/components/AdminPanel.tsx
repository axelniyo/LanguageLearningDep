
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function AdminPanel() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [populated, setPopulated] = useState(false);
  const { toast } = useToast();

  const handlePopulateContent = async () => {
    setIsPopulating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('populate-language-content');
      
      if (error) throw error;
      
      setPopulated(true);
      toast({
        title: "Success!",
        description: `Content populated successfully! ${data.message}`,
      });
    } catch (error) {
      console.error('Error populating content:', error);
      toast({
        title: "Error",
        description: "Failed to populate language content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Database className="w-6 h-6" />
        Language Content Administration
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          This will populate the database with comprehensive Duolingo-style language learning content for all 30 supported languages. 
          Each language will have 15 units with vocabulary, phrases, grammar rules, and exercises.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Content Structure:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 30 Languages (English, Spanish, French, German, etc.)</li>
            <li>• 15 Units per language (Beginner → Intermediate → Advanced)</li>
            <li>• 4 Lesson types per unit (Vocabulary, Phrases, Grammar, Exercises)</li>
            <li>• Audio placeholders for text-to-speech integration</li>
            <li>• Difficulty progression and XP rewards</li>
          </ul>
        </div>

        {populated ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Content has been successfully populated!</span>
          </div>
        ) : (
          <Button 
            onClick={handlePopulateContent}
            disabled={isPopulating}
            size="lg"
            className="w-full"
          >
            {isPopulating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Populating Content...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Populate Language Content
              </>
            )}
          </Button>
        )}
        
        <div className="text-xs text-gray-500">
          <p>⚠️ This operation will create thousands of database entries. Only run this once.</p>
          <p>📊 Expected: ~1,800 vocabulary items, ~450 phrases, ~450 grammar rules, ~900 exercises</p>
        </div>
      </div>
    </div>
  );
}
