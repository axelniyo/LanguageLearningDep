
-- Complete 2-Year English Course Content (100 Weeks)
-- This script works with MariaDB/MySQL (XAMPP compatible)
-- Follows Languages → Courses → Units → Lessons → Content hierarchy

-- First, get or create the English language
SET @english_language_id = (SELECT id FROM languages WHERE code = 'en' OR name LIKE '%English%' LIMIT 1);

-- If English language doesn't exist, create it
INSERT IGNORE INTO languages (name, code, flag_emoji, description) VALUES
('English', 'en', '🇺🇸', 'Learn the global language of business and communication');

-- Get the English language ID again (in case we just created it)
SET @english_language_id = (SELECT id FROM languages WHERE code = 'en' LIMIT 1);

-- Create the English course if it doesn't exist
INSERT IGNORE INTO courses (name, description, language_id, level_requirement, order_index) VALUES
('English - Complete Course', 'Master English from beginner to advanced level', @english_language_id, 1, 1);

-- Get the English course ID
SET @english_course_id = (SELECT id FROM courses WHERE name = 'English - Complete Course' LIMIT 1);

-- ==========================================
-- STEP 1: CREATE UNITS (100 weeks = 100 units)
-- ==========================================

-- Create 100 units for the 2-year English course
INSERT INTO units (course_id, name, description, order_index, xp_reward) VALUES
-- Weeks 1-25: Primary Level (Grades 1-5)
(@english_course_id, 'Week 1: ABCs and Basic Sounds', 'Learn the 26 letters of alphabet, basic phonetic sounds', 1, 50),
(@english_course_id, 'Week 2: Numbers and Colors', 'Count from 1 to 20, identify basic colors', 2, 60),
(@english_course_id, 'Week 3: Family and Body Parts', 'Name family members, identify body parts', 3, 70),
(@english_course_id, 'Week 4: Animals and Food', 'Name common animals, identify basic foods', 4, 80),
(@english_course_id, 'Week 5: Days and Weather', 'Days of the week, weather vocabulary', 5, 90),
(@english_course_id, 'Week 6: Home and Rooms', 'Parts of the house, furniture vocabulary', 6, 100),
(@english_course_id, 'Week 7: Clothing and Daily Activities', 'Clothing items, daily routine verbs', 7, 110),
(@english_course_id, 'Week 8: School and Learning', 'School supplies, classroom vocabulary', 8, 120),
(@english_course_id, 'Week 9: Transportation and Places', 'Vehicles and transport, places in town', 9, 130),
(@english_course_id, 'Week 10: Hobbies and Sports', 'Hobby vocabulary, sports and games', 10, 140),
(@english_course_id, 'Week 11: Simple Present Tense', 'Present tense formation, regular verbs', 11, 150),
(@english_course_id, 'Week 12: Questions and Answers', 'Wh-questions, Yes/No questions', 12, 160),
(@english_course_id, 'Week 13: Past Tense Introduction', 'Simple past tense, regular past verbs', 13, 170),
(@english_course_id, 'Week 14: Future Plans', 'Future with going to, plans and intentions', 14, 180),
(@english_course_id, 'Week 15: Comparisons and Descriptions', 'Comparative adjectives, descriptive language', 15, 190),
(@english_course_id, 'Week 16: Shopping and Money', 'Shopping vocabulary, numbers and prices', 16, 200),
(@english_course_id, 'Week 17: Health and Body', 'Health problems, medical vocabulary', 17, 210),
(@english_course_id, 'Week 18: Food and Cooking', 'Cooking verbs, kitchen vocabulary', 18, 220),
(@english_course_id, 'Week 19: Travel and Holidays', 'Travel vocabulary, holiday activities', 19, 230),
(@english_course_id, 'Week 20: Technology and Media', 'Technology vocabulary, media types', 20, 240),
(@english_course_id, 'Week 21: Environment and Nature', 'Nature vocabulary, environmental issues', 21, 250),
(@english_course_id, 'Week 22: Jobs and Professions', 'Job vocabulary, work activities', 22, 260),
(@english_course_id, 'Week 23: Emotions and Feelings', 'Emotion vocabulary, expressing feelings', 23, 270),
(@english_course_id, 'Week 24: Reading Comprehension', 'Reading strategies, story elements', 24, 280),
(@english_course_id, 'Week 25: Speaking and Listening Skills', 'Pronunciation practice, listening skills', 25, 290),

-- Weeks 26-60: Secondary Level (High School)
(@english_course_id, 'Week 26: Perfect Tenses Introduction', 'Present perfect basic, past participles', 26, 300),
(@english_course_id, 'Week 27: Modal Verbs Expansion', 'Ability, permission, obligation', 27, 310),
(@english_course_id, 'Week 28: Conditional Sentences', 'First conditional, real future possibilities', 28, 320),
(@english_course_id, 'Week 29: Passive Voice Introduction', 'Basic passive forms, agent and object focus', 29, 330),
(@english_course_id, 'Week 30: Reported Speech Basics', 'Say vs Tell, tense changes', 30, 340),
(@english_course_id, 'Week 31: Advanced Adjectives and Adverbs', 'Adjective order, adverb formation', 31, 350),
(@english_course_id, 'Week 32: Phrasal Verbs Level 1', 'Common phrasal verbs, separable/inseparable', 32, 360),
(@english_course_id, 'Week 33: Complex Sentence Structure', 'Subordinate clauses, relative pronouns', 33, 370),
(@english_course_id, 'Week 34: Articles and Determiners', 'Advanced article usage, quantifiers', 34, 380),
(@english_course_id, 'Week 35: Gerunds and Infinitives', 'Verb patterns, gerund vs infinitive', 35, 390),
(@english_course_id, 'Week 36: Social Interactions', 'Making friends, social conventions', 36, 400),
(@english_course_id, 'Week 37: Academic Discussions', 'Expressing opinions, agreeing/disagreeing', 37, 410),
(@english_course_id, 'Week 38: Professional Communication', 'Business vocabulary, formal presentations', 38, 420),
(@english_course_id, 'Week 39: Current Events and News', 'News vocabulary, present perfect continuous', 39, 430),
(@english_course_id, 'Week 40: Science and Innovation', 'Scientific vocabulary, process description', 40, 440),
(@english_course_id, 'Week 41: Arts and Culture', 'Cultural vocabulary, artistic expression', 41, 450),
(@english_course_id, 'Week 42: Psychology and Behavior', 'Psychology vocabulary, human behavior', 42, 460),
(@english_course_id, 'Week 43: Global Issues', 'World problems, solutions and suggestions', 43, 470),
(@english_course_id, 'Week 44: Literature and Reading', 'Literary devices, reading analysis', 44, 480),
(@english_course_id, 'Week 45: Advanced Listening Skills', 'Accent recognition, inference skills', 45, 490),
(@english_course_id, 'Week 46: Advanced Conditionals', 'Second and third conditionals, mixed conditionals', 46, 500),
(@english_course_id, 'Week 47: Complex Passive Structures', 'Passive with modals, passive infinitives', 47, 510),
(@english_course_id, 'Week 48: Advanced Reported Speech', 'Complex reporting, reporting questions', 48, 520),
(@english_course_id, 'Week 49: Subjunctive and Wishes', 'Wish structures, if only expressions', 49, 530),
(@english_course_id, 'Week 50: Advanced Phrasal Verbs', 'Academic phrasal verbs, business phrasal verbs', 50, 540),
(@english_course_id, 'Week 51: Essay Writing Fundamentals', 'Essay structure, thesis statements', 51, 550),
(@english_course_id, 'Week 52: Argumentative Writing', 'Argument structure, evidence and examples', 52, 560),
(@english_course_id, 'Week 53: Research and Citations', 'Research methods, source evaluation', 53, 570),
(@english_course_id, 'Week 54: Creative Writing', 'Narrative techniques, character development', 54, 580),
(@english_course_id, 'Week 55: Business Writing', 'Business correspondence, report writing', 55, 590),
(@english_course_id, 'Week 56: Critical Analysis', 'Analytical thinking, text analysis', 56, 600),
(@english_course_id, 'Week 57: Advanced Vocabulary', 'Academic word lists, collocations', 57, 610),
(@english_course_id, 'Week 58: Pronunciation and Intonation', 'Advanced pronunciation, stress patterns', 58, 620),
(@english_course_id, 'Week 59: Integrated Skills Practice', 'Skills integration, task-based learning', 59, 630),
(@english_course_id, 'Week 60: Secondary Level Assessment', 'Comprehensive review, skill evaluation', 60, 640),

-- Weeks 61-100: University Level (Academic/TOEFL/IELTS)
(@english_course_id, 'Week 61: Academic Writing Conventions', 'Academic register, formal tone', 61, 650),
(@english_course_id, 'Week 62: Research Methodology', 'Research design, data collection', 62, 660),
(@english_course_id, 'Week 63: Literature Review Writing', 'Source synthesis, critical evaluation', 63, 670),
(@english_course_id, 'Week 64: Data Analysis and Presentation', 'Statistical language, graph description', 64, 680),
(@english_course_id, 'Week 65: Advanced Argumentation', 'Logical reasoning, fallacy identification', 65, 690),
(@english_course_id, 'Week 66: Dissertation Planning', 'Thesis proposal, chapter structure', 66, 700),
(@english_course_id, 'Week 67: Academic Presentations', 'Conference presentations, visual aids', 67, 710),
(@english_course_id, 'Week 68: Peer Review Process', 'Manuscript evaluation, constructive feedback', 68, 720),
(@english_course_id, 'Week 69: Grant Writing', 'Proposal structure, budget justification', 69, 730),
(@english_course_id, 'Week 70: Cross-Cultural Academic Communication', 'Cultural sensitivity, international collaboration', 70, 740),
(@english_course_id, 'Week 71: Advanced Research Writing', 'Methodology sections, results reporting', 71, 750),
(@english_course_id, 'Week 72: Academic Vocabulary Mastery', 'Discipline-specific terms, academic word families', 72, 760),
(@english_course_id, 'Week 73: Citation and Referencing', 'Advanced citation styles, plagiarism avoidance', 73, 770),
(@english_course_id, 'Week 74: Abstract and Summary Writing', 'Concise writing, key information extraction', 74, 780),
(@english_course_id, 'Week 75: Academic Publication', 'Journal selection, manuscript preparation', 75, 790),
(@english_course_id, 'Week 76: TOEFL Reading Strategies', 'Reading comprehension, time management', 76, 800),
(@english_course_id, 'Week 77: TOEFL Listening Mastery', 'Academic lectures, note-taking systems', 77, 810),
(@english_course_id, 'Week 78: TOEFL Speaking Excellence', 'Independent speaking, integrated speaking', 78, 820),
(@english_course_id, 'Week 79: TOEFL Writing Mastery', 'Independent essays, integrated writing', 79, 830),
(@english_course_id, 'Week 80: IELTS Academic Preparation', 'Test format familiarization, band score requirements', 80, 840),
(@english_course_id, 'Week 81: Advanced Academic Listening', 'Lecture comprehension, seminar participation', 81, 850),
(@english_course_id, 'Week 82: Complex Text Analysis', 'Dense academic texts, critical reading', 82, 860),
(@english_course_id, 'Week 83: Fluency and Accuracy', 'Speaking fluency, grammatical accuracy', 83, 870),
(@english_course_id, 'Week 84: Advanced Writing Techniques', 'Sophisticated structures, cohesive devices', 84, 880),
(@english_course_id, 'Week 85: Test-Taking Strategies', 'Time management, stress management', 85, 890),
(@english_course_id, 'Week 86: Academic Discourse Analysis', 'Discourse markers, coherence patterns', 86, 900),
(@english_course_id, 'Week 87: Professional English', 'Business communication, professional presentations', 87, 910),
(@english_course_id, 'Week 88: Cross-Cultural Communication', 'Cultural competence, international business', 88, 920),
(@english_course_id, 'Week 89: Specialized Vocabulary', 'Field-specific terminology, technical communication', 89, 930),
(@english_course_id, 'Week 90: Advanced Language Testing', 'Assessment preparation, performance optimization', 90, 940),
(@english_course_id, 'Week 91: Idiomatic Expressions Mastery', 'Native-like expressions, cultural idioms', 91, 950),
(@english_course_id, 'Week 92: Advanced Pronunciation', 'Native-like pronunciation, accent reduction', 92, 960),
(@english_course_id, 'Week 93: Literary Analysis', 'Literary criticism, analytical writing', 93, 970),
(@english_course_id, 'Week 94: Media and Communication', 'Media literacy, communication theory', 94, 980),
(@english_course_id, 'Week 95: Philosophy and Abstract Thinking', 'Abstract concepts, philosophical discourse', 95, 990),
(@english_course_id, 'Week 96: TOEFL/IELTS Final Preparation', 'Comprehensive review, practice tests', 96, 1000),
(@english_course_id, 'Week 97: Native Speaker Interaction', 'Authentic communication, cultural nuances', 97, 1010),
(@english_course_id, 'Week 98: Independent Learning Strategies', 'Self-directed learning, resource utilization', 98, 1020),
(@english_course_id, 'Week 99: Professional Portfolio', 'Portfolio development, achievement documentation', 99, 1030),
(@english_course_id, 'Week 100: Mastery Assessment and Certification', 'Comprehensive evaluation, certification preparation', 100, 1040);

-- ==========================================
-- STEP 2: CREATE LESSONS FOR EACH UNIT
-- ==========================================

-- Create vocabulary lessons for each unit
INSERT INTO lessons (unit_id, name, description, lesson_type, order_index, xp_reward)
SELECT 
  u.id,
  'Vocabulary',
  CONCAT('Essential vocabulary for ', u.name),
  'vocabulary',
  1,
  15
FROM units u
WHERE u.course_id = @english_course_id;

-- Create phrases lessons for each unit
INSERT INTO lessons (unit_id, name, description, lesson_type, order_index, xp_reward)
SELECT 
  u.id,
  'Phrases',
  CONCAT('Common phrases for ', u.name),
  'phrases',
  2,
  15
FROM units u
WHERE u.course_id = @english_course_id;

-- Create grammar lessons for each unit  
INSERT INTO lessons (unit_id, name, description, lesson_type, order_index, xp_reward)
SELECT 
  u.id,
  'Grammar',
  CONCAT('Grammar rules for ', u.name),
  'grammar',
  3,
  20
FROM units u
WHERE u.course_id = @english_course_id;

-- Create exercises lessons for each unit
INSERT INTO lessons (unit_id, name, description, lesson_type, order_index, xp_reward)
SELECT 
  u.id,
  'Exercises',
  CONCAT('Practice exercises for ', u.name),
  'exercises',
  4,
  25
FROM units u
WHERE u.course_id = @english_course_id;

-- ==========================================
-- STEP 3: ADD CONTENT TO LESSONS
-- ==========================================

-- Week 1 Vocabulary: ABCs and Basic Sounds
INSERT INTO vocabulary (lesson_id, word, translation, pronunciation, word_type, difficulty_level, example_sentence, example_translation, order_index)
SELECT 
  l.id,
  word_data.word,
  word_data.translation,
  word_data.pronunciation,
  word_data.word_type,
  'beginner',
  word_data.example,
  word_data.example_translation,
  word_data.order_idx
FROM lessons l
JOIN units u ON l.unit_id = u.id
CROSS JOIN (
  SELECT 'apple' as word, 'manzana' as translation, '/ˈæpəl/' as pronunciation, 'noun' as word_type, 'I eat an apple.' as example, 'Yo como una manzana.' as example_translation, 1 as order_idx
  UNION ALL SELECT 'ball', 'pelota', '/bɔːl/', 'noun', 'The ball is red.', 'La pelota es roja.', 2
  UNION ALL SELECT 'cat', 'gato', '/kæt/', 'noun', 'The cat is sleeping.', 'El gato está durmiendo.', 3
  UNION ALL SELECT 'dog', 'perro', '/dɔːɡ/', 'noun', 'My dog is friendly.', 'Mi perro es amigable.', 4
  UNION ALL SELECT 'elephant', 'elefante', '/ˈɛlɪfənt/', 'noun', 'The elephant is big.', 'El elefante es grande.', 5
  UNION ALL SELECT 'fish', 'pez', '/fɪʃ/', 'noun', 'Fish live in water.', 'Los peces viven en el agua.', 6
  UNION ALL SELECT 'green', 'verde', '/ɡriːn/', 'adjective', 'The grass is green.', 'La hierba es verde.', 7
  UNION ALL SELECT 'house', 'casa', '/haʊs/', 'noun', 'My house is big.', 'Mi casa es grande.', 8
  UNION ALL SELECT 'ice', 'hielo', '/aɪs/', 'noun', 'Ice is cold.', 'El hielo está frío.', 9
  UNION ALL SELECT 'jump', 'saltar', '/dʒʌmp/', 'verb', 'I can jump high.', 'Puedo saltar alto.', 10
) as word_data
WHERE u.name LIKE 'Week 1:%' AND l.lesson_type = 'vocabulary' AND u.course_id = @english_course_id;

-- Week 1 Phrases: Basic Greetings
INSERT INTO phrases (lesson_id, phrase, translation, pronunciation, context, difficulty_level, order_index)
SELECT 
  l.id,
  phrase_data.phrase,
  phrase_data.translation,
  phrase_data.pronunciation,
  phrase_data.context,
  'beginner',
  phrase_data.order_idx
FROM lessons l
JOIN units u ON l.unit_id = u.id
CROSS JOIN (
  SELECT 'Hello' as phrase, 'Hola' as translation, '/həˈloʊ/' as pronunciation, 'greeting' as context, 1 as order_idx
  UNION ALL SELECT 'Good morning', 'Buenos días', '/ɡʊd ˈmɔːrnɪŋ/', 'greeting', 2
  UNION ALL SELECT 'Thank you', 'Gracias', '/θæŋk juː/', 'politeness', 3
  UNION ALL SELECT 'Please', 'Por favor', '/pliːz/', 'politeness', 4
  UNION ALL SELECT 'Excuse me', 'Disculpe', '/ɪkˈskjuːz miː/', 'politeness', 5
  UNION ALL SELECT 'How are you?', '¿Cómo estás?', '/haʊ ɑːr juː/', 'greeting', 6
  UNION ALL SELECT 'What is your name?', '¿Cuál es tu nombre?', '/wʌt ɪz jʊr neɪm/', 'introduction', 7
  UNION ALL SELECT 'Nice to meet you', 'Mucho gusto', '/naɪs tuː miːt juː/', 'introduction', 8
  UNION ALL SELECT 'Goodbye', 'Adiós', '/ɡʊdˈbaɪ/', 'farewell', 9
  UNION ALL SELECT 'See you later', 'Hasta luego', '/siː juː ˈleɪtər/', 'farewell', 10
) as phrase_data
WHERE u.name LIKE 'Week 1:%' AND l.lesson_type = 'phrases' AND u.course_id = @english_course_id;

-- Week 1 Grammar: Present Simple - To Be
INSERT INTO grammar_rules (lesson_id, title, explanation, examples, difficulty_level, order_index)
SELECT 
  l.id,
  'Present Simple - To Be',
  'The verb "to be" is used to describe people, places, and things. Forms: I am, You are, He/She/It is, We are, They are',
  '["I am happy", "You are tall", "She is a teacher", "We are students"]',
  'beginner',
  1
FROM lessons l
JOIN units u ON l.unit_id = u.id
WHERE u.name LIKE 'Week 1:%' AND l.lesson_type = 'grammar' AND u.course_id = @english_course_id;

-- Week 1 Exercises: Basic Questions
INSERT INTO exercises (lesson_id, question, exercise_type, options, correct_answer, order_index, points)
SELECT 
  l.id,
  'Complete: I ___ a student.',
  'multiple_choice',
  '["am", "is", "are", "be"]',
  'am',
  1,
  10
FROM lessons l
JOIN units u ON l.unit_id = u.id
WHERE u.name LIKE 'Week 1:%' AND l.lesson_type = 'exercises' AND u.course_id = @english_course_id;

-- Sample content for Week 2: Numbers and Colors
INSERT INTO vocabulary (lesson_id, word, translation, pronunciation, word_type, difficulty_level, example_sentence, example_translation, order_index)
SELECT 
  l.id,
  word_data.word,
  word_data.translation,
  word_data.pronunciation,
  word_data.word_type,
  'beginner',
  word_data.example,
  word_data.example_translation,
  word_data.order_idx
FROM lessons l
JOIN units u ON l.unit_id = u.id
CROSS JOIN (
  SELECT 'one' as word, 'uno' as translation, '/wʌn/' as pronunciation, 'number' as word_type, 'I have one book.' as example, 'Tengo un libro.' as example_translation, 1 as order_idx
  UNION ALL SELECT 'two', 'dos', '/tuː/', 'number', 'Two cats are playing.', 'Dos gatos están jugando.', 2
  UNION ALL SELECT 'three', 'tres', '/θriː/', 'number', 'I see three birds.', 'Veo tres pájaros.', 3
  UNION ALL SELECT 'red', 'rojo', '/rɛd/', 'adjective', 'The apple is red.', 'La manzana es roja.', 4
  UNION ALL SELECT 'blue', 'azul', '/bluː/', 'adjective', 'The sky is blue.', 'El cielo es azul.', 5
  UNION ALL SELECT 'yellow', 'amarillo', '/ˈjɛloʊ/', 'adjective', 'The sun is yellow.', 'El sol es amarillo.', 6
  UNION ALL SELECT 'black', 'negro', '/blæk/', 'adjective', 'The night is black.', 'La noche es negra.', 7
  UNION ALL SELECT 'white', 'blanco', '/waɪt/', 'adjective', 'Snow is white.', 'La nieve es blanca.', 8
  UNION ALL SELECT 'big', 'grande', '/bɪɡ/', 'adjective', 'The elephant is big.', 'El elefante es grande.', 9
  UNION ALL SELECT 'small', 'pequeño', '/smɔːl/', 'adjective', 'The mouse is small.', 'El ratón es pequeño.', 10
) as word_data
WHERE u.name LIKE 'Week 2:%' AND l.lesson_type = 'vocabulary' AND u.course_id = @english_course_id;

COMMIT;