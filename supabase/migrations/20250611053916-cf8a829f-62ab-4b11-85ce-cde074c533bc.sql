
-- Clear all existing vocabulary, phrases, grammar rules, and exercises
DELETE FROM vocabulary;
DELETE FROM phrases;
DELETE FROM grammar_rules;
DELETE FROM exercises;

-- Also clear lessons and units to start fresh
DELETE FROM lessons;
DELETE FROM units;
