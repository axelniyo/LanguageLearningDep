const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

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

// POST /api/units - Add a new unit
router.post('/', async (req, res) => {
  try {
    const { name, description, course_id, order_index, xp_reward } = req.body;
    console.log('API: Adding new unit:', { name, description, course_id, order_index, xp_reward });
    
    // Validate required fields
    if (!name || !course_id) {
      return res.status(400).json({ 
        error: 'Name and course_id are required fields' 
      });
    }
    
    // Insert new unit
    const [result] = await promisePool.execute(
      'INSERT INTO units (name, description, course_id, order_index, xp_reward) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', course_id, order_index || 0, xp_reward || 50]
    );
    
    console.log('✅ Unit added successfully with ID:', result.insertId);
    
    res.status(201).json({
      success: true,
      message: 'Unit added successfully',
      id: result.insertId,
      unit: {
        id: result.insertId,
        name,
        description: description || '',
        course_id,
        order_index: order_index || 0,
        xp_reward: xp_reward || 50
      }
    });
    
  } catch (error) {
    console.error('Error adding unit:', error);
    res.status(500).json({
      error: 'Failed to add unit',
      message: error.message
    });
  }
});

module.exports = router;