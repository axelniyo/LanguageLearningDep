
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const TOP_30_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Mandarin Chinese', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ar', name: 'Standard Arabic', flag: '🇸🇦' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'my', name: 'Burmese', flag: '🇲🇲' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' }
];

interface LanguagePreferenceDialogProps {
  isOpen: boolean;
  onLanguageSelect: (languageCode: string, languageName: string) => void;
  onClose: () => void;
}

export function LanguagePreferenceDialog({ isOpen, onLanguageSelect, onClose }: LanguagePreferenceDialogProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const handleConfirm = () => {
    if (selectedLanguage) {
      const language = TOP_30_LANGUAGES.find(lang => lang.code === selectedLanguage);
      if (language) {
        // Diagnostic log
        console.log('[LanguagePreferenceDialog] handleConfirm - code:', language.code, 'name:', language.name);
        onLanguageSelect(language.code, language.name);
      } else {
        console.log('[LanguagePreferenceDialog] handleConfirm - language not found for:', selectedLanguage);
      }
    } else {
      console.log('[LanguagePreferenceDialog] handleConfirm - no language selected');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Globe className="w-6 h-6 text-green-600" />
            What language do you speak?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Choose your native language to get translations in your preferred language during lessons.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select your language:
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full bg-white border-gray-300">
                <SelectValue placeholder="Choose a language..." />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white border shadow-lg z-50">
                {TOP_30_LANGUAGES.map((language) => (
                  <SelectItem 
                    key={language.code} 
                    value={language.code}
                    className="flex items-center gap-2 hover:bg-gray-100"
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedLanguage}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}