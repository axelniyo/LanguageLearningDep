// Simple translation service - in a real app, you'd use Google Translate API or similar
const TRANSLATIONS: Record<string, Record<string, string>> = {
  // Common UI translations
  'en': {
    'Back to Course': 'Back to Course',
    'Content coming soon!': 'Content coming soon!',
    'Examples:': 'Examples:',
    'Answer:': 'Answer:',
    'Exercise': 'Exercise'
  },
  'es': {
    'Back to Course': 'Volver al Curso',
    'Content coming soon!': '¡Contenido próximamente!',
    'Examples:': 'Ejemplos:',
    'Answer:': 'Respuesta:',
    'Exercise': 'Ejercicio'
  },
  'fr': {
    'Back to Course': 'Retour au Cours',
    'Content coming soon!': 'Contenu à venir!',
    'Examples:': 'Exemples:',
    'Answer:': 'Réponse:',
    'Exercise': 'Exercice'
  },
  'de': {
    'Back to Course': 'Zurück zum Kurs',
    'Content coming soon!': 'Inhalt kommt bald!',
    'Examples:': 'Beispiele:',
    'Answer:': 'Antwort:',
    'Exercise': 'Übung'
  },
  'pt': {
    'Back to Course': 'Voltar ao Curso',
    'Content coming soon!': 'Conteúdo em breve!',
    'Examples:': 'Exemplos:',
    'Answer:': 'Resposta:',
    'Exercise': 'Exercício'
  },
  'it': {
    'Back to Course': 'Torna al Corso',
    'Content coming soon!': 'Contenuto in arrivo!',
    'Examples:': 'Esempi:',
    'Answer:': 'Risposta:',
    'Exercise': 'Esercizio'
  },
  'ru': {
    'Back to Course': 'Назад к курсу',
    'Content coming soon!': 'Контент скоро появится!',
    'Examples:': 'Примеры:',
    'Answer:': 'Ответ:',
    'Exercise': 'Упражнение'
  },
  'ja': {
    'Back to Course': 'コースに戻る',
    'Content coming soon!': 'コンテンツ近日公開！',
    'Examples:': '例：',
    'Answer:': '答え：',
    'Exercise': '練習'
  },
  'ko': {
    'Back to Course': '코스로 돌아가기',
    'Content coming soon!': '콘텐츠 곧 출시!',
    'Examples:': '예시:',
    'Answer:': '답변:',
    'Exercise': '연습'
  },
  'zh': {
    'Back to Course': '返回课程',
    'Content coming soon!': '内容即将推出！',
    'Examples:': '例子：',
    'Answer:': '答案：',
    'Exercise': '练习'
  }
};

class TranslationService {
  private currentLanguage: string = 'en';
  private currentLanguageName: string = 'English';

  setLanguage(languageCode: string, languageName: string) {
    this.currentLanguage = languageCode;
    this.currentLanguageName = languageName;

    // Store in localStorage for persistence
    localStorage.setItem('preferredLanguage', languageCode);
    localStorage.setItem('preferredLanguageName', languageName);
    // Diagnostic
    console.log('[TranslationService.setLanguage] Set to', languageCode, languageName);
  }

  getCurrentLanguage() {
    return {
      code: this.currentLanguage,
      name: this.currentLanguageName
    };
  }

  loadStoredLanguage() {
    const storedCode = localStorage.getItem('preferredLanguage');
    const storedName = localStorage.getItem('preferredLanguageName');
    // Diagnostic
    console.log('[TranslationService.loadStoredLanguage] Loaded from localStorage:', storedCode, storedName);

    if (storedCode && storedName) {
      this.currentLanguage = storedCode;
      this.currentLanguageName = storedName;
    }
  }

  translate(text: string): string {
    if (this.currentLanguage === 'en') {
      return text;
    }

    const languageTranslations = TRANSLATIONS[this.currentLanguage];
    // Diagnostic
    // Commented out for easier debugging: console.log('[TranslationService.translate]', this.currentLanguage, text, languageTranslations ? languageTranslations[text] : undefined);
    if (languageTranslations && languageTranslations[text]) {
      return languageTranslations[text];
    }

    // For content that's not in our basic translation dictionary,
    // in a real app you'd call a translation API here
    return text;
  }

  // Simulate translating lesson content
  async translateLessonContent(content: any): Promise<any> {
    // For demo, just return original if current language is not English,
    // because we do NOT have translations for non-English in the DB.
    return content;
  }
}

export const translationService = new TranslationService();