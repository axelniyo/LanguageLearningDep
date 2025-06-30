-- Create the database
CREATE DATABASE IF NOT EXISTS language_learning_app;
USE language_learning_app;

-- 1. Languages table
CREATE TABLE languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    flag_emoji VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Courses table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    language_id INT NOT NULL,
    level_requirement INT DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- 3. Units table
CREATE TABLE units (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    course_id INT NOT NULL,
    order_index INT DEFAULT 0,
    xp_reward INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 4. Lessons table
CREATE TABLE lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_id INT NOT NULL,
    lesson_type ENUM('vocabulary', 'phrases', 'grammar', 'exercises') DEFAULT 'vocabulary',
    order_index INT DEFAULT 0,
    xp_reward INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- 5. Vocabulary table
CREATE TABLE vocabulary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    word VARCHAR(255) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    pronunciation VARCHAR(255),
    audio_url VARCHAR(500),
    example_sentence TEXT,
    example_translation TEXT,
    word_type VARCHAR(50),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 6. Phrases table
CREATE TABLE phrases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    phrase TEXT NOT NULL,
    translation TEXT NOT NULL,
    pronunciation VARCHAR(500),
    audio_url VARCHAR(500),
    context VARCHAR(255),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 7. Grammar rules table
CREATE TABLE grammar_rules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    examples JSON,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 8. Exercises table
CREATE TABLE exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    exercise_type VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options JSON,
    explanation TEXT,
    hints JSON,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    points INT DEFAULT 10,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 9. Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  xp INT DEFAULT 0,
  level INT DEFAULT 1,
  streak_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
-- 10. User enrollments table
CREATE TABLE user_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    current_unit_id INT,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (current_unit_id) REFERENCES units(id) ON DELETE SET NULL,
    UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- 11. User progress table
CREATE TABLE user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    attempts INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_progress (user_id, lesson_id)
);

-- Insert sample languages
INSERT INTO languages (name, code, flag_emoji, description) VALUES
('Spanish', 'es', '🇪🇸', 'Learn Spanish - spoken by over 500 million people worldwide'),
('French', 'fr', '🇫🇷', 'Master French - the language of love and culture'),
('German', 'de', '🇩🇪', 'Learn German - the language of innovation and philosophy'),
('Italian', 'it', '🇮🇹', 'Speak Italian - the language of art and cuisine'),
('Portuguese', 'pt', '🇧🇷', 'Learn Portuguese - spoken in Brazil and Portugal');

-- Insert sample courses
INSERT INTO courses (name, description, language_id, level_requirement, order_index) VALUES
('Spanish - Complete Course', 'Master Spanish from beginner to advanced level', 1, 1, 1),
('French - Complete Course', 'Master French from beginner to advanced level', 2, 1, 1),
('German - Complete Course', 'Master German from beginner to advanced level', 3, 1, 1),
('Italian - Complete Course', 'Master Italian from beginner to advanced level', 4, 1, 1),
('Portuguese - Complete Course', 'Master Portuguese from beginner to advanced level', 5, 1, 1);
