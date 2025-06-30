
-- Create table for storing lessons within units
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  lesson_type VARCHAR(50) DEFAULT 'vocabulary', -- vocabulary, grammar, phrases, exercises
  order_index INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for vocabulary items
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  word VARCHAR(255) NOT NULL,
  translation VARCHAR(255) NOT NULL,
  pronunciation VARCHAR(255),
  audio_url VARCHAR(500),
  example_sentence TEXT,
  example_translation TEXT,
  word_type VARCHAR(50), -- noun, verb, adjective, etc.
  difficulty_level VARCHAR(20) DEFAULT 'beginner',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for phrases
CREATE TABLE IF NOT EXISTS public.phrases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  phrase TEXT NOT NULL,
  translation TEXT NOT NULL,
  pronunciation VARCHAR(500),
  audio_url VARCHAR(500),
  context VARCHAR(255), -- greeting, travel, food, etc.
  difficulty_level VARCHAR(20) DEFAULT 'beginner',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for grammar rules
CREATE TABLE IF NOT EXISTS public.grammar_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  explanation TEXT NOT NULL,
  examples JSON, -- Array of example objects with original and translation
  difficulty_level VARCHAR(20) DEFAULT 'beginner',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update the exercises table to be more comprehensive
ALTER TABLE public.exercises 
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20) DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS hints JSON,
ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Enable RLS on new tables
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lessons (public read access for course content)
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view vocabulary" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "Anyone can view phrases" ON public.phrases FOR SELECT USING (true);
CREATE POLICY "Anyone can view grammar rules" ON public.grammar_rules FOR SELECT USING (true);

-- Insert the 30 most spoken languages
INSERT INTO public.languages (name, code, flag_emoji, description) VALUES
('English', 'en', '🇺🇸', 'Learn the global language of business and communication'),
('Mandarin Chinese', 'zh', '🇨🇳', 'Master the most spoken language in the world'),
('Hindi', 'hi', '🇮🇳', 'Discover the beautiful language of India'),
('Spanish', 'es', '🇪🇸', 'Speak the language of over 500 million people'),
('French', 'fr', '🇫🇷', 'Learn the language of love and culture'),
('Standard Arabic', 'ar', '🇸🇦', 'Understand the language of the Quran and Middle East'),
('Bengali', 'bn', '🇧🇩', 'Explore the rich literary language of Bengal'),
('Russian', 'ru', '🇷🇺', 'Master the language of the largest country'),
('Portuguese', 'pt', '🇧🇷', 'Speak the language of Brazil and Portugal'),
('Urdu', 'ur', '🇵🇰', 'Learn the poetic language of Pakistan'),
('Indonesian', 'id', '🇮🇩', 'Discover the gateway to Southeast Asia'),
('German', 'de', '🇩🇪', 'Learn the language of innovation and philosophy'),
('Japanese', 'ja', '🇯🇵', 'Master the fascinating language of Japan'),
('Swahili', 'sw', '🇹🇿', 'Speak the lingua franca of East Africa'),
('Marathi', 'mr', '🇮🇳', 'Learn the cultural language of Maharashtra'),
('Telugu', 'te', '🇮🇳', 'Discover the classical language of South India'),
('Turkish', 'tr', '🇹🇷', 'Bridge Europe and Asia with Turkish'),
('Korean', 'ko', '🇰🇷', 'Learn the dynamic language of K-culture'),
('Tamil', 'ta', '🇮🇳', 'Master one of the oldest living languages'),
('Vietnamese', 'vi', '🇻🇳', 'Explore the tonal language of Vietnam'),
('Italian', 'it', '🇮🇹', 'Speak the language of art and cuisine'),
('Hausa', 'ha', '🇳🇬', 'Learn the major language of West Africa'),
('Thai', 'th', '🇹🇭', 'Discover the melodic language of Thailand'),
('Gujarati', 'gu', '🇮🇳', 'Learn the business language of Gujarat'),
('Polish', 'pl', '🇵🇱', 'Master the Slavic language of Poland'),
('Kannada', 'kn', '🇮🇳', 'Explore the Dravidian language of Karnataka'),
('Burmese', 'my', '🇲🇲', 'Learn the script and sounds of Myanmar'),
('Persian (Farsi)', 'fa', '🇮🇷', 'Discover the poetic language of Persia'),
('Malay', 'ms', '🇲🇾', 'Speak the unifying language of Malaysia'),
('Amharic', 'am', '🇪🇹', 'Learn the ancient language of Ethiopia')
ON CONFLICT (code) DO NOTHING;

-- Create courses for each language (Beginner to Advanced)
INSERT INTO public.courses (name, description, language_id, level_requirement, order_index)
SELECT 
  l.name || ' - Complete Course',
  'Master ' || l.name || ' from beginner to advanced level',
  l.id,
  1,
  1
FROM public.languages l
ON CONFLICT DO NOTHING;

-- Create 15 units for each course (5 beginner, 5 intermediate, 5 advanced)
INSERT INTO public.units (name, description, course_id, order_index, xp_reward)
SELECT 
  CASE 
    WHEN series.i <= 5 THEN 'Unit ' || series.i || ': ' || 
      CASE series.i 
        WHEN 1 THEN 'Basics & Greetings'
        WHEN 2 THEN 'Family & Numbers'
        WHEN 3 THEN 'Food & Drinks'
        WHEN 4 THEN 'Colors & Clothing'
        WHEN 5 THEN 'Time & Weather'
      END
    WHEN series.i <= 10 THEN 'Unit ' || series.i || ': ' ||
      CASE series.i
        WHEN 6 THEN 'Daily Routines'
        WHEN 7 THEN 'Travel & Directions'
        WHEN 8 THEN 'Shopping & Money'
        WHEN 9 THEN 'Health & Body'
        WHEN 10 THEN 'Work & Education'
      END
    ELSE 'Unit ' || series.i || ': ' ||
      CASE series.i
        WHEN 11 THEN 'Culture & Traditions'
        WHEN 12 THEN 'Technology & Media'
        WHEN 13 THEN 'Politics & Society'
        WHEN 14 THEN 'Science & Nature'
        WHEN 15 THEN 'Literature & Arts'
      END
  END as name,
  CASE 
    WHEN series.i <= 5 THEN 'Beginner level - Learn essential vocabulary and basic grammar'
    WHEN series.i <= 10 THEN 'Intermediate level - Practice everyday conversations and complex grammar'
    ELSE 'Advanced level - Master complex topics and cultural nuances'
  END as description,
  c.id,
  series.i,
  series.i * 50 -- XP increases with difficulty
FROM public.courses c
CROSS JOIN generate_series(1, 15) as series(i)
ON CONFLICT DO NOTHING;
