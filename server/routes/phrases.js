const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET /api/phrases - Get all phrases or filter by lesson_id
router.get('/', async (req, res) => {
  try {
    const { lesson_id } = req.query;
    let rows;

    if (lesson_id) {
      console.log('API: Fetching phrases for lesson_id:', lesson_id);
      [rows] = await promisePool.execute(
        `
        SELECT 
          p.id,
          p.lesson_id,
          p.phrase,
          p.translation,
          p.pronunciation,
          p.context,
          p.difficulty_level,
          p.order_index,
          l.name as lesson_name
        FROM phrases p
        LEFT JOIN lessons l ON p.lesson_id = l.id
        WHERE p.lesson_id = ?
        ORDER BY p.order_index, p.phrase
        `,
        [lesson_id]
      );
    } else {
      console.log('API: Fetching all phrases');
      [rows] = await promisePool.execute(`
        SELECT 
          p.id,
          p.lesson_id,
          p.phrase,
          p.translation,
          p.pronunciation,
          p.context,
          p.difficulty_level,
          p.order_index,
          l.name as lesson_name
        FROM phrases p
        LEFT JOIN lessons l ON p.lesson_id = l.id
        ORDER BY p.order_index, p.phrase
      `);
    }
    
    console.log(`Found ${rows.length} phrases`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching phrases:', error);
    res.status(500).json({ 
      error: 'Failed to fetch phrases',
      message: error.message 
    });
  }
});

// POST /api/phrases - Add a new phrase
router.post('/', async (req, res) => {
  try {
    const { lesson_id, phrase, translation, pronunciation, context, difficulty_level, order_index } = req.body;
    console.log('API: Adding new phrase:', { lesson_id, phrase, translation, context });
    
    // Validate required fields
    if (!phrase || !translation) {
      return res.status(400).json({ 
        error: 'Phrase and translation are required fields' 
      });
    }
    
    // Insert new phrase
    const [result] = await promisePool.execute(
      'INSERT INTO phrases (lesson_id, phrase, translation, pronunciation, context, difficulty_level, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [lesson_id || null, phrase, translation, pronunciation || '', context || '', difficulty_level || 'beginner', order_index || 0]
    );
    
    console.log('✅ Phrase added successfully with ID:', result.insertId);
    
    res.status(201).json({
      success: true,
      message: 'Phrase added successfully',
      id: result.insertId
    });
    
  } catch (error) {
    console.error('Error adding phrase:', error);
    res.status(500).json({
      error: 'Failed to add phrase',
      message: error.message
    });
  }
});

module.exports = router;