-- Add cefr_level column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS cefr_level VARCHAR(10) DEFAULT 'A1';

-- Update existing courses to have a default CEFR level
UPDATE courses SET cefr_level = 'A1' WHERE cefr_level IS NULL OR cefr_level = '';

-- Show the updated table structure
DESCRIBE courses;