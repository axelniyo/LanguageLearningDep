const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET /api/courses - Get all courses with language info
router.get('/', async (req, res) => {
  try {
    console.log('API: Fetching all courses');
    
    const [rows] = await promisePool.execute(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.level_requirement,
        c.order_index,
        c.created_at,
        l.id as language_id,
        l.name as language_name,
        l.code as language_code,
        l.flag_emoji as language_flag_emoji,
        l.description as language_description
      FROM courses c
      JOIN languages l ON c.language_id = l.id
      ORDER BY l.name, c.order_index
    `);
    
    // Transform data to match frontend format
    const courses = rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      level_requirement: row.level_requirement,
      order_index: row.order_index,
      created_at: row.created_at,
      language: {
        id: row.language_id.toString(),
        name: row.language_name,
        code: row.language_code,
        flag_emoji: row.language_flag_emoji,
        description: row.language_description
      }
    }));
    
    console.log(`Found ${courses.length} courses`);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch courses',
      message: error.message 
    });
  }
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('API: Fetching course with ID:', id);
    
    const [rows] = await promisePool.execute(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.level_requirement,
        c.order_index,
        c.created_at,
        l.id as language_id,
        l.name as language_name,
        l.code as language_code,
        l.flag_emoji as language_flag_emoji,
        l.description as language_description
      FROM courses c
      JOIN languages l ON c.language_id = l.id
      WHERE c.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const row = rows[0];
    const course = {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      level_requirement: row.level_requirement,
      order_index: row.order_index,
      created_at: row.created_at,
      language: {
        id: row.language_id.toString(),
        name: row.language_name,
        code: row.language_code,
        flag_emoji: row.language_flag_emoji,
        description: row.language_description
      }
    };
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ 
      error: 'Failed to fetch course',
      message: error.message 
    });
  }
});

// GET /api/courses/:courseId/units - Get units for a course with lessons
router.get('/:courseId/units', async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log('API: Fetching units for course:', courseId);
    
    // Get units
    const [unitRows] = await promisePool.execute(`
      SELECT id, name, description, order_index, xp_reward, created_at
      FROM units 
      WHERE course_id = ?
      ORDER BY order_index
    `, [courseId]);
    
    if (unitRows.length === 0) {
      console.log('No units found for course:', courseId);
      return res.json([]);
    }
    
    // Get lessons for each unit
    const units = [];
    for (const unit of unitRows) {
      const [lessonRows] = await promisePool.execute(`
        SELECT id, name, description, lesson_type, order_index, xp_reward, created_at
        FROM lessons 
        WHERE unit_id = ?
        ORDER BY order_index
      `, [unit.id]);
      
      units.push({
        id: unit.id.toString(),
        name: unit.name,
        description: unit.description,
        order_index: unit.order_index,
        xp_reward: unit.xp_reward,
        created_at: unit.created_at,
        lessons: lessonRows.map(lesson => ({
          id: lesson.id.toString(),
          name: lesson.name,
          description: lesson.description,
          lesson_type: lesson.lesson_type,
          order_index: lesson.order_index,
          xp_reward: lesson.xp_reward,
          created_at: lesson.created_at
        }))
      });
    }
    
    console.log(`Found ${units.length} units with ${units.reduce((sum, u) => sum + u.lessons.length, 0)} total lessons`);
    res.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ 
      error: 'Failed to fetch units',
      message: error.message 
    });
  }
});

// POST /api/courses - Add a new course
router.post('/', async (req, res) => {
  try {
    console.log('Backend: Received request body:', req.body);
    const { name, description, language_id, cefr_level, level_requirement } = req.body;
    console.log('Backend: Extracted fields:', { name, description, language_id, cefr_level, level_requirement });
    
    // Validate required fields
    if (!name || !language_id) {
      console.log('Backend: Validation failed - missing required fields');
      return res.status(400).json({ 
        error: 'Name and language_id are required fields',
        received: { name, language_id, cefr_level }
      });
    }
    
    // Validate language_id exists
    const [languageCheck] = await promisePool.execute(
      'SELECT id FROM languages WHERE id = ?',
      [language_id]
    );
    
    if (languageCheck.length === 0) {
      console.log('Backend: Language validation failed - language not found:', language_id);
      return res.status(400).json({ 
        error: 'Invalid language_id - language does not exist',
        language_id: language_id 
      });
    }
    
    console.log('Backend: Attempting to insert course...');
    
    // First, check if cefr_level column exists
    try {
      const [columnCheck] = await promisePool.execute(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'courses' AND COLUMN_NAME = 'cefr_level'"
      );
      
      let result;
      if (columnCheck.length > 0) {
        // cefr_level column exists, use it
        console.log('Backend: Using cefr_level column');
        [result] = await promisePool.execute(
          'INSERT INTO courses (name, description, language_id, cefr_level, level_requirement) VALUES (?, ?, ?, ?, ?)',
          [name, description || '', language_id, cefr_level || 'A1', level_requirement || 1]
        );
      } else {
        // cefr_level column doesn't exist, insert without it
        console.log('Backend: cefr_level column not found, inserting without it');
        [result] = await promisePool.execute(
          'INSERT INTO courses (name, description, language_id, level_requirement) VALUES (?, ?, ?, ?)',
          [name, description || '', language_id, level_requirement || 1]
        );
      }
      
      console.log('✅ Backend: Course added successfully with ID:', result.insertId);
      
      res.status(201).json({
        success: true,
        message: 'Course added successfully',
        id: result.insertId,
        course: {
          id: result.insertId,
          name,
          description: description || '',
          language_id,
          cefr_level: cefr_level || 'A1',
          level_requirement: level_requirement || 1
        }
      });
      
    } catch (insertError) {
      console.error('❌ Backend: Insert error:', insertError);
      throw insertError;
    }
    
  } catch (error) {
    console.error('❌ Backend: Error adding course:', error);
    console.error('❌ Backend: Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      error: 'Failed to add course',
      message: error.message,
      details: error.code ? `Database error: ${error.code}` : 'Unknown error'
    });
  }
});

module.exports = router;